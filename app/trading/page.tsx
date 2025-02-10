'use client'

import { useEffect, useState } from 'react'
import Navigation from '@/components/navigation'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import type { Language, Translations } from '@/app/types/app'
import { translations } from '@/utils/translations'

interface TradingPair {
  id: string
  name: string
  base: string
  price: number
  change: number
  icon: string
  subtitle: string
  bgColor: string
}

const INITIAL_PAIRS: TradingPair[] = [
  { 
    id: "BTC/USDT", name: "Bitcoin", base: "BTC", 
    price: 0, change: 0,
    icon: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    subtitle: "Bitcoin",
    bgColor: "bg-white"
  },
  { 
    id: "TON/USDT", name: "Toncoin", base: "TON", 
    price: 0, change: 0,
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/11419.png",
    subtitle: "TON",
    bgColor: "bg-white"
  },
  { 
    id: "USDC/USDT", name: "USD Coin", base: "USDC", 
    price: 0, change: 0,
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
    subtitle: "USDC",
    bgColor: "bg-white"
  },
  { 
    id: "BNB/USDT", name: "BNB", base: "BNB", 
    price: 0, change: 0,
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png",
    subtitle: "BNB",
    bgColor: "bg-white"
  },
  { 
    id: "SOL/USDT", name: "Solana", base: "SOL", 
    price: 0, change: 0,
    icon: "https://assets.coingecko.com/coins/images/4128/standard/solana.png?1718769756",
    subtitle: "SOL",
    bgColor: "bg-white"
  },
  { 
    id: "DOGE/USDT", name: "Dogecoin", base: "DOGE", 
    price: 0, change: 0,
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/74.png",
    subtitle: "DOGE",
    bgColor: "bg-white"
  },
  { 
    id: "ADA/USDT", name: "Cardano", base: "ADA", 
    price: 0, change: 0,
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png",
    subtitle: "ADA",
    bgColor: "bg-white"
  },
  { 
    id: "TRX/USDT", name: "Tron", base: "TRX", 
    price: 0, change: 0,
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png",
    subtitle: "TRX",
    bgColor: "bg-white"
  },
  { 
    id: "ETH/USDT", name: "Ethereum", base: "ETH", 
    price: 0, change: 0,
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
    subtitle: "Ethereum",
    bgColor: "bg-white"
  },
  { 
    id: "DOT/USDT", name: "Polkadot", base: "DOT", 
    price: 0, change: 0,
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/6636.png",
    subtitle: "Polkadot",
    bgColor: "bg-white"
  },
  { 
    id: "LINK/USDT", name: "Chainlink", base: "LINK", 
    price: 0, change: 0,
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1975.png",
    subtitle: "Chainlink",
    bgColor: "bg-white"
  },
  { 
    id: "LTC/USDT", name: "Litecoin", base: "LTC", 
    price: 0, change: 0,
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/2.png",
    subtitle: "Litecoin",
    bgColor: "bg-white"
  },
  { 
    id: "UNI/USDT", name: "Uniswap", base: "UNI", 
    price: 0, change: 0,
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png",
    subtitle: "Uniswap",
    bgColor: "bg-white"
  },
  { 
    id: "ETC/USDT", name: "Ethereum Classic", base: "ETC", 
    price: 0, change: 0,
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1321.png",
    subtitle: "Ethereum Classic",
    bgColor: "bg-white"
  },
  { 
    id: "APT/USDT", name: "Aptos", base: "APT", 
    price: 0, change: 0,
    icon: "https://assets.coingecko.com/coins/images/26455/standard/aptos_round.png?1696525528",
    subtitle: "Aptos",
    bgColor: "bg-white"
  },
  { 
    id: "FIL/USDT", name: "Filecoin", base: "FIL", 
    price: 0, change: 0,
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/2280.png",
    subtitle: "Filecoin",
    bgColor: "bg-white"
  },
  { 
    id: "RENDER/USDT", name: "Render", base: "RENDER", 
    price: 0, change: 0,
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/5690.png",
    subtitle: "Render",
    bgColor: "bg-white"
  },
  { 
    id: "ATOM/USDT", name: "Cosmos", base: "ATOM", 
    price: 0, change: 0,
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/3794.png",
    subtitle: "Cosmos",
    bgColor: "bg-white"
  },
  { 
    id: "SUI/USDT", name: "Sui", base: "SUI", 
    price: 0, change: 0,
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/20947.png",
    subtitle: "Sui",
    bgColor: "bg-white"
  },
  { 
    id: "OP/USDT", name: "Optimism", base: "OP", 
    price: 0, change: 0,
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/11840.png",
    subtitle: "Optimism",
    bgColor: "bg-white"
  },
  { 
    id: "GRT/USDT", name: "The Graph", base: "GRT", 
    price: 0, change: 0,
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/6719.png",
    subtitle: "The Graph",
    bgColor: "bg-white"
  },
  { 
    id: "AAVE/USDT", name: "Aave", base: "AAVE", 
    price: 0, change: 0,
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/7278.png",
    subtitle: "Aave",
    bgColor: "bg-white"
  },
  { 
    id: "NOT/USDT", name: "Notcoin", base: "NOT", 
    price: 0, change: 0,
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/28850.png",
    subtitle: "Notcoin",
    bgColor: "bg-white"
  }
]

export default function Trading() {
  const router = useRouter()
  const [pairs, setPairs] = useState<TradingPair[]>(INITIAL_PAIRS)
  const [language, setLanguage] = useState<Language>('ru')

  useEffect(() => {
    const handleLanguageChange = () => {
      const newLanguage = localStorage.getItem('preferred-language') as Language
      setLanguage(newLanguage || 'ru')
    }

    handleLanguageChange() 
    window.addEventListener('storage', handleLanguageChange)
    return () => window.removeEventListener('storage', handleLanguageChange)
  }, [])

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/24hr')
        const data = await response.json()
        
        setPairs(currentPairs => 
          currentPairs.map(pair => {
            const binancePair = data.find((p: any) => p.symbol === `${pair.base}USDT`)
            if (binancePair) {
              return {
                ...pair,
                price: parseFloat(binancePair.lastPrice),
                change: parseFloat(binancePair.priceChangePercent)
              }
            }
            return pair
          })
        )
      } catch (error) {
        console.error('Error fetching prices:', error)
      }
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 10000)
    return () => clearInterval(interval)
  }, [])

  const getTranslation = (key: keyof Translations, lang: Language) => {
    const translation = translations[key]
    if (translation && typeof translation === 'object' && lang in translation) {
      return translation[lang as keyof typeof translation]
    }
    return key
  }

  return (
    <main className="pb-20 bg-white">
      <div className="p-4">
        <h1 className="text-sm text-blue-500 mb-3">{getTranslation('tradingPair', language)}</h1>
        <div className="space-y-2">
          {pairs.map((pair) => (
            <div 
              key={pair.id} 
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-gray-100"
              onClick={() => router.push(`/trading/${encodeURIComponent(pair.id)}`)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white overflow-hidden shadow-sm border border-gray-100">
                  <Image
                    src={pair.icon}
                    alt={pair.name}
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div>
                  <div className="text-gray-900 font-medium">{pair.id}</div>
                  <div className="text-sm text-gray-500">{pair.subtitle}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-gray-900 font-medium">
                  {pair.price.toFixed(2)}
                </div>
                <div className={`text-sm ${pair.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {pair.change >= 0 ? '+' : ''}{pair.change.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Navigation />
    </main>
  )
}