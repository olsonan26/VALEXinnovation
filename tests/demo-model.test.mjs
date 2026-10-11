import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {comparePair,ProfileInputError} from '../demo-model.js';
import {identityFor,compareIdentities} from '../lib/compatibility.js';
const a={fullName:'Amelia Rose Morgan',calledName:'Amelia Morgan',birthdate:'1970-02-01'};
const b={fullName:'Oliver James Lewis',calledName:'Oliver Lewis',birthdate:'1985-07-12'};
const canonical=(input,id)=>identityFor({id,FullName:input.fullName,CalledName:input.calledName||input.fullName,txtBirthdate:input.birthdate.split('-').reverse().join('-')});
test('standalone calculation files preserve the approved source hashes',async()=>{
  const provenance=JSON.parse(await fs.readFile(new URL('../docs/model-provenance.json',import.meta.url),'utf8'));
  for(const file of provenance.files){
    const bytes=await fs.readFile(new URL('../'+file.path,import.meta.url));
    assert.equal(createHash('sha256').update(bytes).digest('hex'),file.sha256);
  }
  const result=comparePair(a,b);
  assert.deepEqual(result.forward,{whole:78.7,called:82,overall:69.5494560272934});
  assert.deepEqual(result.reverse,{whole:80.3,called:73.75,overall:71.22244313874148});
});
test('both perspectives and all displayed scores match the canonical software calculation',()=>{
  for(const [first,second] of [[a,b],[{fullName:'Alex Jordan Smith',calledName:'Alex Smith',birthdate:'1970-01-29'},{fullName:'Sarah Jones',calledName:'Sarah',birthdate:'1991-03-05'}]]){
    const result=comparePair(first,second),expected=compareIdentities(canonical(first,'a'),canonical(second,'b'));
    for(const direction of ['forward','reverse']){assert.equal(result[direction].whole,expected[direction].nameCentered.whole);assert.equal(result[direction].called,expected[direction].nameCentered.called);assert.equal(result[direction].overall,expected[direction].overall);}
    assert.equal(result.version,expected.version);
  }
});
test('swapping people swaps the perspectives and does not modify entered records',()=>{
  const before=JSON.stringify([a,b]),ab=comparePair(a,b),ba=comparePair(b,a);
  assert.deepEqual(ab.forward,ba.reverse);assert.deepEqual(ab.reverse,ba.forward);assert.equal(JSON.stringify([a,b]),before);
  assert.notEqual(ab.forward.overall,ab.reverse.overall);
});
test('an optional everyday name defaults to the full name',()=>{
  const result=comparePair({...a,calledName:''},b),explicit=comparePair({...a,calledName:a.fullName},b);
  assert.deepEqual(result,explicit);
});
test('incomplete, impossible and future dates fail before a comparison can be displayed',()=>{
  for(const birthdate of ['', '1970-02-', '1970-02-30', '1971-02-29','2999-01-01','0999-01-01'])assert.throws(()=>comparePair({...a,birthdate},b),error=>error instanceof ProfileInputError&&error.field==='a-dob');
  assert.doesNotThrow(()=>comparePair({...a,birthdate:'2000-02-29'},b));
});
test('unsupported names and markup receive field-specific errors',()=>{
  for(const fullName of ['', 'A','<script>alert(1)</script>', 'Алекс Смит', "O'Connell",'Alex2 Smith'])assert.throws(()=>comparePair({...a,fullName},b),error=>error instanceof ProfileInputError&&error.field==='a-name');
  assert.throws(()=>comparePair(a,{...b,calledName:'<img src=x>'}),error=>error instanceof ProfileInputError&&error.field==='b-called');
  assert.doesNotThrow(()=>comparePair({...a,fullName:'Anne-Marie Smith'},b));
});
test('unavailable comparison terms remain unavailable instead of fabricated zero scores',()=>{
  const result=comparePair({fullName:'Brr Crr',calledName:'Brr',birthdate:'1980-01-01'},b);
  assert.equal(result.forward.whole,null);assert.equal(result.reverse.whole,null);assert.equal(result.forward.overall,null);
});
test('all available output scores are finite model values between zero and one hundred',()=>{
  const result=comparePair(a,b);
  for(const direction of [result.forward,result.reverse])for(const value of Object.values(direction))assert.ok(value===null||(Number.isFinite(value)&&value>=0&&value<=100));
});
