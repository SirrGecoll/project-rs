import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pasienId = searchParams.get("pasien_id");

    if (!pasienId) {
      return NextResponse.json(
        { success: false, message: "Parameter pasien_id diperlukan" },
        { status: 400 },
      );
    }

    // Ambil antrian terbaru milik pasien tersebut
    const antrian = await prisma.antrian.findFirst({
      where: {
        pasien_id: Number(pasienId),
      },
      include: {
        poli: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: antrian,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
