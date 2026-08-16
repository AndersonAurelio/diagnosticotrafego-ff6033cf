import { useEffect, useRef, useState } from "react";
import {
  PERGUNTA_PERFIL,
  PERGUNTAS_RASTREIO,
  PERGUNTAS_PIXEL,
  PERGUNTAS_INVESTIMENTO,
  WEBHOOK_URL,
  WHATSAPP_NUMBER,
  OFERTAS,
  calcularNivel,
  linhaPorPerfil,
  type Oferta,
  type PerfilKey,
} from "./data";

import { formatBRPhone, isValidBRPhone, onlyDigits } from "@/lib/whatsapp-mask";
import { trackMetaPixelEvent } from "@/lib/meta-pixel";

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

const STEP_KICKERS: Record<Exclude<Step, "hero">, string> = {
  q1: "PERFIL",
  q2: "RASTREIO",
  q3: "PIXEL",
  q4: "INVESTIMENTO",
  captura: "CONTATO",
  resultado: "RESULT",
};

const PLANO_LABEL: Record<PerfilKey, string> = {
  iniciante: "START",
  negocio: "GESTAO",
  agencia: "AGENCIA",
};

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

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

  const leadEventFiredRef = useRef(false);

  useEffect(() => {
    if (step !== "resultado") return;
    if (leadEventFiredRef.current) return;
    leadEventFiredRef.current = true;
    trackMetaPixelEvent("Lead");
  }, [step]);

  const questionIndex = QUESTION_STEPS.indexOf(step);
  const showProgress = questionIndex >= 0;
  const progressPct = showProgress
    ? ((questionIndex + 1) / QUESTION_STEPS.length) * 100
    : step === "captura"
      ? 100
      : step === "resultado"
        ? 100
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

  const stepLabel =
    step === "hero"
      ? "READY"
      : step === "captura"
        ? "05 / 05"
        : step === "resultado"
          ? "DONE"
          : `${pad2(questionIndex + 1)} / 04`;

  const kickerLabel =
    step === "hero" ? "MINI-DIAGNOSTICO // 40s" : STEP_KICKERS[step];

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Grid blueprint */}
      <div aria-hidden className="tech-grid pointer-events-none fixed inset-0" />

      {/* Halo indigo inferior */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 h-[55vh]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(79,70,229,0.22), transparent 65%)",
        }}
      />

      {/* HUD superior */}
      <HUD progressPct={progressPct} stepLabel={stepLabel} />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-xl flex-col px-5 pb-16 pt-24">
        <div key={step} className="flex-1 animate-in fade-in duration-300">
          {step === "hero" && <Hero onStart={() => setStep("q1")} />}

          {step === "q1" && (
            <Question
              kicker={kickerLabel}
              stepLabel={stepLabel}
              title={PERGUNTA_PERFIL.title}
              options={PERGUNTA_PERFIL.options.map((o) => ({
                label: o.label,
                onClick: () => handleAnswerPerfil(o.value),
              }))}
            />
          )}

          {step === "q2" && answers.perfil && (
            <Question
              kicker={kickerLabel}
              stepLabel={stepLabel}
              title={PERGUNTAS_RASTREIO[answers.perfil].title}
              options={PERGUNTAS_RASTREIO[answers.perfil].options.map((o) => ({
                label: o.label,
                onClick: () => handleAnswerRastreio(o.value, o.pts),
              }))}
            />
          )}

          {step === "q3" && answers.perfil && (
            <Question
              kicker={kickerLabel}
              stepLabel={stepLabel}
              title={PERGUNTAS_PIXEL[answers.perfil].title}
              options={PERGUNTAS_PIXEL[answers.perfil].options.map((o) => ({
                label: o.label,
                onClick: () => handleAnswerPixel(o.value, o.pts),
              }))}
            />
          )}

          {step === "q4" && answers.perfil && (
            <Question
              kicker={kickerLabel}
              stepLabel={stepLabel}
              title={PERGUNTAS_INVESTIMENTO[answers.perfil].title}
              options={PERGUNTAS_INVESTIMENTO[answers.perfil].options.map((o) => ({
                label: o.label,
                onClick: () => handleAnswerInvestimento(o.value),
              }))}
            />
          )}

          {step === "captura" && (
            <form onSubmit={handleSubmitCaptura} className="pt-2">
              <Kicker label={kickerLabel} step={stepLabel} />
              <h2 className="font-display mt-4 text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">
                Pra onde eu envio o resultado completo?
              </h2>
              <p className="mt-3 text-base text-muted-foreground">
                Seu diagnóstico já está calculado.
              </p>

              <div className="mt-8 space-y-5">
                <div>
                  <label className="font-mono mb-2 block text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    &gt; nome
                  </label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Como posso te chamar?"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    autoComplete="name"
                  />
                  {touched && !nomeValido && (
                    <p className="mt-2 text-sm text-destructive">
                      Digite seu nome.
                    </p>
                  )}
                </div>

                <div>
                  <label className="font-mono mb-2 block text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    &gt; whatsapp
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(formatBRPhone(e.target.value))}
                    placeholder="(00) 00000-0000"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
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
                className="glow-primary mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-5 text-base font-semibold tracking-wide text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-60"
              >
                Ver meu resultado
                <span className="font-mono opacity-80">→</span>
              </button>
              <p className="font-mono mt-4 text-center text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                sem spam · só o resultado
              </p>
            </form>
          )}

          {step === "resultado" && (
            <div className="pt-2">
              <Kicker
                label={`RESULT${nome ? ` // ${nome.split(" ")[0].toUpperCase()}` : ""}`}
                step="DONE"
              />

              {/* Score card HUD */}
              <div className="mt-6 rounded-2xl border border-primary/30 bg-white/[0.03] p-6 glow-soft">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                      LEVEL {pad2(nivel.numero)}
                    </p>
                    <p className="font-display mt-2 text-3xl font-extrabold leading-tight text-primary sm:text-4xl">
                      {nivel.nome}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                      SCORE
                    </p>
                    <p className="font-mono mt-2 text-3xl font-semibold text-foreground">
                      {pontuacao}
                      <span className="text-muted-foreground">/6</span>
                    </p>
                  </div>
                </div>

                {/* Segmented bar */}
                <div className="mt-5 flex gap-1.5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className={
                        i < pontuacao
                          ? "h-2 flex-1 rounded-sm bg-primary shadow-[0_0_12px_rgba(79,70,229,0.7)]"
                          : "h-2 flex-1 rounded-sm bg-white/5"
                      }
                    />
                  ))}
                </div>
              </div>

              <p className="mt-6 text-lg leading-relaxed text-foreground">
                {nivel.insight}
              </p>

              {linhaPorPerfil(answers.perfil) && (
                <p className="mt-4 border-l-2 border-primary pl-4 text-base text-muted-foreground">
                  {linhaPorPerfil(answers.perfil)}
                </p>
              )}

              {answers.perfil && (
                <OfertaCard oferta={OFERTAS[answers.perfil]} perfil={answers.perfil} />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function HUD({
  progressPct,
  stepLabel,
}: {
  progressPct: number;
  stepLabel: string;
}) {
  return (
    <div className="fixed inset-x-0 top-0 z-30 border-b border-white/5 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-xl items-center gap-4 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            TERMOMETRO<span className="text-white/30"> / v1.0</span>
          </span>
        </div>

        <div className="relative h-[2px] flex-1 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full bg-primary shadow-[0_0_12px_rgba(79,70,229,0.9)] transition-[width] duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">
          {stepLabel}
        </span>
      </div>
    </div>
  );
}

function Kicker({ label, step }: { label: string; step: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">
        [ {step} ]
      </span>
      <span className="h-px flex-1 bg-white/10" />
      <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

function Hero({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex min-h-[75vh] flex-col justify-between pt-4">
      <div>
        <Kicker label="MINI-DIAGNOSTICO // 40s" step="READY" />
        <h1 className="font-display mt-8 text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
          Descubra a{" "}
          <span className="relative text-primary">
            maturidade do seu tráfego
            <span
              aria-hidden
              className="absolute inset-x-0 -bottom-1 h-px bg-primary/50"
            />
          </span>{" "}
          e o próximo passo.
        </h1>
        <p className="mt-6 text-base leading-relaxed text-muted-foreground">
          Um diagnóstico rápido do quanto o seu tráfego decide no escuro.
        </p>
      </div>

      <div className="mt-10">
        <button
          onClick={onStart}
          className="glow-primary group flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-5 text-base font-semibold tracking-wide text-primary-foreground transition-transform active:scale-[0.98]"
        >
          Começar o diagnóstico
          <span className="font-mono transition-transform group-hover:translate-x-1">
            →
          </span>
        </button>
        <p className="font-mono mt-4 text-center text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          4 perguntas · sem cadastro pra começar
        </p>
      </div>
    </div>
  );
}

function Question({
  kicker,
  stepLabel,
  title,
  options,
}: {
  kicker: string;
  stepLabel: string;
  title: string;
  options: { label: string; onClick: () => void }[];
}) {
  return (
    <div className="pt-2">
      <Kicker label={kicker} step={stepLabel} />
      <h2 className="font-display mt-5 text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      <div className="mt-8 space-y-3">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={opt.onClick}
            className="group flex w-full items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-5 text-left text-base text-foreground transition-all hover:border-primary/60 hover:bg-primary/[0.06] hover:shadow-[inset_0_0_0_1px_rgba(79,70,229,0.25)] active:scale-[0.99]"
          >
            <span className="font-mono text-xs text-muted-foreground transition-colors group-hover:text-primary">
              {pad2(i + 1)}
            </span>
            <span className="flex-1 leading-snug">{opt.label}</span>
            <span
              aria-hidden
              className="font-mono text-primary opacity-40 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
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

function OfertaCard({ oferta, perfil }: { oferta: Oferta; perfil: PerfilKey }) {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(oferta.whatsMsg)}`;
  return (
    <div className="glow-soft mt-8 rounded-2xl border border-primary/40 bg-card p-6">
      <div className="flex items-center gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">
          [ PLANO // {PLANO_LABEL[perfil]} ]
        </span>
        <span className="h-px flex-1 bg-primary/20" />
      </div>

      <h3 className="font-display mt-4 text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl">
        {oferta.titulo}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">{oferta.subtitulo}</p>

      <ul className="mt-6 space-y-3">
        {oferta.itens.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-foreground">
            <CheckIcon />
            <span className="leading-relaxed">
              <span className="font-bold">{item.titulo}:</span>
              {item.descricao && <span> {item.descricao}</span>}
            </span>

          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-baseline gap-3">
        {oferta.precoDe && (
          <span className="font-mono text-sm text-muted-foreground line-through">
            De {oferta.precoDe}
          </span>
        )}
        <span className="font-display text-4xl font-extrabold leading-none text-primary sm:text-5xl">
          {oferta.precoDe ? "Por " : ""}
          {oferta.preco}
          {oferta.precoSufixoInline && (
            <span className="font-mono ml-1 text-xl font-semibold text-primary/90 sm:text-2xl">
              {oferta.precoSufixoInline}
            </span>
          )}
        </span>
      </div>
      {oferta.precoSufixo && (
        <p className="font-mono mt-1 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          {oferta.precoSufixo}
        </p>
      )}

      <div className="mt-5 flex flex-col items-center gap-1.5">
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
          [ Oferta de lançamento ]
        </span>
        <span className="font-mono inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          Vagas limitadas
        </span>
      </div>


      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-5 text-base font-semibold tracking-wide text-accent-foreground transition-all hover:shadow-[0_0_28px_-6px_rgba(37,211,102,0.7)] active:scale-[0.98]"
      >
        <WhatsIcon />
        Quero falar com o Anderson
      </a>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 h-5 w-5 shrink-0 text-primary drop-shadow-[0_0_6px_rgba(79,70,229,0.7)]"
      aria-hidden
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
