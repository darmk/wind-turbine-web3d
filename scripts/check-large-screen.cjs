const {chromium}=require('@playwright/test');
const fs=require('node:fs');
(async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  const page=await browser.newPage({viewport:{width:3840,height:2160},deviceScaleFactor:1});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
  await page.goto(process.env.TEST_URL||'http://127.0.0.1:4173');
  await page.locator('.three-host[data-ready="true"]').waitFor();
  await page.waitForTimeout(2200);
  const measuredFps=await page.evaluate(async()=>{const start=performance.now();let frames=0;return new Promise(resolve=>{function tick(){frames++;const elapsed=performance.now()-start;if(elapsed>=2500)resolve(Math.round(frames*1000/elapsed));else requestAnimationFrame(tick);}requestAnimationFrame(tick);});});
  const report=await page.evaluate(()=>({viewport:[innerWidth,innerHeight],overflow:document.documentElement.scrollWidth>innerWidth,canvasCount:document.querySelectorAll('canvas').length,status:document.querySelector('.status-performance').textContent,diagnostics:window.turbineDiagnostics()}));
  await page.screenshot({path:'docs/large-screen.png'});
  await browser.close();report.measuredFps=measuredFps;report.errors=errors;report.passed=!errors.length&&!report.overflow&&report.canvasCount===1;
  fs.writeFileSync('docs/large-screen-check.json',JSON.stringify(report,null,2));console.log(JSON.stringify({passed:report.passed,viewport:report.viewport,measuredFps,status:report.status,errors}));
  if(!report.passed)process.exit(1);
})();
