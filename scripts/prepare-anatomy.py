"""Convert attributed atlas meshes to a small browser scene and geometric fallback."""
from pathlib import Path
import json, hashlib
ROOT=Path(__file__).resolve().parents[1]
CACHE=ROOT.parent/'anatomy-source'
records=json.loads((CACHE/'selected.json').read_text())
parsed=[]
for record in records:
    vertices=[]; triangles=[]
    for line in (CACHE/(record['id']+'.obj')).read_text().splitlines():
        parts=line.split()
        if not parts: continue
        if parts[0]=='v': vertices.append([float(n) for n in parts[1:4]])
        elif parts[0]=='f':
            indices=[int(x.split('/')[0])-1 for x in parts[1:]]
            for i in range(1,len(indices)-1): triangles.append([indices[0],indices[i],indices[i+1]])
    parsed.append({**record,'vertices':vertices,'triangles':triangles})
cortex=[v for m in parsed if m['category'] in ['cortex','frontal','auditory','self'] for v in m['vertices']]
mins=[min(v[i] for v in cortex) for i in range(3)]
maxs=[max(v[i] for v in cortex) for i in range(3)]
centre=[(a+b)/2 for a,b in zip(mins,maxs)]
cut=maxs[2]-300
meshes=[]
for m in parsed:
    faces=[f for f in m['triangles'] if m['category']!='head' or all(m['vertices'][i][2]>=cut for i in f)]
    used=sorted({i for f in faces for i in f}); remap={old:new for new,old in enumerate(used)}
    points=[[round(m['vertices'][i][0]-centre[0],3),round(m['vertices'][i][2]-centre[2],3),round(-(m['vertices'][i][1]-centre[1]),3)] for i in used]
    meshes.append({k:m[k] for k in ['id','fma','label','category','crc32']}|{'positions':[n for v in points for n in v],'indices':[remap[i] for f in faces for i in f]})
out=ROOT/'assets'/'anatomy';out.mkdir(parents=True,exist_ok=True)
payload={'source':'BodyParts3D 4.0','license':'CC BY 4.0','orientation':'Original millimetres; X right/left, Y superior, Z inverted original anterior/posterior. Centred on cortical bounds.','meshes':meshes}
(out/'head-brain.json').write_text(json.dumps(payload,separators=(',',':')),encoding='utf-8')
paths=[]
for m in sorted(meshes,key=lambda m:m['category']!='head'):
    p=m['positions']; colour='#b5cbd7' if m['category']=='head' else '#56d4de'
    opacity='.1' if m['category']=='head' else '.5'
    d=[]
    for j in range(0,len(m['indices']),36):
        tri=m['indices'][j:j+3];coords=[]
        for i in tri:
            x,y,z=p[i*3:i*3+3];coords.append((round(300+(x*.8+z*.6)*1.65,1),round(315-y*1.65,1)))
        d.append('M'+' L'.join(f'{x},{y}' for x,y in coords)+'Z')
    paths.append(f'<path d="{" ".join(d)}" fill="{colour}" fill-opacity="{opacity}" stroke="#a7cfdd" stroke-opacity=".18" stroke-width=".35"/>')
svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 650" role="img"><title>Human head and brain derived from BodyParts3D anatomical meshes</title>'+''.join(paths)+'</svg>'
(out/'brain-fallback.svg').write_text(svg,encoding='utf-8')
(out/'attribution.txt').write_text('BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International.\nhttps://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html\nhttps://creativecommons.org/licenses/by/4.0/\nSource: isa_BP3D_4.0_obj_99.zip, selected FMA-indexed meshes. Adaptations: cropped skin to head/neck, centred geometry, converted coordinate axes, rounded coordinates to 0.001 mm, changed materials and generated projected SVG. Cortical functional overlays are approximate territories, not fMRI or tractography.\n',encoding='utf-8')
print('Cortical bounds:',mins,maxs,'head cut',cut)
print('Scene:',len(meshes),'meshes',sum(len(m['indices'])//3 for m in meshes),'triangles',(out/'head-brain.json').stat().st_size,'bytes')
