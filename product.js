if(document.getElementById('product-panel')){
const views = {
  timeline: {
    image:'/assets/screenshots/team-timeline.jpg', screen:'Team overview', kicker:'Review your team',
    title:'Prepare for your<br>next people review.', demoTitle:'See the team, then open a person’s report.',
    copy:'View the team’s timelines together, then open an individual report or comparison. Use those views to choose the people and questions to focus on during a review.',
    points:['A shared view for managers and HR','Individual reports and comparisons accessible from the team view','A starting point for your next people review'],
    alt:'Actual software dashboard showing a company overview, individual timelines and team comparisons. Fictional demo company.',
    prompt:'Before a team review, decide which reports to read and which questions to ask.'
  },
  monthly: {
    image:'/assets/screenshots/monthly-review.jpg', screen:'Monthly review', kicker:'Prepare a staff check-in',
    title:'Make time for<br>the individual.', demoTitle:'Make room for a better check-in.',
    copy:'A busy workplace can leave little space for individual attention. The people review helps you prepare a focused conversation and explore where support may be useful.',
    points:['A review focused on a person and a month','Open a person’s report from the monthly review','A place to begin support and development discussions'],
    alt:'Actual monthly people review with individual rows, a selected month and report links. Fictional demo company.',
    prompt:'Use the report to prepare questions about support, recognition and development.'
  },
  report: {
    image:'/assets/screenshots/person-report.jpg', screen:'Individual reports', kicker:'Prepare questions for one person',
    title:'The job title<br>is just the start.', demoTitle:'See the individual behind the role.',
    copy:'Read the individual report before a check-in or coaching session. Choose a few points to discuss and ask the person what fits their experience and what they would describe differently.',
    points:['Individual reports to explore with your people','Questions to discuss in coaching and staff check-ins','Printable views for a focused discussion'],
    alt:'Actual individual report with descriptive sections. Fictional demo person.',
    prompt:'Build a conversation around the person, not just their position in the company.'
  },
  workspace: {
    image:'/assets/screenshots/workspace.jpg', screen:'Applicants & jobs', kicker:'Prepare interviews and onboarding',
    title:'Your next hire.<br>Your whole team.', demoTitle:'Keep applicants, jobs and staff in one place.',
    copy:'Keep staff, applicants and jobs organised in a company workspace. Consider working relationships as you prepare interviews and plan a new colleague’s first weeks.',
    points:['Staff, applicants and jobs in one workspace','Profile comparisons to discuss alongside skills and experience','A clearer starting point for onboarding plans'],
    alt:'Actual company workspace showing staff, applicant and job views. Fictional company records.',
    prompt:'Use a profile comparison to prepare interview questions alongside the CV and role requirements.'
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

const demo=byId('demo-dialog'),imageDialog=byId('image-dialog');
let demoOpener=null,imageOpener=null;
function updateDemo(){
  const key=order[demoIndex],view=views[key];
  byId('demo-step').textContent=`${String(demoIndex+1).padStart(2,'0')} / 04`;
  byId('demo-title').textContent=view.demoTitle;byId('demo-copy').textContent=view.copy;
  byId('demo-image').src=view.image;byId('demo-image').alt=view.alt;
  byId('demo-prompt').textContent=view.prompt;fillList(byId('demo-points'),view.points);
  byId('demo-back').disabled=demoIndex===0;
  byId('demo-next').innerHTML=demoIndex===order.length-1?'Compare two profiles <span aria-hidden="true">↗</span>':'Next view <span aria-hidden="true">→</span>';
  for(const dot of document.querySelectorAll('[data-demo-step]')){if(Number(dot.dataset.demoStep)===demoIndex)dot.setAttribute('aria-current','step');else dot.removeAttribute('aria-current');}
  demo.scrollTop=0;
}
function openDemo(opener){demoOpener=opener;demoIndex=0;updateDemo();demo.showModal();document.body.classList.add('modal-open');}
for(const button of document.querySelectorAll('[data-demo]'))button.addEventListener('click',()=>openDemo(button));
byId('demo-next').addEventListener('click',()=>{if(demoIndex===order.length-1){demo.close();location.assign('/explorer/');}else{demoIndex++;updateDemo();}});
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


}
