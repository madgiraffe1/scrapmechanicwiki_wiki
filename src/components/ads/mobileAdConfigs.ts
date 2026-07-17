export type BannerAdType =
  | "banner-300x250"
  | "banner-468x60"
  | "banner-728x90"
  | "banner-160x600"
  | "banner-160x300"
  | "banner-320x50";

export const AD_CONFIGS: Record<
  BannerAdType,
  {
    width: number;
    height: number;
  }
> = {
  "banner-300x250": {
    width: 300,
    height: 250,
  },
  "banner-468x60": {
    width: 468,
    height: 60,
  },
  "banner-728x90": {
    width: 728,
    height: 90,
  },
  "banner-160x600": {
    width: 160,
    height: 600,
  },
  "banner-160x300": {
    width: 160,
    height: 300,
  },
  "banner-320x50": {
    width: 320,
    height: 50,
  },
};

export interface MobileAdSelection {
  type: BannerAdType;
  adKey: string;
  invokeSrc?: string;
}

function firstEnabled(...values: Array<string | undefined>): string {
  return values.find((value) => Boolean(value && value !== "0")) || "";
}

function isEnabledAdKey(adKey?: string): adKey is string {
  return Boolean(adKey && adKey !== "0");
}

function pickFirstEnabled(
  candidates: Array<MobileAdSelection | null>,
): MobileAdSelection | null {
  return (
    candidates.find(
      (candidate): candidate is MobileAdSelection =>
        Boolean(candidate && isEnabledAdKey(candidate.adKey)),
    ) ?? null
  );
}

export function getPreferredMobileBannerSelection(): MobileAdSelection | null {
  return pickFirstEnabled([
    {
      type: "banner-320x50",
      adKey: getBannerAdKey("banner-320x50"),
      invokeSrc: getBannerInvokeSrc("banner-320x50"),
    },
    {
      type: "banner-300x250",
      adKey: getBannerAdKey("banner-300x250"),
      invokeSrc: getBannerInvokeSrc("banner-300x250"),
    },
  ]);
}

export function getPreferredMobileContentSelection(): MobileAdSelection | null {
  return pickFirstEnabled([
    {
      type: "banner-300x250",
      adKey: getBannerAdKey("banner-300x250"),
      invokeSrc: getBannerInvokeSrc("banner-300x250"),
    },
    {
      type: "banner-320x50",
      adKey: getBannerAdKey("banner-320x50"),
      invokeSrc: getBannerInvokeSrc("banner-320x50"),
    },
  ]);
}

export function getBannerAdKey(type: BannerAdType): string {
  const values: Record<BannerAdType, string> = {
    "banner-300x250": firstEnabled(
      process.env.NEXT_PUBLIC_AD_BANNER_300X250,
      process.env.NEXT_PUBLIC_ADSTERRA_BANNER_300X250_KEY,
    ),
    "banner-468x60": firstEnabled(
      process.env.NEXT_PUBLIC_AD_BANNER_468X60,
      process.env.NEXT_PUBLIC_ADSTERRA_BANNER_468X60_KEY,
    ),
    "banner-728x90": firstEnabled(
      process.env.NEXT_PUBLIC_AD_BANNER_728X90,
      process.env.NEXT_PUBLIC_ADSTERRA_BANNER_728X90_KEY,
    ),
    "banner-160x600": firstEnabled(
      process.env.NEXT_PUBLIC_AD_SIDEBAR_160X600,
      process.env.NEXT_PUBLIC_ADSTERRA_BANNER_160X600_KEY,
    ),
    "banner-160x300": firstEnabled(
      process.env.NEXT_PUBLIC_AD_SIDEBAR_160X300,
      process.env.NEXT_PUBLIC_ADSTERRA_BANNER_160X300_KEY,
    ),
    "banner-320x50": firstEnabled(
      process.env.NEXT_PUBLIC_AD_MOBILE_320X50,
      process.env.NEXT_PUBLIC_ADSTERRA_BANNER_320X50_KEY,
    ),
  };
  return values[type];
}

export function getBannerInvokeSrc(type: BannerAdType): string | undefined {
  const values: Record<BannerAdType, string | undefined> = {
    "banner-300x250": process.env.NEXT_PUBLIC_ADSTERRA_BANNER_300X250_SRC,
    "banner-468x60": process.env.NEXT_PUBLIC_ADSTERRA_BANNER_468X60_SRC,
    "banner-728x90": process.env.NEXT_PUBLIC_ADSTERRA_BANNER_728X90_SRC,
    "banner-160x600": firstEnabled(
      process.env.NEXT_PUBLIC_ADSTERRA_SIDEBAR_160X600_SRC,
      process.env.NEXT_PUBLIC_ADSTERRA_BANNER_160X600_SRC,
    ),
    "banner-160x300": firstEnabled(
      process.env.NEXT_PUBLIC_ADSTERRA_SIDEBAR_160X300_SRC,
      process.env.NEXT_PUBLIC_ADSTERRA_BANNER_160X300_SRC,
    ),
    "banner-320x50": process.env.NEXT_PUBLIC_ADSTERRA_BANNER_320X50_SRC,
  };
  return values[type];
}

export function getNativeBannerConfig() {
  const adKey = firstEnabled(
    process.env.NEXT_PUBLIC_AD_NATIVE_BANNER,
    process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_BANNER_KEY,
  );
  return {
    adKey,
    scriptSrc: process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_BANNER_SRC,
    containerId: process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_BANNER_CONTAINER_ID,
  };
}
