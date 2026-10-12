import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {brainRegions,studies} from './content/research.mjs';

export async function mountBrain(root){
 const q=s=>root.querySelector(s),canvas=q('canvas'),stage=q('.brain-stage'),status=q('.viewer-status'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let renderer;try{renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});}catch{status.textContent='Static anatomical view. WebGL unavailable.';setupDescriptions();disableGraphics();return;}
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(32,1,1,2000),model=new THREE.Group();scene.add(model);
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
 const controls=new OrbitControls(camera,canvas);controls.enablePan=false;controls.enableDamping=false;controls.minDistance=235;controls.maxDistance=690;controls.target.set(0,-50,0);
 const initial=new THREE.Vector3(300,65,-410);camera.position.copy(initial);controls.update();
 scene.add(new THREE.AmbientLight(0xb7cde0,.65));
 for(const [colour,intensity,x,y,z] of [[0xe7efff,2.1,-180,200,-200],[0x56d4de,2.5,150,30,80],[0xd8b878,1.7,0,-60,-200]]){const light=new THREE.DirectionalLight(colour,intensity);light.position.set(x,y,z);scene.add(light);}
 let records=[];try{const response=await fetch('/assets/anatomy/head-brain.json');if(!response.ok)throw new Error('Anatomy unavailable');records=(await response.json()).meshes;}catch{status.textContent='Static anatomical view. Anatomy could not load.';renderer.dispose();setupDescriptions();disableGraphics();return;}
 const meshes=[];
 for(const record of records){
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(record.positions,3));geometry.setIndex(record.indices);geometry.computeVertexNormals();
  const head=record.category==='head';
  const material=head?new THREE.MeshPhysicalMaterial({color:0x8ba7b7,metalness:.25,roughness:.3,transparent:true,opacity:.12,depthWrite:false,side:THREE.DoubleSide}):new THREE.MeshStandardMaterial({color:record.category==='cerebellum'?0x6b859c:0x8aa7ba,metalness:.25,roughness:.4,transparent:true,opacity:.84});
  const mesh=new THREE.Mesh(geometry,material);mesh.userData=record;mesh.renderOrder=head?3:1;model.add(mesh);meshes.push(mesh);
 }
 const overlay=new THREE.Group();model.add(overlay);const paths=[],sparks=[];
 const structures=meshes.filter(m=>['amygdala','hippocampus','frontal','auditory','self'].includes(m.userData.category));
 const centres={};for(const r of brainRegions){const group=structures.filter(m=>m.userData.category===r.id),box=new THREE.Box3();for(const mesh of group)box.union(new THREE.Box3().setFromObject(mesh));centres[r.id]=box.getCenter(new THREE.Vector3());}
 for(const [a,b] of [['auditory','hippocampus'],['hippocampus','frontal'],['amygdala','frontal'],['self','frontal']]){
  const p1=centres[a],p2=centres[b],mid=p1.clone().lerp(p2,.5).add(new THREE.Vector3(30,25,-30));const curve=new THREE.QuadraticBezierCurve3(p1,mid,p2);paths.push(curve);
  const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(50)),new THREE.LineBasicMaterial({color:0x56d4de,transparent:true,opacity:.38,depthTest:false}));line.renderOrder=4;overlay.add(line);
  const spark=new THREE.Mesh(new THREE.SphereGeometry(1.8,8,6),new THREE.MeshBasicMaterial({color:0xd8faff,depthTest:false}));spark.renderOrder=5;overlay.add(spark);sparks.push(spark);
 }
 let selected=null,visible=true,frame=0,tourTimer=null,tourIndex=0,disposed=false,lastDraw=0,staticView=false,viewWidth=600,viewHeight=650;
 q('[data-motion]').checked=!reduced.matches;
 function setupDescriptions(){for(const b of root.querySelectorAll('[data-region]'))b.addEventListener('click',()=>describe(b.dataset.region));}
 function disableGraphics(){for(const n of root.querySelectorAll('[data-rotate],[data-zoom],[data-overlay],[data-motion],[data-tour],[data-reset],[data-static],[data-pause]'))n.disabled=true;q('[data-static]').textContent='Static view';canvas.hidden=true;}
 function describe(id){const r=brainRegions.find(r=>r.id===id);if(!r)return;q('[data-region-title]').textContent=r.name;q('[data-region-copy]').textContent=r.copy;q('[data-region-source]').href=studies.find(s=>s.id===r.source).url;for(const b of root.querySelectorAll('[data-region]'))b.setAttribute('aria-pressed',String(b.dataset.region===id));}
 function select(id){selected=id;describe(id);const colour=brainRegions.find(r=>r.id===id).colour;
  for(const mesh of meshes){if(mesh.userData.category==='head')continue;const active=mesh.userData.category===id||(id==='self'&&mesh.userData.category==='frontal');mesh.material.color.set(active?colour:0x8a9baa);mesh.material.emissive.set(active?colour:0x000000);mesh.material.emissiveIntensity=active?.27:0;mesh.material.opacity=active?.98:.16;mesh.material.depthWrite=active;mesh.renderOrder=active?2:1;}
  requestRender();
 }
 function stopTour(){clearTimeout(tourTimer);tourTimer=null;q('[data-tour]').textContent='Guided tour';q('[data-tour]').setAttribute('aria-pressed','false');}
 function draw(){renderer.render(scene,camera);const label=q('.brain-leaders');label.setAttribute('viewBox',`0 0 ${viewWidth} ${viewHeight}`);label.replaceChildren();if(selected){const p=centres[selected].clone().applyMatrix4(model.matrixWorld).project(camera);if(p.z<1){const x=(p.x+1)*viewWidth/2,y=(1-p.y)*viewHeight/2,endX=viewWidth-24,labelY=Math.max(45,Math.min(viewHeight-65,y-35));const ns='http://www.w3.org/2000/svg';const line=document.createElementNS(ns,'path');line.setAttribute('d',`M${x},${y} L${Math.min(endX-40,x+55)},${labelY} L${endX},${labelY}`);line.setAttribute('stroke','#d8b878');line.setAttribute('fill','none');label.append(line);const text=document.createElementNS(ns,'text');text.setAttribute('x',String(endX-8));text.setAttribute('y',String(labelY-8));text.setAttribute('text-anchor','end');text.setAttribute('fill','#eef4f8');text.textContent=brainRegions.find(r=>r.id===selected).name;label.append(text);}}}
 function run(time){frame=0;if(disposed||!visible||document.hidden||staticView)return;const moving=q('[data-motion]').checked&&!reduced.matches&&overlay.visible;
  if(moving)sparks.forEach((s,i)=>s.position.copy(paths[i].getPoint((time/5000+i*.21)%1)));
  if(!moving||time-lastDraw>33){draw();lastDraw=time;}if(moving)frame=requestAnimationFrame(run);
 }
 function requestRender(){if(!frame&&!disposed&&visible&&!document.hidden)frame=requestAnimationFrame(run);}
 function reset(){stopTour();selected=null;camera.position.copy(initial);controls.target.set(0,-50,0);controls.update();q('[data-zoom]').value=15;
  for(const mesh of meshes){if(mesh.userData.category==='head')continue;mesh.material.color.set(mesh.userData.category==='cerebellum'?0x6b859c:0x8aa7ba);mesh.material.emissive.set(0);mesh.material.opacity=.84;mesh.material.depthWrite=true;mesh.renderOrder=1;}
  for(const b of root.querySelectorAll('[data-region]'))b.setAttribute('aria-pressed','false');q('[data-region-title]').textContent='Many systems. One person.';q('[data-region-copy]').textContent='Memory, emotion, decision-making and self-relevance involve distributed systems. Explore five territories in this anatomical atlas.';q('[data-region-source]').href='/science/#established';requestRender();
 }
 for(const b of root.querySelectorAll('[data-region]'))b.addEventListener('click',()=>{stopTour();select(b.dataset.region);});
 for(const b of root.querySelectorAll('[data-rotate]'))b.addEventListener('click',()=>{stopTour();const vector=camera.position.clone().sub(controls.target);vector.applyAxisAngle(new THREE.Vector3(0,1,0),b.dataset.rotate==='left'?.3:-.3);camera.position.copy(controls.target).add(vector);controls.update();requestRender();});
 q('[data-zoom]').addEventListener('input',e=>{stopTour();const direction=camera.position.clone().sub(controls.target).normalize();camera.position.copy(controls.target).add(direction.multiplyScalar(570-Number(e.target.value)*3.2));controls.update();requestRender();});
 q('[data-reset]').addEventListener('click',reset);
 q('[data-static]').setAttribute('aria-pressed','false');
 q('[data-static]').addEventListener('click',()=>{staticView=!staticView;stopTour();root.classList.toggle('brain-static',staticView);q('[data-static]').textContent=staticView?'Use interactive view':'Use static view';q('[data-static]').setAttribute('aria-pressed',String(staticView));canvas.setAttribute('aria-hidden',String(staticView));canvas.tabIndex=staticView?-1:0;for(const n of root.querySelectorAll('[data-rotate],[data-zoom],[data-overlay],[data-motion],[data-tour],[data-reset],[data-pause]'))n.disabled=staticView;status.textContent=staticView?'Static anatomical view · region descriptions remain available':'Drag to rotate · choose a region';if(staticView){cancelAnimationFrame(frame);frame=0;}else requestRender();});
 q('[data-overlay]').addEventListener('change',e=>{overlay.visible=e.target.checked;requestRender();});
 q('[data-motion]').addEventListener('change',requestRender);
 function pauseLabel(){const b=q('[data-pause]');if(b){b.textContent=q('[data-motion]').checked?'Pause signals':'Play signals';b.setAttribute('aria-pressed',String(!q('[data-motion]').checked));}}
 if(q('[data-pause]')){q('[data-pause]').disabled=false;pauseLabel();q('[data-pause]').addEventListener('click',()=>{q('[data-motion]').checked=!q('[data-motion]').checked;pauseLabel();requestRender();});q('[data-motion]').addEventListener('change',pauseLabel);}
 q('[data-tour]').setAttribute('aria-pressed','false');
 q('[data-tour]').addEventListener('click',()=>{if(tourTimer){stopTour();return;}if(reduced.matches){select(brainRegions[tourIndex++%brainRegions.length].id);return;}
  q('[data-tour]').textContent='Stop tour';q('[data-tour]').setAttribute('aria-pressed','true');tourIndex=0;const next=()=>{select(brainRegions[tourIndex++%brainRegions.length].id);tourTimer=setTimeout(next,6500);};next();
 });
 controls.addEventListener('change',requestRender);controls.addEventListener('start',stopTour);
 canvas.addEventListener('keydown',e=>{const key=e.key;if(['ArrowLeft','ArrowRight'].includes(key)){e.preventDefault();q(`[data-rotate="${key==='ArrowLeft'?'left':'right'}"]`).click();}if(['+','-'].includes(key)){e.preventDefault();const range=q('[data-zoom]');range.value=Math.max(0,Math.min(100,Number(range.value)+(key==='+'?10:-10)));range.dispatchEvent(new Event('input'));}});
 const raycaster=new THREE.Raycaster();let down;
 canvas.addEventListener('pointerdown',e=>down={x:e.clientX,y:e.clientY});canvas.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>5)return;const rect=canvas.getBoundingClientRect();raycaster.setFromCamera(new THREE.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),camera);const hit=raycaster.intersectObjects(structures).find(h=>brainRegions.some(r=>r.id===h.object.userData.category));if(hit){stopTour();select(hit.object.userData.category);}});
 const resize=new ResizeObserver(()=>{const {width,height}=stage.getBoundingClientRect();viewWidth=width;viewHeight=height;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();requestRender();});resize.observe(stage);
 const visibility=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible){stopTour();cancelAnimationFrame(frame);frame=0;}else requestRender();});visibility.observe(stage);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){stopTour();cancelAnimationFrame(frame);frame=0;}else requestRender();});
 reduced.addEventListener('change',()=>{q('[data-motion]').checked=!reduced.matches;pauseLabel();stopTour();requestRender();});
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();disposed=true;stopTour();cancelAnimationFrame(frame);root.classList.remove('brain-ready');status.textContent='Static anatomical view. Graphics context lost.';disableGraphics();});
 addEventListener('pagehide',e=>{stopTour();cancelAnimationFrame(frame);frame=0;if(!e.persisted){disposed=true;resize.disconnect();visibility.disconnect();controls.dispose();renderer.dispose();}});
 addEventListener('pageshow',e=>{if(e.persisted)requestRender();});
 sparks.forEach((s,i)=>s.position.copy(paths[i].getPoint(i*.21)));
 const initialBounds=stage.getBoundingClientRect();viewWidth=initialBounds.width;viewHeight=initialBounds.height;renderer.setSize(initialBounds.width,initialBounds.height,false);camera.aspect=initialBounds.width/initialBounds.height;camera.updateProjectionMatrix();draw();
 root.classList.add('brain-ready');status.textContent='Drag to rotate · choose a region';requestRender();
}
