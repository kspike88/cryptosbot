export type Language = 'ru' | 'en'

export type CurrencyId = 'RUB' | 'KZT' | 'BYN'
export type CryptoId = 'BTC' | 'ETH' | 'USDT' | 'USDC' | 'TON' | 'BNB' | 'SOL' | 'DOGE' | 'ADA' | 'TRX'

export interface DepositCurrency {
  id: CurrencyId | CryptoId
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

export interface CurrencyTranslations {
  [K in CurrencyId]: {
    ru: string
    en: string
  }
}

export interface Translations {
  totalBalance: Record<Language, string>
  deposit: Record<Language, string>
  withdraw: Record<Language, string>
  exchange: Record<Language, string>
  profile: Record<Language, string>
  accountId: Record<Language, string>
  statistics: Record<Language, string>
  tradingVolume: Record<Language, string>
  fiatAccounts: Record<Language, string>
  cryptocurrencies: Record<Language, string>
  settings: Record<Language, string>
  whatToDeposit: Record<Language, string>
  youAreDepositing: Record<Language, string>
  balance: Record<Language, string>
  paymentMethod: Record<Language, string>
  continue: Record<Language, string>
  currencyNames: CurrencyTranslations
}

export interface Currency {
  id: CurrencyId
  name: string
  symbol: string
  rate: string
  balance: string
  bgColor: string
  textColor: string
  icon: string
  isVisible: boolean
}

export interface Crypto {
  id: CryptoId
  name: string
  symbol: string
  balance: number
  price: number
  change: number
  bgColor: string
  textColor: string
  icon: string
  isVisible: boolean
}

