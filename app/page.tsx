'use client'
"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !window.Telegram) {
      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-web-app.js";
      script.async = true;
      script.onload = () => setIsSdkLoaded(true);
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    } else {
      setIsSdkLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isSdkLoaded && window.Telegram?.WebApp) {
      console.log("✅ Telegram WebApp SDK загружен");
      window.Telegram.WebApp.expand(); // Разворачиваем MiniApp
    }
  }, [isSdkLoaded]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1>🔥 Добро пожаловать в MiniApp!</h1>
    </div>
  );
}

import { CryptoId } from "@/app/types/app";
import { useState, useEffect } from 'react'
import Navigation from "@/components/navigation";
import { DepositModal } from '@/components/deposit-modal'
import { ExchangeModal } from '@/components/exchange-modal'
import { ArrowUpFromLine, ArrowDownToLine, RefreshCcw, Settings2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { LanguageSwitcher } from '@/components/language-switcher'
import { homeTranslations } from '@/utils/home-translations'
import { WithdrawModal } from '@/components/withdraw-modal'

type Language = 'ru' | 'en'
type CurrencyId = 'RUB' | 'KZT' | 'BYN'

interface Currency {
  id: CurrencyId
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
  subtitle: string
  symbol: string
  balance?: number
  price?: number
  change?: number
  bgColor: string
  textColor?: string
  icon: string
  isVisible: boolean
}

const DEFAULT_VISIBLE: CurrencyId[] = ['RUB']
const DEFAULT_VISIBLE_CRYPTO = ['BTC', 'ETH', 'USDT']

const INITIAL_CURRENCIES: Omit<Currency, 'rate' | 'balance'>[] = [
  {
    id: 'RUB',
    name: 'Российский рубль',
    symbol: '₽',
    bgColor: 'bg-[#28c281]',
    textColor: 'text-white',
    icon: '₽',
    isVisible: true,
  },
  {
    id: 'KZT',
    name: 'Казахстанский тенге',
    symbol: '₸',
    bgColor: 'bg-[#28c281]',
    textColor: 'text-white',
    icon: '₸',
    isVisible: false,
  },
  {
    id: 'BYN',
    name: 'Белорусский рубль',
    symbol: 'Br',
    bgColor: 'bg-[#28c281]',
    textColor: 'text-white',
    icon: 'Br',
    isVisible: false,
  },
]

const INITIAL_CRYPTOS: Omit<Crypto, 'balance' | 'price' | 'change'>[] = [
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
]

export default function Home() {
  const [balance] = useState('0.00$')
  const [userId, setUserId] = useState<string>('0')
  const [tradeAllowed, setTradeAllowed] = useState<boolean | null>(null);
  const [canTrade, setCanTrade] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true)
  const [language, setLanguage] = useState<Language>('ru')
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false)
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)

  const [currencies, setCurrencies] = useState<Currency[]>(() =>
    INITIAL_CURRENCIES.map((c) => ({
      ...c,
      rate: `0.00${c.symbol}`,
      balance: '0.00',
      isVisible: DEFAULT_VISIBLE.includes(c.id),
    })),
  )

  const [cryptos, setCryptos] = useState<Crypto[]>(() =>
    INITIAL_CRYPTOS.map((c) => ({
      ...c,
      balance: 0,
      price: 0,
      change: 0,
      isVisible: DEFAULT_VISIBLE_CRYPTO.includes(c.id),
    })),
  )

useEffect(() => {
  const initializeApp = async () => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const userIdFromUrl = searchParams.get("user_id") || "0";
      setUserId(userIdFromUrl);

      // Если userId === "0", разрешаем использование
      if (userIdFromUrl === "0") {
        setTradeAllowed(true);
        setIsLoading(false);
        return;
      }

      console.log("🚀 Запрос к /api/checkTrade", userIdFromUrl);
      const response = await fetch(`/api/checkTrade?user_id=${userIdFromUrl}`);
      const data = await response.json();
      console.log("✅ Ответ API:", data);

      // Если торговля запрещена, закрываем MiniApp
      if (!data.trade_allowed) {
        console.warn("⛔️ Торговля запрещена! Закрываем MiniApp...");

        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.close(); // Закрываем MiniApp в Telegram
        } else {
          alert("🚫 Вам запрещено использовать приложение.");
          window.location.href = "tg://resolve?domain=cryptradebtse_bot"; // Возвращаем в Telegram
        }

        return;
      }

      setTradeAllowed(true);
    } catch (error) {
      console.error("❌ Ошибка при проверке статуса торговли:", error);
      setTradeAllowed(true);
    } finally {
      setIsLoading(false);
    }
  };

  initializeApp();
}, []);


  // Показываем лоадер во время загрузки
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Загрузка...</div>;
  }

  // Показываем сообщение о запрете только если точно известно что торговля запрещена
  if (tradeAllowed === false) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-5 text-xl text-red-500">
          🚫 Вам запрещено использовать приложение!
        </div>
      </div>
    );
  }


// Показываем лоадер во время загрузки
  return (
    <div className="relative min-h-screen">
      <main className="pb-20">
        <div className="fixed top-4 right-4 z-10">
          <LanguageSwitcher language={language} onChange={setLanguage} />
        </div>

        <div className="p-4 space-y-6">
          {/* Balance section */}
          <div className="text-center">
            <div className="text-sm text-gray-700">
              {homeTranslations.totalBalance[language]}
            </div>
            <div className="text-2xl font-bold text-black">{balance}</div>
            <div className="flex justify-center gap-8 mt-4">
              <button
                className="flex flex-col items-center text-blue-500"
                onClick={() => setIsDepositModalOpen(true)}
              >
                <div className="p-2 rounded-full bg-blue-500/10">
                  <ArrowUpFromLine className="h-6 w-6" />
                </div>
                <span className="text-sm mt-1">{homeTranslations.deposit[language]}</span>
              </button>

              <button
                className="flex flex-col items-center text-blue-500"
                onClick={() => setIsWithdrawModalOpen(true)}
              >
                <div className="p-2 rounded-full bg-blue-500/10">
                  <ArrowDownToLine className="h-6 w-6" />
                </div>
                <span className="text-sm mt-1">{homeTranslations.withdraw[language]}</span>
              </button>

              <button
                className="flex flex-col items-center text-blue-500"
                onClick={() => setIsExchangeModalOpen(true)}
              >
                <div className="p-2 rounded-full bg-blue-500/10">
                  <RefreshCcw className="h-6 w-6" />
                </div>
                <span className="text-sm mt-1">{homeTranslations.exchange[language]}</span>
              </button>
            </div>
          </div>
        </div>

        {/* User profile section */}
        <div className="space-y-3">
          <div className="text-sm text-blue-500/80">{homeTranslations.profile[language]}</div>
          <div className="p-3 rounded bg-ededed">
            <div className="text-gray-900">{userId}</div>
            <div className="text-gray-600 text-sm">{homeTranslations.accountId[language]}</div>
          </div>
          <div className="p-3 rounded bg-ededed">
            <div className="flex items-center gap-2 text-gray-900">
              <span>0</span>
              <span>/</span>
              <span className="text-green-500">0</span>
              <span>/</span>
              <span className="text-red-500">0</span>
            </div>
            <div className="text-gray-600 text-sm">{homeTranslations.statistics[language]}</div>
          </div>
          <div className="p-3 rounded bg-ededed">
            <div className="text-gray-900">0,00 USDT</div>
            <div className="text-gray-600 text-sm">{homeTranslations.tradingVolume[language]}</div>
          </div>
        </div>

        {/* Currency accounts section */}
        <div className="space-y-3">
          <div className="text-sm text-blue-500/80">{homeTranslations.fiatAccounts[language]}</div>
          <div className="space-y-2">
            {currencies.filter((currency) => currency.isVisible).map((currency) => (
              <div key={currency.id} className="flex items-center justify-between p-3 rounded bg-ededed">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden shadow-sm ${currency.bgColor}`}>
                    {currency.icon}
                  </div>
                  <div>
                    <div className="text-gray-900">
                      {homeTranslations.currencyNames[currency.id as CurrencyId]?.[language] || currency.name}
                    </div>
                    <div className="text-sm text-gray-600">{currency.rate}</div>
                  </div>
                </div>
                <div className="text-gray-900">{`${currency.balance}${currency.symbol}`}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Cryptocurrencies section */}
        <div className="space-y-3">
          <div className="text-sm text-blue-500/80">{homeTranslations.cryptocurrencies[language]}</div>
          <div className="space-y-2">
            {cryptos.filter((crypto) => crypto.isVisible).map((crypto) => (
              <div key={crypto.id} className="flex items-center justify-between p-3 rounded bg-ededed">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden shadow-sm bg-white">
                    <Image src={crypto.icon || '/placeholder.svg'} alt={crypto.name} width={32} height={32} className="object-cover" />
                  </div>
                  <div>
                    <div className="text-gray-900">{crypto.name}</div>
                    <div className="text-sm text-gray-600">${crypto.price?.toFixed(2) || '0.00'}</div>
                  </div>
                </div>
                <div className="text-gray-900">{crypto.balance || 0}</div>
              </div>
            ))}
          </div>
        </div>

        <DepositModal
          isOpen={isDepositModalOpen}
          onClose={() => setIsDepositModalOpen(false)}
          language={language}
        />

        <WithdrawModal
          isOpen={isWithdrawModalOpen}
          onClose={() => setIsWithdrawModalOpen(false)}
        />

        <ExchangeModal
          isOpen={isExchangeModalOpen}
          onClose={() => setIsExchangeModalOpen(false)}
          fromCurrency={{
            ...currencies[0],
            icon: currencies[0]?.icon?.toString() ?? '₽'
          }}
          toCurrency={{
            ...cryptos[0],
            id: (cryptos[0]?.id as CryptoId) ?? 'BTC',
            balance: cryptos[0]?.balance ?? 0,
            price: cryptos[0]?.price ?? 0,
            change: cryptos[0]?.change ?? 0,
            textColor: cryptos[0]?.textColor ?? '#000000'
          }}
        />

        {/* Navigation */}
        <div className="relative z-10">
          <Navigation />
        </div>
      </main>
    </div>
  );
}
