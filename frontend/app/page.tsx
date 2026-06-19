"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Users, Plane, MessageCircle, MapPin } from "lucide-react";
import CountUp from "react-countup";
import { api } from "@/lib/api";

function useNextMatch() {
  const [nextMatch, setNextMatch] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    api.getMatches().then((data) => {
      const matches = data.matches || [];
      const now = Date.now();
      const upcoming = matches
  .filter((m: any) =>
    (m.status === "TIMED" || m.status === "SCHEDULED") &&
    new Date(m.utcDate).getTime() > now
  )
        .sort((a: any, b: any) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime());

      if (upcoming.length > 0) setNextMatch(upcoming[0]);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!nextMatch) return;
    const target = new Date(nextMatch.utcDate).getTime();
    const interval = setInterval(() => {
      const diff = target - Date.now();
      if (diff <= 0) { clearInterval(interval); return; }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [nextMatch]);

  return { nextMatch, timeLeft };
}

const HOST_CITIES = [
  { city: "New York", country: "🇺🇸", matches: 8 },
  { city: "Los Angeles", country: "🇺🇸", matches: 7 },
  { city: "Dallas", country: "🇺🇸", matches: 6 },
  { city: "San Francisco", country: "🇺🇸", matches: 6 },
  { city: "Miami", country: "🇺🇸", matches: 6 },
  { city: "Seattle", country: "🇺🇸", matches: 6 },
  { city: "Boston", country: "🇺🇸", matches: 5 },
  { city: "Atlanta", country: "🇺🇸", matches: 5 },
  { city: "Kansas City", country: "🇺🇸", matches: 5 },
  { city: "Philadelphia", country: "🇺🇸", matches: 5 },
  { city: "Mexico City", country: "🇲🇽", matches: 5 },
  { city: "Guadalajara", country: "🇲🇽", matches: 4 },
  { city: "Monterrey", country: "🇲🇽", matches: 4 },
  { city: "Toronto", country: "🇨🇦", matches: 5 },
  { city: "Vancouver", country: "🇨🇦", matches: 5 },
  { city: "Edmonton", country: "🇨🇦", matches: 4 },
];

export default function Home() {
  // Récupération dynamique du prochain match et du temps restant
  const { nextMatch, timeLeft } = useNextMatch();
  const { days, hours, minutes, seconds } = timeLeft;

  return (
    <main className="min-h-screen bg-[#F5F0E8] overflow-hidden">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen">

        {/* Background poster */}
        <div className="absolute inset-0">
          <Image
            src="/wc-poster.jpg"
            alt="FIFA World Cup 2026"
            fill
            className="object-cover object-center opacity-15"
            priority
          />
        </div>

        {/* Ribbon décoratif */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
          <div className="absolute top-10 right-0 w-32 h-full bg-[#003DA5] skew-x-6 transform" />
          <div className="absolute top-10 right-20 w-24 h-full bg-[#007A4D] skew-x-6 transform" />
          <div className="absolute top-10 right-36 w-20 h-full bg-[#C8102E] skew-x-6 transform" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 bg-[#003DA5] text-white px-4 py-2 rounded-full mb-6 text-sm font-semibold"
            >
              <div className="w-2 h-2 bg-[#C9A84C] rounded-full animate-pulse" />
              3 NATIONS · 16 HOST CITIES · ONE DREAM
            </motion.div>

            {/* Title */}
            <h1 className="font-black leading-none mb-2">
              <span className="block text-6xl lg:text-8xl text-[#003DA5]">FIFA</span>
              <span className="block text-6xl lg:text-8xl text-[#003DA5]">WORLD</span>
              <span className="block text-6xl lg:text-8xl text-[#003DA5]">CUP</span>
              <span className="block text-7xl lg:text-9xl gold-gradient">2026</span>
            </h1>

            <p className="text-[#003DA5]/70 font-semibold text-lg mb-2 tracking-widest">
              MEN'S FOOTBALL
            </p>
            <p className="text-[#003DA5]/60 mb-8 text-sm">
              UNITED BY PASSION. INSPIRED BY THE WORLD.
            </p>

            {/* Flags */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-3xl">🇺🇸</span>
              <span className="text-[#003DA5]/30 font-bold">·</span>
              <span className="text-3xl">🇨🇦</span>
              <span className="text-[#003DA5]/30 font-bold">·</span>
              <span className="text-3xl">🇲🇽</span>
              <span className="text-[#003DA5]/60 text-sm font-semibold ml-2">
                UNITED STATES · CANADA · MEXICO
              </span>
            </div>

            {/* Dates */}
            <div className="flex items-center gap-3 mb-8 bg-white/60 rounded-2xl p-4 w-fit">
              <Calendar size={20} className="text-[#003DA5]" />
              <div>
                <div className="font-black text-[#003DA5]">11 JUNE – 19 JULY 2026</div>
                <div className="text-[#003DA5]/60 text-xs">THE WORLD'S GAME. THE WORLD TOGETHER.</div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link href="/chat">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-[#003DA5] hover:bg-[#0052CC] text-white px-8 py-4 rounded-full font-black transition text-sm tracking-wide"
                >
                  <MessageCircle size={18} />
                  LANCER LE COPILOT IA
                </motion.button>
              </Link>
              <Link href="/matches">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 border-2 border-[#003DA5] text-[#003DA5] hover:bg-[#003DA5] hover:text-white px-8 py-4 rounded-full font-black transition text-sm tracking-wide"
                >
                  <Calendar size={18} />
                  VOIR LES MATCHS
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Right — Trophy + Countdown */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center gap-8"
          >
            {/* Trophy */}
            <div className="float-animation drop-shadow-2xl">
              <Image
                src="/trophyy.png"
                alt="FIFA World Cup Trophy"
                width={300}
                height={380}
                className="mx-auto mb-6 object-contain"
              />
            </div>

            {/* Countdown */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-[#003DA5] rounded-3xl p-6 w-full max-w-sm shadow-2xl"
            >
              {nextMatch ? (
                <>
                  <p className="text-center text-[#C9A84C] font-black mb-4 text-xs tracking-widest uppercase">
                    ⚽ Prochain match dans
                  </p>

                  {/* Grille du Compte à rebours */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[
                      { value: days, label: "JOURS" },
                      { value: hours, label: "HEURES" },
                      { value: minutes, label: "MIN" },
                      { value: seconds, label: "SEC" },
                    ].map(({ value, label }) => (
                      <div key={label} className="text-center">
                        <div className="bg-white/10 rounded-xl p-2 mb-1">
                          <span className="text-2xl font-black text-white">
                            {String(value).padStart(2, "0")}
                          </span>
                        </div>
                        <span className="text-xs text-[#C9A84C] font-bold">{label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Détails du Match */}
                  <div className="border-t border-white/10 pt-3 text-center">
                    <div className="flex items-center justify-center gap-3 text-white font-black text-sm">
                      <span>{nextMatch.homeTeam?.name || "TBD"}</span>
                      <span className="text-[#C9A84C]">VS</span>
                      <span>{nextMatch.awayTeam?.name || "TBD"}</span>
                    </div>
                    {nextMatch.venue && (
                      <div className="text-white/50 text-xs mt-2">📍 {nextMatch.venue}</div>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-center text-white/70 text-sm py-4">
                  ⚽ Tournoi en cours — calendrier des prochains matchs à venir
                </p>
              )}
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────── */}
      <section className="py-16 bg-[#003DA5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: 48, label: "ÉQUIPES", icon: "🌍" },
              { value: 104, label: "MATCHS", icon: "⚽" },
              { value: 16, label: "VILLES HÔTES", icon: "🏙️" },
              { value: 3, label: "PAYS", icon: "🏳️" },
            ].map(({ value, label, icon }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl mb-2">{icon}</div>
                <div className="text-4xl font-black text-[#C9A84C]">
                  <CountUp end={value} duration={2} />
                </div>
                <div className="text-white/70 text-xs font-bold tracking-widest mt-1">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-black text-[#003DA5] mb-2">
              WORLDCUP COPILOT
            </h2>
            <div className="w-24 h-1 bg-[#C9A84C] mx-auto mb-4" />
            <p className="text-[#003DA5]/60">
              Tout ce dont tu as besoin pour vivre la Coupe du Monde 2026
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Calendar size={36} />,
                title: "CALENDRIER LIVE",
                desc: "Matchs, scores en direct et classements mis à jour en temps réel",
                href: "/matches",
                color: "bg-[#003DA5]",
              },
              {
                icon: <Users size={36} />,
                title: "ÉQUIPES & JOUEURS",
                desc: "Stats détaillées des 48 équipes et tous les joueurs qualifiés",
                href: "/teams",
                color: "bg-[#007A4D]",
              },
              {
                icon: <Plane size={36} />,
                title: "PLANIFICATION VOYAGE",
                desc: "Budget, villes hôtes, hôtels et transport local",
                href: "/travel",
                color: "bg-[#C8102E]",
              },
              {
                icon: <MessageCircle size={36} />,
                title: "COPILOT IA",
                desc: "Assistant conversationnel propulsé par Llama3",
                href: "/chat",
                color: "bg-[#C9A84C]",
              },
            ].map(({ icon, title, desc, href, color }) => (
              <Link href={href} key={title}>
                <motion.div
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="rounded-3xl overflow-hidden shadow-lg cursor-pointer h-full"
                >
                  <div className={`${color} p-8 text-white h-full`}>
                    <div className="mb-4 opacity-90">{icon}</div>
                    <h3 className="font-black text-lg mb-2 tracking-wide">{title}</h3>
                    <p className="text-white/80 text-sm">{desc}</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOST CITIES ──────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#F5F0E8]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-black text-[#003DA5] mb-2">
              16 VILLES HÔTES
            </h2>
            <div className="w-24 h-1 bg-[#C9A84C] mx-auto mb-4" />
            <p className="text-[#003DA5]/60">À travers 3 pays et 2 continents</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {HOST_CITIES.map(({ city, country, matches }, i) => (
              <motion.div
                key={city}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05, y: -3 }}
                className="bg-white rounded-2xl p-4 shadow-md cursor-pointer border border-[#003DA5]/10"
              >
                <div className="text-2xl mb-2">{country}</div>
                <div className="font-bold text-[#003DA5] text-sm">{city}</div>
                <div className="text-[#C9A84C] text-xs flex items-center gap-1 mt-1 font-semibold">
                  <MapPin size={10} />
                  {matches} matchs
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#003DA5]">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <Image
              src="/trophy.png"
              alt="Trophy"
              width={80}
              height={100}
              className="mx-auto mb-6 object-contain"
            />
            <h2 className="text-4xl font-black text-white mb-2">
              PRÊT POUR LE
            </h2>
            <h2 className="text-5xl font-black gold-gradient mb-6">
              MUNDIAL ?
            </h2>
            <p className="text-white/70 mb-8">
              Pose ta première question au Copilot IA et commence à planifier ton expérience WC 2026
            </p>
            <Link href="/chat">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#C9A84C] hover:bg-[#B8860B] text-[#003DA5] px-10 py-4 rounded-full font-black text-lg transition tracking-wide"
              >
                ⚽ LANCER LE COPILOT IA
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

    </main>
  );
}