import geometry as g

def build(root,c):
    e=c['engineering']; base=e['foundation_height_m']; top=c['hub_height_m']-2.8
    foundation=g.group('Foundation',root,component='foundation')
    g.cylinder('Foundation_Concrete',e['foundation_radius_m'],base,(0,0,base/2),foundation,'TurbineGray')
    g.cylinder('Foundation_Pedestal',e['tower_base_radius_m']+0.5,0.7,(0,0,base+.15),foundation,'TurbineGray')
    tower=g.group('Tower',root,component='tower')
    interior=g.group('Tower_Internal',tower)
    for i in range(e['tower_sections']):
        f=i/e['tower_sections']; f2=(i+1)/e['tower_sections']
        r=e['tower_base_radius_m']*(1-f)+e['tower_top_radius_m']*f
        r2=e['tower_base_radius_m']*(1-f2)+e['tower_top_radius_m']*f2
        z=base+(top-base)*f; height=(top-base)/e['tower_sections']
        section=g.group(f'Tower_Section_{i+1:02}',tower)
        g.ring(f'Tower_Shell_{i+1:02}',r,r-e['tower_wall_m'],height-.05,(0,0,z+height/2),section,'TurbineWhite',outer2=r2)
        g.ring(f'Tower_Flange_{i+1:02}',r+.08,r-.24,.16,(0,0,z+.1),section,'TurbineGray')
        g.bolt_circle(f'Flange_Bolt_{i+1:02}',r-.12,g.Q['bolts'],(0,0,z+.23),section)
        g.ring(f'Platform_{i+1:02}',r-.18,.7,.09,(0,0,z+2),interior,'DarkMetal')
    for side in (-1,1): g.box(f'Ladder_Rail_{side}',(.065,.065,top-base),(0.6,side*.3,(top+base)/2),interior,'Metal',0)
    for i in range(int((top-base)/.6)):
        g.box(f'Ladder_Rung_{i:03}',(.07,.66,.045),(.6,0,base+i*.6),interior,'Metal',0)
    g.box('Tower_Cable_Run',(.13,.2,top-base),(-.9,.4,(top+base)/2),interior,'Cable',0)
    g.join_meshes(interior)
    g.box('Access_Door_Frame',(.12,1.35,2.7),(e['tower_base_radius_m'],0,base+1.5),tower,'TurbineGray',.16)
    g.box('Access_Door',(.14,1.12,2.42),(e['tower_base_radius_m']+.04,0,base+1.5),tower,'TurbineWhite',.14)
    return tower
