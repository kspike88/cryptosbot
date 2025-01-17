'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowUpDown } from 'lucide-react'
import Image from 'next/image'
import type { Currency, Crypto, ExchangeModalProps } from '@/app/types/app'
import { translations } from '@/utils/translations'

export function ExchangeModal({ isOpen, onClose, fromCurrency, toCurrency }: ExchangeModalProps) {
  const [amount, setAmount] = useState('')
  const [from, setFrom] = useState(fromCurrency)
  const [to, setTo] = useState(toCurrency)

  if (!isOpen) return null

  const handleSwap = () => {
    const temp = from
    setFrom(to)
    setTo(temp)
  }

  return (
    <div className="fixed inset-0 bg-white z-50">
      <div className="flex flex-col h-full">
        <div className="sticky top-0 flex items-center p-4 border-b border-gray-100">
          <button onClick={onClose} className="text-gray-600">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h2 className="ml-4 text-xl font-medium text-gray-900">
            {translations.exchangeTitle.ru} {from.symbol} на {to.symbol}
          </h2>
        </div>

        <div className="p-4 flex-1">
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden">
                  {'icon' in from ? (
                    <Image
                      src={from.icon || "/placeholder.svg"}
                      alt={from.name}
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  ) : (
                    <span className="text-xl">banana</span>
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{from.symbol}</div>
                  <div className="text-sm text-gray-500">{from.name}</div>
                </div>
              </div>
              <div className="mt-2">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full text-4xl bg-transparent text-gray-900 outline-none"
                  placeholder="0"
                />
                <div className="text-sm text-gray-500">Balance: 0.00 {from.symbol}</div>
              </div>
            </div>

            <button
              onClick={handleSwap}
              className="mx-auto flex items-center justify-center w-10 h-10 rounded-full bg-gray-100"
            >
              <ArrowUpDown className="h-5 w-5 text-gray-600" />
            </button>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden">
                  {'icon' in to ? (
                    <Image
                      src={to.icon || "/placeholder.svg"}
                      alt={to.name}
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  ) : (
                    <span className="text-xl">pineapple</span>
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{to.symbol}</div>
                  <div className="text-sm text-gray-500">{to.name}</div>
                </div>
              </div>
              <div className="mt-2">
                <div className="text-4xl text-gray-400">0</div>
                <div className="text-sm text-gray-500">Balance: 0.00 {to.symbol}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t">
          <button className="w-full py-4 bg-blue-500 text-white rounded-xl font-medium">
            {translations.continue.ru}
          </button>
        </div>
      </div>
    </div>
  )
}

