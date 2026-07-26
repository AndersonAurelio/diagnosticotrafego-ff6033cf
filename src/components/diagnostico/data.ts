export const WEBHOOK_URL =
  "https://n8n.andersonaurelio.com.br/webhook/84b03a29-d6d7-42b7-ae02-bea95a668a9a";

export const WHATSAPP_NUMBER = "5563992162796";

export type Oferta = {
  titulo: string;
  subtitulo: string;
  itens: string[];
  precoDe?: string;
  preco: string;
  precoSufixo?: string;
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
