'use client'

import { useState } from 'react'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import type { Language, DepositCurrency, CurrencyId } from '@/app/types/app'
import { translations } from '@/utils/translations'
// import CryptoBotIcon from '@/public/cb.webp'

interface DepositModalProps {
  isOpen: boolean
  onClose: () => void
  language: Language
}

const FIAT_CURRENCIES: DepositCurrency[] = [
  {
    id: 'RUB' as const,
    name: 'Российский рубль',
    symbol: '₽',
    icon: '/rub-icon.svg',
    shortName: 'RUB',
  },
  {
    id: 'KZT' as const,
    name: 'Казахстанский тенге',
    symbol: '₸',
    icon: '/kzt-icon.svg',
    shortName: 'KZT',
  },
  {
    id: 'BYN' as const,
    name: 'Белорусский рубль',
    symbol: 'Br',
    icon: '/byn-icon.svg',
    shortName: 'BYN',
  },
]

const CRYPTO_CURRENCIES: DepositCurrency[] = [
  {
    id: 'BTC',
    name: 'Bitcoin',
    symbol: 'BTC',
    icon: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
  },
  {
    id: 'ETH',
    name: 'Ethereum',
    symbol: 'ETH',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
  },
  {
    id: 'USDT',
    name: 'Tether',
    symbol: 'USDT',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
  },
]

function isFiatCurrency(id: string): id is CurrencyId {
  return ['RUB', 'KZT', 'BYN'].includes(id)
}

export function DepositModal({ isOpen, onClose, language }: DepositModalProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<DepositCurrency | null>(null)
  const [amount, setAmount] = useState<string>('')
  const [isExpanded, setIsExpanded] = useState(false)

  const getCurrencyName = (currency: DepositCurrency) => {
    if (isFiatCurrency(currency.id)) {
      return translations.currencyNames?.[currency.id]?.[language] || currency.name
    }
    return currency.name
  }

  const handleCurrencySelect = (currency: DepositCurrency) => {
    setSelectedCurrency(currency)
  }

  const handleBack = () => {
    if (selectedCurrency) {
      setSelectedCurrency(null)
      setAmount('')
    } else if (isExpanded) {
      setIsExpanded(false)
    } else {
      onClose()
    }
  }

  const handleContinue = async () => {
    if (!selectedCurrency || !amount) {
      toast.error('Выберите валюту и укажите сумму')
      return
    }

    try {
      const response = await fetch('/api/createInvoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          asset: selectedCurrency.id,
          amount: Number(amount),
          description: `Пополнение баланса на ${amount} ${selectedCurrency.symbol}`,
          hidden_message: `Пополнение через BTSEPrime_bot`,
          paid_btn_name: 'openBot',
          paid_btn_url: `https://t.me/BTSEPrime_bot`,
        }),
      })

      const data = await response.json()

      if (data.ok && data.result.pay_url) {
        window.open(data.result.pay_url, '_blank')
        toast.success('Переход в CryptoBot для оплаты')
      } else {
        toast.error(data.error || 'Ошибка при создании платежа')
      }
    } catch (error) {
      console.error('Ошибка создания инвойса:', error)
      toast.error('Ошибка при создании платежа')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-white z-50">
      <div className="flex flex-col h-full">
        <div className="sticky top-0 flex items-center p-4 border-b border-gray-100">
          <button onClick={handleBack} className="text-gray-600">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h2 className="ml-4 text-xl font-medium text-gray-900">
            {selectedCurrency
              ? `${translations.youAreDepositing?.[language] || 'You are depositing'} ${selectedCurrency.id}`
              : translations.whatToDeposit?.[language] || 'What to deposit'
            }
          </h2>
        </div>

        <div className="flex-1 overflow-auto bg-[#fffff] p-4">
          {!selectedCurrency ? (
            <div className="space-y-4">
              <div className="space-y-2">
                {FIAT_CURRENCIES.slice(0, isExpanded ? undefined : 1).map((currency) => (
                  <button
                    key={currency.id}
                    className="w-full flex items-center justify-between p-4 rounded-lg bg-white hover:bg-gray-50 transition-colors cursor-pointer border border-gray-100"
                    onClick={() => handleCurrencySelect(currency)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-xl">
                        {currency.symbol}
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">{currency.id}</div>
                        <div className="text-sm text-gray-600">
                          {getCurrencyName(currency)}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                ))}

                {!isExpanded && FIAT_CURRENCIES.length > 1 && (
                  <button
                    onClick={() => setIsExpanded(true)}
                    className="w-full text-center py-2 text-blue-500"
                  >
                    {language === 'ru' ? 'Показать все' : 'Show all'}
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {CRYPTO_CURRENCIES.map((currency) => (
                  <button
                    key={currency.id}
                    className="w-full flex items-center justify-between p-4 rounded-lg bg-white hover:bg-gray-50 transition-colors cursor-pointer border border-gray-100"
                    onClick={() => handleCurrencySelect(currency)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-white flex items-center justify-center">
                        <Image
                          src={currency.icon || '/placeholder.svg'}
                          alt={currency.name}
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">{currency.id}</div>
                        <div className="text-sm text-gray-600">{currency.name}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-4">
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-5xl bg-transparent text-gray-900 w-full outline-none"
                    placeholder="0"
                  />
                  <span className="text-2xl text-gray-500">{selectedCurrency.symbol}</span>
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  {translations.balance?.[language] || 'Balance'}: 0.00 {selectedCurrency.symbol}
                </div>
              </div>

              {isFiatCurrency(selectedCurrency.id) && (
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {[5000, 10000, 15000, 25000].map((value) => (
                    <button
                      key={value}
                      onClick={() => setAmount(value.toString())}
                      className="p-2 rounded-lg bg-gray-50 text-gray-900 hover:bg-gray-100 transition-colors"
                    >
                      {value} {selectedCurrency.symbol}
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-6">
                <div className="p-4 rounded-lg bg-gray-50 mb-4">
                  <div className="text-sm text-gray-500">{translations.paymentMethod?.[language] || 'Payment Method'}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">

                    </div>
                    <div className="text-gray-900">Crypto Bot</div>
                  </div>
                </div>

                {amount && (
                  <button
                    onClick={handleContinue}
                    className="w-full py-4 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
                  >
                    {translations.continue?.[language] || 'Continue → CryptoBot'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
