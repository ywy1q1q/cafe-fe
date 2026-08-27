import api from '@/plugins/axios'

export interface ILoginPayload {
  account: string
  password: string
}

export interface IRegisterPayload {
  account: string
  password: string
}

export interface IMemberProfile {
  _id: string
  account: string
  name?: string
  email?: string
  phone?: string
  cardLast4?: string
  role: 'user' | 'admin'
  createdAt: string
  updatedAt: string
}

export interface IRegisterResponse {
  success: boolean
  message: string
  result: Record<string, never>
}

export async function register (
  payload: IRegisterPayload,
): Promise<IRegisterResponse> {
  const response = await api.post<IRegisterResponse>('/auth/register', payload)

  return response.data
}

export interface IMemberProfileResponse {
  success: boolean
  message: string
  result: IMemberProfile
}

export async function getProfile (): Promise<IMemberProfileResponse> {
  const response = await api.get<IMemberProfileResponse>('/auth/me')

  return response.data
}

export async function updateProfile (
  payload: Partial<Pick<IMemberProfile, 'name' | 'email' | 'phone' | 'cardLast4'>>,
): Promise<IMemberProfileResponse> {
  const response = await api.patch<IMemberProfileResponse>('/auth/me', payload)

  return response.data
}

export interface ILoginResult {
  accessToken: string
  account: string
  role: 'user' | 'admin'
}

export interface ILoginResponse {
  success: boolean
  message: string
  result: ILoginResult
}

export interface IRefreshResult {
  accessToken: string
  account: string
  role: 'user' | 'admin'
}

export interface IRefreshResponse {
  success: boolean
  message: string
  result: IRefreshResult
}

export async function login (
  payload: ILoginPayload,
): Promise<ILoginResponse> {
  const response = await api.post<ILoginResponse>(
    '/auth/login',
    payload,
  )

  return response.data
}

export interface ILogoutResponse {
  success: boolean
  message: string
}

export async function logout (): Promise<ILogoutResponse> {
  const response = await api.delete<ILogoutResponse>(
    '/auth/logout',
  )

  return response.data
}

export async function refresh (): Promise<IRefreshResponse> {
  const response = await api.post<IRefreshResponse>(
    '/auth/refresh',
  )

  return response.data
}
