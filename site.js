const views = {
  timeline: {
    image:'./assets/screenshots/team-timeline.jpg', screen:'Your team, in perspective', kicker:'01 / THE BIGGER PICTURE',
    title:'See beyond<br>the org chart.', demoTitle:'Your people. The bigger picture.',
    copy:'Bring your team into one view. Explore relationships and individual context without losing sight of the people behind the business.',
    points:['A shared view for managers and HR','Team relationships alongside individual context','A starting point for your next people review'],
    alt:'Actual software dashboard showing a company overview, individual timelines and team comparisons. Fictional demo company.',
    prompt:'Bring more context to the decisions you make about your people.'
  },
  monthly: {
    image:'./assets/screenshots/monthly-review.jpg', screen:'People & support', kicker:'02 / PEOPLE WORTH INVESTING IN',
    title:'Keep the person<br>in the picture.', demoTitle:'Make room for a better check-in.',
    copy:'A busy workplace can leave little space for individual attention. The people review helps you prepare a focused conversation and explore where support may be useful.',
    points:['A review focused on a person and a month','Individual context behind the company overview','A place to begin support and development discussions'],
    alt:'Actual monthly people review with individual rows, a selected month and report links. Fictional demo company.',
    prompt:'Give managers another starting point for conversations about support, recognition and growth.'
  },
  report: {
    image:'./assets/screenshots/person-report.jpg', screen:'Individual insight', kicker:'03 / THE PERSON BEHIND THE ROLE',
    title:'The job title<br>is just the start.', demoTitle:'See the individual behind the role.',
    copy:'Explore individual reports and bring more context to coaching and working relationships. Invite the person to share what fits their experience and what they would describe differently.',
    points:['Individual reports to explore with your people','More context for coaching and collaboration','Printable views for a focused discussion'],
    alt:'Actual individual report with descriptive sections. Fictional demo person.',
    prompt:'Build a conversation around the person, not just their position in the company.'
  },
  workspace: {
    image:'./assets/screenshots/workspace.jpg', screen:'Hiring & teams', kicker:'04 / THE TEAM YOU ARE BUILDING',
    title:'Your next hire.<br>Your whole team.', demoTitle:'Bring hiring into the company picture.',
    copy:'Keep staff, applicants and jobs organised in a company workspace. Consider working relationships as you prepare interviews and plan a new colleague’s first weeks.',
    points:['Staff, applicants and jobs in one workspace','Team context alongside applicant discussions','A clearer starting point for onboarding plans'],
    alt:'Actual company workspace showing staff, applicant and job views. Fictional company records.',
    prompt:'Add team context to skills, experience and the requirements of the role.'
  }
};
const order=Object.keys(views);
const byId=id=>document.getElementById(id);
let selectedView='timeline', demoIndex=0;
const tabs=[...document.querySelectorAll('[data-view]')];
function fillList(element,items){element.replaceChildren(...items.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));}
function selectView(key,moveFocus=false){
  if(!views[key])return;
  selectedView=key;
  const view=views[key];
  for(const tab of tabs){const active=tab.dataset.view===key;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;if(active&&moveFocus)tab.focus();}
  byId('product-panel').setAttribute('aria-labelledby',`tab-${key}`);
  byId('product-image').src=view.image;byId('product-image').alt=view.alt;
  byId('screen-title').textContent=view.screen;byId('product-kicker').textContent=view.kicker;
  byId('product-title').innerHTML=view.title;byId('product-copy').textContent=view.copy;
  fillList(byId('product-points'),view.points);
  document.querySelector('[data-expand]').setAttribute('aria-label',`Enlarge the ${view.screen.toLowerCase()} screenshot`);
}
for(const tab of tabs){
  tab.addEventListener('click',()=>selectView(tab.dataset.view));
  tab.addEventListener('keydown',event=>{
    const index=tabs.indexOf(tab);
    const next=event.key==='ArrowRight'?(index+1)%tabs.length:event.key==='ArrowLeft'?(index+tabs.length-1)%tabs.length:event.key==='Home'?0:event.key==='End'?tabs.length-1:null;
    if(next!==null){event.preventDefault();selectView(tabs[next].dataset.view,true);}
  });
}

for(const link of document.querySelectorAll('[data-select-view]'))link.addEventListener('click',()=>selectView(link.dataset.selectView));

const nav=byId('main-nav'),menu=document.querySelector('.menu-toggle');
function closeMenu(){nav.classList.remove('is-open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';nav.classList.toggle('is-open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
nav.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
document.addEventListener('click',event=>{if(!event.target.closest('.site-header'))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});

const demo=byId('demo-dialog'),imageDialog=byId('image-dialog');
let demoOpener=null,imageOpener=null;
function updateDemo(){
  const key=order[demoIndex],view=views[key];
  byId('demo-step').textContent=`${String(demoIndex+1).padStart(2,'0')} / 04`;
  byId('demo-title').textContent=view.demoTitle;byId('demo-copy').textContent=view.copy;
  byId('demo-image').src=view.image;byId('demo-image').alt=view.alt;
  byId('demo-prompt').textContent=view.prompt;fillList(byId('demo-points'),view.points);
  byId('demo-back').disabled=demoIndex===0;
  byId('demo-next').innerHTML=demoIndex===order.length-1?'Try your connection <span aria-hidden="true">↗</span>':'Next view <span aria-hidden="true">→</span>';
  for(const dot of document.querySelectorAll('[data-demo-step]')){if(Number(dot.dataset.demoStep)===demoIndex)dot.setAttribute('aria-current','step');else dot.removeAttribute('aria-current');}
  demo.scrollTop=0;
}
function openDemo(opener){demoOpener=opener;demoIndex=0;updateDemo();closeMenu();demo.showModal();document.body.classList.add('modal-open');}
for(const button of document.querySelectorAll('[data-demo]'))button.addEventListener('click',()=>openDemo(button));
byId('demo-next').addEventListener('click',()=>{if(demoIndex===order.length-1){demoOpener=byId('a-name');demo.close();byId('try-it').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});byId('a-name').focus({preventScroll:true});}else{demoIndex++;updateDemo();}});
byId('demo-back').addEventListener('click',()=>{if(demoIndex>0){demoIndex--;updateDemo();}});
for(const button of document.querySelectorAll('[data-demo-step]'))button.addEventListener('click',()=>{demoIndex=Number(button.dataset.demoStep);updateDemo();});
document.querySelector('[data-close-demo]').addEventListener('click',()=>demo.close());
demo.addEventListener('close',()=>{document.body.classList.remove('modal-open');demoOpener?.focus();});
demo.addEventListener('click',event=>{if(event.target===demo)demo.close();});
function enlarge(key,opener){
  const view=views[key];if(!view)return;
  imageOpener=opener;byId('image-dialog-title').textContent=view.screen;
  byId('expanded-image').src=view.image;byId('expanded-image').alt=view.alt;
  imageDialog.showModal();document.body.classList.add('modal-open');
}
document.querySelector('[data-expand]').addEventListener('click',event=>enlarge(selectedView,event.currentTarget));
for(const button of document.querySelectorAll('[data-image]'))button.addEventListener('click',()=>enlarge(button.dataset.image,button));
document.querySelector('[data-close-image]').addEventListener('click',()=>imageDialog.close());
imageDialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');imageOpener?.focus();});
imageDialog.addEventListener('click',event=>{if(event.target===imageDialog)imageDialog.close();});

const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
// The page is fully visible without JavaScript or when motion is reduced.
if('IntersectionObserver' in window&&!reducedMotion.matches){
  document.documentElement.classList.add('js-ready');
  const revealObserver=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('revealed');revealObserver.unobserve(entry.target);}},{threshold:.08});
  for(const element of document.querySelectorAll('[data-reveal]'))revealObserver.observe(element);
}
const screen=document.querySelector('[data-tilt]');
screen.addEventListener('pointermove',event=>{
  if(reducedMotion.matches||event.pointerType!=='mouse')return;
  const rect=screen.getBoundingClientRect(),x=(event.clientX-rect.left)/rect.width-.5,y=(event.clientY-rect.top)/rect.height-.5;
  screen.style.transform=`rotateY(${-12+x*5}deg) rotateX(${7-y*4}deg) rotateZ(-3deg)`;
});
screen.addEventListener('pointerleave',()=>{screen.style.transform='';});

// Lightweight 3D projection: a sphere and orbit rings, with no external runtime.
const canvas=byId('people-orbit'),ctx=canvas.getContext('2d');
let orbitVisible=true,frame=0,lastDraw=0,phase=0;
function drawOrbit(time=0){
  if(!ctx)return;
  const rect=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);
  if(!rect.width||!rect.height)return;
  const w=rect.width,h=rect.height;
  if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
  const radius=Math.min(w,h)*.29,cx=w*.59,cy=h*.48;
  phase=reducedMotion.matches?.45:time*.000075;
  const project=(x,y,z,tilt=.63)=>{
    const a=x*Math.cos(phase)-z*Math.sin(phase),c=x*Math.sin(phase)+z*Math.cos(phase);
    const b=y*Math.cos(tilt)-c*Math.sin(tilt),depth=y*Math.sin(tilt)+c*Math.cos(tilt),scale=390/(390-depth);
    return {x:cx+a*scale,y:cy+b*scale,z:depth};
  };
  const gradient=ctx.createRadialGradient(cx-radius*.42,cy-radius*.45,2,cx,cy,radius);
  gradient.addColorStop(0,'#d2e4b6');gradient.addColorStop(.28,'#acc791');gradient.addColorStop(.67,'#6f926c');gradient.addColorStop(1,'#426b56');
  ctx.beginPath();ctx.arc(cx,cy,radius,0,Math.PI*2);ctx.fillStyle=gradient;ctx.fill();
  ctx.save();ctx.beginPath();ctx.arc(cx,cy,radius,0,Math.PI*2);ctx.clip();
  for(let latitude=-5;latitude<=5;latitude++){
    const lat=latitude*Math.PI/13;ctx.beginPath();
    for(let i=0;i<=72;i++){const angle=i/72*Math.PI*2,p=project(radius*Math.cos(lat)*Math.cos(angle),radius*Math.sin(lat),radius*Math.cos(lat)*Math.sin(angle));if(i===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);}
    ctx.strokeStyle='#e4efcd50';ctx.lineWidth=.6;ctx.stroke();
  }
  for(let longitude=0;longitude<16;longitude++){
    const lng=longitude/16*Math.PI*2;ctx.beginPath();
    for(let i=0;i<=36;i++){const lat=-Math.PI/2+i/36*Math.PI,p=project(radius*Math.cos(lat)*Math.cos(lng),radius*Math.sin(lat),radius*Math.cos(lat)*Math.sin(lng));if(i===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);}
    ctx.strokeStyle='#e5edcd38';ctx.lineWidth=.65;ctx.stroke();
  }
  ctx.restore();
  for(let ring=0;ring<2;ring++){
    const r=radius*(1.38+ring*.15);ctx.beginPath();
    for(let i=0;i<=120;i++){const angle=i/120*Math.PI*2,p=project(Math.cos(angle)*r,Math.sin(angle)*r,0,ring?1.15:.35);if(i===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);}
    ctx.strokeStyle=ring?'#8ea27570':'#b5b976b0';ctx.lineWidth=ring?.7:1;ctx.stroke();
    const angle=phase*2.4+ring*2.7,p=project(Math.cos(angle)*r,Math.sin(angle)*r,0,ring?1.15:.35);
    ctx.beginPath();ctx.arc(p.x,p.y,ring?4:6,0,Math.PI*2);ctx.fillStyle=ring?'#294e3c':'#bbae69';ctx.fill();
  }
}
function animate(time){frame=0;if(!orbitVisible||document.hidden||reducedMotion.matches)return;if(time-lastDraw>40){drawOrbit(time);lastDraw=time;}frame=requestAnimationFrame(animate);}
function startOrbit(){if(frame)cancelAnimationFrame(frame);frame=0;drawOrbit();if(orbitVisible&&!document.hidden&&!reducedMotion.matches)frame=requestAnimationFrame(animate);}
if('IntersectionObserver' in window){const orbitObserver=new IntersectionObserver(entries=>{orbitVisible=entries[0].isIntersecting;startOrbit();});orbitObserver.observe(canvas);}
new ResizeObserver(()=>drawOrbit()).observe(canvas);
document.addEventListener('visibilitychange',startOrbit);
reducedMotion.addEventListener('change',()=>{screen.style.transform='';if(reducedMotion.matches)for(const element of document.querySelectorAll('[data-reveal]'))element.classList.add('revealed');startOrbit();});
startOrbit();
