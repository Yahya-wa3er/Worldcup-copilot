"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, Trophy, RotateCcw } from "lucide-react";
import { api } from "@/lib/api";
import Image from "next/image";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Quel est la capacité du stade Azteca ?",
  "Combien coûte un voyage à New York pour la finale ?",
  "Parle-moi de l'équipe du Brésil",
  "Comment acheter des billets FIFA 2026 ?",
  "Quelles sont les villes hôtes du Mexique ?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Bonjour ! Je suis WorldCup Copilot ⚽\n\nJe suis ton assistant IA pour la FIFA World Cup 2026. Je peux t'aider avec :\n\n• 🏟️ Informations sur les stades et matchs\n• ✈️ Planification de voyage et budget\n• 🌍 Stats des équipes et joueurs\n• 🎟️ Billets et conseils pratiques\n\nComment puis-je t'aider ?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const bottomRef = useRef<HTMLDivElement | null>(null);

 useEffect(() => {
  // On remplace le "!" par une sécurité "if" ou un point d'interrogation "?."
  bottomRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);

  const sendMessage = async (text?: string) => {
  const message = text || input.trim();
  if (!message || loading) return;
  setInput("");
  setLoading(true);

  setMessages((prev) => [...prev, { role: "user", content: message }]);

  // Ajoute un message assistant vide qu'on va remplir progressivement
  setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

  try {
    const result = await api.chat(message, sessionId, (chunk) => {
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        updated[updated.length - 1] = { ...last, content: last.content + chunk };
        return updated;
      });
    });
    setSessionId(result.session_id);
  } catch {
    setMessages((prev) => {
      const updated = [...prev];
      updated[updated.length - 1] = {
        role: "assistant",
        content: "❌ Erreur de connexion. Vérifiez que le serveur backend tourne sur le port 8000.",
      };
      return updated;
    });
  } finally {
    setLoading(false);
  }
};

  const resetChat = () => {
    setMessages([{
      role: "assistant",
      content: "Bonjour ! Je suis WorldCup Copilot ⚽\n\nComment puis-je t'aider pour la FIFA World Cup 2026 ?",
    }]);
    setSessionId(undefined);
  };

  return (
    <div className="flex flex-col h-screen bg-[#F5F0E8] pt-[28px]">

      {/* Header */}
      <div className="bg-[#003DA5] px-6 py-4 flex items-center justify-between shadow-lg relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#C9A84C] rounded-full flex items-center justify-center">
            <MessageCircle size={20} className="text-[#003DA5]" />
          </div>
          <div>
            <div className="text-white font-black tracking-wide">WORLDCUP COPILOT</div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white/60 text-xs">IA propulsée par Llama3</span>
            </div>
          </div>
        </div>
        <button
          onClick={resetChat}
          className="flex items-center gap-2 text-white/60 hover:text-white transition text-xs font-bold"
        >
          <RotateCcw size={14} />
          RESET
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">

        {/* Suggestions — only at start */}
        {messages.length === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 justify-center mb-4"
          >
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="bg-white border-2 border-[#003DA5]/20 hover:border-[#003DA5] text-[#003DA5] text-xs font-semibold px-4 py-2 rounded-full transition"
              >
                {s}
              </button>

            ))}
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {/* Avatar assistant */}
              {msg.role === "assistant" && (
                <div className="w-8 h-8 bg-[#003DA5] rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                  <span className="text-xs">⚽</span>
                </div>
              )}

              <div
                className={`max-w-2xl px-5 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                  msg.role === "user"
                    ? "bg-[#003DA5] text-white rounded-br-sm font-medium"
                    : "bg-white text-[#003DA5] rounded-bl-sm shadow-md border border-[#003DA5]/10"
                }`}
              >
                {msg.content}
              </div>

              {/* Avatar user */}
              {msg.role === "user" && (
                <div className="w-8 h-8 bg-[#C9A84C] rounded-full flex items-center justify-center ml-2 flex-shrink-0 mt-1">
                  <span className="text-xs font-black text-[#003DA5]">Y</span>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-[#003DA5]/10 px-4 py-4">
        <div className="max-w-4xl mx-auto flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Pose ta question sur la Coupe du Monde 2026..."
            rows={1}
            className="flex-1 bg-[#F5F0E8] text-[#003DA5] placeholder-[#003DA5]/40 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#003DA5] font-medium"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="bg-[#003DA5] hover:bg-[#0052CC] disabled:bg-gray-200 text-white px-6 py-3 rounded-xl transition flex items-center gap-2 font-black"
          >
            <Send size={16} />
          </motion.button>
        </div>
        <p className="text-[#003DA5]/30 text-xs text-center mt-2">
          Entrée pour envoyer · Shift+Entrée pour nouvelle ligne
        </p>
      </div>

    </div>
  );
}