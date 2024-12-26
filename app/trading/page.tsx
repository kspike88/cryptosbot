"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { TradingModal } from "@/components/trading-modal"
import { Bitcoin, Hexagon, Circle, Link, Droplet, CuboidIcon as Cube, Box, FileCode, Pyramid, Atom, CircleDot, Target, Network, Database, AlertTriangle } from 'lucide-react'

interface TradingPair {
  id: string
  name: string
  base: string
  price: number
  change: number
  icon: React.ReactNode
  subtitle: string
  bgColor: string
}

const INITIAL_PAIRS: TradingPair[] = [
  { 
    id: "BTC/USDT", name: "Bitcoin", base: "BTC", 
    price: 98315.21, change: -0.11,
    icon: <Bitcoin className="w-5 h-5" />,
    subtitle: "Bitcoin",
    bgColor: "bg-orange-500"
  },
  { 
    id: "ETH/USDT", name: "Ethereum", base: "ETH", 
    price: 3450.8, change: -1.40,
    icon: <Hexagon className="w-5 h-5" />,
    subtitle: "Ethereum",
    bgColor: "bg-blue-500"
  },
  { 
    id: "DOT/USDT", name: "Polkadot", base: "DOT", 
    price: 7.417, change: -1.64,
    icon: <Circle className="w-5 h-5" />,
    subtitle: "Polkadot",
    bgColor: "bg-pink-500"
  },
  { 
    id: "LINK/USDT", name: "Chainlink", base: "LINK", 
    price: 24.34, change: -1.10,
    icon: <Link className="w-5 h-5" />,
    subtitle: "Chainlink",
    bgColor: "bg-blue-400"
  },
  { 
    id: "LTC/USDT", name: "Litecoin", base: "LTC", 
    price: 107.52, change: -2.08,
    icon: <Circle className="w-5 h-5" />,
    subtitle: "Litecoin",
    bgColor: "bg-gray-400"
  },
  { 
    id: "UNI/USDT", name: "Uniswap", base: "UNI", 
    price: 13.769, change: -5.87,
    icon: <Droplet className="w-5 h-5" />,
    subtitle: "Uniswap",
    bgColor: "bg-pink-400"
  },
  { 
    id: "ETC/USDT", name: "Ethereum Classic", base: "ETC", 
    price: 27.09, change: -4.04,
    icon: <Cube className="w-5 h-5" />,
    subtitle: "Ethereum Classic",
    bgColor: "bg-green-500"
  },
  { 
    id: "APT/USDT", name: "Aptos", base: "APT", 
    price: 9.54, change: -2.85,
    icon: <Box className="w-5 h-5" />,
    subtitle: "Aptos",
    bgColor: "bg-blue-500"
  },
  { 
    id: "FIL/USDT", name: "Filecoin", base: "FIL", 
    price: 5.261, change: -4.71,
    icon: <FileCode className="w-5 h-5" />,
    subtitle: "Filecoin",
    bgColor: "bg-cyan-500"
  },
  { 
    id: "RENDER/USDT", name: "Render", base: "RENDER", 
    price: 7.513, change: -5.32,
    icon: <Pyramid className="w-5 h-5" />,
    subtitle: "Render",
    bgColor: "bg-red-500"
  },
  { 
    id: "ATOM/USDT", name: "Cosmos", base: "ATOM", 
    price: 6.877, change: -3.39,
    icon: <Atom className="w-5 h-5" />,
    subtitle: "Cosmos",
    bgColor: "bg-purple-500"
  },
  { 
    id: "SUI/USDT", name: "Sui", base: "SUI", 
    price: 4.5175, change: -2.03,
    icon: <CircleDot className="w-5 h-5" />,
    subtitle: "Sui",
    bgColor: "bg-blue-400"
  },
  { 
    id: "OP/USDT", name: "Optimism", base: "OP", 
    price: 1.897, change: -3.41,
    icon: <Target className="w-5 h-5" />,
    subtitle: "Optimism",
    bgColor: "bg-red-400"
  },
  { 
    id: "GRT/USDT", name: "The Graph", base: "GRT", 
    price: 0.2214, change: -4.85,
    icon: <Network className="w-5 h-5" />,
    subtitle: "The Graph",
    bgColor: "bg-indigo-500"
  },
  { 
    id: "AAVE/USDT", name: "Aave", base: "AAVE", 
    price: 368.56, change: -2.19,
    icon: <Database className="w-5 h-5" />,
    subtitle: "Aave",
    bgColor: "bg-purple-400"
  },
  { 
    id: "NOT/USDT", name: "Notcoin", base: "NOT", 
    price: 0.00671, change: -2.39,
    icon: <AlertTriangle className="w-5 h-5" />,
    subtitle: "Notcoin",
    bgColor: "bg-gray-500"
  }
]

export default function Trading() {
  const [pairs, setPairs] = useState<TradingPair[]>(INITIAL_PAIRS)
  const [selectedPair, setSelectedPair] = useState<TradingPair | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setPairs(currentPairs => 
        currentPairs.map(pair => ({
          ...pair,
          price: pair.price * (1 + (Math.random() * 0.02 - 0.01)),
          change: pair.change + (Math.random() * 0.4 - 0.2)
        }))
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <main className="pb-20">
      <div className="p-4">
        <h1 className="text-sm text-blue-500 mb-3">Торговая пара</h1>
        <div className="space-y-2">
          {pairs.map((pair) => (
            <div 
              key={pair.id} 
              className="flex items-center justify-between p-3 rounded bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => setSelectedPair(pair)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 ${pair.bgColor} rounded-full flex items-center justify-center text-white`}>
                  {pair.icon}
                </div>
                <div>
                  <div className="text-gray-900">{pair.id}</div>
                  <div className="text-sm text-gray-600">{pair.subtitle}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-gray-900">{pair.price.toFixed(pair.price < 1 ? 4 : 2)}</div>
                <div className={`text-sm ${pair.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {pair.change >= 0 ? '+' : ''}{pair.change.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <TradingModal 
        isOpen={!!selectedPair}
        onClose={() => setSelectedPair(null)}
        pair={selectedPair}
      />
      
      <Navigation />
    </main>
  )
}

