"use client"

import { useState, useEffect } from 'react'
import { Eye, EyeOff, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface Item {
  id: string
  name: string
  subtitle: string
  symbol: string
  icon: string
  bgColor: string
  isVisible: boolean
}

const INITIAL_CURRENCIES: Item[] = [
  {
    id: 'RUB',
    name: 'Российский рубль',
    subtitle: 'RUB',
    symbol: '₽',
    icon: '₽',
    bgColor: 'bg-emerald-500',
    isVisible: true
  },
  {
    id: 'KZT',
    name: 'Казахстанский тенге',
    subtitle: 'KZT',
    symbol: '₸',
    icon: '₸',
    bgColor: 'bg-emerald-500',
    isVisible: false
  },
  {
    id: 'BYN',
    name: 'Белорусский рубль',
    subtitle: 'BYN',
    symbol: 'Br',
    icon: 'Br',
    bgColor: 'bg-emerald-500',
    isVisible: false
  }
]

const INITIAL_CRYPTOS: Item[] = [
  {
    id: 'BTC',
    name: 'Bitcoin',
    subtitle: 'BTC',
    symbol: 'BTC',
    icon: '₿',
    bgColor: 'bg-orange-500',
    isVisible: true
  },
  {
    id: 'ETH',
    name: 'Ethereum',
    subtitle: 'ETH',
    symbol: 'ETH',
    icon: 'Ξ',
    bgColor: 'bg-blue-500',
    isVisible: true
  },
  {
    id: 'USDT',
    name: 'Tether',
    subtitle: 'USDT',
    symbol: 'USDT',
    icon: '₮',
    bgColor: 'bg-green-500',
    isVisible: true
  }
]

export default function Settings() {
  const searchParams = useSearchParams()
  const type = searchParams.get('type')

  const [currencies, setCurrencies] = useState<Item[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('currencies')
      return saved ? JSON.parse(saved) : INITIAL_CURRENCIES
    }
    return INITIAL_CURRENCIES
  })

  const [cryptos, setCryptos] = useState<Item[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cryptos')
      return saved ? JSON.parse(saved) : INITIAL_CRYPTOS
    }
    return INITIAL_CRYPTOS
  })

  useEffect(() => {
    localStorage.setItem('currencies', JSON.stringify(currencies))
  }, [currencies])

  useEffect(() => {
    localStorage.setItem('cryptos', JSON.stringify(cryptos))
  }, [cryptos])

  const toggleVisibility = (id: string, type: 'currency' | 'crypto') => {
    const setter = type === 'currency' ? setCurrencies : setCryptos
    setter(current =>
      current.map(item =>
        item.id === id
          ? { ...item, isVisible: !item.isVisible }
          : item
      )
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center p-4">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            <ChevronLeft className="h-6 w-6" />
          </Link>
        </div>
      </div>

      <div className="pt-16 p-4">
        <h2 className="text-sm text-gray-500 mb-4">Избранное</h2>
        
        {type === 'currencies' && (
          <div>
            <h3 className="text-sm text-blue-500/80 mb-2">Валютные счета</h3>
            <div className="space-y-2">
              {currencies.map((currency) => (
                <div
                  key={currency.id}
                  className="flex items-center justify-between p-3 rounded bg-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${currency.isVisible ? 'bg-emerald-500' : 'bg-gray-400'} rounded-full flex items-center justify-center text-white`}>
                      <span className="text-lg">{currency.icon}</span>
                    </div>
                    <div>
                      <div className="text-gray-900">{currency.id}</div>
                      <div className="text-sm text-gray-500">{currency.name}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleVisibility(currency.id, 'currency')}
                    className={`p-2 rounded-full ${
                      currency.isVisible ? 'text-blue-500' : 'text-gray-400'
                    }`}
                  >
                    {currency.isVisible ? (
                      <Eye className="h-5 w-5" />
                    ) : (
                      <EyeOff className="h-5 w-5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {type === 'cryptos' && (
          <div>
            <h3 className="text-sm text-blue-500/80 mb-2">Криптовалюты</h3>
            <div className="space-y-2">
              {cryptos.map((crypto) => (
                <div
                  key={crypto.id}
                  className="flex items-center justify-between p-3 rounded bg-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${crypto.isVisible ? crypto.bgColor : 'bg-gray-400'} rounded-full flex items-center justify-center text-white`}>
                      <span className="text-lg">{crypto.icon}</span>
                    </div>
                    <div>
                      <div className="text-gray-900">{crypto.id}</div>
                      <div className="text-sm text-gray-500">{crypto.name}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleVisibility(crypto.id, 'crypto')}
                    className={`p-2 rounded-full ${
                      crypto.isVisible ? 'text-blue-500' : 'text-gray-400'
                    }`}
                  >
                    {crypto.isVisible ? (
                      <Eye className="h-5 w-5" />
                    ) : (
                      <EyeOff className="h-5 w-5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

