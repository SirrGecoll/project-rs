import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const poliId = searchParams.get("poli_id");
    const tanggalStr = searchParams.get("tanggal"); // Format dari input: "2026-10-09"

    if (!poliId || !tanggalStr) {
      return NextResponse.json(
        {
          success: false,
          message: "Parameter poli_id dan tanggal wajib diisi",
        },
        { status: 400 },
      );
    }

    // Format ISO UTC Date agar cocok dengan MySQL @db.Date Prisma
    const targetDate = new Date(`${tanggalStr}T00:00:00.000Z`);

    const antrian = await prisma.antrian.findMany({
      where: {
        poli_id: Number(poliId),
        tanggal_berobat: targetDate,
      },
      include: {
        users: {
          // Sesuaikan nama relasi dari schema (users, bukan pasien)
          select: {
            nama: true,
            nik: true,
          },
        },
      },
      orderBy: {
        angka_urutan: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      data: antrian,
    });
  } catch (error) {
    console.error("Gagal mengambil data antrian petugas:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { antrian_id, status } = body;

    if (!antrian_id || !status) {
      return NextResponse.json(
        { success: false, message: "ID antrian dan status wajib diisi" },
        { status: 400 },
      );
    }

    const updatedAntrian = await prisma.antrian.update({
      where: { id: Number(antrian_id) },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      message: "Status antrian berhasil diperbarui",
      data: updatedAntrian,
    });
  } catch (error) {
    console.error("Gagal memperbarui status antrian:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui status antrian" },
      { status: 500 },
    );
  }
}
