"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { ArrowUpFromLine, ArrowDownToLine, RefreshCcw, Settings2 } from 'lucide-react'
import Link from 'next/link'

interface Currency {
  id: string
  name: string
  symbol: string
  rate: string
  balance: string
  bgColor: string
  textColor: string
  icon: React.ReactNode
  isVisible: boolean
}

interface Crypto {
  id: string
  name: string
  symbol: string
  balance: number
  price: number
  bgColor: string
  textColor: string
  icon: React.ReactNode
  isVisible: boolean
}

interface SavedCurrency {
  id: string
  name: string
  symbol: string
  icon: string
  isVisible: boolean
}

interface SavedCrypto {
  id: string
  name: string
  symbol: string
  bgColor: string
  textColor: string
  icon: string
  isVisible: boolean
}

export default function Home() {
  const [balance] = useState("0.00$")
  const [userId, setUserId] = useState<string>('0')
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [cryptos, setCryptos] = useState<Crypto[]>([])
  const [exchangeRates, setExchangeRates] = useState<{[key: string]: number}>({})
  
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
        const data = await response.json()
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
    if (savedCurrencies) {
      const parsed = JSON.parse(savedCurrencies) as SavedCurrency[]
      const currencies = parsed.map((c: SavedCurrency) => ({
        ...c,
        rate: `${exchangeRates[c.id]?.toFixed(2) || '0.00'}${c.symbol}`,
        balance: `0.00${c.symbol}`,
        bgColor: 'bg-emerald-500',
        textColor: 'text-emerald-500',
        icon: <span className="text-lg">{c.icon}</span>
      }))
      setCurrencies(currencies)
    }
    
    const savedCryptos = localStorage.getItem('cryptos')
    if (savedCryptos) {
      const parsed = JSON.parse(savedCryptos) as SavedCrypto[]
      const cryptos = parsed.map((c: SavedCrypto) => ({
        ...c,
        balance: 0,
        price: 0,
        icon: <span className="text-lg">{c.icon}</span>
      }))
      setCryptos(cryptos)
    }
  }, [exchangeRates])
  
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
            {currencies.filter(currency => currency.isVisible).map((currency) => (
              <div 
                key={currency.id} 
                className="flex items-center justify-between p-3 rounded bg-ededed"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 ${currency.bgColor} rounded-full flex items-center justify-center text-white`}>
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
            {cryptos.filter(crypto => crypto.isVisible).map((crypto) => (
              <div 
                key={crypto.id} 
                className="flex items-center justify-between p-3 rounded bg-ededed"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 ${crypto.bgColor} rounded-full flex items-center justify-center text-white`}>
                    {crypto.icon}
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

