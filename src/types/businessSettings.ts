export interface IBusinessDay {
  dayOfWeek: number
  isOpen: boolean
  openTime: string
  closeTime: string
}

export interface IBusinessSettings {
  _id: string
  key: 'store'
  onlineOrderingEnabled: boolean
  timezone: string
  weeklyHours: IBusinessDay[]
  createdAt: string
  updatedAt: string
}

export interface IUpdateBusinessSettings {
  onlineOrderingEnabled: boolean
  weeklyHours: IBusinessDay[]
}

export interface BusinessSettingsResponse {
  success: boolean
  message: string
  result: IBusinessSettings
}
