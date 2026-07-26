# Substituir bônus por bloco de OFERTA na tela de resultado

Na tela `resultado`, remover o card de "Bônus / material" e mostrar, logo abaixo do insight (e da linha por perfil), UM card de oferta que muda conforme a resposta da Pergunta 1 (`answers.perfil`).

## Conteúdo dos 3 cards

**iniciante → Plano Start**
- Subtítulo: "Pra você que ainda não investe em tráfego e quer começar do jeito certo."
- Itens:
  - Criação de uma campanha de tráfego pronta pra atrair seus primeiros clientes
  - Uma aula de 1 hora ensinando a otimizar a campanha
  - Acompanhamento durante 15 dias
- Preço: R$ 397 (valor único)
- WhatsApp: "Oi Anderson, fiz o diagnóstico e quero começar com o Plano Start de R$ 397."

**negocio → Gestão Completa**
- Subtítulo: "Pra quem já investe e quer parar de decidir no escuro."
- Itens (título em negrito + descrição curta):
  - Assessoria de Marketing, Comercial, Copy e Criativos. Direcionamento das 4 frentes que definem o resultado: posicionamento, abordagem de vendas, mensagem e peças que convertem.
  - Criação e otimização do tráfego pago. Campanhas construídas e ajustadas de forma contínua pra baixar o custo por lead e escalar o que dá certo.
  - Rastreamento de leads. Você passa a saber com precisão quantos leads entraram, sem depender do gerenciador nem do comercial.
  - Nutrição do pixel. Devolvo pra sua conta quem virou cliente, deixando o algoritmo mais inteligente e o lead mais barato.
  - Pipeline automático. Os leads entram organizados e distribuídos sozinhos, sem nenhum lead perdido no caminho.
- Preço: De ~R$ 2.459~ por **R$ 1.229** (destaque De/Por)
- WhatsApp: "Oi Anderson, fiz o diagnóstico e quero a Gestão Completa por R$ 1.229."

**agencia → Parceria para Agências**
- Subtítulo: "Terceirize a parte técnica que dá trabalho e entregue mais resultado pros seus clientes."
- Itens:
  - Rastreamento de leads. Cada cliente da sua agência com contagem precisa de leads, sem achismo.
  - Nutrição do pixel. Conversões devolvidas pro algoritmo, deixando as contas dos seus clientes mais inteligentes.
  - Pipeline automático. Leads organizados e distribuídos automaticamente em cada operação.
- Preço: R$ 149,90/mês por cliente
- WhatsApp: "Oi Anderson, tenho uma agência e quero implementar a parceria de R$ 149,90/mês por cliente."

## Detalhes técnicos

- **`src/components/diagnostico/data.ts`**
  - Adicionar `OFERTAS: Record<PerfilKey, Oferta>` com `titulo`, `subtitulo`, `itens: string[]`, `precoDe?: string`, `preco: string`, `precoSufixo?: string` (ex.: "valor único", "/mês por cliente"), `whatsMsg: string`.
  - Remover as constantes `MATERIAL_URL/LABEL/TITLE/DESC` (não usadas mais).
- **`src/components/diagnostico/Diagnostico.tsx`**
  - Remover imports e o card de "Bônus" na etapa `resultado`.
  - Se `answers.perfil` estiver definido, renderizar `<OfertaCard oferta={OFERTAS[answers.perfil]} nome={nome} />` logo após a linha por perfil.
  - `OfertaCard`: fundo `bg-white/[0.07]`, borda `border-primary/40`, título grande em `font-display uppercase`, subtítulo em `text-muted-foreground`, lista com ícone check amarelo (SVG inline) por item, bloco de preço com "De R$ X" riscado quando houver `precoDe`, e "Por R$ Y" grande em `text-primary`, seguido de `precoSufixo` quando houver. Botão WhatsApp full-width verde (`bg-accent`) com o ícone atual e a mensagem específica do perfil (mesmo padrão `wa.me/${WHATSAPP_NUMBER}?text=...`).
  - O botão principal "Falar com o Anderson agora" existente pode ser mantido acima do card (CTA genérico) — confirmar abaixo.
- Sem mudanças de rota, webhook ou score.

## Pergunta antes de implementar
Manter o botão verde "Falar com o Anderson agora" que já existe acima, ou remover e deixar só o botão do card de oferta? (Meu default: **remover** o botão genérico e deixar apenas o CTA do card de oferta, que já é específico por perfil.)
