import React, { FC } from 'react'
import { Search, BookOpen, X, Compass, Sun, Moon } from 'lucide-react'
import { Theme } from '@/constants/filters'

interface HeaderProps {
  theme: Theme
  onThemeChange: (theme: Theme) => void
  searchQuery: string
  onSearchQueryChange: (query: string) => void
  onSearchSubmit: (e: React.FormEvent) => void
  onClearSearch: () => void
  onBack?: () => void
  showBackButton?: boolean
}

export const Header: FC<HeaderProps> = ({
  theme,
  onThemeChange,
  searchQuery,
  onSearchQueryChange,
  onSearchSubmit,
  onClearSearch,
  onBack,
  showBackButton = false,
}) => {
  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onThemeChange(e.target.value as Theme)
  }

  return (
    <header className="sticky top-0 z-50 border-b-4 border-yellow-900/50 dark:border-yellow-900 bg-[#f5f2eb]/95 dark:bg-stone-900/95 backdrop-blur-md shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4 h-14">
          {/* Logo Area */}
          <div
            className="flex items-center gap-3 cursor-pointer group shrink-0"
            onClick={showBackButton ? onBack : undefined}
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
              onSubmit={onSearchSubmit}
              className="relative group flex-1 max-w-[240px] sm:max-w-xs"
            >
              <div className="relative flex items-center bg-stone-200/50 dark:bg-stone-950/50 rounded border border-stone-400 dark:border-stone-700 focus-within:border-yellow-600 transition-colors shadow-inner">
                <Search className="w-4 h-4 text-stone-500 ml-3 absolute left-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => onSearchQueryChange(e.target.value)}
                  placeholder="検索..."
                  className="w-full bg-transparent border-none focus:ring-0 text-sm sm:text-base pl-9 pr-8 py-1.5 text-stone-800 dark:text-stone-100 placeholder-stone-500 dark:placeholder-stone-600 font-mincho"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={onClearSearch}
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
      </div>
    </header>
  )
}
