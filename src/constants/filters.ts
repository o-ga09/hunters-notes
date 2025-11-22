import {
  LayoutGrid,
  Flame,
  Droplets,
  Zap,
  Snowflake,
  Skull,
  Bomb,
  Biohazard,
  Moon,
  Ban,
  ShieldAlert,
} from 'lucide-react'

export type SortOption = 'default' | 'threat_desc' | 'threat_asc' | 'name_asc'
export type Theme = 'system' | 'light' | 'dark'

// Element Filter Configuration
export const ELEMENT_CONFIG: Record<
  string,
  { icon: React.ElementType; label: string; colorClass: string }
> = {
  All: {
    icon: LayoutGrid,
    label: '全て',
    colorClass: 'text-stone-500 dark:text-stone-400',
  },
  火: { icon: Flame, label: '火', colorClass: 'text-red-500' },
  水: { icon: Droplets, label: '水', colorClass: 'text-blue-500' },
  雷: { icon: Zap, label: '雷', colorClass: 'text-yellow-500' },
  氷: { icon: Snowflake, label: '氷', colorClass: 'text-cyan-400' },
  龍: { icon: Skull, label: '龍', colorClass: 'text-purple-600' },
  爆破: { icon: Bomb, label: '爆破', colorClass: 'text-orange-500' },
  毒: { icon: Biohazard, label: '毒', colorClass: 'text-purple-400' },
  麻痺: { icon: ShieldAlert, label: '麻痺', colorClass: 'text-yellow-400' },
  睡眠: { icon: Moon, label: '睡眠', colorClass: 'text-indigo-400' },
  無: { icon: Ban, label: '無', colorClass: 'text-stone-400' },
}

export const ITEMS_PER_PAGE = 20
