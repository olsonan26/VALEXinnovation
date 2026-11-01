
"use strict";
(function(){
 const $=id=>document.getElementById(id);
 const menu=document.querySelector(".eco-menu-button"),mobile=$("eco-mobile-menu");
 if(menu&&mobile){
   function close(){mobile.hidden=true;menu.setAttribute("aria-expanded","false");menu.setAttribute("aria-label","Open menu");}
   menu.addEventListener("click",()=>{mobile.hidden=!mobile.hidden;menu.setAttribute("aria-expanded",String(!mobile.hidden));menu.setAttribute("aria-label",mobile.hidden?"Open menu":"Close menu");});
   document.addEventListener("keydown",e=>{if(e.key==="Escape"){close();menu.focus();}});
   window.addEventListener("resize",()=>{if(window.innerWidth>1080)close();});
 }
 const money=n=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(n);
 const employees=$("eco-employees"),reports=$("eco-reports"),setup=$("eco-setup");
 if(employees&&reports&&setup){
   const clamp=el=>{const n=Number(el.value);return Number.isFinite(n)?Math.max(0,Math.min(100000,Math.floor(n))):0;};
   function update(){
     const n=clamp(employees),r=clamp(reports),monthly=39+n*2+r*9,first=monthly+(setup.checked?150:0);
     $("eco-monthly-total").textContent=money(monthly);
     $("eco-first-total").textContent=money(first);
     $("eco-calc-breakdown").textContent="Platform $39 + "+n+" employees "+money(n*2)+" + "+r+" reports "+money(r*9);
   }
   for(const node of [employees,reports,setup])node.addEventListener("input",update);
   update();
 }
 const wizard=$("eco-assessment");
 if(wizard){
   const steps=Array.from(wizard.querySelectorAll(".eco-form-step"));
   const progress=Array.from(document.querySelectorAll("[data-progress]"));
   const prev=$("eco-prev"),next=$("eco-next"),reset=$("eco-start-over"),error=$("eco-form-error");
   let current=0;
   function show(index){
     current=index;
     steps.forEach((node,i)=>node.hidden=i!==current);
     progress.forEach((node,i)=>{node.classList.toggle("active",i===current);node.classList.toggle("done",i<current);});
     prev.hidden=current===0||current===3;
     next.hidden=current===3;
     reset.hidden=current!==3;
     error.hidden=true;
     if(index===3)renderResult();
   }
   function validStep(){
     if(current===1){
       if(!wizard.querySelector('input[name="goal"]:checked')){error.textContent="Choose what you'd like to explore.";error.hidden=false;return false;}
       return true;
     }
     const required=Array.from(steps[current].querySelectorAll("[required]"));
     for(const field of required){
       if(!field.checkValidity()){
         error.textContent="Complete the required fields before continuing.";
         error.hidden=false;field.focus();field.reportValidity();return false;
       }
     }
     error.hidden=true;return true;
   }
   function renderResult(){
     const data=new FormData(wizard);
     const company=String(data.get("company")||"Your company").trim();
     const name=String(data.get("name")||"").trim();
     const email=String(data.get("email")||"").trim();
     const size=String(data.get("headcount")||"").trim();
     const industry=String(data.get("industry")||"").trim();
     const goal=String(data.get("goal")||"").trim();
     const box=$("eco-assessment-result");box.replaceChildren();
     const title=document.createElement("h3");title.textContent=company+": recommended first look";box.append(title);
     const intro=document.createElement("p");intro.textContent="For a team of approximately "+size+" in "+industry.toLowerCase()+", a sensible starting point is to explore: ";box.append(intro);
     const list=document.createElement("ul");
     const recommendations={
       "Team communication":["The two-person comparison demonstration.","The team timeline and person views.","A conversation with the people involved to test what does and does not fit."],
       "Manager check-ins":["An individual report screenshot.","The monthly review workspace.","Discussion prompts for one-to-one check-ins."],
       "Onboarding conversations":["The existing staff and applicant workspace.","A two-person fictional comparison.","A manager-led onboarding discussion alongside job-related information."],
       "Exploring the platform":["The main Staff Profiler workspace.","The interactive fictional-person Explorer.","The proposed pricing structure."]
     };
     for(const suggestion of (recommendations[goal]||recommendations["Exploring the platform"])){
       const li=document.createElement("li");li.textContent=suggestion;list.append(li);
     }
     box.append(list);
     const limit=document.createElement("p");limit.textContent="This is a suggested product tour, not a Lettrology result, employment recommendation or analysis of your employees.";box.append(limit);
     const body=["Staff Profiler — request for information","","Contact: "+name,"Business email: "+email,"Company: "+company,"Approximate staff: "+size,"Industry: "+industry,"Goal: "+goal,"","Please contact me about a demonstration. I have not included employee details."].join("\n");
     $("eco-assessment-email").href="mailto:Valexinnovations@gmail.com?subject="+encodeURIComponent("Staff Profiler assessment inquiry")+"&body="+encodeURIComponent(body);
   }
   next.addEventListener("click",()=>{if(validStep())show(Math.min(current+1,3));});
   prev.addEventListener("click",()=>show(Math.max(0,current-1)));
   wizard.addEventListener("reset",()=>{queueMicrotask(()=>show(0));});
   wizard.addEventListener("submit",e=>e.preventDefault());
   show(0);
 }
 const consultation=$("eco-consultation");
 if(consultation){
   const result=$("eco-consult-result"),preview=$("eco-consult-preview"),mail=$("eco-consult-mail");
   consultation.addEventListener("submit",event=>{
     event.preventDefault();
     if(!consultation.reportValidity())return;
     const data=new FormData(consultation);
     const body=["VALEX — inquiry","","Name: "+data.get("name"),"Business email: "+data.get("email"),"Company: "+(data.get("company")||"Not specified"),"Request: "+data.get("service"),"","Message:",""+data.get("details"),"","I understand this is a request, not a confirmed booking."].join("\n");
     preview.textContent=body;
     mail.href="mailto:Valexinnovations@gmail.com?subject="+encodeURIComponent("VALEX consultation inquiry")+"&body="+encodeURIComponent(body);
     result.hidden=false;result.scrollIntoView({block:"nearest",behavior:"smooth"});
   });
   consultation.addEventListener("input",()=>{result.hidden=true;});
 }
})();
