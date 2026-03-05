import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import LanguageToggle from './LanguageToggle';

export default function CropDiseaseDetection() {
  const navigate = useNavigate();
  const { 
    t, 
    translatePlantDisease, 
    translatePlantRemedy 
  } = useLanguage();

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedImage) {
      setError(t('serverError'));
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/detect-disease',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      setResult(response.data);
    } catch (err) {
      setError(t('serverError'));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setResult(null);
    setError(null);
  };

  const getStatusColor = (disease) => {
    if (!disease) return 'gray';
    const lower = disease.toLowerCase();
    if (lower.includes('healthy')) return 'green';
    if (lower.includes('uncertain')) return 'yellow';
    return 'red';
  };

  const statusColor = result ? getStatusColor(result.disease) : 'gray';

  const statusColors = {
    green: 'from-green-400 to-emerald-500',
    yellow: 'from-yellow-400 to-amber-500',
    red: 'from-red-400 to-rose-500',
    gray: 'from-gray-400 to-gray-500'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 py-10 px-4">
      <LanguageToggle />

      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center text-green-700 hover:text-green-900 font-semibold"
        >
          ← {t('backHome')}
        </button>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-center">
            <div className="text-6xl mb-4">🌿</div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {t('diseaseDetection')}
            </h2>
            <p className="text-emerald-100 text-lg">
              {t('diseaseDetectionDesc')}
            </p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="image-upload"
              />

              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full h-64 border-4 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-green-500"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full object-contain p-2"
                  />
                ) : (
                  <p className="text-lg text-gray-500">
                    {t('clickUpload')}
                  </p>
                )}
              </label>

              {imagePreview && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-4 text-red-600 font-semibold"
                >
                  {t('removeImage')}
                </button>
              )}

              <button
                type="submit"
                disabled={loading || !selectedImage}
                className={`w-full mt-6 py-4 rounded-xl font-bold text-lg ${
                  loading || !selectedImage
                    ? 'bg-gray-400'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {loading ? t('analyzing') : t('detectDisease')}
              </button>
            </form>

            {error && (
              <div className="mt-6 text-red-600 font-semibold">
                {error}
              </div>
            )}

            {result && (
              <div className={`mt-8 bg-gradient-to-br ${statusColors[statusColor]} p-1 rounded-2xl`}>
                <div className="bg-white rounded-2xl p-6">
                  
                  <h3 className="text-xl font-bold mb-4">
                    {t('detectionComplete')}
                  </h3>

                  {/* Disease */}
                  <div className="mb-5">
                    <h4 className="font-semibold mb-2">
                      {t('detectedDisease')}
                    </h4>
                    <div className="bg-gray-100 rounded-lg p-4 text-lg font-bold">
                      {translatePlantDisease(result.disease)}
                    </div>
                  </div>

                  {/* Remedy */}
                  <div>
                    <h4 className="font-semibold mb-2">
                      {t('recommendedTreatment')}
                    </h4>
                    <div className="bg-gray-100 rounded-lg p-4">
                      {translatePlantRemedy(result.remedy)}
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}