# link-checker-mcp

## 🚀 O que é?

O **link-checker-mcp** é uma ferramenta CLI (Command Line Interface) desenvolvida em Node.js para identificar rapidamente links problemáticos (relativos sem barra inicial) em páginas HTML. Esses links podem causar erros de navegação (404) em sites, especialmente quando usados em menus ou listas de categorias.

- **Detecta links do tipo:** `href="baterias/c/233"` (e similares)
- **Evita problemas de navegação inesperada** em sites dinâmicos ou com múltiplos níveis de URL
- **Ideal para times de desenvolvimento, QA e manutenção de e-commerces**

---

## 🛠️ Como funciona?

O script faz uma requisição HTTP para a URL informada, captura o HTML bruto (igual ao Ctrl+U do navegador) e busca por todos os atributos `href` que:
- **Não começam com:** `/`, `http`, `https`, `#`, `mailto:`, `tel:`, `javascript:`
- **Não estão vazios**

O resultado é um relatório simples no terminal, listando todos os links problemáticos encontrados.

---

## 💻 Como usar

### 1. Via npx (sem instalar nada localmente)

```sh
npx github:valter-tonon/link-checker-mcp https://www.seusite.com.br/
```

- Substitua a URL pelo endereço que deseja analisar.
- O resultado será exibido no terminal.

### 2. Como dependência local (opcional)

```sh
git clone https://github.com/valter-tonon/link-checker-mcp.git
cd link-checker-mcp
npm install
node index.js https://www.seusite.com.br/
```

### 3. Integração com Cursor (MCP)

Adicione ao seu `.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "link-checker": {
      "command": "npx",
      "args": [
        "github:valter-tonon/link-checker-mcp",
        "${input:url}"
      ]
    }
  }
}
```

- No Cursor, use o comando MCP: `link-checker` e informe a URL.

---

## 📋 Exemplo de saída

```
Links problemáticos encontrados:
baterias/c/233
acessorios/c/146
...
```

Se não houver links problemáticos:
```
Nenhum link problemático encontrado!
```

---

## 📝 Detalhes técnicos
- Node.js puro, sem dependências externas
- Pode ser executado em qualquer ambiente com Node.js >= 12
- Código aberto e fácil de adaptar para outros padrões de links

---

## 🧑‍💻 Autor
Valter Tonon

---

## 📄 Licença
MIT 