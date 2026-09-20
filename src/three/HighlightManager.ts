import * as THREE from 'three';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
export class HighlightManager {
  constructor(private outline:OutlinePass){}
  select(object?:THREE.Object3D){this.outline.selectedObjects=object?[object]:[];this.outline.enabled=!!object;}
}
