import type {
  DeleteProductResponse,
  GetProductsResponse,
  ProductResponse,
} from '@/types/product'
import api from '@/plugins/axios'

export async function getAllProducts (): Promise<GetProductsResponse> {
  const response = await api.get<GetProductsResponse>('/api/products/all')

  return response.data
}

export async function createProduct (payload: FormData): Promise<ProductResponse> {
  const response = await api.post<ProductResponse>('/api/products', payload)

  return response.data
}

export async function updateProduct (
  id: string,
  payload: FormData,
): Promise<ProductResponse> {
  const response = await api.put<ProductResponse>(`/api/products/${id}`, payload)

  return response.data
}

export async function deleteProduct (id: string): Promise<DeleteProductResponse> {
  const response = await api.delete<DeleteProductResponse>(`/api/products/${id}`)

  return response.data
}
