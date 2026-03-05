import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import LanguageToggle from './LanguageToggle';

export default function Dashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const features = [
    {
      id: 1,
      title: t('cropRecommendation'),
      description: t('cropRecommendationDesc'),
      route: '/recommendation',
      gradient: 'from-green-400 to-emerald-600',
      emoji: '🌾'
    },
    {
      id: 2,
      title: t('diseaseDetection'),
      description: t('diseaseDetectionDesc'),
      route: '/disease',
      gradient: 'from-emerald-400 to-teal-600',
      emoji: '🌿'
    },
    {
      id: 3,
      title: t('animalPredictor'),
      description: t('animalPredictorDesc'),
      route: '/animal',
      gradient: 'from-orange-400 to-amber-600',
      emoji: '🐄'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-4">
      <LanguageToggle />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 mt-12">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <span className="text-4xl">🌱</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-green-800">
              {t('appTitle')}
            </h1>
          </div>
          <p className="text-xl text-green-700 mt-4 font-medium">
            {t('appSubtitle')}
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {features.map((feature) => (
            <div
              key={feature.id}
              onClick={() => navigate(feature.route)}
              className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden"
            >
              {/* Card Header */}
              <div className={`bg-gradient-to-br ${feature.gradient} p-8 text-center relative`}>
                <div className="absolute top-4 right-4 text-4xl opacity-20">
                  {feature.emoji}
                </div>
                <div className="flex justify-center mb-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white">
                  {feature.title}
                </h2>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <p className="text-gray-600 text-center mb-6 leading-relaxed min-h-[60px]">
                  {feature.description}
                </p>

                <button
                  className={`w-full bg-gradient-to-r ${feature.gradient} text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-lg`}
                >
                  {t('getStarted')}
                  <svg className="w-5 h-5 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="text-center">
          <div className="inline-flex items-center bg-white rounded-full px-8 py-4 shadow-lg">
            <svg className="w-6 h-6 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-base text-gray-700 font-medium">
              {t('selectFeature')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}