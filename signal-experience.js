import analysis from './assets/anatomy/spoken-analysis.json' with {type:'json'};
import {audioView,audioWindow} from './signal-model.js';
import {exploreName} from './personal-model.js';
const root=document.querySelector('[data-signal-experience]');
if(root){
 const q=s=>root.querySelector(s),svgNS='http://www.w3.org/2000/svg';
 const svg=(tag,attrs,text)=>{const n=document.createElementNS(svgNS,tag);for(const [key,value] of Object.entries(attrs))n.setAttribute(key,value);if(text)n.textContent=text;return n;};
 const make=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
 const audio=q('#signal-audio'),position=q('#signal-position'),zoom=q('#signal-zoom');
 function drawAudio(){const view=audioView(analysis.duration,Number(position.value),Number(zoom.value));q('#signal-time').textContent=`${Number(position.value).toFixed(2)} s`;q('#signal-zoom-output').textContent=zoom.value+'×';
  const points=analysis.amplitude.map((v,i)=>({value:v,time:i*analysis.amplitudeStep})).filter(p=>p.time>=view.start&&p.time<=view.end);
  const coords=points.map(p=>({x:40+(p.time-view.start)/(view.end-view.start)*920,high:160-p.value*105,low:160+p.value*105}));
  q('#signal-wave-top').setAttribute('d',coords.map((p,i)=>`${i?'L':'M'}${p.x},${p.high}`).join(' '));
  q('#signal-wave-fill').setAttribute('d',coords.length?'M'+coords.map(p=>`${p.x},${p.high}`).join(' L')+' L'+[...coords].reverse().map(p=>`${p.x},${p.low}`).join(' L')+' Z':'');
  const x=40+(view.position-view.start)/(view.end-view.start)*920;q('#signal-inspect-line').setAttribute('d',`M${x} 40V280`);
  q('#signal-axis').replaceChildren(...[0,.25,.5,.75,1].map(t=>svg('text',{x:40+t*920,y:305,'text-anchor':t===0?'start':t===1?'end':'middle'},(view.start+t*(view.end-view.start)).toFixed(2)+' s')));
  const sample=audioWindow(analysis,Number(position.value)),labels=['Below 500 Hz','500–2,000 Hz','Above 2,000 Hz'];
  for(const button of root.querySelectorAll('[data-sample-point]'))button.setAttribute('aria-pressed',String(Math.abs(Number(button.dataset.samplePoint)-Number(position.value))<.003));
  q('#signal-bands').replaceChildren(...sample.bands.map((value,i)=>{const b=make('div',undefined,'frequency-band'),track=make('div',undefined,'frequency-band-track'),fill=make('i');fill.style.transform=`scaleY(${value})`;track.append(fill);b.append(track,make('strong',Math.round(value*100)+'%'),make('span',labels[i]));return b;}));
  q('#signal-sample-description').textContent=sample.level<.003?'This window is nearly silent. Frequency proportions here may reflect residual noise.':`Strongest spectral bin: approximately ${sample.peakHz.toLocaleString()} Hz. Bars show the share of spectral power in this short window—not a biological or personal reading.`;
 }
 position.addEventListener('input',drawAudio);zoom.addEventListener('input',drawAudio);
 q('#signal-wave').addEventListener('click',e=>{const rect=q('#signal-wave').getBoundingClientRect(),fraction=(e.clientX-rect.left)/rect.width,view=audioView(analysis.duration,Number(position.value),Number(zoom.value));position.value=view.start+Math.max(0,Math.min(1,(fraction*1000-40)/920))*(view.end-view.start);drawAudio();});
 for(const b of root.querySelectorAll('[data-sample-point]'))b.addEventListener('click',()=>{position.value=b.dataset.samplePoint;drawAudio();});
 audio.addEventListener('timeupdate',()=>{if(audio.paused||matchMedia('(prefers-reduced-motion: reduce)').matches)return;position.value=audio.currentTime;drawAudio();});
 const views=[...root.querySelectorAll('[data-signal-mode]')];
 function selectMode(mode,focus=false){audio.pause();for(const b of views){const selected=b.dataset.signalMode===mode;b.setAttribute('aria-pressed',String(selected));if(selected&&focus)b.focus();}for(const panel of root.querySelectorAll('[data-signal-panel]'))panel.hidden=panel.dataset.signalPanel!==mode;if(mode==='time')drawAge();}
 for(const b of views){b.addEventListener('click',()=>selectMode(b.dataset.signalMode));b.addEventListener('keydown',e=>{const index=views.indexOf(b),next=e.key==='ArrowRight'?(index+1)%views.length:e.key==='ArrowLeft'?(index+views.length-1)%views.length:null;if(next!==null){e.preventDefault();selectMode(views[next].dataset.signalMode,true);}});}
 const meaning={
  sound:['A signal we can recognise.','The ear converts sound into neural signals. Familiarity and attention influence how a sound is processed; a personally meaningful name can be more than background noise.','https://www.nidcd.nih.gov/health/how-do-we-hear'],
  memory:['Experience gives a moment context.','The hippocampus and wider memory systems support learning and recollection. Remembering is not a perfect recording: memories can be incomplete or change over time.','https://pmc.ncbi.nlm.nih.gov/articles/PMC497229/'],
  meaning:['What matters can draw a response.','The amygdala contributes to salience and emotional learning as part of broader networks. A learned association can influence how a situation feels; there is no single switch for every response.','https://pubmed.ncbi.nlm.nih.gov/22365542/'],
  response:['The person and the situation belong together.','Attention, memory, goals and the surrounding situation interact. At work, clear expectations, communication and managerial support provide practical context for exploring working differences.','https://doi.org/10.1111/j.1744-6570.2005.00672.x']
 };
 function selectMeaning(key){const [title,copy,source]=meaning[key];q('#meaning-title').textContent=title;q('#meaning-copy').textContent=copy;q('#meaning-source').href=source;for(const b of root.querySelectorAll('[data-meaning]'))b.setAttribute('aria-pressed',String(b.dataset.meaning===key));for(const node of root.querySelectorAll('[data-meaning-node]'))node.classList.toggle('active',node.dataset.meaningNode===key);}
 for(const b of root.querySelectorAll('[data-meaning]'))b.addEventListener('click',()=>selectMeaning(b.dataset.meaning));
 const example=exploreName({firstName:'Amelia',lastName:'Morgan',age:35}),age=q('#signal-age');
 q('#signal-timeline').replaceChildren(...example.years.map(y=>{const b=make('button',undefined,'signal-year');b.type='button';b.dataset.age=y.age;b.setAttribute('aria-label',`Model age ${y.age}, first-name stage ${y.letter}, last-name stage ${y.surnameLetter}`);b.append(make('small',String(y.age)),make('strong',y.letter),make('span',y.surnameLetter));b.addEventListener('click',()=>{age.value=y.age;drawAge();});return b;}));
 function drawAge(){const selected=example.years.find(y=>y.age===Number(age.value));q('#signal-age-output').textContent=age.value;q('#signal-stage-description').textContent=`At model age ${selected.age}: first-name stage ${selected.letter} · last-name stage ${selected.surnameLetter}.`;
  const timeline=q('#signal-timeline');for(const b of timeline.children){const active=b.dataset.age===age.value;b.setAttribute('aria-pressed',String(active));if(active&&!q('[data-signal-panel="time"]').hidden){const delta=b.getBoundingClientRect().left-timeline.getBoundingClientRect().left;timeline.scrollLeft+=delta-(timeline.clientWidth-b.clientWidth)/2;}}
 }
 age.addEventListener('input',drawAge);drawAudio();selectMeaning('sound');drawAge();for(const b of views)b.disabled=false;
 const visibility=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)audio.pause();});visibility.observe(root);document.addEventListener('visibilitychange',()=>{if(document.hidden)audio.pause();});addEventListener('pagehide',()=>audio.pause());
}
