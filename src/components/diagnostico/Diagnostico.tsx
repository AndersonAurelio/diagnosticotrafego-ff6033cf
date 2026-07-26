import { useEffect, useRef, useState } from "react";
import {
  PERGUNTA_PERFIL,
  PERGUNTA_RASTREIO,
  PERGUNTA_PIXEL,
  PERGUNTA_INVESTIMENTO,
  WEBHOOK_URL,
  WHATSAPP_NUMBER,
  MATERIAL_URL,
  MATERIAL_LABEL,
  MATERIAL_TITLE,
  MATERIAL_DESC,
  calcularNivel,
  linhaPorPerfil,
  type PerfilKey,
} from "./data";
import { formatBRPhone, isValidBRPhone, onlyDigits } from "@/lib/whatsapp-mask";

type Step = "hero" | "q1" | "q2" | "q3" | "q4" | "captura" | "resultado";

const QUESTION_STEPS: Step[] = ["q1", "q2", "q3", "q4"];

type Answers = {
  perfil: PerfilKey | "";
  rastreio: string;
  rastreioPts: number;
  pixel: string;
  pixelPts: number;
  investimento: string;
};

const initialAnswers: Answers = {
  perfil: "",
  rastreio: "",
  rastreioPts: 0,
  pixel: "",
  pixelPts: 0,
  investimento: "",
};

export function Diagnostico() {
  const [step, setStep] = useState<Step>("hero");
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [touched, setTouched] = useState(false);

  const utmsRef = useRef({
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_content: "",
    origem_url: "",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    utmsRef.current = {
      utm_source: params.get("utm_source") ?? "",
      utm_medium: params.get("utm_medium") ?? "",
      utm_campaign: params.get("utm_campaign") ?? "",
      utm_content: params.get("utm_content") ?? "",
      origem_url: window.location.href,
    };
  }, []);

  const questionIndex = QUESTION_STEPS.indexOf(step);
  const showProgress = questionIndex >= 0;
  const progressPct = showProgress
    ? ((questionIndex + 1) / QUESTION_STEPS.length) * 100
    : 0;

  const pontuacao = answers.rastreioPts + answers.pixelPts;
  const nivel = calcularNivel(pontuacao);

  const nomeValido = nome.trim().length > 0;
  const whatsValido = isValidBRPhone(whatsapp);
  const formValido = nomeValido && whatsValido;

  function handleAnswerPerfil(value: PerfilKey) {
    setAnswers((a) => ({ ...a, perfil: value }));
    setStep("q2");
  }

  function handleAnswerRastreio(value: string, pts: number) {
    setAnswers((a) => ({ ...a, rastreio: value, rastreioPts: pts }));
    setStep("q3");
  }

  function handleAnswerPixel(value: string, pts: number) {
    setAnswers((a) => ({ ...a, pixel: value, pixelPts: pts }));
    setStep("q4");
  }

  function handleAnswerInvestimento(value: string) {
    setAnswers((a) => ({ ...a, investimento: value }));
    setStep("captura");
  }

  function handleSubmitCaptura(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!formValido) return;

    const payload = {
      nome: nome.trim(),
      whatsapp: onlyDigits(whatsapp),
      perfil: answers.perfil,
      rastreio: answers.rastreio,
      pixel: answers.pixel,
      investimento: answers.investimento,
      nivel: nivel.fullName,
      pontuacao,
      ...utmsRef.current,
      timestamp: new Date().toISOString(),
    };

    try {
      fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    } catch {
      // silencioso
    }

    setStep("resultado");
  }

  const whatsMsg = encodeURIComponent(
    `Oi Anderson, fiz o diagnóstico e deu ${nivel.fullName}. Quero entender como rastrear meus leads.`,
  );
  const whatsHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsMsg}`;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Brilho amarelo no canto inferior */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 h-[60vh] opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at 80% 100%, rgba(245,197,24,0.22), transparent 60%)",
        }}
      />

      {/* Barra de progresso */}
      {showProgress && (
        <div className="fixed inset-x-0 top-0 z-20 h-1.5 bg-white/5">
          <div
            className="h-full bg-primary transition-[width] duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      )}

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-xl flex-col px-5 pb-10 pt-8">
        <div className="mb-6 flex items-center justify-between text-xs uppercase tracking-widest text-muted-foreground">
          <span className="font-display text-sm text-primary">Termômetro</span>
          {showProgress && (
            <span>
              {questionIndex + 1}/{QUESTION_STEPS.length}
            </span>
          )}
        </div>

        <div key={step} className="flex-1 animate-in fade-in duration-300">
          {step === "hero" && (
            <Hero onStart={() => setStep("q1")} />
          )}

          {step === "q1" && (
            <Question
              title={PERGUNTA_PERFIL.title}
              options={PERGUNTA_PERFIL.options.map((o) => ({
                label: o.label,
                onClick: () => handleAnswerPerfil(o.value),
              }))}
            />
          )}

          {step === "q2" && (
            <Question
              title={PERGUNTA_RASTREIO.title}
              options={PERGUNTA_RASTREIO.options.map((o) => ({
                label: o.label,
                onClick: () => handleAnswerRastreio(o.value, o.pts),
              }))}
            />
          )}

          {step === "q3" && (
            <Question
              title={PERGUNTA_PIXEL.title}
              options={PERGUNTA_PIXEL.options.map((o) => ({
                label: o.label,
                onClick: () => handleAnswerPixel(o.value, o.pts),
              }))}
            />
          )}

          {step === "q4" && (
            <Question
              title={PERGUNTA_INVESTIMENTO.title}
              options={PERGUNTA_INVESTIMENTO.options.map((o) => ({
                label: o.label,
                onClick: () => handleAnswerInvestimento(o.value),
              }))}
            />
          )}

          {step === "captura" && (
            <form onSubmit={handleSubmitCaptura} className="pt-4">
              <p className="text-base text-muted-foreground">
                Pronto! Seu diagnóstico está calculado.
              </p>
              <h2 className="font-display mt-2 text-3xl uppercase leading-tight text-foreground sm:text-4xl">
                Pra onde eu envio o resultado completo + o material?
              </h2>

              <div className="mt-8 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Seu nome
                  </label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Como posso te chamar?"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                    autoComplete="name"
                  />
                  {touched && !nomeValido && (
                    <p className="mt-2 text-sm text-destructive">
                      Digite seu nome.
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Seu melhor WhatsApp
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(formatBRPhone(e.target.value))}
                    placeholder="(00) 00000-0000"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                    autoComplete="tel"
                  />
                  {touched && !whatsValido && (
                    <p className="mt-2 text-sm text-destructive">
                      Informe um WhatsApp válido com DDD.
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={!formValido && touched}
                className="mt-8 w-full rounded-2xl bg-primary px-6 py-5 text-base font-bold uppercase tracking-wide text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-60"
              >
                Ver meu resultado
              </button>
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Sem spam. Só o resultado + o material.
              </p>
            </form>
          )}

          {step === "resultado" && (
            <div className="pt-2">
              <p className="text-sm uppercase tracking-widest text-muted-foreground">
                {nome ? `${nome.split(" ")[0]}, seu nível é` : "Seu nível é"}
              </p>
              <div className="mt-2 flex items-baseline gap-3">
                <span className="font-display text-7xl leading-none text-primary sm:text-8xl">
                  {nivel.numero}
                </span>
                <span className="font-display text-2xl uppercase leading-tight text-primary sm:text-3xl">
                  {nivel.nome}
                </span>
              </div>

              <p className="mt-6 text-lg leading-relaxed text-foreground">
                {nivel.insight}
              </p>

              {linhaPorPerfil(answers.perfil) && (
                <p className="mt-4 border-l-2 border-primary pl-4 text-base text-muted-foreground">
                  {linhaPorPerfil(answers.perfil)}
                </p>
              )}

              <a
                href={whatsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-accent px-6 py-5 text-base font-bold uppercase tracking-wide text-accent-foreground transition-transform active:scale-[0.98]"
              >
                <WhatsIcon />
                Falar com o Anderson agora
              </a>

              <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-xs uppercase tracking-widest text-primary">
                  Bônus
                </p>
                <h3 className="font-display mt-2 text-xl uppercase text-foreground">
                  {MATERIAL_TITLE}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {MATERIAL_DESC}
                </p>
                <a
                  href={MATERIAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center justify-center rounded-xl border border-primary/60 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-primary hover:bg-primary/10"
                >
                  {MATERIAL_LABEL}
                </a>
              </div>

              <p className="mt-10 text-center text-xs text-muted-foreground">
                Pontuação: {pontuacao}/6
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function Hero({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex min-h-[80vh] flex-col justify-between pt-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-primary">
          Mini-diagnóstico · 40 segundos
        </p>
        <h1 className="font-display mt-6 text-4xl uppercase leading-[1.05] text-foreground sm:text-5xl">
          Descubra em 40 segundos o quanto você{" "}
          <span className="text-primary">perde por não rastrear</span> seus
          leads
        </h1>
        <p className="mt-6 text-base leading-relaxed text-muted-foreground">
          Um diagnóstico rápido do quanto o seu tráfego decide no escuro.
        </p>
      </div>

      <div className="mt-10">
        <button
          onClick={onStart}
          className="w-full rounded-2xl bg-primary px-6 py-5 text-base font-bold uppercase tracking-wide text-primary-foreground transition-transform active:scale-[0.98]"
        >
          Começar o diagnóstico
        </button>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          4 perguntas. Sem cadastro pra começar.
        </p>
      </div>
    </div>
  );
}

function Question({
  title,
  options,
}: {
  title: string;
  options: { label: string; onClick: () => void }[];
}) {
  return (
    <div className="pt-4">
      <h2 className="font-display text-3xl uppercase leading-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      <div className="mt-8 space-y-3">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={opt.onClick}
            className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-5 text-left text-base text-foreground transition-all hover:border-primary hover:bg-primary/5 active:scale-[0.99]"
          >
            <span>{opt.label}</span>
            <span
              aria-hidden
              className="text-primary opacity-60 transition-opacity group-hover:opacity-100"
            >
              →
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function WhatsIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
      aria-hidden
    >
      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.5 0 .2 5.3.2 11.86c0 2.09.55 4.13 1.6 5.93L0 24l6.4-1.68a11.83 11.83 0 0 0 5.66 1.44h.01c6.56 0 11.86-5.3 11.86-11.86 0-3.17-1.23-6.15-3.41-8.42Zm-8.46 18.24h-.01a9.85 9.85 0 0 1-5.02-1.37l-.36-.21-3.8 1 1.02-3.7-.24-.38a9.86 9.86 0 0 1-1.51-5.24c0-5.45 4.43-9.88 9.88-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.9 6.99c0 5.45-4.44 9.89-9.85 9.89Zm5.42-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.1 4.49.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z" />
    </svg>
  );
}
