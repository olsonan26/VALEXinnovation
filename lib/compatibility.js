import {buildCompatibilityIdentity} from './assets/chart-engine.js';

export const POSITIONS=Object.freeze([
  {key:'first',label:'First Name',weight:.16,meaning:'Initial expression and impressions.'},
  {key:'called',label:'Called Name',weight:.28,meaning:'Personality expressed through the regularly used name.'},
  {key:'whole',label:'Whole Name',weight:.28,meaning:'Personality represented by the complete birth name.'},
  {key:'heart',label:"Heart’s Desire",weight:.08,meaning:'Inner wants and emotional motivations.'},
  {key:'day',label:'Day of Birth',weight:.13,meaning:'Early habits and ways of approaching situations.'},
  {key:'birth',label:'Birth Force',weight:.05,meaning:'Talents and abilities developed over time.'},
  {key:'goal',label:'Ultimate Goal',weight:.02,meaning:'Overarching direction from Whole Name and Birth Force.'}
].map(Object.freeze));
export const MATRIX=Object.freeze([
  [80,60,80,60,95,60,60,40,60],
  [40,95,40,80,40,60,95,40,95],
  [95,40,80,40,80,80,40,40,80],
  [60,80,40,95,40,95,80,80,40],
  [80,40,80,40,95,20,20,20,20],
  [60,80,60,80,40,80,40,95,95],
  [60,80,20,80,20,40,80,20,80],
  [40,20,20,80,40,95,20,95,40],
  [60,95,80,60,40,95,80,20,95]
].map(row=>Object.freeze(row)));
export const NAME_CENTERED_TERMS=Object.freeze({
  called:Object.freeze([['called','called',.75],['first','first',.15],['called','first',.05],['first','called',.05]].map(Object.freeze)),
  whole:Object.freeze([['whole','whole',.75],['day','day',.10],['heart','heart',.07],['birth','birth',.04],['goal','goal',.02],['called','called',.02]].map(Object.freeze))
});
export const DEFAULT_CONFIG=Object.freeze({version:'lettrology-user-model-2026-10-08-v2',matrix:MATRIX,
  weights:Object.freeze(Object.fromEntries(POSITIONS.map(p=>[p.key,p.weight]))),directInfluence:.85,
  coefficients:Object.freeze({nameName:.85,heartName:.70,nameHeart:.50,nameDay:.50,heartDay:.45,dayBirth:.40,nameBirth:.35,heartBirth:.35,heartGoal:.30,nameGoal:.25,dayGoal:.25,birthGoal:.25})});
const identityCache=new WeakMap();
export function identityFor(person){
  const signature=JSON.stringify([person.id,person.FirstName,person.FullName,person.CalledName,person.txtBirthdate,person.NeedsReview,new Date().toDateString()]);
  const cached=identityCache.get(person);
  if(cached?.signature===signature)return cached.identity;
  const identity=buildCompatibilityIdentity(person);
  identityCache.set(person,{signature,identity});
  return identity;
}
export function validateConfig(config=DEFAULT_CONFIG){
  if(config.matrix?.length!==9||config.matrix.some(row=>row.length!==9||row.some(n=>!Number.isFinite(n)||n<0||n>100)))throw new Error('Matrix must contain 81 percentages.');
  if(POSITIONS.some(p=>!Number.isFinite(config.weights[p.key])||config.weights[p.key]<=0)||Math.abs(POSITIONS.reduce((sum,p)=>sum+config.weights[p.key],0)-1)>1e-10)throw new Error('Seven positive weights must total one.');
  if(!Number.isFinite(config.directInfluence)||config.directInfluence<0||config.directInfluence>1||Object.keys(DEFAULT_CONFIG.coefficients).some(key=>!Number.isFinite(config.coefficients[key])||config.coefficients[key]<0||config.coefficients[key]>1))throw new Error('Influences must be between zero and one.');
  return config;
}
export function matrixScore(a,b,config=DEFAULT_CONFIG){
  if(!Number.isInteger(a)||!Number.isInteger(b)||a<1||a>9||b<1||b>9)throw new Error('Matrix inputs must be reduced numbers 1–9.');
  return config.matrix[a-1][b-1];
}
export function coefficient(a,b,config=DEFAULT_CONFIG){
  if(a===b||!POSITIONS.some(p=>p.key===a)||!POSITIONS.some(p=>p.key===b))throw new Error('Cross positions must be distinct known positions.');
  const isName=k=>['first','called','whole'].includes(k),c=config.coefficients;
  if(isName(a)&&isName(b))return c.nameName;
  if(a==='heart'&&isName(b))return c.heartName;
  if(isName(a)&&b==='heart')return c.nameHeart;
  const pair=[a,b];
  for(const other of ['day','birth','goal'])if(pair.includes(other)&&pair.some(isName))return c[{day:'nameDay',birth:'nameBirth',goal:'nameGoal'}[other]];
  const key={ 'day-heart':'heartDay','birth-day':'dayBirth','birth-heart':'heartBirth','goal-heart':'heartGoal','day-goal':'dayGoal','birth-goal':'birthGoal'}[pair.sort().join('-')];
  if(!key)throw new Error('Missing cross-position coefficient.');
  return c[key];
}
export function weightedNameScores(reference,compared,config=DEFAULT_CONFIG){
  const terms=Object.fromEntries(Object.entries(NAME_CENTERED_TERMS).map(([key,formula])=>[key,formula.map(([referencePosition,comparedPosition,weight])=>{
    const r=reference.positions[referencePosition],e=compared.positions[comparedPosition];
    const raw=r&&e?matrixScore(r.root,e.root,config):null;
    return {referencePosition,comparedPosition,weight,raw,contribution:raw===null?null:weight*raw};
  })]));
  const total=entries=>entries.some(entry=>entry.raw===null)?null:entries.reduce((sum,entry)=>sum+entry.contribution,0);
  return {called:total(terms.called),whole:total(terms.whole),terms};
}
export function directional(reference,compared,config=DEFAULT_CONFIG){
  validateConfig(config);
  const score=(a,b)=>reference.positions[a]&&compared.positions[b]?matrixScore(reference.positions[a].root,compared.positions[b].root,config):null;
  const layers=Object.fromEntries(POSITIONS.map(p=>[p.key,score(p.key,p.key)]));
  const complete=Object.values(layers).every(n=>n!==null);
  const direct=complete?POSITIONS.reduce((sum,p)=>sum+config.weights[p.key]*layers[p.key],0):null;
  const grid=POSITIONS.flatMap(a=>POSITIONS.map(b=>{const raw=score(a.key,b.key),same=a.key===b.key,c=same?1:coefficient(a.key,b.key,config);return {referencePosition:a.key,comparedPosition:b.key,raw,coefficient:c,adjusted:raw===null?null:50+c*(raw-50),weight:config.weights[a.key]*config.weights[b.key],numberPair:reference.positions[a.key]&&compared.positions[b.key]?`${reference.positions[a.key].root}-${compared.positions[b.key].root}`:null};}));
  const crossEntries=grid.filter(entry=>entry.referencePosition!==entry.comparedPosition);
  const denominator=crossEntries.reduce((sum,entry)=>sum+entry.weight,0);
  const cross=complete?crossEntries.reduce((sum,entry)=>sum+entry.weight*entry.adjusted,0)/denominator:null;
  return {layers,direct,cross,denominator,grid,nameCentered:weightedNameScores(reference,compared,config),overall:complete?config.directInfluence*direct+(1-config.directInfluence)*cross:null};
}
export function compareIdentities(reference,compared,config=DEFAULT_CONFIG){
  const forward=directional(reference,compared,config),reverse=directional(compared,reference,config);
  const average=(a,b)=>a===null||b===null?null:(a+b)/2;
  return {referenceId:reference.id,comparedId:compared.id,version:config.version,reference,compared,forward,reverse,
    called:forward.nameCentered.called,whole:forward.nameCentered.whole,
    gap:forward.nameCentered.called===null||forward.nameCentered.whole===null?null:forward.nameCentered.whole-forward.nameCentered.called,
    mutualNameCentered:{called:average(forward.nameCentered.called,reverse.nameCentered.called),whole:average(forward.nameCentered.whole,reverse.nameCentered.whole)},
    mutualLayers:Object.fromEntries(POSITIONS.map(p=>[p.key,average(forward.layers[p.key],reverse.layers[p.key])])),
    mutual:average(forward.overall,reverse.overall),appreciationGap:forward.overall===null||reverse.overall===null?null:forward.overall-reverse.overall};
}
export function rankComparisons(rows,mode='whole'){
  const metric=row=>({whole:row.comparison.whole,called:row.comparison.called,overall:row.comparison.forward.overall,positive:row.comparison.gap,negative:row.comparison.gap===null?null:-row.comparison.gap})[mode];
  const descending=(a,b)=>a==null?(b==null?0:1):b==null?-1:b-a;
  return [...rows].sort((a,b)=>{
    const stable=()=>a.name.localeCompare(b.name)||String(a.personId).localeCompare(String(b.personId));
    if(mode==='alphabetical')return stable();
    return descending(metric(a),metric(b))||(mode==='whole'?0:descending(a.comparison.forward.overall,b.comparison.forward.overall))||stable();
  });
}
export function compareGroup(referencePerson,people,mode='whole',config=DEFAULT_CONFIG){
  const reference=identityFor(referencePerson);
  return rankComparisons(people.filter(p=>p.id!==referencePerson.id).map(p=>({personId:p.id,name:p.CalledName||p.FullName||'Unnamed person',comparison:compareIdentities(reference,identityFor(p),config)})),mode);
}
