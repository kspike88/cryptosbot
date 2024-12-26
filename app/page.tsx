"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { ArrowUpFromLine, ArrowDownToLine, RefreshCcw, Bitcoin, CircleDollarSign, Coins } from 'lucide-react'

interface Currency {
  name: string
  symbol: string
  rate: string
  balance: string
  bgColor: string
  textColor: string
  icon: React.ReactNode
}

interface Crypto {
  name: string
  balance: number
  price: string
  bgColor: string
  textColor: string
  icon: React.ReactNode
}

export default function Home() {
  const [balance] = useState("0.00$")
  const [userId, setUserId] = useState<string>('0')
  const [currencies] = useState<Currency[]>([
    {
      name: "Российский рубль",
      symbol: "₽",
      rate: "104.92₽",
      balance: "0.00₽",
      bgColor: "bg-green-500",
      textColor: "text-green-500",
      icon: <span className="text-lg">₽</span>
    }
  ])
  
  const [cryptos] = useState<Crypto[]>([
    {
      name: "Bitcoin",
      balance: 0,
      price: "$0.00",
      bgColor: "bg-orange-500",
      textColor: "text-orange-500",
      icon: <Bitcoin className="w-5 h-5" />
    },
    {
      name: "Tether",
      balance: 0,
      price: "$0.00",
      bgColor: "bg-sky-500",
      textColor: "text-sky-500",
      icon: <CircleDollarSign className="w-5 h-5" />
    },
    {
      name: "Toncoin",
      balance: 0,
      price: "$0.00",
      bgColor: "bg-blue-500",
      textColor: "text-blue-500",
      icon: <Coins className="w-5 h-5" />
    }
  ])

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const userIdFromUrl = searchParams.get('user_id') || '0'
    setUserId(userIdFromUrl)
  }, [])
  
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
            {currencies.map((currency) => (
              <div 
                key={currency.name} 
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
        </div>

        <div className="space-y-3">
          <div className="text-sm text-blue-500/80">Криптовалюты</div>
          <div className="space-y-2">
            {cryptos.map((crypto) => (
              <div 
                key={crypto.name} 
                className="flex items-center justify-between p-3 rounded bg-ededed"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 ${crypto.bgColor} rounded-full flex items-center justify-center text-white`}>
                    {crypto.icon}
                  </div>
                  <div>
                    <div className="text-gray-900">{crypto.name}</div>
                    <div className="text-sm text-gray-600">{crypto.price}</div>
                  </div>
                </div>
                <div className="text-gray-900">{crypto.balance}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Navigation />
    </main>
  )
}