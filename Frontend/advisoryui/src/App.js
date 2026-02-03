import React, { useState } from "react";
import axios from "axios";

function App() {
  const [location, setLocation] = useState("");
  const [season, setSeason] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      location: location,
      season: season,
    };

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/predict",
        data
      );

      setResult(res.data);
    } catch (error) {
      alert("Server error!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      {/* Header */}
      <div className="bg-green-600 shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            🌱 Smart Crop Advisory
            <span className="text-green-200 text-lg font-normal">
              | Empowering Farmers
            </span>
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-green-100 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6">
            <h2 className="text-2xl font-semibold text-white mb-2">
              Get Your Crop Recommendation
            </h2>
            <p className="text-green-100">
              Enter your location and season to get personalized crop suggestions
            </p>
          </div>

          {/* Form Section */}
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Location Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📍 Your Location
                </label>
                <input
                  type="text"
                  placeholder="Enter your city or region (e.g., Madurai, karur)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 text-gray-700 placeholder-gray-400"
                />
              </div>

              {/* Season Select */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🌦️ Growing Season
                </label>
                <select
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 text-gray-700 bg-white"
                >
                  <option value="">Choose your planting season</option>
                  <option value="Kharif">🌧️ Kharif (Monsoon Season)</option>
                  <option value="Rabi">❄️ Rabi (Winter Season)</option>
                  <option value="Summer">☀️ Summer (Hot Season)</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Getting Recommendation...
                  </>
                ) : (
                  <>
                    🚀 Get My Crop Recommendation
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl border border-green-100 overflow-hidden animate-fade-in">
            {/* Results Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-8 py-6">
              <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
                ✅ Your Crop Recommendation
              </h3>
            </div>

            {/* Results Content */}
            <div className="px-8 py-8">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Location Card */}
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">📍</span>
                    <h4 className="font-semibold text-gray-700">Location</h4>
                  </div>
                  <p className="text-lg text-blue-700 font-medium">{result.location}</p>
                </div>

                {/* Season Card */}
                <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">🌦️</span>
                    <h4 className="font-semibold text-gray-700">Season</h4>
                  </div>
                  <p className="text-lg text-orange-700 font-medium">{result.season}</p>
                </div>

                {/* Recommended Crop Card */}
                <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">🌾</span>
                    <h4 className="font-semibold text-gray-700">Recommended Crop</h4>
                  </div>
                  <p className="text-lg text-green-700 font-bold">{result.recommended_crop}</p>
                </div>
              </div>

              {/* Success Message */}
              <div className="mt-6 bg-green-100 border border-green-200 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎉</span>
                  <div>
                    <h4 className="font-semibold text-green-800">Recommendation Ready!</h4>
                    <p className="text-green-700">
                      Based on your location and season, <strong>{result.recommended_crop}</strong> is the best crop choice for optimal yield.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 px-6 py-4">
            <p className="text-gray-600 flex items-center justify-center gap-2">
              <span className="text-green-500">🌱</span>
              Helping farmers make informed decisions for better harvests
              <span className="text-green-500">🌾</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
