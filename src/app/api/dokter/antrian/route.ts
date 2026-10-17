import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Mengambil daftar pasien untuk dashboard dokter (menampilkan status aktif & selesai hari ini)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const poli_id = searchParams.get("poli_id");
    const tanggal = searchParams.get("tanggal");

    if (!poli_id || !tanggal) {
      return NextResponse.json(
        { success: false, message: "Poli ID dan Tanggal wajib disertakan." },
        { status: 400 }
      );
    }

    const listAntrian = await prisma.antrian.findMany({
      where: {
        poli_id: parseInt(poli_id),
        tanggal_berobat: new Date(tanggal),
        status: {
          in: ["menunggu", "dipanggil", "proses", "terlewat", "selesai"], // Mencakup semua status aktif dan riwayat hari ini
        },
      },
      include: {
        users: {
          select: { id: true, nama: true, nik: true, no_hp: true },
        },
        resep_obat: true,
      },
      orderBy: { angka_urutan: "asc" },
    });

    return NextResponse.json({ success: true, data: listAntrian });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PATCH: Mengubah status antrian (misal ke 'selesai') dan menyimpan resep obat
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { antrian_id, status, dokter_id, diagnosa, catatan, resep } = body;

    // Update status antrian
    const updatedAntrian = await prisma.antrian.update({
      where: { id: parseInt(antrian_id) },
      data: { status },
    });

    // Jika dokter mengisi resep / diagnosa saat menyelesaikan pasien
    if (diagnosa && resep && dokter_id) {
      await prisma.resep_obat.create({
        data: {
          antrian_id: parseInt(antrian_id),
          dokter_id: parseInt(dokter_id),
          diagnosa,
          catatan: catatan || "",
          resep,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Status antrian dan resep berhasil diperbarui.",
      data: updatedAntrian,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}