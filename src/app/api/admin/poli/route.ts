import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Ambil Semua Poli
export async function GET() {
  try {
    const poli = await prisma.poli.findMany({ orderBy: { id: "asc" } });
    return NextResponse.json({ success: true, data: poli });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data poli" },
      { status: 500 },
    );
  }
}

// POST: Tambah / Update Poli
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, kode_prefix, nama_poli, kuota_harian } = body;

    if (id) {
      // Update Poli
      const updatedPoli = await prisma.poli.update({
        where: { id: Number(id) },
        data: { kode_prefix, nama_poli, kuota_harian: Number(kuota_harian) },
      });
      return NextResponse.json({
        success: true,
        message: "Poli berhasil diperbarui",
        data: updatedPoli,
      });
    } else {
      // Tambah Poli Baru
      const newPoli = await prisma.poli.create({
        data: { kode_prefix, nama_poli, kuota_harian: Number(kuota_harian) },
      });
      return NextResponse.json({
        success: true,
        message: "Poli berhasil ditambahkan",
        data: newPoli,
      });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal menyimpan data poli" },
      { status: 500 },
    );
  }
}

// DELETE: Hapus Poli
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id)
      return NextResponse.json(
        { success: false, message: "ID tidak ditemukan" },
        { status: 400 },
      );

    await prisma.poli.delete({ where: { id: Number(id) } });
    return NextResponse.json({
      success: true,
      message: "Poli berhasil dihapus",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal menghapus poli" },
      { status: 500 },
    );
  }
}
