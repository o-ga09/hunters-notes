# デプロイガイド

このドキュメントでは、Hunter's NotesをCloudflare Pagesにデプロイする方法を説明します。

## 目次

- [概要](#概要)
- [事前準備](#事前準備)
- [デプロイ方法](#デプロイ方法)
  - [方法1: GitHubと連携した自動デプロイ（推奨）](#方法1-githubと連携した自動デプロイ推奨)
  - [方法2: Wrangler CLIを使用した手動デプロイ](#方法2-wrangler-cliを使用した手動デプロイ)
- [環境変数の設定](#環境変数の設定)
- [カスタムドメインの設定](#カスタムドメインの設定)
- [トラブルシューティング](#トラブルシューティング)

## 概要

Hunter's Notesは、Cloudflare Pagesを使用してホスティングされます。Cloudflare Pagesは以下の特徴があります:

- ✨ 無料枠で十分な容量（月間500ビルド、無制限のリクエスト）
- 🚀 グローバルCDNによる高速配信
- 🔒 自動HTTPS対応
- 🔄 GitHubとの統合による自動デプロイ
- 📊 プレビュー環境の自動生成

## 事前準備

### 1. Cloudflareアカウントの作成

1. [Cloudflare](https://www.cloudflare.com/)にアクセス
2. 「Sign Up」からアカウントを作成
3. メールアドレスを確認

### 2. 必要なツールのインストール

このプロジェクトでは以下のツールを使用します:

- **Node.js**: v24.10.1以上
- **pnpm**: パッケージマネージャー
- **Wrangler CLI**: Cloudflareのコマンドラインツール（package.jsonに含まれています）

```bash
# pnpmのインストール（まだの場合）
npm install -g pnpm

# プロジェクトの依存関係をインストール
pnpm install
```

### 3. Google AI APIキーの取得

AIチャット機能を使用するために、Google AI APIキーが必要です。

1. [Google AI Studio](https://aistudio.google.com/)にアクセス
2. 「Get API Key」からAPIキーを取得
3. APIキーを安全に保管

## デプロイ方法

### 方法1: GitHubと連携した自動デプロイ（推奨）

この方法では、mainブランチへのpush時に自動的にデプロイされます。

#### ステップ1: GitHubリポジトリの準備

リポジトリがGitHubにプッシュされていることを確認してください。

```bash
git push origin main
```

#### ステップ2: Cloudflare Pagesプロジェクトの作成

1. [Cloudflare Dashboard](https://dash.cloudflare.com/)にログイン
2. 左サイドバーから「Workers & Pages」を選択
3. 「Create application」→「Pages」→「Connect to Git」を選択
4. GitHubアカウントを連携
5. リポジトリ「hunters-notes」を選択

#### ステップ3: ビルド設定

以下の設定を入力します:

| 項目 | 値 |
|------|-----|
| **Project name** | `hunters-notes`（任意の名前） |
| **Production branch** | `main` |
| **Framework preset** | `Vite` |
| **Build command** | `pnpm run build` |
| **Build output directory** | `dist` |
| **Root directory (optional)** | `/` |

#### ステップ4: 環境変数の設定

「Environment variables」セクションで以下を追加:

| 変数名 | 値 |
|--------|-----|
| `NODE_VERSION` | `24` |
| `GOOGLE_AI_API_KEY` | `あなたのGoogle AI APIキー` |

**注意**: 環境変数は「Production」と「Preview」の両方に設定してください。

#### ステップ5: デプロイ

「Save and Deploy」をクリックすると、初回デプロイが開始されます。

デプロイが完了すると、以下のようなURLが発行されます:
```
https://hunters-notes.pages.dev
```

#### 自動デプロイの仕組み

設定完了後は以下のように自動デプロイされます:

- `main`ブランチへのpush → 本番環境にデプロイ
- プルリクエスト → プレビュー環境にデプロイ（自動でURLが発行される）

### 方法2: Wrangler CLIを使用した手動デプロイ

開発中やテスト用に、ローカルから直接デプロイすることもできます。

#### ステップ1: Cloudflareへのログイン

```bash
npx wrangler login
```

ブラウザが開くので、Cloudflareアカウントで認証します。

#### ステップ2: ビルド

```bash
pnpm run build
```

`dist`ディレクトリにビルド成果物が生成されます。

#### ステップ3: デプロイ

```bash
npx wrangler pages deploy dist --project-name=hunters-notes
```

初回デプロイ時は、プロジェクト名を確認されます。

#### ステップ4: 環境変数の設定（初回のみ）

Cloudflare Pagesダッシュボードから環境変数を設定します:

1. ダッシュボードで該当プロジェクトを選択
2. 「Settings」→「Environment variables」
3. `GOOGLE_AI_API_KEY`を追加

## 環境変数の設定

### 本番環境の環境変数

Cloudflare Pagesダッシュボードで設定します。

1. プロジェクトを選択
2. 「Settings」→「Environment variables」
3. 「Production」タブで変数を追加

| 変数名 | 説明 | 必須 |
|--------|------|------|
| `GOOGLE_AI_API_KEY` | Google AI APIキー | ✅ |
| `NODE_VERSION` | Node.jsバージョン（推奨: `24`） | 推奨 |

### プレビュー環境の環境変数

プルリクエストのプレビュー環境でも同じ環境変数を設定できます。

1. 「Preview」タブで変数を追加
2. 本番と同じ変数を設定（開発用のAPIキーを使用することも可能）

## カスタムドメインの設定

独自ドメインを使用する場合:

1. Cloudflare Pagesダッシュボードでプロジェクトを選択
2. 「Custom domains」タブを開く
3. 「Set up a custom domain」をクリック
4. ドメイン名を入力（例: `hunters-notes.example.com`）
5. DNSレコードを設定（Cloudflareで管理している場合は自動）

### DNSレコードの例

| Type | Name | Content |
|------|------|---------|
| CNAME | hunters-notes | hunters-notes.pages.dev |

## トラブルシューティング

### ビルドが失敗する

#### エラー: "Command not found: pnpm"

**解決策**: 環境変数に`NODE_VERSION`を設定してください。

```
NODE_VERSION=24
```

#### エラー: "Build command failed"

**解決策**: ビルドログを確認し、依存関係の問題がないか確認してください。

```bash
# ローカルでビルドを試す
pnpm install
pnpm run build
```

### 環境変数が反映されない

1. 環境変数を設定した後、再デプロイが必要です
2. 「Deployments」タブから「Retry deployment」を実行

### APIリクエストが失敗する

1. `GOOGLE_AI_API_KEY`が正しく設定されているか確認
2. APIキーの権限と有効期限を確認
3. ブラウザのコンソールでエラーメッセージを確認

### プレビュー環境が作成されない

1. GitHubとの連携が正しく設定されているか確認
2. プルリクエストのブランチが最新か確認
3. Cloudflare Pagesダッシュボードで「Enable automatic preview deployments」が有効か確認

## デプロイステータスの確認

デプロイの状態は以下の方法で確認できます:

### Cloudflare Dashboard

1. [Cloudflare Dashboard](https://dash.cloudflare.com/)にアクセス
2. 「Workers & Pages」→ プロジェクトを選択
3. 「Deployments」タブでデプロイ履歴を確認

### GitHub（自動デプロイの場合）

- コミットに✅チェックマークが表示されればデプロイ成功
- ❌の場合はCloudflareダッシュボードでログを確認

## パフォーマンス最適化

Cloudflare Pagesでは以下のような最適化が自動的に適用されます:

- 静的アセットのキャッシング
- Gzip/Brotli圧縮
- HTTP/2、HTTP/3対応
- グローバルCDNによる配信

追加の最適化が必要な場合は、`wrangler.toml`で設定を調整できます。

## サポート

- [Cloudflare Pages公式ドキュメント](https://developers.cloudflare.com/pages/)
- [Wrangler CLI公式ドキュメント](https://developers.cloudflare.com/workers/wrangler/)
- [プロジェクトのIssue](https://github.com/o-ga09/hunters-notes/issues)

---

最終更新日: 2025年11月22日
