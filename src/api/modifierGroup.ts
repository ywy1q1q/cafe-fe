import type {
  CreateModifierGroupResponse,
  DeleteModifierGroupResponse,
  GetModifierGroupsResponse,
  ICreateModifierGroup,
  IUpdateModifierGroup,
  UpdateModifierGroupResponse,
} from '@/types/modifierGroup'

import api from '@/plugins/axios'

// 取得客製化群組列表
export async function getModifierGroups (): Promise<GetModifierGroupsResponse> {
  const response = await api.get<GetModifierGroupsResponse>(
    '/api/modifier-groups/all',
  )

  return response.data
}

// 新增客製化群組
export async function createModifierGroup (
  payload: ICreateModifierGroup,
): Promise<CreateModifierGroupResponse> {
  const response = await api.post<CreateModifierGroupResponse>(
    '/api/modifier-groups',
    payload,
  )

  return response.data
}

// 修改客製化群組
export async function updateModifierGroup (
  id: string,
  payload: IUpdateModifierGroup,
): Promise<UpdateModifierGroupResponse> {
  const response = await api.put<UpdateModifierGroupResponse>(
    `/api/modifier-groups/${id}`,
    payload,
  )

  return response.data
}

// 刪除客製化群組
export async function deleteModifierGroup (
  id: string,
): Promise<DeleteModifierGroupResponse> {
  const response = await api.delete<DeleteModifierGroupResponse>(
    `/api/modifier-groups/${id}`,
  )

  return response.data
}
