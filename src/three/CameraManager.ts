import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import {turbine} from '../data/turbine';

export class CameraManager {
  camera = new THREE.PerspectiveCamera(34,1,.05,4000);
  controls: OrbitControls;
  constructor(canvas: HTMLCanvasElement) {
    this.controls=new OrbitControls(this.camera,canvas);
    this.controls.enableDamping=true;this.controls.dampingFactor=.075;
    this.controls.minDistance=.8;this.controls.maxDistance=1500;
    this.controls.maxPolarAngle=Math.PI*.93;
    this.controls.autoRotateSpeed=.5;
  }
  focus(object: THREE.Object3D, animate=true, whole=false) {
    object.updateWorldMatrix(true,true);
    const box=new THREE.Box3().setFromObject(object);
    if(box.isEmpty()) return;
    // Fit the complete swept disk, not the current three-blade pose. This keeps
    // the 2x autoplay tips on screen at every rotor angle and viewport size.
    if(whole){
      const rotor=object.getObjectByName('Rotor');
      if(rotor){const hub=rotor.getWorldPosition(new THREE.Vector3()),radius=turbine.rotor_diameter_m/2;
        box.expandByPoint(new THREE.Vector3(hub.x,hub.y+radius,hub.z+radius));
        box.expandByPoint(new THREE.Vector3(hub.x,hub.y-radius,hub.z-radius));
      }
    }
    const sphere=box.getBoundingSphere(new THREE.Sphere());
    const fov=THREE.MathUtils.degToRad(this.camera.fov);
    const angle=Math.min(fov,2*Math.atan(Math.tan(fov/2)*this.camera.aspect));
    let distance=Math.max(2,sphere.radius/Math.sin(angle/2)*(whole?1.04:1.18));
    const direction=whole?new THREE.Vector3(1,.09,.38):new THREE.Vector3(1,.55,1.5);
    direction.normalize();
    if(whole){
      const right=new THREE.Vector3().crossVectors(new THREE.Vector3(0,1,0),direction).normalize();
      const up=new THREE.Vector3().crossVectors(direction,right).normalize();
      const tanV=Math.tan(fov/2),tanH=tanV*this.camera.aspect;
      distance=2;
      for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z]){
        const p=new THREE.Vector3(x,y,z).sub(sphere.center),depth=p.dot(direction);
        distance=Math.max(distance,Math.abs(p.dot(right))/tanH+depth,Math.abs(p.dot(up))/tanV+depth);
      }
      distance*=1.045;
    }
    const position=sphere.center.clone().addScaledVector(direction,distance);
    gsap.killTweensOf([this.camera.position,this.controls.target]);
    const duration=animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches?1.2:0;
    gsap.to(this.camera.position,{...position,duration,ease:'power2.inOut'});
    gsap.to(this.controls.target,{...sphere.center,duration,ease:'power2.inOut'});
    this.camera.near=Math.max(.03,distance/2000);this.camera.updateProjectionMatrix();
  }
  dispose(){gsap.killTweensOf([this.camera.position,this.controls.target]);this.controls.dispose();}
}
