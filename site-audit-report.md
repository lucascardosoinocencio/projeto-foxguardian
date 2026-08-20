# Relatório de Auditoria do Site

URL testada: http://localhost:5510

Gerado em: 2026-08-19T03:04:09.419Z

## Resumo de notas (0-100)

| Categoria | Mobile | Desktop |
|---|---|---|
| Performance | 91 | 96 |
| Acessibilidade | 90 | 94 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |

## Principais problemas — Mobile

- **Elements with an ARIA `[role]` that require children to contain a specific `[role]` are missing some or all of those required children.** — Some ARIA parent roles must contain specific child roles to perform their intended accessibility functions.
- **Links do not have a discernible name** — Link text (and alternate text for images, when used as links) that is discernible, unique, and focusable improves the navigation experience for screen reader users.
- **Forced reflow** — A forced reflow occurs when JavaScript queries geometric properties (such as offsetWidth) after styles have been invalidated by a change to the DOM state.
- **LCP request discovery** — [Optimize LCP](https://developer.chrome.com/docs/performance/insights/lcp-discovery) by making the LCP image discoverable from the HTML immediately, and avoiding lazy-loading.
- **Network dependency tree** — [Avoid chaining critical requests](https://developer.chrome.com/docs/performance/insights/network-dependency-tree) by reducing the length of chains, reducing the download size of resources, or deferring the download of unnecessary resources to improve page load..
- **Render-blocking requests** — Requests are blocking the page's initial render, which may delay LCP.

## Principais problemas — Desktop

- **Avoid large layout shifts** — These are the largest layout shifts observed on the page.
- **Elements with an ARIA `[role]` that require children to contain a specific `[role]` are missing some or all of those required children.** — Some ARIA parent roles must contain specific child roles to perform their intended accessibility functions.
- **Elements with visible text labels do not have matching accessible names.** — Visible text labels that do not match the accessible name can result in a confusing experience for screen reader users.
- **Layout shift culprits** — Layout shifts occur when elements move absent any user interaction.
- **LCP request discovery** — [Optimize LCP](https://developer.chrome.com/docs/performance/insights/lcp-discovery) by making the LCP image discoverable from the HTML immediately, and avoiding lazy-loading.
- **Network dependency tree** — [Avoid chaining critical requests](https://developer.chrome.com/docs/performance/insights/network-dependency-tree) by reducing the length of chains, reducing the download size of resources, or deferring the download of unnecessary resources to improve page load..

## Checklist manual de responsividade

O Lighthouse audita performance/SEO/acessibilidade, mas não substitui olhar a página de verdade. Abra o site nesses larguras (redimensionando a janela ou pelo DevTools do navegador) e confira menu, imagens, texto cortado e botões clicáveis:

- [ ] 320px
- [ ] 375px
- [ ] 460px (breakpoint definido no CSS)
- [ ] 560px (breakpoint definido no CSS)
- [ ] 760px (breakpoint definido no CSS)
- [ ] 768px
- [ ] 900px (breakpoint definido no CSS)
- [ ] 901px (breakpoint definido no CSS)
- [ ] 980px (breakpoint definido no CSS)
- [ ] 981px (breakpoint definido no CSS)
- [ ] 1024px
- [ ] 1080px (breakpoint definido no CSS)
- [ ] 1280px
- [ ] 1440px
