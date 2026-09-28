<script setup lang="ts">
import {onMounted,onBeforeUnmount,ref,watch} from 'vue';
import * as THREE from 'three';
import {SceneManager} from '../three/SceneManager';import {ModelLoader} from '../three/ModelLoader';
import {ModelHierarchy} from '../three/ModelHierarchy';import {SelectionManager} from '../three/SelectionManager';
import {HighlightManager} from '../three/HighlightManager';import {TransparencyManager} from '../three/TransparencyManager';
import {SectionPlane} from '../three/SectionPlane';import {AnimationManager} from '../three/AnimationManager';import {ExplodedView} from '../three/ExplodedView';
import LoadingScreen from './LoadingScreen.vue';import type {ViewMode,Axis} from '../data/turbine';
import {displayModelName,turbine} from '../data/turbine';
import {PresentationStage} from '../three/PresentationStage';
const props=defineProps<{selected:string;mode:ViewMode;level:number;paused:boolean;running:boolean;speed:number;autoRotate:boolean;axis:Axis;section:number;lod:number}>();
const emit=defineEmits<{select:[id:string];ready:[ready:boolean];stats:[fps:number,calls:number,triangles:number];hidden:[ids:string[]];isolated:[v:boolean];retry:[]}>();
const host=ref<HTMLDivElement>();const progress=ref(0);const error=ref('');const ready=ref(false);
let scene:SceneManager|undefined;const loader=new ModelLoader();let disposed=false;
let stage:PresentationStage|undefined;
let model:THREE.Object3D,hierarchy:ModelHierarchy,selection:SelectionManager,highlight:HighlightManager,materials:TransparencyManager,section:SectionPlane,rotor:AnimationManager,explosion:ExplodedView;
function current(){return hierarchy.get(props.selected);}
function choose(){if(!ready.value)return;hierarchy.show(props.selected);emit('hidden',[...hierarchy.hidden]);highlight.select(props.selected==='turbine'?undefined:current());materials.update(props.mode,props.selected==='turbine'?null:current());scene!.camera.focus(current(),true,props.selected==='turbine');updateSection();}
function updateSection(){if(ready.value)section.set(props.mode==='section',props.axis,props.section,props.selected==='turbine'?model:current());}
function fit(){if(ready.value)scene!.camera.focus(model,true,true);}
function focus(){if(ready.value)scene!.camera.focus(current(),true,props.selected==='turbine');}
function toggle(id:string){if(ready.value){hierarchy.toggle(id);emit('hidden',[...hierarchy.hidden]);}}
function isolate(){if(ready.value){hierarchy.isolate(hierarchy.isolated?null:props.selected);emit('isolated',!!hierarchy.isolated);focus();}}
function reset(){if(!ready.value)return;explosion.reset();rotor.stop();hierarchy.reset();materials.update('normal',null);highlight.select();section.set(false,props.axis,50,model);scene!.camera.controls.autoRotate=false;emit('hidden',[]);emit('isolated',false);fit();}
function stop(){rotor?.stop();}
function capture(){if(!scene)return;scene.composer.render();const a=document.createElement('a');a.href=scene.renderer.domElement.toDataURL('image/png');a.download=`${displayModelName}-digital-prototype.png`;a.click();}
function diagnostics(){return ready.value?{selected:props.selected,mode:props.mode,level:props.level,lod:props.lod,hidden:[...hierarchy.hidden],isolated:hierarchy.isolated,rotor:hierarchy.get('rotor').quaternion.toArray(),positions:Object.fromEntries([...hierarchy.objects].map(([id,o])=>[id,o.position.toArray()])),camera:scene!.camera.camera.position.toArray(),target:scene!.camera.controls.target.toArray(),clipping:section.plane.constant,stageVisible:stage?.visible,sweptDisk:(()=>{
 const hub=hierarchy.get('rotor').getWorldPosition(new THREE.Vector3()),radius=turbine.rotor_diameter_m/2;
 return [...Array.from({length:72},(_,i)=>new THREE.Vector3(hub.x,hub.y+Math.cos(i/72*Math.PI*2)*radius,hub.z+Math.sin(i/72*Math.PI*2)*radius)),new THREE.Vector3(0,0,0)].map(p=>p.project(scene!.camera.camera).toArray());
})(),meshCount:(()=>{let n=0;model.traverse(o=>{if(o instanceof THREE.Mesh)n++});return n;})()}:null;}
defineExpose({fit,focus,toggle,isolate,reset,stop,capture,diagnostics});
watch(()=>props.selected,choose);
watch(()=>props.mode,()=>{if(ready.value){materials.update(props.mode,props.selected==='turbine'?null:current());updateSection();}});
watch(()=>[props.axis,props.section],updateSection);
watch(()=>props.level,level=>{if(ready.value){rotor.stop();explosion.set(level,()=>{updateSection();scene!.camera.focus(props.selected==='turbine'?model:current(),true,props.selected==='turbine');});}});
watch(()=>props.paused,paused=>explosion?.pause(paused));
watch(()=>props.running,running=>{if(rotor)rotor.running=running&&props.level===0;});
watch(()=>props.speed,speed=>{if(rotor)rotor.speed=speed;});
watch(()=>props.autoRotate,v=>{if(scene)scene.camera.controls.autoRotate=v;});
watch(()=>[props.selected,props.level,props.mode],()=>{if(stage)stage.visible=props.selected==='turbine'&&props.level===0&&props.mode==='normal';});
function lost(e:Event){e.preventDefault();error.value='WebGL 上下文已丢失，请重新加载模型。';ready.value=false;emit('ready',false);}
onMounted(async()=>{
 emit('ready',false);
 try{
  scene=new SceneManager(host.value!);scene.renderer.domElement.addEventListener('webglcontextlost',lost);scene.onStats=(...stats)=>emit('stats',...stats);
  const suffix=props.lod===0?'':`-lod${props.lod}`;model=await loader.load(`${import.meta.env.BASE_URL}models/en182-5mw${suffix}.glb`,n=>progress.value=n);
  if(disposed){model.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose());}});return;}
  scene.scene.add(model);hierarchy=new ModelHierarchy(model);materials=new TransparencyManager(model);highlight=new HighlightManager(scene.outline);
  model.updateWorldMatrix(true,true);stage=new PresentationStage();scene.scene.add(stage);
  stage.visible=props.selected==='turbine'&&props.level===0&&props.mode==='normal';
  section=new SectionPlane(scene.scene,materials);rotor=new AnimationManager(hierarchy.get('rotor'));explosion=new ExplodedView(hierarchy);
  selection=new SelectionManager(scene.renderer.domElement,scene.camera.camera,hierarchy,id=>emit('select',id));
  scene.onFrame=delta=>rotor.tick(delta);ready.value=true;emit('ready',true);scene.camera.focus(model,false,true);
  scene.onResize=()=>{if(ready.value)scene!.camera.focus(current(),false,props.selected==='turbine');};
  rotor.speed=props.speed;rotor.running=props.running&&props.level===0;scene.camera.controls.autoRotate=props.autoRotate;
  materials.update(props.mode,props.selected==='turbine'?null:current());updateSection();
  if(props.selected!=='turbine')choose();
  if(props.level>0){explosion.set(props.level);explosion.pause(props.paused);}
  (window as Window & {turbineDiagnostics?:()=>unknown}).turbineDiagnostics=diagnostics;
 }catch(e){console.error(e);error.value=String(e);emit('ready',false);}
});
onBeforeUnmount(()=>{disposed=true;selection?.dispose();explosion?.dispose();section?.dispose();materials?.dispose();loader.dispose();scene?.renderer.domElement.removeEventListener('webglcontextlost',lost);scene?.dispose();delete (window as Window & {turbineDiagnostics?:()=>unknown}).turbineDiagnostics;});
</script>
<template><div ref="host" class="three-host" :data-ready="ready" :data-selected="selected" :data-view-mode="mode"><LoadingScreen v-if="!ready||error" :progress="progress" :error="error" @retry="emit('retry')"/></div></template>
