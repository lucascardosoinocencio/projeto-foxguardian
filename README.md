# Fox Guardian · Landing Page

Landing page institucional para a **Fox Guardian Segurança Eletrônica** (Bauru/SP), focada em conversão via WhatsApp. Site 100% estático, sem framework, construído com foco em performance, identidade visual autoral e responsividade real (mobile, tablet e desktop).

## Demonstração

Abra `index.html` diretamente no navegador. Não depende de build nem servidor para funcionar.

## Tecnologias

- **HTML5 + CSS3 + JavaScript vanilla**: sem framework de frontend, todo o site é código puro, sem dependências de runtime no navegador.
- **Design system próprio**, derivado da identidade visual do cliente (paleta grafite/carvão e cobre queimado), com tipografia combinando uma display condensada, uma sans neutra e uma monoespaçada para rótulos técnicos.
- **Metáfora estrutural de central de alarme**: os serviços são apresentados como "zonas" de um painel real, o radar de cobertura ecoa alcance de sinal, e os cards de produto usam moldura estilo overlay de câmera (rótulo `CAM 0X`).
- **Google Maps Embed** sem chave de API, geocodificando o endereço direto por query string.
- **IntersectionObserver** para animações de entrada em scroll (reveal, radar, timeline), com fallback e respeito a `prefers-reduced-motion`.

### Pipeline de imagens (`tools/`)

- **[sharp](https://sharp.pixelplumbing.com/)** (Node.js): geração de múltiplos tamanhos de WebP otimizados para cada breakpoint.
- **[Pillow](https://python-pillow.org/)** (Python): remoção de fundo de logos e fotos de produto via *flood fill* a partir das bordas da imagem, preservando reflexos e detalhes internos claros, diferente de um corte por limiar de cor simples.
- **[Playwright](https://playwright.dev/)**: testes visuais automatizados, com capturas de tela em 390px (mobile), 768px (tablet) e 1440px (desktop), em múltiplos pontos de rolagem, usadas para validar responsividade antes de cada entrega.

### Qualidade

Auditoria Lighthouse (ver `site-audit-report.md`): Performance 91 a 96, Acessibilidade 90 a 94, Boas Práticas 100, SEO 100.

## Estrutura do projeto

```
├── index.html              # marcação semântica de toda a página
├── css/
│   └── styles.css          # design system (tokens, componentes, responsividade)
├── js/
│   └── main.js              # interações: menu, filtros, accordion, animações de scroll
├── images/                 # imagens otimizadas (WebP), prontas para produção
├── tools/                  # scripts de otimização de imagem e testes visuais
│   ├── optimize.js          # pipeline sharp
│   ├── process-brand-logos.py     # remoção de fundo (logos de marcas)
│   ├── remove-product-backgrounds.py  # remoção de fundo (fotos de produto)
│   ├── screenshot.js        # varredura responsiva (Playwright)
│   └── screenshot-sections.js
└── site-audit-report.md    # relatório de auditoria Lighthouse
```

## Como rodar localmente

O site não precisa de build. Para rodar os scripts de apoio (opcional):

```bash
# pipeline de imagens
cd tools
npm install
node optimize.js

# testes visuais responsivos
node screenshot.js
```

## Seções da página

1. **Hero**: proposta de valor e imagem real da central de monitoramento
2. **Marcas parceiras**: Intelbras e PPA, fundo removido, direto sobre o card escuro
3. **Sobre**: foto real da fachada da loja
4. **Serviços**: apresentados como zonas de um painel de alarme
5. **Protocolo de resposta**: o que acontece quando o alarme dispara, em 4 etapas
6. **Catálogo**: produtos filtráveis por categoria, com fotos reais
7. **Área de atendimento**: radar interativo com as cidades cobertas
8. **Rodapé**: endereço, mapa incorporado e redes sociais
