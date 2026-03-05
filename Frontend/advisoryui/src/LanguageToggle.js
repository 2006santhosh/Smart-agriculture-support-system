import React from 'react';
import { useLanguage } from './LanguageContext';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <div className="fixed top-6 right-6 z-50">
      <div className="bg-white rounded-full shadow-lg p-1 flex">
        <button
          onClick={toggleLanguage}
          className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 ${
            language === 'en'
              ? 'bg-green-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          English
        </button>
        <button
          onClick={toggleLanguage}
          className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 ${
            language === 'ta'
              ? 'bg-green-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          தமிழ்
        </button>
      </div>
    </div>
  );
}