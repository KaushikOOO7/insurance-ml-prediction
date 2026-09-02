import React from 'react';
import { InsuranceInput, Sex, Smoker, Region } from '../types';
import { MODEL_METRICS } from '../ml/models';
import { User, Flame, MapPin, Users, Sparkles, Scale, HeartPulse } from 'lucide-react';

interface PredictionFormProps {
  input: InsuranceInput;
  onChange: (input: InsuranceInput) => void;
  onSubmit: (e?: React.FormEvent) => void;
  isAutoPredict?: boolean;
}

export const PredictionForm: React.FC<PredictionFormProps> = ({
  input,
  onChange,
  onSubmit,
}) => {
  const getBmiBadge = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'bg-amber-100 text-amber-800 border-amber-200' };
    if (bmi < 25) return { label: 'Normal Weight', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    if (bmi < 30) return { label: 'Overweight', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    if (bmi < 35) return { label: 'Obese Class I', color: 'bg-orange-100 text-orange-800 border-orange-200' };
    return { label: 'Severe Obesity', color: 'bg-rose-100 text-rose-800 border-rose-200' };
  };

  const bmiBadge = getBmiBadge(input.bmi);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
        <div>
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-blue-600" />
            Beneficiary Details
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure risk factors to evaluate simulated actuarial pricing
          </p>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(e);
        }}
        className="space-y-5"
      >
        {/* Row 1: Age & BMI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Age */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Age
              </label>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                {input.age} yrs
              </span>
            </div>
            <input
              type="range"
              min="18"
              max="65"
              step="1"
              value={input.age}
              onChange={(e) => onChange({ ...input, age: parseInt(e.target.value, 10) || 18 })}
              className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>18 yrs</span>
              <span>65 yrs</span>
            </div>
          </div>

          {/* BMI */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-slate-400" />
                BMI (Body Mass Index)
              </label>
              <div className="flex items-center gap-1.5">
                <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${bmiBadge.color}`}>
                  {bmiBadge.label}
                </span>
                <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {input.bmi.toFixed(1)}
                </span>
              </div>
            </div>
            <input
              type="range"
              min="15.0"
              max="50.0"
              step="0.1"
              value={input.bmi}
              onChange={(e) => onChange({ ...input, bmi: parseFloat(e.target.value) || 20.0 })}
              className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>15.0 (Lean)</span>
              <span>30.0 (Obesity line)</span>
              <span>50.0+</span>
            </div>
          </div>
        </div>

        {/* Row 2: Smoker Status & Biological Sex */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Smoker */}
          <div>
            <label className="text-xs font-semibold text-slate-700 flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                Smoker Status
              </span>
              <span className="text-[10px] text-rose-600 font-semibold uppercase tracking-wider">
                Primary Cost Driver
              </span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onChange({ ...input, smoker: 'no' })}
                className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all flex items-center justify-center gap-2 ${
                  input.smoker === 'no'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-500/20'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${input.smoker === 'no' ? 'bg-emerald-600' : 'bg-slate-300'}`} />
                Non-Smoker
              </button>
              <button
                type="button"
                onClick={() => onChange({ ...input, smoker: 'yes' })}
                className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all flex items-center justify-center gap-2 ${
                  input.smoker === 'yes'
                    ? 'bg-rose-50 text-rose-800 border-rose-300 ring-2 ring-rose-500/20'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${input.smoker === 'yes' ? 'bg-rose-600' : 'bg-slate-300'}`} />
                Smoker (High Risk)
              </button>
            </div>
          </div>

          {/* Sex */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-2">
              Biological Sex
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onChange({ ...input, sex: 'male' })}
                className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all flex items-center justify-center gap-2 ${
                  input.sex === 'male'
                    ? 'bg-blue-50 text-blue-800 border-blue-300 ring-2 ring-blue-500/20'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>Male</span>
              </button>
              <button
                type="button"
                onClick={() => onChange({ ...input, sex: 'female' })}
                className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all flex items-center justify-center gap-2 ${
                  input.sex === 'female'
                    ? 'bg-blue-50 text-blue-800 border-blue-300 ring-2 ring-blue-500/20'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>Female</span>
              </button>
            </div>
          </div>
        </div>

        {/* Row 3: Children & Region */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Children */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                Dependent Children
              </label>
              <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {input.children} {input.children === 1 ? 'child' : 'children'}
              </span>
            </div>
            <div className="grid grid-cols-6 gap-1 pt-1">
              {[0, 1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => onChange({ ...input, children: num })}
                  className={`py-1.5 text-xs font-medium rounded border transition-all ${
                    input.children === num
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Region */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Residential Region
            </label>
            <select
              value={input.region}
              onChange={(e) => onChange({ ...input, region: e.target.value as Region })}
              className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="southwest">Southwest (SW)</option>
              <option value="southeast">Southeast (SE)</option>
              <option value="northwest">Northwest (NW)</option>
              <option value="northeast">Northeast (NE)</option>
            </select>
          </div>
        </div>

        {/* Row 4: Model Selector */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Machine Learning Model
            </label>
            <span className="text-[11px] text-slate-500">
              Ranked by Test R² / RMSE
            </span>
          </div>
          <select
            value={input.modelName || 'XGBoost'}
            onChange={(e) => onChange({ ...input, modelName: e.target.value })}
            className="w-full text-xs font-semibold text-slate-800 bg-indigo-50/50 border border-indigo-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            {MODEL_METRICS.map((m) => (
              <option key={m.model} value={m.model}>
                #{m.rank} {m.model} (R² {m.r2.toFixed(3)} | MAE ${m.mae.toLocaleString()}) - {m.bestFor}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Predict Annual Charges</span>
        </button>
      </form>
    </div>
  );
};
