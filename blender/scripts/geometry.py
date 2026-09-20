"""Procedural geometry helpers. Metres, Blender Z-up, rotor axis +X."""
import bpy
import math
from mathutils import Vector, Matrix

M = {}
Q = {}

def group(name, parent=None, loc=(0, 0, 0), component=None):
    obj = bpy.data.objects.new(name, None)
    bpy.context.scene.collection.objects.link(obj)
    obj.parent = parent
    obj.location = loc
    obj.empty_display_size = 0.3
    if component:
        obj['componentId'] = component
    return obj

def finish(obj, name, parent, mat, loc):
    obj.name = name
    obj.data.name = name + '_Geometry'
    obj.parent = parent
    obj.location = loc
    obj.data.materials.append(M[mat])
    for poly in obj.data.polygons:
        poly.use_smooth = True
    return obj

def mesh(name, verts, faces, parent, mat, loc=(0,0,0)):
    data = bpy.data.meshes.new(name + '_Geometry')
    data.from_pydata(verts, [], faces)
    data.update()
    obj = bpy.data.objects.new(name, data)
    bpy.context.scene.collection.objects.link(obj)
    return finish(obj, name, parent, mat, loc)

def apply(obj):
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)

def box(name, size, loc, parent, mat='Metal', bevel=0.08):
    bpy.ops.mesh.primitive_cube_add(size=1)
    obj = finish(bpy.context.object, name, parent, mat, loc)
    obj.scale = size
    apply(obj)
    if bevel:
        mod = obj.modifiers.new('Manufactured edge radii', 'BEVEL')
        mod.width = bevel
        mod.segments = 3 if Q['radial'] > 32 else 1
        bpy.ops.object.modifier_apply(modifier=mod.name)
        mod = obj.modifiers.new('Weighted surface normals', 'WEIGHTED_NORMAL')
        bpy.ops.object.modifier_apply(modifier=mod.name)
    return obj

def cylinder(name, radius, depth, loc, parent, mat='Metal', axis='Z', radius2=None, vertices=None):
    bpy.ops.mesh.primitive_cone_add(vertices=vertices or Q['radial'], radius1=radius, radius2=radius if radius2 is None else radius2, depth=depth)
    obj = finish(bpy.context.object, name, parent, mat, loc)
    if axis == 'X': obj.rotation_euler[1] = math.pi/2
    if axis == 'Y': obj.rotation_euler[0] = math.pi/2
    apply(obj)
    for poly in obj.data.polygons:
        if len(poly.vertices)>4: poly.use_smooth=False
    return obj

def ring(name, outer, inner, depth, loc, parent, mat='Metal', axis='Z', outer2=None):
    n = Q['radial']
    verts, faces = [], []
    for r,z in [(outer,-depth/2),(outer2 or outer,depth/2),((outer2 or outer)-(outer-inner),depth/2),(inner,-depth/2)]:
        for i in range(n):
            a = i*2*math.pi/n
            p = (r*math.cos(a), r*math.sin(a), z)
            if axis == 'X': p = (z,p[0],p[1])
            if axis == 'Y': p = (p[0],z,p[1])
            verts.append(p)
    # Duplicate ring vertices at the four hard manufactured edges. Keep each
    # cylindrical band smooth without averaging cap normals into long walls.
    bands=[]
    for j in range(4):
        bands.extend(verts[j*n:(j+1)*n])
        jj=(j+1)%4
        bands.extend(verts[jj*n:(jj+1)*n])
    for j in range(4):
        for i in range(n):
            faces.append((j*2*n+i,j*2*n+(i+1)%n,j*2*n+n+(i+1)%n,j*2*n+n+i))
    return mesh(name, bands, faces, parent, mat, loc)

def ellipsoid(name, size, loc, parent, mat='TurbineWhite'):
    segments=min(Q['radial'],16) if name.startswith('Bearing_Roller') else Q['radial']
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments, ring_count=max(8,segments//2))
    obj = finish(bpy.context.object,name,parent,mat,loc)
    obj.scale = size
    apply(obj)
    return obj

def bolt_circle(name, radius, count, loc, parent, axis='Z', bolt_radius=0.07):
    template = cylinder(name+'_001',bolt_radius,bolt_radius*1.4,(0,0,0),parent,'Metal',axis,vertices=6)
    template['fastener'] = True
    for i in range(count):
        obj = template if i == 0 else bpy.data.objects.new(f'{name}_{i+1:03}',template.data)
        if i:
            bpy.context.scene.collection.objects.link(obj)
            obj.parent = parent
            obj['fastener'] = True
        a = 2*math.pi*i/count
        p = (radius*math.cos(a),radius*math.sin(a),0)
        if axis == 'X': p = (0,p[0],p[1])
        obj.location = Vector(loc)+Vector(p)

def gear(name, radius, depth, teeth, loc, parent, mat='Metal', helix=0.0):
    n = teeth*4
    verts, faces = [], []
    for j in range(2):
        for i in range(n):
            angle = 2*math.pi*i/n + (j-0.5)*helix
            r = radius * (1 if i%4 in (1,2) else 0.89)
            verts.append(((j-.5)*depth,r*math.cos(angle),r*math.sin(angle)))
    for i in range(n): faces.append((i,(i+1)%n,(i+1)%n+n,i+n))
    faces.extend([tuple(reversed(range(n))),tuple(range(n,2*n))])
    obj=mesh(name,verts,faces,parent,mat,loc)
    for poly in obj.data.polygons: poly.use_smooth=False
    return obj

def join_meshes(parent):
    """Batch non-selectable repeated detail by material within each logical group."""
    buckets = {}
    for obj in list(parent.children):
        if obj.type == 'MESH' and not obj.get('fastener'):
            key = obj.data.materials[0].name
            buckets.setdefault(key,[]).append(obj)
    for material, objects in buckets.items():
        if len(objects) < 2: continue
        bpy.ops.object.select_all(action='DESELECT')
        for obj in objects: obj.select_set(True)
        bpy.context.view_layer.objects.active = objects[0]
        bpy.ops.object.join()
        objects[0].name = parent.name + '_' + material
