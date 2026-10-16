"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function JamOperasionalPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setIsLoggedIn(true);
      setUserRole(user.role);
      setUserName(user.nama);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between font-sans">
      <Navbar isLoggedIn={isLoggedIn} userRole={userRole} userName={userName} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full flex-grow">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-6">
          <Link href="/" className="hover:underline">
            Beranda
          </Link>
          <span>/</span>
          <Link href="/informasi" className="hover:underline">
            Pusat Informasi
          </Link>
          <span>/</span>
          <span className="text-slate-400">Jam Operasional</span>
        </div>

        {/* Layout 2 Kolom Mobile First */}
        <article className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2 items-start">
          {/* Kolom Visual */}
          <div className="relative h-64 md:h-full min-h-[350px] w-full bg-slate-100">
            <img
              src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop"
              alt="Ketentuan Waktu dan Jam Operasional"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Kolom Body Teks */}
          <div className="p-6 md:p-10 space-y-6">
            <div>
              <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                Operasional
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-snug">
                Ketentuan Waktu & Jam Operasional
              </h1>
            </div>

            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              Puskesmas JMKSehat memberlakukan ketentuan jam operasional
              poliklinik rawat jalan secara teratur demi memastikan efisiensi
              pelayanan serta kenyamanan seluruh pasien.
            </p>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Jadwal Loket & Layanan Poliklinik:
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center py-1 border-b border-slate-200">
                  <span className="font-semibold text-slate-800">
                    Senin - Kamis
                  </span>
                  <span className="font-bold text-emerald-700">
                    07.30 - 14.30 WIB
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200">
                  <span className="font-semibold text-slate-800">Jumat</span>
                  <span className="font-bold text-emerald-700">
                    07.30 - 11.30 WIB
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200">
                  <span className="font-semibold text-slate-800">
                    Sabtu & Minggu
                  </span>
                  <span className="font-bold text-slate-400">
                    Tutup (Kecuali IGD)
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="font-semibold text-slate-800">
                    Layanan IGD & Ambulans
                  </span>
                  <span className="font-bold text-rose-600">
                    24 Jam Nonstop
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/#kontak"
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition shadow-md w-full md:w-auto"
              >
                Hubungi Kontak Layanan & Darurat →
              </Link>
            </div>
          </div>
        </article>

        <div className="mt-10 text-center">
          <Link
            href="/informasi"
            className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm px-6 py-3 rounded-xl border border-slate-200 transition shadow-sm"
          >
            ← Kembali ke Pusat Informasi
          </Link>
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-xs border-t border-slate-800">
        <p>
          © {new Date().getFullYear()} Puskesmas JMKSehat. Hak Cipta Dilindungi
          Undang-Undang.
        </p>
      </footer>
    </div>
  );
}
