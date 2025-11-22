import { FC } from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  totalItems?: number
  itemsPerPage?: number
}

export const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}) => {
  if (totalPages <= 1) return null

  const getPageNumbers = (isMobile: boolean = false) => {
    const pages: (number | string)[] = []
    const maxVisible = isMobile ? 3 : 7

    if (totalPages <= maxVisible) {
      // すべてのページを表示
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // 最初のページ
      pages.push(1)

      if (isMobile) {
        // モバイル: 現在のページ前後1ページのみ表示
        if (currentPage > 2) {
          pages.push('...')
        }
        if (currentPage > 1 && currentPage < totalPages) {
          pages.push(currentPage)
        }
        if (currentPage < totalPages - 1) {
          pages.push('...')
        }
        pages.push(totalPages)
      } else {
        // デスクトップ: 従来の表示
        if (currentPage <= 3) {
          // 現在のページが最初の方
          for (let i = 2; i <= 4; i++) {
            pages.push(i)
          }
          pages.push('...')
          pages.push(totalPages)
        } else if (currentPage >= totalPages - 2) {
          // 現在のページが最後の方
          pages.push('...')
          for (let i = totalPages - 3; i <= totalPages; i++) {
            pages.push(i)
          }
        } else {
          // 現在のページが中間
          pages.push('...')
          pages.push(currentPage - 1)
          pages.push(currentPage)
          pages.push(currentPage + 1)
          pages.push('...')
          pages.push(totalPages)
        }
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()
  const mobilePageNumbers = getPageNumbers(true)

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      {/* ページ情報 */}
      {totalItems !== undefined && itemsPerPage !== undefined && (
        <div className="text-sm text-stone-600 dark:text-stone-500 font-mincho">
          全{totalItems.toLocaleString()}件中{' '}
          {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems).toLocaleString()}-
          {Math.min(currentPage * itemsPerPage, totalItems).toLocaleString()}件を表示
        </div>
      )}

      {/* デスクトップ用ページネーション */}
      <div className="hidden sm:flex items-center gap-2">
        {/* 最初のページへ */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={`p-2 rounded border transition-all ${
            currentPage === 1
              ? 'bg-stone-200 dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-400 dark:text-stone-600 cursor-not-allowed'
              : 'bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 hover:border-yellow-600'
          }`}
          aria-label="最初のページへ"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* 前のページへ */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded border transition-all ${
            currentPage === 1
              ? 'bg-stone-200 dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-400 dark:text-stone-600 cursor-not-allowed'
              : 'bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 hover:border-yellow-600'
          }`}
          aria-label="前のページへ"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* ページ番号 */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 py-1 text-stone-600 dark:text-stone-500"
                >
                  ...
                </span>
              )
            }

            const pageNum = page as number
            const isActive = pageNum === currentPage

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`min-w-[40px] px-3 py-2 rounded border font-cinzel text-sm transition-all ${
                  isActive
                    ? 'bg-yellow-700 dark:bg-yellow-600 border-yellow-600 dark:border-yellow-500 text-white shadow-md scale-105'
                    : 'bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 hover:border-yellow-600'
                }`}
              >
                {pageNum}
              </button>
            )
          })}
        </div>

        {/* 次のページへ */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded border transition-all ${
            currentPage === totalPages
              ? 'bg-stone-200 dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-400 dark:text-stone-600 cursor-not-allowed'
              : 'bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 hover:border-yellow-600'
          }`}
          aria-label="次のページへ"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* 最後のページへ */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded border transition-all ${
            currentPage === totalPages
              ? 'bg-stone-200 dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-400 dark:text-stone-600 cursor-not-allowed'
              : 'bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 hover:border-yellow-600'
          }`}
          aria-label="最後のページへ"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>

      {/* モバイル用ページネーション */}
      <div className="flex sm:hidden items-center gap-1">
        {/* 前のページへ */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded border transition-all ${
            currentPage === 1
              ? 'bg-stone-200 dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-400 dark:text-stone-600 cursor-not-allowed'
              : 'bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 hover:border-yellow-600 active:scale-95'
          }`}
          aria-label="前のページへ"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* ページ番号（コンパクト） */}
        <div className="flex items-center gap-1">
          {mobilePageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-1 text-stone-600 dark:text-stone-500 text-xs"
                >
                  ...
                </span>
              )
            }

            const pageNum = page as number
            const isActive = pageNum === currentPage

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`min-w-[36px] px-2 py-1.5 rounded border font-cinzel text-xs transition-all ${
                  isActive
                    ? 'bg-yellow-700 dark:bg-yellow-600 border-yellow-600 dark:border-yellow-500 text-white shadow-md'
                    : 'bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 hover:border-yellow-600 active:scale-95'
                }`}
              >
                {pageNum}
              </button>
            )
          })}
        </div>

        {/* 次のページへ */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded border transition-all ${
            currentPage === totalPages
              ? 'bg-stone-200 dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-400 dark:text-stone-600 cursor-not-allowed'
              : 'bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 hover:border-yellow-600 active:scale-95'
          }`}
          aria-label="次のページへ"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
