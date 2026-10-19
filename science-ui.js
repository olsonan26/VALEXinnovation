import {scheduleHours,historicalCycles} from './personal-model.js';
const el=id=>document.getElementById(id),svgNS='http://www.w3.org/2000/svg';
const svg=(tag,attrs,text)=>{const n=document.createElementNS(svgNS,tag);for(const [key,val] of Object.entries(attrs))n.setAttribute(key,val);if(text)n.textContent=text;return n;};
if(el('name-wave')){
 const d=Array.from({length:801},(_,x)=>{const amplitude=Math.sin(Math.PI*x/800)**2*(22+24*Math.sin(x*.016)**2);return `${x?'L':'M'}${x},${70+Math.sin(x*.39)*amplitude}`;}).join(' ');el('wave-path').setAttribute('d',d);
 fetch('/assets/anatomy/spoken-wave.json').then(r=>{if(!r.ok)throw new Error('Waveform unavailable');return r.json();}).then(values=>{const path=values.map((v,i)=>`M${i/(values.length-1)*800},${70-v*55}V${70+v*55}`).join(' ');el('wave-path').setAttribute('d',path);}).catch(()=>{el('name-wave').setAttribute('aria-label','Conceptual waveform: sample amplitude unavailable');});
 const audio=document.querySelector('audio'),cursor=svg('g',{'aria-hidden':'true'});cursor.append(svg('path',{d:'M0 8V132',stroke:'#174b3c','stroke-width':3}));el('name-wave').append(cursor);cursor.style.opacity='0';
 audio.addEventListener('timeupdate',()=>{const moving=!matchMedia('(prefers-reduced-motion: reduce)').matches&&!audio.paused&&Number.isFinite(audio.duration);cursor.style.opacity=moving?'1':'0';if(moving)cursor.style.transform=`translateX(${audio.currentTime/audio.duration*800}px)`;});audio.addEventListener('pause',()=>cursor.style.opacity='0');
 const steps=[
 ['Sound becomes a signal','From vibration to neural processing.','Sound waves have frequency and amplitude. The ear converts mechanical vibration into signals through the auditory system. Meaning comes from experience and context, not a fixed numerical frequency attached to each letter.','https://www.nidcd.nih.gov/health/how-do-we-hear'],
 ['Recognition','A familiar sound can draw attention.','Studies have reported distinctive responses to personally meaningful names, including P300 responses in particular tasks. Task, attention and context affect the result; this is not a personality reading.','https://pubmed.ncbi.nlm.nih.gov/7555920/'],
 ['Memory and association','Experience gives a word its meaning.','A name may call up remembered people, places and interactions. Memory and emotional learning involve multiple systems. The same sound can hold different associations for different people.','https://pmc.ncbi.nlm.nih.gov/articles/PMC497229/'],
 ['Self-relevance','Your name belongs to your story.','Self-related tasks recruit distributed cortical networks. A small own-name imaging study illustrates why personal significance matters, without establishing any numerical name-prediction method.','https://pmc.ncbi.nlm.nih.gov/articles/PMC1647299/'],
 ['A separate hypothesis','The question VALEX wants to explore.','Established neuroscience demonstrates that names can be personally meaningful neural stimuli. VALEX asks a separate question: can symbolic patterns derived from names and timelines provide useful areas for reflection? The first finding does not validate the second.','/science/#evaluation']
 ];
 for(const b of document.querySelectorAll('[data-auditory-step]'))b.addEventListener('click',()=>{const [label,title,copy,source]=steps[Number(b.dataset.auditoryStep)];el('auditory-step-label').textContent=label;el('auditory-title').textContent=title;el('auditory-copy').textContent=copy;el('auditory-source').href=source;for(const tab of document.querySelectorAll('[data-auditory-step]'))tab.setAttribute('aria-pressed',String(tab===b));el('name-wave').classList.toggle('recognition',b.dataset.auditoryStep!=='0');});
}
if(el('clock-form')){
 const polar=(hour,r)=>[200+Math.sin(hour/24*Math.PI*2)*r,200-Math.cos(hour/24*Math.PI*2)*r];
 function arc(start,length,r,colour){if(!length)return;const a=polar(start,r),b=polar(start+length,r);el('circadian-clock').append(svg('path',{d:`M ${a} A ${r} ${r} 0 ${length>12?1:0} 1 ${b}`,fill:'none',stroke:colour,'stroke-width':17,'stroke-linecap':'round'}));}
 function clock(){try{
  const s=scheduleHours(el('clock-bed').value,el('clock-wake').value,el('clock-start').value,el('clock-duration').value);
  if(!/^\d{2}:\d{2}$/.test(el('clock-light').value))throw new Error('Choose a complete light-exposure time.');
  const light=el('clock-light').value.split(':').map(Number);el('circadian-clock').replaceChildren();
  for(const r of [150,126,102])el('circadian-clock').append(svg('circle',{cx:200,cy:200,r,fill:'none',stroke:'#d7e1da','stroke-width':17}));
  arc(s.bed,s.sleep,150,'#76638f');arc(s.start,s.work,126,'#2e795e');arc(light[0]+light[1]/60,2,102,'#174b3c');
  for(let hour=0;hour<24;hour+=3){const [x,y]=polar(hour,181);el('circadian-clock').append(svg('text',{x,y:y+5,'text-anchor':'middle',fill:'#57665f','font-size':14},String(hour).padStart(2,'0')));}
  el('circadian-clock').append(svg('text',{x:200,y:192,'text-anchor':'middle',fill:'#193a31','font-size':38},'24'),svg('text',{x:200,y:219,'text-anchor':'middle',fill:'#57665f','font-size':13},'hour schedule'));
  el('clock-summary').textContent=`${s.sleep.toFixed(1)} hours of sleep opportunity · ${s.work.toFixed(1)}-hour work shift · ${s.overlap.toFixed(1)} hours of overlap. Light arc shows a two-hour example window, not a recommended dose.`;el('clock-error').hidden=true;
 }catch(err){el('clock-summary').textContent='';el('circadian-clock').replaceChildren();el('clock-error').textContent=err.message;el('clock-error').hidden=false;}}
 el('clock-form').addEventListener('input',()=>{for(const t of document.querySelectorAll('[data-shift]'))t.setAttribute('aria-pressed','false');clock();});el('clock-form').addEventListener('submit',e=>e.preventDefault());
 for(const b of document.querySelectorAll('[data-shift]'))b.addEventListener('click',()=>{const night=b.dataset.shift==='night',values=night?['08:00','16:00','22:00','21:00']:['23:00','07:00','09:00','08:00'];['clock-bed','clock-wake','clock-start','clock-light'].forEach((id,i)=>el(id).value=values[i]);el('clock-duration').value=8;for(const t of document.querySelectorAll('[data-shift]'))t.setAttribute('aria-pressed',String(t===b));clock();});clock();
}
if(el('cycle-chart')){
 let base=el('cycle-date').value;
 function cycles(){try{
  historicalCycles(el('cycle-anchor').value,base);const stamp=new Date(base+'T00:00:00Z');stamp.setUTCDate(stamp.getUTCDate()+Number(el('cycle-offset').value));const selected=stamp.toISOString().slice(0,10);const values=historicalCycles(el('cycle-anchor').value,selected);
  el('cycle-date-output').textContent=selected;el('cycle-chart').replaceChildren();
  for(const y of [40,130,220])el('cycle-chart').append(svg('line',{x1:20,y1:y,x2:880,y2:y,stroke:'#d7e1da'}));
  el('cycle-chart').append(svg('line',{x1:450,y1:20,x2:450,y2:240,stroke:'#57665f','stroke-dasharray':'4 5'}));
  const colours=['#2e795e','#174b3c','#76638f'];
  values.forEach(({period,value},index)=>{if(!document.querySelector(`[data-cycle="${period}"]`).checked)return;let d='';for(let x=0;x<=120;x++){const date=new Date(stamp);date.setUTCDate(date.getUTCDate()+x-60);const sample=historicalCycles(el('cycle-anchor').value,date.toISOString().slice(0,10))[index].value;d+=`${x?'L':'M'}${20+x/120*860},${130-sample*90} `;}el('cycle-chart').append(svg('path',{d,fill:'none',stroke:colours[index],'stroke-width':2.5}),svg('circle',{cx:450,cy:130-value*90,r:5,fill:colours[index]}));});
  const dateLabels=[[-60,20],[0,450],[60,880]];for(const [offset,x] of dateLabels){const d=new Date(stamp);d.setUTCDate(d.getUTCDate()+offset);el('cycle-chart').append(svg('text',{x,y:258,fill:'#57665f','font-size':13,'text-anchor':offset<0?'start':offset>0?'end':'middle'},d.toISOString().slice(0,10)));}
  el('cycle-values').textContent=values.filter(v=>document.querySelector(`[data-cycle="${v.period}"]`).checked).map(v=>`${v.period}-day amplitude: ${v.value.toFixed(2)}`).join(' · ')||'All cycles hidden. Select a cycle to show its mathematics.';el('cycle-error').hidden=true;
 }catch(err){el('cycle-chart').replaceChildren();el('cycle-values').textContent='';el('cycle-date-output').textContent='';el('cycle-error').textContent=err.message;el('cycle-error').hidden=false;}}
 el('cycle-date').addEventListener('input',()=>{base=el('cycle-date').value;el('cycle-offset').value=0;cycles();});for(const n of [el('cycle-anchor'),el('cycle-offset'),...document.querySelectorAll('[data-cycle]')])n.addEventListener('input',cycles);cycles();
}
