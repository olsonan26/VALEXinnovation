import {comparePair,ProfileInputError} from './demo-model.js';
const byId=id=>document.getElementById(id);
const form=byId('pair-form'),result=byId('pair-results'),error=byId('pair-error'),submit=byId('calculate-pair');
const today=new Date(),maxDate=[today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');
for(const id of ['a-dob','b-dob'])byId(id).max=maxDate;
const percent=value=>value===null?'Unavailable':(Math.round((value+Number.EPSILON*Math.abs(value)*4)*10)/10).toFixed(1)+'%';
function clearResult(){result.hidden=true;byId('direction-results').replaceChildren();error.hidden=true;error.textContent='';for(const field of form.querySelectorAll('input')){field.removeAttribute('aria-invalid');field.removeAttribute('aria-errormessage');}}
function profile(id){return {fullName:byId(id+'-name').value,calledName:byId(id+'-called').value,birthdate:byId(id+'-dob').value};}
function directionCard(from,to,values,letter){
  const article=document.createElement('article');article.className='direction-card';
  const header=document.createElement('div');header.className='direction-heading';
  const avatar=document.createElement('span');avatar.className='explainer-avatar'+(letter==='B'?' second':'');avatar.textContent=letter;
  const heading=document.createElement('div');const h4=document.createElement('h4');h4.textContent=from+'’s perspective';const caption=document.createElement('p');caption.textContent='Compared with '+to;heading.append(h4,caption);header.append(avatar,heading);article.append(header);
  const total=document.createElement('div');total.className='overall-score';const label=document.createElement('span');label.textContent='Overall model comparison';const number=document.createElement('strong');number.textContent=percent(values.overall);total.append(label,number);article.append(total);
  for(const [key,labelText] of [['whole','Full name comparison'],['called','Everyday name comparison']]){
    const row=document.createElement('div');row.className='proof-score';
    const labels=document.createElement('div');const label=document.createElement('span');label.textContent=labelText;const value=document.createElement('strong');value.textContent=percent(values[key]);labels.append(label,value);
    const track=document.createElement('div');track.className='proof-track '+key;
    if(values[key]!==null){track.setAttribute('role','meter');track.setAttribute('aria-label',from+' to '+to+': '+labelText);track.setAttribute('aria-valuemin','0');track.setAttribute('aria-valuemax','100');track.setAttribute('aria-valuenow',String(values[key]));const fill=document.createElement('i');fill.style.width=values[key]+'%';track.append(fill);}
    row.append(labels,track);article.append(row);
  }
  return article;
}
form.addEventListener('input',clearResult);
form.addEventListener('change',clearResult);
form.addEventListener('submit',event=>{
  event.preventDefault();clearResult();if(!form.reportValidity())return;
  try{
    const comparison=comparePair(profile('a'),profile('b'));
    byId('direction-results').append(directionCard(comparison.names.a,comparison.names.b,comparison.forward,'A'),directionCard(comparison.names.b,comparison.names.a,comparison.reverse,'B'));
    result.hidden=false;result.focus({preventScroll:true});result.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
  }catch(err){error.textContent=err instanceof ProfileInputError?err.message:'The comparison could not be calculated. Please check both profiles and try again.';error.hidden=false;if(err instanceof ProfileInputError){const field=byId(err.field);field.setAttribute('aria-invalid','true');field.setAttribute('aria-errormessage','pair-error');field.focus();}}
});
byId('load-example').addEventListener('click',()=>{
  clearResult();
  const examples={a:{name:'Amelia Rose Morgan',called:'Amelia Morgan',dob:'1970-02-01'},b:{name:'Oliver James Lewis',called:'Oliver Lewis',dob:'1985-07-12'}};
  for(const [id,values] of Object.entries(examples))for(const [field,value] of Object.entries(values))byId(id+'-'+field).value=value;
  byId('a-name').focus({preventScroll:true});
});
byId('clear-pair').addEventListener('click',()=>{form.reset();clearResult();byId('a-name').focus({preventScroll:true});});
// Clear browser-restored form values as well as fresh reloads and history returns.
addEventListener('pageshow',()=>{form.reset();clearResult();});
submit.disabled=false;
