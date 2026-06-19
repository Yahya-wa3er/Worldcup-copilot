"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Search } from "lucide-react";
import { api } from "@/lib/api";

export default function TeamsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.getTeams().then((data) => {
      setTeams(data.teams || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = teams.filter((t) =>
    t.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.area?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#F5F0E8]">

      {/* Header */}
      <section className="bg-[#003DA5] py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-full bg-[#007A4D] skew-x-12" />
          <div className="absolute top-0 right-32 w-48 h-full bg-[#C8102E] skew-x-12" />
        </div>
        <div className="max-w-7xl mx-auto relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <Users size={32} className="text-[#C9A84C]" />
              <h1 className="text-4xl font-black text-white tracking-wide">
                LES ÉQUIPES
              </h1>
            </div>
            <p className="text-white/70 text-sm tracking-widest">
              FIFA WORLD CUP 2026 · 48 ÉQUIPES QUALIFIÉES
            </p>
            <div className="w-24 h-1 bg-[#C9A84C] mt-4" />
          </motion.div>
        </div>
      </section>

      {/* Search */}
      <section className="bg-white shadow-sm px-6 py-4 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="relative max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#003DA5]/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une équipe..."
              className="w-full bg-[#F5F0E8] text-[#003DA5] placeholder-[#003DA5]/40 rounded-full pl-10 pr-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#003DA5]"
            />
          </div>
        </div>
      </section>

      {/* Teams Grid */}
      <section className="py-10 px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 animate-pulse h-32" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🌍</div>
              <p className="text-[#003DA5] font-bold">Aucune équipe trouvée</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filtered.map((team, i) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.02 }}
                  whileHover={{ scale: 1.05, y: -3 }}
                  className="bg-white rounded-2xl p-4 shadow-md border border-[#003DA5]/10 cursor-pointer text-center"
                >
                  {team.crest ? (
                      <div className="w-16 h-16 bg-white border border-[#003DA5]/10 rounded-xl mx-auto mb-3 flex items-center justify-center p-2 shadow-sm">
                    <img
                      src={team.crest}
                      alt={team.name}
                      className="w-16 h-16 object-contain mx-auto mb-3"
                    />
                        </div>
                  ) : (
                    <div className="w-16 h-16 bg-[#003DA5]/10 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <span className="text-2xl">🏳️</span>
                    </div>
                  )}
                  {team.area?.name && (
                    <div className="text-[#003DA5]/50 text-xs mt-1">
                      {team.area.name}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}