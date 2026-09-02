import React, { useState } from 'react';
import { MODEL_METRICS } from '../ml/models';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { Trophy, BarChart3, HelpCircle, CheckCircle2 } from 'lucide-react';

export const ModelComparison: React.FC = () => {
  const [metricTab, setMetricTab] = useState<'r2' | 'rmse' | 'mae'>('r2');

  const chartData = MODEL_METRICS.map((m) => ({
    name: m.model.replace('Regression', 'Reg').replace('(Deg 2)', 'D2'),
    fullName: m.model,
    r2: parseFloat((m.r2 * 100).toFixed(1)), // as %
    rmse: m.rmse,
    mae: m.mae,
    rank: m.rank,
  }));

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Model Benchmark & Comparison
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluation on 20% held-out test split (268 test samples, random_state=42)
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-start">
          <button
            type="button"
            onClick={() => setMetricTab('r2')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              metricTab === 'r2'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            R² Score (Higher is better)
          </button>
          <button
            type="button"
            onClick={() => setMetricTab('rmse')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              metricTab === 'rmse'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            RMSE (Lower is better)
          </button>
          <button
            type="button"
            onClick={() => setMetricTab('mae')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              metricTab === 'mae'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            MAE (Lower is better)
          </button>
        </div>
      </div>

      {/* Recharts Bar Chart */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} angle={-15} textAnchor="end" />
            <YAxis
              tick={{ fontSize: 11, fill: '#64748b' }}
              domain={metricTab === 'r2' ? [60, 100] : [0, 'auto']}
              unit={metricTab === 'r2' ? '%' : '$'}
            />
            <Tooltip
              formatter={(value: any) => [
                metricTab === 'r2' ? `${value}%` : `$${Number(value).toLocaleString()}`,
                metricTab === 'r2' ? 'R² Score' : metricTab.toUpperCase(),
              ]}
              labelFormatter={(label) => {
                const item = chartData.find((d) => d.name === label);
                return item ? item.fullName : label;
              }}
              contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
            />
            <Bar
              dataKey={metricTab}
              fill={metricTab === 'r2' ? '#3b82f6' : '#f43f5e'}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Comparison Table */}
      <div className="border border-slate-200 rounded-lg overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
            <tr>
              <th className="py-2.5 px-3">Rank</th>
              <th className="py-2.5 px-3">Model Architecture</th>
              <th className="py-2.5 px-3">MAE (Mean Absolute Error)</th>
              <th className="py-2.5 px-3">RMSE (Root Mean Sq Error)</th>
              <th className="py-2.5 px-3">R² Score</th>
              <th className="py-2.5 px-3">Primary Strength</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {MODEL_METRICS.map((m) => (
              <tr key={m.model} className={m.rank === 1 ? 'bg-blue-50/50 font-medium' : 'hover:bg-slate-50/80'}>
                <td className="py-2.5 px-3 font-bold">
                  {m.rank === 1 ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
                      ★ #1
                    </span>
                  ) : (
                    <span className="text-slate-500 font-mono">#{m.rank}</span>
                  )}
                </td>
                <td className="py-2.5 px-3 font-semibold text-slate-900">
                  <div className="flex items-center gap-1.5">
                    {m.model}
                    {m.rank === 1 && (
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded font-bold">
                        Production
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 font-normal">{m.category}</div>
                </td>
                <td className="py-2.5 px-3 font-mono font-medium">${m.mae.toLocaleString()}</td>
                <td className="py-2.5 px-3 font-mono font-medium">${m.rmse.toLocaleString()}</td>
                <td className="py-2.5 px-3 font-mono font-bold text-blue-600">{(m.r2).toFixed(3)}</td>
                <td className="py-2.5 px-3 text-slate-500">{m.bestFor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Actuarial Interpretation & Findings */}
      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 text-xs space-y-2 text-slate-700">
        <div className="font-bold text-slate-900 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          Why Gradient Boosted Trees and Random Forests Excel
        </div>
        <p className="leading-relaxed">
          In medical insurance data, non-linear feature interactions dominate pricing liability. Plain linear models assume smoking adds a constant fixed dollar penalty regardless of BMI. In reality, an individual who is both a <strong>smoker</strong> and has a <strong>BMI &gt; 30.0</strong> experiences an exponential jump in medical costs from ~$15,000 to over $40,000.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-[11px]">
          <div className="p-2.5 rounded bg-white border border-slate-200">
            <span className="font-bold text-slate-900">Tree Ensembles (XGBoost / GBR):</span> Partition the multidimensional feature space dynamically, capturing the exact $30k+ threshold cliff with minimal bias.
          </div>
          <div className="p-2.5 rounded bg-white border border-slate-200">
            <span className="font-bold text-slate-900">Linear / Ridge Models:</span> Under-predict for obese smokers and over-predict for lean non-smokers due to rigid additive linearity assumptions.
          </div>
        </div>
      </div>
    </div>
  );
};
