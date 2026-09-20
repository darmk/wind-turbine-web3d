import math
import geometry as g

def interpolate(stations,t,key):
    for a,b in zip(stations,stations[1:]):
        if t<=b['span']:
            f=(t-a['span'])/(b['span']-a['span'])
            f=f*f*(3-2*f)
            return a[key]*(1-f)+b[key]*f
    return stations[-1][key]

def build(rotor,c):
    stations=c['engineering']['blade_stations']; radial=c['rotor_diameter_m']/2
    root_radius=radial-c['blade_length_m']; ns=g.Q['blade_span']; np=g.Q['blade_profile']
    verts=[];faces=[]
    for j in range(ns+1):
        t=j/ns
        chord=interpolate(stations,t,'chord'); thick=interpolate(stations,t,'thickness')
        twist=math.radians(interpolate(stations,t,'twist')); sweep=interpolate(stations,t,'sweep')
        for k in range(np):
            a=2*math.pi*k/np
            u=(1-math.cos(a))/2
            # Closed NACA-like visual profile, smoothly blended into circular root.
            yt=5*thick*(.2969*math.sqrt(u)-.126*u-.3516*u*u+.2843*u**3-.1036*u**4)
            foil=chord*yt*(1 if k<np/2 else -1)
            circle=.5*chord*math.sin(a)
            blend=min(1,t/.08)
            x=circle*(1-blend)+foil*blend
            y=(u-.5)*chord
            xx=x*math.cos(twist)-y*math.sin(twist)
            yy=x*math.sin(twist)+y*math.cos(twist)+sweep
            z=root_radius+c['blade_length_m']*t
            # Preserve specified tip swept radius despite sweep/chord.
            if t>.94: z=min(z,math.sqrt(max(0,radial*radial-yy*yy)))
            verts.append((xx,yy,z-root_radius))
    for j in range(ns):
        for k in range(np): faces.append((j*np+k,j*np+(k+1)%np,(j+1)*np+(k+1)%np,(j+1)*np+k))
    faces.extend([tuple(reversed(range(np))),tuple(range(ns*np,(ns+1)*np))])
    for i in range(c['blade_count']):
        angle=i*2*math.pi/c['blade_count']
        blade=g.group(f'Blade_{i+1:02}',rotor,(0,-root_radius*math.sin(angle),root_radius*math.cos(angle)),f'blade_{i+1:02}')
        blade.rotation_euler[0]=angle
        blade['estimated']=True
        obj=g.mesh(f'Blade_{i+1:02}_Airfoil',verts,faces,blade,'TurbineWhite')
        obj['profile']='Engineering visual approximation, not EN89 proprietary airfoil'
        g.ring(f'Blade_{i+1:02}_RootCollar',1.48,1.32,.25,(0,0,.25),blade,'TurbineGray')
    return rotor
