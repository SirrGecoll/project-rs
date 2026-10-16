import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Mengambil daftar semua poli
export async function GET() {
  try {
    const poli = await prisma.poli.findMany({
      orderBy: { id: "asc" },
    });
    return NextResponse.json({ success: true, data: poli });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST: Menambah poli baru & kuota harian
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nama_poli, kuota } = body;

    if (!nama_poli) {
      return NextResponse.json({ success: false, message: "Nama poli wajib diisi." }, { status: 400 });
    }

    const kode_prefix = nama_poli.charAt(0).toUpperCase();

    const newPoli = await prisma.poli.create({
      data: { 
        nama_poli,
        kode_prefix,
        kuota_harian: kuota ? parseInt(kuota) : 30, // Menggunakan kuota_harian
      },
    });

    return NextResponse.json({ success: true, message: "Poli berhasil ditambahkan", data: newPoli });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PATCH: Mengubah data poli & kuota harian
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, nama_poli, kuota } = body;

    if (!id || !nama_poli) {
      return NextResponse.json({ success: false, message: "ID dan nama poli wajib diisi." }, { status: 400 });
    }

    const updatedPoli = await prisma.poli.update({
      where: { id: parseInt(id) },
      data: { 
        nama_poli,
        kuota_harian: kuota !== undefined ? parseInt(kuota) : undefined, // Menggunakan kuota_harian
      },
    });

    return NextResponse.json({ success: true, message: "Poli berhasil diperbarui", data: updatedPoli });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE: Menghapus poli
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "ID poli tidak ditemukan." }, { status: 400 });
    }

    await prisma.poli.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true, message: "Poli berhasil dihapus" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}