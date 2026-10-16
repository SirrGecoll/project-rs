export default function InformasiOperasional() {
  return (
    <section
      id="informasi"
      className="bg-slate-100 py-16 px-6 border-t border-slate-200"
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Jam Operasional Pelayanan
          </h2>
          <p className="text-slate-600 text-sm">
            Loket pendaftaran antrian online dibuka sesuai ketentuan operasional
            Puskesmas JMKSehat.
          </p>
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-slate-700">Senin - Kamis</span>
              <span className="font-bold text-emerald-700">
                07:30 - 14:00 WIB
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-slate-700">Jumat</span>
              <span className="font-bold text-emerald-700">
                07:30 - 11:30 WIB
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-slate-700">
                Sabtu - Minggu & Hari Libur
              </span>
              <span className="font-bold text-red-600">
                Tutup (Unit IGD 24 Jam)
              </span>
            </div>
          </div>
        </div>

        <div id="kontak" className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Hubungi Kami</h2>
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3 text-sm text-slate-700">
            <p>
              📍 <strong>Alamat:</strong> Jl. Kesehatan No. 123, Kota JMKSehat
            </p>
            <p>
              📞 <strong>Telepon:</strong> (021) 1234-5678
            </p>
            <p>
              💬 <strong>WhatsApp Layanan:</strong> +62 812-3456-7890
            </p>
            <p>
              ✉️ <strong>Email:</strong> info@jmksehat.go.id
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
