"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

interface Poli {
  id: number;
  nama_poli: string;
}

interface Antrian {
  id: number;
  nomor_antrian: string;
  angka_urutan: number;
  status: string;
  users?: {
    nama: string;
    nik: string;
  };
}

export default function DashboardPetugasPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [poliList, setPoliList] = useState<Poli[]>([]);
  const [selectedPoli, setSelectedPoli] = useState<string>("");
  const [tanggal, setTanggal] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [antrianList, setAntrianList] = useState<Antrian[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      router.push("/login");
      return;
    }
    const parsedUser = JSON.parse(savedUser);
    if (parsedUser.role !== "petugas" && parsedUser.role !== "admin") {
      router.push("/dashboard");
      return;
    }
    setUser(parsedUser);
    fetchPoli();
  }, []);

  useEffect(() => {
    if (selectedPoli && tanggal) {
      fetchAntrian();
    }
  }, [selectedPoli, tanggal]);

  const fetchPoli = async () => {
    try {
      const res = await fetch("/api/poli");
      if (!res.ok) return;
      const data = await res.json();
      setPoliList(data.data || []);
    } catch (err) {
      console.error("Gagal mengambil data poli", err);
    }
  };

  const fetchAntrian = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/antrian/petugas?poli_id=${selectedPoli}&tanggal=${tanggal}`,
      );
      if (!res.ok) {
        setAntrianList([]);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setAntrianList(data.data || []);
    } catch (err) {
      console.error("Gagal mengambil daftar antrian", err);
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (antrianId: number, newStatus: string) => {
    try {
      const res = await fetch("/api/antrian/petugas", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ antrian_id: antrianId, status: newStatus }),
      });
      if (res.ok) {
        fetchAntrian();
      }
    } catch (err) {
      console.error("Gagal memperbarui status antrian", err);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans text-slate-800">
      {/* 1. Navbar Navigasi Utama */}
      <Navbar isLoggedIn={true} userRole={user.role} userName={user.nama} />

      {/* 2. Main Content Dashboard Petugas */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex-grow">
        {/* Banner Welcome & Controls */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 mb-1">
              <Link href="/" className="hover:underline">
                Beranda
              </Link>
              <span>/</span>
              <span className="text-slate-400">Dashboard Petugas</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              Loket Pemanggil Antrian
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Kelola antrian dan panggil pasien sesuai poliklinik tempat Anda
              bertugas.
            </p>
          </div>

          {/* Filter Loket Poli & Tanggal */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Loket Poliklinik
              </label>
              <select
                className="w-full sm:w-auto border border-slate-300 p-2.5 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-semibold bg-white text-slate-800"
                value={selectedPoli}
                onChange={(e) => setSelectedPoli(e.target.value)}
              >
                <option value="">-- Pilih Loket Poli --</option>
                {poliList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nama_poli}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Tanggal Operasional
              </label>
              <input
                type="date"
                className="w-full sm:w-auto border border-slate-300 p-2.5 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-semibold bg-white text-slate-800"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Panel Pemanggilan & List Antrian */}
        {!selectedPoli ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <span className="text-5xl block">📢</span>
            <h3 className="text-lg font-bold text-slate-800">
              Pilih Loket Poliklinik Terlebih Dahulu
            </h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Silakan tentukan Loket Poli pada filter bagian atas untuk mulai
              memanggil dan mengelola antrian pasien.
            </p>
          </div>
        ) : (
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>📋</span> Daftar Antrian Pasien
              </h2>
              <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                Total: {antrianList.length} Pasien
              </span>
            </div>

            {loading ? (
              <div className="text-center py-12 text-slate-500 text-sm font-medium">
                Memuat daftar antrian...
              </div>
            ) : antrianList.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <p className="text-slate-500 font-semibold text-sm">
                  Tidak ada antrian pasien pada tanggal ini.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
                      <th className="p-3.5">No. Antrian</th>
                      <th className="p-3.5">Nama Pasien</th>
                      <th className="p-3.5">NIK</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-center">Aksi Panggilan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {antrianList.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50 transition"
                      >
                        <td className="p-3.5 font-extrabold text-emerald-700 text-lg">
                          {item.nomor_antrian}
                        </td>
                        <td className="p-3.5 font-bold text-slate-900">
                          {item.users?.nama || "-"}
                        </td>
                        <td className="p-3.5 text-slate-500 font-mono text-xs">
                          {item.users?.nik || "-"}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full font-bold capitalize ${
                              item.status === "dipanggil"
                                ? "bg-amber-100 text-amber-800 border border-amber-300"
                                : item.status === "selesai"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : item.status === "dibatalkan"
                                    ? "bg-rose-100 text-rose-800 border border-rose-200"
                                    : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() =>
                                handleUpdateStatus(item.id, "dipanggil")
                              }
                              className="bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition shadow-sm"
                            >
                              🔊 Panggil
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateStatus(item.id, "selesai")
                              }
                              className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition shadow-sm"
                            >
                              ✅ Selesai
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateStatus(item.id, "dibatalkan")
                              }
                              className="bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition shadow-sm"
                            >
                              ❌ Batalkan
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 text-center text-xs border-t border-slate-800 mt-12">
        <p>
          © {new Date().getFullYear()} Puskesmas JMKSehat. Hak Cipta Dilindungi
          Undang-Undang.
        </p>
      </footer>
    </div>
  );
}
