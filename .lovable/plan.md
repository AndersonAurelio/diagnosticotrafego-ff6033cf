
# Termômetro do Rastreamento

Web app mobile-first de 4 perguntas + captura de lead + resultado personalizado, com POST silencioso para um webhook n8n. Sem backend próprio, sem banco, sem login.

## Escopo

- Rota única `/` (substitui o placeholder atual em `src/routes/index.tsx`).
- Fluxo em máquina de estados client-side: `hero → q1 → q2 → q3 → q4 → captura → resultado`.
- POST para `https://n8n.andersonaurelio.com.br/webhook/84b03a29-d6d7-42b7-ae02-bea95a668a9a` no clique de "Ver meu resultado" (fire-and-forget, erro silencioso).
- Sem persistência, sem cookies, sem auth, sem Lovable Cloud.

## Identidade visual

Tokens em `src/styles.css` (oklch, mapeados em `@theme inline`):

- `--background`: quase preto `#0E0E11`
- `--foreground`: `#F5F5F7`
- `--muted-foreground`: `#9698A0`
- `--primary` (amarelo destaque): `#F5C518`, `--primary-foreground` preto
- `--accent` verde WhatsApp: `#25D366`
- Radius base 18px (cards 16–20px, botões grandes).
- Brilho amarelo no canto inferior via pseudo-elemento fixo com `radial-gradient` de baixa opacidade em `body`.

Fontes carregadas via `<link>` no `head()` do `__root.tsx` (Google Fonts: Anton + Montserrat). Tokens `--font-display: "Anton"` e `--font-sans: "Montserrat"` em `@theme`. Títulos usam `font-display uppercase tracking-tight`.

Barra de progresso amarela fixa no topo durante Q1–Q4 (largura proporcional ao passo).

## Perguntas e pontuação

Estado global (em `useState` no componente da página):

```
{
  perfil: "negocio" | "agencia" | "iniciante",
  rastreio: "3" | "2" | "1" | "0",   // string do label
  rastreioPts: number,
  pixel: "3" | "2" | "1" | "0",
  pixelPts: number,
  investimento: string,
  nome: string,
  whatsapp: string,
}
```

Perguntas exatamente como no brief (P1 perfil, P2 rastreio 0–3 pts, P3 pixel 0–3 pts, P4 investimento). Cada opção é um card clicável grande; clique registra resposta e avança automaticamente.

## Cálculo do nível

`pontuacao = rastreioPts + pixelPts` (0–6):

- 0–2 → Nível 1 "No escuro"
- 3–4 → Nível 2 "Meio-termo"
- 5–6 → Nível 3 "Rastreado"

Linha extra personalizada:
- `perfil === "agencia"` → "Isso vale pra você e pra cada cliente que você gerencia."
- `perfil === "negocio"` → "Enquanto isso, seu concorrente que mede sai na frente."
- `perfil === "iniciante"` → sem linha extra (ou frase neutra de convite).

## Tela de captura

- Input `nome` (obrigatório, não vazio após trim).
- Input `whatsapp` com máscara BR `(99) 99999-9999` (aceita 10–11 dígitos após limpar não-numéricos). Validação simples inline.
- Botão amarelo grande "Ver meu resultado" (disabled enquanto inválido).

## Envio para o webhook

No submit da captura, antes de trocar para a tela de resultado:

```ts
const payload = {
  nome, whatsapp,
  perfil, rastreio, pixel, investimento,
  nivel,            // "Nível 1: No escuro" etc.
  pontuacao,        // number
  utm_source, utm_medium, utm_campaign, utm_content,  // de window.location.search
  origem_url: window.location.href,
  timestamp: new Date().toISOString(),
};
fetch(WEBHOOK_URL, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
  keepalive: true,
}).catch(() => {}); // silencioso
setStep("resultado"); // segue sem esperar
```

UTMs lidos via `new URLSearchParams(window.location.search)` dentro de `useEffect` (browser-only) na montagem e guardados em ref, para funcionar com SSR do TanStack Start.

## Tela de resultado

- Bloco hero: número do nível gigante + nome em amarelo.
- Parágrafo do insight do nível.
- Linha extra por perfil (quando aplicável).
- Botão verde WhatsApp "Falar com o Anderson agora":
  - `href = ` "https://wa.me/5563992162796?text=" + `encodeURIComponent(` "Oi Anderson, fiz o diagnóstico e deu " + nomeDoNivel + ". Quero entender como rastrear meus leads." `)`
  - ⚠️ Placeholder no brief: `COLE_AQUI_SEU_NUMERO_WHATS`. O corpo do brief já contém `5563992162796` no link — vou usar esse número. Se o usuário quiser outro, ele troca depois.
- Bloco secundário "material / isca": card com título "Seu material" e um botão/link — como o brief traz `[MATERIAL / ISCA]` como placeholder, vou renderizar um card com texto "Baixe o material" e um `href="#"` marcado como TODO/placeholder visível no código para o usuário trocar.

## Estrutura de arquivos

- `src/routes/index.tsx` — rota `/` com `head()` próprio (título "Termômetro do Rastreamento", description, og:title, og:description, og:type, twitter:card). Remove o placeholder atual. Renderiza `<Diagnostico />`.
- `src/routes/__root.tsx` — adicionar `<link>` de preconnect + Google Fonts (Anton + Montserrat) em `head().links`.
- `src/styles.css` — atualizar tokens de cor (dark), adicionar `--font-display`/`--font-sans` em `@theme`, adicionar utility/pseudo para o brilho amarelo.
- `src/components/diagnostico/Diagnostico.tsx` — componente principal com máquina de estados (`step`), progresso, e as sub-telas.
- `src/components/diagnostico/steps.tsx` — sub-componentes: `Hero`, `Question`, `Captura`, `Resultado`, `ProgressBar`.
- `src/components/diagnostico/data.ts` — constantes: perguntas, opções, textos de nível, WEBHOOK_URL, WHATSAPP_URL_BASE.
- `src/lib/whatsapp-mask.ts` — helpers `formatBRPhone` e `isValidBRPhone`.

Nenhum server function, nenhuma dependência nova além do que já vem no template.

## Detalhes técnicos

- SSR safe: qualquer leitura de `window` (UTMs, `location.href`) fica em `useEffect` ou em handlers de clique. Estado inicial usa valores vazios.
- Transições suaves entre passos com `transition-opacity` + `key={step}` num wrapper (fade curto). Sem libs de animação adicionais.
- `keepalive: true` no `fetch` garante o POST mesmo se o usuário navegar rápido.
- Sem `dangerouslySetInnerHTML`, sem coleta de dados além de nome/WhatsApp. Sem console.log de dados do formulário.
- Meta OG/Twitter na rota `/` sem `og:image` (o hosting fornece screenshot).

## Placeholders a confirmar

- ⚠️ Número WhatsApp: brief diz "substituir `COLE_AQUI_SEU_NUMERO_WHATS`", mas também traz `wa.me/5563992162796` no exemplo. Vou usar `5563992162796`.
- ⚠️ `[MATERIAL / ISCA]`: sem URL fornecida — vou renderizar um card com um botão placeholder claramente marcado para o usuário editar depois.

Se preferir valores diferentes para qualquer um dos dois, me diga antes de eu implementar e eu ajusto.
