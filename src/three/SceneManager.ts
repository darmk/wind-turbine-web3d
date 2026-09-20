import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { CameraManager } from './CameraManager';

export class SceneManager {
  scene = new THREE.Scene(); renderer: THREE.WebGLRenderer; camera: CameraManager;
  composer: EffectComposer; outline: OutlinePass; private observer: ResizeObserver;
  private environment: THREE.WebGLRenderTarget; private frame=0; private previous=0;
  onFrame?: (delta:number)=>void; onStats?: (fps:number,calls:number,triangles:number)=>void;
  onResize?:()=>void;
  private frames=0;private elapsed=0;
  constructor(private host: HTMLElement) {
    this.renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<768?1.25:1.75));
    this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=.9;
    this.renderer.info.autoReset=false;
    this.renderer.localClippingEnabled=true;this.renderer.setClearColor(0x06101f,0);
    this.renderer.domElement.setAttribute('aria-label','风机三维模型，拖动旋转，滚轮缩放');
    host.appendChild(this.renderer.domElement);this.camera=new CameraManager(this.renderer.domElement);
    const pmrem=new THREE.PMREMGenerator(this.renderer), room=new RoomEnvironment();
    this.environment=pmrem.fromScene(room,.04);this.scene.environment=this.environment.texture;this.scene.environmentIntensity=.55;room.dispose();pmrem.dispose();
    this.scene.add(new THREE.HemisphereLight(0xc8eaff,0x243951,.65));
    const key=new THREE.DirectionalLight(0xf4f8ff,2.2);key.position.set(80,200,100);this.scene.add(key);
    const rim=new THREE.DirectionalLight(0x6cb9ff,1);rim.position.set(-100,100,-70);this.scene.add(rim);
    const target=new THREE.WebGLRenderTarget(1,1,{samples:innerWidth<768?0:2});
    this.composer=new EffectComposer(this.renderer,target);
    this.composer.addPass(new RenderPass(this.scene,this.camera.camera));
    this.outline=new OutlinePass(new THREE.Vector2(1,1),this.scene,this.camera.camera);
    this.outline.edgeStrength=3;this.outline.edgeThickness=1;this.outline.visibleEdgeColor.set('#61d3ff');this.outline.hiddenEdgeColor.set('#183c5a');this.outline.enabled=false;
    this.composer.addPass(this.outline);this.composer.addPass(new OutputPass());
    this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(host);this.resize();
    this.frame=requestAnimationFrame(this.tick);
  }
  private resize(){const {width,height}=this.host.getBoundingClientRect();if(!width||!height)return;this.renderer.setSize(width,height);this.composer.setSize(width,height);this.camera.camera.aspect=width/height;this.camera.camera.updateProjectionMatrix();this.onResize?.();}
  private tick=(now:number)=>{
    this.frame=requestAnimationFrame(this.tick);const elapsed=this.previous?(now-this.previous)/1000:0;const delta=Math.min(elapsed,.05);this.previous=now;
    if(document.hidden)return;
    this.onFrame?.(delta);this.camera.controls.update();this.renderer.info.reset();this.composer.render();
    this.frames++;this.elapsed+=elapsed;
    if(this.elapsed>=1){this.onStats?.(Math.round(this.frames/this.elapsed),this.renderer.info.render.calls,this.renderer.info.render.triangles);this.frames=0;this.elapsed=0;}
  };
  dispose(){cancelAnimationFrame(this.frame);this.observer.disconnect();this.camera.dispose();this.outline.dispose();this.composer.dispose();this.environment.dispose();
    const geometries=new Set<THREE.BufferGeometry>();const materials=new Set<THREE.Material>();
    this.scene.traverse(obj=>{if(obj instanceof THREE.Mesh||obj instanceof THREE.LineSegments){geometries.add(obj.geometry);(Array.isArray(obj.material)?obj.material:[obj.material]).forEach(m=>materials.add(m));}});
    geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());this.renderer.dispose();this.renderer.domElement.remove();}
}
