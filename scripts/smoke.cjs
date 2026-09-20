const {chromium}=require('@playwright/test');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true,args:['--enable-webgl','--ignore-gpu-blocklist']});
 const page=await browser.newPage({viewport:{width:1600,height:1000}});const errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 await page.goto('http://127.0.0.1:5173');await page.waitForTimeout(6000);
 await page.screenshot({path:'docs/phase9.png'});console.log(JSON.stringify({errors,canvases:await page.locator('canvas').count(),text:await page.locator('body').innerText()}));
 await browser.close();if(errors.length)process.exit(1);
})();
