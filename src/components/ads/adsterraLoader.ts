"use client";

const AD_LOAD_TIMEOUT_MS = 8000;

interface HighPerformanceWindow extends Window {
  __adsterraBannerQueue?: Promise<void>;
  atOptions?: {
    key: string;
    format: "iframe";
    height: number;
    width: number;
    params: Record<string, unknown>;
  };
}

export interface AdsterraBannerSlot {
  key: string;
  width: number;
  height: number;
  invokeSrc?: string;
}

function bannerInvokeSrc(slot: AdsterraBannerSlot) {
  return slot.invokeSrc || `https://www.highperformanceformat.com/${slot.key}/invoke.js`;
}

function collapseHost(host: HTMLElement) {
  host.style.width = "0px";
  host.style.height = "0px";
  host.style.opacity = "0";
  host.style.overflow = "hidden";
}

function expandBannerHost(host: HTMLElement, slot: AdsterraBannerSlot) {
  host.style.width = `${slot.width}px`;
  host.style.maxWidth = "100%";
  host.style.height = `${slot.height}px`;
  host.style.opacity = "1";
}

function hasProviderContent(host: HTMLElement) {
  return Array.from(host.children).some((child) => {
    if (child.tagName === "SCRIPT") return false;
    if (child.tagName === "IFRAME") return true;
    return child.childElementCount > 0 || child.textContent?.trim();
  });
}

function enqueueBannerLoad(task: () => Promise<void>) {
  const w = window as HighPerformanceWindow;
  const queue = w.__adsterraBannerQueue ?? Promise.resolve();
  const next = queue.then(task, task);
  w.__adsterraBannerQueue = next.then(
    () => undefined,
    () => undefined,
  );
  return next;
}

export function mountAdsterraBannerSlot(host: HTMLElement, slot: AdsterraBannerSlot) {
  collapseHost(host);

  let cancelled = false;
  let script: HTMLScriptElement | null = null;
  let observer: MutationObserver | null = null;
  let timeoutId: number | undefined;

  const cleanup = () => {
    cancelled = true;
    observer?.disconnect();
    if (timeoutId) window.clearTimeout(timeoutId);
    script?.remove();
  };

  enqueueBannerLoad(
    () =>
      new Promise<void>((resolve) => {
        if (cancelled || !host.isConnected) {
          resolve();
          return;
        }

        const settle = () => {
          if (timeoutId) window.clearTimeout(timeoutId);
          window.setTimeout(resolve, 100);
        };

        const checkFill = () => {
          if (cancelled) return;
          if (hasProviderContent(host)) {
            expandBannerHost(host, slot);
          }
        };

        observer = new MutationObserver(checkFill);
        observer.observe(host, { childList: true, subtree: true });

        timeoutId = window.setTimeout(() => {
          collapseHost(host);
          settle();
        }, AD_LOAD_TIMEOUT_MS);

        const w = window as HighPerformanceWindow;
        w.atOptions = {
          key: slot.key,
          format: "iframe",
          height: slot.height,
          width: slot.width,
          params: {},
        };

        script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        script.src = bannerInvokeSrc(slot);
        script.onload = () => {
          checkFill();
          settle();
        };
        script.onerror = () => {
          collapseHost(host);
          settle();
        };

        host.appendChild(script);
      }),
  );

  return cleanup;
}

export function mountAdsterraNativeSlot(
  host: HTMLElement,
  container: HTMLElement,
  scriptSrc: string,
) {
  collapseHost(host);

  let cancelled = false;

  const checkFill = () => {
    if (cancelled) return;
    if (hasProviderContent(container)) {
      host.style.width = "100%";
      host.style.height = "auto";
      host.style.opacity = "1";
    }
  };

  const observer = new MutationObserver(checkFill);
  observer.observe(container, { childList: true, subtree: true });

  const timeoutId = window.setTimeout(() => {
    collapseHost(host);
    observer.disconnect();
  }, AD_LOAD_TIMEOUT_MS);

  const script = document.createElement("script");
  script.async = true;
  script.setAttribute("data-cfasync", "false");
  script.src = scriptSrc;
  script.onload = checkFill;
  script.onerror = () => {
    collapseHost(host);
    observer.disconnect();
  };

  host.appendChild(script);

  return () => {
    cancelled = true;
    observer.disconnect();
    window.clearTimeout(timeoutId);
    script.remove();
    container.replaceChildren();
  };
}
