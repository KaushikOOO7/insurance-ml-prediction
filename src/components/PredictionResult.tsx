import React from 'react';
import { PredictionOutput } from '../types';
import { MODEL_METRICS } from '../ml/models';
import { AlertTriangle, Info, CheckCircle2, TrendingUp, TrendingDown, DollarSign, Cpu } from 'lucide-react';

interface PredictionResultProps {
  result: PredictionOutput;
  onSelectModel: (modelName: string) => void;
}

export const PredictionResult: React.FC<PredictionResultProps> = ({
  result,
  onSelectModel,
}) => {
  const currentMetric = MODEL_METRICS.find((m) => m.model === result.modelName) || MODEL_METRICS[0];
  const isAboveAvg = result.insights.relativeToAverage > 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
            Actuarial Estimate
          </span>
          <h2 className="text-base font-bold text-slate-900 mt-0.5">
            Prediction Result
          </h2>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 border border-slate-200">
          <Cpu className="w-3.5 h-3.5 text-blue-600" />
          <span>{result.modelName}</span>
        </div>
      </div>

      {/* Main Metric Hero Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <DollarSign className="w-32 h-32" />
        </div>

        <div className="relative z-10 space-y-2">
          <div className="text-xs font-medium text-slate-300">
            Estimated Annual Insurance Charges
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-emerald-400">
            ${result.estimatedCharges.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/10 text-slate-200 border border-white/10 font-medium">
              Monthly Est: ${(result.estimatedCharges / 12).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-medium border ${
              isAboveAvg
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
            }`}>
              {isAboveAvg ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {Math.abs(result.insights.relativeToAverage)}% {isAboveAvg ? 'above' : 'below'} dataset average ($13,270)
            </span>
          </div>
        </div>
      </div>

      {/* Input Summary Table matching original Streamlit app */}
      <div>
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Evaluated Risk Profile
        </h3>
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Feature</th>
                <th className="py-2.5 px-3">Your Value</th>
                <th className="py-2.5 px-3">Risk Assessment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              <tr>
                <td className="py-2 px-3 font-medium text-slate-600">Age</td>
                <td className="py-2 px-3 font-semibold">{result.input.age} years old</td>
                <td className="py-2 px-3 text-slate-500">{result.insights.ageFactor}</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium text-slate-600">Sex</td>
                <td className="py-2 px-3 capitalize font-semibold">{result.input.sex}</td>
                <td className="py-2 px-3 text-slate-500">Standard demographic baseline</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium text-slate-600">BMI</td>
                <td className="py-2 px-3 font-semibold">{result.input.bmi.toFixed(1)}</td>
                <td className="py-2 px-3">
                  <span className={`font-medium ${result.input.bmi >= 30 ? 'text-amber-600' : 'text-slate-600'}`}>
                    {result.insights.bmiCategory}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium text-slate-600">Children</td>
                <td className="py-2 px-3 font-semibold">{result.input.children} dependents</td>
                <td className="py-2 px-3 text-slate-500">{result.input.children > 0 ? `+${result.input.children} dependent multiplier` : 'No dependent add-ons'}</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium text-slate-600">Smoker</td>
                <td className="py-2 px-3 font-semibold">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    result.input.smoker === 'yes' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {result.input.smoker.toUpperCase()}
                  </span>
                </td>
                <td className="py-2 px-3">
                  {result.input.smoker === 'yes' ? (
                    <span className="text-rose-600 font-medium">Critical Risk Multiplier (~+$24k)</span>
                  ) : (
                    <span className="text-emerald-600 font-medium">Preferred Baseline Tier</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium text-slate-600">Region</td>
                <td className="py-2 px-3 capitalize font-semibold">{result.input.region}</td>
                <td className="py-2 px-3 text-slate-500">US Geographic rating area</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Dynamic Alerts matching original Streamlit behavior */}
      <div className="space-y-3">
        {result.input.smoker === 'yes' ? (
          <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-900 text-xs">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">High-Impact Risk Factor: </span>
              Smoking is the single most impactful factor driving insurance charges. Non-smokers in this dataset typically pay significantly less (avg $8,434 vs $32,050).
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-900 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Preferred Health Status: </span>
              Non-smoker status grants access to baseline insurance tiers, reducing expected liability by up to 70%.
            </div>
          </div>
        )}

        {result.input.bmi >= 30 && (
          <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-900 text-xs">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Elevated BMI Notice: </span>
              A BMI above 30.0 indicates obesity and triggers non-linear charge jumps in tree and polynomial models, especially when combined with smoking.
            </div>
          </div>
        )}
      </div>

      {/* Model Predictions Cross-Comparison */}
      <div className="pt-2 border-t border-slate-100">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Predictions Across All 7 Models
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {MODEL_METRICS.map((m) => {
            const pred = result.comparisons[m.model] ?? 0;
            const isSelected = result.modelName === m.model;
            return (
              <button
                key={m.model}
                type="button"
                onClick={() => onSelectModel(m.model)}
                className={`text-left p-3 rounded-lg border transition-all text-xs ${
                  isSelected
                    ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-500/20 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between font-semibold text-slate-700 mb-1">
                  <span className="truncate">{m.model}</span>
                  <span className="text-[10px] text-slate-400 font-mono">#{m.rank}</span>
                </div>
                <div className="text-sm font-bold text-slate-900">
                  ${pred.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  R²: {m.r2.toFixed(3)} | MAE: ${m.mae.toLocaleString()}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="text-[11px] text-slate-400 text-center pt-2">
        Prediction generated on {result.timestamp} using the <strong className="text-slate-600">{result.modelName}</strong> model.
      </div>
    </div>
  );
};
