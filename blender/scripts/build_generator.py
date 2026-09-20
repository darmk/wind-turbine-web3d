import geometry as g
import math

def build(nacelle,c):
    e=c['engineering']; r=e['generator_radius_m']; length=e['generator_length_m']
    generator=g.group('Generator',nacelle,(6,0,0),'generator')
    housing=g.group('Generator_Housing',generator); housing['shell']=True
    g.ring('Stator_Housing',r,r*.82,length,(0,0,0),housing,'IndustrialBlue','X')
    for i in range(24):
        a=2*math.pi*i/24
        fin=g.box(f'CoolingFin_{i:02}',(length*.86,.045,.12),(0,math.cos(a)*r,math.sin(a)*r),housing,'IndustrialBlue',.015)
        fin.rotation_euler[0]=a-math.pi/2
    g.join_meshes(housing)
    g.cylinder('Generator_Rotor',r*.6,length*.82,(0,0,0),generator,'DarkMetal','X')
    g.cylinder('Generator_Shaft',.20,length+1.2,(0,0,0),generator,'Metal','X')
    for side in (-1,1):
        g.ring(f'Copper_Windings_{side}',r*.80,r*.64,.35,(side*length*.35,0,0),generator,'Copper','X')
        g.ring(f'End_Cover_{side}',r+.025,.27,.12,(side*length/2,0,0),housing,'TurbineGray','X')
        g.box(f'Generator_Foot_{side}',(.7,2.45,.32),(side*length*.31,0,-r-.28),generator,'IndustrialBlue')
    return generator
