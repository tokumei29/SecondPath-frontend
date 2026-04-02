# SecondPath Frontend

**Next.js 16 (App Router) × React 19 × TypeScript** で構築したフロントエンドです。  
ユーザー向けダッシュボードと管理者向けダッシュボードを持ち、API サーバーと連携して動作します。

## 概要

- **ユーザー向け機能（Dashboard）**: ホーム、設定、記事、テキスト相談、日報、各種アセスメント（PHQ-9 / レジリエンス / 思考の癖）など
- **管理者向け機能（Admin）**: ユーザー一覧・詳細、カルテ（記録）管理、問い合わせ（テキスト相談）管理、メモ管理、投稿管理など

## 技術スタック

- **Frontend**: Next.js `16.1.6`（App Router）, React `19.2.3`, TypeScript
- **Auth**: Supabase（`@supabase/supabase-js`, `@supabase/ssr`）
- **API 通信**:
  - **Client**: Axios（`src/api/client.ts`）
  - **Server (RSC)**: `fetch` ラッパー（`src/api/serverFetch.ts`）
- **Styling**: CSS Modules（`*.module.css`）
- **品質管理**: ESLint / Prettier / Stylelint

## アーキテクチャ（このリポジトリで意識していること）

- **Feature ベース構成**: 画面・API・コンポーネントを `src/features/**` に集約
- **Server / Client 分離**:
  - 初期表示データは **Server Component** で `await` して取得
  - インタラクションは **Client Component** で扱う（フォーム送信、モーダル、楽観的更新など）
- **UX（体感速度）**:
  - ルート遷移・RSC 待ちで **全画面スピナ**（`RouteLoading` / `loading.tsx`）を表示
  - 一部操作は **Optimistic UI**（例: 管理メモ、テキスト相談送信）
- **ユーザー識別**:
  - Supabase セッションに連動して `user_uuid` Cookie を更新し、Server 側の API でもユーザー特定できるようにしています

## ディレクトリ構成（抜粋）

```txt
src/
  app/                       # Next.js App Router（route wrapper）
  features/                  # feature 単位の実装（Page / Client / api / components）
  api/                       # 共通 API（axios client / server fetch）
  components/                # 共有 UI（RouteLoading/Error/NotFound 等）
```

## 開発手順

### 前提

- Node.js（推奨: Node 20+）

### インストール

```bash
npm install
```

### 開発サーバー起動

このプロジェクトは **`3001`** で起動します。

```bash
npm run dev
```

### ビルド

```bash
npm run build
```



## リンク

- **Live Demo**: 
ユーザー画面：https://secondpath-app.jp/
管理画面：https://secondpath-app.jp/adminLogin

