import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET: Ambil Semua User (Sokongan Filter berdasarkan Role, misal: ?role=dokter)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");

    // Pastikan filter where menangani tipe data dengan aman
    const whereCondition = role ? { role: role as any } : {};

    const users = await prisma.users.findMany({
      where: whereCondition,
      orderBy: { id: "desc" },
      select: {
        id: true,
        nik: true,
        nama: true,
        email: true,
        no_hp: true,
        role: true,
        created_at: true,
      },
    });

    return NextResponse.json({ success: true, data: users });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data user", error: error.message },
      { status: 500 },
    );
  }
}

// POST: Tambah User Baru (Pasien / Petugas / Dokter)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nik, nama, email, password, no_hp, role } = body;

    const existingUser = await prisma.users.findFirst({
      where: { OR: [{ nik }, { email }] },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "NIK atau Email sudah terdaftar" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password || "123456", 10);

    const newUser = await prisma.users.create({
      data: {
        nik,
        nama,
        email,
        password: hashedPassword,
        no_hp,
        role: role || "pasien",
      },
    });

    return NextResponse.json({
      success: true,
      message: "User berhasil ditambahkan",
      data: newUser,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal menambah user" },
      { status: 500 },
    );
  }
}

// DELETE: Hapus User
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id)
      return NextResponse.json(
        { success: false, message: "ID tidak ditemukan" },
        { status: 400 },
      );

    await prisma.users.delete({ where: { id: Number(id) } });
    return NextResponse.json({
      success: true,
      message: "User berhasil dihapus",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal menghapus user" },
      { status: 500 },
    );
  }
}