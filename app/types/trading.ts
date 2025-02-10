export interface Transaction {
  id: string
  type: 'buy' | 'sell'
  pair: string
  amount: number
  price: number
  total: number
  timestamp: number
}

export interface TradingPair {
  id: string
  name: string
  base: string
  price: number
  change: number
  icon: string
  subtitle: string
  bgColor: string
}

