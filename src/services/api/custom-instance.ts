import Axios, { AxiosRequestConfig } from 'axios'

export const AXIOS_INSTANCE = Axios.create({
  baseURL: 'https://api.mh-api.com/v1',
})

// リクエストインターセプター
AXIOS_INSTANCE.interceptors.request.use(config => {
  // 必要に応じて認証トークンなどを追加
  return config
})

// レスポンスインターセプター
AXIOS_INSTANCE.interceptors.response.use(
  response => response,
  error => {
    // エラーハンドリング
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  const source = Axios.CancelToken.source()
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data)

  // @ts-expect-error - Add cancel method to promise
  promise.cancel = () => {
    source.cancel('Query was cancelled')
  }

  return promise
}

export default customInstance
