"use client";

import Link from "next/link";

interface NavbarProps {
  isLoggedIn: boolean;
  userRole: string;
  userName?: string;
}

export default function Navbar({
  isLoggedIn,
  userRole,
  userName,
}: NavbarProps) {
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  // Fungsi helper untuk menentukan tujuan URL Dashboard sesuai Role
  const getDashboardUrl = () => {
    if (userRole === "admin") return "/admin";
    if (userRole === "petugas") return "/petugas";
    return "/dashboard";
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-emerald-600 text-white p-2 rounded-lg font-black text-xl tracking-wider">
            JMK
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-900 leading-none">
              Puskesmas JMKSehat
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Sistem Pelayanan & Antrian Online
            </p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600">
          <a href="/" className="hover:text-emerald-600 transition">
            Beranda
          </a>
          <a href="#layanan" className="hover:text-emerald-600 transition">
            Layanan Poli
          </a>
          <a href="/informasi" className="hover:text-emerald-600 transition">
            Informasi
          </a>
          <a href="#kontak" className="hover:text-emerald-600 transition">
            Kontak
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                👋 Halo,{" "}
                <strong className="text-emerald-600">
                  {userName || "User"}
                </strong>
              </span>

              <Link
                href={getDashboardUrl()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-4 py-2 rounded-lg font-semibold transition shadow-sm"
              >
                {userRole === "pasien"
                  ? "Ambil Antrian / Dashboard"
                  : "Dashboard Saya"}
              </Link>
              <button
                onClick={handleLogout}
                className="text-slate-500 hover:text-red-600 text-xs font-bold border border-slate-200 px-3 py-2 rounded-lg transition"
              >
                Keluar
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-emerald-600 hover:text-emerald-700 text-sm font-semibold px-4 py-2 transition"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-5 py-2.5 rounded-lg font-semibold transition shadow-sm"
              >
                Daftar Pasien
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
