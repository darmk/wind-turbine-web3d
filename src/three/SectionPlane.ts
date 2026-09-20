import * as THREE from 'three';
import type { Axis } from '../data/turbine';
import { TransparencyManager } from './TransparencyManager';
export class SectionPlane {
  plane=new THREE.Plane();private helper:THREE.PlaneHelper;
  constructor(private scene:THREE.Scene,private materials:TransparencyManager){this.helper=new THREE.PlaneHelper(this.plane,20,0x54c6ff);this.helper.visible=false;scene.add(this.helper);}
  set(active:boolean,axis:Axis,position:number,target:THREE.Object3D){
    const box=new THREE.Box3().setFromObject(target),key=axis.toLowerCase() as 'x'|'y'|'z';
    // UI axes refer to Three/glTF coordinates: Y is vertical.
    const value=THREE.MathUtils.lerp(box.min[key]-.01,box.max[key]+.01,position/100);
    this.plane.normal.set(axis==='X'?-1:0,axis==='Y'?-1:0,axis==='Z'?-1:0);this.plane.constant=value;
    this.materials.clipping(active?[this.plane]:[]);
    // Clipping affects all surfaces; no misleading solid cap is fabricated.
    this.helper.visible=false;
  }
  dispose(){this.scene.remove(this.helper);this.helper.dispose();}
}
