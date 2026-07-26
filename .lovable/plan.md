
# Redesign "Tech Minimalista" — Termômetro do Rastreamento

Manter toda a lógica, fluxo (hero → 4 perguntas → captura → resultado), copy, webhook e cálculo de score. Mudança **apenas visual/presentacional**.

## Direção de design

- **Paleta Midnight Indigo**: fundo `#0a0a1a`, superfícies `#141432`, borda `#1e1e5a`, acento primário `#4f46e5` (indigo elétrico). Manter o verde WhatsApp `#25D366` só no botão de CTA final. O amarelo `#F5C518` sai da UI base.
- **Tipografia**: Sora (display/headings) + Manrope (body) + JetBrains Mono para labels curtas ("STEP 01/04", "SCORE", pontuação). Anton/Montserrat saem.
- **Vibe**: dashboard-lite / blueprint. Minimalista, muito respiro, sem gradientes chapados nem ilustrações.

## Elementos tech (aplicados globalmente)

1. **Grid blueprint de fundo** — pattern SVG de linhas finas em `rgba(79,70,229,0.06)` fixo em `body`, com máscara radial para desaparecer nas bordas.
2. **HUD superior** — barra fixa no topo com:
   - Esquerda: dot pulsante indigo + "TERMÔMETRO / v1.0" em mono.
   - Centro: barra de progresso mais fina (2px) com trilha `border/40` e preenchimento com glow indigo.
   - Direita: `STEP 01 / 04` em JetBrains Mono uppercase.
3. **Glow/halo no acento** — botões primários e progresso ganham `box-shadow: 0 0 40px -8px rgba(79,70,229,0.6)`; hover intensifica.
4. **Detalhes mono** — todos os "kickers" (eyebrows) migram para JetBrains Mono uppercase `tracking-[0.25em]` com bracket ASCII, ex: `[ 01 ] PERFIL`.

## Ajustes por tela

**Hero**
- Kicker mono: `[ MINI-DIAGNÓSTICO // 40s ]`
- H1 Sora extrabold, `text-4xl sm:text-5xl`, tracking apertado, sem uppercase (Sora funciona melhor em sentence case). Palavra-chave "perde por não rastrear" ganha `text-primary` + underline SVG sutil.
- Sub em Manrope `text-muted`.
- CTA: pill rounded-full, indigo com glow, ícone `→` mono à direita.
- Rodapé: linha mono `4 PERGUNTAS · SEM CADASTRO PRA COMEÇAR`.

**Perguntas (q1–q4)**
- Kicker mono com bracket: `[ 0X / 04 ] PERFIL | RASTREIO | PIXEL | INVESTIMENTO`.
- Título Sora `text-3xl sm:text-4xl` sentence case.
- Opções: cards `rounded-xl` com `border border-white/8`, fundo `bg-white/[0.03]`, um índice mono à esquerda (`01`, `02`…) e chevron `→` à direita. Hover: borda indigo + leve glow interno + índice muda para primary. Sem uppercase forçado no texto da opção.
- Divisor superior sutil (linha 1px) entre kicker e título para reforçar HUD.

**Captura**
- Kicker `[ 05 ] CONTATO`.
- Título Sora sentence case.
- Inputs: `rounded-xl`, borda `white/10`, foco = borda indigo + ring `indigo/30` (glow suave). Labels em mono uppercase pequeno.
- Botão indigo pill com glow.

**Resultado**
- Kicker mono `[ RESULT ] { NOME }`.
- "Score card" HUD: bloco com borda indigo sutil mostrando `LEVEL 0X / NÍVEL` grande em Sora, e à direita `SCORE 0X/06` em mono grande. Barra de progresso segmentada em 6 quadradinhos (preenchidos até `pontuacao`).
- Insight Manrope, tamanho maior.
- Linha por perfil: bloco com borda esquerda indigo (mantém padrão).
- **OfertaCard** ganha visual tech:
  - `rounded-2xl`, borda `indigo/40`, fundo `#141432`, canto superior com etiqueta mono `[ PLANO // START | GESTÃO | AGÊNCIA ]`.
  - Título em Sora (não uppercase forçado).
  - Checks mudam de amarelo para indigo com glow.
  - Preço: número grande Sora + sufixo mono. "De/Por" com strike + preço destaque.
  - CTA WhatsApp continua verde `#25D366` (é o único ponto verde da UI — pra reforçar "ação final"), com ícone WhatsApp + glow verde sutil no hover.

## Arquivos a alterar

1. `src/styles.css`
   - Trocar tokens `--background`, `--card`, `--primary`, `--ring`, `--border` para os OKLCH da Midnight Indigo.
   - Trocar `--font-display` para `"Sora"`, `--font-sans` para `"Manrope"`, adicionar `--font-mono: "JetBrains Mono"`.
   - Adicionar tokens `--shadow-glow`, `--gradient-hud`.
   - Adicionar `@utility` para `.tech-grid` (background SVG) e `.glow-primary`.

2. `src/routes/__root.tsx`
   - Substituir `<link>` das fontes Anton/Montserrat pelos Google Fonts de Sora, Manrope e JetBrains Mono.

3. `src/components/diagnostico/Diagnostico.tsx`
   - Adicionar componente `<HUD />` fixo no topo (status + progresso + step counter).
   - Reescrever markup do Hero, Question, form de captura, tela de resultado e OfertaCard usando as novas classes/tokens. Nenhuma mudança em estado, handlers, tipos ou payload do webhook.
   - Substituir uso de `font-display` uppercase por Sora sentence case; introduzir classe `font-mono` para labels/kickers.
   - Trocar `bg-primary` amarelo por indigo + `.glow-primary` no CTA; manter `bg-accent` verde apenas no botão do WhatsApp na OfertaCard.
   - Remover o brilho amarelo radial de fundo, substituir por `.tech-grid` + halo indigo inferior.

4. (Nenhuma mudança em `data.ts`, `whatsapp-mask.ts`, rotas, webhook, SEO copy.)

## Fora de escopo

- Nada de animações scroll-based, three.js, ou libs novas.
- Sem alterar textos, ofertas, preços, mensagens WhatsApp, cálculo de score, perguntas por perfil.
- Sem tocar em `data.ts`.

## Detalhes técnicos

- Grid de fundo via `background-image: linear-gradient(to right, rgba(79,70,229,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(79,70,229,0.06) 1px, transparent 1px); background-size: 48px 48px;` + `mask-image: radial-gradient(ellipse at center, black 40%, transparent 85%)`.
- Glow reutilizável: `box-shadow: 0 0 0 1px rgba(79,70,229,0.3), 0 10px 40px -10px rgba(79,70,229,0.6)`.
- Barra de progresso do HUD: trilha `bg-white/5` 2px + fill `bg-primary` com `shadow-[0_0_12px_rgba(79,70,229,0.8)]`.
- Segmented score bar no resultado: 6 divs `h-2 w-full rounded-sm`, preenchidos até `pontuacao`, os vazios com `bg-white/5`, os cheios `bg-primary` + glow.
- Fontes carregadas via `<link>` no root (Lightning CSS não aceita `@import` remoto).
