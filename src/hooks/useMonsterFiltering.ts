import { useState, useMemo } from 'react'
import { Monster } from '@/lib/types'
import { SortOption, ITEMS_PER_PAGE, TEMPORARY_TOTAL_MONSTERS } from '@/constants/filters'

interface UseMonsterFilteringParams {
  monsters: Monster[]
  searchQuery: string
  filterElement: string
  sortOption: SortOption
  hasActiveFilters: boolean
  apiTotal?: number
}

export const useMonsterFiltering = ({
  monsters,
  searchQuery,
  filterElement,
  sortOption,
  hasActiveFilters,
  apiTotal,
}: UseMonsterFilteringParams) => {
  const [currentPage, setCurrentPage] = useState(1)

  // フィルタとソートを適用
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
            return a.threatLevel - b.threatLevel
          case 'name_asc':
            return a.name.localeCompare(b.name, 'ja')
          default:
            return 0
        }
      })
  }, [monsters, searchQuery, filterElement, sortOption])

  // ページネーション計算
  const totalFilteredItems = hasActiveFilters
    ? allFilteredMonsters.length
    : apiTotal && apiTotal > ITEMS_PER_PAGE
      ? apiTotal
      : TEMPORARY_TOTAL_MONSTERS

  const totalPages = Math.ceil(totalFilteredItems / ITEMS_PER_PAGE)

  // 現在のページに表示するデータ
  const filteredMonsters = hasActiveFilters
    ? allFilteredMonsters.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
    : monsters

  return {
    filteredMonsters,
    currentPage,
    setCurrentPage,
    totalPages,
    totalFilteredItems,
  }
}
