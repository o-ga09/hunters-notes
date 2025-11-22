---
description: コーディング規約
applyTo: '**'
---

# React + Vite コーディング規約

## 1. プロジェクト構成

### ディレクトリ構造

```
src/
├── assets/          # 静的ファイル（画像、フォントなど）
├── components/      # 再利用可能なコンポーネント
│   ├── ui/         # 汎用UIコンポーネント
│   └── features/   # 機能固有のコンポーネント
├── hooks/          # カスタムフック
├── pages/          # ページコンポーネント
├── services/       # API通信、外部サービス連携
├── utils/          # ユーティリティ関数
├── types/          # TypeScript型定義
├── constants/      # 定数定義
├── styles/         # グローバルスタイル
├── App.tsx
└── main.tsx
```

### ファイル命名規則

- **コンポーネント**: PascalCase（例：`UserProfile.tsx`）
- **フック**: camelCaseで`use`プレフィックス（例：`useAuth.ts`）
- **ユーティリティ**: camelCase（例：`formatDate.ts`）
- **定数**: UPPER_SNAKE_CASE（例：`API_ENDPOINTS.ts`）
- **型定義**: PascalCaseで`.types.ts`サフィックス（例：`User.types.ts`）

## 2. TypeScript

### 必須設定

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### 型定義のベストプラクティス

```typescript
// ❌ 悪い例
const user: any = { name: '太郎' }

// ✅ 良い例
interface User {
  id: string
  name: string
  email: string
}
const user: User = { id: '1', name: '太郎', email: 'taro@example.com' }

// Props型定義
interface ButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary'
}

// 型推論を活用
const numbers = [1, 2, 3] // number[]型として推論される
```

## 3. コンポーネント設計

### 関数コンポーネントの基本形

```typescript
import { FC } from 'react';

interface UserCardProps {
  name: string;
  email: string;
  onEdit?: () => void;
}

export const UserCard: FC<UserCardProps> = ({ name, email, onEdit }) => {
  return (
    <div className="user-card">
      <h3>{name}</h3>
      <p>{email}</p>
      {onEdit && <button onClick={onEdit}>編集</button>}
    </div>
  );
};
```

### コンポーネント分割の原則

- **単一責任の原則**: 1つのコンポーネントは1つの責務のみ
- **50行ルール**: 1コンポーネント50行以内を目安に分割を検討
- **Presentational/Container分離**: ロジックと表示を分離

```typescript
// ❌ 悪い例: ロジックと表示が混在
const UserList = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch('/api/users').then(res => res.json()).then(setUsers);
  }, []);

  return <div>{users.map(u => <div>{u.name}</div>)}</div>;
};

// ✅ 良い例: カスタムフックで分離
const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(setUsers);
  }, []);

  return users;
};

const UserList: FC = () => {
  const users = useUsers();
  return (
    <div>
      {users.map(user => <UserCard key={user.id} {...user} />)}
    </div>
  );
};
```

## 4. Hooks

### カスタムフックのルール

- 必ず`use`プレフィックスを付ける
- トップレベルでのみ呼び出す
- 条件分岐やループ内で使用しない

```typescript
// ✅ 良い例: 再利用可能なカスタムフック
const useFetch = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url)
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url])

  return { data, loading, error }
}
```

### useEffectの依存配列

```typescript
// ❌ 悪い例: 依存配列の省略
useEffect(() => {
  fetchData()
}) // 無限ループの可能性

// ✅ 良い例: 依存配列を明示
useEffect(() => {
  fetchData()
}, [fetchData])

// useCallbackで関数をメモ化
const fetchData = useCallback(async () => {
  const data = await api.getData(userId)
  setData(data)
}, [userId])
```

## 5. パフォーマンス最適化

### メモ化の活用

```typescript
// React.memo: 不要な再レンダリングを防ぐ
export const ExpensiveComponent = memo<Props>(({ data }) => {
  return <div>{/* 重い処理 */}</div>;
});

// useMemo: 計算結果のメモ化
const sortedList = useMemo(() => {
  return data.sort((a, b) => a.value - b.value);
}, [data]);

// useCallback: 関数のメモ化
const handleClick = useCallback(() => {
  console.log('clicked');
}, []);
```

### 遅延ローディング

```typescript
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

const App = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <HeavyComponent />
  </Suspense>
);
```

## 6. データフェッチ（Orval + TanStack Query）

### Orvalによるクライアント生成

```yaml
# orval.config.ts
export default {
  petstore: {
    input: './openapi.yaml', // または './openapi.json'
    output: {
      mode: 'tags-split',
      target: './src/services/api/generated',
      client: 'react-query',
      override: {
        mutator: {
          path: './src/services/api/custom-instance.ts',
          name: 'customInstance',
        },
      },
    },
  },
};
```

### カスタムAxiosインスタンス

```typescript
// src/services/api/custom-instance.ts
import Axios, { AxiosRequestConfig } from 'axios'

export const AXIOS_INSTANCE = Axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// リクエストインターセプター: 認証トークン追加
AXIOS_INSTANCE.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// レスポンスインターセプター: エラーハンドリング
AXIOS_INSTANCE.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // 認証エラー時の処理
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  return AXIOS_INSTANCE.request<T>(config).then(({ data }) => data)
}
```

### TanStack Queryのセットアップ

```typescript
// src/main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5分
      gcTime: 10 * 60 * 1000, // 10分
    },
    mutations: {
      retry: 0,
    },
  },
});

root.render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
```

### 生成されたフックの使用

```typescript
// ❌ 悪い例: useEffectで直接fetch
const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  return <div>{users.map(u => <div key={u.id}>{u.name}</div>)}</div>;
};

// ✅ 良い例: Orval生成フックを使用
import { useGetUsers } from '@/services/api/generated/users';

const UserList: FC = () => {
  const { data, isLoading, isError, error } = useGetUsers();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.map(user => (
        <UserCard key={user.id} {...user} />
      ))}
    </div>
  );
};
```

### パラメータ付きクエリ

```typescript
import { useGetUserById } from '@/services/api/generated/users';

const UserProfile: FC<{ userId: string }> = ({ userId }) => {
  const { data: user, isLoading } = useGetUserById(userId, {
    // オプション設定
    enabled: !!userId, // userIdが存在する場合のみ実行
    staleTime: 10 * 60 * 1000, // このクエリのみ10分
    refetchInterval: 30000, // 30秒ごとに再取得
  });

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
};
```

### ミューテーション（作成・更新・削除）

```typescript
import { useCreateUser, useUpdateUser, useDeleteUser } from '@/services/api/generated/users';
import { useQueryClient } from '@tanstack/react-query';

const UserForm: FC = () => {
  const queryClient = useQueryClient();

  // 作成
  const createMutation = useCreateUser({
    onSuccess: (data) => {
      // キャッシュを無効化して再取得
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('ユーザーを作成しました');
    },
    onError: (error) => {
      toast.error(`エラー: ${error.message}`);
    },
  });

  // 更新
  const updateMutation = useUpdateUser({
    onSuccess: (data, variables) => {
      // 特定のユーザーキャッシュを更新
      queryClient.setQueryData(['user', variables.id], data);
      // またはリスト全体を無効化
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // 削除
  const deleteMutation = useDeleteUser({
    onMutate: async (userId) => {
      // Optimistic Update: 削除前にUIを更新
      await queryClient.cancelQueries({ queryKey: ['users'] });
      const previousUsers = queryClient.getQueryData(['users']);

      queryClient.setQueryData(['users'], (old: User[]) =>
        old.filter(user => user.id !== userId)
      );

      return { previousUsers };
    },
    onError: (err, userId, context) => {
      // エラー時はロールバック
      if (context?.previousUsers) {
        queryClient.setQueryData(['users'], context.previousUsers);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleSubmit = (formData: CreateUserRequest) => {
    createMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* フォームフィールド */}
      <button
        type="submit"
        disabled={createMutation.isPending}
      >
        {createMutation.isPending ? '送信中...' : '作成'}
      </button>
    </form>
  );
};
```

### カスタムフックでのラッピング

```typescript
// src/hooks/useUsers.ts
import { useGetUsers, useCreateUser } from '@/services/api/generated/users';
import { useQueryClient } from '@tanstack/react-query';

export const useUsers = () => {
  const queryClient = useQueryClient();

  const usersQuery = useGetUsers();

  const createUser = useCreateUser({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return {
    users: usersQuery.data ?? [],
    isLoading: usersQuery.isLoading,
    error: usersQuery.error,
    createUser: createUser.mutate,
    isCreating: createUser.isPending,
  };
};

// 使用例
const UserList: FC = () => {
  const { users, isLoading, createUser, isCreating } = useUsers();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {users.map(user => <UserCard key={user.id} {...user} />)}
      <button
        onClick={() => createUser({ name: 'New User', email: 'new@example.com' })}
        disabled={isCreating}
      >
        ユーザー追加
      </button>
    </div>
  );
};
```

### ページネーションと無限スクロール

```typescript
// ページネーション
import { useGetUsers } from '@/services/api/generated/users';

const UserListPaginated: FC = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetUsers({
    page,
    limit: 20,
  });

  return (
    <div>
      {data?.items.map(user => <UserCard key={user.id} {...user} />)}
      <Pagination
        current={page}
        total={data?.total}
        onChange={setPage}
      />
    </div>
  );
};

// 無限スクロール
import { useInfiniteQuery } from '@tanstack/react-query';
import { getUsers } from '@/services/api/generated/users';

const UserListInfinite: FC = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['users', 'infinite'],
    queryFn: ({ pageParam = 1 }) => getUsers({ page: pageParam, limit: 20 }),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  return (
    <div>
      {data?.pages.map((page, i) => (
        <div key={i}>
          {page.items.map(user => <UserCard key={user.id} {...user} />)}
        </div>
      ))}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? '読み込み中...' : 'もっと見る'}
        </button>
      )}
    </div>
  );
};
```

### プリフェッチとキャッシュ戦略

```typescript
import { useQueryClient } from '@tanstack/react-query';
import { getUserById } from '@/services/api/generated/users';

const UserListItem: FC<{ userId: string }> = ({ userId }) => {
  const queryClient = useQueryClient();

  // ホバー時にプリフェッチ
  const handleMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: ['user', userId],
      queryFn: () => getUserById(userId),
      staleTime: 60000, // 1分間はフレッシュとみなす
    });
  };

  return (
    <div onMouseEnter={handleMouseEnter}>
      <Link to={`/users/${userId}`}>ユーザー詳細</Link>
    </div>
  );
};
```

### エラーハンドリングとリトライ戦略

```typescript
const UserProfile: FC<{ userId: string }> = ({ userId }) => {
  const { data, isLoading, isError, error, refetch } = useGetUserById(userId, {
    retry: (failureCount, error) => {
      // 404の場合はリトライしない
      if (error.response?.status === 404) return false;
      // それ以外は3回までリトライ
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => {
      // 指数バックオフ: 1秒、2秒、4秒
      return Math.min(1000 * 2 ** attemptIndex, 30000);
    },
  });

  if (isLoading) return <Spinner />;

  if (isError) {
    return (
      <ErrorMessage
        message={error.message}
        onRetry={refetch}
      />
    );
  }

  return <UserDetails user={data} />;
};
```

### ベストプラクティスまとめ

1. **キャッシュキーの命名規則**: `['resource', id, params]`の形式で統一
2. **Optimistic Updates**: UX向上のため、成功が予想される操作で使用
3. **エラーバウンダリー**: クエリエラーは個別にハンドリング、予期しないエラーはError Boundaryで捕捉
4. **staleTimeとgcTimeの調整**: データの性質に応じて適切に設定
5. **無効化戦略**: 関連するキャッシュを適切に無効化（細かすぎず、粗すぎず）
6. **ローディング状態の統一**: `isLoading`、`isFetching`、`isPending`を適切に使い分け
7. **型安全性**: Orval生成の型を活用し、型アサーションを避ける

## 7. 状態管理

### ローカルステート優先

- **サーバー状態**: TanStack Queryで管理
- **UIステート**: `useState`で管理
- 複雑になったら`useReducer`
- グローバル化はContextまたは外部ライブラリ

```typescript
// シンプルな状態管理
const [count, setCount] = useState(0)

// 複雑な状態はuseReducer
type State = { count: number; text: string }
type Action = { type: 'increment' } | { type: 'setText'; payload: string }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1 }
    case 'setText':
      return { ...state, text: action.payload }
    default:
      return state
  }
}

const [state, dispatch] = useReducer(reducer, { count: 0, text: '' })
```

## 8. エラーハンドリング

### Error Boundary

```typescript
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>エラーが発生しました</div>;
    }
    return this.props.children;
  }
}
```

## 9. スタイリング

### CSS Modulesの使用

```typescript
import styles from './Button.module.css';

export const Button: FC<Props> = ({ label }) => {
  return <button className={styles.button}>{label}</button>;
};
```

### Tailwind CSSの場合

```typescript
// クラス名の条件付き適用
import clsx from 'clsx';

const Button: FC<Props> = ({ variant, disabled }) => {
  return (
    <button
      className={clsx(
        'px-4 py-2 rounded',
        variant === 'primary' && 'bg-blue-500 text-white',
        variant === 'secondary' && 'bg-gray-200 text-gray-800',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      Click me
    </button>
  );
};
```

## 10. テスト

### コンポーネントテスト

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Button } from './Button';

// TanStack Query使用コンポーネントのテスト用ラッパー
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const testQueryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={testQueryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('Button', () => {
  it('クリックイベントが発火する', () => {
    const handleClick = vi.fn();
    render(<Button label="Click" onClick={handleClick} />);

    const button = screen.getByRole('button', { name: 'Click' });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

// データフェッチを使用するコンポーネントのテスト
describe('UserList', () => {
  it('ユーザーリストを表示する', async () => {
    const testQueryClient = createTestQueryClient();

    // APIレスポンスをモック
    testQueryClient.setQueryData(['users'], [
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' },
    ]);

    render(
      <QueryClientProvider client={testQueryClient}>
        <UserList />
      </QueryClientProvider>
    );

    expect(await screen.findByText('Alice')).toBeInTheDocument();
    expect(await screen.findByText('Bob')).toBeInTheDocument();
  });
});
```

## 11. 環境変数

### Viteでの環境変数

```typescript
// .env
VITE_API_URL=https://api.example.com

// 使用方法
const apiUrl = import.meta.env.VITE_API_URL;

// 型安全性のための定義
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}
```

## 12. コードフォーマット

### ESLint + Prettier設定

```json
// .eslintrc.json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  "rules": {
    "react-hooks/exhaustive-deps": "warn",
    "@typescript-eslint/no-unused-vars": "error"
  }
}
```

## 13. コミットメッセージ

### Conventional Commits形式

```
feat: 新機能追加
fix: バグ修正
docs: ドキュメント更新
style: コードフォーマット
refactor: リファクタリング
test: テスト追加・修正
chore: ビルド設定など

例：
feat: ユーザー認証機能を追加
fix: ログイン時のエラーハンドリングを修正
```

## まとめ

このコーディング規約は、Orval + TanStack Queryによる型安全なデータフェッチを含む、保守性・拡張性・可読性の高いReactアプリケーション開発を支援するものです。

### データフェッチの鉄則

- **サーバー状態はTanStack Query**、UIステートはuseState
- **Orval生成のクライアント**を必ず使用し、手動でaxiosを呼ばない
- **キャッシュ戦略**を適切に設定し、不要なリクエストを削減
- **楽観的更新**でUXを向上させる

チームの状況に応じて適宜カスタマイズしてください。
