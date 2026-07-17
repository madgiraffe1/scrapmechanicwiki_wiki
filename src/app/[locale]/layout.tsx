import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing, type Locale } from '@/i18n/routing'
import { buildLanguageAlternates } from '@/lib/i18n-utils'
import { getNavPreviewData } from '@/lib/nav-preview'
import type { Language } from '@/lib/content'
import ClientBody from '../ClientBody'
import Analytics from '@/components/Analytics'

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

// 生成静态参数
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// 生成元数据
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  // 启用静态渲染：必须在调用 next-intl 服务端函数前设置请求 locale
  setRequestLocale(locale);
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://scrapmechanicwiki.wiki";

  // 获取 SEO 翻译
  const t = await getTranslations("seo.home");

  return {
    title: t("title"),
    description: t("description"),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: locale,
      url: locale === "en" ? siteUrl : `${siteUrl}/${locale}`,
      siteName: "Scrap Mechanic Wiki",
      title: t("ogTitle"),
      description: t("ogDescription"),
      images: [
        {
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          alt: "Scrap Mechanic Wiki",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("twitterTitle"),
      description: t("twitterDescription"),
      images: [`${siteUrl}/images/hero.webp`],
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
    manifest: "/manifest.json",
    alternates: buildLanguageAlternates("/", locale as Locale, siteUrl),
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // 验证 locale
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // 启用静态渲染：必须在调用任何 next-intl 服务端函数前设置请求 locale，
  // 否则 next-intl 会退回用 headers() 读 locale，强制整条路由动态渲染（响应 no-store、
  // 每请求全量 SSR）。设置后 generateStaticParams 才能真正预渲染各 locale 静态页。
  setRequestLocale(locale);

  // 获取翻译消息
  const messages = await getMessages();
  const navPreviewData = await getNavPreviewData(locale as Language);

	return (
		<>
			<Analytics />
			<NextIntlClientProvider messages={messages}>
				<ClientBody navPreviewData={navPreviewData}>{children}</ClientBody>
			</NextIntlClientProvider>
		</>
	)
}
