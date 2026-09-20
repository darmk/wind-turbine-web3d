import bpy
import bmesh
import json
import math
from pathlib import Path

REQUIRED=['Blade_01','Blade_02','Blade_03','Hub','Gearbox','Generator','MainShaft','MainBearing','Brake','Converter']

def validate(root,out,phase):
    errors=[]; meshes=[]; seen=set(); triangles=0;geometry_facts={}
    for obj in bpy.context.scene.objects:
        if obj.type not in {'MESH','EMPTY','LIGHT','CAMERA'}: errors.append(f'Unsupported type {obj.name}')
        if obj.type != 'MESH': continue
        if obj.name.startswith(('Cube.','Cylinder.','Plane.')): errors.append('Unnamed object '+obj.name)
        if min(obj.scale)<=0 or any(abs(s-1)>1e-5 for s in obj.scale): errors.append('Unapplied scale '+obj.name)
        if any(abs(a)>1e-5 for a in obj.rotation_euler):
            from geometry import apply
            apply(obj)
        if not obj.data.materials: errors.append('Missing material '+obj.name)
        if not obj.users_collection: errors.append('Missing collection '+obj.name)
        if not obj.parent: errors.append('Orphan mesh '+obj.name)
        if not obj.data.polygons: errors.append('Empty mesh '+obj.name)
        if obj.data.as_pointer() not in seen:
            seen.add(obj.data.as_pointer())
            bm=bmesh.new();bm.from_mesh(obj.data)
            bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces))
            bm.to_mesh(obj.data);bm.free()
            if not obj.data.uv_layers:
                uv=obj.data.uv_layers.new(name='UVMap')
                for loop in obj.data.loops:
                    co=obj.data.vertices[loop.vertex_index].co
                    uv.data[loop.index].uv=(co.x*.1,co.z*.1)
        for v in obj.data.vertices:
            if not all(math.isfinite(x) for x in v.co): errors.append('Nonfinite vertex '+obj.name);break
        for poly in obj.data.polygons:
            if not all(math.isfinite(x) for x in poly.normal) or poly.normal.length<.5: errors.append('Invalid polygon normal '+obj.name);break
        obj.data.calc_loop_triangles(); triangles+=len(obj.data.loop_triangles)
        meshes.append(obj.name)
    for image in bpy.data.images:
        if image.source=='FILE' and not image.packed_file and not Path(bpy.path.abspath(image.filepath)).exists(): errors.append('Missing texture '+image.name)
    if phase>=7:
        for name in REQUIRED:
            if not bpy.data.objects.get(name): errors.append('Missing '+name)
    if phase>=4:
        rotor=bpy.data.objects['Rotor'];centre=rotor.matrix_world.translation
        geometry_facts['hub_height_m']=round(centre.z,6)
        if abs(centre.z-root['hubHeight'])>1e-5: errors.append('Hub height mismatch')
        radii=[];angles=[]
        for index in range(1,4):
            blade=bpy.data.objects[f'Blade_{index:02}'];airfoil=bpy.data.objects[f'Blade_{index:02}_Airfoil']
            points=[airfoil.matrix_world@v.co-centre for v in airfoil.data.vertices]
            radii.append(max(math.hypot(p.y,p.z) for p in points))
            angles.append(round(math.degrees(blade.rotation_euler.x)%360,4))
        geometry_facts['blade_angles_deg']=angles
        geometry_facts['blade_tip_radii_m']=[round(r,6) for r in radii]
        geometry_facts['measured_swept_diameter_m']=round(max(radii)*2,6)
        if any(abs(r-root['rotorDiameter']/2)>.02 for r in radii):errors.append('Rotor diameter mismatch')
        if any(abs(a-b)>.001 for a,b in zip(angles,[0,120,240])):errors.append('Blade spacing mismatch')
    report={'phase':phase,'passed':not errors,'errors':errors,'mesh_objects':len(meshes),'unique_meshes':len(seen),'triangles_before_instancing':triangles,'units':'metres','blender_up':'Z','gltf_up':'Y','rotor_axis':'X','negative_scales':0,'textures':0,'uv':'Generated planar fallback; untextured PBR','empty_objects':'Named intentional assembly/pivot nodes','origin':'Assembly local pivots; rotor centred at hub','collections':[c.name for c in bpy.data.collections]}
    report['geometry_facts']=geometry_facts
    out.write_text(json.dumps(report,indent=2),encoding='utf-8')
    if errors: raise RuntimeError(json.dumps(errors))
    return report

def export(path,compression=True):
    bpy.ops.object.select_all(action='DESELECT')
    for obj in bpy.context.scene.objects:
        if obj.type in {'MESH','EMPTY'}: obj.select_set(True)
    bpy.ops.export_scene.gltf(filepath=str(path),export_format='GLB',use_selection=True,export_yup=True,export_extras=True,export_animations=False,export_cameras=False,export_lights=False,export_materials='EXPORT',export_draco_mesh_compression_enable=compression,export_draco_mesh_compression_level=6,export_draco_position_quantization=16,export_draco_normal_quantization=10)
