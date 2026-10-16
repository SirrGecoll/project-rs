"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

interface Poli {
  id: number;
  nama_poli: string;
  kuota_harian: number;
}

interface Antrian {
  id: number;
  nomor_antrian: string;
  angka_urutan: number;
  status: string;
  tanggal_berobat: string;
  poli: {
    nama_poli: string;
  };
}

export default function DashboardPasienPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [poliList, setPoliList] = useState<Poli[]>([]);
  const [antrianSaya, setAntrianSaya] = useState<Antrian | null>(null);

  const [selectedPoli, setSelectedPoli] = useState("");
  const todayStr = new Date().toISOString().split("T")[0];
  const [tanggal, setTanggal] = useState(todayStr);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      router.push("/login");
      return;
    }
    const parsedUser = JSON.parse(savedUser);
    setUser(parsedUser);

    fetchPoli();
    fetchAntrianHariIni(parsedUser.id, todayStr);
  }, []);

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

  const fetchAntrianHariIni = async (pasienId: number, targetTanggal: string) => {
    try {
      const res = await fetch(`/api/antrian/pasien?pasien_id=${pasienId}&tanggal=${targetTanggal}`);
      if (!res.ok) {
        setAntrianSaya(null);
        return;
      }
      const data = await res.json();
      setAntrianSaya(data.data || null);
    } catch (err) {
      console.error("Gagal mengambil antrian pasien", err);
      setAntrianSaya(null);
    }
  };

  const handleAmbilAntrian = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedPoli || !tanggal) {
      setError("Silakan pilih poli dan tanggal berobat.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/antrian", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pasien_id: user.id,
          poli_id: Number(selectedPoli), // Diubah menjadi tipe angka (Number)
          tanggal_berobat: tanggal,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Gagal mengambil antrian.");
        setLoading(false);
        return;
      }

      setSuccess("Berhasil mengambil nomor antrian!");
      setAntrianSaya(data.data);
      setLoading(false);
    } catch (err) {
      setError("Terjadi kesalahan jaringan.");
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans text-slate-800">
      <Navbar isLoggedIn={true} userRole={user.role} userName={user.nama} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex-grow">
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 mb-1">
              <Link href="/" className="hover:underline">Beranda</Link>
              <span>/</span>
              <span className="text-slate-400">Dashboard Pasien</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              Layanan Antrian Pasien
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Selamat datang kembali, <strong className="text-slate-800">{user.nama}</strong>. Pilih poliklinik untuk pendaftaran berobat.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold px-4 py-2.5 rounded-xl border border-slate-200 transition"
          >
            ← Kembali ke Beranda
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-md">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center text-xl font-bold">
                📋
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Ambil Tiket Antrian Baru
                </h2>
                <p className="text-xs text-slate-500">
                  Isi formulir tujuan pemeriksaan Anda
                </p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3.5 rounded-xl mb-5 text-sm flex items-center gap-2 font-medium">
                <span>⚠️</span> {error}
              </div>
            )}

            {success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3.5 rounded-xl mb-5 text-sm flex items-center gap-2 font-medium">
                <span>✅</span> {success}
              </div>
            )}

            <form onSubmit={handleAmbilAntrian} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Pilih Poliklinik Tujuan
                </label>
                <select
                  className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-slate-900 text-sm font-medium bg-white"
                  value={selectedPoli}
                  onChange={(e) => setSelectedPoli(e.target.value)}
                  required
                >
                  <option value="">-- Pilih Poliklinik --</option>
                  {poliList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nama_poli} (Kuota Harian: {p.kuota_harian})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Tanggal Berobat
                </label>
                <input
                  type="date"
                  className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-slate-900 text-sm font-medium bg-white"
                  value={tanggal}
                  onChange={(e) => {
                    setTanggal(e.target.value);
                    if (user) fetchAntrianHariIni(user.id, e.target.value);
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white py-3.5 rounded-xl transition font-bold shadow-md hover:shadow-lg disabled:bg-emerald-300 disabled:cursor-not-allowed mt-2"
              >
                {loading ? "Memproses Tiket..." : "Ambil Nomor Antrian"}
              </button>
            </form>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 bg-teal-100 text-teal-700 rounded-xl flex items-center justify-center text-xl font-bold">
                  🎫
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Tiket Antrian Aktif Anda
                  </h2>
                  <p className="text-xs text-slate-500">
                    Informasi nomor pendaftaran untuk pemeriksaan
                  </p>
                </div>
              </div>

              {antrianSaya ? (
                <div className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white p-6 rounded-2xl shadow-lg space-y-4 text-center relative overflow-hidden">
                  <div className="uppercase tracking-widest text-xs font-bold text-emerald-100">
                    {antrianSaya.poli?.nama_poli || "POLIKLINIK"}
                  </div>

                  <div className="text-5xl font-black tracking-tight my-2">
                    {antrianSaya.nomor_antrian}
                  </div>

                  <div className="inline-block bg-white/20 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full font-semibold border border-white/30">
                    Urutan Ke: #{antrianSaya.angka_urutan}
                  </div>

                  <div className="pt-4 border-t border-white/20 flex justify-between text-xs text-emerald-100">
                    <span>
                      Tanggal: {new Date(antrianSaya.tanggal_berobat).toLocaleDateString("id-ID")}
                    </span>
                    <span className="capitalize font-bold bg-white text-emerald-800 px-2.5 py-0.5 rounded-md">
                      Status: {antrianSaya.status}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-12 px-4 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                  <span className="text-4xl block mb-2">🏥</span>
                  <p className="text-slate-600 font-semibold text-sm">
                    Belum ada antrian yang diambil untuk tanggal ini
                  </p>
                  <p className="text-slate-400 text-xs mt-1">
                    Silakan isi form di sebelah untuk membuat tiket pendaftaran baru.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <p className="font-bold text-slate-800">💡 Catatan Pasien:</p>
              <p>• Harap datang 15 menit sebelum waktu estimasi dipanggil.</p>
              <p>• Tunjukkan nomor antrian di layar smartphone Anda kepada petugas loket.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-6 text-center text-xs border-t border-slate-800 mt-12">
        <p>© {new Date().getFullYear()} Puskesmas JMKSehat. Hak Cipta Dilindungi Undang-Undang.</p>
      </footer>
    </div>
  );
}