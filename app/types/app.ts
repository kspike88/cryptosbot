// Basic types
export type Language = 'ru' | 'en'
export type CurrencyId = 'RUB' | 'KZT' | 'BYN'
export type CryptoId = 'BTC' | 'ETH' | 'USDT' | 'USDC' | 'TON' | 'BNB' | 'SOL' | 'DOGE' | 'ADA' | 'TRX' | 'DOT' | 'LINK' | 'LTC' | 'UNI' | 'ETC' | 'APT' | 'FIL' | 'RENDER' | 'ATOM' | 'SUI' | 'OP' | 'GRT' | 'AAVE' | 'NOT'

// Interfaces
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

export type CurrencyTranslations = Record<CurrencyId, {
  ru: string
  en: string
}>

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
  russian: Record<Language, string>
  english: Record<Language, string>
  navigation: {
    assets: Record<Language, string>
    trading: Record<Language, string>
  }
  buying: Record<Language, string>
  selling: Record<Language, string>
  buy: Record<Language, string>
  sell: Record<Language, string>
  noDeals: Record<Language, string>
  back: Record<Language, string>
  available: Record<Language, string>
  tradingPair: Record<Language, string>
  insufficientFunds: Record<Language, string>
  exchangeTitle: Record<Language, string>
  collapse: Record<Language, string>
  showAll: Record<Language, string>
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

export interface ExchangeModalProps {
  isOpen: boolean
  onClose: () => void
  fromCurrency: Currency | Crypto
  toCurrency: Currency | Crypto
}

export interface WithdrawModalProps {
  isOpen: boolean
  onClose: () => void
}

