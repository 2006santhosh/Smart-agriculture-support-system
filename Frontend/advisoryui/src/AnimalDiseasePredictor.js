import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "./LanguageContext";
import LanguageToggle from "./LanguageToggle";

export default function AnimalDiseasePredictor() {
  const navigate = useNavigate();

  const { 
    t,
    translateAnimalDisease,
    translateAnimalTreatment
  } = useLanguage();

  const [animal, setAnimal] = useState("Cow");
  const [symptoms, setSymptoms] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const symptomList = [
    { key: "Fever", label: t('fever') },
    { key: "Mouth_Lesions", label: t('mouthLesions') },
    { key: "Lameness", label: t('lameness') },
    { key: "Milk_Drop", label: t('milkDrop') },
    { key: "Skin_Nodules", label: t('skinNodules') },
    { key: "Diarrhea", label: t('diarrhea') },
    { key: "Cough", label: t('cough') },
    { key: "Loss_Appetite", label: t('lossAppetite') }
  ];

  const handleCheckbox = (symptom) => {
    setSymptoms({
      ...symptoms,
      [symptom]: symptoms[symptom] ? 0 : 1
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);

    const payload = {
      Animal: animal,
      Fever: symptoms.Fever || 0,
      Mouth_Lesions: symptoms.Mouth_Lesions || 0,
      Lameness: symptoms.Lameness || 0,
      Milk_Drop: symptoms.Milk_Drop || 0,
      Skin_Nodules: symptoms.Skin_Nodules || 0,
      Diarrhea: symptoms.Diarrhea || 0,
      Cough: symptoms.Cough || 0,
      Loss_Appetite: symptoms.Loss_Appetite || 0
    };

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/predict-animal-disease",
        payload
      );

      setResult(res.data);

    } catch (err) {
      alert(t('serverError'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 py-10 px-4">
      <LanguageToggle />

      <div className="max-w-3xl mx-auto">

        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center text-orange-700 font-semibold"
        >
          ← {t('backHome')}
        </button>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-8 text-center">
            <div className="text-6xl mb-4">🐄</div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {t('animalDiseaseTitle')}
            </h2>
            <p className="text-orange-100 text-lg">
              {t('animalPredictorDesc')}
            </p>
          </div>

          <div className="p-8">

            {/* Animal Selection */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                {t('selectAnimal')}
              </label>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: "Cow", label: t('cow'), emoji: "🐄" },
                  { value: "Goat", label: t('goat'), emoji: "🐐" },
                  { value: "Sheep", label: t('sheep'), emoji: "🐑" }
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setAnimal(item.value)}
                    className={`p-6 rounded-2xl font-bold text-lg ${
                      animal === item.value
                        ? 'border-2 border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-2 border-gray-200 bg-white text-gray-600'
                    }`}
                  >
                    <div className="text-4xl mb-2">{item.emoji}</div>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Symptoms */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                {t('selectSymptoms')}
              </label>

              <div className="grid grid-cols-2 gap-4">
                {symptomList.map((symptom) => (
                  <label
                    key={symptom.key}
                    className="flex items-center p-4 rounded-xl border-2 border-gray-200 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={symptoms[symptom.key] === 1}
                      onChange={() => handleCheckbox(symptom.key)}
                      className="w-5 h-5"
                    />
                    <span className="ml-3 font-semibold">
                      {symptom.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-lg ${
                loading
                  ? 'bg-gray-400'
                  : 'bg-orange-600 text-white hover:bg-orange-700'
              }`}
            >
              {loading ? t('predicting') : t('predictDisease')}
            </button>

            {/* Result */}
            {result && (
              <div className="mt-8 bg-gradient-to-br from-orange-400 to-amber-500 p-1 rounded-2xl">
                <div className="bg-white rounded-2xl p-6">

                  {/* Disease */}
                  <div className="mb-5">
                    <h4 className="font-semibold mb-2">
                      {t('disease')}
                    </h4>
                    <div className="bg-gray-100 rounded-lg p-4 text-xl font-bold">
                      {translateAnimalDisease(result.predicted_disease)}
                    </div>
                  </div>

                  {/* Treatment */}
                  <div>
                    <h4 className="font-semibold mb-2">
                      {t('treatment')}
                    </h4>
                    <div className="bg-gray-100 rounded-lg p-4">
                      {translateAnimalTreatment(result.treatment)}
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