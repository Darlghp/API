/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Flag, Search, Code, CheckCircle, ExternalLink } from 'lucide-react';
import { Flag as FlagType } from './types';

export default function App() {
  const [flags, setFlags] = useState<FlagType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [apiResponse, setApiResponse] = useState<string>('');

  const apiUrl = import.meta.env.VITE_APP_URL || '';

  useEffect(() => {
    fetchFlags();
  }, [search, selectedRegion]);

  const fetchFlags = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedRegion) params.append('region', selectedRegion);

      const url = `${apiUrl}/api/flags?${params.toString()}`;
      
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const json = await res.json();
      
      if (json.success) {
        setFlags(json.data);
      }
    } catch (error: any) {
      console.error('Failed to fetch flags:', error);
    } finally {
      setLoading(false);
    }
  };

  const testApi = async (endpoint: string) => {
    try {
      const res = await fetch(`${apiUrl}${endpoint}`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const json = await res.json();
      setApiResponse(JSON.stringify(json, null, 2));
    } catch (error: any) {
      setApiResponse(`Erro ao obter dados: ${error.message}`);
    }
  };


  useEffect(() => {
    testApi('/api/flags');
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Flag className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Flags API</h1>
              <p className="text-neutral-400 text-sm">A simple REST API for country flags</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-neutral-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span>Status: <strong className="text-emerald-500 font-medium">Online</strong></span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        
        {/* Documentation Section */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Code className="h-5 w-5 text-indigo-500" />
            API Documentation
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                <h3 className="font-medium text-white mb-4">Endpoints</h3>
                <ul className="space-y-4 text-sm">
                  <li className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <span className="bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-md font-mono text-xs font-semibold">GET</span>
                      <code className="text-neutral-300 font-mono">/api/flags</code>
                    </div>
                    <p className="text-neutral-500 pl-14">Get all flags. Accepts <code className="text-indigo-400">?search=</code> and <code className="text-indigo-400">?region=</code></p>
                  </li>
                  <li className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <span className="bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-md font-mono text-xs font-semibold">GET</span>
                      <code className="text-neutral-300 font-mono">/api/flags/:code</code>
                    </div>
                    <p className="text-neutral-500 pl-14">Get a single flag by ISO 3166-1 alpha-2 code (e.g., BR, US).</p>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-white">Live Response</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => testApi('/api/flags')}
                    className="text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    /api/flags
                  </button>
                  <button 
                    onClick={() => testApi('/api/flags/BR')}
                    className="text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    /api/flags/BR
                  </button>
                </div>
              </div>
              <div className="bg-neutral-950 rounded-xl p-4 flex-1 overflow-auto border border-neutral-800/50">
                <pre className="text-xs font-mono text-emerald-400">
                  {apiResponse}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Playground Section */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Flag Explorer</h2>
              <p className="text-neutral-500 text-sm">Browse the data available via the API.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-neutral-900 border border-neutral-800 text-sm text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 w-full md:w-64"
                />
              </div>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="bg-neutral-900 border border-neutral-800 text-sm text-neutral-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
              >
                <option value="">All Regions</option>
                <option value="Americas">Americas</option>
                <option value="Europe">Europe</option>
                <option value="Asia">Asia</option>
                <option value="Africa">Africa</option>
                <option value="Oceania">Oceania</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 animate-pulse h-40"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {flags.map((flag, i) => (
                <motion.div
                  key={flag.code}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col items-center text-center hover:border-indigo-500/50 transition-colors group"
                >
                  <div className="w-16 h-12 mb-4 rounded shadow-sm overflow-hidden bg-neutral-800 relative">
                    <img 
                      src={flag.flagUrl} 
                      alt={`Flag of ${flag.name}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-sm font-medium text-neutral-200 mb-1">{flag.name}</h3>
                  <div className="flex items-center gap-2 mt-auto">
                    <span className="text-xs font-mono text-neutral-500 bg-neutral-950 px-2 py-0.5 rounded-md">{flag.code}</span>
                  </div>
                </motion.div>
              ))}
              {flags.length === 0 && (
                <div className="col-span-full py-12 text-center text-neutral-500">
                  No flags found matching your criteria.
                </div>
              )}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
