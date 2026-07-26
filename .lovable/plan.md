# Ajuste no card de oferta: preço mensal e títulos em negrito

## Objetivo
Atualizar a exibição dos cards de oferta na tela `resultado` para:
1. Mostrar o preço do plano **Gestão Completa** como "Por R$ 1.229/Mês", com o "/Mês" em destaque menor ao lado do valor.
2. Exibir o **título de cada serviço em negrito** em todos os cards de oferta (Start, Gestão Completa e Parceria para Agências).

## Alterações

### 1. `src/components/diagnostico/data.ts`
- Alterar o tipo `Oferta.itens` de `string[]` para `Array<{ titulo: string; descricao?: string }>`.
- Refatorar todos os itens das ofertas `iniciante`, `negocio` e `agencia` para separar o título (negrito) da descrição.
  - Exemplo para Gestão Completa:
    - Título: "Assessoria de Marketing, Comercial, Copy e Criativos"
    - Descrição: "Direcionamento das 4 frentes que definem o resultado: posicionamento, abordagem de vendas, mensagem e peças que convertem."
- Adicionar campo opcional `precoSufixoInline?: string` ao tipo `Oferta`.
- No plano `negocio`, definir `precoSufixoInline: "/Mês"`.

### 2. `src/components/diagnostico/Diagnostico.tsx`
- No componente `OfertaCard`:
  - Renderizar cada item da lista com o `titulo` em negrito e a `descricao` (quando existir) no mesmo parágrafo, mantendo o ícone de check amarelo.
  - Ajustar o bloco de preço para exibir o `precoSufixoInline` em tamanho menor ao lado do valor principal quando presente.
  - Exemplo: "Por R$ 1.229" (grande) + "/Mês" (menor, mesma cor primária).

## Fora de escopo
- Nenhuma mudança no fluxo de perguntas, cálculo de nível, webhook, captura de leads ou roteamento.
- Nenhuma mudança no botão principal de WhatsApp do card.

## Validação
- Build local (`bun run build`) deve passar sem erros.
- Verificar visualmente no preview que:
  - O card de "Gestão Completa" exibe "Por R$ 1.229/Mês" com "/Mês" menor.
  - Todos os cards exibem o título de cada serviço em negrito.