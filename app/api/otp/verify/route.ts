import { NextResponse } from "next/server";
import crypto from "crypto";
import { getLatestOtp, markOtpUsed } from "@/app/api/otp/store";

type RequestBody = {
  email?: string;
  purpose?: "signup" | "login" | string;
  otp?: string;
};

function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestBody;
    const email = (body.email || "").trim().toLowerCase();
    const purpose = (body.purpose || "signup").trim();
    const otp = (body.otp || "").trim();

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const record = await getLatestOtp(email, purpose);
    if (!record) {
      return NextResponse.json({ message: "OTP not found" }, { status: 404 });
    }

    if (record.used) {
      return NextResponse.json({ message: "OTP already used" }, { status: 400 });
    }

    if (Number.isNaN(record.expiresAtMs) || record.expiresAtMs < Date.now()) {
      return NextResponse.json({ message: "OTP expired" }, { status: 400 });
    }

    const secret = process.env.OTP_SECRET || "dev-secret";
    const expectedHash = sha256(`${secret}:${email}:${purpose}:${otp}`);
    if (expectedHash !== record.otpHash) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }

    await markOtpUsed(record.id, email, purpose, record.backend);

    return NextResponse.json({ ok: true, message: "OTP verified" });
  } catch (e: unknown) {
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "Failed to verify OTP" },
      { status: 500 }
    );
  }
}

