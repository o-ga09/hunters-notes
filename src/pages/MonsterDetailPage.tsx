import { FC, useMemo } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Monster } from '@/lib/types'
import { MonsterDetail } from '@/components/MonsterDetail'
import { Loader } from '@/components/Loader'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ErrorMessage } from '@/components/ErrorMessage'
import { useMonsters } from '@/hooks/useMonsters'
import { useTheme } from '@/hooks/useTheme'
import { convertApiMonstersToMonsters } from '@/utils/monsterConverter'

export const MonsterDetailPage: FC = () => {
  const { monsterId } = useParams({ strict: false })
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()

  // 全モンスターを取得（詳細情報のため）
  const {
    monsters: apiMonsters,
    isLoading: apiLoading,
    error: apiError,
  } = useMonsters({ limit: 200, offset: 0 })

  // Convert API monsters
  const monsters = useMemo(() => {
    return convertApiMonstersToMonsters(apiMonsters)
  }, [apiMonsters])

  // URLパラメータからモンスターを検索（IDまたは名前で）
  const selectedMonster = useMemo(() => {
    if (!monsterId) return null
    const decodedId = decodeURIComponent(monsterId)
    // まずIDで検索、見つからなければ名前で検索（後方互換性のため）
    return monsters.find((m: Monster) => m.monsterId === decodedId || m.name === decodedId)
  }, [monsters, monsterId])

  const handleBack = () => {
    navigate({ to: '/' })
  }

  return (
    <div className="flex flex-col min-h-screen transition-colors duration-500 bg-[#e6e2d3] dark:bg-[#0c0a09] dark:bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] text-stone-800 dark:text-stone-200 font-sans overflow-x-hidden selection:bg-amber-900 selection:text-amber-100">
      {/* Header */}
      <Header
        theme={theme}
        onThemeChange={setTheme}
        searchQuery=""
        onSearchQueryChange={() => {}}
        onSearchSubmit={() => {}}
        onClearSearch={() => {}}
        onBack={handleBack}
        showBackButton={true}
      />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Loading State */}
        {apiLoading && (
          <div className="flex flex-col items-center justify-center py-20 h-full">
            <Loader />
            <p className="mt-6 text-yellow-800 dark:text-yellow-600 font-cinzel animate-pulse text-lg">
              Accessing Guild Archives...
            </p>
          </div>
        )}

        {/* Error State */}
        {apiError && <ErrorMessage message={apiError?.message || 'エラーが発生しました'} />}

        {/* Monster Not Found */}
        {!apiLoading && !apiError && !selectedMonster && (
          <div className="flex flex-col items-center justify-center py-20">
            <ErrorMessage message="モンスターが見つかりませんでした。" />
            <button
              onClick={handleBack}
              className="mt-6 text-stone-600 dark:text-stone-500 hover:text-yellow-700 dark:hover:text-yellow-500 flex items-center gap-2 transition-colors font-cinzel text-sm font-bold"
            >
              <ArrowLeft className="w-4 h-4" /> BACK TO LIST
            </button>
          </div>
        )}

        {/* Monster Detail */}
        {!apiLoading && !apiError && selectedMonster && (
          <div className="animate-fadeIn">
            <button
              onClick={handleBack}
              className="mb-6 text-stone-600 dark:text-stone-500 hover:text-yellow-700 dark:hover:text-yellow-500 flex items-center gap-2 transition-colors font-cinzel text-sm font-bold"
            >
              <ArrowLeft className="w-4 h-4" /> BACK TO LIST
            </button>
            <MonsterDetail monster={selectedMonster} />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
