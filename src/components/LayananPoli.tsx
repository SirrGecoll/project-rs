export default function LayananPoli() {
  const poliList = [
    {
      icon: "🩺",
      title: "Poli Umum",
      desc: "Pemeriksaan kesehatan umum, konsultasi medis, dan pembuatan rujukan.",
    },
    {
      icon: "🦷",
      title: "Poli Gigi",
      desc: "Perawatan gigi, pembersihan karang gigi, cabut gigi, dan pemeriksaan rutin.",
    },
    {
      icon: "👶",
      title: "Poli KIA & KB",
      desc: "Pemeriksaan ibu hamil, imunisasi anak, dan pelayanan Keluarga Berencana.",
    },
    {
      icon: "🧪",
      title: "Laboratorium",
      desc: "Pemeriksaan darah, urine, gula darah, kolesterol, dan tes kesehatan lainnya.",
    },
  ];

  return (
    <section id="layanan" className="py-16 px-6 max-w-7xl mx-auto w-full">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">
          Layanan Poliklinik
        </h2>
        <p className="text-slate-600 text-sm">
          Puskesmas JMKSehat menyediakan berbagai jenis pelayanan kesehatan
          masyarakat
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {poliList.map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition"
          >
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center font-bold text-xl mb-4">
              {item.icon}
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">
              {item.title}
            </h3>
            <p className="text-slate-600 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
