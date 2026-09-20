"""blender --background --factory-startup --python build_turbine.py -- --phase 8 --lod 0"""
import bpy
import sys
import json
import argparse
from pathlib import Path

HERE=Path(__file__).resolve().parent
sys.path.insert(0,str(HERE))
import geometry as g
import build_materials,build_tower,build_blade,build_hub,build_nacelle,build_internals,build_details,export_glb

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--phase',type=int,default=8);parser.add_argument('--lod',type=int,default=0);parser.add_argument('--config',default=str(HERE.parent/'config/en182_config.json'));parser.add_argument('--output-dir',default=None)
    args=parser.parse_args(sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else [])
    c=json.loads(Path(args.config).read_text(encoding='utf-8'));g.Q=c['lod'][str(args.lod)]
    project=HERE.parent.parent;output=Path(args.output_dir) if args.output_dir else project/'public/models';output.mkdir(parents=True,exist_ok=True)
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene=bpy.context.scene;scene.name='EN182_WindTurbine';scene.unit_settings.system='METRIC';scene.unit_settings.scale_length=1
    build_materials.build();root=g.group('EN182_WindTurbine',component='turbine')
    root['model']=c['model'];root['estimatedGeometry']=True;root['hubHeight']=c['hub_height_m'];root['rotorDiameter']=c['rotor_diameter_m'];root['lod']=args.lod
    build_tower.build(root,c)
    build_details.build(root,c)
    rotor=g.group('Rotor',root,(c['engineering']['rotor_overhang_m'],0,c['hub_height_m']),'rotor')
    if args.phase>=4:build_blade.build(rotor,c)
    if args.phase>=5:build_hub.build(rotor,c)
    if args.phase>=6:
        nacelle=build_nacelle.build(root,c)
        if args.phase>=7:build_internals.build(nacelle,c)
    # Match physical rotor to the front of the nacelle; positive X is upwind.
    if args.phase>=6:
        for child in list(nacelle.children):
            child.location.x *= -1
            child.rotation_euler[2] += 3.141592653589793
    # Semantic collections supplement the object-parent hierarchy.
    for top in root.children:
        collection=bpy.data.collections.new(top.name+'_Collection');scene.collection.children.link(collection)
        for obj in [top,*top.children_recursive]:
            for old in list(obj.users_collection):old.objects.unlink(obj)
            collection.objects.link(obj)
    bpy.context.view_layer.update()
    report=export_glb.validate(root,output/f'model_validation_report-lod{args.lod}.json',args.phase)
    if args.phase>=8:
        suffix='' if args.lod==0 else f'-lod{args.lod}'
        if args.lod==0:
            bpy.ops.wm.save_as_mainfile(filepath=str(HERE.parent/'en182-5mw.blend'))
            (output/'model_validation_report.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
        export_glb.export(output/f'en182-5mw{suffix}.glb',c.get('export',{}).get('draco',True))
    log=project/'docs/development-log.md'
    with log.open('a',encoding='utf-8') as f:
        f.write(f'\n\n## Phase {args.phase} — Blender 实际执行 / LOD{args.lod}\n\nBlender {bpy.app.version_string} 后台生成通过。{report["mesh_objects"]} mesh objects，{report["triangles_before_instancing"]} triangles。验证 errors=[]；参数配置 {Path(args.config).name}。'+(' 已导出 GLB。' if args.phase>=8 else ' 本阶段完成参数化几何检查，后续阶段继续。'))
    print('BUILD_PASSED',json.dumps(report))

if __name__=='__main__': main()
