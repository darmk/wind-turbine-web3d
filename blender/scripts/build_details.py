"""Lightweight access/fastener details, separate named assembly hierarchy."""
import geometry as g

def build(root,c):
    e=c['engineering'];z=e['foundation_height_m'];r=e['tower_base_radius_m']
    detail=g.group('Detail',root,component='detail')
    bolts=g.group('Bolts',detail)
    g.bolt_circle('Foundation_AnchorBolt',r+.24,g.Q['bolts'],(0,0,z+.32),bolts,bolt_radius=.085)
    flanges=g.group('Flanges',detail)
    g.ring('Tower_BaseCollar',r+.34,r+.02,.14,(0,0,z+.19),flanges,'Metal')
    platforms=g.group('Platforms',detail)
    g.box('Access_Platform',(2.4,2.15,.14),(r+1.25,0,z+.2),platforms,'DarkMetal',.025)
    ladders=g.group('Ladders',detail)
    for i in range(5):
        g.box(f'Access_Step_{i+1:02}',(.35,1.15,.08),(r+2.5+i*.3,0,z+.2-i*.25),ladders,'Metal',.02)
    g.join_meshes(ladders)
    rails=g.group('Handrails',detail)
    for side in (-1,1):
        for i in range(3):g.cylinder(f'Handrail_Post_{side}_{i}',.035,1.05,(r+.15+i*1.1,side*1.02,z+.77),rails,'WarningYellow',vertices=12)
        g.cylinder(f'Handrail_Top_{side}',.035,2.25,(r+1.25,side*1.02,z+1.3),rails,'WarningYellow','X',vertices=12)
        g.cylinder(f'Handrail_Mid_{side}',.025,2.25,(r+1.25,side*1.02,z+.82),rails,'Metal','X',vertices=12)
    g.join_meshes(rails)
