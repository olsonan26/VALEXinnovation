import {exploreName} from './personal-model.js';
import {getBaseLetterValue} from './lib/name-engine.js';
if(document.getElementById('personal-form')){
const el=id=>document.getElementById(id),form=el('personal-form'),result=el('personal-results');
let model=null;
const today=new Date();el('personal-dob').max=[today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');
function timingMode(){const birthday=form.querySelector('[name="timing-mode"]:checked').value==='birthday';el('age-input-label').hidden=birthday;el('current-age').disabled=birthday;el('current-age').required=!birthday;el('birthday-input-label').hidden=!birthday;el('personal-dob').disabled=!birthday;el('personal-dob').required=birthday;clearResults();}
for(const radio of form.querySelectorAll('[name="timing-mode"]'))radio.addEventListener('change',()=>{el('current-age').value='';el('personal-dob').value='';timingMode();});
const make=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
function clearResults(){model=null;result.hidden=true;el('personal-error').hidden=true;el('reflection-questions').replaceChildren();el('reflection-summary').textContent='';for(const input of form.querySelectorAll('input')){input.removeAttribute('aria-invalid');input.removeAttribute('aria-errormessage');}}
function timeline(age){
 const point=model.years.find(y=>y.age===age);el('selected-age').textContent=age;
 el('stage-context').textContent=`At model age ${age}, first-name letter ${point.letter} and last-name letter ${point.surnameLetter} are active. This is a symbolic stage with a ${getBaseLetterValue(point.letter)}-year letter duration, not a forecast of an event or feeling.`;
 for(const b of el('name-timeline').children)b.setAttribute('aria-pressed',String(Number(b.dataset.age)===age));
}
function show(){
 const data=Object.fromEntries(['first-name','last-name','current-age','additional-names','personal-called','personal-dob'].map(id=>[id,el(id).value]));
 const birthdayMode=form.querySelector('[name="timing-mode"]:checked').value==='birthday';
 model=exploreName({firstName:data['first-name'],lastName:data['last-name'],age:birthdayMode?'':data['current-age'],additionalNames:data['additional-names'],calledName:data['personal-called'],birthdate:birthdayMode?data['personal-dob']:''});
 el('personal-result-title').textContent=`${model.name} ${model.surname} · age ${model.age}`;
 el('name-letters').replaceChildren();
 for(const [label,cycle] of [['First name',model.cycle],['Last name',model.surnameCycle]]){const group=make('div',undefined,'name-letter-group');group.append(make('p',label,'small'));const row=make('div',undefined,'letter-sequence');row.append(...cycle.letterSpans.map(({letter,duration})=>{const n=make('div',undefined,'letter-tile');n.append(make('strong',letter),make('span',`${duration} ${duration===1?'year':'years'}`));return n;}));group.append(row);el('name-letters').append(group);}
 el('personal-summary').replaceChildren(make('p',`Your first-name structure is ${model.total}; your last-name structure is ${model.surnameTotal}. At age ${model.age}, the active letters are ${model.activeLetter} (first name) and ${model.activeSurnameLetter} (last name). The first-name sequence repeats after ${model.cycle.cycleLength} years and the last-name sequence after ${model.surnameCycle.cycleLength} years. These are symbolic structures, not psychological measurements.`));
 if(model.layers.length){const details=make('details',undefined,'optional');details.append(make('summary','Explore the optional name layers'));const labels={first:'First-name identity',called:'Everyday-name identity',whole:'Complete entered-name identity'};for(const layer of model.layers)details.append(make('p',`${labels[layer.key]}: ${layer.value??'Unavailable'}`));details.append(make('p','These use the software’s separate identity-layer rules. They are different from the letter-duration structures above, and are not measurements of personality.','small'));el('personal-summary').append(details);}
 const range=el('age-scrubber');range.min=model.years[0].age;range.max=model.years.at(-1).age;range.value=model.age;
 el('name-timeline').replaceChildren(...model.years.map(y=>{const b=make('button',undefined,'timeline-year '+(y.age<model.age?'past':y.age>model.age?'future':'present'));b.type='button';b.dataset.age=y.age;b.setAttribute('aria-label',`Age ${y.age}, first-name letter ${y.letter}, last-name letter ${y.surnameLetter}`);b.append(make('small',String(y.age)),make('strong',y.letter),make('span',y.surnameLetter));b.addEventListener('click',()=>{range.value=y.age;timeline(y.age);});return b;}));
 timeline(model.age);
 const annual=el('annual-values');annual.hidden=!model.annual;annual.replaceChildren();
 if(model.annual){annual.append(make('h4',`Annual model · ${model.annual.year}`),make('p',`PY ${model.annual.py} — modeled yearly environment. PYE ${model.annual.pye} — modeled personal experience or feeling.`),make('p','The original software uses calendar-year conventions. These annual values use the current calendar year; they do not measure your current psychological state.','small'));}
 el('reflection-questions').replaceChildren(...model.transitions.map((t,i)=>{const f=make('fieldset');f.append(make('legend',`Around age ${t.age}: do you remember a meaningful change?`));for(const answer of ['Yes','No','Unsure']){const l=make('label',undefined,'reflection-choice'),r=document.createElement('input');r.type='radio';r.name=`reflection-${i}`;r.value=answer;l.append(r,document.createTextNode(answer));f.append(l);}return f;}));
 if(!model.transitions.length)el('reflection-questions').append(make('p','No earlier letter changes fall within this displayed window. That is a model feature, not a claim about your life.'));
 result.hidden=false;result.focus({preventScroll:true});
 result.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
}
form.addEventListener('submit',e=>{e.preventDefault();clearResults();try{show();}catch(err){el('personal-error').textContent=err.message;el('personal-error').hidden=false;const field=el(/first name/i.test(err.message)?'first-name':/last name/i.test(err.message)?'last-name':/additional/i.test(err.message)?'additional-names':/everyday/i.test(err.message)?'personal-called':/birthday|birthdate/i.test(err.message)?'personal-dob':el('current-age').disabled?'personal-dob':'current-age');field.setAttribute('aria-invalid','true');field.setAttribute('aria-errormessage','personal-error');field.focus();}});
form.addEventListener('input',clearResults);
el('age-scrubber').addEventListener('input',e=>timeline(Number(e.target.value)));
el('personal-example').addEventListener('click',()=>{form.reset();timingMode();el('first-name').value='Amelia';el('last-name').value='Morgan';el('current-age').value='35';clearResults();show();});
el('personal-clear').addEventListener('click',()=>{form.reset();timingMode();clearResults();el('first-name').focus();});
el('reflection-questions').addEventListener('change',()=>{const answers=[...el('reflection-questions').querySelectorAll('input:checked')];el('reflection-summary').textContent=['Yes','No','Unsure'].map(a=>`${a}: ${answers.filter(r=>r.value===a).length}`).join(' · ')+' — reflection only, not accuracy evidence.';});
addEventListener('pageshow',e=>{if(e.persisted){form.reset();timingMode();clearResults();}});
addEventListener('pagehide',()=>{form.reset();timingMode();clearResults();});
timingMode();

}
