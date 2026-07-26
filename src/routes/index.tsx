import { createFileRoute } from "@tanstack/react-router";
import { Diagnostico } from "@/components/diagnostico/Diagnostico";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Termômetro do Rastreamento — Diagnóstico de tráfego em 40s" },
      {
        name: "description",
        content:
          "Mini-diagnóstico rápido: descubra o quanto seu tráfego decide no escuro e receba um plano de ação no WhatsApp.",
      },
      {
        property: "og:title",
        content: "Termômetro do Rastreamento — Diagnóstico em 40s",
      },
      {
        property: "og:description",
        content:
          "Descubra em 40 segundos o quanto você perde por não rastrear seus leads.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <Diagnostico />;
}
