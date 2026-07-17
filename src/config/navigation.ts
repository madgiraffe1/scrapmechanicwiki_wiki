import {
	BookOpen,
	Shield,
	Hammer,
	Car,
	Bot,
	Puzzle,
	Users,
	Sparkles,
	type LucideIcon,
} from 'lucide-react'

export interface NavigationItem {
	key: string // 用于翻译键，如 'codes' -> t('nav.codes')
	path: string // URL 路径，如 '/codes'
	icon: LucideIcon // Lucide 图标组件
	isContentType: boolean // 是否对应 content/ 目录
}

export const NAVIGATION_CONFIG: NavigationItem[] = [
	{
		key: 'guide',
		path: '/guide',
		icon: BookOpen,
		isContentType: true,
	},
	{
		key: 'survival',
		path: '/survival',
		icon: Shield,
		isContentType: true,
	},
	{
		key: 'building',
		path: '/building',
		icon: Hammer,
		isContentType: true,
	},
	{
		key: 'vehicles',
		path: '/vehicles',
		icon: Car,
		isContentType: true,
	},
	{
		key: 'bots',
		path: '/bots',
		icon: Bot,
		isContentType: true,
	},
	{
		key: 'mods',
		path: '/mods',
		icon: Puzzle,
		isContentType: true,
	},
	{
		key: 'multiplayer',
		path: '/multiplayer',
		icon: Users,
		isContentType: true,
	},
	{
		key: 'updates',
		path: '/updates',
		icon: Sparkles,
		isContentType: true,
	},
]

// 从配置派生内容类型列表（用于路由和内容加载）
export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => item.isContentType).map(
	(item) => item.path.slice(1),
) // 移除开头的 '/'

export type ContentType = (typeof CONTENT_TYPES)[number]

// 辅助函数：验证内容类型
export function isValidContentType(type: string): type is ContentType {
	return CONTENT_TYPES.includes(type as ContentType)
}
