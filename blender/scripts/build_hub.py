import math
import geometry as g

def build(rotor,c):
    hub=g.group('Hub',rotor,component='hub')
    shell=g.ellipsoid('Hub_Shell',(3.05,2.15,2.15),(1,0,0),hub)
    shell['shell']=True
    internal=g.group('Hub_PitchSystem',hub)
    g.cylinder('Hub_CentralMount',.75,2.1,(-.25,0,0),internal,'DarkMetal','X')
    rr=c['rotor_diameter_m']/2-c['blade_length_m']
    for i in range(3):
        angle=2*math.pi*i/3
        pitch=g.group(f'Pitch_Assembly_{i+1:02}',internal)
        pitch.rotation_euler[0]=angle
        g.ring(f'Pitch_Bearing_{i+1:02}',1.5,1.22,.35,(0,0,rr),pitch,'Metal')
        g.bolt_circle(f'Pitch_Bolt_{i+1:02}',1.37,g.Q['bolts'],(0,0,rr+.19),pitch)
        g.cylinder(f'Pitch_Motor_{i+1:02}',.23,.65,(.75,0,rr-.5),pitch,'IndustrialBlue','X')
    return hub
