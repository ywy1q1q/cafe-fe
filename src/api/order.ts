import type {
  CreateOrderPayload,
  GetOrdersResponse,
  OrderResponse,
  OrderStatus,
} from '@/types/order'
import api from '@/plugins/axios'

export async function createOrder (
  payload: CreateOrderPayload,
): Promise<OrderResponse> {
  const response = await api.post<OrderResponse>('/api/orders', payload)

  return response.data
}

export async function getOrders (): Promise<GetOrdersResponse> {
  const response = await api.get<GetOrdersResponse>('/api/orders')

  return response.data
}

export async function updateOrderStatus (
  id: string,
  status: OrderStatus,
): Promise<OrderResponse> {
  const response = await api.patch<OrderResponse>(
    `/api/orders/${id}/status`,
    {
      status,
    },
  )

  return response.data
}
