'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { DepositModal } from '@/components/deposit-modal'
import { ArrowUpFromLine, ArrowDownToLine, RefreshCcw, Settings2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { LanguageSwitcher } from '@/components/language-switcher'

type Language = 'ru' | 'en';
type CurrencyId = 'RUB' | 'KZT' | 'BYN';

interface Translations {
  totalBalance: Record<Language, string>;
  deposit: Record<Language, string>;
  withdraw: Record<Language, string>;
  exchange: Record<Language, string>;
  profile: Record<Language, string>;
  accountId: Record<Language, string>;
  statistics: Record<Language, string>;
  tradingVolume: Record<Language, string>;
  fiatAccounts: Record<Language, string>;
  cryptocurrencies: Record<Language, string>;
  settings: Record<Language, string>;
  currencyNames: {
    [K in CurrencyId]: Record<Language, string>;
  };
}

export const translations: Translations = {
  totalBalance: {
    ru: 'Общий баланс',
    en: 'Total Balance'
  },
  deposit: {
    ru: 'Пополнить',
    en: 'Deposit'
  },
  withdraw: {
    ru: 'Вывести',
    en: 'Withdraw'
  },
  exchange: {
    ru: 'Обмен',
    en: 'Exchange'
  },
  profile: {
    ru: 'Профиль',
    en: 'Profile'
  },
  accountId: {
    ru: 'ID аккаунта',
    en: 'Account ID'
  },
  statistics: {
    ru: 'Статистика',
    en: 'Statistics'
  },
  tradingVolume: {
    ru: 'Объем торгов',
    en: 'Trading Volume'
  },
  fiatAccounts: {
    ru: 'Фиатные счета',
    en: 'Fiat Accounts'
  },
  cryptocurrencies: {
    ru: 'Криптовалюты',
    en: 'Cryptocurrencies'
  },
  settings: {
    ru: 'Настройки',
    en: 'Settings'
  },
  currencyNames: {
    RUB: {
      ru: 'Российский рубль',
      en: 'Russian Ruble'
    },
    KZT: {
      ru: 'Казахстанский тенге',
      en: 'Kazakhstani Tenge'
    },
    BYN: {
      ru: 'Белорусский рубль',
      en: 'Belarusian Ruble'
    }
  }
};

interface Currency {
  id: CurrencyId;
  name: string;
  symbol: string;
  rate: string;
  balance: string;
  bgColor: string;
  textColor: string;
  icon: React.ReactNode;
  isVisible: boolean;
}

interface Crypto {
  id: string;
  name: string;
  symbol: string;
  balance: number;
  price: number;
  change: number;
  bgColor: string;
  textColor: string;
  icon: string;
  isVisible: boolean;
}

const DEFAULT_VISIBLE: CurrencyId[] = ['RUB'];
const DEFAULT_VISIBLE_CRYPTO = ['BTC', 'ETH', 'USDT'];

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
];

const INITIAL_CRYPTOS: Omit<Crypto, 'balance' | 'price' | 'change'>[] = [
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
];

export default function Home() {
  const [balance] = useState('0.00$');
  const [userId, setUserId] = useState<string>('0');
  const [language, setLanguage] = useState<Language>('ru');
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

  const [currencies, setCurrencies] = useState<Currency[]>(() =>
    INITIAL_CURRENCIES.map((c) => ({
      ...c,
      rate: `0.00${c.symbol}`,
      balance: '0.00',
      isVisible: DEFAULT_VISIBLE.includes(c.id),
    }))
  );

  const [cryptos, setCryptos] = useState<Crypto[]>(() =>
    INITIAL_CRYPTOS.map((c) => ({
      ...c,
      balance: 0,
      price: 0,
      change: 0,
      isVisible: DEFAULT_VISIBLE_CRYPTO.includes(c.id),
    }))
  );

  useEffect(() => {
    const preferredLanguage = localStorage.getItem('preferred-language') as Language;
    if (preferredLanguage) {
      setLanguage(preferredLanguage);
    }
  }, []);

  useEffect(() => {
    const savedCurrencies = localStorage.getItem('currencies');
    if (savedCurrencies) {
      setCurrencies(JSON.parse(savedCurrencies));
    }
  }, []);

  useEffect(() => {
    const savedCryptos = localStorage.getItem('cryptos');
    if (savedCryptos) {
      setCryptos(JSON.parse(savedCryptos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('currencies', JSON.stringify(currencies));
  }, [currencies]);

  useEffect(() => {
    localStorage.setItem('cryptos', JSON.stringify(cryptos));
  }, [cryptos]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const userIdFromUrl = searchParams.get('user_id') || '0';
    setUserId(userIdFromUrl);
  }, []);

  return (
    <main className="pb-20">
      <div className="fixed top-4 right-4 z-10">
        <LanguageSwitcher language={language} onChange={setLanguage} />
      </div>

      <div className="p-4 space-y-6">
        <div className="text-center">
          <div suppressHydrationWarning className="text-sm text-gray-700">
            {translations.totalBalance[language]}
          </div>
          <div className="text-2xl font-bold text-black">
            {balance}
          </div>
          <div className="flex justify-center gap-8 mt-4">
            <button
              className="flex flex-col items-center text-blue-500"
              onClick={() => setIsDepositModalOpen(true)}
            >
              <div className="p-2 rounded-full bg-blue-500/10">
                <ArrowUpFromLine className="h-6 w-6" />
              </div>
              <span className="text-sm mt-1">{translations.deposit[language]}</span>
            </button>
            <button className="flex flex-col items-center text-blue-500">
              <div className="p-2 rounded-full bg-blue-500/10">
                <ArrowDownToLine className="h-6 w-6" />
              </div>
              <span className="text-sm mt-1">{translations.withdraw[language]}</span>
            </button>
            <button className="flex flex-col items-center text-blue-500">
              <div className="p-2 rounded-full bg-blue-500/10">
                <RefreshCcw className="h-6 w-6" />
              </div>
              <span className="text-sm mt-1">{translations.exchange[language]}</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm text-blue-500/80">{translations.profile[language]}</div>
          <div className="p-3 rounded bg-ededed">
            <div className="text-gray-900">{userId}</div>
            <div className="text-gray-600 text-sm">{translations.accountId[language]}</div>
          </div>
          <div className="p-3 rounded bg-ededed">
            <div className="flex items-center gap-2 text-gray-900">
              <span>0</span>
              <span>/</span>
              <span className="text-green-500">0</span>
              <span>/</span>
              <span className="text-red-500">0</span>
            </div>
            <div className="text-gray-600 text-sm">{translations.statistics[language]}</div>
          </div>
          <div className="p-3 rounded bg-ededed">
            <div className="text-gray-900">0,00 USDT</div>
            <div className="text-gray-600 text-sm">{translations.tradingVolume[language]}</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm text-blue-500/80">{translations.fiatAccounts[language]}</div>
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
                      className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden shadow-sm ${currency.bgColor}`}
                    >
                      {currency.icon}
                    </div>
                    <div>
                      <div className="text-gray-900">
                        {translations.currencyNames[currency.id][language]}
                      </div>
                      <div className="text-sm text-gray-600">{currency.rate}</div>
                    </div>
                  </div>
                  <div className="text-gray-900">{`${currency.balance}${currency.symbol}`}</div>
                </div>
              ))}
          </div>
          <Link
            href="/settings?type=currencies"
            className="flex items-center justify-center gap-2 p-3 text-gray-600 hover:text-gray-900 rounded-xl bg-gray-100"
          >
            <Settings2 className="w-5 h-5" />
            <span className="text-sm">{translations.settings[language]}</span>
          </Link>
        </div>

        <div className="space-y-3">
          <div className="text-sm text-blue-500/80">{translations.cryptocurrencies[language]}</div>
          <div className="space-y-2">
            {cryptos
              .filter((crypto) => crypto.isVisible)
              .map((crypto) => (
                <div
                  key={crypto.id}
                  className="flex items-center justify-between p-3 rounded bg-ededed"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden shadow-sm bg-white">
                      <Image
                        src={crypto.icon || '/placeholder.svg'}
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
            className="flex items-center justify-center gap-2 p-3 text-gray-600 hover:text-gray-900 rounded-xl bg-gray-100"
          >
            <Settings2 className="w-5 h-5" />
            <span className="text-sm">{translations.settings[language]}</span>
          </Link>
        </div>
      </div>

      <Navigation />

      <DepositModal 
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        language={language}
      />
    </main>
  );
}