"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Antrian {
  id: number;
  nomor_antrian: string;
  status: string;
  poli: {
    nama_poli: string;
  };
  users: {
    nama: string;
  };
}

export default function DisplayPublicPage() {
  const [antrianAktif, setAntrianAktif] = useState<Antrian[]>([]);
  const [waktu, setWaktu] = useState("");

  useEffect(() => {
    // Update jam
    const timer = setInterval(() => {
      setWaktu(new Date().toLocaleTimeString("id-ID"));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchDisplayData = async () => {
    // Ambil semua antrian yang sedang 'dipanggil' hari ini
    const res = await fetch("/api/poli");
    const dataPoli = await res.json();

    if (dataPoli.success) {
      const tgl = new Date().toISOString().split("T")[0];
      const listAntrian: Antrian[] = [];

      for (const p of dataPoli.data) {
        const resAntrian = await fetch(
          `/api/antrian/panggil?poli_id=${p.id}&tanggal=${tgl}`,
        );
        const dataAntrian = await resAntrian.json();
        if (dataAntrian.success) {
          const dipanggil = dataAntrian.data.find(
            (a: any) => a.status === "dipanggil",
          );
          if (dipanggil) {
            dipanggil.poli = p;
            listAntrian.push(dipanggil);
          }
        }
      }
      setAntrianAktif(listAntrian);
    }
  };

  useEffect(() => {
    fetchDisplayData();
    // Auto refresh setiap 3 detik biar sync sama action petugas
    const interval = setInterval(fetchDisplayData, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-6 md:p-10 font-sans">
      {/* Header Display + Navigasi Beranda */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-4">
          {/* Tombol Navigasi Kembali ke Beranda Utama */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 active:bg-slate-700 text-slate-200 text-xs md:text-sm font-bold px-4 py-2.5 rounded-xl border border-slate-800 transition shadow-sm"
          >
            ← Kembali ke Beranda
          </Link>

          <div>
            <div className="flex items-center gap-3">
              <div className="bg-emerald-600 text-white px-2.5 py-1 rounded-lg font-black text-lg tracking-wider">
                JMK
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Puskesmas JMKSehat
              </h1>
            </div>
            <p className="text-slate-400 text-xs md:text-sm mt-1 font-medium">
              Sistem Antrian Pelayanan Kesehatan Real-time
            </p>
          </div>
        </div>

        {/* Jam Digital Header */}
        <div className="text-left md:text-right">
          <div className="text-2xl md:text-3xl font-bold font-mono text-emerald-400 tracking-wider">
            {waktu || "00:00:00"}
          </div>
          <p className="text-xs text-slate-400">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Main Grid Antrian per Poli */}
      <div className="my-auto py-8">
        <h2 className="text-center text-xs md:text-sm font-bold text-emerald-500 uppercase tracking-widest mb-8 bg-emerald-950/60 border border-emerald-800/50 py-2.5 px-6 rounded-full max-w-md mx-auto">
          📢 Panggilan Antrian Aktif
        </h2>

        {antrianAktif.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {antrianAktif.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 border-2 border-emerald-500/80 rounded-3xl p-8 text-center shadow-2xl shadow-emerald-950/50 animate-pulse flex flex-col justify-between items-center"
              >
                <span className="bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-xs px-4 py-1.5 rounded-full font-extrabold uppercase tracking-wider">
                  {item.poli.nama_poli}
                </span>
                <div className="text-6xl md:text-7xl font-black text-amber-400 my-6 tracking-tight font-mono">
                  {item.nomor_antrian}
                </div>
                <div className="text-lg md:text-xl font-bold text-white truncate max-w-full">
                  {item.users?.nama || "-"}
                </div>
                <p className="text-xs text-emerald-400 mt-2 font-semibold">
                  Silakan Menuju Loket / Ruang Periksa
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 md:p-16 text-center max-w-xl mx-auto space-y-3">
            <span className="text-5xl block">⏳</span>
            <p className="text-xl md:text-2xl font-bold text-slate-300">
              Belum Ada Antrian Yang Dipanggil
            </p>
            <p className="text-sm text-slate-400">
              Nomor antrian akan otomatis muncul di layar ini saat petugas
              memanggil pasien.
            </p>
          </div>
        )}
      </div>

      {/* Footer Running Text */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center text-xs md:text-sm text-slate-300 font-medium">
        📢 Harap memperhatikan nomor antrian dan nama yang dipanggil pada layar
        monitor. Utamakan ketertiban & kenyamanan bersama.
      </div>
    </div>
  );
}
