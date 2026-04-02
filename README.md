## SecondPath Frontend

**Next.js 16 (App Router) × React 19 × TypeScript** で構築したフロントエンドです。  
ユーザー向けダッシュボードと管理者向けダッシュボードを持ち、API サーバーと連携して動作します。

### 概要

- **ユーザー向け機能（Dashboard）**: ホーム、設定、記事、テキスト相談、日報、各種アセスメント（PHQ-9 / レジリエンス / 思考の癖）など
- **管理者向け機能（Admin）**: ユーザー一覧・詳細、カルテ（記録）管理、問い合わせ（テキスト相談）管理、メモ管理、投稿管理など

### 技術スタック

- **Frontend**: Next.js `16.1.6`（App Router）, React `19.2.3`, TypeScript
- **Auth**: Supabase（`@supabase/supabase-js`, `@supabase/ssr`）
- **API 通信**:
  - **Client**: Axios（`src/api/client.ts`）
  - **Server (RSC)**: `fetch` ラッパー（`src/api/serverFetch.ts`）
- **Styling**: CSS Modules（`*.module.css`）
- **品質管理**: ESLint / Prettier / Stylelint
- **テスト**: Vitest（単体） / Playwright（結合・E2E）

### アーキテクチャ（このリポジトリで意識していること）

- **Feature ベース構成**: 画面・API・コンポーネントを `src/features/**` に集約
- **Server / Client 分離**:
  - 初期表示データは **Server Component** で `await` して取得
  - インタラクションは **Client Component** で扱う（フォーム送信、モーダル、楽観的更新など）
- **UX（体感速度）**:
  - ルート遷移・RSC 待ちで **全画面スピナ**（`RouteLoading` / `loading.tsx`）を表示
  - 一部操作は **Optimistic UI**（例: 管理メモ、テキスト相談送信）
- **ユーザー識別**:
  - Supabase セッションに連動して `user_uuid` Cookie を更新し、Server 側の API でもユーザー特定できるようにしています

### ディレクトリ構成（抜粋）

```txt
src/
  app/                       # Next.js App Router（route wrapper）
  features/                  # feature 単位の実装（Page / Client / api / components）
  api/                       # 共通 API（axios client / server fetch）
  components/                # 共有 UI（RouteLoading/Error/NotFound 等）
```

### 開発手順

#### 前提

- Node.js（推奨: Node 20+）

#### インストール

```bash
npm install
```

#### 開発サーバー起動

このプロジェクトは **`3001`** で起動します。

```bash
npm run dev
```

#### ビルド

```bash
npm run build
```

#### Docker（コンテナ起動）

このプロジェクトは `docker-compose.yml` を用意しています。

```bash
docker compose build
docker compose up
```

- **アクセス**: `http://localhost:3001`

#### テスト

- **単体（Vitest）**: 日報作成画面の入力・保存を例に `src/**/*.test.tsx` で検証

```bash
npm run test
```

- **結合（Playwright）**: ブラウザで `/diaries` の認証ガードと、任意でログイン後フローを検証

初回のみ Chromium を `node_modules` 配下に取得（`PLAYWRIGHT_BROWSERS_PATH=0` でパスを固定）:

```bash
npm run playwright:install
```

```bash
npm run test:e2e
```

ログインまで含む E2E は、リポジトリ直下の **`.env.e2e`** に `E2E_USER_EMAIL` / `E2E_USER_PASSWORD` を書いて実行します（`.env*` は git 対象外）。未設定のときはログイン込みテストは skip されます。雛形は `.env.e2e.example` を参照してください。

### 設計判断（なぜこうしているか）

- **Feature ベースに寄せた理由**: 画面・API・型を feature 単位で閉じ、変更の影響範囲を小さくするため
- **Server/Client を分ける理由**: 初期表示は RSC でデータ取得まで完結させ、クライアントは UI 操作に集中させるため
- **Server 側は `fetch` を使う理由**: RSC でのデータ取得ルール（ヘッダー付与、エラーハンドリング等）を `serverFetchJson` に集約するため

### トレードオフ（採らなかった選択肢）

- **Server Actions（`'use server'`）は現状未採用**: API サーバーが別にあるため、導入しても「Next（BFF）→ API」の中継になりやすい。フォーム状態管理を統一したい場合は `action.ts` を feature 単位で追加する余地はあります。
- **サーバー fetch のキャッシュは基本 `no-store`**: “更新されない＝バグに見える”状況を避けることを優先しています（必要な箇所だけ段階的に再導入できる設計）。

### 技術的な難所と対処（例）

- **`/login` ↔ `/home` の無限ループ**: localStorage だけで判定するとズレるため、Supabase のセッションを基準にログイン判定を揃えました。
- **遷移時ローディングが出ない**: `loading.tsx`（RSC）に加えて、クライアント遷移の開始/完了も拾って全画面スピナを出すようにしました。
- **管理画面で `undefined` が URL に混ざる**: Server→Client の受け渡し形式を統一し、`params` を Promise で渡して Client 側で `use(params)` する形に揃えました。

### AI 活用ポリシー

AI は「コード生成」だけでなく、**設計の比較・リスク洗い出し・差分レビュー**に使います。最終的な判断と品質担保は人間側で行います。

- **原則**:
  - 仕様→設計→実装→lint/build の順で検証する
  - “動いた” だけで終えず、例外系（401 / params 欠落 / 重複データ等）も確認する
  - 変更は feature 単位で閉じ、責務が混ざらないようにする

### リンク

- **Live Demo**: 
ユーザー画面：https://secondpath-app.jp/
管理画面：https://secondpath-app.jp/adminLogin

