# Link Checker MCP

## 🚀 O que é?

O **link-checker-mcp** é um servidor MCP (Model Context Protocol) que analisa páginas HTML e identifica links relativos problemáticos que podem causar erros de navegação (404) em sites. É ideal para times de desenvolvimento, QA e manutenção de sites e e-commerces.

- **Detecta links problemáticos:** `href="baterias/c/233"` (relativos sem barra inicial)
- **Evita problemas de navegação** em sites com múltiplos níveis de URL
- **Integração nativa com Cursor IDE, Claude Desktop e outras ferramentas MCP**

---

## 🛠️ Como funciona?

O servidor MCP oferece uma tool `check-problematic-links` que:
1. Faz uma requisição HTTP para a URL informada
2. Captura o HTML bruto da página
3. Analisa todos os atributos `href` encontrados
4. Identifica links que não começam com: `/`, `http`, `https`, `#`, `mailto:`, `tel:`, `javascript:`
5. Retorna um relatório detalhado com os problemas encontrados

---

## 📦 Instalação

### Via NPM (recomendado)
```bash
npm install -g link-checker-mcp
```

### Via repositório
```bash
git clone https://github.com/valter-tonon/link-checker-mcp.git
cd link-checker-mcp
npm install
```

---

## 🔧 Configuração MCP

### Para Cursor IDE

Adicione ao seu `.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "link-checker": {
      "command": "npx",
      "args": ["link-checker-mcp@latest"]
    }
  }
}
```

### Para Claude Desktop

Adicione ao seu `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "link-checker": {
      "command": "npx",
      "args": ["-y", "link-checker-mcp@latest"]
    }
  }
}
```

### Para VS Code

Adicione ao seu User Settings (JSON) ou `.vscode/mcp.json`:
```json
{
  "mcp": {
    "servers": {
      "link-checker": {
        "command": "npx",
        "args": ["-y", "link-checker-mcp"]
      }
    }
  }
}
```

---

## 🚀 Como usar

### Via MCP (recomendado)

1. Configure o servidor MCP conforme as instruções acima
2. No seu editor (Cursor, Claude Desktop, etc.), use a tool:
   - **Tool:** `check-problematic-links`
   - **Parâmetro:** URL da página para analisar

### Via linha de comando (modo standalone)
```bash
npx link-checker-mcp
# O servidor ficará rodando aguardando comandos MCP via stdin/stdout
```

---

## 📋 Funcionalidades MCP

### Tools disponíveis:

#### `check-problematic-links`
- **Descrição:** Analisa uma página HTML e encontra links relativos problemáticos
- **Parâmetros:**
  - `url` (string): URL da página para analisar (deve incluir http:// ou https://)
- **Retorna:** Relatório detalhado com links problemáticos encontrados

### Resources disponíveis:

#### `link-checker://docs`
- **Descrição:** Documentação completa sobre como usar o verificador de links
- **Formato:** Markdown
- **Conteúdo:** Explicações detalhadas, exemplos e soluções recomendadas

---

## 📋 Exemplo de saída

### ✅ Quando não há problemas:
```
✅ Análise da URL: https://exemplo.com

Nenhum link problemático encontrado!

A página está livre de links relativos que poderiam causar erros de navegação.
```

### ⚠️ Quando há problemas:
```
⚠️ Análise da URL: https://exemplo.com

🔍 Links problemáticos encontrados (3):

  • baterias/c/233
  • acessorios/c/146
  • categoria/produtos

💡 Estes links são relativos e podem causar erros 404 dependendo da URL atual. 
Considere adicionar '/' no início ou usar URLs absolutas.
```

---

## 🛡️ Tratamento de erros

O servidor MCP trata adequadamente:
- URLs inacessíveis ou inválidas
- Problemas de conectividade
- Certificados SSL auto-assinados
- Timeouts de conexão

Todas as mensagens de erro são informativas e incluem sugestões de solução.

---

## 📝 Detalhes técnicos

- **Linguagem:** Node.js (ES Modules)
- **Protocolo:** Model Context Protocol (MCP)
- **Dependências:** 
  - `@modelcontextprotocol/sdk` - SDK oficial do MCP
  - `zod` - Validação de schema
- **Compatibilidade:** Node.js >= 18
- **Transport:** Stdio (padrão MCP)

---

## 🔄 Desenvolvimento

### Executar localmente:
```bash
git clone https://github.com/valter-tonon/link-checker-mcp.git
cd link-checker-mcp
npm install
node index.js
```

### Testar com MCP Inspector:
```bash
npx @modelcontextprotocol/inspector node index.js
```

---

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 🧑‍💻 Autor

**Valter Tonon**
- GitHub: [@valter-tonon](https://github.com/valter-tonon)

---

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 📚 Links úteis

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCP SDK TypeScript](https://github.com/modelcontextprotocol/typescript-sdk)
- [Cursor IDE](https://cursor.com/)
- [Claude Desktop](https://claude.ai/) 