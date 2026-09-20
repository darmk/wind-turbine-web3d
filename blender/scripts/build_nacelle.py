import math
import geometry as g

def build(root,c):
    e=c['engineering']; length=e['nacelle_length_m']; width=e['nacelle_width_m']; height=e['nacelle_height_m']
    nacelle=g.group('Nacelle',root,(0,0,c['hub_height_m']),'nacelle')
    cover=g.group('Nacelle_Cover',nacelle,component='nacelle_cover'); cover['shell']=True
    # Superellipse loft: tapered rounded enclosure, open shaft aperture and hollow skin.
    stations=[(-.33,.49,.50),(-.28,.90,.87),(-.15,1,1),(.30,1,.98),(.57,.88,.86),(.64,.70,.69)]
    verts=[]; faces=[]; n=g.Q['radial']
    for shell in (0,1):
        for x,w,h in stations:
            for i in range(n):
                a=2*math.pi*i/n; co=math.cos(a); si=math.sin(a)
                y=math.copysign(abs(co)**.55,co)*(width*w/2-shell*.09)
                z=math.copysign(abs(si)**.55,si)*(height*h/2-shell*.09)+.15
                verts.append((length*x,y,z))
    ns=len(stations)
    for shell in (0,1):
        for j in range(ns-1):
            for i in range(n):
                k=shell*ns*n+j*n+i; kn=shell*ns*n+j*n+(i+1)%n
                face=(k,kn,kn+n,k+n)
                faces.append(face if shell==0 else tuple(reversed(face)))
    for j in (0,ns-1):
        for i in range(n):
            a=j*n+i;b=j*n+(i+1)%n
            faces.append((a,b,b+ns*n,a+ns*n))
    g.mesh('Nacelle_CompositeShell',verts,faces,cover,'TurbineWhite')
    g.box('Nacelle_TailCap',(.1,width*.70,height*.69),(length*.64,0,.15),cover,'TurbineWhite',.04)
    g.box('Roof_ServiceHatch',(2.1,1.7,.12),(3.4,0,height/2+.17),cover,'TurbineGray',.08)
    for side in (-1,1):
        for i in range(10):
            g.box(f'Vent_{side}_{i:02}',(.075,.05,.74),(length*.40+i*.11,side*(width*.47),.3),cover,'DarkMetal',.01)
    g.cylinder('Roof_AnemometerMast',.045,1.2,(6.1,0,height/2+.65),cover,'Metal')
    g.box('Roof_WindVane',(.85,.045,.16),(6.1,0,height/2+1.22),cover,'Metal',.02)
    g.join_meshes(cover)
    return nacelle
