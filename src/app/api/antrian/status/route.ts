import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { antrian_id, status } = body;

    // Validasi input wajib ada
    if (!antrian_id || !status) {
      return NextResponse.json(
        { success: false, message: "ID antrean dan status wajib diisi." },
        { status: 400 }
      );
    }

    // Siapkan data yang akan di-update
    const updateData: any = { status };

    // Jika dokter memanggil pasien (status = "dipanggil"), 
    // catat waktu saat ini untuk memulai timer 3 menit
    if (status === "dipanggil") {
      updateData.waktu_dipanggil = new Date();
    }

    // Update data ke database menggunakan Prisma
    const updatedAntrian = await prisma.antrian.update({
      where: { id: Number(antrian_id) },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: `Status antrean berhasil diubah menjadi ${status}`,
      data: updatedAntrian,
    });
  } catch (error: any) {
    console.error("Error update status antrean:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}