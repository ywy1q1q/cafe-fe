import axios, { type AxiosError } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

export class ApiError extends Error {
  constructor (
    message: string,
    public readonly status: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

interface ApiErrorResponse {
  message?: string
}

export const api = {
  async get<TResponse>(path: string): Promise<TResponse> {
    try {
      const response = await axiosInstance.get<TResponse>(path)
      return response.data
    } catch (error: unknown) {
      throw toApiError(error)
    }
  },

  async post<TResponse, TBody>(path: string, body: TBody): Promise<TResponse> {
    try {
      const response = await axiosInstance.post<TResponse>(path, body)
      return response.data
    } catch (error: unknown) {
      throw toApiError(error)
    }
  },

  async put<TResponse, TBody>(path: string, body: TBody): Promise<TResponse> {
    try {
      const response = await axiosInstance.put<TResponse>(path, body)
      return response.data
    } catch (error: unknown) {
      throw toApiError(error)
    }
  },

  async delete<TResponse>(path: string): Promise<TResponse> {
    try {
      const response = await axiosInstance.delete<TResponse>(path)
      return response.data
    } catch (error: unknown) {
      throw toApiError(error)
    }
  },
}

function toApiError(error: unknown): ApiError | unknown {
  if (!axios.isAxiosError(error)) {
    return error
  }

  const axiosError = error as AxiosError<ApiErrorResponse>
  if (!axiosError.response) {
    return new ApiError('無法連接伺服器，請確認後端是否已啟動', 0)
  }

  return new ApiError(
    axiosError.response.data?.message || '操作失敗，請稍後再試',
    axiosError.response.status,
  )
}
