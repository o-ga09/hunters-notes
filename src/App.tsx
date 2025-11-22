import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

// Type augmentation for View Transitions API
declare global {
  interface CSSStyleDeclaration {
    viewTransitionName: string
  }
}

// Augment React CSSProperties to support viewTransitionName in style props
declare module 'react' {
  interface CSSProperties {
    viewTransitionName?: string
  }
}

// ルーター作成
const router = createRouter({ routeTree })

// TypeScript用の型宣言
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export default function App() {
  return <RouterProvider router={router} />
}
