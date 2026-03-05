import React, { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    // Dashboard
    appTitle: "Smart Agriculture Support System",
    appSubtitle: "AI-based Farming Assistant",
    cropRecommendation: "Crop Recommendation",
    cropRecommendationDesc: "Get intelligent crop suggestions based on soil, climate, and season",
    diseaseDetection: "Plant Disease Detection",
    diseaseDetectionDesc: "Upload leaf images to identify diseases and get treatment advice",
    animalPredictor: "Animal Disease Predictor",
    animalPredictorDesc: "Predict livestock diseases based on symptoms",
    getStarted: "Get Started",
    selectFeature: "Select a feature to begin smart farming",
    
    // Crop Recommendation
    enterCity: "Enter City",
    selectSeason: "Select Season",
    kharif: "Kharif",
    rabi: "Rabi",
    summer: "Summer",
    getRecommendation: "Get Recommendation",
    analyzing: "Analyzing...",
    urbanDetected: "Urban Region Detected",
    urbanMessage: "Large-scale farming may not be suitable. Try terrace farming:",
    topCrops: "Top Suitable Crops",
    suitability: "Suitability",
    
    // Disease Detection
    uploadLeaf: "Upload Leaf Image",
    clickUpload: "Click to upload",
    dragDrop: "or drag and drop",
    fileTypes: "PNG, JPG, JPEG up to 10MB",
    removeImage: "Remove Image",
    detectDisease: "Detect Disease",
    detectionComplete: "Detection Complete",
    detectedDisease: "Detected Disease",
    recommendedTreatment: "Recommended Treatment",
    bestResults: "For best results, capture clear images in good lighting",
    
    // Animal Disease
    animalDiseaseTitle: "Animal Disease Predictor",
    selectAnimal: "Select Animal",
    cow: "Cow",
    goat: "Goat",
    sheep: "Sheep",
    selectSymptoms: "Select Symptoms",
    fever: "Fever",
    mouthLesions: "Mouth Lesions",
    lameness: "Lameness",
    milkDrop: "Milk Drop",
    skinNodules: "Skin Nodules",
    diarrhea: "Diarrhea",
    cough: "Cough",
    lossAppetite: "Loss of Appetite",
    predictDisease: "Predict Disease",
    predicting: "Predicting...",
    disease: "Disease",
    treatment: "Treatment",
    
    // Common
    backHome: "Back to Home",
    serverError: "Server error. Please check backend.",
  },
  ta: {
    // Dashboard
    appTitle: "ஸ்மார்ட் விவசாய ஆதரவு அமைப்பு",
    appSubtitle: "AI அடிப்படையிலான விவசாய உதவியாளர்",
    cropRecommendation: "பயிர் பரிந்துரை",
    cropRecommendationDesc: "மண், காலநிலை அடிப்படையில் பயிர் பரிந்துரைகள்",
    diseaseDetection: "தாவர நோய் கண்டறிதல்",
    diseaseDetectionDesc: "இலை படங்களை பதிவேற்றி நோய்களை கண்டறியவும்",
    animalPredictor: "கால்நடை நோய் கணிப்பு",
    animalPredictorDesc: "அறிகுறிகளின் அடிப்படையில் கால்நடை நோய்களை கணிக்கவும்",
    getStarted: "தொடங்கவும்",
    selectFeature: "ஸ்மார்ட் விவசாயத்தை தொடங்க தேர்ந்தெடுக்கவும்",
    
    // Crop Recommendation
    enterCity: "நகரத்தை உள்ளிடவும்",
    selectSeason: "பருவத்தை தேர்ந்தெடுக்கவும்",
    kharif: "கரீஃப்",
    rabi: "ரபி",
    summer: "கோடை",
    getRecommendation: "பரிந்துரையைப் பெறவும்",
    analyzing: "பகுப்பாய்வு செய்கிறது...",
    urbanDetected: "நகர்ப்புற பகுதி கண்டறியப்பட்டது",
    urbanMessage: "பெரிய விவசாயம் பொருந்தாது. மொட்டை மாடி பயிர்கள்:",
    topCrops: "சிறந்த பொருத்தமான பயிர்கள்",
    suitability: "பொருத்தம்",
    
    // Disease Detection
    uploadLeaf: "இலை படத்தை பதிவேற்றவும்",
    clickUpload: "பதிவேற்ற கிளிக் செய்க",
    dragDrop: "அல்லது இழுத்து விடவும்",
    fileTypes: "PNG, JPG, JPEG 10MB வரை",
    removeImage: "படத்தை அகற்று",
    detectDisease: "நோயைக் கண்டறியவும்",
    detectionComplete: "கண்டறிதல் முடிந்தது",
    detectedDisease: "கண்டறியப்பட்ட நோய்",
    recommendedTreatment: "பரிந்துரைக்கப்பட்ட சிகிச்சை",
    bestResults: "சிறந்த முடிவுகளுக்கு தெளிவான படங்களை எடுக்கவும்",
    
    // Animal Disease
    animalDiseaseTitle: "கால்நடை நோய் கணிப்பு",
    selectAnimal: "விலங்கைத் தேர்ந்தெடுக்கவும்",
    cow: "பசு",
    goat: "ஆடு",
    sheep: "செம்மறி ஆடு",
    selectSymptoms: "அறிகுறிகளைத் தேர்ந்தெடுக்கவும்",
    fever: "காய்ச்சல்",
    mouthLesions: "வாய் புண்கள்",
    lameness: "நொண்டி",
    milkDrop: "பால் குறைவு",
    skinNodules: "தோல் கட்டிகள்",
    diarrhea: "வயிற்றுப்போக்கு",
    cough: "இருமல்",
    lossAppetite: "பசியின்மை",
    predictDisease: "நோயைக் கணிக்கவும்",
    predicting: "கணிக்கிறது...",
    disease: "நோய்",
    treatment: "சிகிச்சை",
    
    // Common
    backHome: "முகப்புக்குத் திரும்பு",
    serverError: "சர்வர் பிழை. பின்தளத்தை சரிபார்க்கவும்",
  }
};
const cropMap = {
  ta: {
    "Rice": "அரிசி",
    "Sugarcane": "கரும்பு",
    "Maize": "மக்காச்சோளம்",
    "Millets": "சிறுதானியங்கள்",
    "Groundnut": "வேர்க்கடலை",
    "Cotton": "பருத்தி",
    "Banana": "வாழை",
    "Coconut": "தேங்காய்",
    "Pulses": "பருப்புகள்",
    "Ragi": "ராகி",
    "Sorghum": "சோளம்"
  }
};
const suitabilityMap = {
  ta: {
    "Highly Suitable": "மிகவும் பொருத்தமானது",
    "Suitable": "பொருத்தமானது",
    "Moderately Suitable": "மிதமான பொருத்தம்"
  }
};
const plantDiseaseMap = {
  ta: {
    "Healthy": "ஆரோக்கியமான இலை",
    "Early Blight": "ஆரம்ப பிளைட் நோய்",
    "Late Blight": "பின்னர் பிளைட் நோய்",
    "Leaf Mold": "இலை பூஞ்சை நோய்",
    "Septoria Leaf Spot": "செப்டோரியா இலை புள்ளி நோய்",
    "No leaf detected": "இலை கண்டறியப்படவில்லை",
    "Uncertain": "தெளிவாக கண்டறிய முடியவில்லை"
  }
};
const plantRemedyMap = {
  ta: {
    "Remove infected leaves and apply fungicide.":
      "பாதிக்கப்பட்ட இலைகளை அகற்றி பூஞ்சை நாசினி பயன்படுத்தவும்.",
    "Improve air circulation and apply fungicide.":
      "காற்றோட்டத்தை மேம்படுத்தி பூஞ்சை நாசினி பயன்படுத்தவும்.",
    "Reduce humidity and improve ventilation.":
      "ஈரப்பதத்தை குறைத்து காற்றோட்டத்தை அதிகரிக்கவும்.",
    "Remove affected leaves.":
      "பாதிக்கப்பட்ட இலைகளை அகற்றவும்.",
    "Leaf is healthy.":
      "இலை ஆரோக்கியமாக உள்ளது."
  }
};
const animalDiseaseMap = {
  ta: {
    "Foot and Mouth Disease": "கால்நடை வாய் மற்றும் கால் நோய்",
    "Mastitis": "மாஸ்டைட்டிஸ்",
    "Lumpy Skin Disease": "தோல் கட்டி நோய்",
    "Brucellosis": "புருசெல்லோசிஸ்",
    "PPR (Goat Plague)": "ஆடு பிளேக் (PPR)",
    "Goat Pox": "ஆடு அம்மை",
    "Foot Rot": "கால் அழுகல் நோய்",
    "Enterotoxemia": "என்டரோடாக்ஸீமியா",
    "General Infection": "பொது தொற்று",
    "Healthy": "ஆரோக்கியமானது"
  }
};
const animalTreatmentMap = {
  ta: {
    "Isolate animal. Disinfect area. Restrict movement.":
      "விலங்கை தனிமைப்படுத்தி பகுதியை சுத்தப்படுத்தவும்.",
    "Clean udder, discard milk, apply antibiotic treatment.":
      "பாலை களைந்து, உதிரியை சுத்தப்படுத்தி மருந்து பயன்படுத்தவும்.",
    "Isolate animal and control insects.":
      "விலங்கை தனிமைப்படுத்தி பூச்சிகளை கட்டுப்படுத்தவும்.",
    "Avoid consuming raw milk.":
      "மூல பாலை குடிக்க வேண்டாம்.",
    "Apply antiseptic to lesions and isolate animal.":
      "புண்களுக்கு மருந்து பூசி தனிமைப்படுத்தவும்.",
    "Clean hooves and apply antiseptic footbath.":
      "கால்களை சுத்தம் செய்து மருந்து குளியல் செய்யவும்.",
    "Immediate veterinary care required.":
      "உடனடி கால்நடை மருத்துவர் பரிசோதனை தேவை.",
    "Provide fluids and maintain hygiene.":
      "தண்ணீர் கொடுத்து சுத்தம் பராமரிக்கவும்."
  }
};
const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be within LanguageProvider');
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ta' : 'en');
  };

  const t = (key) => translations[language][key] || key;
const translateCrop = (text) => {
  if (language === "ta" && cropMap.ta[text]) {
    return cropMap.ta[text];
  }
  return text;
};
const translatePlantDisease = (text) => {
  if (language === "ta" && plantDiseaseMap.ta[text]) {
    return plantDiseaseMap.ta[text];
  }
  return text;
};

const translatePlantRemedy = (text) => {
  if (language === "ta" && plantRemedyMap.ta[text]) {
    return plantRemedyMap.ta[text];
  }
  return text;
};

const translateAnimalDisease = (text) => {
  if (language === "ta" && animalDiseaseMap.ta[text]) {
    return animalDiseaseMap.ta[text];
  }
  return text;
};

const translateAnimalTreatment = (text) => {
  if (language === "ta" && animalTreatmentMap.ta[text]) {
    return animalTreatmentMap.ta[text];
  }
  return text;
};
const translateSuitability = (text) => {
  if (language === "ta" && suitabilityMap.ta[text]) {
    return suitabilityMap.ta[text];
  }
  return text;
};
  return (
   <LanguageContext.Provider 
  value={{ 
    language,
    toggleLanguage,
    t,
    translateCrop,
    translateSuitability,
    translatePlantDisease,
    translatePlantRemedy,
    translateAnimalDisease,
    translateAnimalTreatment
  }}
>
      {children}
    </LanguageContext.Provider>
  );
};