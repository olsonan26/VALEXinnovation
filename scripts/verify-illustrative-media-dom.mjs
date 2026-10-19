// Tests player lifecycle using a simulated media element, not actual video playback.
// Usage: node scripts/verify-illustrative-media-dom.mjs <folder containing node_modules/jsdom>
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {renderPage} from '../content/pages.mjs';
const require=createRequire(import.meta.url),{JSDOM}=require(require.resolve('jsdom',{paths:[process.argv[2]||process.cwd()]})),{buildSync}=require('esbuild');
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const config={alignment:{src:'/assets/demo/alignment.mp4',captions:'/assets/demo/alignment.vtt'},differences:{src:'/assets/demo/differences.mp4',captions:null}};
const source=fs.readFileSync(path.join(root,'illustrative-ui.js'),'utf8').replace("import mediaConfig from './assets/demo/scan-videos.json' with {type:'json'};",`const mediaConfig=${JSON.stringify(config)};`);
const code=buildSync({stdin:{contents:source,resolveDir:root},bundle:true,format:'iife',write:false,target:'es2022'}).outputFiles[0].text;
function setup({reduced=false,rejectPlay=false}={}){
 const dom=new JSDOM(renderPage('/explorer/'),{url:'https://example.com/explorer/',runScripts:'outside-only'}),{window}=dom,d=window.document;
 let plays=0,pauses=0,delay=null;
 window.matchMedia=()=>({matches:reduced});window.HTMLElement.prototype.scrollIntoView=function(){};
 window.HTMLMediaElement.prototype.pause=function(){pauses++;};window.HTMLMediaElement.prototype.load=function(){};
 window.HTMLMediaElement.prototype.play=function(){plays++;return rejectPlay?Promise.reject(new Error('Playback denied')):Promise.resolve();};
 window.setTimeout=callback=>{delay=callback;return 1;};window.clearTimeout=()=>{delay=null;};
 window.eval(code);
 return {dom,window,d,click:id=>d.getElementById(id).click(),plays:()=>plays,pauses:()=>pauses,delay:()=>delay?.()};
}
let env=setup();env.click('find-out');
assert.equal(env.d.getElementById('fit-video').getAttribute('src'),config.alignment.src);
assert.equal(env.d.querySelector('#fit-video track').getAttribute('src'),config.alignment.captions);
assert.equal(env.plays(),1);assert.equal(env.d.getElementById('fit-result').hidden,true);
env.d.getElementById('fit-video').dispatchEvent(new env.window.Event('ended'));
assert.equal(env.d.getElementById('fit-result').hidden,false);
env.click('fit-another');assert.equal(env.d.getElementById('fit-video').getAttribute('src'),null);assert.equal(env.d.getElementById('fit-reveal').hidden,true);
env.click('find-out');assert.equal(env.d.getElementById('fit-video').getAttribute('src'),config.differences.src);
env.click('fit-skip');assert.equal(env.d.getElementById('fit-result').dataset.story,'differences');assert.equal(env.d.getElementById('fit-result').hidden,false);env.dom.window.close();
console.log('PASS: correct clip and captions for each story; results wait for completion or Skip; changing profile clears previous playback.');

env=setup({reduced:true});env.click('find-out');assert.equal(env.plays(),0);env.click('fit-play');assert.equal(env.plays(),1);env.dom.window.close();
console.log('PASS: reduced-motion preference requires explicit Play; Skip remains available.');

env=setup({rejectPlay:true});env.click('find-out');await new Promise(resolve=>setImmediate(resolve));assert.ok(env.d.getElementById('fit-media-status').textContent.includes('Press Play'));assert.equal(env.d.getElementById('fit-result').hidden,true);env.click('fit-skip');assert.equal(env.d.getElementById('fit-result').hidden,false);env.dom.window.close();
console.log('PASS: blocked playback leaves explicit Play and Skip choices.');

env=setup();env.click('find-out');env.d.getElementById('fit-video').dispatchEvent(new env.window.Event('error'));assert.equal(env.d.getElementById('fit-result').hidden,false);assert.ok(env.d.getElementById('fit-media-status').textContent.includes('could not play'));env.dom.window.close();
env=setup();env.click('find-out');env.delay();assert.equal(env.d.getElementById('fit-result').hidden,false);assert.ok(env.d.getElementById('fit-media-status').textContent.includes('longer to load'));env.dom.window.close();
console.log('PASS: media error and delayed loading fall back to the selected scripted result.');
