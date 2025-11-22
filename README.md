# Hunter's Notes - ハンターズノート

モンスタハンターの狩猟に役立つ知識がまとまる狩猟記録です。

## 機能

- モンスタ一覧
  - 検索
  - 絞り込み
  - 並び替え
- モンスター詳細
- AIにきく

## 構成

|名称|バージョン|
|---|---|
|React|19.2.0|
|TypeScript|5.9.3|
|vite|7.2.4|
|eslint|9.39.1|
|nodejs|24.10.1|
|Tailwind CSS|4.1.17|
|PostCSS|8.5.6|
|Autoprefixer|10.4.22|
|Prettier|3.6.2|

## Get Started

環境変数

```bash
export GOOGLE_AI_API_KEY="YOUR_GOOGLE_API_KEY"
```

開発環境起動

```bash
$ pnpm run dev
```

ビルド

```bash
$ pnpm run build
```

lint/format

```bash
$ pnpm run lint
$ pnpm run format
```

## デプロイ

このプロジェクトは **Cloudflare Pages** にデプロイされています。

### 事前準備

1. Cloudflareアカウントの作成
   - [Cloudflare](https://www.cloudflare.com/) でアカウントを作成
   - Workers & Pages のダッシュボードにアクセス

2. Wrangler CLIのインストール（既にpackage.jsonに含まれています）
   ```bash
   pnpm install
   ```

3. Cloudflareへのログイン
   ```bash
   npx wrangler login
   ```

4. 環境変数の設定
   - Cloudflare Pagesダッシュボードで環境変数を設定
   - `GOOGLE_AI_API_KEY`: Google AI APIキー

### デプロイ方法

詳細なデプロイ手順については、[デプロイガイド](./docs/DEPLOY.md)を参照してください。

#### ローカルからのデプロイ

```bash
# ビルド
pnpm run build

# Cloudflare Pagesへデプロイ
npx wrangler pages deploy dist --project-name=hunters-notes
```

#### 自動デプロイ（推奨）

GitHubリポジトリをCloudflare Pagesに接続すると、mainブランチへのpush時に自動デプロイされます。

1. Cloudflare Pagesダッシュボードで「Create a project」
2. GitHubリポジトリを接続
3. ビルド設定:
   - **Build command**: `pnpm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/`
   - **Environment variables**: `GOOGLE_AI_API_KEY`を設定
