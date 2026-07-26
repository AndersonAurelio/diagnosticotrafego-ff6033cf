## Objetivo

Fazer as perguntas 2 (rastreio), 3 (pixel) e 4 (investimento) mudarem de texto conforme o perfil escolhido na pergunta 1, mantendo a mesma lógica de pontuação e o mesmo score final (0-6).

## Perguntas por perfil

**Iniciante** (ainda não invisto)
- P2 Rastreio → "Se você começasse a anunciar amanhã, como saberia quantos leads o anúncio gerou?"
  - Teria um sistema pronto pra contar cada lead (3)
  - Olharia o gerenciador de anúncios (2)
  - Perguntaria pra alguém do comercial (1)
  - Não sei como faria (0)
- P3 Pixel → "Você sabe o que é 'devolver conversões pro pixel/algoritmo'?"
  - Sim, sei o que é e como funciona (3)
  - Já ouvi falar, mas não sei aplicar (2)
  - Não, nunca ouvi (1)
  - Não faço ideia do que é isso (0)
- P4 Intenção (substitui investimento) → "Quando você pretende começar a investir em tráfego?"
  - Já estou pronto pra começar agora
  - Nos próximos 30 dias
  - Nos próximos 3 meses
  - Ainda estou só estudando
  - (sem pontuação, só qualificação)

**Negócio** (mantém as atuais, sem mudança de texto)
- P2, P3, P4 permanecem exatamente como estão hoje.

**Agência** (perguntas por cliente)
- P2 Rastreio → "Se um cliente seu te perguntar agora quantos leads a campanha dele gerou ontem, você…"
  - Sei o número exato de cada cliente, na hora (3)
  - Tenho uma ideia, mas não confio 100% (2)
  - Preciso pedir pro time ou olhar o gerenciador (1)
  - Não faço ideia (0)
- P3 Pixel → "Quando um lead vira cliente na operação dos seus clientes, essa conversão volta pro pixel da conta deles?"
  - Sim, automaticamente em todas as contas (3)
  - Em algumas contas, no manual (2)
  - Não volta em nenhuma (1)
  - Não sei o que é isso (0)
- P4 Investimento → "Em média, quanto cada cliente seu investe em tráfego por mês?"
  - Até R$ 3 mil por cliente
  - Entre R$ 3 mil e R$ 10 mil por cliente
  - Acima de R$ 10 mil por cliente
  - Varia muito entre clientes

## Implementação

Em `src/components/diagnostico/data.ts`:
- Substituir `PERGUNTA_RASTREIO`, `PERGUNTA_PIXEL`, `PERGUNTA_INVESTIMENTO` por mapas indexados por `PerfilKey`:
  - `PERGUNTAS_RASTREIO: Record<PerfilKey, {...}>`
  - `PERGUNTAS_PIXEL: Record<PerfilKey, {...}>`
  - `PERGUNTAS_INVESTIMENTO: Record<PerfilKey, {...}>` (para iniciante, vira pergunta de intenção sem `pts`)
- Manter a mesma `key` (`rastreio`, `pixel`, `investimento`) em cada variante pra o payload do webhook continuar consistente.

Em `src/components/diagnostico/Diagnostico.tsx`:
- Nas telas q2/q3/q4, ler a pergunta a partir do perfil já selecionado (`answers.perfil`) e renderizar a variante correspondente.
- Para iniciante, a pergunta 4 (intenção) não soma pontos; o cálculo do score continua usando só P2+P3 (mantém range 0-6).
- Nenhuma mudança nas ofertas, no bloco de resultado, no webhook ou no captura de lead.

## Fora de escopo

- Não mexe em textos das ofertas, resultado, hero, captura, nem no cálculo dos níveis.
