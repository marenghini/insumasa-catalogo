/* InsuMasa: guarda el catálogo para que abra rápido; siempre intenta traer la versión nueva primero.
   Las fotos (carpeta img/, con nombre único por foto) se guardan en el celular y no se vuelven a descargar. */
const C='insumasa-v3', IMG='insumasa-img-v1';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(['./','icon-192.png','manifest.webmanifest'])).catch(()=>{}));});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C&&k!==IMG).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{ if(e.request.method!=='GET') return; const u=new URL(e.request.url); if(u.origin!==location.origin) return;
  if(u.pathname.includes('/img/')){
    e.respondWith(caches.open(IMG).then(c=>c.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{ if(r.ok) c.put(e.request,r.clone()); return r; }))));
    return;
  }
  e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r;}).catch(()=>caches.match(e.request)));});
