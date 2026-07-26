## Ajustes no OfertaCard

**1. Dois pontos após o título de cada serviço**

Em `src/components/diagnostico/Diagnostico.tsx`, no render de `item.titulo`, adicionar `:` ao final do título em negrito, antes da descrição.

Exemplo de resultado:
- **Rastreamento de leads:** Você passa a saber com precisão…
- **Assessoria de Marketing, Comercial, Copy e Criativos:** Direcionamento das 4 frentes…

Aplicado para os 3 perfis (Start, Gestão Completa, Parceria Agências).

**2. Selo de urgência abaixo do preço**

Logo abaixo do bloco de preço e acima do botão do WhatsApp, adicionar dois elementos:

- `Oferta de lançamento` — em fonte mono, cor primária (indigo), com brackets no estilo tech: `[ OFERTA DE LANÇAMENTO ]`
- `Vagas limitadas` — em fonte mono, com um dot pulsante ao lado (mesmo padrão do HUD), sugerindo escassez.

Layout: centralizado, pequeno espaçamento entre os dois, mantendo a pegada minimalista tech já estabelecida (sem fundos chamativos, apenas tipografia e o dot pulsante).

Aparece nos 3 planos.

## Detalhes técnicos

- Arquivo único: `src/components/diagnostico/Diagnostico.tsx` (componente `OfertaCard`).
- Sem mudanças em `data.ts` — os dois pontos são adicionados no JSX, não no conteúdo.
- Sem mudanças em tokens/CSS — reutiliza `text-primary`, fonte mono e a animação de pulse já usada no HUD.