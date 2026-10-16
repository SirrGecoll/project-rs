"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function InformasiPage() {
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

  const infoList = [
    {
      slug: "prosedur-pendaftaran",
      title: "Prosedur Pendaftaran Antrian Online",
      desc: "Masyarakat kini dapat mendaftar antrian poliklinik secara mandiri dari rumah tanpa perlu datang lebih awal. Cukup buat akun pasien, pilih poli tujuan, dan tanggal kunjungan.",
      badge: "Panduan Layanan",
      ctaText: "Lihat Panduan Pendaftaran →",
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop",
    },
    {
      slug: "fasilitas-layanan",
      title: "Fasilitas & Layanan Poliklinik Terpadu",
      desc: "Puskesmas JMKSehat menghadirkan pelayanan kesehatan komprehensif mulai dari Poli Umum, Poli Gigi, Poli KIA & KB, hingga tes Laboratorium modern.",
      badge: "Fasilitas Kesehatan",
      ctaText: "Pelajari Fasilitas & Poli →",
      image:
        "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=800&auto=format&fit=crop",
    },
    {
      slug: "jam-operasional",
      title: "Ketentuan Waktu & Jam Operasional",
      desc: "Loket pendaftaran online dibuka setiap hari Senin hingga Jumat. Untuk pelayanan IGD tetap beroperasi 24 jam nonstop untuk menangani situasi darurat medis masyarakat.",
      badge: "Operasional",
      ctaText: "Cek Jadwal Operasional Lengkap →",
      image:
        "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between font-sans">
      <Navbar isLoggedIn={isLoggedIn} userRole={userRole} userName={userName} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full flex-grow">
        <div className="mb-10 text-center max-w-3xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
            <Link href="/" className="hover:underline">
              Beranda
            </Link>
            <span>/</span>
            <span className="text-slate-400">Pusat Informasi</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Informasi & Panduan Pelayanan
          </h1>
          <p className="text-slate-600 text-sm md:text-base">
            Temukan panduan lengkap pendaftaran, informasi fasilitas kesehatan,
            dan ketentuan operasional Puskesmas JMKSehat.
          </p>
        </div>

        <div className="space-y-12">
          {infoList.map((item, index) => (
            <section
              key={index}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden grid grid-cols-1 md:grid-cols-2 items-center"
            >
              <div
                className={`relative h-64 md:h-full min-h-[260px] w-full overflow-hidden ${
                  index % 2 === 1 ? "md:order-last" : ""
                }`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
              </div>

              <div className="p-6 md:p-10 space-y-4">
                <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {item.badge}
                </span>
                <h2 className="text-2xl font-bold text-slate-900 leading-snug">
                  {item.title}
                </h2>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                  {item.desc}
                </p>
                <div className="pt-2">
                  <Link
                    href={`/informasi/${item.slug}`}
                    className="inline-flex items-center gap-2 text-emerald-600 font-bold text-sm hover:text-emerald-700 transition"
                  >
                    {item.ctaText}
                  </Link>
                </div>
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm px-6 py-3 rounded-xl border border-slate-200 transition shadow-sm"
          >
            ← Kembali ke Beranda Utama
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
