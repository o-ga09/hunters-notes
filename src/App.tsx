import React, { useState, useMemo } from 'react'
import { flushSync } from 'react-dom'
import axios from 'axios'
import {
  Search,
  BookOpen,
  AlertCircle,
  X,
  ArrowLeft,
  Filter,
  Sun,
  Moon,
  ArrowDownUp,
  Flame,
  Droplets,
  Zap,
  Snowflake,
  Skull,
  Bomb,
  Biohazard,
  Moon as MoonIcon,
  Ban,
  LayoutGrid,
  ShieldAlert,
  Compass,
  Scroll,
} from 'lucide-react'
import { Monster } from './lib/types'
import { GeminiService } from './services/gemin'
import { MonsterCard } from './components/MonsterCard'
import { MonsterDetail } from './components/MonsterDetail'
import { Loader } from './components/Loader'
import { Pagination } from './components/Pagination'
import { useMonsters } from './hooks/useMonsters'
import { convertApiMonstersToMonsters } from './utils/monsterConverter'

// Type augmentation for View Transitions API
declare global {
  interface CSSStyleDeclaration {
    viewTransitionName: string
  }
}

// Augment React CSSProperties to support viewTransitionName in style props
declare module 'react' {
  interface CSSProperties {
    viewTransitionName?: string
  }
}

type SortOption = 'default' | 'threat_desc' | 'threat_asc' | 'name_asc'
type Theme = 'system' | 'light' | 'dark'

// Element Filter Configuration
const ELEMENT_CONFIG: Record<
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
  睡眠: { icon: MoonIcon, label: '睡眠', colorClass: 'text-indigo-400' },
  無: { icon: Ban, label: '無', colorClass: 'text-stone-400' },
}

export default function App() {
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 20

  // TODO: APIがtotalフィールドで正しい総件数を返すようになったら、この定数を削除してapiTotalを使用する
  const TEMPORARY_TOTAL_MONSTERS = 250

  // State - Initialize theme from localStorage or system preference
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'system' || saved === 'light' || saved === 'dark') {
      return saved as Theme
    }
    return 'system'
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Filters & Sorts
  const [filterElement, setFilterElement] = useState<string>('All')
  const [sortOption, setSortOption] = useState<SortOption>('default')
  const [showFilters, setShowFilters] = useState(false)

  // フィルタやソートが適用されているか判定
  const hasActiveFilters = searchQuery || filterElement !== 'All' || sortOption !== 'default'

  // API Data - サーバーサイドページネーション
  // フィルタなし: 現在のページのみ取得（20件）
  // フィルタあり: 検索・フィルタ用に多めに取得（200件）
  const queryParams = useMemo(
    () => ({
      limit: hasActiveFilters ? 200 : ITEMS_PER_PAGE,
      offset: hasActiveFilters ? 0 : (currentPage - 1) * ITEMS_PER_PAGE,
    }),
    [hasActiveFilters, currentPage, ITEMS_PER_PAGE]
  )

  const {
    monsters: apiMonsters,
    isLoading: apiLoading,
    error: apiError,
    total: apiTotal,
  } = useMonsters(queryParams)

  // フィルタやソート変更時にページをリセット
  const handleFilterChange = (element: string) => {
    setFilterElement(element)
    setCurrentPage(1)
  }

  const handleSortChange = (option: SortOption) => {
    setSortOption(option)
    setCurrentPage(1)
  }

  // View Transition
  const [transitionId, setTransitionId] = useState<string | null>(null)

  // Convert API monsters
  const monsters = useMemo(() => {
    return convertApiMonstersToMonsters(apiMonsters)
  }, [apiMonsters])

  // Apply Derived State - フィルタとソート
  const allFilteredMonsters = useMemo(() => {
    return monsters
      .filter(m => {
        const matchesSearch =
          m.name.includes(searchQuery) ||
          m.species.includes(searchQuery) ||
          m.description.includes(searchQuery)

        const matchesElement =
          filterElement === 'All'
            ? true
            : filterElement === '無'
              ? m.elements.length === 0
              : m.elements.includes(filterElement)

        return matchesSearch && matchesElement
      })
      .sort((a, b) => {
        switch (sortOption) {
          case 'threat_desc':
            return b.threatLevel - a.threatLevel
          case 'threat_asc':
            return a.threatLevel - a.threatLevel
          case 'name_asc':
            return a.name.localeCompare(b.name, 'ja')
          default:
            return 0
        }
      })
  }, [monsters, searchQuery, filterElement, sortOption])

  // ページネーション用の計算
  // フィルタあり: クライアントサイドで処理（取得した200件の範囲内）
  // フィルタなし: サーバーサイドで処理
  // TODO: APIのtotalが正しく実装されたら、TEMPORARY_TOTAL_MONSTERSを削除してapiTotalのみを使用する
  const totalFilteredItems = hasActiveFilters
    ? allFilteredMonsters.length
    : apiTotal && apiTotal > ITEMS_PER_PAGE
      ? apiTotal
      : TEMPORARY_TOTAL_MONSTERS
  const totalPages = Math.ceil(totalFilteredItems / ITEMS_PER_PAGE)

  // 現在のページに表示するデータ
  // フィルタあり: クライアントサイドでスライス
  // フィルタなし: APIから取得したデータをそのまま表示
  const filteredMonsters = hasActiveFilters
    ? allFilteredMonsters.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
    : monsters

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = e.target.value as Theme
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark')
    } else {
      // system の場合はOSの設定を見て切り替える
      document.documentElement.classList.toggle(
        'dark',
        window.matchMedia('(prefers-color-scheme: dark)').matches
      )
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    // 検索時はページをリセット
    setCurrentPage(1)

    const existing = monsters.find(m => m.name === searchQuery || m.name.includes(searchQuery))
    if (existing) {
      handleSelectMonster(existing)
      return
    }

    setLoading(true)
    setError(null)
    if (selectedMonster) setSelectedMonster(null)

    try {
      const result = await GeminiService.searchMonster(searchQuery)
      if (result) {
        handleSelectMonster(result)
      } else {
        setError('該当するモンスターが見つかりませんでした。')
      }
    } catch (err) {
      setError('データの取得中にエラーが発生しました。')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectMonster = (monster: Monster) => {
    setTransitionId(monster.name)
    const img = document.getElementById(`monster-image-${monster.name}`)
    if (img) img.style.viewTransitionName = 'hero-image'

    if (document.startViewTransition) {
      const transition = document.startViewTransition(() => {
        flushSync(() => {
          setSelectedMonster(monster)
        })
      })
      transition.finished.then(() => {
        if (img) img.style.viewTransitionName = ''
      })
    } else {
      setSelectedMonster(monster)
    }
  }

  const handleBack = () => {
    if (document.startViewTransition) {
      const transition = document.startViewTransition(() => {
        flushSync(() => {
          setSelectedMonster(null)
        })
      })
      transition.finished.then(() => setTransitionId(null))
    } else {
      setSelectedMonster(null)
      setTransitionId(null)
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    setError(null)
    setCurrentPage(1)
  }

  return (
    <div>
      <div className="flex flex-col min-h-screen transition-colors duration-500 bg-[#e6e2d3] dark:bg-[#0c0a09] dark:bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] text-stone-800 dark:text-stone-200 font-sans overflow-x-hidden selection:bg-amber-900 selection:text-amber-100">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b-4 border-yellow-900/50 dark:border-yellow-900 bg-[#f5f2eb]/95 dark:bg-stone-900/95 backdrop-blur-md shadow-2xl transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between gap-4 h-14">
              {/* Logo Area */}
              <div
                className="flex items-center gap-3 cursor-pointer group shrink-0"
                onClick={selectedMonster ? handleBack : () => {}}
              >
                <div className="p-2 bg-yellow-900/10 dark:bg-yellow-900/20 rounded-lg border border-yellow-700/30 dark:border-yellow-700/50 group-hover:bg-yellow-900/30 transition-colors">
                  <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-700 dark:text-yellow-500" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl sm:text-2xl font-cinzel font-bold text-yellow-800 dark:text-yellow-500 tracking-wider drop-shadow-sm">
                    HUNTER'S NOTES
                  </h1>
                  <p className="text-[10px] sm:text-xs text-stone-600 dark:text-stone-500 font-mincho tracking-widest uppercase">
                    Ecological Research Dept.
                  </p>
                </div>
              </div>

              {/* Header Right: Search & Theme */}
              <div className="flex-1 max-w-md flex items-center justify-end gap-2 sm:gap-4">
                <form
                  onSubmit={handleSearch}
                  className="relative group flex-1 max-w-[240px] sm:max-w-xs"
                >
                  <div className="relative flex items-center bg-stone-200/50 dark:bg-stone-950/50 rounded border border-stone-400 dark:border-stone-700 focus-within:border-yellow-600 transition-colors shadow-inner">
                    <Search className="w-4 h-4 text-stone-500 ml-3 absolute left-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="検索..."
                      className="w-full bg-transparent border-none focus:ring-0 text-sm sm:text-base pl-9 pr-8 py-1.5 text-stone-800 dark:text-stone-100 placeholder-stone-500 dark:placeholder-stone-600 font-mincho"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute right-2 p-1 text-stone-500 hover:text-stone-800 dark:hover:text-stone-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </form>

                {/* Theme Selector */}
                <div className="relative">
                  <select
                    value={theme}
                    onChange={handleThemeChange}
                    className="bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-sm py-2 px-3 pr-8 rounded border border-stone-400 dark:border-stone-700 focus:ring-1 focus:ring-yellow-600 outline-none cursor-pointer hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors appearance-none"
                    aria-label="Theme Selector"
                  >
                    <option value="system">System</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-stone-700 dark:text-stone-400">
                    {theme === 'system' ? (
                      <Compass className="w-4 h-4" />
                    ) : theme === 'dark' ? (
                      <Moon className="w-4 h-4" />
                    ) : (
                      <Sun className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Bar (Only show on list view or if user wants) */}
            {!selectedMonster && (
              <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-stone-300 dark:border-stone-800 pt-2">
                {/* Mobile Filter Toggle Label */}
                <div className="flex items-center justify-between w-full sm:w-auto sm:hidden">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-widest"
                  >
                    <Filter className="w-3 h-3" /> Filter & Sort
                  </button>
                  {filterElement !== 'All' && (
                    <span className="text-xs text-yellow-700 dark:text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-0.5 rounded border border-yellow-200 dark:border-yellow-900">
                      {filterElement}
                    </span>
                  )}
                </div>

                {/* Filter Icons Container */}
                <div
                  className={`${showFilters ? 'flex' : 'hidden'} sm:flex flex-col sm:flex-row w-full gap-3 animate-fadeIn`}
                >
                  {/* Icons Scroll View */}
                  <div className="flex-1 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                    <div className="flex items-center gap-2 px-1">
                      {Object.entries(ELEMENT_CONFIG).map(([key, config]) => {
                        const Icon = config.icon
                        const isActive = filterElement === key
                        return (
                          <button
                            key={key}
                            onClick={() => handleFilterChange(key)}
                            title={config.label}
                            className={`
                                    relative group flex flex-col items-center justify-center min-w-[36px] w-9 h-9 sm:w-10 sm:h-10 rounded-lg border transition-all duration-300
                                    ${
                                      isActive
                                        ? 'bg-stone-800 dark:bg-stone-200 border-yellow-600 dark:border-yellow-500 shadow-[0_0_10px_rgba(202,138,4,0.3)] scale-105 z-10'
                                        : 'bg-stone-200/50 dark:bg-stone-800/50 border-stone-300 dark:border-stone-700 hover:bg-stone-300 dark:hover:bg-stone-700 hover:border-stone-400 dark:hover:border-stone-500'
                                    }
                                 `}
                          >
                            <Icon
                              className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${isActive ? (theme === 'dark' ? 'text-stone-900' : 'text-stone-100') : config.colorClass}`}
                            />
                            {isActive && (
                              <div className="absolute -bottom-1 w-1 h-1 bg-yellow-500 rounded-full animate-pulse"></div>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="w-px h-8 bg-stone-300 dark:bg-stone-700 hidden sm:block mx-2"></div>

                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-2 min-w-[140px]">
                    <div className="relative w-full">
                      <ArrowDownUp className="w-3 h-3 text-stone-500 absolute left-2 top-1/2 -translate-y-1/2" />
                      <select
                        value={sortOption}
                        onChange={e => handleSortChange(e.target.value as SortOption)}
                        className="w-full bg-stone-200/80 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 text-xs py-1.5 pl-7 pr-2 rounded border border-stone-300 dark:border-stone-700 focus:ring-1 focus:ring-yellow-600 outline-none cursor-pointer hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors"
                      >
                        <option value="default">標準</option>
                        <option value="threat_desc">危険度 (高)</option>
                        <option value="threat_asc">危険度 (低)</option>
                        <option value="name_asc">名前順</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          {/* Error Message - キャンセルエラーは表示しない */}
          {(error || (apiError && !axios.isCancel(apiError))) && (
            <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded flex items-center gap-3 text-red-800 dark:text-red-200">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <p>{error || apiError?.message || 'エラーが発生しました'}</p>
            </div>
          )}

          {/* Loading State */}
          {(loading || apiLoading) && (
            <div className="flex flex-col items-center justify-center py-20 h-full">
              <Loader />
              <p className="mt-6 text-yellow-800 dark:text-yellow-600 font-cinzel animate-pulse text-lg">
                Accessing Guild Archives...
              </p>
            </div>
          )}

          {/* Main Content */}
          {!loading && !apiLoading && !error && !(apiError && !axios.isCancel(apiError)) && (
            <>
              {selectedMonster ? (
                <div className="animate-fadeIn">
                  <button
                    onClick={handleBack}
                    className="mb-6 text-stone-600 dark:text-stone-500 hover:text-yellow-700 dark:hover:text-yellow-500 flex items-center gap-2 transition-colors font-cinzel text-sm font-bold"
                  >
                    <ArrowLeft className="w-4 h-4" /> BACK TO LIST
                  </button>
                  <MonsterDetail monster={selectedMonster} />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 pb-8">
                    {filteredMonsters.map(monster => (
                      <MonsterCard
                        key={monster.name}
                        monster={monster}
                        onClick={() => handleSelectMonster(monster)}
                        activeTransition={transitionId === monster.name}
                      />
                    ))}

                    {filteredMonsters.length === 0 && (
                      <div className="col-span-full flex flex-col items-center justify-center py-20 text-stone-500 dark:text-stone-600 font-mincho">
                        <Filter className="w-12 h-12 mb-4 opacity-20" />
                        <p className="text-lg">条件に一致するモンスターが見つかりません。</p>
                        <button
                          onClick={() => {
                            setFilterElement('All')
                            setSearchQuery('')
                            setCurrentPage(1)
                          }}
                          className="mt-4 px-4 py-2 text-sm bg-stone-200 dark:bg-stone-800 rounded hover:bg-stone-300 dark:hover:bg-stone-700"
                        >
                          条件をリセット
                        </button>
                      </div>
                    )}
                  </div>

                  {/* ページネーション */}
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalItems={totalFilteredItems}
                    itemsPerPage={ITEMS_PER_PAGE}
                  />
                </>
              )}
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t-4 border-yellow-900/50 dark:border-yellow-900 bg-[#d6cfb8] dark:bg-[#1c1917] relative">
          <div className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              {/* Left: Guild Branding */}
              <div className="flex items-center gap-4 text-stone-700 dark:text-stone-400">
                <div className="w-16 h-16 bg-stone-800 rounded-full border-2 border-yellow-600 flex items-center justify-center shadow-lg">
                  <Compass className="w-8 h-8 text-yellow-500" />
                </div>
                <div>
                  <h3 className="font-cinzel font-bold text-xl text-stone-800 dark:text-yellow-600">
                    HUNTER'S GUILD
                  </h3>
                  <p className="font-mincho text-xs tracking-widest uppercase opacity-80">
                    Ecological Research Dept.
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs opacity-70">
                    <Scroll className="w-3 h-3" />
                    <span>Official Records</span>
                  </div>
                </div>
              </div>

              {/* Right: Disclaimer & Copyright */}
              <div className="text-center md:text-right space-y-2">
                <p className="text-xs text-stone-600 dark:text-stone-500 font-mincho max-w-md">
                  当サイトはファンによって作成された非公式のデータベースです。
                  記載されている情報の一部は、ギルドの観測気球（Gemini
                  API）によって自動生成されています。
                </p>
                <div className="h-px w-full md:w-auto bg-stone-400/30 dark:bg-stone-700/50 my-2"></div>
                <p className="text-[10px] text-stone-500 dark:text-stone-600 uppercase tracking-wider">
                  &copy; {new Date().getFullYear()} FAN MADE PROJECT. <br className="sm:hidden" />
                  MONSTER HUNTER IS A TRADEMARK OF CAPCOM CO., LTD.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
