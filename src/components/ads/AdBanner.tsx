"use client";

import { useEffect, useRef } from "react";
import { AD_CONFIGS, type BannerAdType } from "./mobileAdConfigs";
import { useDeferredAdSlot } from "./useDeferredAdSlot";
import { mountAdsterraBannerSlot } from "./adsterraLoader";

interface AdBannerProps {
  /**
   * 广告类型
   */
  type: BannerAdType;
  className?: string;
  eager?: boolean;
  /**
   * 广告 key（可选）
   * 如果提供且为空，则不渲染广告
   */
  adKey?: string;
  invokeSrc?: string;
}

/**
 * 横幅广告组件（动态脚本加载）
 * 使用 Adsterra 横幅广告
 * 队列化加载，防止并发冲突
 */
export function AdBanner({
  type,
  className = "",
  adKey,
  invokeSrc,
  eager = false,
}: AdBannerProps) {
  const slotEnabled = Boolean(adKey && adKey !== "0");
  const { ref: containerRef, isActive: isDeferredActive } =
    useDeferredAdSlot<HTMLDivElement>({
      enabled: slotEnabled && !eager,
      delayMs: type === "banner-320x50" ? 1200 : 400,
    });
  const isActive = eager ? slotEnabled : isDeferredActive;
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (
      !adKey ||
      adKey === "0" ||
      !isActive ||
      scriptLoadedRef.current ||
      !containerRef.current
    ) {
      return;
    }

    const config = AD_CONFIGS[type];
    const cleanup = mountAdsterraBannerSlot(containerRef.current, {
      key: adKey,
      width: config.width,
      height: config.height,
      invokeSrc,
    });

    scriptLoadedRef.current = true;

    return () => {
      cleanup();
      scriptLoadedRef.current = false;
    };
  }, [adKey, containerRef, invokeSrc, isActive, type]);

  // 如果 adKey 未配置或为空，不渲染
  if (!adKey || adKey === "0") {
    return null;
  }

  const config = AD_CONFIGS[type];

  return (
    <div className={`flex justify-center ${className}`}>
      <div
        ref={containerRef}
        className="overflow-hidden"
        style={{
          maxWidth: `${config.width}px`,
          width: "100%",
        }}
      />
    </div>
  );
}
