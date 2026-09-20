import * as THREE from 'three';
import gsap from 'gsap';
import {components} from '../data/components';
import {ModelHierarchy} from './ModelHierarchy';
export class ExplodedView {
  timeline?:gsap.core.Timeline;level=0;
  private base=new Map<string,THREE.Vector3>();
  constructor(private hierarchy:ModelHierarchy){for(const c of components)this.base.set(c.id,hierarchy.get(c.id).position.clone());}
  set(level:number,onComplete?:()=>void){
    this.timeline?.kill();this.level=level;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const destinations=new Map<THREE.Object3D,THREE.Vector3>();
    this.timeline=gsap.timeline({paused:true,defaults:{duration:reduced?0:2,ease:'power2.out'},onComplete:()=>{for(const [object,destination] of destinations)object.position.copy(destination);onComplete?.();}});
    for(const c of components){
      const object=this.hierarchy.get(c.id),base=this.base.get(c.id)!;let amount=0;
      if(c.id==='rotor')amount=level>=1?1:0;
      else if(c.parent==='nacelle')amount=level>=2?(level===3?1:.65):0;
      else if(c.parent==='rotor'||c.parent==='gearbox')amount=level===3?1:0;
      const offset=new THREE.Vector3(...c.explosionOffset);
      // Blade offsets use blade-local +Y (glTF height), transformed to Rotor coordinates.
      if(c.id.startsWith('blade_'))offset.applyQuaternion(object.quaternion);
      const destination=base.clone().addScaledVector(offset,amount);
      destinations.set(object,destination);
      if(reduced)object.position.copy(destination);
      else this.timeline.to(object.position,{x:destination.x,y:destination.y,z:destination.z},0);
    }
    if(reduced)onComplete?.();
    else this.timeline.play(0);
  }
  pause(paused:boolean){this.timeline?.paused(paused);}
  reset(){this.timeline?.kill();this.level=0;for(const [id,base] of this.base)this.hierarchy.get(id).position.copy(base);}
  dispose(){this.timeline?.kill();}
}
