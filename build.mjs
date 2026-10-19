import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
import {routes,renderPage} from './content/pages.mjs';
const root=path.dirname(fileURLToPath(import.meta.url)),output=path.join(root,'dist');
if(path.dirname(output)!==root||path.basename(output)!=='dist')throw new Error('Unexpected output path');
await fs.rm(output,{recursive:true,force:true});
await fs.mkdir(output,{recursive:true});
for(const directory of ['assets','lib'])await fs.cp(path.join(root,directory),path.join(output,directory),{recursive:true});
for(const file of ['site.css','site.js','home.css','demo.css','illustrative.css','personal-ui.js','science-ui.js','product.js','proof.js','personal-model.js','demo-model.js','signal-model.js','signal-experience.js'])await fs.copyFile(path.join(root,file),path.join(output,file));
for(const route of routes){const folder=path.join(output,route.slice(1));await fs.mkdir(folder,{recursive:true});await fs.writeFile(path.join(folder,'index.html'),renderPage(route));}
await fs.mkdir(path.join(output,'assets/fonts'),{recursive:true});
for(const [family,files] of Object.entries({'manrope':['manrope-latin-400-normal.woff2','manrope-latin-600-normal.woff2'],'instrument-serif':['instrument-serif-latin-400-normal.woff2']})){
 for(const file of files)await fs.copyFile(path.join(root,'node_modules/@fontsource',family,'files',file),path.join(output,'assets/fonts',file));
 await fs.copyFile(path.join(root,'node_modules/@fontsource',family,'LICENSE'),path.join(output,'assets/fonts',family+'-LICENSE.txt'));
}
await build({entryPoints:[path.join(root,'site.js')],outfile:path.join(output,'site.js'),bundle:true,minify:true,format:'esm',target:['es2022'],external:['./brain-scene.js'],legalComments:'eof'});
await build({entryPoints:[path.join(root,'demo.js')],outfile:path.join(output,'demo.js'),bundle:true,minify:true,format:'esm',target:['es2022'],legalComments:'eof'});
await build({entryPoints:[path.join(root,'brain-scene.js')],outfile:path.join(output,'brain-scene.js'),bundle:true,minify:true,format:'esm',target:['es2022'],legalComments:'eof'});
await fs.copyFile(path.join(root,'node_modules/three/LICENSE'),path.join(output,'assets/anatomy/three-LICENSE.txt'));
console.log(`Built ${routes.length} routes, local models, licensed anatomy and self-hosted fonts.`);
