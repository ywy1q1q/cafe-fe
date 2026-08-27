import type { ICategory } from '@/types/category'
import type { IModifierGroup } from '@/types/modifierGroup'

export interface IProduct {
  _id: string
  name: string
  price: number
  stock: number
  description: string
  image: string
  imageUrl?: string
  status: boolean
  isPopular: boolean
  categoryId: string | ICategory
  modifierGroupIds: string[] | IModifierGroup[]
  createdAt: string
  updatedAt: string
}

export interface ProductForm {
  name: string
  price: number
  stock: number
  description: string
  image: File | null
  status: boolean
  isPopular: boolean
  modifierGroupIds: string[]
}

export interface GetProductsResponse {
  success: boolean
  message: string
  result: IProduct[]
}

export interface ProductResponse {
  success: boolean
  message: string
  result: IProduct
}

export interface DeleteProductResponse {
  success: boolean
  message: string
  result: IProduct
}
