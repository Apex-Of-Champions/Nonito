const fs=require('fs'),http=require('http'),{spawn}=require('child_process'),path=require('path');
const root=process.cwd();
const server=http.createServer((req,res)=>{let p=path.join(root,decodeURIComponent(req.url.split('?')[0]==='/'?'/index.html':req.url.split('?')[0])); if(!p.startsWith(root)){res.writeHead(403);return res.end();}fs.readFile(p,(err,data)=>{if(err){res.writeHead(404);return res.end();}res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg'})[path.extname(p)]||'text/plain');res.end(data);});});
(async()=>{
 await new Promise(r=>server.listen(4173,'127.0.0.1',r));
 const chrome=spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--no-first-run','--disable-gpu','--remote-debugging-port=9223','--user-data-dir='+path.join(root,'.browser-check'),'about:blank'],{windowsHide:true,stdio:'ignore'});
 let ws;
 try{
 let tabs;for(let i=0;i<30;i++){try{tabs=await(await fetch('http://127.0.0.1:9223/json')).json();break;}catch{await new Promise(r=>setTimeout(r,300));}}
 ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);
 let id=0;const pending=new Map();const errors=[];
 ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result);}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text+': '+m.params.exceptionDetails.exception?.description);};
 const call=(method,params={})=>new Promise((resolve,reject)=>{pending.set(++id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
 const evaluate=async expression=>{const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
 await call('Runtime.enable');await call('Page.enable');
 await call('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
 console.log('navigate',await call('Page.navigate',{url:'http://127.0.0.1:4173'}));await new Promise(r=>setTimeout(r,1800));
 console.log('document',await evaluate('({url:location.href,title:document.title,body:document.body?.innerText.slice(0,200)})'));
 fs.mkdirSync('artifacts',{recursive:true});
 for(const width of [1440,1024,768,390,320]){
 await call('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<769});
 await new Promise(r=>setTimeout(r,200));
 console.log('layout',width,await evaluate(`({overflow:document.documentElement.scrollWidth>innerWidth,heading:document.querySelector('h1').innerText,images:[...document.images].filter(i=>i.src&&!i.complete).length})`));
 if(width===1440||width===390){const shot=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync('artifacts/'+width+'.png',Buffer.from(shot.data,'base64'));}
 }
 console.log('behavior',await evaluate(`(()=>{
 const results={};document.querySelectorAll('.filter-btn')[1].click();results.aiFilter=[...document.querySelectorAll('.case-card')].filter(c=>c.style.display!=='none').length===2;
 document.querySelector('.filter-btn').click();const card=document.querySelector('.case-card');card.focus();card.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}));results.modal=modal.classList.contains('active')&&document.activeElement.classList.contains('modal-close-btn');results.modalDebug={active:document.activeElement.outerHTML.slice(0,120),visibility:getComputedStyle(modal).visibility,button:modal.querySelector('button').outerHTML,parent:modal.parentElement.tagName,buttonVisibility:getComputedStyle(modal.querySelector('button')).visibility,buttonInert:modal.querySelector('button').closest('[inert]')?.outerHTML.slice(0,80),inert:modal.closest('[inert]')?.tagName};document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));results.focusReturn=document.activeElement===card;
 document.querySelector('.exp-card[onclick]').click();results.experience=modal.classList.contains('active')&&document.getElementById('caseDetails').hidden;hideModal();
 document.querySelectorAll('.arch-node')[2].click();results.architecture=document.getElementById('archDetailsPanel').textContent.includes('EDGE AI');
 terminalInput.value='<img src=x onerror=alert(1)>';terminalInput.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter'}));results.safeCLI=!terminalOutput.querySelector('img')&&terminalOutput.textContent.includes('<img');
 terminalInput.value='constructor';terminalInput.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter'}));results.unknownCommand=terminalOutput.textContent.includes('Command not found');
 document.querySelector('[data-command="help"]').click();results.help=terminalOutput.textContent.includes('Available commands');
 mobileBtn.click();results.mobileMenu=mobileBtn.getAttribute('aria-expanded')==='true';navLinks.querySelector('a').click();results.menuCloses=mobileBtn.getAttribute('aria-expanded')==='false';
 themeBtn.click();results.lightTheme=!document.documentElement.classList.contains('dark-mode');return results;})()`));
 await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
 console.log('reducedMotion',await evaluate(`getComputedStyle(document.querySelector('.hero-title')).animationName==='none'`));
 await evaluate(`Promise.all([...document.images].filter(i=>i.getAttribute('src')).map(i=>{i.loading='eager';return i.decode().catch(()=>null)}))`);
 console.log('brokenImages',await evaluate(`[...document.images].filter(i=>i.getAttribute('src')&&!i.naturalWidth).map(i=>i.src)`));
 await call('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
 await evaluate(`document.getElementById('projects').scrollIntoView();`);
 await new Promise(r=>setTimeout(r,200));
 const lightShot=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync('artifacts/projects-light.png',Buffer.from(lightShot.data,'base64'));
 console.log('errors',errors);
 // Create web-sized derivatives from existing supplied assets; originals stay intact.
 if(process.argv.includes('--optimize')){
 for(const file of ['image.png','ailert_cover.jpg','classifier_cover.jpg','idsystem_cover.jpg','researchengine_cover.jpg','image2.png','img1.png']){
 const result=await evaluate(`new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>{const scale=Math.min(1,1200/img.width);const canvas=document.createElement('canvas');canvas.width=Math.round(img.width*scale);canvas.height=Math.round(img.height*scale);canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);resolve({data:canvas.toDataURL('image/webp',.84),width:canvas.width,height:canvas.height});};img.onerror=reject;img.src=${JSON.stringify(file)};})`);
 const dest='assets/'+file.replace(/\.[^.]+$/,'.webp');fs.writeFileSync(dest,Buffer.from(result.data.split(',')[1],'base64'));console.log('asset',file,fs.statSync(file).size,'->',fs.statSync(dest).size);
 let html=fs.readFileSync('index.html','utf8');html=html.split(file).join(dest);html=html.replaceAll('src="'+dest+'"','src="'+dest+'" width="'+result.width+'" height="'+result.height+'"');fs.writeFileSync('index.html',html);
 let data=fs.readFileSync('js/projects.js','utf8');fs.writeFileSync('js/projects.js',data.split(file).join(dest));
 }
 }
 }finally{ws?.close();chrome.kill();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});



