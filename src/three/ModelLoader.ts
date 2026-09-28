import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

export class ModelLoader {
  private draco = new DRACOLoader().setDecoderPath(`${import.meta.env.BASE_URL}draco/`);
  private loader = new GLTFLoader().setDRACOLoader(this.draco).setMeshoptDecoder(MeshoptDecoder);
  async load(url: string, progress: (n:number)=>void) {
    progress(0);
    try {
      const gltf = await this.loader.loadAsync(url, e => progress(e.total ? Math.min(99,Math.round(e.loaded/e.total*100)) : 20));
      this.instanceFasteners(gltf.scene);
      progress(100);
      return gltf.scene;
    } catch (error) { console.error('Model Load Failed',error); throw new Error('Model Load Failed · 无法加载模型，请检查文件后重试。'); }
  }
  private instanceFasteners(root: THREE.Object3D) {
    const buckets = new Map<string, THREE.Mesh[]>();
    root.traverse(obj=>{
      if (obj instanceof THREE.Mesh && obj.userData.fastener && obj.parent) {
        const key=obj.parent.uuid+obj.geometry.uuid;
        buckets.set(key,[...(buckets.get(key)||[]),obj]);
      }
    });
    for (const objects of buckets.values()) {
      if (objects.length<2) continue;
      const first=objects[0],parent=first.parent!;
      const instances=new THREE.InstancedMesh(first.geometry,first.material,objects.length);
      instances.name=first.name+'_Instances';
      objects.forEach((obj,i)=>{obj.updateMatrix();instances.setMatrixAt(i,obj.matrix);parent.remove(obj);});
      instances.instanceMatrix.needsUpdate=true;instances.computeBoundingSphere();parent.add(instances);
    }
  }
  dispose() { this.draco.dispose(); }
}
