"use client";

import { lazy, Suspense } from "react";
import { ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { DismissibleStickyBanner } from "@/components/ads/DismissibleStickyBanner";
import {
  getBannerAdKey,
  getBannerInvokeSrc,
  getNativeBannerConfig,
} from "@/components/ads/mobileAdConfigs";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { NAVIGATION_CONFIG } from "@/config/navigation";
import type { ContentItemWithType } from "@/lib/getLatestArticles";

const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));

const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} animate-pulse rounded-lg border border-border bg-white/5`}
  />
);

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://scrapmechanicwiki.wiki";
  const nativeBanner = getNativeBannerConfig();

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Scrap Mechanic Wiki",
        description:
          "Scrap Mechanic Wiki guides for survival, building, vehicles, bots, mods, multiplayer, updates, and beginner progression.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Scrap Mechanic Wiki",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Scrap Mechanic Wiki",
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        sameAs: [
          "https://scrapmechanic.com/",
          "https://store.steampowered.com/app/387990/Scrap_Mechanic/",
          "https://www.youtube.com/@Axolotgames",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Scrap Mechanic",
        gamePlatform: ["Windows PC", "Steam"],
        applicationCategory: "Game",
        genre: ["Survival", "Sandbox", "Crafting", "Building"],
        offers: {
          "@type": "Offer",
          url: "https://store.steampowered.com/app/387990/Scrap_Mechanic/",
          availability: "https://schema.org/InStock",
        },
      },
      {
        "@type": "VideoObject",
        name: "Scrap Mechanic - Survival Trailer",
        description:
          "Official Scrap Mechanic survival trailer from Axolot Games.",
        uploadDate: "2020-04-29",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/NF02KyJoXj0",
        url: "https://www.youtube.com/watch?v=NF02KyJoXj0",
      },
    ],
  };

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--nav-theme)/0.16)] to-transparent" />
        <div className="absolute inset-x-4 top-3 z-20 md:top-4">
          <DismissibleStickyBanner
            adKey={getBannerAdKey("banner-320x50")}
            invokeSrc={getBannerInvokeSrc("banner-320x50")}
            sticky={false}
            showCloseButton={false}
          />
        </div>
        <div className="container relative z-10 mx-auto max-w-6xl">
          <div className="scroll-reveal mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-3 py-1.5 md:mb-6 md:px-4 md:py-2">
              <Sparkles className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs font-medium md:text-sm">
                {t.hero.badge}
              </span>
            </div>

            <h1 className="mb-4 text-4xl font-bold leading-[1.05] sm:text-5xl md:mb-6 md:text-7xl">
              {t.hero.title}
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <a
                href="https://store.steampowered.com/app/387990/Scrap_Mechanic/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[hsl(var(--nav-theme))] px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[hsl(var(--nav-theme)/0.9)] md:px-8 md:py-4 md:text-lg"
              >
                {t.hero.playOnSteamCTA}
                <ExternalLink className="h-5 w-5" />
              </a>
              <Link
                href="/guide"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-6 py-3.5 text-base font-semibold transition-colors hover:bg-white/10 md:px-8 md:py-4 md:text-lg"
              >
                {t.hero.readGuidesCTA}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      <section className="px-4 py-10 md:py-12">
        <div className="container mx-auto max-w-5xl scroll-reveal">
          <div className="relative overflow-hidden rounded-lg">
            <VideoFeature
              videoId="NF02KyJoXj0"
              title="Scrap Mechanic - Survival Trailer"
            />
          </div>
        </div>
      </section>

      <div data-ad-position="native-after-video">
        <NativeBannerAd
          adKey={nativeBanner.adKey}
          scriptSrc={nativeBanner.scriptSrc}
          containerId={nativeBanner.containerId}
        />
      </div>

      <section className="bg-white/[0.02] px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8 text-center scroll-reveal md:mb-12">
            <h2 className="mb-3 text-3xl font-bold md:mb-4 md:text-5xl">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="mx-auto max-w-3xl text-base text-muted-foreground md:text-lg">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {NAVIGATION_CONFIG.map((item, index) => {
              const card = t.tools.cards[index];
              return (
                <Link
                  key={item.key}
                  href={item.path}
                  className="group scroll-reveal rounded-lg border border-border bg-card p-4 text-left transition-all duration-300 hover:border-[hsl(var(--nav-theme)/0.5)] hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)] md:p-6"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.1)] transition-colors group-hover:bg-[hsl(var(--nav-theme)/0.2)] md:mb-4 md:h-12 md:w-12">
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 text-[hsl(var(--nav-theme-light))] md:h-6 md:w-6"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm font-semibold md:text-base">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={16}
      />

      <AdBanner
        type="banner-300x250"
        adKey={getBannerAdKey("banner-300x250")}
        invokeSrc={getBannerInvokeSrc("banner-300x250")}
      />

      <section className="px-4 py-14 md:py-20">
        <div className="container mx-auto grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-4">
          {t.homeHighlights.cards.map((card: any, index: number) => (
            <div
              key={index}
              className="rounded-lg border border-border bg-card p-5"
            >
              <DynamicIcon
                name={card.icon}
                className="mb-4 h-6 w-6 text-[hsl(var(--nav-theme-light))]"
              />
              <h3 className="mb-2 text-lg font-semibold">{card.title}</h3>
              <p className="text-sm leading-6 text-muted-foreground">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Suspense fallback={<LoadingPlaceholder height="h-80" />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      <section className="px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="rounded-lg border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.12)] p-6 text-center md:p-12">
            <h2 className="mb-3 text-3xl font-bold md:mb-4 md:text-5xl">
              {t.cta.title}
            </h2>
            <p className="mx-auto mb-6 max-w-2xl text-base text-muted-foreground md:mb-8 md:text-lg">
              {t.cta.description}
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="https://scrapmechanic.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[hsl(var(--nav-theme))] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[hsl(var(--nav-theme)/0.9)]"
              >
                {t.cta.officialSite}
                <ExternalLink className="h-4 w-4" />
              </a>
              <a
                href="https://store.steampowered.com/app/387990/Scrap_Mechanic/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-3 text-base font-semibold transition-colors hover:bg-white/10"
              >
                {t.cta.steamPage}
              </a>
            </div>
          </div>
        </div>
      </section>

      <AdBanner
        type="banner-728x90"
        adKey={getBannerAdKey("banner-728x90")}
        invokeSrc={getBannerInvokeSrc("banner-728x90")}
        className="hidden md:flex"
      />

      <footer className="border-t border-border px-4 py-10">
        <div className="container mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <h2 className="mb-3 text-xl font-bold">{t.footer.title}</h2>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              {t.footer.description}
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              {t.footer.disclaimer}
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {t.footer.resources}
            </h3>
            <div className="grid gap-2 text-sm">
              {NAVIGATION_CONFIG.slice(0, 4).map((item) => (
                <Link
                  key={item.key}
                  href={item.path}
                  className="hover:text-[hsl(var(--nav-theme-light))]"
                >
                  {t.nav[item.key]}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {t.footer.legal}
            </h3>
            <div className="grid gap-2 text-sm">
              <Link href="/about" className="hover:text-[hsl(var(--nav-theme-light))]">
                {t.footer.about}
              </Link>
              <Link href="/privacy-policy" className="hover:text-[hsl(var(--nav-theme-light))]">
                {t.footer.privacy}
              </Link>
              <Link href="/terms-of-service" className="hover:text-[hsl(var(--nav-theme-light))]">
                {t.footer.terms}
              </Link>
              <Link href="/copyright" className="hover:text-[hsl(var(--nav-theme-light))]">
                {t.footer.copyrightNotice}
              </Link>
            </div>
          </div>
        </div>
        <div className="container mx-auto mt-8 max-w-6xl text-xs text-muted-foreground">
          {t.footer.copyright}
        </div>
      </footer>
    </div>
  );
}
