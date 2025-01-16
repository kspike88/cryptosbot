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

export const homeTranslations: Translations = {
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

