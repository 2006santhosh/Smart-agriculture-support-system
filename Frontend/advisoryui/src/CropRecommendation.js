import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "./LanguageContext";
import LanguageToggle from "./LanguageToggle";

export default function CropRecommendation() {
  const navigate = useNavigate();
  const { t, translateCrop, translateSuitability } = useLanguage();

  const [location, setLocation] = useState("");
  const [season, setSeason] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post("http://127.0.0.1:5000/predict", {
        location,
        season,
      });
      setResult(res.data);
    } catch (err) {
      alert(t("serverError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-10 px-4">
      <LanguageToggle />

      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center text-green-700 hover:text-green-900 font-semibold transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t("backHome")}
        </button>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center">
            <div className="text-6xl mb-4">🌾</div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {t("cropRecommendation")}
            </h2>
            <p className="text-green-100 text-lg">
              {t("cropRecommendationDesc")}
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  {t("enterCity")}
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="w-full border-2 border-gray-300 p-4 rounded-xl text-lg focus:border-green-500 focus:ring-2 focus:ring-green-200"
                  placeholder="Enter Your City"
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  {t("selectSeason")}
                </label>
                <select
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  required
                  className="w-full border-2 border-gray-300 p-4 rounded-xl text-lg focus:border-green-500 focus:ring-2 focus:ring-green-200"
                >
                  <option value="">{t("selectSeason")}</option>
                  <option value="Kharif">{t("kharif")}</option>
                  <option value="Rabi">{t("rabi")}</option>
                  <option value="Summer">{t("summer")}</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-5 rounded-xl font-bold text-xl transition-all duration-300 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                }`}
              >
                {loading ? t("analyzing") : t("getRecommendation")}
              </button>
            </form>

            {/* Results */}
            {result && (
              <div className="mt-10 space-y-6">

                {/* Urban Farming */}
                {result.urban_farming_options && (
                  <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-yellow-800 mb-2">
                      {t("urbanDetected")}
                    </h3>
                    <p className="text-yellow-700 mb-4">
                      {t("urbanMessage")}
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      {result.urban_farming_options.map((crop, i) => (
                        <div key={i} className="bg-white rounded-xl p-4 text-center shadow-md">
                          <p className="text-lg font-bold text-gray-800">
                            {translateCrop(crop)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Top Crops */}
                {result.top_recommendations && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                      <span className="text-3xl mr-3">🌱</span>
                      {t("topCrops")}
                    </h3>

                    <div className="grid md:grid-cols-3 gap-5">
                      {result.top_recommendations.map((item, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                        >
                          <div className="text-4xl mb-3">🌾</div>

                          {/* ✅ TRANSLATED CROP */}
                          <p className="text-2xl font-bold text-green-700 mb-2">
                            {translateCrop(item.crop)}
                          </p>

                          <div className="bg-white rounded-lg px-3 py-2 inline-block">
                            <p className="text-sm text-gray-600 font-semibold">
                              {t("suitability")}: {translateSuitability(item.suitability)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                )}

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}