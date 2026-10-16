"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

interface User {
  id: number;
  nama: string;
  email: string;
  nik: string;
  role: string;
  no_hp: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // State untuk Modal Edit Role
  const [editModal, setEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState("pasien");

  // State untuk Modal Tambah User Baru
  const [addModal, setAddModal] = useState(false);
  const [formAdd, setFormAdd] = useState({
    nama: "",
    email: "",
    password: "",
    nik: "",
    no_hp: "",
    role: "pasien",
  });

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
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.success) {
        setUsersList(data.data || []);
      } else {
        setErrorMsg(data.message || "Gagal mengambil data user.");
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan jaringan.");
    }
    setLoading(false);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formAdd),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg("User baru berhasil ditambahkan!");
        setAddModal(false);
        setFormAdd({ nama: "", email: "", password: "", nik: "", no_hp: "", role: "pasien" });
        fetchUsers();
      } else {
        setErrorMsg(data.message || "Gagal menambahkan user.");
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan jaringan.");
    }
  };

  const handleOpenEdit = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setEditModal(true);
  };

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: selectedUser.id,
          role: newRole,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg("Role user berhasil diperbarui!");
        setEditModal(false);
        fetchUsers();
      } else {
        setErrorMsg(data.message || "Gagal memperbarui role.");
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan jaringan.");
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus user ini?")) return;

    try {
      const res = await fetch(`/api/admin/users?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg("User berhasil dihapus.");
        fetchUsers();
      } else {
        alert(data.message || "Gagal menghapus user.");
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
              <Link href="/admin">Admin Panel</Link><span>/</span><span className="text-slate-400">Kelola Data User</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Manajemen Pengguna (Users)</h1>
            <p className="text-sm text-slate-500 mt-1">
              Kelola akun terdaftar, tambah user baru, ubah role, atau hapus akun.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAddModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition inline-flex items-center gap-1.5"
            >
              ➕ Tambah User Baru
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
              <span>👥</span> Daftar Seluruh Akun User
            </h2>
            <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
              Total User: {usersList.length}
            </span>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-500 text-sm">Memuat data user...</div>
          ) : usersList.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">Belum ada user terdaftar.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
                    <th className="p-3.5">Nama Lengkap</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">NIK</th>
                    <th className="p-3.5">No. HP</th>
                    <th className="p-3.5">Role</th>
                    <th className="p-3.5 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-900">{u.nama}</td>
                      <td className="p-3.5 text-slate-600">{u.email}</td>
                      <td className="p-3.5 text-slate-500 font-mono text-xs">{u.nik || "-"}</td>
                      <td className="p-3.5 text-slate-600">{u.no_hp || "-"}</td>
                      <td className="p-3.5">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                          u.role === "admin" ? "bg-purple-100 text-purple-800" :
                          u.role === "dokter" ? "bg-emerald-100 text-emerald-800" :
                          u.role === "petugas" ? "bg-amber-100 text-amber-800" :
                          "bg-blue-100 text-blue-800"
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3.5 text-center space-x-2">
                        <button
                          onClick={() => handleOpenEdit(u)}
                          className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
                        >
                          ✏️ Edit Role
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id)}
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

      {/* Modal Tambah User Baru */}
      {addModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Tambah User Baru</h3>
            <p className="text-xs text-slate-500 mb-4">Buat akun baru langsung dari panel admin.</p>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  className="w-full border border-slate-300 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Contoh: dr. Budi Santoso"
                  value={formAdd.nama}
                  onChange={(e) => setFormAdd({ ...formAdd, nama: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full border border-slate-300 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="budi@email.com"
                    value={formAdd.email}
                    onChange={(e) => setFormAdd({ ...formAdd, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    className="w-full border border-slate-300 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="••••••••"
                    value={formAdd.password}
                    onChange={(e) => setFormAdd({ ...formAdd, password: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NIK</label>
                  <input
                    type="text"
                    className="w-full border border-slate-300 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Nomor NIK KTP"
                    value={formAdd.nik}
                    onChange={(e) => setFormAdd({ ...formAdd, nik: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">No. HP</label>
                  <input
                    type="text"
                    className="w-full border border-slate-300 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="08xxxxxxxxxx"
                    value={formAdd.no_hp}
                    onChange={(e) => setFormAdd({ ...formAdd, no_hp: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Role Akun</label>
                <select
                  className="w-full border border-slate-300 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-bold"
                  value={formAdd.role}
                  onChange={(e) => setFormAdd({ ...formAdd, role: e.target.value })}
                >
                  <option value="pasien">Pasien</option>
                  <option value="dokter">Dokter</option>
                  <option value="petugas">Petugas Loket</option>
                  <option value="admin">Admin</option>
                </select>
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
                  Simpan User Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Role User */}
      {editModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Ubah Role Pengguna</h3>
            <p className="text-xs text-slate-500 mb-4">User: <span className="font-bold text-slate-800">{selectedUser.nama}</span> ({selectedUser.email})</p>

            <form onSubmit={handleUpdateRole} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Pilih Role Baru
                </label>
                <select
                  className="w-full border border-slate-300 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-bold"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                >
                  <option value="pasien">Pasien</option>
                  <option value="dokter">Dokter</option>
                  <option value="petugas">Petugas Loket</option>
                  <option value="admin">Admin</option>
                </select>
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