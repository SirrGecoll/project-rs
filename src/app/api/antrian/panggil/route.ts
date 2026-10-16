import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Ambil daftar antrian hari ini berdasarkan poli
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const poli_id = searchParams.get("poli_id");
    const tanggal =
      searchParams.get("tanggal") || new Date().toISOString().split("T")[0];

    if (!poli_id) {
      return NextResponse.json(
        { success: false, message: "poli_id diperlukan" },
        { status: 400 },
      );
    }

    const listAntrian = await prisma.antrian.findMany({
      where: {
        poli_id: Number(poli_id),
        tanggal_berobat: new Date(tanggal),
      },
      include: {
        users: {
          select: { nama: true, nik: true },
        },
      },
      orderBy: { angka_urutan: "asc" },
    });

    return NextResponse.json({ success: true, data: listAntrian });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}

// PATCH: Update status antrian (dipanggil / selesai / dibatalkan)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { antrian_id, status } = body;

    if (!antrian_id || !status) {
      return NextResponse.json(
        { success: false, message: "Data tidak lengkap" },
        { status: 400 },
      );
    }

    const updatedAntrian = await prisma.antrian.update({
      where: { id: Number(antrian_id) },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      message: "Status berhasil diperbarui",
      data: updatedAntrian,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
