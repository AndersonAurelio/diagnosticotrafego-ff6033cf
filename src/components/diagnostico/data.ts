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
type PlainOption = { label: string; value: string };

type ScoredPergunta = {
  key: string;
  title: string;
  options: ScoredOption[];
};

type PlainPergunta = {
  key: string;
  title: string;
  options: PlainOption[];
};

export const PERGUNTAS_RASTREIO: Record<PerfilKey, ScoredPergunta> = {
  negocio: {
    key: "rastreio",
    title: "Se eu te perguntar quantos leads seu anúncio gerou ontem, você…",
    options: [
      { label: "Sei o número exato, na hora", value: "exato", pts: 3 },
      { label: "Tenho uma ideia, mas não confio 100%", value: "ideia", pts: 2 },
      { label: "Dependo do gerenciador ou do comercial pra saber", value: "dependo", pts: 1 },
      { label: "Não faço ideia", value: "nenhuma", pts: 0 },
    ],
  },
  agencia: {
    key: "rastreio",
    title:
      "Se um cliente seu te perguntar agora quantos leads a campanha dele gerou ontem, você…",
    options: [
      { label: "Sei o número exato de cada cliente, na hora", value: "exato", pts: 3 },
      { label: "Tenho uma ideia, mas não confio 100%", value: "ideia", pts: 2 },
      { label: "Preciso pedir pro time ou olhar o gerenciador", value: "dependo", pts: 1 },
      { label: "Não faço ideia", value: "nenhuma", pts: 0 },
    ],
  },
  iniciante: {
    key: "rastreio",
    title:
      "Se você começasse a anunciar amanhã, como saberia quantos leads o anúncio gerou?",
    options: [
      { label: "Teria um sistema pronto pra contar cada lead", value: "sistema", pts: 3 },
      { label: "Olharia o gerenciador de anúncios", value: "gerenciador", pts: 2 },
      { label: "Perguntaria pra alguém do comercial", value: "comercial", pts: 1 },
      { label: "Não sei como faria", value: "nao_sei", pts: 0 },
    ],
  },
};

export const PERGUNTAS_PIXEL: Record<PerfilKey, ScoredPergunta> = {
  negocio: {
    key: "pixel",
    title:
      "Quando um lead vira cliente, essa informação volta pra sua conta de anúncios?",
    options: [
      { label: "Sim, automaticamente", value: "auto", pts: 3 },
      { label: "Só às vezes, no manual", value: "manual", pts: 2 },
      { label: "Não volta", value: "nao", pts: 1 },
      { label: "Não sei o que é isso", value: "nao_sei", pts: 0 },
    ],
  },
  agencia: {
    key: "pixel",
    title:
      "Quando um lead vira cliente na operação dos seus clientes, essa conversão volta pro pixel da conta deles?",
    options: [
      { label: "Sim, automaticamente em todas as contas", value: "auto", pts: 3 },
      { label: "Em algumas contas, no manual", value: "manual", pts: 2 },
      { label: "Não volta em nenhuma", value: "nao", pts: 1 },
      { label: "Não sei o que é isso", value: "nao_sei", pts: 0 },
    ],
  },
  iniciante: {
    key: "pixel",
    title: "Você sabe o que é 'devolver conversões pro pixel/algoritmo'?",
    options: [
      { label: "Sim, sei o que é e como funciona", value: "sei", pts: 3 },
      { label: "Já ouvi falar, mas não sei aplicar", value: "ouvi", pts: 2 },
      { label: "Não, nunca ouvi", value: "nao", pts: 1 },
      { label: "Não faço ideia do que é isso", value: "nao_sei", pts: 0 },
    ],
  },
};

export const PERGUNTAS_INVESTIMENTO: Record<PerfilKey, PlainPergunta> = {
  negocio: {
    key: "investimento",
    title: "Quanto você investe em tráfego por mês, mais ou menos?",
    options: [
      { label: "Até R$ 3 mil", value: "ate_3k" },
      { label: "Entre R$ 3 mil e R$ 10 mil", value: "3k_10k" },
      { label: "Acima de R$ 10 mil", value: "acima_10k" },
    ],
  },
  agencia: {
    key: "investimento",
    title: "Em média, quanto cada cliente seu investe em tráfego por mês?",
    options: [
      { label: "Até R$ 3 mil por cliente", value: "ate_3k" },
      { label: "Entre R$ 3 mil e R$ 10 mil por cliente", value: "3k_10k" },
      { label: "Acima de R$ 10 mil por cliente", value: "acima_10k" },
      { label: "Varia muito entre clientes", value: "varia" },
    ],
  },
  iniciante: {
    key: "investimento",
    title: "Quando você pretende começar a investir em tráfego?",
    options: [
      { label: "Já estou pronto pra começar agora", value: "agora" },
      { label: "Nos próximos 30 dias", value: "30d" },
      { label: "Nos próximos 3 meses", value: "3m" },
      { label: "Ainda estou só estudando", value: "estudando" },
    ],
  },
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
      {
        titulo: "Criação de uma campanha de tráfego",
        descricao: "pronta pra atrair seus primeiros clientes.",
      },
      {
        titulo: "Uma aula de 1 hora",
        descricao: "ensinando a otimizar a campanha.",
      },
      {
        titulo: "Acompanhamento durante 15 dias",
      },
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
      {
        titulo: "Assessoria de Marketing, Comercial, Copy e Criativos",
        descricao:
          "Direcionamento das 4 frentes que definem o resultado: posicionamento, abordagem de vendas, mensagem e peças que convertem.",
      },
      {
        titulo: "Criação e otimização do tráfego pago",
        descricao:
          "Campanhas construídas e ajustadas de forma contínua pra baixar o custo por lead e escalar o que dá certo.",
      },
      {
        titulo: "Rastreamento de leads",
        descricao:
          "Você passa a saber com precisão quantos leads entraram, sem depender do gerenciador nem do comercial.",
      },
      {
        titulo: "Nutrição do pixel",
        descricao:
          "Devolvo pra sua conta quem virou cliente, deixando o algoritmo mais inteligente e o lead mais barato.",
      },
      {
        titulo: "Pipeline automático",
        descricao:
          "Os leads entram organizados e distribuídos sozinhos, sem nenhum lead perdido no caminho.",
      },
    ],
    precoDe: "R$ 2.459",
    preco: "R$ 1.229",
    precoSufixoInline: "/Mês",
    whatsMsg:
      "Oi Anderson, fiz o diagnóstico e quero a Gestão Completa por R$ 1.229.",
  },
  agencia: {
    titulo: "Parceria para Agências",
    subtitulo:
      "Terceirize a parte técnica que dá trabalho e entregue mais resultado pros seus clientes.",
    itens: [
      {
        titulo: "Rastreamento de leads",
        descricao:
          "Cada cliente da sua agência com contagem precisa de leads, sem achismo.",
      },
      {
        titulo: "Nutrição do pixel",
        descricao:
          "Conversões devolvidas pro algoritmo, deixando as contas dos seus clientes mais inteligentes.",
      },
      {
        titulo: "Pipeline automático",
        descricao:
          "Leads organizados e distribuídos automaticamente em cada operação.",
      },
    ],
    preco: "R$ 149,90",
    precoSufixo: "/mês por cliente",
    whatsMsg:
      "Oi Anderson, tenho uma agência e quero implementar a parceria de R$ 149,90/mês por cliente.",
  },
};
