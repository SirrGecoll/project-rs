"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

interface Poli {
  id: number;
  nama_poli: string;
  kuota_harian: number;
  jumlah_selesai?: number;
}

export default function AdminPoliPage() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [poliList, setPoliList] = useState<Poli[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // State Modal Tambah Poli
  const [addModal, setAddModal] = useState(false);
  const [namaPoli, setNamaPoli] = useState("");
  const [kuotaPoli, setKuotaPoli] = useState("30");

  // State Modal Edit Poli
  const [editModal, setEditModal] = useState(false);
  const [selectedPoli, setSelectedPoli] = useState<Poli | null>(null);
  const [editNamaPoli, setEditNamaPoli] = useState("");
  const [editKuotaPoli, setEditKuotaPoli] = useState("30");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      router.push("/login");
      return;
    }
    const parsedUser = JSON.parse(savedUser);
    if (parsedUser.role !== "admin") {
      router.push("/dashboard");
      return;
    }
    setAdminUser(parsedUser);
    fetchPoli();
  }, []);

  const fetchPoli = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/poli");
      const data = await res.json();
      if (data.success) {
        setPoliList(data.data || []);
      } else {
        setErrorMsg(data.message || "Gagal mengambil data poliklinik.");
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan jaringan.");
    }
    setLoading(false);
  };

  const handleAddPoli = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/poli", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama_poli: namaPoli, kuota: kuotaPoli }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg("Poliklinik baru beserta kuotanya berhasil ditambahkan!");
        setAddModal(false);
        setNamaPoli("");
        setKuotaPoli("30");
        fetchPoli();
      } else {
        setErrorMsg(data.message || "Gagal menambahkan poliklinik.");
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan jaringan.");
    }
  };

  const handleOpenEdit = (poli: Poli) => {
    setSelectedPoli(poli);
    setEditNamaPoli(poli.nama_poli);
    setEditKuotaPoli(poli.kuota_harian ? poli.kuota_harian.toString() : "30");
    setEditModal(true);
  };

  const handleUpdatePoli = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPoli) return;

    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/poli", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedPoli.id,
          nama_poli: editNamaPoli,
          kuota: editKuotaPoli,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg("Poliklinik dan kuota berhasil diperbarui!");
        setEditModal(false);
        fetchPoli();
      } else {
        setErrorMsg(data.message || "Gagal memperbarui poliklinik.");
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan jaringan.");
    }
  };

  const handleDeletePoli = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus poliklinik ini?")) return;

    try {
      const res = await fetch(`/api/poli?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg("Poliklinik berhasil dihapus.");
        fetchPoli();
      } else {
        alert(data.message || "Gagal menghapus poliklinik.");
      }
    } catch (err) {
      alert("Terjadi kesalahan jaringan.");
    }
  };

  if (!adminUser) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans text-slate-800">
      <Navbar isLoggedIn={true} userRole={adminUser.role} userName={adminUser.nama} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex-grow">
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 mb-1">
              <Link href="/admin">Admin Panel</Link><span>/</span><span className="text-slate-400">Kelola Poliklinik & Kuota</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Manajemen Poliklinik & Kuota Harian</h1>
            <p className="text-sm text-slate-500 mt-1">
              Atur nama unit poliklinik serta pantau progres jumlah pasien selesai vs kuota harian.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAddModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition inline-flex items-center gap-1.5"
            >
              ➕ Tambah Poli & Kuota
            </button>
            <Link
              href="/admin"
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition"
            >
              ← Kembali
            </Link>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium">
            ⚠️ {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl mb-6 text-sm font-medium">
            ✅ {successMsg}
          </div>
        )}

        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>🏥</span> Daftar Poliklinik & Progres Pasien
            </h2>
            <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
              Total Poli: {poliList.length}
            </span>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-500 text-sm">Memuat data poliklinik...</div>
          ) : poliList.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">Belum ada data poliklinik.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
                    <th className="p-3.5">ID Poli</th>
                    <th className="p-3.5">Nama Poliklinik</th>
                    <th className="p-3.5">Progres Hari Ini (Selesai / Kuota)</th>
                    <th className="p-3.5 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {poliList.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="p-3.5 font-mono text-slate-500">#{p.id}</td>
                      <td className="p-3.5 font-bold text-slate-900">{p.nama_poli}</td>
                      <td className="p-3.5">
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-3.5 py-1 rounded-full text-xs inline-flex items-center gap-1.5">
                          <span>✅ {p.jumlah_selesai || 0} Selesai</span>
                          <span className="text-slate-300">/</span>
                          <span>Maks {p.kuota_harian || 0} Pasien</span>
                        </span>
                      </td>
                      <td className="p-3.5 text-center space-x-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
                        >
                          ✏️ Edit Kuota & Nama
                        </button>
                        <button
                          onClick={() => handleDeletePoli(p.id)}
                          className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
                        >
                          🗑️ Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal Tambah Poli */}
      {addModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Tambah Poliklinik & Kuota</h3>
            <p className="text-xs text-slate-500 mb-4">Masukkan nama unit poliklinik dan batas kuota harian.</p>

            <form onSubmit={handleAddPoli} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Poliklinik</label>
                <input
                  type="text"
                  required
                  className="w-full border border-slate-300 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Contoh: Poli Anak / Poli Mata"
                  value={namaPoli}
                  onChange={(e) => setNamaPoli(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kuota Harian Pasien</label>
                <input
                  type="number"
                  required
                  className="w-full border border-slate-300 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Contoh: 30"
                  value={kuotaPoli}
                  onChange={(e) => setKuotaPoli(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md"
                >
                  Simpan Poli
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Poli */}
      {editModal && selectedPoli && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Edit Poliklinik & Kuota</h3>
            <p className="text-xs text-slate-500 mb-4">Ubah detail poliklinik #{selectedPoli.id}</p>

            <form onSubmit={handleUpdatePoli} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Poliklinik</label>
                <input
                  type="text"
                  required
                  className="w-full border border-slate-300 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  value={editNamaPoli}
                  onChange={(e) => setEditNamaPoli(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kuota Harian Pasien</label>
                <input
                  type="number"
                  required
                  className="w-full border border-slate-300 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  value={editKuotaPoli}
                  onChange={(e) => setEditKuotaPoli(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setEditModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md"
                >
                  Simpan Perubahan
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