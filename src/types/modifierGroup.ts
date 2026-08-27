export interface IModifierItem {
  name: string
  extraPrice: number
  isDefault: boolean
  sort: number
  status: boolean
}

export interface IModifierGroup {
  _id: string
  name: string
  type: 'single' | 'multiple'
  required: boolean
  minSelect: number
  maxSelect: number
  status: boolean
  items: IModifierItem[]
  createdAt: string
  updatedAt: string
}

export interface ICreateModifierGroup {
  name: string
  type: 'single' | 'multiple'
  required: boolean
  minSelect: number
  maxSelect: number
  status: boolean
  items: IModifierItem[]
}

export interface IUpdateModifierGroup {
  name?: string
  type?: 'single' | 'multiple'
  required?: boolean
  minSelect?: number
  maxSelect?: number
  status?: boolean
  items?: IModifierItem[]
}

export interface GetModifierGroupsResponse {
  success: boolean
  message: string
  result: IModifierGroup[]
}

export interface CreateModifierGroupResponse {
  success: boolean
  message: string
  result: IModifierGroup
}

export interface UpdateModifierGroupResponse {
  success: boolean
  message: string
  result: IModifierGroup
}

export interface DeleteModifierGroupResponse {
  success: boolean
  message: string
  result: IModifierGroup
}
