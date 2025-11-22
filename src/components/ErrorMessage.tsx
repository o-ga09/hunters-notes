import { FC } from 'react'
import { AlertCircle } from 'lucide-react'

interface ErrorMessageProps {
  message: string
}

export const ErrorMessage: FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded flex items-center gap-3 text-red-800 dark:text-red-200">
      <AlertCircle className="w-6 h-6 text-red-500" />
      <p>{message}</p>
    </div>
  )
}
