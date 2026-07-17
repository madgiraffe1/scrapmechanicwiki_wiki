"use client";

import { useEffect, useRef } from "react";
import { mountAdsterraBannerSlot } from "./adsterraLoader";

interface SidebarAdProps {
  /**
   * 广告类型
   * sidebar-160x600: 左侧竖幅广告
   * sidebar-160x300: 右侧方形广告
   */
  type: "sidebar-160x600" | "sidebar-160x300";
  className?: string;
  /**
   * 广告 key（可选）
   * 如果提供且为空，则不渲染广告
   */
  adKey?: string;
  invokeSrc?: string;
}

const AD_CONFIGS = {
  "sidebar-160x600": {
    width: 160,
    height: 600,
  },
  "sidebar-160x300": {
    width: 160,
    height: 300,
  },
};

/**
 * 侧边栏广告组件（动态脚本加载）
 * 使用 Adsterra 侧边栏广告
 * 队列化加载，防止并发冲突
 */
export function SidebarAd({ type, className = "", adKey, invokeSrc }: SidebarAdProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (
      !adKey ||
      adKey === "0" ||
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
  }, [adKey, invokeSrc, type]);

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
          width: `${config.width}px`,
        }}
      />
    </div>
  );
}
