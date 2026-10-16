"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Gagal masuk ke akun Anda");
        setLoading(false);
        return;
      }

      // Simpan data user ke localStorage
      localStorage.setItem("user", JSON.stringify(data.user));

      alert(`Selamat datang, ${data.user.nama}!`);

      // FILTER PENGALIHAN BERDASARKAN ROLE
      if (data.user.role === "admin") {
        router.push("/admin");
      } else if (data.user.role === "petugas") {
        router.push("/petugas");
      } else if (data.user.role === "dokter") {
        router.push("/dokter");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 py-8">
      {/* Brand Header / Back to Home via Logo */}
      <Link href="/" className="mb-6 flex items-center gap-3 group">
        <div className="bg-emerald-600 text-white p-2.5 rounded-xl font-black text-2xl tracking-wider shadow-md group-hover:bg-emerald-700 transition">
          JMK
        </div>
        <div>
          <h1 className="font-bold text-xl text-slate-900 leading-none">
            Puskesmas JMKSehat
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Sistem Pelayanan & Antrian Online
          </p>
        </div>
      </Link>

      {/* Card Form Login */}
      <div className="w-full max-w-sm md:max-w-md bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900">
            Masuk Akun JMKSehat
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Masukkan email dan kata sandi Anda untuk mengakses layanan
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3.5 rounded-xl mb-5 text-sm flex items-center gap-2 font-medium">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Alamat Email
            </label>
            <input
              type="email"
              placeholder="contoh@email.com"
              className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-slate-900 text-sm font-medium placeholder:text-slate-400"
              required
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Kata Sandi
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-slate-900 text-sm font-medium placeholder:text-slate-400"
              required
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white py-3 rounded-xl transition font-bold shadow-md hover:shadow-lg disabled:bg-emerald-300 disabled:cursor-not-allowed"
            >
              {loading ? "Memproses..." : "Masuk Sekarang"}
            </button>

            {/* Tombol Kembali ke Beranda Ukuran Presisi (Full Width & Ideal Neutral Color) */}
            <Link
              href="/"
              className="w-full inline-flex justify-center items-center gap-2 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 text-sm font-bold py-3 rounded-xl border border-slate-200 transition shadow-sm"
            >
              ← Kembali ke Beranda
            </Link>
          </div>
        </form>

        <p className="text-center text-sm text-slate-600 mt-6 pt-4 border-t border-slate-100">
          Belum memiliki akun pasien?{" "}
          <Link
            href="/register"
            className="text-emerald-600 font-bold hover:underline"
          >
            Daftar Pasien Baru
          </Link>
        </p>
      </div>
    </div>
  );
}
