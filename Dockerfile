# --- 共通の土台 (base) ---
FROM node:20-slim AS base
WORKDIR /app

# --- ビルド用ステージ (builder) ---
FROM base AS builder
# 1. まずパッケージリストをコピー
COPY package.json package-lock.json ./
# 2. ビルドに必要なライブラリをインストール
RUN npm ci
# 3. 全てのソースコードをコピー
COPY . .

# ★ 解決の鍵：ビルド前に環境変数をセット
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY

# 4. ここでビルド（これで "next: not found" は出ません！）
RUN npm run build

# --- 本番実行用ステージ (runner) ---
FROM node:20-slim AS runner
WORKDIR /app
# ビルド済みの成果物だけを builder から持ってくる
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["npm", "start"]