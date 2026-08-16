declare global {
  interface Window {
    fbq?: {
      (...args: unknown[]): void;
      callMethod?: (...args: unknown[]) => void;
      queue?: unknown[];
      loaded?: boolean;
      version?: string;
    };
    _fbq?: Window["fbq"];
  }
}

/**
 * Dispara um evento padrão do Meta Pixel (ex.: "Lead", "PageView").
 * Não faz nada se o pixel ainda não carregou (ex.: bloqueador de anúncios).
 */
export function trackMetaPixelEvent(
  eventName: string,
  params?: Record<string, unknown>,
) {
  if (typeof window === "undefined") return;
  if (typeof window.fbq !== "function") return;
  window.fbq("track", eventName, params);
}

export {};
