import {comparePair} from './demo-model.js';
// Fictional identities; every reveal is computed by the preserved comparison engine.
export const demoManager=Object.freeze({fullName:'Jamie Alexander Reed',calledName:'Jamie Reed',birthdate:'1978-04-16'});
const profile=(id,fullName,calledName,birthdate)=>Object.freeze({id,fullName,calledName,birthdate});
export const demoProfiles=Object.freeze([
 profile('amelia','Amelia Rose Morgan','Amelia Morgan','1990-06-18'),
 profile('freya','Freya Josephine Bell','Freya Bell','1975-01-12'),
 profile('grace','Grace Eleanor Parker','Grace Parker','1985-10-25'),
 profile('oliver','Oliver James Lewis','Oliver Lewis','1975-01-12'),
 profile('mia','Mia Charlotte Turner','Mia Turner','2000-04-12'),
 profile('zoe','Zoe Alexandra Blake','Zoe Blake','1975-01-12'),
 profile('noah','Noah Benjamin Foster','Noah Foster','2000-04-12')
]);
export const DEMO_MATCH_THRESHOLD=50;
export function classifyDemoScore(score){if(!Number.isFinite(score)||score<0||score>100)throw new Error('The comparison is unavailable.');return score<DEMO_MATCH_THRESHOLD?'differences':'alignment';}
export function getDemoProfile(id){const p=demoProfiles.find(p=>p.id===id);if(!p)throw new Error('Choose a fictional profile.');return p;}
export function nextDemoProfile(id,step=1){const index=demoProfiles.indexOf(getDemoProfile(id));return demoProfiles[(index+step%demoProfiles.length+demoProfiles.length)%demoProfiles.length];}
export function calculateDemoMatch(id){
 const p=getDemoProfile(id),comparison=comparePair(demoManager,p),score=comparison.forward.overall;
 return {profile:p,score,reverseScore:comparison.reverse.overall,outcome:classifyDemoScore(score),version:comparison.version};
}
export function getDemoStory(id){const calculated=calculateDemoMatch(id),matched=calculated.outcome==='alignment';return {...calculated,name:calculated.profile.calledName,title:matched?'Good match in this demo.':'Not a match in this demo.',summary:matched?'This fictional profile meets the demo’s match threshold when compared with Jamie Reed.':'This fictional profile falls below the demo’s match threshold when compared with Jamie Reed.',points:matched?['Calculated by the software’s existing comparison engine.','Meets the match threshold for this fictional example.']:['Calculated by the software’s existing comparison engine.','Falls below the match threshold for this fictional example.'],question:matched?'What would help this working relationship get off to a good start?':'What working differences would you want to discuss before proceeding?'};}
export function getStoryMedia(config,outcome){if(!['alignment','differences'].includes(outcome))throw new Error('Unknown result.');const media=config?.[outcome]||{};const local=(v,extension)=>typeof v==='string'&&new RegExp(`^/assets/demo/[a-zA-Z0-9_-]+\\.(?:${extension})$`).test(v)?v:null;return {src:local(media.src,'mp4|webm'),captions:local(media.captions,'vtt')};}
