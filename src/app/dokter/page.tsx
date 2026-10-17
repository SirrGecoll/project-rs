"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

interface Antrian {
  id: number;
  nomor_antrian: string;
  angka_urutan: number;
  status: string;
  tanggal_berobat: string;
  waktu_dipanggil?: string | null;
  users?: {
    id: number;
    nama: string;
    nik: string;
    no_hp: string;
  };
  resep_obat?: any[];
}

export default function DashboardDokterPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [dokterProfile, setDokterProfile] = useState<any>(null);
  const [tanggal, setTanggal] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [antrianList, setAntrianList] = useState<Antrian[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // State Modal Pemeriksaan & Resep
  const [selectedPasien, setSelectedPasien] = useState<Antrian | null>(null);
  const [diagnosa, setDiagnosa] = useState("");
  const [catatan, setCatatan] = useState("");
  const [resep, setResep] = useState("");
  const [showModal, setShowModal] = useState(false);

  // State untuk Timer 3 Menit yang Akurat
  const [activeDipanggil, setActiveDipanggil] = useState<Antrian | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(180); // 180 detik = 3 menit
  const [targetTime, setTargetTime] = useState<number | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      router.push("/login");
      return;
    }
    const parsedUser = JSON.parse(savedUser);
    if (parsedUser.role !== "dokter" && parsedUser.role !== "admin") {
      router.push("/dashboard");
      return;
    }
    setUser(parsedUser);
    fetchDokterProfile(parsedUser.id);
  }, []);

  useEffect(() => {
    if (dokterProfile?.poli_id && tanggal) {
      fetchAntrianDokter(dokterProfile.poli_id, tanggal);
    }
  }, [dokterProfile, tanggal]);

  // Sinkronisasi target waktu timer berdasarkan waktu_dipanggil dari database
  useEffect(() => {
    const pasienDipanggil = antrianList.find((item) => item.status === "dipanggil");
    if (pasienDipanggil) {
      setActiveDipanggil(pasienDipanggil);
      
      if (pasienDipanggil.waktu_dipanggil) {
        const waktuPanggilMs = new Date(pasienDipanggil.waktu_dipanggil).getTime();
        const targetMs = waktuPanggilMs + 180 * 1000; // 3 menit dari waktu dipanggil
        setTargetTime(targetMs);

        const sisaDetik = Math.floor((targetMs - new Date().getTime()) / 1000);
        setTimeLeft(sisaDetik > 0 ? sisaDetik : 0);
      } else {
        const targetMs = new Date().getTime() + 180 * 1000;
        setTargetTime(targetMs);
        setTimeLeft(30);
      }
    } else {
      setActiveDipanggil(null);
      setTargetTime(null);
    }
  }, [antrianList]);

  // Interval Countdown Timer Real-time yang Akurat
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeDipanggil && targetTime) {
      interval = setInterval(() => {
        const sisa = Math.floor((targetTime - new Date().getTime()) / 1000);
        if (sisa <= 0) {
          setTimeLeft(0);
          clearInterval(interval);
          handleAutoTerlewat(activeDipanggil.id);
        } else {
          setTimeLeft(sisa);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeDipanggil, targetTime]);

  const handleAutoTerlewat = async (antrianId: number) => {
    try {
      await fetch("/api/antrian/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ antrian_id: antrianId, status: "terlewat" }),
      });
      fetchAntrianDokter(dokterProfile.poli_id, tanggal);
    } catch (err) {
      console.error("Gagal mengubah otomatis ke terlewat", err);
    }
  };

  const fetchDokterProfile = async (userId: number) => {
    try {
      const res = await fetch(`/api/dokter/profile?user_id=${userId}`);
      const data = await res.json();
      if (data.success) {
        setDokterProfile(data.data);
      } else {
        setErrorMsg(data.message);
      }
    } catch (err) {
      console.error("Gagal memuat profil dokter", err);
      setErrorMsg("Terjadi kesalahan saat memuat profil dokter.");
    }
  };

  const fetchAntrianDokter = async (poliId: number, tgl: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dokter/antrian?poli_id=${poliId}&tanggal=${tgl}`);
      const data = await res.json();
      if (data.success) {
        setAntrianList(data.data || []);
      }
    } catch (err) {
      console.error("Gagal mengambil antrian dokter", err);
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (antrianId: number, statusBaru: string) => {
    try {
      const res = await fetch("/api/antrian/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ antrian_id: antrianId, status: statusBaru }),
      });

      if (res.ok) {
        fetchAntrianDokter(dokterProfile.poli_id, tanggal);
      } else {
        alert("Gagal memperbarui status antrean.");
      }
    } catch (err) {
      console.error("Error update status:", err);
    }
  };

  const handleOpenModal = (pasien: Antrian) => {
    setSelectedPasien(pasien);
    setDiagnosa("");
    setCatatan("");
    setResep("");
    setShowModal(true);
  };

  const handleSelesaiKonsultasi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPasien) return;

    try {
      const res = await fetch("/api/dokter/antrian", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          antrian_id: selectedPasien.id,
          status: "selesai",
          dokter_id: dokterProfile.id,
          diagnosa,
          catatan,
          resep,
        }),
      });

      if (res.ok) {
        setShowModal(false);
        fetchAntrianDokter(dokterProfile.poli_id, tanggal);
      }
    } catch (err) {
      console.error("Gagal menyimpan resep", err);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleCetakResep = (item: Antrian) => {
    const resepData = item.resep_obat?.[0] || {
      diagnosa: "Pemeriksaan Poliklinik",
      resep: "- Sesuai Anjuran Dokter",
      catatan: "Jaga kesehatan dan istirahat cukup.",
    };

    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Resep Obat - ${item.users?.nama}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; color: #333; }
            .header { text-align: center; border-bottom: 3px double #333; padding-bottom: 12px; margin-bottom: 20px; }
            .header h2 { margin: 0; font-size: 20px; font-weight: bold; }
            .header p { margin: 3px 0; font-size: 12px; color: #555; }
            .info-table { width: 100%; margin-bottom: 20px; font-size: 14px; border-collapse: collapse; }
            .info-table td { padding: 5px 0; }
            .rx-symbol { font-size: 28px; font-weight: bold; font-family: serif; margin: 15px 0 5px 0; }
            .content { border: 1px solid #ddd; padding: 15px; border-radius: 6px; min-height: 140px; font-family: monospace; font-size: 14px; white-space: pre-line; background: #fafafa; }
            .footer { margin-top: 50px; display: flex; justify-content: flex-end; text-align: center; }
            .sign { width: 220px; font-size: 13px; }
            .sign p { margin-top: 70px; border-top: 1px solid #333; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>PUSKESMAS JMKSEHAT</h2>
            <p>Jl. Kesehatan Raya No. 10, Telepon: (021) 555-8989</p>
          </div>
          <table class="info-table">
            <tr>
              <td><strong>Nama Pasien:</strong> ${item.users?.nama}</td>
              <td><strong>Tanggal:</strong> ${new Date(item.tanggal_berobat).toLocaleDateString("id-ID")}</td>
            </tr>
            <tr>
              <td><strong>NIK:</strong> ${item.users?.nik}</td>
              <td><strong>No. Antrian:</strong> ${item.nomor_antrian}</td>
            </tr>
            <tr>
              <td><strong>Diagnosa:</strong> ${resepData.diagnosa}</td>
              <td><strong>Dokter Pemeriksa:</strong> ${dokterProfile?.nama_dokter || "Dokter Jaga"}</td>
            </tr>
          </table>
          <div class="rx-symbol">R/</div>
          <div class="content">${resepData.resep}</div>
          ${resepData.catatan ? `<p style="font-size: 13px; margin-top: 15px;"><strong>Catatan Dokter:</strong> ${resepData.catatan}</p>` : ""}
          <div class="footer">
            <div class="sign">
              <span>Dokter Penanggung Jawab</span>
              <p>${dokterProfile?.nama_dokter || "Dr. Pemeriksa"}</p>
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans text-slate-800">
      <Navbar isLoggedIn={true} userRole={user.role} userName={user.nama} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex-grow">
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 mb-1">
              <Link href="/">Beranda</Link><span>/</span><span className="text-slate-400">Dashboard Dokter</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              Ruang Praktik Dokter {dokterProfile?.poli?.nama_poli ? `(${dokterProfile.poli.nama_poli})` : ""}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Selamat bertugas, <strong className="text-slate-800">{user.nama}</strong>. Kelola pemeriksaan pasien dan cetak resep obat.
            </p>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Tanggal Praktik
            </label>
            <input
              type="date"
              className="border border-slate-300 p-2.5 rounded-xl text-sm font-semibold bg-white"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
            />
          </div>
        </div>

        {activeDipanggil && (
          <div className="bg-amber-50 border border-amber-300 p-5 rounded-2xl mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
            <div>
              <span className="bg-amber-200 text-amber-900 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md">
                Sedang Dipanggil
              </span>
              <h3 className="text-lg font-extrabold text-amber-950 mt-1">
                {activeDipanggil.nomor_antrian} - {activeDipanggil.users?.nama}
              </h3>
              <p className="text-xs text-amber-800">Harap tunggu pasien memasuki ruang pemeriksaan.</p>
            </div>
            <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-xl border border-amber-200 shadow-inner">
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Batas Waktu</p>
                <p className="text-2xl font-black text-amber-600 font-mono">{formatTime(timeLeft)}</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => handleUpdateStatus(activeDipanggil.id, "proses")}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition shadow"
                >
                  🚪 Pasien Masuk (Mulai Periksa)
                </button>
                <button
                  onClick={() => handleUpdateStatus(activeDipanggil.id, "terlewat")}
                  className="bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-bold px-3 py-1 rounded-lg transition"
                >
                  ⏱️ Tandai Terlewat
                </button>
              </div>
            </div>
          </div>
        )}

        {errorMsg ? (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-6 rounded-2xl text-center font-medium">
            ⚠️ {errorMsg} <br />
            <span className="text-xs text-amber-600 mt-1 block">Silakan hubungkan akun Anda melalui Panel Admin ke data master Dokter & Poliklinik.</span>
          </div>
        ) : (
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>🩺</span> Daftar Pasien {dokterProfile?.poli?.nama_poli || "Poli"}
              </h2>
              <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                Total Antrean: {antrianList.length}
              </span>
            </div>

            {loading ? (
              <div className="text-center py-12 text-slate-500 text-sm">Memuat data pasien...</div>
            ) : antrianList.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                <p className="text-slate-500 text-sm font-semibold">Belum ada data antrean di poli ini pada tanggal tersebut.</p>
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
                      <th className="p-3.5 text-center">Aksi Pemeriksaan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {antrianList.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="p-3.5 font-extrabold text-emerald-700 text-lg">{item.nomor_antrian}</td>
                        <td className="p-3.5 font-bold text-slate-900">{item.users?.nama}</td>
                        <td className="p-3.5 text-slate-500 font-mono text-xs">{item.users?.nik}</td>
                        <td className="p-3.5">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-bold capitalize ${
                            item.status === "dipanggil"
                              ? "bg-amber-100 text-amber-800 border border-amber-300"
                              : item.status === "proses"
                              ? "bg-blue-100 text-blue-800 border border-blue-300"
                              : item.status === "terlewat"
                              ? "bg-rose-100 text-rose-800 border border-rose-300"
                              : item.status === "selesai"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-100 text-slate-700"
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {item.status === "menunggu" && (
                              <button
                                onClick={() => handleUpdateStatus(item.id, "dipanggil")}
                                className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm transition"
                              >
                                📢 Panggil
                              </button>
                            )}

                            {item.status === "dipanggil" && (
                              <>
                                <button
                                  onClick={() => handleUpdateStatus(item.id, "proses")}
                                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-sm transition"
                                >
                                  🚪 Masuk
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(item.id, "terlewat")}
                                  className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold px-2.5 py-2 rounded-xl shadow-sm transition"
                                >
                                  ⏱️ Terlewat
                                </button>
                              </>
                            )}

                            {item.status === "proses" && (
                              <button
                                onClick={() => handleOpenModal(item)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition animate-pulse"
                              >
                                📝 Input Diagnosa & Resep
                              </button>
                            )}

                            {item.status === "selesai" && (
                              <button
                                onClick={() => handleCetakResep(item)}
                                className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm transition inline-flex items-center gap-1.5"
                              >
                                🖨️ Cetak Resep
                              </button>
                            )}

                            {item.status === "terlewat" && (
                              <button
                                onClick={() => handleUpdateStatus(item.id, "dipanggil")}
                                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-sm transition"
                              >
                                🔄 Panggil Ulang
                              </button>
                            )}
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

      {/* Modal Input Diagnosa & Resep Obat */}
      {showModal && selectedPasien && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Form Pemeriksaan & Resep Obat</h3>
            <p className="text-xs text-slate-500 mb-4">Pasien: <span className="font-bold text-slate-800">{selectedPasien.users?.nama}</span> ({selectedPasien.nomor_antrian})</p>

            <form onSubmit={handleSelesaiKonsultasi} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Diagnosa Penyakit</label>
                <input
                  type="text"
                  required
                  className="w-full border border-slate-300 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Contoh: Hipertensi Esensial / ISPA"
                  value={diagnosa}
                  onChange={(e) => setDiagnosa(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Catatan / Anjuran Medis</label>
                <textarea
                  className="w-full border border-slate-300 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Contoh: Kurangi konsumsi garam dan istirahat cukup"
                  rows={2}
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Resep Obat</label>
                <textarea
                  required
                  className="w-full border border-slate-300 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs"
                  placeholder="1. Amlodipine 5mg (1x1 sesudah makan)&#10;2. Paracetamol 500mg (3x1 jika demam)"
                  rows={3}
                  value={resep}
                  onChange={(e) => setResep(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md"
                >
                  Simpan & Selesaikan Sesi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="bg-slate-900 text-slate-400 py-6 text-center text-xs border-t border-slate-800 mt-12">
        <p>© {new Date().getFullYear()} Puskesmas JMKSehat.</p>
      </footer>
    </div>
  );
}