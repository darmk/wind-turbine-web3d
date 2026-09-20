import * as THREE from 'three';
import { components } from '../data/components';
export class ModelHierarchy {
  objects = new Map<string,THREE.Object3D>();
  hidden = new Set<string>(); isolated: string|null=null;
  constructor(public root:THREE.Object3D){
    for(const c of components){const object=root.getObjectByName(c.objectNames[0]);if(!object)throw Error('模型缺少必需部件：'+c.objectNames[0]);object.userData.componentId=c.id;this.objects.set(c.id,object);}
  }
  get(id:string){return this.objects.get(id)!;}
  id(object:THREE.Object3D|null):string|null{while(object){if(object.userData.componentId)return object.userData.componentId;object=object.parent;}return null;}
  contains(parent:THREE.Object3D,object:THREE.Object3D){let o:THREE.Object3D|null=object;while(o){if(o===parent)return true;o=o.parent;}return false;}
  toggle(id:string){this.hidden.has(id)?this.hidden.delete(id):this.hidden.add(id);this.updateVisibility();}
  isolate(id:string|null){this.isolated=id;this.updateVisibility();}
  show(id:string){let object:THREE.Object3D|null=this.get(id);while(object){this.hidden.delete(this.id(object)||'');object=object.parent;}this.updateVisibility();}
  updateVisibility(){const isolated=this.isolated?this.get(this.isolated):null;
    this.root.traverse(obj=>{obj.visible=true;});
    if(isolated)this.root.traverse(obj=>{if(obj instanceof THREE.Mesh)obj.visible=this.contains(isolated,obj);});
    for(const id of this.hidden)this.get(id).visible=false;
  }
  reset(){this.hidden.clear();this.isolated=null;this.updateVisibility();}
}
