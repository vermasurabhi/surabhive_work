import nodemailer from "nodemailer";

export type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
};

export type ContactEnv = {
  receiverEmail?: string;
  emailUser?: string;
  emailPass?: string;
};

export type ContactResult =
  | { ok: true; status: 200 }
  | { ok: false; status: number; error: string };

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendContactMessage(
  body: ContactPayload,
  env: ContactEnv,
): Promise<ContactResult> {
  const receiverEmail = env.receiverEmail?.trim() || "surabhivework@gmail.com";
  const emailUser = env.emailUser?.trim() ?? "";
  const emailPass = env.emailPass?.trim() ?? "";

  if (!emailUser || !emailPass) {
    return { ok: false, status: 500, error: "Email service is not configured" };
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!name || !email || !message) {
    return { ok: false, status: 400, error: "Name, email, and message are required" };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, status: 400, error: "Please enter a valid email address" };
  }

  if (message.length > 5000) {
    return { ok: false, status: 400, error: "Message is too long" };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    await transporter.sendMail({
      from: `"Portfolio Contact" <${emailUser}>`,
      to: receiverEmail,
      replyTo: email,
      subject: `Portfolio inquiry from ${name}`,
      text: [`Name: ${name}`, `Email: ${email}`, "", "Message:", message].join("\n"),
      html: `
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
      `,
    });

    return { ok: true, status: 200 };
  } catch (error) {
    console.error("Contact form error:", error);
    return {
      ok: false,
      status: 500,
      error: "Unable to send message. Please try again later.",
    };
  }
}

export function contactEnvFromProcess(): ContactEnv {
  return {
    receiverEmail: process.env.RECEIVER_EMAIL,
    emailUser: process.env.EMAIL_USER,
    emailPass: process.env.EMAIL_APP_PASSWORD || process.env.EMAIL_PASSWORD,
  };
}
