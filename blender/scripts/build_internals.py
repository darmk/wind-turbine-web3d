import math
import geometry as g
import build_gearbox
import build_generator

def build(nacelle,c):
    e=c['engineering']; length=e['nacelle_length_m']
    frame=g.group('MainFrame',nacelle,component='main_frame')
    for side in (-1,1): g.box(f'Frame_Girder_{side}',(length*.9,.35,.5),(1.8,side*1.5,-1.9),frame,'DarkMetal')
    for i in range(6): g.box(f'Frame_Crossbeam_{i}',(.25,3.3,.36),(-4+i*2.3,0,-1.92),frame,'DarkMetal')
    g.ring('Yaw_Bearing',1.9,1.45,.5,(0,0,-2.6),frame,'Metal')
    g.bolt_circle('Yaw_Bolt',1.74,g.Q['bolts'],(0,0,-2.3),frame)
    g.join_meshes(frame)
    shaft=g.group('MainShaft',nacelle,(-3.1,0,0),'main_shaft')
    g.cylinder('Forged_MainShaft',e['shaft_radius_m'],5.5,(0,0,0),shaft,'Metal','X',radius2=.43)
    g.cylinder('MainShaft_Flange',1.13,.28,(2.3,0,0),shaft,'Metal','X')
    bearing=g.group('MainBearing',nacelle,(-3.5,0,0),'main_bearing')
    g.ring('Bearing_OuterRace',1.05,.87,.8,(0,0,0),bearing,'IndustrialBlue','X')
    g.ring('Bearing_InnerRace',.68,.53,.8,(0,0,0),bearing,'Metal','X')
    for row in (-1,1):
        for i in range(g.Q['rollers']):
            a=i*2*math.pi/g.Q['rollers']
            g.ellipsoid(f'Bearing_Roller_{row}_{i:02}',(.16,.10,.10),(row*.22,.77*math.cos(a),.77*math.sin(a)),bearing,'Metal')
    g.box('Bearing_Pedestal',(1.1,2.2,.65),(0,0,-1.45),bearing,'IndustrialBlue')
    g.join_meshes(bearing)
    build_gearbox.build(nacelle,c)
    coupling=g.group('Coupling',nacelle,(3.6,0,.15),'coupling')
    g.cylinder('Coupling_Flexible',.4,1.15,(0,0,0),coupling,'Rubber','X')
    for x in (-.5,.5): g.cylinder(f'Coupling_Flange_{x}',.47,.13,(x,0,0),coupling,'Metal','X')
    build_generator.build(nacelle,c)
    brake=g.group('Brake',nacelle,(4.2,0,.15),'brake')
    g.ring('Brake_Disc',.7,.23,.08,(0,0,0),brake,'Metal','X')
    g.box('Brake_Caliper',(.5,.36,.42),(0,0,.64),brake,'WarningYellow')
    g.cylinder('Brake_Hydraulic',.12,.5,(.2,.22,.64),brake,'DarkMetal','X')
    for name,cid,loc,size in [('Converter','converter',(5,-1.85,-.15),(2.1,.65,2.7)),('ControlCabinet','control_cabinet',(8.3,1.35,-.25),(1.0,1,2.55))]:
        cabinet=g.group(name,nacelle,loc,cid)
        g.box(name+'_Housing',size,(0,0,0),cabinet,'TurbineGray',.09)
        g.box(name+'_Door',(size[0]*.85,.05,size[2]*.9),(0,-size[1]/2-.03,0),cabinet,'IndustrialBlue',.03)
        g.box(name+'_Handle',(.06,.08,.3),(.3,-size[1]/2-.08,0),cabinet,'Metal',.015)
        for i in range(8): g.box(name+f'_Vent_{i}',(size[0]*.6,.03,.025),(0,-size[1]/2-.065,-.5+i*.08),cabinet,'DarkMetal',0)
        g.join_meshes(cabinet)
    cooling=g.group('CoolingSystem',nacelle,(7.8,0,1.7),'cooling')
    g.box('Cooling_Radiator',(2.3,2,.42),(0,0,0),cooling,'DarkMetal')
    for i in range(16): g.box(f'Radiator_Fin_{i}',(.045,1.85,.46),(-1+i*.13,0,0),cooling,'Metal',0)
    for y in (-.5,.5): g.ring(f'Cooling_Fan_{y}',.45,.35,.12,(0,y,.3),cooling,'Metal')
    g.join_meshes(cooling)
