import axios from 'axios';
import { getUserUuidForHeader } from '@/api/userUuid';
import { apiBaseUrlFromHost } from '@/lib/apiBaseUrl';

const apiClient = axios.create({
  baseURL:
    typeof window !== 'undefined'
      ? apiBaseUrlFromHost(window.location.hostname)
      : (process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? ''),
  timeout: 10000, // 5s -> 10s
});

// GETのみ・ネットワーク系/5xxのみリトライ
const MAX_RETRIES = 1; // 3 -> 1
const BASE_DELAY = 500;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config;
    if (!config) return Promise.reject(error);

    config._retryCount = config._retryCount ?? 0;

    const method = (config.method || 'get').toLowerCase();
    const status = error?.response?.status;
    const isNetworkError = !error.response; // timeout, DNS, reset, etc.
    const isRetriableStatus = status >= 500 || status === 429;
    const shouldRetry = method === 'get' && (isNetworkError || isRetriableStatus);

    if (!shouldRetry || config._retryCount >= MAX_RETRIES) {
      return Promise.reject(error);
    }

    config._retryCount += 1;
    const delay = BASE_DELAY * Math.pow(2, config._retryCount - 1); // 500ms, 1000ms...

    await new Promise((resolve) => setTimeout(resolve, delay));
    return apiClient(config);
  }
);

// X-User-Id を送るリクエストインターセプター（ブラウザではホストに応じた baseURL を毎回反映）
apiClient.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') {
    config.baseURL = apiBaseUrlFromHost(window.location.hostname);
  }
  const uuid = await getUserUuidForHeader();
  if (uuid) {
    config.headers = config.headers ?? {};
    config.headers['X-User-Id'] = uuid;
  }
  return config;
});

export default apiClient;