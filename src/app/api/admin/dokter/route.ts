import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, poli_id, nama_dokter, hari_praktik, jam_mulai, jam_selesai } = body;

    if (!user_id || !poli_id || !nama_dokter) {
      return NextResponse.json(
        { success: false, message: "Data utama dokter dan poli wajib diisi." },
        { status: 400 }
      );
    }

    // Simpan ke tabel dokter
    const newDokter = await prisma.dokter.create({
      data: {
        user_id: parseInt(user_id),
        poli_id: parseInt(poli_id),
        nama_dokter,
        hari_praktik,
        jam_mulai: new Date(`1970-01-01T${jam_mulai}:00Z`),
        jam_selesai: new Date(`1970-01-01T${jam_selesai}:00Z`),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Dokter berhasil ditugaskan ke poliklinik.",
      data: newDokter,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}