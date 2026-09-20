const fs=require('node:fs');const path=require('node:path');const {spawnSync}=require('node:child_process');
const root=path.join(__dirname,'..'),out=path.join(root,'.tools','height-check');fs.mkdirSync(out,{recursive:true});
const config=JSON.parse(fs.readFileSync(path.join(root,'blender/config/en182_config.json'),'utf8'));config.hub_height_m=140;
const configPath=path.join(out,'hh140.json');fs.writeFileSync(configPath,JSON.stringify(config,null,2));
const blender=process.env.BLENDER_PATH||'D:\\Program Files\\Blender Foundation\\Blender 4.2\\blender.exe';
const run=spawnSync(blender,['--background','--factory-startup','--python-exit-code','1','--python','blender/scripts/build_turbine.py','--','--phase','7','--lod','2','--config',configPath,'--output-dir',out],{cwd:root,encoding:'utf8'});
console.log(run.stdout);if(run.status!==0){console.error(run.stderr,run.error);process.exit(1);}
const report=JSON.parse(fs.readFileSync(path.join(out,'model_validation_report-lod2.json'),'utf8'));
if(!report.passed||report.geometry_facts.hub_height_m!==140)throw Error('140 m configuration validation failed');
fs.writeFileSync(path.join(root,'docs','height-140-check.json'),JSON.stringify(report,null,2));
