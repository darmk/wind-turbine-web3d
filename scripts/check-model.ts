import { readFileSync, writeFileSync } from 'node:fs';
import { components } from '../src/data/components';
const paths=process.argv.slice(2).length?process.argv.slice(2):['public/models/en182-5mw.glb','public/models/en182-5mw-lod1.glb','public/models/en182-5mw-lod2.glb'];
const reports=paths.map(path=>{
 const b=readFileSync(path);if(b.toString('utf8',0,4)!=='glTF'||b.readUInt32LE(4)!==2||b.readUInt32LE(8)!==b.length)throw Error('Invalid GLB '+path);
 const json=JSON.parse(b.toString('utf8',20,20+b.readUInt32LE(12)));const nodes=json.nodes||[];
 const missing=components.filter(c=>!c.objectNames.every(name=>nodes.some((n:{name:string})=>n.name===name)));
 if(missing.length)throw Error('Missing required components: '+missing.map(c=>c.objectNames).join(', '));
 for(const node of nodes){if(node.scale?.some((n:number)=>n<=0))throw Error('Negative/zero scale '+node.name);if(/^(Cube|Cylinder|Plane)\.\d+$/.test(node.name))throw Error('Unsemantic name '+node.name);}
 if((json.images||[]).length)throw Error('Unexpected texture/image; this model must be unbranded and texture free');
 let triangles=0;for(const mesh of json.meshes)for(const p of mesh.primitives){if(p.material===undefined)throw Error('Missing material');triangles+=json.accessors[p.indices].count/3;}
 const report={path,passed:true,bytes:b.length,components:components.length,nodes:nodes.length,meshes:json.meshes.length,uniqueTriangles:triangles,materials:json.materials.length};console.log(report);return report;
});
writeFileSync('docs/model-check.json',JSON.stringify(reports,null,2));
