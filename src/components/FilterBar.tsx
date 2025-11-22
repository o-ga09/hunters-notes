import { FC } from 'react'
import { Filter, ArrowDownUp } from 'lucide-react'
import { ELEMENT_CONFIG, SortOption } from '@/constants/filters'

interface FilterBarProps {
  filterElement: string
  onFilterChange: (element: string) => void
  sortOption: SortOption
  onSortChange: (option: SortOption) => void
  showFilters: boolean
  onToggleFilters: () => void
  theme: string
}

export const FilterBar: FC<FilterBarProps> = ({
  filterElement,
  onFilterChange,
  sortOption,
  onSortChange,
  showFilters,
  onToggleFilters,
  theme,
}) => {
  return (
    <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-stone-300 dark:border-stone-800 pt-2">
      {/* Mobile Filter Toggle Label */}
      <div className="flex items-center justify-between w-full sm:w-auto sm:hidden">
        <button
          onClick={onToggleFilters}
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
                  onClick={() => onFilterChange(key)}
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
              onChange={e => onSortChange(e.target.value as SortOption)}
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
  )
}
