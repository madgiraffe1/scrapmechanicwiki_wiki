"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { AdBanner } from "@/components/ads";

interface DismissibleStickyBannerProps {
  adKey?: string;
  invokeSrc?: string;
  sticky?: boolean;
  className?: string;
}

function hasRenderedAd(root: HTMLElement) {
  return Boolean(root.querySelector("iframe"));
}

export function DismissibleStickyBanner({
  adKey,
  invokeSrc,
  sticky = true,
  className = "",
}: DismissibleStickyBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [adVisible, setAdVisible] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !adKey || adKey === "0" || dismissed) {
      return;
    }

    const updateVisibility = () => setAdVisible(hasRenderedAd(host));
    updateVisibility();

    const observer = new MutationObserver(updateVisibility);
    observer.observe(host, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [adKey, dismissed]);

  if (!adKey || adKey === "0" || dismissed) {
    return null;
  }

  return (
    <div
      ref={hostRef}
      data-ad-role="dismissible-320x50"
      className={`${sticky ? "sticky top-20" : "relative"} z-20 ${
        adVisible ? `py-2 ${className}` : "h-0 overflow-hidden"
      }`}
    >
      <div className={`relative mx-auto max-w-4xl ${adVisible ? "pr-10" : ""}`}>
        <AdBanner type="banner-320x50" adKey={adKey} invokeSrc={invokeSrc} eager />
        {adVisible && (
          <button
            type="button"
            aria-label="Close ad"
            onClick={() => setDismissed(true)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-border/80 bg-background/80 p-1 text-muted-foreground shadow-sm backdrop-blur transition-colors hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
