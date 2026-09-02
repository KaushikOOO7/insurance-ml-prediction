import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { PredictionForm } from './components/PredictionForm';
import { PredictionResult } from './components/PredictionResult';
import { ModelComparison } from './components/ModelComparison';
import { FeatureImportance } from './components/FeatureImportance';
import { EdaExplorer } from './components/EdaExplorer';
import { DatasetExplorer } from './components/DatasetExplorer';
import { InsuranceInput, PredictionOutput } from './types';
import { predictCharges } from './ml/models';
import {
  Stethoscope,
  BarChart3,
  Sliders,
  Layers,
  Database,
  Sparkles,
  Zap,
  Info,
  ExternalLink,
} from 'lucide-react';

const PRESET_PROFILES: { label: string; description: string; input: InsuranceInput }[] = [
  {
    label: 'Standard Non-Smoker (30y)',
    description: 'Average baseline profile',
    input: { age: 30, sex: 'female', bmi: 24.5, children: 0, smoker: 'no', region: 'northwest', modelName: 'XGBoost' },
  },
  {
    label: 'Smoker with BMI > 30 (Critical)',
    description: 'Triggers exponential risk tier',
    input: { age: 35, sex: 'male', bmi: 34.2, children: 1, smoker: 'yes', region: 'southeast', modelName: 'XGBoost' },
  },
  {
    label: 'Senior with Dependents (58y)',
    description: 'Age curve + children impact',
    input: { age: 58, sex: 'male', bmi: 28.4, children: 3, smoker: 'no', region: 'northeast', modelName: 'XGBoost' },
  },
  {
    label: 'Young Adult Smoker (22y)',
    description: 'Non-obese smoker tier',
    input: { age: 22, sex: 'female', bmi: 23.0, children: 0, smoker: 'yes', region: 'southwest', modelName: 'XGBoost' },
  },
];

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'predict' | 'comparison' | 'features' | 'eda' | 'dataset'>('predict');

  const [input, setInput] = useState<InsuranceInput>({
    age: 30,
    sex: 'male',
    bmi: 28.0,
    children: 0,
    smoker: 'no',
    region: 'southwest',
    modelName: 'XGBoost',
  });

  // Calculate prediction output
  const predictionResult: PredictionOutput = useMemo(() => {
    return predictCharges(input);
  }, [input]);

  const handleSelectModel = (modelName: string) => {
    setInput((prev) => ({ ...prev, modelName }));
  };

  const handleLoadPreset = (preset: typeof PRESET_PROFILES[0]) => {
    setInput(preset.input);
    setActiveTab('predict');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800">
      <Header />

      {/* Navigation Subheader */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between overflow-x-auto py-2.5 gap-2 scrollbar-none">
            <div className="flex items-center gap-1.5 min-w-max">
              <button
                id="tab-btn-predictor"
                type="button"
                onClick={() => setActiveTab('predict')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'predict'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Stethoscope className="w-4 h-4" />
                <span>Predictor Engine</span>
              </button>

              <button
                id="tab-btn-comparison"
                type="button"
                onClick={() => setActiveTab('comparison')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'comparison'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Model Comparison (7 Models)</span>
              </button>

              <button
                id="tab-btn-features"
                type="button"
                onClick={() => setActiveTab('features')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'features'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>Feature Importance</span>
              </button>

              <button
                id="tab-btn-eda"
                type="button"
                onClick={() => setActiveTab('eda')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'eda'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Exploratory Analysis (EDA)</span>
              </button>

              <button
                id="tab-btn-dataset"
                type="button"
                onClick={() => setActiveTab('dataset')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'dataset'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>Dataset Explorer</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Presets Bar on Predict Tab */}
        {activeTab === 'predict' && (
          <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Quick Scenario Presets:</span>
              </div>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1.5">
                {PRESET_PROFILES.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleLoadPreset(preset)}
                    className="px-2.5 py-1 text-left sm:text-center text-xs font-medium rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 text-slate-700 transition-all cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab Views */}
        {activeTab === 'predict' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5">
              <PredictionForm
                input={input}
                onChange={setInput}
                onSubmit={() => {
                  // Instant prediction active
                }}
              />
            </div>
            <div className="lg:col-span-7">
              <PredictionResult
                result={predictionResult}
                onSelectModel={handleSelectModel}
              />
            </div>
          </div>
        )}

        {activeTab === 'comparison' && <ModelComparison />}

        {activeTab === 'features' && <FeatureImportance />}

        {activeTab === 'eda' && <EdaExplorer />}

        {activeTab === 'dataset' && <DatasetExplorer />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            Medical Insurance Charges Prediction • Trained on 1,338 records with 80/20 train/test split
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <span>Production Regressor: XGBoost (MAE: $2,455 | RMSE: $4,297 | R²: 0.881)</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
