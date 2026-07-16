const CACHE='forja-v23';
const ASSETS=['index.html','app.js','manifest.json','icon-192.png','icon-512.png',
  'https://fonts.googleapis.com/css2?family=Anton&family=Barlow:wght@400;500;600;700&display=swap'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS).catch(()=>{})));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=e.request.url;
  // No interceptar YouTube ni recursos de Google video: dejar pasar a la red directamente
  if(/youtube\.com|youtube-nocookie\.com|ytimg\.com|googlevideo\.com|ggpht\.com/.test(u))return;
  e.respondWith(caches.match(e.request).then(cached=>{
    const net=fetch(e.request).then(res=>{if(res&&res.status===200){const cp=res.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));}return res;}).catch(()=>cached);
    return cached||net;
  }));
});
