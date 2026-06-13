/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Flag, Search, CheckCircle, Flame, ExternalLink, RefreshCw } from 'lucide-react';
import { Flag as FlagType } from './types';
import { flagsData } from './data/flags';

export default function App() {
  const [flags, setFlags] = useState<FlagType[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');

  useEffect(() => {
    loadFlags();
  }, [search, selectedRegion]);

  const loadFlags = async () => {
    setLoading(true);
    // Simulate network delay for effect
    await new Promise(r => setTimeout(r, 400));
    
    let filteredFlags = [...flagsData];
    
    if (search) {
      filteredFlags = filteredFlags.filter(
        (f) =>
          f.name.toLowerCase().includes(search.toLowerCase()) ||
          f.code.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (selectedRegion) {
      filteredFlags = filteredFlags.filter((f) => f.region === selectedRegion);
    }
    
    setFlags(filteredFlags);
    setLoading(false);
  };

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
              <h1 className="text-2xl font-bold text-white tracking-tight">Flags Client</h1>
              <p className="text-neutral-400 text-sm">Blazing fast embedded flag data</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-neutral-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span>Built-in Data: <strong className="text-emerald-500 font-medium">Ready</strong></span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        
        {/* Explorer Section */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Flag Explorer</h2>
              <p className="text-neutral-500 text-sm">Browse 250 countries and territories instantly.</p>
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
                <option value="Antarctic">Antarctic</option>
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
                  transition={{ delay: i * 0.01 }}
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col items-center text-center hover:border-indigo-500/50 transition-colors group"
                >
                  <div className="w-16 h-12 mb-4 rounded shadow-sm overflow-hidden bg-neutral-800 relative">
                    <img 
                      src={flag.flagUrl} 
                      alt={`Flag of ${flag.name}`} 
                      loading="lazy"
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
                <div className="col-span-full py-12 text-center text-neutral-500 font-medium">
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
