import bpy
import geometry as g

def build():
    palette = {
      'TurbineWhite': ((.81,.86,.90,1),.15,.29),
      'TurbineGray': ((.37,.44,.51,1),.35,.4),
      'Metal': ((.46,.54,.61,1),.82,.28),
      'DarkMetal': ((.055,.085,.12,1),.7,.36),
      'Rubber': ((.018,.025,.035,1),.0,.75),
      'Glass': ((.12,.3,.42,1),.2,.14),
      'Cable': ((.028,.038,.048,1),.1,.65),
      'Copper': ((.56,.23,.085,1),.8,.3),
      'IndustrialBlue': ((.035,.25,.48,1),.52,.3),
      'WarningYellow': ((.95,.57,.08,1),.2,.42)
    }
    for name,(color,metallic,roughness) in palette.items():
        mat = bpy.data.materials.new(name)
        mat.use_nodes = True
        mat.diffuse_color = color
        bsdf = mat.node_tree.nodes.get('Principled BSDF')
        bsdf.inputs['Base Color'].default_value = color
        bsdf.inputs['Metallic'].default_value = metallic
        bsdf.inputs['Roughness'].default_value = roughness
        g.M[name] = mat
