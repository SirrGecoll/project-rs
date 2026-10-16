"use client";



import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import Link from "next/link";

import Navbar from "@/components/Navbar";



interface UserDokter {

  id: number;

  nama: string;

  email: string;

}



interface Poli {

  id: number;

  nama_poli: string;

}



export default function TambahDokterPage() {

  const router = useRouter();

  const [adminUser, setAdminUser] = useState<any>(null);

  const [dokterUsers, setDokterUsers] = useState<UserDokter[]>([]);

  const [poliList, setPoliList] = useState<Poli[]>([]);



  const [form, setForm] = useState({

    user_id: "",

    poli_id: "",

    nama_dokter: "",

    hari_praktik: "Senin - Jumat",

    jam_mulai: "08:00",

    jam_selesai: "14:00",

  });



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

    if (parsedUser.role !== "admin") {

      router.push("/dashboard");

      return;

    }

    setAdminUser(parsedUser);



    fetchDataPendukung();

  }, []);



const fetchDataPendukung = async () => {

  try {

    // Panggil API admin users yang sudah ada

    const resUser = await fetch("/api/admin/users");

    const resPoli = await fetch("/api/poli");



    const dataUser = await resUser.json();

    const dataPoli = await resPoli.json();



    if (dataUser.success) {

      // Filter secara manual di frontend khusus yang rolenya 'dokter'

      const dokterOnly = (dataUser.data || []).filter((u: any) => u.role === "dokter");

      setDokterUsers(dokterOnly);

    }

    if (dataPoli.success) setPoliList(dataPoli.data || []);

  } catch (err) {

    console.error("Gagal mengambil data referensi", err);

  }

};



  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {

    const selectedUserId = e.target.value;

    const selectedUser = dokterUsers.find((u) => u.id.toString() === selectedUserId);

   

    setForm({

      ...form,

      user_id: selectedUserId,

      nama_dokter: selectedUser ? selectedUser.nama : "",

    });

  };



  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    setError("");

    setSuccess("");

    setLoading(true);



    try {

      const res = await fetch("/api/admin/dokter", {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify(form),

      });



      const data = await res.json();



      if (!res.ok) {

        setError(data.message || "Gagal menambahkan data dokter.");

        setLoading(false);

        return;

      }



      setSuccess("Data dokter berhasil ditugaskan ke poliklinik!");

      setLoading(false);

      setTimeout(() => router.push("/admin"), 1500);

    } catch (err) {

      setError("Terjadi kesalahan jaringan.");

      setLoading(false);

    }

  };



  if (!adminUser) return null;



  return (

    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans text-slate-800">

      <Navbar isLoggedIn={true} userRole={adminUser.role} userName={adminUser.nama} />



      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 w-full flex-grow">

        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm mb-6">

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 mb-1">

            <Link href="/admin">Admin Panel</Link><span>/</span><span className="text-slate-400">Tambah Dokter Poli</span>

          </div>

          <h1 className="text-2xl font-extrabold text-slate-900">Form Penugasan Dokter</h1>

          <p className="text-sm text-slate-500 mt-1">Hubungkan akun user ber-role dokter ke poliklinik tujuan.</p>

        </div>



        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-md">

          {error && (

            <div className="bg-red-50 border border-red-200 text-red-600 p-3.5 rounded-xl mb-5 text-sm font-medium">

              ⚠️ {error}

            </div>

          )}



          {success && (

            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3.5 rounded-xl mb-5 text-sm font-medium">

              ✅ {success}

            </div>

          )}



          <form onSubmit={handleSubmit} className="space-y-4">

            <div>

              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">

                Pilih Akun User (Role Dokter)

              </label>

              <select

                className="w-full border border-slate-300 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white"

                value={form.user_id}

                onChange={handleUserChange}

                required

              >

                <option value="">-- Pilih Akun Dokter --</option>

                {dokterUsers.map((u) => (

                  <option key={u.id} value={u.id}>

                    {u.nama} ({u.email})

                  </option>

                ))}

              </select>

            </div>



            <div>

              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">

                Nama Lengkap & Gelar (Otomatis / Edit)

              </label>

              <input

                type="text"

                className="w-full border border-slate-300 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"

                value={form.nama_dokter}

                onChange={(e) => setForm({ ...form, nama_dokter: e.target.value })}

                required

              />

            </div>



            <div>

              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">

                Poliklinik Tujuan

              </label>

              <select

                className="w-full border border-slate-300 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white"

                value={form.poli_id}

                onChange={(e) => setForm({ ...form, poli_id: e.target.value })}

                required

              >

                <option value="">-- Pilih Poliklinik --</option>

                {poliList.map((p) => (

                  <option key={p.id} value={p.id}>

                    {p.nama_poli}

                  </option>

                ))}

              </select>

            </div>



            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <div>

                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">

                  Hari Praktik

                </label>

                <input

                  type="text"

                  className="w-full border border-slate-300 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"

                  value={form.hari_praktik}

                  onChange={(e) => setForm({ ...form, hari_praktik: e.target.value })}

                  required

                />

              </div>



              <div>

                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">

                  Jam Mulai

                </label>

                <input

                  type="time"

                  className="w-full border border-slate-300 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"

                  value={form.jam_mulai}

                  onChange={(e) => setForm({ ...form, jam_mulai: e.target.value })}

                  required

                />

              </div>



              <div>

                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">

                  Jam Selesai

                </label>

                <input

                  type="time"

                  className="w-full border border-slate-300 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"

                  value={form.jam_selesai}

                  onChange={(e) => setForm({ ...form, jam_selesai: e.target.value })}

                  required

                />

              </div>

            </div>



            <div className="pt-4 flex items-center justify-end gap-3">

              <Link

                href="/admin"

                className="px-5 py-3 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"

              >

                Batal

              </Link>

              <button

                type="submit"

                disabled={loading}

                className="px-6 py-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition disabled:bg-emerald-300"

              >

                {loading ? "Menyimpan..." : "Simpan Penugasan Dokter"}

              </button>

            </div>

          </form>

        </div>

      </main>



      <footer className="bg-slate-900 text-slate-400 py-6 text-center text-xs border-t border-slate-800 mt-12">

        <p>© {new Date().getFullYear()} Puskesmas JMKSehat.</p>

      </footer>

    </div>

  );

}