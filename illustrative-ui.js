import {demoProfiles,getDemoProfile,nextDemoProfile,getDemoStory,getStoryMedia} from './illustrative-model.js';
import mediaConfig from './assets/demo/scan-videos.json' with {type:'json'};
const root=document.querySelector('[data-fit-experience]');
if(root){
 const q=s=>root.querySelector(s),form=q('#fit-form'),picker=q('#fit-profile'),video=q('#fit-video'),result=q('#fit-result'),status=q('#fit-media-status');let run=0,selected=null,timeout=null;
 const key=()=>picker.value;
 function stop(){run++;clearTimeout(timeout);video.pause();video.removeAttribute('src');video.replaceChildren();video.load();}
 function reset(){stop();selected=null;result.hidden=true;q('#fit-reveal').hidden=true;video.hidden=true;q('#fit-video-actions').hidden=true;q('#fit-play').hidden=true;q('#fit-outcome-icon').hidden=true;status.textContent='';delete status.dataset.notice;q('#find-out').disabled=false;}
 function showProfile(){const p=getDemoProfile(key());q('#fit-sample-name').textContent=p.calledName;q('#fit-sample-avatar').textContent=p.calledName.split(' ').map(n=>n[0]).join('');q('#fit-sample-count').textContent=`Example ${demoProfiles.indexOf(p)+1} of ${demoProfiles.length}`;}
 function choose(step){picker.value=nextDemoProfile(key(),step).id;reset();showProfile();}
 function showResult(message=''){clearTimeout(timeout);video.pause();if(message)status.textContent=message;result.hidden=false;q('#fit-video-actions').hidden=true;result.focus({preventScroll:true});result.scrollIntoView({behavior:'instant',block:'start'});}
 function mediaFallback(message){video.hidden=true;q('#fit-poster').hidden=false;status.dataset.notice='true';showResult(message);}
 function fill(s){q('#fit-result-label').textContent=s.name+' + Jamie Reed · Calculated model result';q('#fit-result-title').textContent=s.title;q('#fit-result-copy').textContent=s.summary;q('#fit-result-points').replaceChildren(...s.points.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));q('#fit-result-question').textContent=s.question;result.dataset.outcome=s.outcome;result.dataset.profile=s.profile.id;const icon=q('#fit-outcome-icon');icon.textContent=s.outcome==='alignment'?'✓':'×';icon.dataset.outcome=s.outcome;icon.hidden=false;}
 async function play(){const current=run;try{await video.play();if(current!==run)return;q('#fit-play').hidden=true;delete status.dataset.notice;status.textContent='The scan illustration is playing.';}catch{if(current!==run)return;q('#fit-play').hidden=false;status.dataset.notice='true';status.textContent='Press Start scan to begin, or show the result now.';}}
 form.addEventListener('submit',e=>{e.preventDefault();reset();selected=getDemoStory(key());const media=getStoryMedia(mediaConfig,selected.outcome);fill(selected);q('#fit-reveal').hidden=false;q('#fit-poster-label').textContent=selected.name+' · Fictional profile';
  if(!media.src){q('#fit-poster').hidden=false;status.dataset.notice='true';showResult(selected.outcome==='differences'?'The X scan video is coming soon. The calculated no-match result is shown now.':'The video is unavailable. The calculated result is shown now.');return;}
  video.hidden=false;q('#fit-poster').hidden=true;video.src=media.src;q('#fit-video-actions').hidden=false;video.load();status.textContent='The calculation is complete. Your scan illustration is ready.';
  timeout=setTimeout(()=>{if(!result.hidden)return;if(video.readyState<2)mediaFallback('The video is taking longer to load. Here is the calculated result.');},8000);
  q('.fit-scan-stage').scrollIntoView({behavior:'instant',block:'center'});
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){q('#fit-play').hidden=false;status.dataset.notice='true';status.textContent='Start the scan when you choose, or show the calculated result.';q('#fit-play').focus();}else play();
 });
 picker.addEventListener('change',()=>{reset();showProfile();});q('#fit-previous').addEventListener('click',()=>choose(-1));q('#fit-next').addEventListener('click',()=>choose(1));q('#fit-play').addEventListener('click',play);q('#fit-skip').addEventListener('click',()=>showResult('Video skipped. Here is the calculated result.'));video.addEventListener('ended',()=>{if(selected)showResult('Scan illustration complete. Here is the calculated result.');});video.addEventListener('error',()=>{if(selected)mediaFallback('The video could not play. Here is the calculated result.');});
 q('#fit-another').addEventListener('click',()=>{choose(1);picker.focus();});
 video.addEventListener('pause',()=>{if(selected&&result.hidden&&!video.hidden&&video.getAttribute('src')){q('#fit-play').hidden=false;status.dataset.notice='true';status.textContent='Scan paused. Start scan to continue, or show the result.';}});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();});addEventListener('pagehide',reset);reset();showProfile();
}
