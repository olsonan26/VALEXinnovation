import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url)),output=path.join(root,'dist');
async function inventory(directory){const result=[];for(const entry of await fs.readdir(path.join(root,directory),{withFileTypes:true})){const file=path.posix.join(directory,entry.name);if(entry.isDirectory())result.push(...await inventory(file));else if(entry.isFile())result.push(file);}return result;}
const files=['index.html','site.css','site.js','proof.js','demo-model.js',...await inventory('assets'),...await inventory('lib')],included=new Set(files);
const html=await fs.readFile(path.join(root,'index.html'),'utf8');
const js=await fs.readFile(path.join(root,'site.js'),'utf8');
for(const source of [html,js])for(const match of source.matchAll(/(?:src|href)="(\.\/[^"#]+)"|['"](\.\/assets\/[^'"]+)['"]/g)){const ref=match[1]||match[2];if(!included.has(ref.slice(2)))throw new Error('Missing website asset: '+ref);}
const contents=await Promise.all(files.map(file=>fs.readFile(path.join(root,file))));
for(let i=0;i<files.length;i++)if(files[i].endsWith('.js'))for(const match of contents[i].toString('utf8').matchAll(/\b(?:import|export)\s+(?:[^'"\n]*?\s+from\s*)?['"]([^'"]+)['"]/g)){
  const ref=match[1];if(!ref.startsWith('.'))continue;
  const resolved=path.posix.normalize(path.posix.join(path.posix.dirname(files[i]),ref));
  if(!included.has(resolved))throw new Error(`Missing demo module: ${files[i]} imports ${ref}`);
}
if(path.dirname(output)!==root||path.basename(output)!=='dist')throw new Error('Unexpected build output path.');
await fs.rm(output,{recursive:true,force:true});
for(let i=0;i<files.length;i++){const destination=path.join(output,files[i]);await fs.mkdir(path.dirname(destination),{recursive:true});await fs.writeFile(destination,contents[i]);}
console.log(`Built ${files.length} independent website assets, including the standalone comparison model. No company data or software connection.`);
