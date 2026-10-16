"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LayananPoli from "@/components/LayananPoli";
import InformasiOperasional from "@/components/InformasiOperasional";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setIsLoggedIn(true);
      setUserRole(user.role);
      setUserName(user.nama);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between font-sans">
      <Navbar isLoggedIn={isLoggedIn} userRole={userRole} userName={userName} />
      <Hero isLoggedIn={isLoggedIn} />
      <LayananPoli />
      <InformasiOperasional />

      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-xs border-t border-slate-800">
        <p>© {new Date().getFullYear()} Puskesmas JMKSehat. Hak Cipta Dilindungi Undang-Undang.</p>
      </footer>
    </div>
  );
}