import { useState } from 'react'
import { SortOption } from '@/constants/filters'

export const useFilters = () => {
  const [filterElement, setFilterElement] = useState<string>('All')
  const [sortOption, setSortOption] = useState<SortOption>('default')
  const [showFilters, setShowFilters] = useState(false)

  const hasActiveFilters = filterElement !== 'All' || sortOption !== 'default'

  const resetFilters = () => {
    setFilterElement('All')
    setSortOption('default')
  }

  return {
    filterElement,
    setFilterElement,
    sortOption,
    setSortOption,
    showFilters,
    setShowFilters,
    hasActiveFilters,
    resetFilters,
  }
}
