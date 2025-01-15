'use client'

import { Suspense, useState, useEffect } from 'react'
import { Eye, EyeOff, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'

interface Item {
  id: string
  name: string
  subtitle: string
  symbol: string
  icon: string
  bgColor: string
  isVisible: boolean
}

const DEFAULT_VISIBLE = ['RUB', 'BTC', 'ETH', 'USDT']

const INITIAL_CURRENCIES: Item[] = [
  {
    id: 'RUB',
    name: 'Российский рубль',
    subtitle: 'RUB',
    symbol: '₽',
    icon: '₽',
    bgColor: 'bg-[#28c281]',
    isVisible: true,
  },
  {
    id: 'KZT',
    name: 'Казахстанский тенге',
    subtitle: 'KZT',
    symbol: '₸',
    icon: '₸',
    bgColor: 'bg-[#28c281]',
    isVisible: false,
  },
  {
    id: 'BYN',
    name: 'Белорусский рубль',
    subtitle: 'BYN',
    symbol: 'Br',
    icon: 'Br',
    bgColor: 'bg-[#28c281]',
    isVisible: false,
  },
]

const INITIAL_CRYPTOS: Item[] = [
  {
    id: 'BTC',
    name: 'Bitcoin',
    subtitle: 'BTC',
    symbol: 'BTC',
    icon: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    bgColor: 'bg-orange-500',
    isVisible: true,
  },
  {
    id: 'ETH',
    name: 'Ethereum',
    subtitle: 'ETH',
    symbol: 'ETH',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
    bgColor: 'bg-blue-500',
    isVisible: true,
  },
  {
    id: 'USDT',
    name: 'Tether',
    subtitle: 'USDT',
    symbol: 'USDT',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
    bgColor: 'bg-green-500',
    isVisible: true,
  },
  {
    id: 'TON',
    name: 'Toncoin',
    subtitle: 'TON',
    symbol: 'TON',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/11419.png',
    bgColor: 'bg-blue-500',
    isVisible: false,
  },
  {
    id: 'USDC',
    name: 'USD Coin',
    subtitle: 'USDC',
    symbol: 'USDC',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
    bgColor: 'bg-blue-500',
    isVisible: false,
  },
  {
    id: 'BNB',
    name: 'BNB',
    subtitle: 'BNB',
    symbol: 'BNB',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
    bgColor: 'bg-yellow-500',
    isVisible: false,
  },
  {
    id: 'SOL',
    name: 'Solana',
    subtitle: 'SOL',
    symbol: 'SOL',
    icon: 'https://assets.coingecko.com/coins/images/4128/standard/solana.png?1718769756',
    bgColor: 'bg-purple-500',
    isVisible: false,
  },
  {
    id: 'DOGE',
    name: 'Dogecoin',
    subtitle: 'DOGE',
    symbol: 'DOGE',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/74.png',
    bgColor: 'bg-yellow-400',
    isVisible: false,
  },
  {
    id: 'ADA',
    name: 'Cardano',
    subtitle: 'ADA',
    symbol: 'ADA',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png',
    bgColor: 'bg-blue-400',
    isVisible: false,
  },
  {
    id: 'TRX',
    name: 'Tron',
    subtitle: 'TRX',
    symbol: 'TRX',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png',
    bgColor: 'bg-red-500',
    isVisible: false,
  },
  {
    id: 'DOT',
    name: 'Polkadot',
    subtitle: 'DOT',
    symbol: 'DOT',
    icon: 'https://s2.coinmarketcap.com/static/cloud/img/logo/polkadot/Polkadot_Logo_Animation_64x64.gif',
    bgColor: 'bg-pink-500',
    isVisible: false,
  },
  {
    id: 'LINK',
    name: 'Chainlink',
    subtitle: 'LINK',
    symbol: 'LINK',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1975.png',
    bgColor: 'bg-blue-600',
    isVisible: false,
  },
  {
    id: 'LTC',
    name: 'Litecoin',
    subtitle: 'LTC',
    symbol: 'LTC',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2.png',
    bgColor: 'bg-gray-400',
    isVisible: false,
  },
  {
    id: 'UNI',
    name: 'Uniswap',
    subtitle: 'UNI',
    symbol: 'UNI',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png',
    bgColor: 'bg-pink-500',
    isVisible: false,
  },
  {
    id: 'ETC',
    name: 'Ethereum Classic',
    subtitle: 'ETC',
    symbol: 'ETC',
    icon: 'https://assets.coingecko.com/coins/images/453/standard/ethereum-classic-logo.png?1696501717',
    bgColor: 'bg-green-600',
    isVisible: false,
  },
  {
    id: 'APT',
    name: 'Aptos',
    subtitle: 'APT',
    symbol: 'APT',
    icon: 'https://assets.coingecko.com/coins/images/26455/standard/aptos_round.png?1696525528',
    bgColor: 'bg-blue-500',
    isVisible: false,
  },
  {
    id: 'FIL',
    name: 'Filecoin',
    subtitle: 'FIL',
    symbol: 'FIL',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2280.png',
    bgColor: 'bg-green-400',
    isVisible: false,
  },
  {
    id: 'RENDER',
    name: 'Render',
    subtitle: 'RENDER',
    symbol: 'RENDER',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5690.png',
    bgColor: 'bg-blue-300',
    isVisible: false,
  },
  {
    id: 'ATOM',
    name: 'Cosmos',
    subtitle: 'ATOM',
    symbol: 'ATOM',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3794.png',
    bgColor: 'bg-purple-600',
    isVisible: false,
  },
  {
    id: 'SUI',
    name: 'Sui',
    subtitle: 'SUI',
    symbol: 'SUI',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/20947.png',
    bgColor: 'bg-blue-400',
    isVisible: false,
  },
  {
    id: 'OP',
    name: 'Optimism',
    subtitle: 'OP',
    symbol: 'OP',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/11840.png',
    bgColor: 'bg-red-500',
    isVisible: false,
  },
  {
    id: 'GRT',
    name: 'The Graph',
    subtitle: 'GRT',
    symbol: 'GRT',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/6719.png',
    bgColor: 'bg-indigo-500',
    isVisible: false,
  },
  {
    id: 'AAVE',
    name: 'Aave',
    subtitle: 'AAVE',
    symbol: 'AAVE',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7278.png',
    bgColor: 'bg-purple-400',
    isVisible: false,
  },
  {
    id: 'NOT',
    name: 'Notcoin',
    subtitle: 'NOT',
    symbol: 'NOT',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/28850.png',
    bgColor: 'bg-yellow-300',
    isVisible: false,
  },
]

type Language = 'ru' | 'en'

const translations = {
  favorites: {
    ru: 'Избранное',
    en: 'Favorites',
  },
  fiatAccounts: {
    ru: 'Валютные счета',
    en: 'Fiat Accounts',
  },
  cryptocurrencies: {
    ru: 'Криптовалюты',
    en: 'Cryptocurrencies',
  },
  currencyNames: {
    RUB: {
      ru: 'Российский рубль',
      en: 'Russian Ruble',
    },
    KZT: {
      ru: 'Казахстанский тенге',
      en: 'Kazakhstani Tenge',
    },
    BYN: {
      ru: 'Белорусский рубль',
      en: 'Belarusian Ruble',
    },
  },
}

function SettingsContent() {
  const searchParams = useSearchParams()
  const type = searchParams ? searchParams.get('type') : null

  const [currencies, setCurrencies] = useState<Item[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('currencies')
      if (saved) {
        return JSON.parse(saved)
      }
    }
    return INITIAL_CURRENCIES.map((c) => ({ ...c, isVisible: DEFAULT_VISIBLE.includes(c.id) }))
  })

  const [cryptos, setCryptos] = useState<Item[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cryptos')
      if (saved) {
        return JSON.parse(saved)
      }
    }
    return INITIAL_CRYPTOS.map((c) => ({ ...c, isVisible: DEFAULT_VISIBLE.includes(c.id) }))
  })

  useEffect(() => {
    localStorage.setItem('currencies', JSON.stringify(currencies))
  }, [currencies])

  useEffect(() => {
    localStorage.setItem('cryptos', JSON.stringify(cryptos))
  }, [cryptos])

  const toggleVisibility = (id: string, type: 'currency' | 'crypto') => {
    const setter = type === 'currency' ? setCurrencies : setCryptos
    setter((current) => {
      const updated = current.map((item) =>
        item.id === id ? { ...item, isVisible: !item.isVisible } : item,
      )
      localStorage.setItem(type === 'currency' ? 'currencies' : 'cryptos', JSON.stringify(updated))
      return updated
    })
  }

  return (
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
                  <div
                    className={`w-8 h-8 ${
                      currency.isVisible ? 'bg-[#28c281]' : 'bg-gray-400'
                    } rounded-full flex items-center justify-center text-white`}
                  >
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
                  <div className="w-8 h-8 flex items-center justify-center overflow-hidden">
                    <Image
                      src={crypto.icon || '/placeholder.svg'}
                      alt={crypto.name}
                      width={24}
                      height={24}
                      className="object-cover"
                    />
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
                  {crypto.isVisible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function SettingsPage() {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('preferred-language') as Language) || 'ru'
    }
    return 'ru'
  })

  const searchParams = useSearchParams()
  const type = searchParams ? searchParams.get('type') : null

  const [currencies, setCurrencies] = useState<Item[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('currencies')
      if (saved) {
        return JSON.parse(saved)
      }
    }
    return INITIAL_CURRENCIES.map((c) => ({ ...c, isVisible: DEFAULT_VISIBLE.includes(c.id) }))
  })

  const [cryptos, setCryptos] = useState<Item[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cryptos')
      if (saved) {
        return JSON.parse(saved)
      }
    }
    return INITIAL_CRYPTOS.map((c) => ({ ...c, isVisible: DEFAULT_VISIBLE.includes(c.id) }))
  })

  useEffect(() => {
    localStorage.setItem('currencies', JSON.stringify(currencies))
  }, [currencies])

  useEffect(() => {
    localStorage.setItem('cryptos', JSON.stringify(cryptos))
  }, [cryptos])

  const toggleVisibility = (id: string, type: 'currency' | 'crypto') => {
    const setter = type === 'currency' ? setCurrencies : setCryptos
    setter((current) => {
      const updated = current.map((item) =>
        item.id === id ? { ...item, isVisible: !item.isVisible } : item,
      )
      localStorage.setItem(type === 'currency' ? 'currencies' : 'cryptos', JSON.stringify(updated))
      return updated
    })
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center p-4">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h1 className="ml-4 text-xl font-medium text-gray-900">BTSE Trade</h1>
        </div>
      </div>
      <div className="pt-16 p-4">
        <h2 className="text-sm text-gray-500 mb-4">{translations.favorites[language]}</h2>

        {type === 'currencies' && (
          <div>
            <h3 className="text-sm text-blue-500/80">{translations.fiatAccounts[language]}</h3>
            <div className="space-y-2">
              {currencies.map((currency) => (
                <div
                  key={currency.id}
                  className="flex items-center justify-between p-3 rounded bg-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 ${
                        currency.isVisible ? 'bg-[#28c281]' : 'bg-gray-400'
                      } rounded-full flex items-center justify-center text-white`}
                    >
                      <span className="text-lg">{currency.icon}</span>
                    </div>
                    <div>
                      <div className="text-gray-900">{currency.id}</div>
                      <div className="text-sm text-gray-500">
                        {
                          translations.currencyNames[
                            currency.id as keyof typeof translations.currencyNames
                          ][language]
                        }
                      </div>
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
            <h3 className="text-sm text-blue-500/80 mb-2">
              {translations.cryptocurrencies[language]}
            </h3>
            <div className="space-y-2">
              {cryptos.map((crypto) => (
                <div
                  key={crypto.id}
                  className="flex items-center justify-between p-3 rounded bg-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center overflow-hidden">
                      <Image
                        src={crypto.icon || '/placeholder.svg'}
                        alt={crypto.name}
                        width={24}
                        height={24}
                        className="object-cover"
                      />
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
