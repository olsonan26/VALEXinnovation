import './proof.js';
import './personal-ui.js';
import './illustrative-ui.js';
const example=document.getElementById('load-example'),form=document.getElementById('pair-form');
example.disabled=false;
example.addEventListener('click',()=>form.requestSubmit());

if(location.hash==='#two-person'){document.getElementById('real-comparison').open=true;document.getElementById('two-person').scrollIntoView({block:'start'});}
