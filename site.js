const el=id=>document.getElementById(id);
const menu=document.querySelector('.menu-toggle'),nav=el('main-nav');
function closeMenu(){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');nav.classList.remove('open');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');nav.classList.toggle('open',open);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){closeMenu();menu.focus();}});
document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))closeMenu();});
matchMedia('(min-width: 1200px)').addEventListener('change',closeMenu);
if(el('personal-form'))import('./personal-ui.js');
if(el('pair-form'))import('./proof.js');
if(el('product-panel'))import('./product.js');
if(el('name-wave')||el('clock-form'))import('./science-ui.js');
for(const story of document.querySelectorAll('[data-company-story]'))for(const button of story.querySelectorAll('[data-company]'))button.addEventListener('click',()=>{
 const supportive=button.dataset.company==='b';for(const b of story.querySelectorAll('[data-company]'))b.setAttribute('aria-pressed',String(b===button));story.classList.toggle('supportive',supportive);
 el('company-title').textContent=supportive?'Capable person. Supportive conditions.':'Capable person. Difficult conditions.';
 const conditions=supportive?['Clear expectations','Constructive communication','Appropriate autonomy','Supportive management']:['Unclear expectations','Communication friction','Limited autonomy','Little managerial support'];
 el('company-conditions').replaceChildren(...conditions.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
 el('company-outcome').textContent=supportive?'These conditions can help a capable person contribute and collaborate. VALEX offers an additional framework for exploring people conversations.':'These conditions can make it harder to contribute, even when technical ability is strong.';
});
const brain=document.querySelector('[data-brain]');
if(brain){const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){observer.disconnect();import('./brain-scene.js').then(m=>m.mountBrain(brain)).catch(()=>{brain.querySelector('.viewer-status').textContent='Static anatomical view. Interactive graphics unavailable.';});}},{rootMargin:'250px'});observer.observe(brain);}
if(el('two-person')&&location.hash==='#two-person')el('two-person').open=true;
if(el('inquiry-form')){
 const form=el('inquiry-form');let request='';
 function clear(){request='';el('inquiry-result').hidden=true;el('inquiry-preview').textContent='';el('inquiry-mail').href='mailto:Valexinnovations@gmail.com';}
 form.addEventListener('input',clear);
 form.addEventListener('submit',e=>{e.preventDefault();const data=new FormData(form);request=`Platform demonstration request\n\nName: ${data.get('name')}\nBusiness email: ${data.get('email')}\nCompany: ${data.get('company')}\nRole: ${data.get('role')||'Not provided'}\n\nWhat we would like to explore:\n${data.get('goal')}`;el('inquiry-preview').textContent=request;el('inquiry-mail').href=`mailto:Valexinnovations@gmail.com?subject=${encodeURIComponent('VALEX platform demonstration request')}&body=${encodeURIComponent(request)}`;el('inquiry-result').hidden=false;el('inquiry-result').focus();});
 el('inquiry-download').addEventListener('click',()=>{if(!request)return;const url=URL.createObjectURL(new Blob([request],{type:'text/plain;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='VALEX-demo-request.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
 el('inquiry-clear').addEventListener('click',()=>{form.reset();clear();el('inquiry-name').focus();});
 addEventListener('pageshow',()=>{form.reset();clear();});
}
