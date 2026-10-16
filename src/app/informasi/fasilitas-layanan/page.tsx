"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function FasilitasLayananPage() {
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
        {/* Breadcrumb Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">
            <Link href="/" className="hover:underline">
              Beranda
            </Link>
            <span>/</span>
            <Link href="/informasi" className="hover:underline">
              Pusat Informasi
            </Link>
            <span>/</span>
            <span className="text-slate-400">Fasilitas & Layanan</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Fasilitas & Layanan Kesehatan Terpadu
          </h1>
          <p className="text-slate-600 text-sm md:text-base mt-2 max-w-3xl">
            Jelajahi seluruh sarana medis, unit poliklinik, dan fasilitas
            penunjang modern yang tersedia di Puskesmas JMKSehat.
          </p>
        </div>

        {/* LAYOUT GRID 1 ½ (1 Banner Utama Besar + Banner Kecil Samping) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* 1. Banner Fasilitas Utama (Mengambil 2 Kolom di Desktop) */}
          <div className="lg:col-span-2 bg-gradient-to-br from-emerald-900 to-slate-900 rounded-3xl overflow-hidden shadow-lg border border-slate-800 relative flex flex-col justify-between p-6 md:p-10 min-h-[420px] text-white">
            <div className="absolute inset-0 opacity-40 mix-blend-overlay">
              <img
                src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=1200&auto=format&fit=crop"
                alt="Fasilitas Utama Puskesmas"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative z-10 space-y-3">
              <span className="inline-block bg-emerald-500/90 text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                Fasilitas Utama
              </span>
              <h2 className="text-2xl md:text-4xl font-extrabold leading-tight">
                Gedung Pelayanan Utama & Instalasi Gawat Darurat (IGD) 24 Jam
              </h2>
              <p className="text-slate-200 text-sm md:text-base max-w-2xl leading-relaxed">
                Dilengkapi dengan sistem tata udara bertekanan standar medis,
                ruang tunggu ber-AC yang nyaman, serta aksesibilitas ramah
                penyandang disabilitas dan lansia.
              </p>
            </div>

            <div className="relative z-10 pt-6 flex flex-wrap gap-4 items-center">
              <Link
                href="/#kontak"
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition shadow-md"
              >
                Layanan Darurat IGD →
              </Link>
              <span className="text-xs text-slate-300 font-medium">
                ⚡ Siap Siaga 24 Jam Nonstop
              </span>
            </div>
          </div>

          {/* 2. Banner Kecil Samping (1 Kolom bertumpuk) */}
          <div className="space-y-6 flex flex-col justify-between">
            {/* Banner Kecil 1: Apotek & Depo Obat */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex gap-4 items-center">
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format&fit=crop"
                  alt="Apotek"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">
                  Farmasi
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-1">
                  Apotek Terpadu
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                  Penyediaan obat-obatan esensial dan racikan resep dokter
                  terverifikasi BPOM.
                </p>
              </div>
            </div>

            {/* Banner Kecil 2: Laboratorium Digital */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex gap-4 items-center">
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=400&auto=format&fit=crop"
                  alt="Laboratorium"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">
                  Laboratorium
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-1">
                  Lab Pemeriksaan Darah
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                  Tes darah lengkap, kadar gula, kolesterol, dan asam urat
                  dengan hasil cepat.
                </p>
              </div>
            </div>

            {/* Banner Kecil 3: Ambulans Siaga */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex gap-4 items-center">
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1587745416684-47953f16f02f?q=80&w=400&auto=format&fit=crop"
                  alt="Ambulans"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">
                  Transportasi
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-1">
                  Ambulans Medis Siaga
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                  Armada penanganan darurat dan rujukan antar fasilitas
                  kesehatan.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION KATALOG LENGKAP UNIT POLIKLINIK */}
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-bold text-slate-900">
              Daftar Layanan Poliklinik Rawat Jalan
            </h2>
            <p className="text-slate-500 text-sm">
              Seluruh unit poli siap melayani pasien umum maupun peserta BPJS
              Kesehatan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card Poli 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center text-2xl font-black">
                🩺
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Poliklinik Umum
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Pemeriksaan kesehatan menyeluruh, diagnosis penyakit
                kronis/akut, konsultasi gaya hidup sehat, serta pembuatan surat
                keterangan sehat.
              </p>
              <ul className="text-xs text-slate-500 space-y-1 pt-2 font-medium">
                <li>• Konsultasi Dokter Umum</li>
                <li>• Pemeriksaan Tekanan Darah & Fisik</li>
                <li>• Penerbitan Rujukan BPJS</li>
              </ul>
            </div>

            {/* Card Poli 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center text-2xl font-black">
                🦷
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Poliklinik Gigi & Mulut
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Pelayanan kesehatan gigi dan mulut komprehensif didukung oleh
                peralatan perawatan gigi higienis dan steril.
              </p>
              <ul className="text-xs text-slate-500 space-y-1 pt-2 font-medium">
                <li>• Penambalan & Pencabutan Gigi</li>
                <li>• Cleaning / Scaling Karang Gigi</li>
                <li>• Konsultasi Kesehatan Gusi</li>
              </ul>
            </div>

            {/* Card Poli 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center text-2xl font-black">
                👶
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Poli KIA, KB & Imunisasi
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Fasilitas khusus kesehatan ibu hamil, tumbuh kembang anak,
                pelayanan kontrasepsi KB, serta imunisasi rutin bayi.
              </p>
              <ul className="text-xs text-slate-500 space-y-1 pt-2 font-medium">
                <li>• Pemeriksaan Kehamilan (ANC)</li>
                <li>• Imunisasi Bayi & Balita</li>
                <li>• Konseling KB & Alat Kontrasepsi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Navigasi Kembali */}
        <div className="mt-12 text-center">
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
