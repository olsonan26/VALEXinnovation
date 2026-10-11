// Screenshot fixture: real production renderers, fictional records, no persistence.
import {installChartExamples} from '../../chart-data.js';
import {createWorkspace} from '../../workspace.js';
import {createChartWorkspace} from '../../charts.js';
const db={clients:[{id:'22',Client:'Northstar Studio · Demo'}],staff:[],applicants:[],jobs:[],users:[],activeClient:'22',account:{Display:'Alex'}};
installChartExamples(db);
db.staff=db.staff.slice(0,15);
db.jobs=db.jobs.slice(0,3);
const job=db.jobs[2];
job.Job='Northstar Studio · Team overview';
const root=document.querySelector('#root'),dialogs=document.querySelector('#dialogs');
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const visible=group=>(db[group]||[]).filter(row=>row.client===db.activeClient);
const modal=body=>{dialogs.innerHTML='<div class="modal-backdrop-local"></div>'+body;};
const closeDialog=()=>{dialogs.innerHTML='';};
const noop=()=>{};
const action=(name,person)=>{const button=document.createElement('button');button.dataset.chartAction=name;if(person)button.dataset.person=person;chart.handleClick({target:button,preventDefault:noop});};
const workspace=createWorkspace({db,root,visible,client:()=>db.clients[0].Client,go:noop,persist:()=>true,esc,modal,confirmDelete:noop,copyJob:noop,openPerson:noop,startTour:noop});
const chart=createChartWorkspace({db,root,modal,closeDialog,go:noop,notify:noop,visible,esc,persist:()=>true,canVerifyTimeline:()=>false});
const view=new URLSearchParams(location.search).get('view')||'timeline';
if(view==='overview')workspace.update('dashboard');
else{
  root.innerHTML='<div data-results-host></div>';
  chart.render(job);
  workspace.update('jobs',job.id,true);
  if(view==='people')action('pressure-people');
  if(view==='report')action('report',db.staff[0].id);
  if(view==='chart')action('chart',db.staff[0].id);
}
document.addEventListener('click',event=>{if(event.target.closest('[data-close]'))closeDialog();else chart.handleClick(event);});
document.addEventListener('input',chart.handleInput);
document.addEventListener('change',chart.handleChange);
