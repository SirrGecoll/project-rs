import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";

    const limiter = rateLimit(ip, 5, 60 * 1000);
    if (!limiter.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Terlalu banyak percobaan. Silakan coba lagi dalam 1 menit.",
        },
        { status: 429 },
      );
    }

    const body = await request.json();
    const { nik, nama, email, password, no_hp, turnstileToken } = body;

    // 1. Verifikasi Cloudflare Turnstile Token
    if (!turnstileToken) {
      return NextResponse.json(
        { success: false, message: "Token CAPTCHA tidak ditemukan" },
        { status: 400 },
      );
    }

    const turnstileRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: "0x4AAAAAAFSZx9C3DGLnL53eJuA7yvIcs2g", // Dummy Secret Key Testing
          response: turnstileToken,
        }),
      },
    );

    const turnstileResult = await turnstileRes.json();
    if (!turnstileResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Verifikasi CAPTCHA gagal! Anda terdeteksi bot.",
        },
        { status: 400 },
      );
    }

    // 2. Cek NIK / Email
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [{ nik }, { email }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "NIK atau Email sudah terdaftar" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.users.create({
      data: {
        nik,
        nama,
        email,
        password: hashedPassword,
        no_hp,
        role: "pasien",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Registrasi berhasil",
      data: { id: newUser.id, nama: newUser.nama, email: newUser.email },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
