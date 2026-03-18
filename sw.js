const CACHE='disseansim-v12';
const PAGES=['/app.html','/giris.html','/index.html'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(PAGES).catch(()=>{})));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
  const url=e.request.url;
  if(!url.startsWith('http://')&&!url.startsWith('https://'))return;
  if(e.request.method!=='GET')return;
  const parsed=new URL(url);
  if(parsed.pathname.startsWith('/api/'))return;
  if(parsed.hostname!==self.location.hostname)return;
  e.respondWith(fetch(e.request).then(r=>{if(r&&r.status===200&&r.type==='basic'){const rc=r.clone();caches.open(CACHE).then(c=>c.put(e.request,rc)).catch(()=>{});}return r;}).catch(()=>caches.match(e.request)));
});