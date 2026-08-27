export interface ICategory {
  _id: string
  name: string
  sort: number
  status: boolean
  createdAt: string
  updatedAt: string
}

export interface ICreateCategory {
  name: string
  sort: number
  status: boolean
}

export interface IUpdateCategory {
  name?: string
  sort?: number
  status?: boolean
}

export interface GetCategoriesResponse {
  success: boolean
  message: string
  result: ICategory[]
}

export interface CreateCategoryResponse {
  success: boolean
  message: string
  result: ICategory
}

export interface UpdateCategoryResponse {
  success: boolean
  message: string
  result: ICategory
}

export interface DeleteCategoryResponse {
  success: boolean
  message: string
  result: ICategory
}
