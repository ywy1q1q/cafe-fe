import type {
  BusinessSettingsResponse,
  IUpdateBusinessSettings,
} from '@/types/businessSettings'
import api from '@/plugins/axios'

export async function getBusinessSettings (): Promise<BusinessSettingsResponse> {
  const response = await api.get<BusinessSettingsResponse>('/api/business-settings')
  return response.data
}

export async function updateBusinessSettings (
  payload: IUpdateBusinessSettings,
): Promise<BusinessSettingsResponse> {
  const response = await api.put<BusinessSettingsResponse>('/api/business-settings', payload)
  return response.data
}
