import {getDemoStory,getStoryMedia} from './illustrative-model.js';
import mediaConfig from './assets/demo/scan-videos.json' with {type:'json'};
const root=document.querySelector('[data-fit-experience]');
if(root){
 const q=s=>root.querySelector(s),form=q('#fit-form'),video=q('#fit-video'),result=q('#fit-result'),status=q('#fit-media-status');let run=0,selected=null,timeout=null;
 const key=()=>form.querySelector('[name="fictional-profile"]:checked').value;
 function stop(){run++;clearTimeout(timeout);video.pause();video.removeAttribute('src');video.replaceChildren();video.load();}
 function reset(){stop();selected=null;result.hidden=true;q('#fit-reveal').hidden=true;video.hidden=true;q('#fit-video-actions').hidden=true;status.textContent='';q('#find-out').disabled=false;}
 function showResult(message=''){clearTimeout(timeout);video.pause();if(message)status.textContent=message;result.hidden=false;q('#fit-video-actions').hidden=true;result.focus({preventScroll:true});result.scrollIntoView({behavior:'instant',block:'nearest'});}
 function mediaFallback(message){video.hidden=true;q('#fit-poster').hidden=false;showResult(message);}
 function fill(s){q('#fit-result-label').textContent=s.name+' + Jamie Reed · Scripted example';q('#fit-result-title').textContent=s.title;q('#fit-result-copy').textContent=s.summary;q('#fit-result-points').replaceChildren(...s.points.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));q('#fit-result-question').textContent=s.question;result.dataset.story=key();}
 async function play(){const current=run;try{await video.play();if(current!==run)return;status.textContent='Playing a fictional story. You can skip to the example result.';}catch{if(current!==run)return;status.textContent='Press Play video, use the video controls, or skip to the example result.';}}
 form.addEventListener('submit',e=>{e.preventDefault();reset();selected=key();const s=getDemoStory(selected),media=getStoryMedia(mediaConfig,selected);fill(s);q('#fit-reveal').hidden=false;q('#fit-poster-label').textContent=s.name+' · Fictional example';
  if(!media.src){q('#fit-poster').hidden=false;showResult('The scan video is being prepared. You can explore the scripted result below.');return;}
  video.hidden=false;q('#fit-poster').hidden=true;video.src=media.src;if(media.captions){const track=document.createElement('track');Object.assign(track,{kind:'captions',srclang:'en',label:'English',src:media.captions,default:true});video.append(track);}q('#fit-video-actions').hidden=false;video.load();status.textContent='Your fictional story is ready.';
  timeout=setTimeout(()=>{if(!result.hidden)return;if(video.readyState<2)mediaFallback('The video is taking longer to load. Here is the scripted result.');},8000);
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){status.textContent='Video is ready. Play it when you choose, or skip to the example result.';q('#fit-play').focus();}else play();
 });
 form.addEventListener('change',reset);q('#fit-play').addEventListener('click',play);q('#fit-skip').addEventListener('click',()=>showResult('Video skipped. Here is the scripted example.'));video.addEventListener('ended',()=>{if(selected)showResult('Fictional story complete. Explore the example below.');});video.addEventListener('error',()=>{if(selected)mediaFallback('The video could not play. Here is the scripted example.');});
 q('#fit-another').addEventListener('click',()=>{const other=key()==='alignment'?'differences':'alignment';form.querySelector(`[value="${other}"]`).checked=true;reset();form.querySelector(`[value="${other}"]`).focus();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();});addEventListener('pagehide',reset);reset();
}
