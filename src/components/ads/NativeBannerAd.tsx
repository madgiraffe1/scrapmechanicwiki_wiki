"use client";

import { useEffect, useRef } from "react";
import { mountAdsterraNativeSlot } from "./adsterraLoader";

interface NativeBannerAdProps {
  adKey?: string;
  scriptSrc?: string;
  containerId?: string;
  className?: string;
}

/**
 * 原生横幅广告组件
 * 特点：4:1 宽高比，完全自适应容器宽度，不限制高度
 */
export function NativeBannerAd({
  adKey,
  scriptSrc,
  containerId,
  className = "",
}: NativeBannerAdProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);
  const resolvedScriptSrc = scriptSrc || "";
  const resolvedContainerId = containerId || (adKey ? `container-${adKey}` : "");

  useEffect(() => {
    if (
      !resolvedScriptSrc ||
      !resolvedContainerId ||
      scriptLoadedRef.current ||
      !hostRef.current ||
      !containerRef.current
    )
      return;

    const cleanup = mountAdsterraNativeSlot(
      hostRef.current,
      containerRef.current,
      resolvedScriptSrc,
    );
    scriptLoadedRef.current = true;

    return () => {
      cleanup();
      scriptLoadedRef.current = false;
    };
  }, [resolvedContainerId, resolvedScriptSrc]);

  if (!resolvedScriptSrc || !resolvedContainerId) return null;

  return (
    <div className={`w-full justify-center my-8 ${className}`}>
      <div className="mx-auto w-full max-w-4xl">
        <div
          ref={hostRef}
          className="overflow-hidden"
        >
          <div id={resolvedContainerId} ref={containerRef} />
        </div>
      </div>
    </div>
  );
}
