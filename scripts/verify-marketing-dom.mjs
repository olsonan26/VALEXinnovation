// Functional DOM checks, not a browser or visual/layout test.
// Run after build: node scripts/verify-marketing-dom.mjs <folder containing node_modules/jsdom>
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {JSDOM}=require(require.resolve('jsdom',{paths:[process.argv[2]||process.cwd()]}));
const home=fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
const homepage=new JSDOM(home,{url:'http://127.0.0.1:4192/'});
assert.equal(homepage.window.document.querySelectorAll('main>section').length,5);
const buttons=[...homepage.window.document.querySelectorAll('a.sp-button')];
assert.equal(buttons.length,3);
for(const button of buttons)assert.equal(button.getAttribute('href'),'/explorer/');
assert.equal(homepage.window.document.querySelectorAll('script,form,canvas,dialog').length,0);
console.log('PASS: five sections, three consistent demo links, no competing homepage widgets.');

const dom=new JSDOM(fs.readFileSync(new URL('../dist/explorer/index.html',import.meta.url),'utf8'),{url:'http://127.0.0.1:4192/explorer/',runScripts:'outside-only'});
const {window}=dom,doc=window.document;
let scrolls=0;
window.matchMedia=()=>({matches:true,addEventListener(){}});
window.HTMLElement.prototype.scrollIntoView=()=>{scrolls++;};
window.eval(fs.readFileSync(new URL('../dist/demo.js',import.meta.url),'utf8'));
assert.equal(doc.getElementById('pair-results').hidden,false);
assert.equal(doc.getElementById('pair-inputs').open,false);
assert.deepEqual([...doc.querySelectorAll('.overall-score strong')].map(n=>n.textContent),['69.5%','71.2%']);
assert.equal(scrolls,0);
console.log('PASS: fictional two-person comparison appears immediately with canonical values and no page jump.');

const a=doc.getElementById('a-name');
a.value='Changed Name';a.dispatchEvent(new window.Event('input',{bubbles:true}));
assert.equal(doc.getElementById('pair-results').hidden,true);
doc.getElementById('load-example').click();
assert.equal(doc.getElementById('pair-results').hidden,false);
assert.equal(a.value,'Amelia Rose Morgan');
console.log('PASS: edits clear stale results; the example button restores and compares the fictional profiles.');

a.value='Invalid <Name>';
doc.getElementById('pair-form').requestSubmit();
assert.equal(doc.getElementById('pair-error').hidden,false);
assert.equal(a.getAttribute('aria-invalid'),'true');
assert.equal(doc.getElementById('pair-results').hidden,true);
doc.getElementById('clear-pair').click();
assert.ok([...doc.querySelectorAll('#pair-form input')].every(n=>n.value===''));
console.log('PASS: invalid names show a field error; Clear removes pair details and old results.');

doc.getElementById('personal-example').click();
assert.equal(doc.getElementById('personal-results').hidden,false);
assert.ok(doc.getElementById('personal-result-title').textContent.includes('Amelia Morgan'));
const birthday=doc.querySelector('[name="timing-mode"][value="birthday"]');
birthday.checked=true;birthday.dispatchEvent(new window.Event('change',{bubbles:true}));
assert.equal(doc.getElementById('current-age').disabled,true);
assert.equal(doc.getElementById('personal-dob').disabled,false);
doc.getElementById('personal-dob').value='1990-01-01';
doc.getElementById('personal-form').requestSubmit();
assert.equal(doc.getElementById('annual-values').hidden,false);
doc.getElementById('personal-clear').click();
assert.equal(doc.getElementById('personal-results').hidden,true);
console.log('PASS: optional individual preview, age/birthday switching, annual values and clearing.');
window.close();homepage.window.close();
