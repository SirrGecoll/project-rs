"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function ProsedurPendaftaranPage() {
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
          <span className="text-slate-400">Prosedur Pendaftaran</span>
        </div>

        {/* Layout 2 Kolom Mobile First */}
        <article className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2 items-start">
          {/* Kolom Visual */}
          <div className="relative h-64 md:h-full min-h-[350px] w-full bg-slate-100">
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop"
              alt="Prosedur Pendaftaran Antrian Online"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Kolom Body Teks Fleksibel & Lengkap */}
          <div className="p-6 md:p-10 space-y-6">
            <div>
              <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                Panduan Layanan
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-snug">
                Prosedur Pendaftaran Antrian Online
              </h1>
            </div>

            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              Masyarakat kini tidak perlu lagi datang sejak subuh untuk
              mengambil nomor antrian fisik. Sistem Antrian Online Puskesmas
              JMKSehat memungkinkan Anda mengambil nomor antrian secara mandiri
              melalui perangkat HP maupun komputer dari mana saja.
            </p>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Tahapan Pendaftaran Mandiri:
              </h3>
              <ol className="space-y-3 text-sm text-slate-700 font-medium list-decimal list-inside">
                <li>
                  <strong className="text-slate-900">
                    Registrasi Akun Pasien:
                  </strong>{" "}
                  Siapkan NIK KTP, Alamat Email, serta Nomor WhatsApp aktif.
                </li>
                <li>
                  <strong className="text-slate-900">
                    Masuk / Login Akun:
                  </strong>{" "}
                  Gunakan email dan kata sandi yang telah terdaftar.
                </li>
                <li>
                  <strong className="text-slate-900">
                    Pilih Poliklinik & Tanggal:
                  </strong>{" "}
                  Tentukan poli tujuan (Poli Umum, Gigi, KIA, dll) dan tanggal
                  berobat.
                </li>
                <li>
                  <strong className="text-slate-900">
                    Konfirmasi Tiket Antrian:
                  </strong>{" "}
                  Nomor antrian digital otomatis terbit beserta estimasi jam
                  panggilan.
                </li>
              </ol>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-800 text-xs space-y-1">
              <p className="font-bold">💡 Imbauan Kedatangan Pasien:</p>
              <p>
                Harap hadir di Puskesmas 15 menit sebelum estimasi waktu
                panggilan dan melakukan verifikasi ke petugas loket pendaftaran
                online.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href={isLoggedIn ? "/dashboard" : "/register"}
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition shadow-md w-full md:w-auto"
              >
                {isLoggedIn
                  ? "Ambil Tiket Antrian →"
                  : "Daftar Akun Pasien Baru →"}
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
