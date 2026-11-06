/* =====================================================================
   ForestEye : service worker de la version installable (GitHub Pages).
   Stratégie « cache puis réseau » : une ressource déjà en cache est servie
   sans réseau ; sinon elle est téléchargée, puis gardée pour la suite.
   VERSION est incrémentée à chaque construction (outils/construire-site.mjs) :
   la nouvelle version de l'application remplace alors l'ancienne.
   Les tuiles de carte (IGN, OSM, cadastre) vont dans un cache à part, gardé
   d'une version à l'autre (carte hors ligne préparée dans 1 · Préparer).
   Les services en ligne (cadastre, communes, forêts publiques) passent
   toujours par le réseau.
   ===================================================================== */
const VERSION = 10;
const CACHE_APP = "foresteye-app-v" + VERSION;
const CACHE_TUILES = "foresteye-tuiles";
const COEUR = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];
const CDN = [
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js",
  "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js",
  "https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,400;0,600;1,400&family=Archivo:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
];

self.addEventListener("install", e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE_APP);
    await c.addAll(COEUR);
    // Leaflet est chargé avec une empreinte d'intégrité : il faut une réponse CORS, pas opaque
    await Promise.all(CDN.map(async u => {
      try {
        const r = await fetch(u, { mode: u.indexOf("leaflet") >= 0 ? "cors" : "no-cors", credentials: "omit" });
        if (r.ok || r.type === "opaque") await c.put(u, r);
      } catch (err) { /* hors ligne à l'installation : la ressource sera mise en cache au premier usage */ }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    const cles = await caches.keys();
    await Promise.all(cles.filter(k => k.indexOf("foresteye-app-") === 0 && k !== CACHE_APP).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (/apicarto\.ign\.fr$|geo\.api\.gouv\.fr$/.test(url.hostname) || /\/wfs/.test(url.pathname)) return;
  const tuile = /(^|\.)data\.geopf\.fr$|tile\.openstreetmap\.org$/.test(url.hostname);
  e.respondWith((async () => {
    const deja = await caches.match(req, { ignoreVary: true });
    if (deja) return deja;
    try {
      const r = await fetch(req);
      if (r && (r.ok || r.type === "opaque")) {
        const c = await caches.open(tuile ? CACHE_TUILES : CACHE_APP);
        c.put(req, r.clone()).catch(() => {});
      }
      return r;
    } catch (err) {
      if (req.mode === "navigate") { const p = await caches.match("./index.html"); if (p) return p; }
      return Response.error();
    }
  })());
});
