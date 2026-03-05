import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./LanguageContext";
import Dashboard from "./Dashboard";
import CropRecommendation from "./CropRecommendation";
import CropDiseaseDetection from "./CropDiseaseDetection";
import AnimalDiseasePredictor from "./AnimalDiseasePredictor";

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/recommendation" element={<CropRecommendation />} />
          <Route path="/disease" element={<CropDiseaseDetection />} />
          <Route path="/animal" element={<AnimalDiseasePredictor />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;