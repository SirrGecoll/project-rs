"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Turnstile } from "@marsidev/react-turnstile";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nik: "",
    nama: "",
    email: "",
    password: "",
    no_hp: "",
  });
  const [turnstileToken, setTurnstileToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!turnstileToken) {
      setError("Harap selesaikan verifikasi CAPTCHA!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, turnstileToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Gagal melakukan registrasi");
        setLoading(false);
        return;
      }

      alert("Registrasi berhasil! Silakan login.");
      router.push("/login");
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

      {/* Card Form Register - Responsive Container */}
      <div className="w-full max-w-sm md:max-w-2xl bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900">
            Pendaftaran Pasien Baru
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Lengkapi data diri Anda untuk membuat akun pendaftaran antrian
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3.5 rounded-xl mb-5 text-sm flex items-center gap-2 font-medium">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Grid Layout: Mobile First (1 Kolom) -> Desktop (2 Kolom) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nomor Induk Kependudukan (NIK)
              </label>
              <input
                type="text"
                placeholder="16 digit NIK sesuai KTP"
                maxLength={16}
                minLength={16}
                className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-slate-900 text-sm font-medium placeholder:text-slate-400"
                required
                onChange={(e) => setForm({ ...form, nik: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                placeholder="Sesuai nama di KTP"
                className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-slate-900 text-sm font-medium placeholder:text-slate-400"
                required
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
              />
            </div>

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
                Nomor WhatsApp / HP
              </label>
              <input
                type="text"
                placeholder="081234567890"
                className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-slate-900 text-sm font-medium placeholder:text-slate-400"
                required
                onChange={(e) => setForm({ ...form, no_hp: e.target.value })}
              />
            </div>

            {/* Password Mengambil Span 2 Kolom di Desktop */}
            <div className="md:col-span-2">
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
          </div>

          {/* Widget Cloudflare Turnstile */}
          <div className="flex justify-center pt-2 pb-1">
            <Turnstile
              siteKey="0x4AAAAAAFSZx_0__qnCR3GZ"
              onSuccess={(token) => setTurnstileToken(token)}
            />
          </div>

          {/* Group Tombol Aksi */}
          <div className="space-y-2.5 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white py-3 rounded-xl transition font-bold shadow-md hover:shadow-lg disabled:bg-emerald-300 disabled:cursor-not-allowed"
            >
              {loading ? "Memproses Data..." : "Daftar Akun Sekarang"}
            </button>

            {/* Tombol Kembali ke Beranda */}
            <Link
              href="/"
              className="w-full inline-flex justify-center items-center gap-2 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 text-sm font-bold py-3 rounded-xl border border-slate-200 transition shadow-sm"
            >
              ← Kembali ke Beranda
            </Link>
          </div>
        </form>

        <p className="text-center text-sm text-slate-600 mt-6 pt-4 border-t border-slate-100">
          Sudah memiliki akun pasien?{" "}
          <Link
            href="/login"
            className="text-emerald-600 font-bold hover:underline"
          >
            Masuk Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
