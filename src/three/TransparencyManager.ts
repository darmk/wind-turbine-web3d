import * as THREE from 'three';
import type { ViewMode } from '../data/turbine';
interface Record {mesh:THREE.Mesh; original:THREE.MeshStandardMaterial; working:THREE.MeshStandardMaterial;shell:boolean}
export class TransparencyManager {
  private records:Record[]=[];mode:ViewMode='normal';selected:THREE.Object3D|null=null;
  constructor(root:THREE.Object3D){root.traverse(obj=>{
    if(!(obj instanceof THREE.Mesh))return;
    const originals=Array.isArray(obj.material)?obj.material:[obj.material];
    const working=originals.map(original=>{
      const material=(original as THREE.MeshStandardMaterial).clone();
      let shell=/Tower_Shell/.test(obj.name);
      for(let o:THREE.Object3D|null=obj;o;o=o.parent)if(o.userData.shell)shell=true;
      this.records.push({mesh:obj,original,working:material,shell});return material;
    });obj.material=Array.isArray(obj.material)?working:working[0];
  });}
  update(mode=this.mode,selected=this.selected){
    this.mode=mode;this.selected=selected;
    for(const r of this.records){const m=r.working;
      m.color.copy(r.original.color);m.emissive.copy(r.original.emissive);m.emissiveIntensity=r.original.emissiveIntensity;
      let inSelection=!selected;for(let o:THREE.Object3D|null=r.mesh;o;o=o.parent)if(o===selected)inSelection=true;
      if(selected&&!inSelection)m.color.multiplyScalar(.45);
      m.opacity=1;m.transparent=false;m.depthWrite=true;m.side=r.original.side;
      const xray=mode==='xray';
      if(r.shell&&(mode==='transparent'||xray)){
        m.opacity=xray?.16:.23;m.transparent=true;m.depthWrite=false;m.side=THREE.DoubleSide;
        if(xray)m.color.set('#3184b5');
      }else if(xray){m.emissive.set('#235a79');m.emissiveIntensity=.16;}
      m.onBeforeCompile=xray&&r.shell?shader=>{
        shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>',`float rim = pow(1.0 - abs(dot(normalize(normal), normalize(vViewPosition))), 2.5);\noutgoingLight = mix(outgoingLight, vec3(0.18, 0.65, 0.95), rim * 0.65);\ndiffuseColor.a = 0.08 + rim * 0.38;\n#include <opaque_fragment>`);
      }:()=>{};
      m.customProgramCacheKey=()=>xray&&r.shell?'en182-fresnel':'en182-pbr';
      m.needsUpdate=true;
    }
  }
  clipping(planes:THREE.Plane[]){for(const r of this.records){r.working.clippingPlanes=planes;r.working.clipShadows=false;r.working.needsUpdate=true;}}
  dispose(){const originals=new Set(this.records.map(r=>r.original));originals.forEach(m=>m.dispose());this.records.forEach(r=>r.working.dispose());}
}
