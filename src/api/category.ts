import type {
  CreateCategoryResponse,
  DeleteCategoryResponse,
  GetCategoriesResponse,
  ICreateCategory,
  IUpdateCategory,
  UpdateCategoryResponse,
} from '@/types/category'
import api from '@/plugins/axios'

export async function getCategories (): Promise<GetCategoriesResponse> {
  const response = await api.get<GetCategoriesResponse>(
    '/api/categories',
  )

  return response.data
}

export async function createCategory (
  payload: ICreateCategory,
): Promise<CreateCategoryResponse> {
  const response = await api.post<CreateCategoryResponse>(
    '/api/categories',
    payload,
  )

  return response.data
}

export async function updateCategory (
  id: string,
  payload: IUpdateCategory,
): Promise<UpdateCategoryResponse> {
  const response = await api.put<UpdateCategoryResponse>(
    `/api/categories/${id}`,
    payload,
  )

  return response.data
}

export async function deleteCategory (
  id: string,
): Promise<DeleteCategoryResponse> {
  const response = await api.delete<DeleteCategoryResponse>(
    `/api/categories/${id}`,
  )

  return response.data
}
