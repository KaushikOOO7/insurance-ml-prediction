import React from 'react';
import { FEATURE_IMPORTANCES } from '../ml/models';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { Sliders, Zap } from 'lucide-react';

export const FeatureImportance: React.FC = () => {
  const chartData = FEATURE_IMPORTANCES.map((f) => ({
    name: f.feature.toUpperCase(),
    importancePct: parseFloat((f.importance * 100).toFixed(1)),
    importance: f.importance,
    impactLevel: f.impactLevel,
  }));

  const colors = ['#e11d48', '#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#64748b'];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-indigo-600" />
          Feature Importance (MDI - Mean Decrease in Impurity)
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Relative contribution of each input variable extracted from the top-performing XGBoost model
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Horizontal Bar Chart */}
        <div className="lg:col-span-6 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" unit="%" tick={{ fontSize: 11, fill: '#64748b' }} domain={[0, 70]} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }} />
              <Tooltip
                formatter={(val: any) => [`${val}%`, 'Importance Weight']}
                contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="importancePct" radius={[0, 4, 4, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Breakdown List */}
        <div className="lg:col-span-6 space-y-2.5">
          {FEATURE_IMPORTANCES.map((item, idx) => (
            <div
              key={item.feature}
              className="p-3 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-all text-xs"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 uppercase font-mono tracking-wider">
                    {item.feature}
                  </span>
                  <span
                    className={`px-2 py-0.2 rounded-full text-[10px] font-semibold border ${
                      item.impactLevel === 'High'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : item.impactLevel === 'Medium'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {item.impactLevel} Impact
                  </span>
                </div>
                <span className="font-mono font-bold text-slate-800">
                  {(item.importance * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 mb-1.5 overflow-hidden">
                <div
                  className="h-1.5 rounded-full"
                  style={{
                    width: `${item.importance * 100}%`,
                    backgroundColor: colors[idx % colors.length],
                  }}
                />
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
