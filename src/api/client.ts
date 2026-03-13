import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 5000,
});

// リトライの設定
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config } = error;

    // もし config がない場合や、すでに最大リトライ数に達している場合はエラーを返す
    if (!config || config._retryCount >= MAX_RETRIES) {
      return Promise.reject(error);
    }

    // リトライ回数をカウント（独自プロパティ）
    config._retryCount = config._retryCount || 0;
    config._retryCount += 1;

    console.warn(`再試行中... (${config._retryCount}/${MAX_RETRIES}): ${config.url}`);

    // 少し待機してから再実行
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));

    return apiClient(config); // 同じ設定で再度リクエストを投げる
  }
);

// X-User-Id を送るリクエストインターセプター
apiClient.interceptors.request.use((config) => {
  const uuid = typeof window !== 'undefined' ? localStorage.getItem('user_uuid') : null;
  if (uuid) {
    config.headers['X-User-Id'] = uuid;
  }
  return config;
});

export default apiClient;
