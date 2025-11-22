import { useState } from 'react'
import { X, Send, Loader2 } from 'lucide-react'
import { GeminiService } from '../services/gemin'
import { Monster } from '../lib/types'

interface AIModalProps {
  isOpen: boolean
  onClose: () => void
  onMonsterFound: (monster: Monster) => void
}

export const AIModal: React.FC<AIModalProps> = ({ isOpen, onClose, onMonsterFound }) => {
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return

    setLoading(true)
    setError(null)

    try {
      const result = await GeminiService.searchMonster(question)
      if (result) {
        onMonsterFound(result)
        onClose()
        setQuestion('')
      } else {
        setError('該当するモンスターが見つかりませんでした。')
      }
    } catch (err) {
      setError('データの取得中にエラーが発生しました。')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#f5f2eb] dark:bg-stone-900 rounded-lg shadow-2xl border-4 border-yellow-900/50 dark:border-yellow-900 max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="bg-yellow-900/10 dark:bg-yellow-900/20 border-b-2 border-yellow-900/30 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-cinzel font-bold text-yellow-800 dark:text-yellow-500">
            AI HUNTER ASSISTANT
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-stone-200 dark:hover:bg-stone-800 rounded transition-colors"
            aria-label="閉じる"
          >
            <X className="w-6 h-6 text-stone-600 dark:text-stone-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-stone-600 dark:text-stone-400 font-mincho mb-4">
            モンスターについて質問してください。AIがギルドのアーカイブから情報を検索します。
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <textarea
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="例: リオレウスの弱点は？"
                className="w-full h-32 px-4 py-3 bg-stone-200/50 dark:bg-stone-950/50 border-2 border-stone-300 dark:border-stone-700 rounded focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600/20 outline-none text-stone-800 dark:text-stone-200 placeholder-stone-500 dark:placeholder-stone-600 font-mincho resize-none"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded text-red-800 dark:text-red-200 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 dark:bg-yellow-700 dark:hover:bg-yellow-600 text-white font-bold rounded border-2 border-yellow-800 dark:border-yellow-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  検索中...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  AIに聞く
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
