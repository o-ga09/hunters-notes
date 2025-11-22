import { FC, useState, useMemo, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { Monster } from '@/lib/types'
import { GeminiService } from '@/services/gemin'
import { Loader } from '@/components/Loader'
import { Pagination } from '@/components/Pagination'
import { FloatingButtons } from '@/components/FloatingButtons'
import { AIModal } from '@/components/AIModal'
import { Header } from '@/components/Header'
import { FilterBar } from '@/components/FilterBar'
import { Footer } from '@/components/Footer'
import { MonsterList } from '@/components/MonsterList'
import { ErrorMessage } from '@/components/ErrorMessage'
import { useMonsters } from '@/hooks/useMonsters'
import { useTheme } from '@/hooks/useTheme'
import { useFilters } from '@/hooks/useFilters'
import { useMonsterFiltering } from '@/hooks/useMonsterFiltering'
import { convertApiMonstersToMonsters } from '@/utils/monsterConverter'
import { ITEMS_PER_PAGE, SortOption } from '@/constants/filters'

export const MonsterListPage: FC = () => {
  const navigate = useNavigate()
  const search = useSearch({ from: '/' })

  // State
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAIModal, setShowAIModal] = useState(false)

  // Custom Hooks
  const { theme, setTheme } = useTheme()
  const {
    filterElement,
    setFilterElement,
    sortOption,
    setSortOption,
    showFilters,
    setShowFilters,
    hasActiveFilters: filterHasActive,
    resetFilters,
  } = useFilters()
  const [currentPage, setCurrentPage] = useState(search.page || 1)

  // URL検索パラメータと状態を同期
  useEffect(() => {
    if (search.page && search.page !== currentPage) {
      setCurrentPage(search.page)
    }
  }, [search.page, currentPage])

  // フィルタやソートが適用されているか判定
  const hasActiveFilters = searchQuery || filterHasActive

  // API Data - サーバーサイドページネーション
  const queryParams = useMemo(
    () => ({
      limit: hasActiveFilters ? 200 : ITEMS_PER_PAGE,
      offset: hasActiveFilters ? 0 : (currentPage - 1) * ITEMS_PER_PAGE,
    }),
    [hasActiveFilters, currentPage]
  )

  const {
    monsters: apiMonsters,
    isLoading: apiLoading,
    error: apiError,
    total: apiTotal,
  } = useMonsters(queryParams)

  // Convert API monsters
  const monsters = useMemo(() => {
    return convertApiMonstersToMonsters(apiMonsters)
  }, [apiMonsters])

  // フィルタリングとページネーション
  const { filteredMonsters, totalPages, totalFilteredItems } = useMonsterFiltering({
    monsters,
    searchQuery,
    filterElement,
    sortOption,
    hasActiveFilters: !!hasActiveFilters,
    apiTotal,
    currentPage,
  })

  // Handlers
  const handleFilterChange = (element: string) => {
    setFilterElement(element)
    updatePage(1)
  }

  const handleSortChange = (option: SortOption) => {
    setSortOption(option)
    updatePage(1)
  }

  const updatePage = (page: number) => {
    setCurrentPage(page)
    navigate({
      to: '/',
      search: { page },
    })
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    updatePage(1)

    const existing = monsters.find(m => m.name === searchQuery || m.name.includes(searchQuery))
    if (existing) {
      handleSelectMonster(existing)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await GeminiService.searchMonster(searchQuery)
      if (result) {
        handleSelectMonster(result)
      } else {
        setError('該当するモンスターが見つかりませんでした。')
      }
    } catch (err) {
      setError(`データの取得中にエラーが発生しました。: ${(err as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectMonster = (monster: Monster) => {
    navigate({ to: '/$monsterId', params: { monsterId: monster.monsterId || monster.name } })
  }

  const clearSearch = () => {
    setSearchQuery('')
    setError(null)
    updatePage(1)
  }

  const handleResetFilters = () => {
    resetFilters()
    setSearchQuery('')
    updatePage(1)
  }

  return (
    <>
      <div className="flex flex-col min-h-screen transition-colors duration-500 bg-[#e6e2d3] dark:bg-[#0c0a09] dark:bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] text-stone-800 dark:text-stone-200 font-sans overflow-x-hidden selection:bg-amber-900 selection:text-amber-100">
        {/* Header */}
        <Header
          theme={theme}
          onThemeChange={setTheme}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          onSearchSubmit={handleSearch}
          onClearSearch={clearSearch}
          showBackButton={false}
        />

        {/* Filter Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <FilterBar
            filterElement={filterElement}
            onFilterChange={handleFilterChange}
            sortOption={sortOption}
            onSortChange={handleSortChange}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
            theme={theme}
          />
        </div>

        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          {/* Error Message */}
          {(error || (apiError && !axios.isCancel(apiError))) && (
            <ErrorMessage message={error || apiError?.message || 'エラーが発生しました'} />
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
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 pb-8">
                <MonsterList monsters={filteredMonsters} onResetFilters={handleResetFilters} />
              </div>

              {/* ページネーション */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={updatePage}
                totalItems={totalFilteredItems}
                itemsPerPage={ITEMS_PER_PAGE}
              />
            </>
          )}
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Floating Buttons */}
      <FloatingButtons onAskAI={() => setShowAIModal(true)} />

      {/* AI Modal */}
      <AIModal isOpen={showAIModal} onClose={() => setShowAIModal(false)} />
    </>
  )
}
