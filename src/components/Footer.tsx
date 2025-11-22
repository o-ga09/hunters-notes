import { FC } from 'react'
import { Compass, Scroll } from 'lucide-react'

export const Footer: FC = () => {
  return (
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
              記載されている情報の一部は、ギルドの観測気球(Gemini API)によって自動生成されています。
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
  )
}
