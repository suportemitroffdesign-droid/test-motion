// Actual playback through a local HTTP media server, the supported browser route.
// Node 22+; Chromium executable can be passed as the first argument.
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const os=require('node:os');
const {spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const video=path.join(root,'out','mitroff-intro-v3-preview.mp4');
const size=fs.statSync(video).size;
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'mitroff-playback-'));
const server=http.createServer((req,res)=>{
 if(req.url==='/player.html'){
  res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
  return res.end('<html><body><video id="v" src="/video.mp4" controls preload="auto"></video></body></html>');
 }
 if(req.url!=='/video.mp4'){res.writeHead(404);return res.end();}
 const match=/^bytes=(\d+)-(\d*)$/.exec(req.headers.range||'');
 const start=match?Number(match[1]):0;
 const end=match&&match[2]?Math.min(Number(match[2]),size-1):size-1;
 if(start>end||start>=size){res.writeHead(416,{'Content-Range':`bytes */${size}`});return res.end();}
 const headers={'Content-Type':'video/mp4','Accept-Ranges':'bytes','Content-Length':end-start+1};
 if(match)headers['Content-Range']=`bytes ${start}-${end}/${size}`;
 res.writeHead(match?206:200,headers);
 if(req.method==='HEAD')return res.end();
 fs.createReadStream(video,{start,end}).pipe(res);
});
let chrome,ws,nextId=0;
const pending=new Map();
const wait=ms=>new Promise(r=>{const timer=setTimeout(r,ms);timer.unref();});
const send=(method,params={})=>new Promise((resolve,reject)=>{
 const id=++nextId;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));
});
(async()=>{
 try{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const player=`http://127.0.0.1:${server.address().port}/player.html`;
  const port=9326;
  chrome=spawn(process.argv[2]||'/usr/bin/chromium',['--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-background-networking','--autoplay-policy=no-user-gesture-required','--remote-allow-origins=*',`--remote-debugging-port=${port}`,`--user-data-dir=${path.join(temp,'profile')}`,player],{stdio:'ignore'});
  let targets=[];
  for(let i=0;i<100;i++){
   try{targets=await(await fetch(`http://127.0.0.1:${port}/json/list`)).json();if(targets.some(t=>t.type==='page'))break;}catch{}
   await wait(100);
  }
  const target=targets.find(t=>t.type==='page');if(!target)throw new Error('Browser target missing');
  ws=new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r,j)=>{ws.addEventListener('open',r,{once:true});ws.addEventListener('error',j,{once:true});});
  ws.addEventListener('message',event=>{
   const msg=JSON.parse(event.data),item=pending.get(msg.id);
   if(item){pending.delete(msg.id);msg.error?item.reject(new Error(msg.error.message)):item.resolve(msg.result);}
  });
  await send('Page.enable');
  const loaded=new Promise(resolve=>{
   const listener=event=>{if(JSON.parse(event.data).method==='Page.loadEventFired'){ws.removeEventListener('message',listener);resolve();}};
   ws.addEventListener('message',listener);
  });
  await send('Page.navigate',{url:player});
  await Promise.race([loaded,wait(8000).then(()=>{throw new Error('Player page load timeout');})]);
  const result=await send('Runtime.evaluate',{awaitPromise:true,returnByValue:true,expression:`(async()=>{
   const v=document.getElementById('v');
   if(!v)throw new Error(location.href+' / '+document.body.innerText.slice(0,250));
   await new Promise((resolve,reject)=>{
    if(v.readyState>=2)return resolve();
    v.addEventListener('loadeddata',resolve,{once:true});
    v.addEventListener('error',()=>reject(new Error('Media decode failed')),{once:true});
    setTimeout(()=>reject(new Error('Media load timeout')),10000);
   });
   v.volume=.05;await v.play();await new Promise(r=>setTimeout(r,1600));
   const played=v.currentTime,frames=v.getVideoPlaybackQuality().totalVideoFrames;
   v.pause();v.currentTime=18;
   await new Promise((resolve,reject)=>{v.addEventListener('seeked',resolve,{once:true});setTimeout(()=>reject(new Error('Seek failed')),6000);});
   return {duration:v.duration,width:v.videoWidth,height:v.videoHeight,played_seconds:played,decoded_frames:frames,seek_to:v.currentTime,error:v.error?.message??null,ready_state:v.readyState,aac_support:v.canPlayType('audio/mp4; codecs="mp4a.40.2"')};
  })()`});
  if(result.exceptionDetails)throw new Error(JSON.stringify(result.exceptionDetails));
  const value=result.result.value;
  if(value.error||Math.abs(value.duration-20)>.05||value.width!==1080||value.height!==1920||value.played_seconds<.5||value.decoded_frames<10||value.seek_to<17.9||!value.aac_support)throw new Error(JSON.stringify(value));
  const report={status:'passed',method:'Chromium HTMLVideoElement playback and seek through loopback HTTP',...value};
  fs.writeFileSync(path.join(root,'out','browser-playback-v3.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report,null,2));
 }finally{if(ws)ws.close();if(chrome)chrome.kill('SIGTERM');server.closeAllConnections();server.close();}
})().catch(error=>{console.error(error.message);process.exitCode=1;});
