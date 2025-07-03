#!/usr/bin/env node
const https = require('https');
const http = require('http');

function printHelp() {
  console.log(`
link-checker - Verifica links relativos problemáticos em HTML bruto

Uso:
  link-checker <URL>

Exemplo:
  link-checker https://www.seusite.com.br/
  link-checker http://localhost:8080/

Opções:
  --help         Exibe esta mensagem
`);
}

// Corrigido: Mensagem amigável se não passar URL
if (process.argv.includes('--help')) {
  printHelp();
  process.exit(0);
}

if (process.argv.length < 3) {
  console.log('Erro: Nenhuma URL fornecida.\n');
  printHelp();
  process.exit(0);
}

let url = process.argv[2];

// Permitir http e https
const client = url.startsWith('https://') ? https : http;

// Ignorar erro de certificado self-signed
const options = {
  rejectUnauthorized: false,
};

client.get(url, options, res => {
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
}).on('error', (e) => {
  console.error('Erro ao acessar a URL:', e.message);
  process.exit(0);
}); 