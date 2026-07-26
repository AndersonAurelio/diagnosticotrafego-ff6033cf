export const WEBHOOK_URL =
  "https://n8n.andersonaurelio.com.br/webhook/84b03a29-d6d7-42b7-ae02-bea95a668a9a";

export const WHATSAPP_NUMBER = "5563992162796";

export type Oferta = {
  titulo: string;
  subtitulo: string;
  itens: Array<{ titulo: string; descricao?: string }>;
  precoDe?: string;
  preco: string;
  precoSufixo?: string;
  precoSufixoInline?: string;
  whatsMsg: string;
};

export type PerfilKey = "negocio" | "agencia" | "iniciante";

export const PERGUNTA_PERFIL = {
  key: "perfil" as const,
  title: "O que descreve melhor você hoje?",
  options: [
    { label: "Tenho um negócio e já invisto em tráfego", value: "negocio" as PerfilKey },
    { label: "Sou gestor ou dono de agência", value: "agencia" as PerfilKey },
    { label: "Ainda não invisto em tráfego", value: "iniciante" as PerfilKey },
  ],
};

type ScoredOption = { label: string; value: string; pts: number };

export const PERGUNTA_RASTREIO = {
  key: "rastreio" as const,
  title:
    "Se eu te perguntar quantos leads seu anúncio gerou ontem, você…",
  options: [
    { label: "Sei o número exato, na hora", value: "exato", pts: 3 },
    { label: "Tenho uma ideia, mas não confio 100%", value: "ideia", pts: 2 },
    { label: "Dependo do gerenciador ou do comercial pra saber", value: "dependo", pts: 1 },
    { label: "Não faço ideia", value: "nenhuma", pts: 0 },
  ] as ScoredOption[],
};

export const PERGUNTA_PIXEL = {
  key: "pixel" as const,
  title:
    "Quando um lead vira cliente, essa informação volta pra sua conta de anúncios?",
  options: [
    { label: "Sim, automaticamente", value: "auto", pts: 3 },
    { label: "Só às vezes, no manual", value: "manual", pts: 2 },
    { label: "Não volta", value: "nao", pts: 1 },
    { label: "Não sei o que é isso", value: "nao_sei", pts: 0 },
  ] as ScoredOption[],
};

export const PERGUNTA_INVESTIMENTO = {
  key: "investimento" as const,
  title: "Quanto você investe em tráfego por mês, mais ou menos?",
  options: [
    { label: "Ainda não invisto", value: "nada" },
    { label: "Até R$ 3 mil", value: "ate_3k" },
    { label: "Entre R$ 3 mil e R$ 10 mil", value: "3k_10k" },
    { label: "Acima de R$ 10 mil", value: "acima_10k" },
  ],
};

export type NivelInfo = {
  numero: 1 | 2 | 3;
  nome: string;
  fullName: string;
  insight: string;
};

export function calcularNivel(pontuacao: number): NivelInfo {
  if (pontuacao <= 2) {
    return {
      numero: 1,
      nome: "No escuro",
      fullName: "Nível 1: No escuro",
      insight:
        "Você decide o investimento baseado em número que talvez nem seja real. Cada real escalado é uma aposta.",
    };
  }
  if (pontuacao <= 4) {
    return {
      numero: 2,
      nome: "Meio-termo",
      fullName: "Nível 2: Meio-termo",
      insight:
        "Você mede parte, mas ainda depende de gente e de achismo em decisões importantes.",
    };
  }
  return {
    numero: 3,
    nome: "Rastreado",
    fullName: "Nível 3: Rastreado",
    insight:
      "Você já mede bem. O próximo salto é deixar a conta mais inteligente devolvendo suas conversões pro algoritmo.",
  };
}

export function linhaPorPerfil(perfil: PerfilKey | ""): string {
  if (perfil === "agencia")
    return "Isso vale pra você e pra cada cliente que você gerencia.";
  if (perfil === "negocio")
    return "Enquanto isso, seu concorrente que mede sai na frente.";
  if (perfil === "iniciante")
    return "Comece medindo desde o primeiro real investido. Quem mede escala com segurança.";
  return "";
}

export const OFERTAS: Record<PerfilKey, Oferta> = {
  iniciante: {
    titulo: "Plano Start",
    subtitulo:
      "Pra você que ainda não investe em tráfego e quer começar do jeito certo.",
    itens: [
      "Criação de uma campanha de tráfego pronta pra atrair seus primeiros clientes",
      "Uma aula de 1 hora ensinando a otimizar a campanha",
      "Acompanhamento durante 15 dias",
    ],
    preco: "R$ 397",
    precoSufixo: "valor único",
    whatsMsg:
      "Oi Anderson, fiz o diagnóstico e quero começar com o Plano Start de R$ 397.",
  },
  negocio: {
    titulo: "Gestão Completa",
    subtitulo: "Pra quem já investe e quer parar de decidir no escuro.",
    itens: [
      "Assessoria de Marketing, Comercial, Copy e Criativos. Direcionamento das 4 frentes que definem o resultado: posicionamento, abordagem de vendas, mensagem e peças que convertem.",
      "Criação e otimização do tráfego pago. Campanhas construídas e ajustadas de forma contínua pra baixar o custo por lead e escalar o que dá certo.",
      "Rastreamento de leads. Você passa a saber com precisão quantos leads entraram, sem depender do gerenciador nem do comercial.",
      "Nutrição do pixel. Devolvo pra sua conta quem virou cliente, deixando o algoritmo mais inteligente e o lead mais barato.",
      "Pipeline automático. Os leads entram organizados e distribuídos sozinhos, sem nenhum lead perdido no caminho.",
    ],
    precoDe: "R$ 2.459",
    preco: "R$ 1.229",
    whatsMsg:
      "Oi Anderson, fiz o diagnóstico e quero a Gestão Completa por R$ 1.229.",
  },
  agencia: {
    titulo: "Parceria para Agências",
    subtitulo:
      "Terceirize a parte técnica que dá trabalho e entregue mais resultado pros seus clientes.",
    itens: [
      "Rastreamento de leads. Cada cliente da sua agência com contagem precisa de leads, sem achismo.",
      "Nutrição do pixel. Conversões devolvidas pro algoritmo, deixando as contas dos seus clientes mais inteligentes.",
      "Pipeline automático. Leads organizados e distribuídos automaticamente em cada operação.",
    ],
    preco: "R$ 149,90",
    precoSufixo: "/mês por cliente",
    whatsMsg:
      "Oi Anderson, tenho uma agência e quero implementar a parceria de R$ 149,90/mês por cliente.",
  },
};
