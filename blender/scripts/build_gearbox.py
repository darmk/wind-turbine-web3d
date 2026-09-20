import math
import geometry as g

def build(nacelle,c):
    e=c['engineering']; length=e['gearbox_length_m']; r=e['gearbox_radius_m']
    gearbox=g.group('Gearbox',nacelle,(1.2,0,0),'gearbox')
    for index,(x,scale) in enumerate([(-length*.31,1),(0,.79)]):
        stage=g.group(f'PlanetaryStage_{index+1:02}',gearbox,(x,0,0),f'planetary_stage_{index+1:02}')
        sr=r*scale; depth=length*.26
        g.ring(f'RingGear_{index+1:02}',sr,sr*.86,depth,(0,0,0),stage,'IndustrialBlue','X')
        g.gear(f'SunGear_{index+1:02}',sr*.26,depth,18,(0,0,0),stage)
        # Visually distinct internal ring teeth, planets and open carrier.
        for i in range(3):
            a=i*2*math.pi/3; y=math.cos(a)*sr*.55; z=math.sin(a)*sr*.55
            g.gear(f'Planet_{index+1:02}_{i+1:02}',sr*.29,depth*.88,20,(0,y,z),stage)
            carrier=g.box(f'CarrierArm_{index+1:02}_{i+1:02}',(.12,sr*.65,.15),(depth*.6,y/2,z/2),stage,'DarkMetal',.04)
            carrier.rotation_euler[0]=a
            g.cylinder(f'PlanetPin_{index+1:02}_{i+1:02}',.09,depth*1.25,(0,y,z),stage,'Metal','X')
        for i in range(36):
            a=2*math.pi*i/36
            tooth=g.box(f'RingTooth_{index+1:02}_{i:02}',(depth,.11,.065),(0,math.cos(a)*sr*.86,math.sin(a)*sr*.86),stage,'Metal',0)
            tooth.rotation_euler[0]=a
        g.join_meshes(stage)
    stage=g.group('HelicalStage',gearbox,(length*.33,0,0),'helical_stage')
    g.gear('Helical_Large',r*.60,length*.25,36,(0,0,0),stage,helix=.18)
    g.gear('Helical_Pinion',r*.23,length*.25,14,(0,0,r*.8),stage,helix=-.18)
    g.box('Gearbox_Bedplate',(length+.2,2.6,.3),(0,0,-r-.2),gearbox,'IndustrialBlue',.09)
    for x in (-length/2,length/2):
        for y in (-1,1): g.box(f'Gearbox_Foot_{x}_{y}',(.45,.4,.4),(x,y,-r-.25),gearbox,'Metal')
    g.join_meshes(gearbox)
    return gearbox
