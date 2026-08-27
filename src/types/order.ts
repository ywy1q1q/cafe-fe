export type OrderStatus
  = | 'pending'
    | 'preparing'
    | 'ready'
    | 'completed'
    | 'cancelled'

export interface IOrderModifier {
  groupName: string
  itemName: string
  extraPrice: number
}

export interface IOrderItem {
  productId: string
  productName: string
  price: number
  quantity: number
  modifiers: IOrderModifier[]
  subtotal: number
}

export interface IOrder {
  _id: string
  orderNumber: string
  lookupToken: string
  orderType: 'dine-in' | 'takeaway'

  items: IOrderItem[]

  totalPrice: number
  status: OrderStatus
  createdAt: string
  updatedAt: string
}

export interface GetOrdersResponse {
  success: boolean
  message: string
  result: IOrder[]
}

export interface OrderResponse {
  success: boolean
  message: string
  result: IOrder
}

export interface CreateOrderPayload {
  orderType: 'dine-in' | 'takeaway'
  items: Array<{
    productId: string
    quantity: number
    modifiers: Array<{
      groupId: string
      itemName: string
    }>
  }>
}

export interface OrderErrorResponse {
  success: false
  code?: string
  message: string
}
