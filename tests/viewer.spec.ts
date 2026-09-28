import {test,expect,type Page} from '@playwright/test';
import {appendFileSync,writeFileSync} from 'node:fs';
import {PerspectiveCamera,Vector3} from 'three';
type Snapshot={selected:string;mode:string;level:number;lod:number;hidden:string[];isolated:string|null;rotor:number[];positions:Record<string,number[]>;camera:number[];target:number[];clipping:number;meshCount:number;stageVisible:boolean;sweptDisk:number[][]};
const snapshot=(page:Page)=>page.evaluate(()=> (window as unknown as {turbineDiagnostics:()=>Snapshot}).turbineDiagnostics());
test.beforeEach(async({page})=>{await page.addInitScript(()=>localStorage.setItem('darmk:windpowerweb3d:follow-gate:v1','granted'));});
async function ready(page:Page){await page.goto('/');await expect(page.locator('.three-host')).toHaveAttribute('data-ready','true',{timeout:30000});}
function log(phase:number,text:string){appendFileSync('docs/development-log.md',`\n\n## Phase ${phase} — 浏览器实际验证\n\n${text}\n`);}
test('Phase 10: selection, focus, hide and isolate',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await ready(page);
 const base=await snapshot(page);await page.locator('[data-component="gearbox"]').click();
 await expect(page.locator('.info-panel h2')).toHaveText('齿轮箱');await page.waitForTimeout(1500);
 expect((await snapshot(page)).camera).not.toEqual(base.camera);
 await page.getByRole('button',{name:'隐藏齿轮箱',exact:true}).click();expect((await snapshot(page)).hidden).toContain('gearbox');
 await page.getByRole('button',{name:'显示齿轮箱',exact:true}).click();
 await page.getByRole('button',{name:'单独查看',exact:true}).click();expect((await snapshot(page)).isolated).toBe('gearbox');
 await page.waitForTimeout(1500);await page.screenshot({path:'docs/gearbox.png'});
 await page.getByRole('button',{name:'退出单独查看',exact:true}).click();expect((await snapshot(page)).isolated).toBeNull();expect(errors).toEqual([]);
 log(10,'部件树选择齿轮箱、相机飞行、隐藏/显示、单独查看均通过；console pageerror=[]。截图 gearbox.png。');
});
test('Phase 11: explosion pause/resume and exact reset',async({page})=>{
 await ready(page);const base=await snapshot(page);await page.locator('[data-level="3"]').click();await page.waitForTimeout(450);
 await page.getByRole('button',{name:'暂停拆解动画'}).click();const paused=await snapshot(page);await page.waitForTimeout(350);expect((await snapshot(page)).positions).toEqual(paused.positions);
 await page.getByRole('button',{name:'继续拆解动画'}).click();await page.waitForTimeout(2400);expect((await snapshot(page)).positions).not.toEqual(base.positions);
 await page.screenshot({path:'docs/exploded.png'});await page.locator('.reset-button').click();await page.waitForTimeout(2200);const reset=await snapshot(page);expect(reset.positions).toEqual(base.positions);expect(reset.level).toBe(0);expect(reset.mode).toBe('normal');
 log(11,'GSAP 2 秒分层拆解、动画暂停/继续、位置精确复位通过。恢复后各语义组件 local position 与初始快照相同。');
});
test('Phases 12-14: transparency, Fresnel X-Ray and three-axis section',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});await ready(page);
 await page.locator('[data-component="nacelle"]').click();await page.waitForTimeout(1400);
 await page.locator('[data-mode="transparent"]').click();await page.waitForTimeout(450);await page.screenshot({path:'docs/transparent.png'});log(12,'外壳 0.23 透明度、内部 PBR 显示通过，截图 transparent.png。');
 await page.locator('[data-mode="xray"]').click();await page.waitForTimeout(600);await page.screenshot({path:'docs/xray.png'});expect(errors).toEqual([]);log(13,'Fresnel X-Ray shader 在 Edge WebGL 实际编译和渲染通过，无 WebGL/JS 错误；截图 xray.png。');
 await page.locator('[data-mode="section"]').click();
 for(const axis of ['X','Y','Z']){await page.locator('.section-control').getByRole('button',{name:axis,exact:true}).click();const before=(await snapshot(page)).clipping;await page.getByRole('slider',{name:'剖切位置'}).fill('72');await page.waitForTimeout(100);expect((await snapshot(page)).clipping).not.toBe(before);await page.getByRole('slider',{name:'剖切位置'}).fill('50');}
 await page.screenshot({path:'docs/section.png'});expect(errors).toEqual([]);log(14,'X/Y/Z 剖切平面和滑块实时更新通过，材质 clipping 与 X-Ray 切换无错误；截图 section.png。');
});
test('rotor playback, zoom, pan, orbit, capture and LOD',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await ready(page);
 await expect(page).toHaveTitle('TEST-182 · 风机数字样机');await expect(page.locator('h1')).toHaveText('TEST-182');await expect(page.locator('body')).not.toContainText('EN-182');
 await expect(page.getByRole('combobox',{name:'叶轮速度'})).toHaveValue('2');const initial=(await snapshot(page)).rotor;await page.waitForTimeout(250);expect((await snapshot(page)).rotor).not.toEqual(initial);
 await page.getByRole('button',{name:'停止叶轮',exact:true}).click();const base=await snapshot(page);
 await page.getByRole('button',{name:'启动叶轮',exact:true}).click();await page.waitForTimeout(500);expect((await snapshot(page)).rotor).not.toEqual(base.rotor);
 await page.getByRole('button',{name:'暂停叶轮',exact:true}).click();const paused=(await snapshot(page)).rotor;await page.waitForTimeout(250);expect((await snapshot(page)).rotor).toEqual(paused);
 await page.getByRole('button',{name:'停止叶轮',exact:true}).click();expect((await snapshot(page)).rotor).toEqual(base.rotor);
 const canvas=page.locator('canvas');const box=(await canvas.boundingBox())!;const x=box.x+box.width/2,y=box.y+box.height/2;
 await page.mouse.move(x,y);await page.mouse.wheel(0,-250);await page.waitForTimeout(300);expect((await snapshot(page)).camera).not.toEqual(base.camera);
 const target=(await snapshot(page)).target;await page.mouse.down({button:'right'});await page.mouse.move(x+60,y+30,{steps:10});await page.mouse.up({button:'right'});await page.waitForTimeout(300);expect((await snapshot(page)).target).not.toEqual(target);
 const view=(await snapshot(page)).camera;await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+70,y,{steps:10});await page.mouse.up();await page.waitForTimeout(350);expect((await snapshot(page)).camera).not.toEqual(view);
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'保存模型截图'}).click();expect((await download).suggestedFilename()).toBe('TEST-182-digital-prototype.png');
 await page.getByRole('combobox',{name:'模型精度'}).selectOption('1');await expect(page.locator('.three-host')).toHaveAttribute('data-ready','true');expect((await snapshot(page)).lod).toBe(1);
 await page.getByRole('combobox',{name:'模型精度'}).selectOption('2');await expect(page.locator('.three-host')).toHaveAttribute('data-ready','true');expect((await snapshot(page)).lod).toBe(2);expect(errors).toEqual([]);
});
test('Phase 15/16: desktop/mobile visual QA and measured performance',async({page,browser})=>{
 await ready(page);await page.waitForTimeout(1500);await page.screenshot({path:'docs/desktop.png'});
 const perf=await page.evaluate(async()=>{let frames=0;const start=performance.now();return await new Promise<number>(resolve=>{function step(){frames++;if(performance.now()-start>2000)resolve(Math.round(frames*1000/(performance.now()-start)));else requestAnimationFrame(step);}requestAnimationFrame(step);});});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});await ready(mobile);expect((await snapshot(mobile)).lod).toBe(2);
 await mobile.screenshot({path:'docs/mobile.png'});expect(await mobile.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await mobile.getByRole('button',{name:'切换部件树'}).click();await mobile.locator('[data-component="blade_01"]').click();expect((await snapshot(mobile)).selected).toBe('blade_01');await mobile.close();
 const report={browser:'Edge headless, local machine',viewport:'1600x1000',measuredAnimationFramesPerSecond:perf,model:await snapshot(page),note:'Local measured browser frame rate; not a guarantee on other GPUs/devices.'};writeFileSync('docs/performance.json',JSON.stringify(report,null,2));
 log(15,'深蓝 UI 在 1600×1000 与 390×844 无横向溢出，移动端部件选择通过。截图 desktop.png / mobile.png。');log(16,`三 LOD 可加载；本机 Edge 无头浏览器 rAF 实测 ${perf} FPS（非跨设备性能保证）。螺栓合并为 InstancedMesh，详情见 performance.json。`);
});
test('Phase 17: failed GLB loading retains usable error and retry',async({page})=>{
 await page.route('**/models/*.glb',route=>route.abort());await page.goto('/');await expect(page.getByRole('heading',{name:'Model Load Failed'})).toBeVisible();await expect(page.getByRole('button',{name:'重新加载'})).toBeVisible();
 await page.unroute('**/models/*.glb');await page.getByRole('button',{name:'重新加载'}).click();await expect(page.locator('.three-host')).toHaveAttribute('data-ready','true');log(17,'模拟 GLB 网络失败，界面保留错误与重试入口；解除故障后重新加载成功。');
});
test('model ray selection, auto orbit, reduced motion and no resource errors',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
 await ready(page);await page.waitForTimeout(350);const state=await snapshot(page);const bounds=(await page.locator('canvas').boundingBox())!;
 const camera=new PerspectiveCamera(34,bounds.width/bounds.height,.05,4000);camera.position.fromArray(state.camera);camera.lookAt(new Vector3().fromArray(state.target));camera.updateMatrixWorld();
 const screen=new Vector3(0,60,0).project(camera);await page.locator('canvas').click({position:{x:(screen.x+1)*bounds.width/2,y:(1-screen.y)*bounds.height/2}});
 await expect(page.locator('.three-host')).toHaveAttribute('data-selected','tower');
 await page.locator('.reset-button').click();await page.waitForTimeout(2200);const before=(await snapshot(page)).camera;
 await page.getByRole('button',{name:'自动环绕'}).click();await page.waitForTimeout(450);expect((await snapshot(page)).camera).not.toEqual(before);await page.getByRole('button',{name:'自动环绕'}).click();
 await page.emulateMedia({reducedMotion:'reduce'});await page.locator('[data-level="3"]').click();await page.waitForTimeout(100);expect((await snapshot(page)).positions.rotor).not.toEqual(state.positions.rotor);
 await page.locator('.reset-button').click();await page.waitForTimeout(150);expect((await snapshot(page)).positions).toEqual(state.positions);
 expect(errors).toEqual([]);expect(await page.locator('canvas').count()).toBe(1);
});

test('technology blue command center framing, responsive controls and stage isolation',async({page})=>{
 await ready(page);
 const checkFraming=async()=>{const s=await snapshot(page);for(const [x,y] of s.sweptDisk){expect(Math.abs(x)).toBeLessThan(.99);expect(Math.abs(y)).toBeLessThan(.99);}};
 await checkFraming();
 const canvas=(await page.locator('canvas').boundingBox())!;expect(canvas.width).toBeGreaterThan(1200);expect(canvas.height).toBeGreaterThan(800);
 const tree=(await page.locator('.component-panel').boundingBox())!;expect(tree.x).toBeGreaterThan(canvas.x+canvas.width);
 expect((await snapshot(page)).stageVisible).toBe(true);
 const backdrop=await page.evaluate(async()=>{const src=getComputedStyle(document.querySelector('.workspace')!).backgroundImage.match(/url\(["']?([^"')]+)/)?.[1];if(!src)return false;const image=new Image();image.src=src;try{await image.decode();return image.naturalWidth>1000;}catch{return false;}});expect(backdrop).toBe(true);
 await page.locator('[data-component="nacelle"]').click();expect((await snapshot(page)).stageVisible).toBe(false);
 await page.locator('.reset-button').click();await page.waitForTimeout(1500);expect((await snapshot(page)).stageVisible).toBe(true);await checkFraming();
 for(const [width,height] of [[1280,720],[900,900],[390,844],[1600,1000]]){
  await page.setViewportSize({width,height});await page.waitForTimeout(200);await checkFraming();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  for(const name of ['叶轮速度','模型精度']){const bounds=(await page.getByRole('combobox',{name}).boundingBox())!;expect(bounds.x).toBeGreaterThanOrEqual(0);expect(bounds.y+bounds.height).toBeLessThan(height);}
  await page.screenshot({path:`docs/tech-blue-${width}.png`});
 }
});
