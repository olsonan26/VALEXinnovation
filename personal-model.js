import {buildWordCycle,getActiveLetterAtAge,getOrdinalLetterValue,reduceWithTrail,formatCompound,buildPersonChart,buildCompatibilityIdentity} from './lib/name-engine.js';

export function exploreName({firstName,lastName,age,additionalNames='',calledName='',birthdate='',today=new Date()}) {
  const name=String(firstName??'').trim();
  if(!/^[A-Za-z][A-Za-z-]{0,39}$/.test(name)) throw new Error('Enter a first name using A–Z letters or hyphens, up to 40 characters.');
  const surname=String(lastName??'').trim();
  if(!/^[A-Za-z][A-Za-z -]{0,59}$/.test(surname)) throw new Error('Enter a last name using A–Z letters, spaces or hyphens, up to 60 characters.');
  const birthdayMode=String(age??'').trim()===''&&Boolean(birthdate);
  let modelAge=age;
  if(birthdayMode){
    if(!/^\d{4}-\d{2}-\d{2}$/.test(birthdate))throw new Error('Enter a complete birthday.');
    const [year,month,day]=birthdate.split('-').map(Number),date=new Date(Date.UTC(year,month-1,day));
    if(year<1000||date.getUTCFullYear()!==year||date.getUTCMonth()!==month-1||date.getUTCDate()!==day)throw new Error('Enter a valid birthday.');
    modelAge=today.getFullYear()-year-((today.getMonth()+1<month||(today.getMonth()+1===month&&today.getDate()<day))?1:0);
  }
  if(String(modelAge??'').trim()==='' || !Number.isInteger(Number(modelAge)) || Number(modelAge)<0 || Number(modelAge)>120) throw new Error('Enter an age from 0 to 120, or a valid birthday within that age range.');
  const currentAge=Number(modelAge),cycle=buildWordCycle(name);
  const surnameCycle=buildWordCycle(surname);
  const surnameTotal=reduceWithTrail([...surname.toUpperCase()].reduce((sum,letter)=>sum+(getOrdinalLetterValue(letter)||0),0));
  const total=reduceWithTrail([...cycle.originalWord.toUpperCase()].reduce((sum,letter)=>sum+(getOrdinalLetterValue(letter)||0),0));
  const start=Math.max(0,currentAge-12),end=Math.min(145,currentAge+18);
  const years=Array.from({length:end-start+1},(_,i)=>({age:start+i,letter:getActiveLetterAtAge(cycle,start+i),surnameLetter:getActiveLetterAtAge(surnameCycle,start+i)}));
  const transitions=years.filter((year,i)=>i>0&&(year.letter!==years[i-1].letter||year.surnameLetter!==years[i-1].surnameLetter)).filter(year=>year.age<=currentAge).slice(-4);
  let annual=null,layers=[];
  if(additionalNames&&!/^[A-Za-z -]{1,100}$/.test(additionalNames)) throw new Error('Use A–Z letters, spaces or hyphens for additional names.');
  if(calledName&&!/^[A-Za-z -]{1,100}$/.test(calledName)) throw new Error('Use A–Z letters, spaces or hyphens for your everyday name.');
  const fullName=[name,additionalNames.trim(),surname].filter(Boolean).join(' ');
  if(additionalNames.trim()||calledName.trim()){
    const identity=buildCompatibilityIdentity({FullName:fullName,FirstName:name,CalledName:calledName.trim()||fullName});
    layers=['first','called','whole'].map(key=>({key,value:identity.positions[key]?formatCompound(identity.positions[key]):null}));
  }
  if(birthdate){
    if(!/^\d{4}-\d{2}-\d{2}$/.test(birthdate)) throw new Error('Enter a complete optional birthdate, or leave it blank.');
    const [year]=birthdate.split('-').map(Number);
    const person={id:'personal-preview',FullName:fullName,CalledName:calledName||fullName,txtBirthdate:birthdate.split('-').reverse().join('-')};
    const chart=buildPersonChart(person,birthdayMode?today.getFullYear():year+currentAge,0);
    annual={year:chart.focus.calendarYear,py:formatCompound(chart.focus.py),pye:formatCompound(chart.focus.ess)};
  }
  return {name,surname,age:currentAge,birthdayMode,cycle,surnameCycle,total:formatCompound(total),surnameTotal:formatCompound(surnameTotal),activeLetter:getActiveLetterAtAge(cycle,currentAge),activeSurnameLetter:getActiveLetterAtAge(surnameCycle,currentAge),years,transitions,annual,layers};
}

export function historicalCycles(anchorDate,date){
  const parse=value=>{
    if(!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error('Choose complete dates.');
    const [y,m,d]=value.split('-').map(Number),stamp=Date.UTC(y,m-1,d),check=new Date(stamp);
    if(y<1000||check.getUTCFullYear()!==y||check.getUTCMonth()!==m-1||check.getUTCDate()!==d) throw new Error('Choose valid calendar dates.');
    return stamp;
  };
  const days=(parse(date)-parse(anchorDate))/86400000;
  return [23,28,33].map(period=>({period,value:Math.sin(2*Math.PI*days/period)}));
}

export function scheduleHours(bed,wake,start,duration){
  const minutes=value=>{if(!/^\d{2}:\d{2}$/.test(value))throw new Error('Choose complete schedule times.');const [h,m]=value.split(':').map(Number);if(h>23||m>59)throw new Error('Choose valid times.');return h*60+m;};
  const b=minutes(bed),w=minutes(wake),s=minutes(start),length=Number(duration)*60;
  if(!Number.isFinite(length)||length<60||length>960)throw new Error('Choose a work shift from 1 to 16 hours.');
  const sleep=(w-b+1440)%1440;
  const inside=(minute,from,len)=>(minute-from+1440)%1440<len;
  let overlap=0;
  for(let minute=0;minute<1440;minute++)if(inside(minute,b,sleep)&&inside(minute,s,length))overlap++;
  return {sleep:sleep/60,work:length/60,overlap:overlap/60,bed:b/60,wake:w/60,start:s/60};
}
