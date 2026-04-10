import { NextResponse } from "next/server";
import crypto from "crypto";
import { saveOtp } from "@/app/api/otp/store";

type RequestBody = {
  email?: string;
  purpose?: "signup" | "login" | string;
};

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestBody;
    const email = (body.email || "").trim().toLowerCase();
    const purpose = (body.purpose || "signup").trim();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const otp = generateOtp();
    const secret = process.env.OTP_SECRET || "dev-secret";
    const otpHash = sha256(`${secret}:${email}:${purpose}:${otp}`);
    const persisted = await saveOtp(email, purpose, otpHash);

    return NextResponse.json({
      ok: true,
      message: "OTP generated",
      storage: persisted.backend,
      ...(process.env.NODE_ENV !== "production" ? { devOtp: otp } : {}),
    });
  } catch (e: unknown) {
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "Failed to generate OTP" },
      { status: 500 }
    );
  }
}

