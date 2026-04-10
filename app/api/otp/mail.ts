import nodemailer from "nodemailer";

/**
 * Sends OTP to the user's inbox via SMTP (Gmail: use an App Password, not your normal password).
 * Set SMTP_USER, SMTP_PASSWORD, and optionally SMTP_HOST / SMTP_PORT / SMTP_FROM in .env.local
 */
export async function sendOtpEmail(to: string, otp: string, purpose: string) {
  const user = process.env.SMTP_USER?.trim();
  const pass = (process.env.SMTP_PASSWORD || process.env.SMTP_PASS)?.trim();
  if (!user || !pass) {
    return { sent: false as const, reason: "smtp_not_configured" as const };
  }

  const host = process.env.SMTP_HOST?.trim() || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const from =
    process.env.SMTP_FROM?.trim() || `"CitizenConnect" <${user}>`;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  const purposeLabel =
    purpose === "signup" ? "sign up" : purpose === "login" ? "log in" : purpose;

  try {
    await transporter.sendMail({
      from,
      to,
      subject: "Your CitizenConnect verification code",
      text: `Your verification code is ${otp}. It expires in 10 minutes.\n\nIf you did not request this, you can ignore this email.\n\nPurpose: ${purposeLabel}`,
      html: `
      <p>Your verification code is:</p>
      <p style="font-size:24px;font-weight:bold;letter-spacing:4px;">${otp}</p>
      <p>It expires in 10 minutes.</p>
      <p style="color:#666;font-size:12px;">If you did not request this, you can ignore this email.</p>
    `,
    });
  } catch (err) {
    const msg =
      err instanceof Error ? err.message : "Failed to send email";
    throw new Error(`SMTP send failed: ${msg}`);
  }

  return { sent: true as const };
}
