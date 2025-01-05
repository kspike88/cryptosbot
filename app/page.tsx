'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { ArrowUpFromLine, ArrowDownToLine, RefreshCcw, Settings2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'

interface Currency {
  id: string
  name: string
  symbol: string
  bgColor: string
  textColor: string
  icon: string
  isVisible: boolean
}

interface Crypto {
  id: string
  name: string
  price: number
  balance: number
  icon: string
}

// interface Transaction {
//   id: string
//   type: 'buy' | 'sell'
//   amount: string
//   timestamp: number
//   expiryTime: number
// }

// const DURATION_MAP = {
//   '30s': 30 * 1000,
//   '1m': 60 * 1000,
//   '5m': 5 * 60 * 1000,
//   '15m': 15 * 60 * 1000,
//   '30m': 30 * 60 * 1000,
//   '1h': 60 * 60 * 1000,
// }

const DEFAULT_VISIBLE = ['RUB', 'BTC', 'ETH', 'USDT']

const INITIAL_CURRENCIES: Currency[] = [
  {
    id: 'RUB',
    name: 'Российский рубль',
    symbol: '₽',
    bgColor: 'bg-[#28c281]',
    textColor: 'text-white',
    icon: '₽',
    isVisible: true,
  },
  // Add other currencies here if needed
]

const INITIAL_CRYPTOS = [
  {
    id: 'BTC',
    name: 'Bitcoin',
    symbol: 'BTC',
    bgColor: 'bg-orange-500',
    textColor: 'text-white',
    icon: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    isVisible: true,
  },
  {
    id: 'ETH',
    name: 'Ethereum',
    symbol: 'ETH',
    bgColor: 'bg-blue-500',
    textColor: 'text-white',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
    isVisible: true,
  },
  {
    id: 'USDT',
    name: 'Tether',
    symbol: 'USDT',
    bgColor: 'bg-green-500',
    textColor: 'text-white',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
    isVisible: true,
  },
  // Add other cryptos here if needed
]

export default function Home() {
  const [balance] = useState('0.00$')
  const [userId, setUserId] = useState<string>('0')
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [cryptos, setCryptos] = useState<Crypto[]>([])
  const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number }>({})
  const params = useParams()
  const pairId = decodeURIComponent(params.pair as string)

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const userIdFromUrl = searchParams.get('user_id') || '0'
    setUserId(userIdFromUrl)
  }, [])

  // Fetch exchange rates
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch('https://open.er-api.com/v6/latest/USD')
        const data: { rates: { [key: string]: number } } = await response.json()
        setExchangeRates(data.rates)
      } catch (error) {
        console.error('Error fetching exchange rates:', error)
      }
    }
    fetchRates()
  }, [])

  // Load saved settings
  useEffect(() => {
    const savedCurrencies = localStorage.getItem('currencies')
    const savedCryptos = localStorage.getItem('cryptos')

    if (savedCurrencies) {
      const parsedCurrencies = JSON.parse(savedCurrencies)
      setCurrencies(
        parsedCurrencies.map((c: any) => ({
          ...c,
          rate: `${exchangeRates[c.id]?.toFixed(2) || '0.00'}${c.symbol}`,
          balance: `0.00${c.symbol}`,
          icon: <span className="text-lg text-white">{c.icon}</span>,
        })),
      )
    } else {
      setCurrencies(
        INITIAL_CURRENCIES.map((c) => ({
          ...c,
          rate: `${exchangeRates[c.id]?.toFixed(2) || '0.00'}${c.symbol}`,
          balance: `0.00${c.symbol}`,
          icon: <span className="text-lg text-white">{c.icon}</span>,
        })),
      )
    }
  }, [exchangeRates])

  useEffect(() => {
    // Clean expired transactions
    const interval = setInterval(() => {
      const now = Date.now()
      setTransactions((prev) => prev.filter((t) => t.expiryTime > now))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Fetch pair data
    const fetchPair = async () => {
      // Fetch pair data logic here
    }

    fetchPair()
  }, [pairId])

  // const formatDuration = (duration: string) => {
  //   const ms = DURATION_MAP[duration]
  //   const minutes = Math.floor(ms / 60000)
  //   const seconds = Math.floor((ms % 60000) / 1000)
  //   return `${minutes}:${seconds.toString().padStart(2, '0')}`
  // }

  return (
    <main className="pb-20">
      <div className="p-4 space-y-6">
        <div className="text-center">
          <div className="text-sm text-gray-700">Общий баланс</div>
          <div className="text-2xl font-bold text-black">{balance}</div>
          <div className="flex justify-center gap-8 mt-4">
            <button className="flex flex-col items-center text-blue-500">
              <div className="p-2 rounded-full bg-blue-500/10">
                <ArrowUpFromLine className="h-6 w-6" />
              </div>
              <span className="text-sm mt-1">Пополнить</span>
            </button>
            <button className="flex flex-col items-center text-blue-500">
              <div className="p-2 rounded-full bg-blue-500/10">
                <ArrowDownToLine className="h-6 w-6" />
              </div>
              <span className="text-sm mt-1">Вывести</span>
            </button>
            <button className="flex flex-col items-center text-blue-500">
              <div className="p-2 rounded-full bg-blue-500/10">
                <RefreshCcw className="h-6 w-6" />
              </div>
              <span className="text-sm mt-1">Обменять</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm text-blue-500/80">Профиль</div>
          <div className="p-3 rounded bg-ededed">
            <div className="text-gray-900">{userId}</div>
            <div className="text-gray-600 text-sm">ID аккаунта</div>
          </div>
          <div className="p-3 rounded bg-ededed">
            <div className="flex items-center gap-2 text-gray-900">
              <span>0</span>
              <span>/</span>
              <span className="text-green-500">0</span>
              <span>/</span>
              <span className="text-red-500">0</span>
            </div>
            <div className="text-gray-600 text-sm">Статистика</div>
          </div>
          <div className="p-3 rounded bg-ededed">
            <div className="text-gray-900">0,00 USDT</div>
            <div className="text-gray-600 text-sm">Объем торгов</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm text-blue-500/80">Валютные счета</div>
          <div className="space-y-2">
            {currencies
              .filter((currency) => currency.isVisible)
              .map((currency) => (
                <div
                  key={currency.id}
                  className="flex items-center justify-between p-3 rounded bg-ededed"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden ${currency.bgColor}`}
                    >
                      {currency.icon}
                    </div>
                    <div>
                      <div className="text-gray-900">{currency.name}</div>
                      <div className="text-sm text-gray-600">{currency.rate}</div>
                    </div>
                  </div>
                  <div className="text-gray-900">{currency.balance}</div>
                </div>
              ))}
          </div>
          <Link
            href="/settings?type=currencies"
            className="flex items-center justify-center gap-2 p-3 text-gray-600 hover:text-gray-900 rounded bg-gray-100"
          >
            <Settings2 className="w-5 h-5" />
            <span className="text-sm">Настроить</span>
          </Link>
        </div>

        <div className="space-y-3">
          <div className="text-sm text-blue-500/80">Криптовалюты</div>
          <div className="space-y-2">
            {cryptos
              .filter((crypto) => crypto.isVisible)
              .map((crypto) => (
                <div
                  key={crypto.id}
                  className="flex items-center justify-between p-3 rounded bg-ededed"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
                      <Image
                        src={crypto.icon}
                        alt={crypto.name}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-gray-900">{crypto.name}</div>
                      <div className="text-sm text-gray-600">${crypto.price.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="text-gray-900">{crypto.balance}</div>
                </div>
              ))}
          </div>
          <Link
            href="/settings?type=cryptos"
            className="flex items-center justify-center gap-2 p-3 text-gray-600 hover:text-gray-900 rounded bg-gray-100"
          >
            <Settings2 className="w-5 h-5" />
            <span className="text-sm">Настроить</span>
          </Link>
        </div>
      </div>
      <Navigation />
    </main>
  )
}
