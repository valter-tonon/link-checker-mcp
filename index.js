#!/usr/bin/env node
const https = require('https');
const url = process.argv[2];
if (!url) {
  console.error('Uso: link-checker-mcp <URL>');
  process.exit(1);
}
https.get(url, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const r = /href\s*=\s*["']([^"']+)["']/gi;
    let m;
    const p = [];
    while ((m = r.exec(d)) !== null) {
      const h = m[1];
      if (
        h &&
        !h.startsWith('/') &&
        !h.startsWith('http') &&
        !h.startsWith('https') &&
        !h.startsWith('#') &&
        !h.startsWith('mailto:') &&
        !h.startsWith('tel:') &&
        !h.startsWith('javascript:')
      ) p.push(h);
    }
    if (p.length) {
      console.log('Links problemáticos encontrados:');
      p.forEach(l => console.log(l));
    } else {
      console.log('Nenhum link problemático encontrado!');
    }
  });
}); 