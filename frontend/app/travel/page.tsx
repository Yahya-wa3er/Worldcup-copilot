"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plane, Hotel, Bus, DollarSign, MapPin } from "lucide-react";
import { api } from "@/lib/api";

const HOST_CITIES = [
  "New York", "Los Angeles", "Miami", "Dallas",
  "San Francisco", "Seattle", "Boston", "Atlanta",
  "Kansas City", "Philadelphia", "Toronto", "Vancouver",
  "Mexico City", "Guadalajara", "Monterrey", "Edmonton",
];

export default function TravelPage() {
  const [form, setForm] = useState({
    origin_city: "",
    destination_city: "",
    nb_persons: 1,
    nb_nights: 3,
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.origin_city || !form.destination_city) return;
    setLoading(true);
    const data = await api.estimateBudget(form);
    setResult(data);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#F5F0E8]">

      {/* Header */}
      <section className="bg-[#C8102E] py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-full bg-[#003DA5] skew-x-12" />
          <div className="absolute top-0 right-32 w-48 h-full bg-[#C9A84C] skew-x-12" />
        </div>
        <div className="max-w-7xl mx-auto relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <Plane size={32} className="text-[#C9A84C]" />
              <h1 className="text-4xl font-black text-white tracking-wide">
                PLANIFICATION VOYAGE
              </h1>
            </div>
            <p className="text-white/70 text-sm tracking-widest">
              ESTIME TON BUDGET POUR LA COUPE DU MONDE 2026
            </p>
            <div className="w-24 h-1 bg-[#C9A84C] mt-4" />
          </motion.div>
        </div>
      </section>

      <section className="py-10 px-6">
        <div className="max-w-2xl mx-auto">

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-lg overflow-hidden mb-6"
          >
            <div className="bg-[#003DA5] px-6 py-4">
              <h2 className="text-white font-black tracking-wide">CALCULER MON BUDGET</h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-black text-[#003DA5] tracking-widest mb-2 block">
                  VILLE DE DÉPART
                </label>
                <input
                  type="text"
                  value={form.origin_city}
                  onChange={(e) => setForm({ ...form, origin_city: e.target.value })}
                  placeholder="Ex: Casablanca, Paris, Rabat..."
                  className="w-full bg-[#F5F0E8] text-[#003DA5] placeholder-[#003DA5]/40 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#003DA5]"
                />
              </div>

              <div>
                <label className="text-xs font-black text-[#003DA5] tracking-widest mb-2 block">
                  VILLE HÔTE DE DESTINATION
                </label>
                <select
                  value={form.destination_city}
                  onChange={(e) => setForm({ ...form, destination_city: e.target.value })}
                  className="w-full bg-[#F5F0E8] text-[#003DA5] rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#003DA5]"
                >
                  <option value="">Sélectionne une ville hôte</option>
                  {HOST_CITIES.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-[#003DA5] tracking-widest mb-2 block">
                    PERSONNES
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={form.nb_persons}
                    onChange={(e) => setForm({ ...form, nb_persons: parseInt(e.target.value) || 1 })}
                    className="w-full bg-[#F5F0E8] text-[#003DA5] rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#003DA5]"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-[#003DA5] tracking-widest mb-2 block">
                    NUITS
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={form.nb_nights}
                    onChange={(e) => setForm({ ...form, nb_nights: parseInt(e.target.value) || 1 })}
                    className="w-full bg-[#F5F0E8] text-[#003DA5] rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#003DA5]"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={loading || !form.origin_city || !form.destination_city}
                className="w-full bg-[#C8102E] hover:bg-[#A00000] disabled:bg-gray-300 text-white py-4 rounded-xl font-black tracking-widest transition text-sm"
              >
                {loading ? "CALCUL EN COURS..." : "ESTIMER MON BUDGET ✈️"}
              </motion.button>
            </div>
          </motion.div>

          {/* Result */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-lg overflow-hidden"
            >
              <div className="bg-[#C9A84C] px-6 py-4">
                <h2 className="text-[#003DA5] font-black tracking-wide">
                  💰 ESTIMATION BUDGET
                </h2>
                <p className="text-[#003DA5]/70 text-xs mt-1">
                  {result.origin_city} → {result.destination_city} · {result.nb_persons} pers. · {result.nb_nights} nuits
                </p>
              </div>

              <div className="p-6">
                <div className="space-y-4 mb-6">
                  {[
                    { icon: <Plane size={20} />, label: "VOLS", value: result.flight_cost, color: "text-[#003DA5]" },
                    { icon: <Hotel size={20} />, label: "HÔTEL", value: result.hotel_cost, color: "text-[#007A4D]" },
                    { icon: <Bus size={20} />, label: "TRANSPORT LOCAL", value: result.transport_cost, color: "text-[#C8102E]" },
                  ].map(({ icon, label, value, color }) => (
                    <div key={label} className="flex items-center justify-between p-4 bg-[#F5F0E8] rounded-xl">
                      <div className={`flex items-center gap-3 ${color}`}>
                        {icon}
                        <span className="font-black text-xs tracking-widest">{label}</span>
                      </div>
                      <span className="font-black text-[#003DA5]">${value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t-2 border-[#003DA5]/10 pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign size={24} className="text-[#C9A84C]" />
                    <span className="font-black text-[#003DA5] text-lg tracking-widest">TOTAL</span>
                  </div>
                  <span className="font-black text-3xl text-[#C8102E]">
                    ${result.total_cost.toLocaleString()}
                  </span>
                </div>

                <p className="text-[#003DA5]/40 text-xs mt-4 text-center">
                  {result.details?.note}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}