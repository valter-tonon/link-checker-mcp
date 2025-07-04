#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import https from "https";
import http from "http";

/**
 * Faz a requisição HTTP/HTTPS para obter o HTML da página
 */
async function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https://') ? https : http;
    
    const options = {
      rejectUnauthorized: false, // Permite certificados self-signed
    };

    client.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', (err) => reject(err));
  });
}

/**
 * Analisa o HTML e encontra links problemáticos
 */
function findProblematicLinks(html) {
  const hrefRegex = /href\s*=\s*["']([^"']+)["']/gi;
  let match;
  const problematicLinks = [];
  
  while ((match = hrefRegex.exec(html)) !== null) {
    const href = match[1];
    
    // Verifica se é um link problemático (relativo sem barra inicial)
    if (
      href &&
      !href.startsWith('/') &&
      !href.startsWith('http') &&
      !href.startsWith('https') &&
      !href.startsWith('#') &&
      !href.startsWith('mailto:') &&
      !href.startsWith('tel:') &&
      !href.startsWith('javascript:')
    ) {
      problematicLinks.push(href);
    }
  }
  
  return [...new Set(problematicLinks)]; // Remove duplicatas
}

// Criar servidor MCP
const server = new McpServer({
  name: "link-checker",
  version: "1.0.0"
});

// Registrar tool para verificação de links
server.registerTool(
  "check-problematic-links",
  {
    title: "Verificar Links Problemáticos",
    description: "Analisa uma página HTML e encontra links relativos problemáticos que podem causar erros de navegação",
    inputSchema: {
      url: z.string().url().describe("URL da página para analisar (deve incluir http:// ou https://)")
    }
  },
  async ({ url }) => {
    try {
      // Fazer requisição para obter HTML
      const html = await fetchHtml(url);
      
      // Encontrar links problemáticos
      const problematicLinks = findProblematicLinks(html);
      
      if (problematicLinks.length === 0) {
        return {
          content: [{
            type: "text",
            text: `✅ Análise da URL: ${url}\n\nNenhum link problemático encontrado!\n\nA página está livre de links relativos que poderiam causar erros de navegação.`
          }]
        };
      } else {
        const linksList = problematicLinks.map(link => `  • ${link}`).join('\n');
        return {
          content: [{
            type: "text",
            text: `⚠️ Análise da URL: ${url}\n\n🔍 Links problemáticos encontrados (${problematicLinks.length}):\n\n${linksList}\n\n💡 Estes links são relativos e podem causar erros 404 dependendo da URL atual. Considere adicionar '/' no início ou usar URLs absolutas.`
          }]
        };
      }
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `❌ Erro ao analisar a URL: ${url}\n\nDetalhes do erro: ${error.message}\n\nVerifique se:\n- A URL está correta e acessível\n- O servidor está respondendo\n- Há conexão com a internet`
        }],
        isError: true
      };
    }
  }
);

// Registrar resource para documentação
server.registerResource(
  "documentation",
  "link-checker://docs",
  {
    title: "Documentação do Link Checker",
    description: "Documentação sobre como usar o verificador de links problemáticos",
    mimeType: "text/markdown"
  },
  async (uri) => ({
    contents: [{
      uri: uri.href,
      text: `# Link Checker MCP

## Descrição
Este MCP server analisa páginas HTML e identifica links relativos problemáticos que podem causar erros de navegação.

## Como usar
Use a tool \`check-problematic-links\` fornecendo uma URL para análise.

## O que são links problemáticos?
Links problemáticos são aqueles que:
- Não começam com \`/\` (raiz do site)
- Não são URLs absolutas (\`http://\` ou \`https://\`)
- Não são âncoras (\`#\`)
- Não são protocolos especiais (\`mailto:\`, \`tel:\`, \`javascript:\`)

Exemplo: \`href="categoria/produtos"\` pode causar problemas dependendo da URL atual.

## Solução recomendada
- Use \`/categoria/produtos\` para links relativos à raiz
- Ou use URLs absolutas: \`https://seusite.com/categoria/produtos\`
`
    }]
  })
);

// Conectar servidor usando stdio transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Erro ao iniciar servidor MCP:", error);
  process.exit(1);
}); 