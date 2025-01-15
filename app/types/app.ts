export type Language = 'ru' | 'en'

export interface DepositCurrency {
  id: string
  name: string
  symbol: string
  icon: string
  shortName?: string
}

export interface TranslationKey {
  [key: string]: {
    ru: string
    en: string
  }
}

