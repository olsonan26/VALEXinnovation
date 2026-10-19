import {comparePair} from './demo-model.js';
// Fictional identities; every reveal is computed by the preserved comparison engine.
export const demoManager=Object.freeze({fullName:'Jamie Alexander Reed',calledName:'Jamie Reed',birthdate:'1978-04-16'});
const profile=(id,fullName,calledName,birthdate,animation)=>Object.freeze({id,fullName,calledName,birthdate,animation});
export const demoProfiles=Object.freeze([
 profile('amelia','Amelia Rose Morgan','Amelia Morgan','1990-06-18','female'),
 profile('freya','Freya Josephine Bell','Freya Bell','1975-01-12','female'),
 profile('grace','Grace Eleanor Parker','Grace Parker','1985-10-25','female'),
 profile('oliver','Oliver James Lewis','Oliver Lewis','1975-01-12','male'),
 profile('mia','Mia Charlotte Turner','Mia Turner','2000-04-12','female'),
 profile('zoe','Zoe Alexandra Blake','Zoe Blake','1975-01-12','female'),
 profile('noah','Noah Benjamin Foster','Noah Foster','2000-04-12','male')
]);
export const DEMO_MATCH_THRESHOLD=50;
export function classifyDemoScore(score){if(!Number.isFinite(score)||score<0||score>100)throw new Error('The comparison is unavailable.');return score<DEMO_MATCH_THRESHOLD?'differences':'alignment';}
export function getDemoProfile(id){const p=demoProfiles.find(p=>p.id===id);if(!p)throw new Error('Choose a fictional profile.');return p;}
export function nextDemoProfile(id,step=1){const index=demoProfiles.indexOf(getDemoProfile(id));return demoProfiles[(index+step%demoProfiles.length+demoProfiles.length)%demoProfiles.length];}
export function calculateDemoMatch(id){
 const p=getDemoProfile(id),comparison=comparePair(demoManager,p),score=comparison.forward.overall;
 return {profile:p,score,reverseScore:comparison.reverse.overall,outcome:classifyDemoScore(score),version:comparison.version};
}
export function getDemoStory(id){const calculated=calculateDemoMatch(id),matched=calculated.outcome==='alignment';return {...calculated,name:calculated.profile.calledName,title:matched?'A closer match with Jamie.':'A lower match with Jamie.',summary:matched?'In this example, Staff Profiler identifies a closer match between this person’s profile and Jamie’s.':'In this example, Staff Profiler identifies a lower match between this person’s profile and Jamie’s.',points:matched?['Use the comparison to prepare a conversation about working together.','Ask both people what support and expectations they would want to agree on.']:['Use the comparison to prepare questions about possible working differences.','Discuss those questions alongside skills, experience and what both people tell you.'],question:matched?'What would help this working relationship get off to a good start?':'How would you like us to handle differences in communication or expectations?'};}
export function getStoryMedia(config,outcome,animation='male'){if(!['alignment','differences'].includes(outcome))throw new Error('Unknown result.');if(!['male','female'].includes(animation))throw new Error('Unknown scan animation.');const media=(animation==='female'?config?.female:config)?.[outcome]||{};const local=(v,extension)=>typeof v==='string'&&new RegExp(`^/assets/demo/[a-zA-Z0-9_-]+\\.(?:${extension})$`).test(v)?v:null;return {src:local(media.src,'mp4|webm'),captions:local(media.captions,'vtt')};}
