import * as THREE from 'three';

/** Ground-level presentation stage, separate from the selectable engineering model. */
export class PresentationStage extends THREE.Group {
  constructor() {
    super();this.name='Presentation_Stage';
    const lineMaterial=new THREE.LineBasicMaterial({color:0x438fdb,transparent:true,opacity:.43,depthWrite:false});
    const platform=new THREE.Mesh(new THREE.CylinderGeometry(34,35,.45,128),new THREE.MeshStandardMaterial({color:0x081b36,metalness:.72,roughness:.38}));
    platform.position.y=-.65;this.add(platform);
    [10,25,32,35,42].forEach((r,i)=>{
      const ring=new THREE.Mesh(new THREE.RingGeometry(r-(i===2?.22:.09),r,128),new THREE.MeshBasicMaterial({color:i===2?0x82caff:0x3c83c6,transparent:true,opacity:i===2?.9:.5,side:THREE.DoubleSide,depthWrite:false}));
      ring.rotation.x=-Math.PI/2;ring.position.y=-.39;this.add(ring);
    });
    const radial:THREE.Vector3[]=[];
    for(let i=0;i<80;i++){
      const a=i/80*Math.PI*2;
      for(const r of [36,i%5===0?40:37.5])radial.push(new THREE.Vector3(Math.cos(a)*r,-.38,Math.sin(a)*r));
    }
    this.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(radial),lineMaterial));
  }
}
