import React, { useState } from 'react';
import {
  DATASET_STATS,
  AGE_DISTRIBUTION,
  BMI_DISTRIBUTION,
  SMOKER_BY_BMI,
  REGIONAL_STATS,
  CORRELATION_MATRIX,
} from '../data/insuranceData';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts';
import { LineChart, PieChart, Layers, Map, Grid, Percent } from 'lucide-react';

export const EdaExplorer: React.FC = () => {
  const [activeEdaTab, setActiveEdaTab] = useState<'smoker_bmi' | 'age' | 'region' | 'correlation'>('smoker_bmi');

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            Exploratory Data Analysis (EDA)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Statistical insights and risk correlations across the 1,338 records
          </p>
        </div>

        {/* EDA Sub-tabs */}
        <div className="flex items-center flex-wrap gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveEdaTab('smoker_bmi')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              activeEdaTab === 'smoker_bmi' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            BMI × Smoker Interaction
          </button>
          <button
            type="button"
            onClick={() => setActiveEdaTab('age')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              activeEdaTab === 'age' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Age Progression
          </button>
          <button
            type="button"
            onClick={() => setActiveEdaTab('region')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              activeEdaTab === 'region' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Regional Analysis
          </button>
          <button
            type="button"
            onClick={() => setActiveEdaTab('correlation')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              activeEdaTab === 'correlation' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Correlation Matrix
          </button>
        </div>
      </div>

      {/* Dataset Summary Stat Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="text-[11px] text-slate-500 font-medium">Dataset Mean Charge</div>
          <div className="text-base font-bold text-slate-900 font-mono mt-0.5">
            ${DATASET_STATS.meanCharge.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-slate-400">Median: ${DATASET_STATS.medianCharge.toLocaleString()}</div>
        </div>

        <div className="p-3 bg-rose-50/70 rounded-lg border border-rose-200">
          <div className="text-[11px] text-rose-700 font-semibold">Smoker Avg Charge</div>
          <div className="text-base font-bold text-rose-900 font-mono mt-0.5">
            ${DATASET_STATS.smokerAvgCharge.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-rose-600 font-medium">274 records (20.5%)</div>
        </div>

        <div className="p-3 bg-emerald-50/70 rounded-lg border border-emerald-200">
          <div className="text-[11px] text-emerald-700 font-semibold">Non-Smoker Avg Charge</div>
          <div className="text-base font-bold text-emerald-900 font-mono mt-0.5">
            ${DATASET_STATS.nonSmokerAvgCharge.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-emerald-600 font-medium">1,064 records (79.5%)</div>
        </div>

        <div className="p-3 bg-blue-50/70 rounded-lg border border-blue-200">
          <div className="text-[11px] text-blue-700 font-semibold">Average Beneficiary</div>
          <div className="text-base font-bold text-blue-900 font-mono mt-0.5">
            39.2 yrs / 30.7 BMI
          </div>
          <div className="text-[10px] text-blue-600 font-medium">1.09 avg dependents</div>
        </div>
      </div>

      {/* Tab 1: Smoker x BMI */}
      {activeEdaTab === 'smoker_bmi' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-600">
            <strong>Key Finding:</strong> Non-smokers experience a very modest upward trend as BMI increases. In stark contrast, smokers with BMI ≥ 30 (obese) jump nearly <strong>100%</strong> in charges compared to lean smokers.
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SMOKER_BY_BMI} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="bmiGroup" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} unit="$" />
                <Tooltip
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']}
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="smokerAvg" name="Smoker Average ($)" fill="#e11d48" radius={[4, 4, 0, 0]} />
                <Bar dataKey="nonSmokerAvg" name="Non-Smoker Average ($)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tab 2: Age Progression */}
      {activeEdaTab === 'age' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-600">
            <strong>Age Cohorts:</strong> Charges rise steadily from ~$7,086 in the 18–24 cohort to ~$18,513 in the 55–64 cohort, with ~250–280 annual progression.
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={AGE_DISTRIBUTION} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 11, fill: '#64748b' }} unit="$" />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val: any, name: string) => [
                    name === 'avgCharge' ? `$${Number(val).toLocaleString()}` : val,
                    name === 'avgCharge' ? 'Average Annual Charge' : 'Sample Count',
                  ]}
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar yAxisId="left" dataKey="avgCharge" name="Average Charge ($)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="count" name="Records in Cohort" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tab 3: Regional Analysis */}
      {activeEdaTab === 'region' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-600">
            <strong>Regional Breakdown:</strong> Southeast has highest average charge ($14,735) driven by highest smoking prevalence (25.0%) and highest average BMI (33.36).
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REGIONAL_STATS} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="region" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#64748b' }} unit="$" />
                <YAxis yAxisId="right" orientation="right" unit="%" tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val: any, name: string) => [
                    name === 'avgCharge' ? `$${Number(val).toLocaleString()}` : `${val}%`,
                    name === 'avgCharge' ? 'Average Annual Charge' : 'Smoker Percentage',
                  ]}
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar yAxisId="left" dataKey="avgCharge" name="Average Charge ($)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="smokerPct" name="Smoker Prevalence (%)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tab 4: Correlation Matrix */}
      {activeEdaTab === 'correlation' && (
        <div className="space-y-3">
          <div className="text-xs text-slate-600">
            <strong>Pearson Correlation Heatmap:</strong> Smoker status exhibits strong positive linear correlation (<strong>r = 0.79</strong>) with charges, followed by Age (<strong>r = 0.30</strong>) and BMI (<strong>r = 0.20</strong>).
          </div>
          <div className="border border-slate-200 rounded-lg overflow-x-auto">
            <table className="w-full text-xs text-center">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-2.5 px-3 text-left">Variable</th>
                  <th className="py-2.5 px-3">Age</th>
                  <th className="py-2.5 px-3">BMI</th>
                  <th className="py-2.5 px-3">Children</th>
                  <th className="py-2.5 px-3">Smoker</th>
                  <th className="py-2.5 px-3">Charges</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {CORRELATION_MATRIX.map((row) => (
                  <tr key={row.feature}>
                    <td className="py-2.5 px-3 font-semibold text-slate-900 text-left bg-slate-50/50">
                      {row.feature}
                    </td>
                    <td className={`py-2 px-3 font-mono ${row.age > 0.5 ? 'bg-blue-100 text-blue-900 font-bold' : ''}`}>
                      {row.age.toFixed(2)}
                    </td>
                    <td className={`py-2 px-3 font-mono ${row.bmi > 0.5 ? 'bg-blue-100 text-blue-900 font-bold' : ''}`}>
                      {row.bmi.toFixed(2)}
                    </td>
                    <td className={`py-2 px-3 font-mono ${row.children > 0.5 ? 'bg-blue-100 text-blue-900 font-bold' : ''}`}>
                      {row.children.toFixed(2)}
                    </td>
                    <td className={`py-2 px-3 font-mono ${row.smoker >= 0.75 ? 'bg-rose-100 text-rose-900 font-bold' : ''}`}>
                      {row.smoker.toFixed(2)}
                    </td>
                    <td className={`py-2 px-3 font-mono font-bold ${row.charges >= 0.75 ? 'bg-rose-200 text-rose-950' : row.charges >= 0.25 ? 'bg-blue-100 text-blue-900' : ''}`}>
                      {row.charges.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
