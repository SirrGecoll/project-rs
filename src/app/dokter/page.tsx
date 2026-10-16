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

  // Fungsi untuk Mencetak Resep Obat
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
                Total Pasien: {antrianList.length}
              </span>
            </div>

            {loading ? (
              <div className="text-center py-12 text-slate-500 text-sm">Memuat data pasien...</div>
            ) : antrianList.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                <p className="text-slate-500 text-sm font-semibold">Belum ada pasien yang dipanggil ke poli ini pada tanggal tersebut.</p>
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
                            item.status === "dipanggil" ? "bg-amber-100 text-amber-800 border border-amber-300" : "bg-emerald-100 text-emerald-800"
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-center">
                          {item.status === "dipanggil" ? (
                            <button
                              onClick={() => handleOpenModal(item)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition"
                            >
                              📝 Periksa & Resep Obat
                            </button>
                          ) : (
                            <button
                              onClick={() => handleCetakResep(item)}
                              className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm transition inline-flex items-center gap-1.5"
                            >
                              🖨️ Cetak Resep
                            </button>
                          )}
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
                  placeholder="Contoh: Pulpitis / Karies Gigi"
                  value={diagnosa}
                  onChange={(e) => setDiagnosa(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Catatan / Anjuran Medis</label>
                <textarea
                  className="w-full border border-slate-300 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Contoh: Hindari makanan terlalu dingin atau panas"
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
                  placeholder="1. Asam Mefenamat 500mg (3x1 sesudah makan)&#10;2. Amoxicillin 500mg (3x1 habiskan)"
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