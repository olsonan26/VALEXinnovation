import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {audioView,audioWindow} from '../signal-model.js';
const analysis=JSON.parse(fs.readFileSync(new URL('../assets/anatomy/spoken-analysis.json',import.meta.url)));
const wav=fs.readFileSync(new URL('../assets/anatomy/spoken-name.wav',import.meta.url));
let pcm,sampleRate;
for(let i=12;i+8<=wav.length;){const size=wav.readUInt32LE(i+4),type=wav.toString('ascii',i,i+4);if(type==='fmt '){assert.equal(wav.readUInt16LE(i+8),1);assert.equal(wav.readUInt16LE(i+10),1);assert.equal(wav.readUInt16LE(i+22),16);sampleRate=wav.readUInt32LE(i+12);}if(type==='data')pcm=wav.subarray(i+8,i+8+size);i+=8+size+(size%2);}
test('the visible amplitude and duration match the actual PCM audio, including silence',()=>{
 assert.equal(analysis.sampleRate,sampleRate);assert.equal(analysis.duration,pcm.length/2/sampleRate);
 const samples=Array.from({length:pcm.length/2},(_,i)=>Math.abs(pcm.readInt16LE(i*2))),peak=Math.max(...samples);
 assert.equal(analysis.amplitude.length,Math.ceil(samples.length/128));
 for(let i=0;i<analysis.amplitude.length;i++){const actual=Math.max(...samples.slice(i*128,i*128+128))/peak;assert.ok(Math.abs(actual-analysis.amplitude[i])<=.0000051,`amplitude bin ${i}`);}
});
test('zoom preserves the inspected point and clamps the visible interval at both recording edges',()=>{
 const d=analysis.duration;for(const position of [-1,0,.25,.6,d,d+1])for(const zoom of [1,2,8]){const view=audioView(d,position,zoom);assert.ok(view.start>=0&&view.end<=d+Number.EPSILON);assert.ok(view.position>=view.start&&view.position<=view.end);assert.ok(Math.abs(view.end-view.start-d/zoom)<1e-12);}
 for(const args of [[0,0,1],[1,NaN,1],[1,0,0],[1,0,Infinity]])assert.throws(()=>audioView(...args));
});
test('selected spectral windows resolve at boundaries and silence has no fabricated frequency',()=>{
 assert.equal(analysis.windows.length,Math.ceil(pcm.length/2/analysis.windowSamples));
 assert.equal(audioWindow(analysis,-1),analysis.windows[0]);assert.equal(audioWindow(analysis,analysis.duration),analysis.windows.at(-1));
 assert.notDeepEqual(audioWindow(analysis,.25).bands,audioWindow(analysis,.6).bands);
 assert.equal(audioWindow(analysis,1.2).peakHz,0);assert.deepEqual(audioWindow(analysis,1.2).bands,[0,0,0]);
 for(const window of analysis.windows){assert.ok(window.bands.every(v=>v>=0&&v<=1));if(window.level>0)assert.ok(Math.abs(window.bands.reduce((a,b)=>a+b,0)-1)<.00002);else assert.equal(window.peakHz,0);}
 assert.throws(()=>audioWindow(analysis,NaN));
});
test('a voiced window matches an independent spectral calculation from the recording',()=>{
 const offset=Math.floor(.25*sampleRate/512)*512;
 const weighted=Array.from({length:512},(_,n)=>pcm.readInt16LE((offset+n)*2)/32768*(.5-.5*Math.cos(2*Math.PI*n/511)));
 const powers=Array.from({length:256},(_,i)=>{let real=0,imaginary=0;for(let n=0;n<512;n++){const angle=2*Math.PI*(i+1)*n/512;real+=weighted[n]*Math.cos(angle);imaginary+=weighted[n]*Math.sin(angle);}return real*real+imaginary*imaginary;});
 const total=powers.reduce((a,b)=>a+b,0),expected=[0,0,0];
 powers.forEach((p,i)=>{const hz=(i+1)*sampleRate/512;expected[hz<500?0:hz<2000?1:2]+=p/total;});
 const window=audioWindow(analysis,.25);expected.forEach((p,i)=>assert.ok(Math.abs(p-window.bands[i])<.000006));
 assert.equal(window.peakHz,Math.round((powers.indexOf(Math.max(...powers))+1)*sampleRate/512));
});
