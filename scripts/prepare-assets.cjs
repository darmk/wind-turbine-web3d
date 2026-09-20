const fs=require('node:fs');const path=require('node:path');
const root=path.join(__dirname,'..');const target=path.join(root,'public','draco');
fs.mkdirSync(target,{recursive:true});
for(const name of ['draco_decoder.js','draco_decoder.wasm','draco_wasm_wrapper.js'])fs.copyFileSync(path.join(root,'node_modules','three','examples','jsm','libs','draco','gltf',name),path.join(target,name));
console.log('Local Draco decoder assets prepared.');
