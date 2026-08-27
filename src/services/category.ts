import type {
  CreateCategoryResponse,
  ICategory,
  ICreateCategory,
} from '@/types/category'
import { api } from './api'

interface CategoryListResponse {
  success: boolean
  message: string
  result: ICategory[]
}

interface UpdateCategoryResponse {
  success: boolean
  message: string
  result: ICategory
}

interface DeleteCategoryResponse {
  success: boolean
  message: string
}

export const getCategories = async (): Promise<CategoryListResponse> => {
  return api.get<CategoryListResponse>('/api/categories')
}

export const createCategory = async (
  data: ICreateCategory,
): Promise<CreateCategoryResponse> => {
  return api.post<CreateCategoryResponse, ICreateCategory>('/api/categories', data)
}

export const updateCategory = async (
  id: string,
  data: Partial<ICreateCategory>,
): Promise<UpdateCategoryResponse> => {
  return api.put<UpdateCategoryResponse, Partial<ICreateCategory>>(`/api/categories/${id}`, data)
}

export const deleteCategory = async (
  id: string,
): Promise<DeleteCategoryResponse> => {
  return api.delete<DeleteCategoryResponse>(`/api/categories/${id}`)
}
