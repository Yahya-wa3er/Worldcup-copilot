import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Users, Plane, MessageCircle, Menu } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WorldCup Copilot 2026",
  description: "AI assistant for FIFA World Cup 2026",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#F5F0E8]`}>

        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#003DA5] shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/trophyyy.png"
                alt="FIFA Trophy"
                width={40}
                height={40}
                className="object-contain"
              />
              <div>
                <div className="text-white font-black text-lg leading-none tracking-wide">
                  WORLDCUP COPILOT
                </div>
                <div className="text-[#C9A84C] text-xs font-semibold tracking-widest">
                  FIFA 2026
                </div>
              </div>
            </Link>

            {/* Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/matches" className="flex items-center gap-2 text-white/80 hover:text-[#C9A84C] transition text-sm font-medium">
                <Calendar size={16} />
                MATCHS
              </Link>
              <Link href="/teams" className="flex items-center gap-2 text-white/80 hover:text-[#C9A84C] transition text-sm font-medium">
                <Users size={16} />
                ÉQUIPES
              </Link>
              <Link href="/travel" className="flex items-center gap-2 text-white/80 hover:text-[#C9A84C] transition text-sm font-medium">
                <Plane size={16} />
                VOYAGE
              </Link>
              <Link href="/chat">
                <div className="flex items-center gap-2 bg-[#C9A84C] hover:bg-[#B8860B] text-[#003DA5] px-5 py-2 rounded-full text-sm font-black transition">
                  <MessageCircle size={16} />
                  COPILOT IA
                </div>
              </Link>
            </div>

            {/* Flags */}
            <div className="hidden lg:flex items-center gap-2 text-lg">
              🇺🇸 🇨🇦 🇲🇽
            </div>

          </div>

          {/* Ribbon décoratif */}
          <div className="h-1 w-full flex">
            <div className="flex-1 bg-[#003DA5]" />
            <div className="flex-1 bg-[#007A4D]" />
            <div className="flex-1 bg-[#C8102E]" />
          </div>
        </nav>

        <div className="pt-[68px]">
          {children}
        </div>

      </body>
    </html>
  );
}