import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { rateLimit } from "@/lib/rateLimit";



export async function POST(request: Request) {

  try {

    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";



    const limiter = rateLimit(ip, 5, 60 * 1000);

    if (!limiter.success) {

      return NextResponse.json(

        { success: false, message: "Terlalu cepat! Mohon tunggu sebentar." },

        { status: 429 },

      );

    }



    const body = await request.json();

    const { pasien_id, poli_id, tanggal_berobat } = body;



    if (!pasien_id || !poli_id || !tanggal_berobat) {

      return NextResponse.json(

        { success: false, message: "Data tidak lengkap" },

        { status: 400 },

      );

    }



    const tgl = new Date(tanggal_berobat);



    // PROTEKSI: Cek apakah pasien ini sudah ambil tiket di tanggal yang sama

    const antrianEksis = await prisma.antrian.findFirst({

      where: {

        pasien_id: Number(pasien_id),

        tanggal_berobat: tgl,

      },

    });



    if (antrianEksis) {

      return NextResponse.json(

        {

          success: false,

          message: "Anda sudah mengambil antrian untuk tanggal ini!",

        },

        { status: 400 },

      );

    }



    // Ambil data poli & cek kuota

    const poli = await prisma.poli.findUnique({

      where: { id: Number(poli_id) },

    });



    if (!poli) {

      return NextResponse.json(

        { success: false, message: "Poli tidak ditemukan" },

        { status: 404 },

      );

    }



    const totalAntrianHariIni = await prisma.antrian.count({

      where: {

        poli_id: Number(poli_id),

        tanggal_berobat: tgl,

      },

    });



    if (totalAntrianHariIni >= poli.kuota_harian) {

      return NextResponse.json(

        {

          success: false,

          message: "Kuota antrian untuk tanggal ini sudah penuh",

        },

        { status: 400 },

      );

    }



    const urutanBaru = totalAntrianHariIni + 1;

    const nomorAntrianStr = `${poli.kode_prefix}-${String(urutanBaru).padStart(3, "0")}`;



    const newAntrian = await prisma.antrian.create({

      data: {

        pasien_id: Number(pasien_id),

        poli_id: Number(poli_id),

        nomor_antrian: nomorAntrianStr,

        angka_urutan: urutanBaru,

        tanggal_berobat: tgl,

        status: "menunggu",

      },

      include: {

        poli: true,

      },

    });



    return NextResponse.json({

      success: true,

      message: "Berhasil mengambil antrian",

      data: newAntrian,

    });

  } catch (error) {

    return NextResponse.json(

      { success: false, message: "Terjadi kesalahan server" },

      { status: 500 },

    );

  }

} 