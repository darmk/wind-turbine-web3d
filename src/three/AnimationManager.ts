import * as THREE from 'three';
import {initialRotorSpeed} from '../data/turbine';
export class AnimationManager {
  running=false;speed=initialRotorSpeed;private base:THREE.Quaternion;
  constructor(private rotor:THREE.Object3D){this.base=rotor.quaternion.clone();}
  tick(delta:number){if(this.running)this.rotor.rotateX(delta*.32*this.speed);}
  stop(){this.running=false;this.rotor.quaternion.copy(this.base);}
}
