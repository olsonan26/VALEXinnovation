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
window.HTMLMediaElement.prototype.pause=function(){};window.HTMLMediaElement.prototype.load=function(){};
window.eval(fs.readFileSync(new URL('../dist/demo.js',import.meta.url),'utf8'));
assert.equal(doc.getElementById('pair-results').hidden,true);
assert.equal(doc.getElementById('real-comparison').open,false);
assert.equal(doc.getElementById('fit-result').hidden,true);
assert.equal(scrolls,0);
doc.getElementById('find-out').click();
assert.equal(doc.getElementById('fit-result').hidden,true);
assert.equal(doc.getElementById('fit-video').getAttribute('src'),'/assets/demo/female-green-match-web.mp4');
doc.getElementById('fit-skip').click();
assert.equal(doc.getElementById('fit-result').dataset.outcome,'alignment');
assert.equal(doc.getElementById('fit-result').hidden,false);
doc.getElementById('fit-male').checked=true;doc.getElementById('fit-male').dispatchEvent(new window.Event('change'));assert.equal(doc.getElementById('fit-reveal').hidden,true);doc.getElementById('find-out').click();assert.equal(doc.getElementById('fit-video').getAttribute('src'),'/assets/demo/green-match-scan.mp4');assert.equal(doc.getElementById('fit-result').dataset.outcome,'alignment');doc.getElementById('fit-skip').click();
doc.getElementById('fit-another').click();
assert.equal(doc.getElementById('fit-reveal').hidden,true);
assert.equal(doc.getElementById('fit-profile').value,'freya');
doc.getElementById('find-out').click();
assert.equal(doc.getElementById('fit-result').dataset.outcome,'differences');
assert.equal(doc.getElementById('fit-result').hidden,true);
assert.equal(doc.getElementById('fit-video').getAttribute('src'),'/assets/demo/female-x-no-match-web.mp4');
doc.getElementById('fit-skip').click();
assert.equal(doc.getElementById('fit-result').hidden,false);
assert.ok(!doc.querySelector('[data-fit-experience]').textContent.includes('%'));
for(const [id,clip] of [['oliver','x-no-match-scan'],['noah','green-match-scan']]){doc.getElementById('fit-profile').value=id;doc.getElementById('fit-profile').dispatchEvent(new window.Event('change'));assert.equal(doc.getElementById('fit-reveal').hidden,true);doc.getElementById('find-out').click();assert.equal(doc.getElementById('fit-video').getAttribute('src'),`/assets/demo/${clip}.mp4`);doc.getElementById('fit-skip').click();}
console.log('PASS: calculated outcomes and explicit fictional animation assignments select all four clips; profile changes clear state; mechanics stay hidden.');

doc.getElementById('real-comparison').open=true;
doc.getElementById('load-example').click();
assert.deepEqual([...doc.querySelectorAll('.overall-score strong')].map(n=>n.textContent),['69.5%','71.2%']);
console.log('PASS: separate real comparison retains canonical 69.5% and 71.2% values.');

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
