import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get("user_id");

    if (!user_id) {
      return NextResponse.json(
        { success: false, message: "User ID wajib disertakan." },
        { status: 400 }
      );
    }

    // Cari data di tabel dokter yang terhubung dengan user_id
    const dokter = await prisma.dokter.findFirst({
      where: { user_id: parseInt(user_id) },
      include: {
        poli: true, // Menyertakan relasi nama poli tempat dokter bertugas
      },
    });

    if (!dokter) {
      return NextResponse.json(
        { success: false, message: "Data profil dokter belum diatur di database." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: dokter });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}