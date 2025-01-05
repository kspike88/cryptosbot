'use client'

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import Image from 'next/image'
import { useRouter } from 'next/navigation'

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
    id: "BTC/USDT", 
    name: "Bitcoin", 
    base: "BTC", 
    price: 98315.21, 
    change: -0.11,
    icon: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    subtitle: "Bitcoin",
    bgColor: "bg-orange-0"
  },
  { 
    id: "USDT/USDT", 
    name: "Tether", 
    base: "USDT", 
    price: 1.0, 
    change: 0.00,
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png",
    subtitle: "Tether",
    bgColor: "bg-blue-500"
  },
  { 
    id: "TON/USDT", 
    name: "Toncoin", 
    base: "TON", 
    price: 5848.0, 
    change: -1.40,
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/11419.png",
    subtitle: "TON",
    bgColor: "bg-blue-500"
  },
  { 
    id: "USDC/USDT", 
    name: "USD Coin", 
    base: "USDC", 
    price: 1.0, 
    change: 0.00,
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
    subtitle: "USDC",
    bgColor: "bg-blue-500"
  },
  { 
    id: "BNB/USDT", 
    name: "BNB", 
    base: "BNB", 
    price: 3450.8, 
    change: -1.40,
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png",
    subtitle: "BNB",
    bgColor: "bg-blue-500"
  },
  { 
    id: "SOL/USDT", 
    name: "Solana", 
    base: "SOL", 
    price: 3450.8, 
    change: -1.40,
    icon: "https://assets.coingecko.com/coins/images/4128/standard/solana.png?1718769756",
    subtitle: "SOL",
    bgColor: "bg-blue-500"
  },
  { 
    id: "DOGE/USDT", 
    name: "Dogecoin", 
    base: "DOGE", 
    price: 0.31793, 
    change: -0.11,
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/74.png",
    subtitle: "DOGE",
    bgColor: "bg-blue-500"
  },
  { 
    id: "ADA/USDT", 
    name: "Cardano", 
    base: "ADA", 
    price: 0.8802, 
    change: -2.00,
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png",
    subtitle: "ADA",
    bgColor: "bg-blue-500"
  },
  { 
    id: "TRX/USDT", 
    name: "Tron", 
    base: "TRX", 
    price: 0.2582, 
    change: -2.23,
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png",
    subtitle: "TRX",
    bgColor: "bg-blue-500"
  },
  { 
    id: "ETH/USDT", 
    name: "Ethereum", 
    base: "ETH", 
    price: 3450.8, 
    change: -1.40,
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
    subtitle: "Ethereum",
    bgColor: "bg-blue-500"
  },
  { 
    id: "DOT/USDT", 
    name: "Polkadot", 
    base: "DOT", 
    price: 6.969, 
    change: -2.45,
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/6636.png",
    subtitle: "Polkadot",
    bgColor: "bg-blue-500"
  },
  { 
    id: "LINK/USDT", 
    name: "Chainlink", 
    base: "LINK", 
    price: 24.34, 
    change: -1.10,
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1975.png",
    subtitle: "Chainlink",
    bgColor: "bg-blue-500"
  },
  { 
    id: "LTC/USDT", 
    name: "Litecoin", 
    base: "LTC", 
    price: 107.52, 
    change: -2.08,
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/2.png",
    subtitle: "Litecoin",
    bgColor: "bg-blue-500"
  },
  { 
    id: "UNI/USDT", 
    name: "Uniswap", 
    base: "UNI", 
    price: 13.769, 
    change: -5.87,
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/7278.png",
    subtitle: "Uniswap",
    bgColor: "bg-blue-500"
  },
  { 
    id: "ETC/USDT", 
    name: "Ethereum Classic", 
    base: "ETC", 
    price: 27.09, 
    change: -4.04,
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1321.png",
    subtitle: "Ethereum Classic",
    bgColor: "bg-blue-500"
  },
  { 
    id: "APT/USDT", 
    name: "Aptos", 
    base: "APT", 
    price: 9.54, 
    change: -2.85,
    icon: "https://assets.coingecko.com/coins/images/26455/standard/aptos_round.png?1696525528",
    subtitle: "Aptos",
    bgColor: "bg-blue-500"
  },
  { 
    id: "FIL/USDT", 
    name: "Filecoin", 
    base: "FIL", 
    price: 5.261, 
    change: -4.71,
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/2280.png",
    subtitle: "Filecoin",
    bgColor: "bg-blue-500"
  },
  { 
    id: "RENDER/USDT", 
    name: "Render", 
    base: "RENDER", 
    price: 7.513, 
    change: -5.32,
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/5690.png",
    subtitle: "Render",
    bgColor: "bg-blue-500"
  },
  { 
    id: "ATOM/USDT", 
    name: "Cosmos", 
    base: "ATOM", 
    price: 6.877, 
    change: -3.39,
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/3794.png",
    subtitle: "Cosmos",
    bgColor: "bg-blue-500"
  },
  { 
    id: "SUI/USDT", 
    name: "Sui", 
    base: "SUI", 
    price: 4.5175, 
    change: -2.03,
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/20947.png",
    subtitle: "Sui",
    bgColor: "bg-blue-500"
  },
  { 
    id: "OP/USDT", 
    name: "Optimism", 
    base: "OP", 
    price: 1.897, 
    change: -3.41,
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/12419.png",
    subtitle: "Optimism",
    bgColor: "bg-blue-500"
  },
  { 
    id: "GRT/USDT", 
    name: "The Graph", 
    base: "GRT", 
    price: 0.2214, 
    change: -4.85,
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/6719.png",
    subtitle: "The Graph",
    bgColor: "bg-blue-500"
  },
  { 
    id: "AAVE/USDT", 
    name: "Aave", 
    base: "AAVE", 
    price: 368.56, 
    change: -2.19,
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/7256.png",
    subtitle: "Aave",
    bgColor: "bg-blue-500"
  },
  { 
    id: "NOT/USDT", 
    name: "Notcoin", 
    base: "NOT", 
    price: 0.00671, 
    change: -2.39,
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/28850.png",
    subtitle: "Notcoin",
    bgColor: "bg-blue-500"
  }
]

export default function Trading() {
  const router = useRouter()
  const [pairs, setPairs] = useState<TradingPair[]>(INITIAL_PAIRS)

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/24hr')
        const data = await response.json()
        
        setPairs(currentPairs => 
          currentPairs.map(pair => {
            const binancePair = data.find((p: any) => p.symbol === pair.base + 'USDT')
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
    const apiInterval = setInterval(fetchPrices, 60000)

    // Simulate real-time updates
    const simulateRealTimeUpdates = () => {
      setPairs(currentPairs => 
        currentPairs.map(pair => ({
          ...pair,
          price: pair.price * (1 + (Math.random() - 0.5) * 0.001),
          change: pair.change + (Math.random() - 0.5) * 0.1
        }))
      )
    }

    const simulationInterval = setInterval(simulateRealTimeUpdates, 1000)

    return () => {
      clearInterval(apiInterval)
      clearInterval(simulationInterval)
    }
  }, [])

  return (
    <main className="pb-20 bg-white">
      <div className="p-4">
        <h1 className="text-sm text-blue-500 mb-3">Торговая пара</h1>
        <div className="space-y-2">
          {pairs.map((pair) => (
            <div 
              key={pair.id} 
              className="flex items-center justify-between p-3 rounded hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => router.push(`/trading/${encodeURIComponent(pair.id)}`)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
                  <Image
                    src={pair.icon}
                    alt={pair.name}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="text-[#6b7280]">{pair.id}</div>
                  <div className="text-sm text-[#6b7280]">{pair.subtitle}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[#6b7280]">
                  {pair.price.toFixed(2)}
                </div>
                <div className={`text-sm ${pair.change >= 0 ? 'text-green-500' : 'text-[#ef4444]'}`}>
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