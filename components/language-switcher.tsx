'use client'

import { useState } from 'react'
import { Globe } from 'lucide-react'
import type { Language } from '@/app/types/app'
import { translations } from '@/utils/translations'
import React from 'react'

interface LanguageSwitcherProps {
  language: Language
  onChange: (language: Language) => void
}

interface LanguageOption {
  code: Language
  name: string
  flag: string | React.JSX.Element
}

const LANGUAGES: LanguageOption[] = [
  {
    code: 'ru',
    name: translations.russian?.ru || 'Русский',
    flag: <span style={{ color: 'black' }}>🇷🇺</span>
  },
  {
    code: 'en',
    name: translations.english?.ru || 'English',
    flag: <span style={{ color: 'black' }}>🇺🇸</span>
  }
]


export function LanguageSwitcher({ language, onChange }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageChange = (newLanguage: Language) => {
    onChange(newLanguage)
    localStorage.setItem('preferred-language', newLanguage)
    setIsOpen(false)
  }

  if (!translations) {
    console.error('Translations object is undefined')
    return null
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full bg-blue-500/10 text-blue-500"
      >
        <Globe className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 bg-white rounded-xl shadow-lg border border-gray-200 w-48 overflow-hidden z-50">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 ${
                language === lang.code ? 'bg-gray-50' : ''
              }`}
              onClick={() => handleLanguageChange(lang.code)}
            >
              <span className="text-xl" role="img" aria-label={lang.name}>
                {lang.flag}
              </span>
              <span className="text-gray-900">
                {translations[lang.code === 'ru' ? 'russian' : 'english']?.[language] || lang.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
