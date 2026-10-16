"use client";

import Link from "next/link";

interface HeroProps {
  isLoggedIn: boolean;
}

export default function Hero({ isLoggedIn }: HeroProps) {
  return (
    <section
      id="beranda"
      className="bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900 text-white py-20 px-6 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-6">
          <span className="bg-emerald-500/30 text-emerald-100 text-xs font-bold px-3.5 py-1.5 rounded-full border border-emerald-400/30 uppercase tracking-wider">
            Layanan Kesehatan Terpadu
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
            Lindungi Kesehatan Keluarga Anda Bersama JMKSehat
          </h2>
          <p className="text-emerald-100 text-base md:text-lg leading-relaxed">
            Dapatkan kemudahan akses pendaftaran antrian berobat secara online
            tanpa perlu mengantre lama di Puskesmas. Cepat, transparan, dan
            terintegrasi.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href={isLoggedIn ? "/dashboard" : "/login"}
              className="bg-white text-emerald-800 hover:bg-emerald-50 text-sm font-bold px-6 py-3.5 rounded-lg shadow-lg transition"
            >
              Ambil Antrian Online
            </Link>
            <Link
              href="/display"
              className="bg-emerald-800/60 hover:bg-emerald-800 text-white text-sm font-bold px-6 py-3.5 rounded-lg border border-emerald-400/40 transition"
            >
              Lihat Monitor Antrian
            </Link>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-2xl text-center space-y-4">
          <div className="text-5xl font-black text-white">100% Online</div>
          <h3 className="text-xl font-bold text-emerald-100">
            Sistem Antrian Digital Efisien
          </h3>
          <p className="text-sm text-emerald-200">
            Pantau panggilan nomor antrian Anda langsung melalui smartphone atau
            monitor ruang tunggu puskesmas.
          </p>
        </div>
      </div>
    </section>
  );
}
