"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Trophy } from "lucide-react";
import { api } from "@/lib/api";

export default function MatchesPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("GROUPS");

  useEffect(() => {
    Promise.all([
      api.getMatches().catch(() => ({ matches: [] })),
      api.getStandings().catch(() => ({ standings: [] })),
    ]).then(([matchData, standingsData]) => {
      setMatches(matchData.matches || []);
      setStandings(standingsData.standings || []);
      setLoading(false);
    });
  }, []);

  // Extraire les phases réellement présentes dans les données
  const availableStages = Array.from(
    new Set(matches.map((m) => m.stage).filter(Boolean))
  );

  const STAGE_LABELS: Record<string, string> = {
    GROUP_STAGE: "MATCHS GROUPES",
    LEAGUE_STAGE: "MATCHS GROUPES",
    LAST_16: "16ÈMES",
    ROUND_OF_16: "16ÈMES",
    ROUND_OF_32: "32ÈMES",
    QUARTER_FINALS: "QUARTS",
    SEMI_FINALS: "DEMIS",
    THIRD_PLACE: "3ÈME PLACE",
    FINAL: "FINALE",
  };

  const tabs = [
    { key: "GROUPS", label: "🏆 CLASSEMENT" },
    ...availableStages.map((s) => ({ key: s, label: STAGE_LABELS[s] || s })),
  ];

  const filteredMatches =
    filter === "GROUPS" ? [] : matches.filter((m) => m.stage === filter);

  const getStatusColor = (status: string) => {
    if (status === "IN_PLAY" || status === "PAUSED") return "bg-green-500";
    if (status === "FINISHED") return "bg-gray-400";
    return "bg-[#003DA5]";
  };

  const getStatusLabel = (status: string) => {
  if (status === "IN_PLAY" || status === "PAUSED") return "LIVE";
  if (status === "FINISHED") return "TERMINÉ";
  if (status === "TIMED" || status === "SCHEDULED") return "PROGRAMMÉ";
  return status;
};

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
              <Calendar size={32} className="text-[#C9A84C]" />
              <h1 className="text-4xl font-black text-white tracking-wide">
                CALENDRIER & CLASSEMENTS
              </h1>
            </div>
            <p className="text-white/70 text-sm tracking-widest">
              FIFA WORLD CUP 2026 · 11 JUIN – 19 JUILLET
            </p>
            <div className="w-24 h-1 bg-[#C9A84C] mt-4" />
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white shadow-sm px-6 py-4 sticky top-[68px] z-40">
        <div className="max-w-7xl mx-auto flex gap-3 overflow-x-auto pb-1">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-full text-xs font-black whitespace-nowrap transition ${
                filter === key
                  ? "bg-[#003DA5] text-white"
                  : "bg-[#F5F0E8] text-[#003DA5] hover:bg-[#003DA5]/10"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="py-10 px-6">
        <div className="max-w-4xl mx-auto">

          {loading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 animate-pulse h-24" />
              ))}
            </div>
          ) : filter === "GROUPS" ? (
            // ── CLASSEMENT PAR GROUPE ──────────────────────────
            standings.length === 0 ? (
              <div className="text-center py-20">
                <Trophy size={48} className="mx-auto mb-4 text-[#003DA5]/30" />
                <p className="text-[#003DA5] font-bold">
                  Classements non disponibles pour le moment
                </p>
                <p className="text-[#003DA5]/50 text-sm mt-2">
                  Ils apparaîtront dès le début des matchs de groupe
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {standings.map((group: any, gi: number) => (
                  <motion.div
                    key={gi}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: gi * 0.05 }}
                    className="bg-white rounded-2xl shadow-md overflow-hidden border border-[#003DA5]/10"
                  >
                    <div className="bg-[#003DA5] px-6 py-3">
                      <h3 className="text-white font-black tracking-wide text-sm">
                        {group.group?.replace(/_/g, " ") || `GROUPE ${gi + 1}`}
                      </h3>
                    </div>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-[#003DA5]/50 text-xs">
                          <th className="text-left px-4 py-2 font-bold">#</th>
                          <th className="text-left px-2 py-2 font-bold">ÉQUIPE</th>
                          <th className="px-2 py-2 font-bold">J</th>
                          <th className="px-2 py-2 font-bold">G</th>
                          <th className="px-2 py-2 font-bold">N</th>
                          <th className="px-2 py-2 font-bold">P</th>
                          <th className="px-2 py-2 font-bold">DB</th>
                          <th className="px-4 py-2 font-bold">PTS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.table?.map((row: any) => (
                          <tr key={row.team.id} className="border-t border-[#003DA5]/5">
                            <td className="px-4 py-3 text-[#003DA5]/40 font-bold">{row.position}</td>
                            <td className="px-2 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-white border border-[#003DA5]/10 rounded flex items-center justify-center p-0.5 flex-shrink-0">
                                  {row.team.crest && (
                                    <img src={row.team.crest} alt="" className="w-full h-full object-contain" />
                                  )}
                                </div>
                                <span className="font-bold text-[#003DA5]">
                                  {row.team.shortName || row.team.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-2 py-3 text-center text-[#003DA5]/70">{row.playedGames}</td>
                            <td className="px-2 py-3 text-center text-[#003DA5]/70">{row.won}</td>
                            <td className="px-2 py-3 text-center text-[#003DA5]/70">{row.draw}</td>
                            <td className="px-2 py-3 text-center text-[#003DA5]/70">{row.lost}</td>
                            <td className="px-2 py-3 text-center text-[#003DA5]/70">{row.goalDifference}</td>
                            <td className="px-4 py-3 text-center font-black text-[#003DA5]">{row.points}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </motion.div>
                ))}
              </div>
            )
          ) : (
            // ── LISTE DES MATCHS ───────────────────────────────
            filteredMatches.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">⚽</div>
                <p className="text-[#003DA5] font-bold">Aucun match disponible pour cette phase</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMatches.map((match, i) => (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="bg-white rounded-2xl shadow-md overflow-hidden border border-[#003DA5]/10 hover:shadow-lg transition"
                  >
                    <div className="bg-[#003DA5]/5 px-6 py-2 flex items-center justify-between">
                      <span className="text-xs font-bold text-[#003DA5]/60 tracking-widest">
                        {match.stage?.replace(/_/g, " ")} {match.group ? `· ${match.group}` : ""}
                      </span>
                      <span className={`text-xs font-black text-white px-3 py-1 rounded-full ${getStatusColor(match.status)}`}>
                        {getStatusLabel(match.status)}
                      </span>
                    </div>

                    <div className="px-6 py-4 flex items-center justify-between">
                      <div className="flex-1 flex items-center gap-3">
                        {match.homeTeam?.crest && (
                          <div className="w-10 h-10 bg-white border border-[#003DA5]/10 rounded-lg flex items-center justify-center p-1 flex-shrink-0">
                            <img src={match.homeTeam.crest} alt="" className="w-full h-full object-contain" />
                          </div>
                        )}
                        <span className="font-black text-[#003DA5] text-lg">
                          {match.homeTeam?.shortName || match.homeTeam?.name || "TBD"}
                        </span>
                      </div>

                      <div className="text-center px-6">
                        {match.status === "SCHEDULED" ? (
                          <div>
                            <div className="text-2xl font-black text-[#003DA5]">VS</div>
                            <div className="text-xs text-[#003DA5]/50 flex items-center gap-1 justify-center mt-1">
                              <Clock size={10} />
                              {new Date(match.utcDate).toLocaleDateString("fr-FR", {
                                day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                              })}
                            </div>
                          </div>
                        ) : (
                          <div className="text-3xl font-black text-[#003DA5]">
                            {match.score?.fullTime?.home ?? "-"}
                            <span className="text-[#C9A84C] mx-2">:</span>
                            {match.score?.fullTime?.away ?? "-"}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 flex items-center gap-3 justify-end">
                        <span className="font-black text-[#003DA5] text-lg text-right">
                          {match.awayTeam?.shortName || match.awayTeam?.name || "TBD"}
                        </span>
                        {match.awayTeam?.crest && (
                          <div className="w-10 h-10 bg-white border border-[#003DA5]/10 rounded-lg flex items-center justify-center p-1 flex-shrink-0">
                            <img src={match.awayTeam.crest} alt="" className="w-full h-full object-contain" />
                          </div>
                        )}
                      </div>
                    </div>

                    {match.venue && (
                      <div className="px-6 pb-3 flex items-center gap-1 text-xs text-[#003DA5]/50">
                        <MapPin size={10} />
                        {match.venue}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )
          )}
        </div>
      </section>
    </main>
  );
}