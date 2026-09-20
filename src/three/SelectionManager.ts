import * as THREE from 'three';
import { ModelHierarchy } from './ModelHierarchy';
export class SelectionManager {
  private ray=new THREE.Raycaster();private start=new THREE.Vector2();
  constructor(private canvas:HTMLCanvasElement,private camera:THREE.Camera,private hierarchy:ModelHierarchy,private select:(id:string)=>void){canvas.addEventListener('pointerdown',this.down);canvas.addEventListener('pointerup',this.up);}
  private down=(e:PointerEvent)=>{this.start.set(e.clientX,e.clientY);};
  private up=(e:PointerEvent)=>{
    if(e.button!==0||this.start.distanceTo(new THREE.Vector2(e.clientX,e.clientY))>5)return;
    const r=this.canvas.getBoundingClientRect();this.ray.setFromCamera(new THREE.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),this.camera);
    const hits=this.ray.intersectObject(this.hierarchy.root,true);
    for(const hit of hits){
      let visible=true;for(let o:THREE.Object3D|null=hit.object;o;o=o.parent)if(!o.visible)visible=false;
      const mesh=hit.object as THREE.Mesh;const material=Array.isArray(mesh.material)?mesh.material[0]:mesh.material;
      if(!visible||(material.transparent&&material.opacity<.4))continue;
      if(material.clippingPlanes?.some(p=>p.distanceToPoint(hit.point)<0))continue;
      const id=this.hierarchy.id(hit.object);if(id){this.select(id);return;}
    }
  };
  dispose(){this.canvas.removeEventListener('pointerdown',this.down);this.canvas.removeEventListener('pointerup',this.up);}
}
