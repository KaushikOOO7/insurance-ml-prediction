import React, { useState, useMemo } from 'react';
import { SAMPLE_RECORDS } from '../data/insuranceData';
import { InsuranceRecord, Smoker, Region } from '../types';
import { Database, Filter, Search, ArrowUpDown } from 'lucide-react';

export const DatasetExplorer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [smokerFilter, setSmokerFilter] = useState<string>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filteredRecords = useMemo(() => {
    return SAMPLE_RECORDS.filter((rec) => {
      const matchesSearch =
        rec.age.toString().includes(searchTerm) ||
        rec.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.charges.toFixed(0).includes(searchTerm);
      const matchesSmoker = smokerFilter === 'all' || rec.smoker === smokerFilter;
      const matchesRegion = regionFilter === 'all' || rec.region === regionFilter;
      return matchesSearch && matchesSmoker && matchesRegion;
    });
  }, [searchTerm, smokerFilter, regionFilter]);

  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const currentRecords = filteredRecords.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            Dataset Sample Viewer
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Inspecting raw observations from the 1,338 records Insurance benchmark dataset
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search dataset..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="text-xs py-1.5 pl-7 pr-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
          </div>

          {/* Smoker filter */}
          <select
            value={smokerFilter}
            onChange={(e) => {
              setSmokerFilter(e.target.value);
              setPage(1);
            }}
            className="text-xs py-1.5 px-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none"
          >
            <option value="all">All Smokers</option>
            <option value="yes">Smokers Only</option>
            <option value="no">Non-Smokers Only</option>
          </select>

          {/* Region filter */}
          <select
            value={regionFilter}
            onChange={(e) => {
              setRegionFilter(e.target.value);
              setPage(1);
            }}
            className="text-xs py-1.5 px-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none"
          >
            <option value="all">All Regions</option>
            <option value="southwest">Southwest</option>
            <option value="southeast">Southeast</option>
            <option value="northwest">Northwest</option>
            <option value="northeast">Northeast</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="border border-slate-200 rounded-lg overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
            <tr>
              <th className="py-2.5 px-3">#ID</th>
              <th className="py-2.5 px-3">Age</th>
              <th className="py-2.5 px-3">Sex</th>
              <th className="py-2.5 px-3">BMI</th>
              <th className="py-2.5 px-3">Children</th>
              <th className="py-2.5 px-3">Smoker</th>
              <th className="py-2.5 px-3">Region</th>
              <th className="py-2.5 px-3 text-right">Actual Charges ($)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {currentRecords.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/70">
                <td className="py-2 px-3 text-slate-400 font-mono">#{r.id}</td>
                <td className="py-2 px-3 font-semibold">{r.age}</td>
                <td className="py-2 px-3 capitalize">{r.sex}</td>
                <td className="py-2 px-3 font-mono">{r.bmi.toFixed(2)}</td>
                <td className="py-2 px-3">{r.children}</td>
                <td className="py-2 px-3">
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      r.smoker === 'yes' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {r.smoker.toUpperCase()}
                  </span>
                </td>
                <td className="py-2 px-3 capitalize">{r.region}</td>
                <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                  ${r.charges.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
            {currentRecords.length === 0 && (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
        <div>
          Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filteredRecords.length)} of {filteredRecords.length} records
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-2.5 py-1 rounded border border-slate-200 bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
          >
            Prev
          </button>
          <span className="font-medium text-slate-700">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-2.5 py-1 rounded border border-slate-200 bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
