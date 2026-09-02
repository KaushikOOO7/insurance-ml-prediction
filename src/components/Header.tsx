import React from 'react';
import { Activity, ShieldCheck, Database, Award } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Medical Insurance Charges Predictor
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Machine Learning regression models trained on 1,338 records
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2 text-xs">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Production Model: XGBoost (R² 0.881)</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-medium">
              <Database className="w-3.5 h-3.5 text-slate-500" />
              <span>1,338 Clean Records</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
