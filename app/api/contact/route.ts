import { NextRequest, NextResponse } from "next/server";
import {
  sendContactMessage,
  type ContactPayload,
} from "@/lib/sendContactMessage";

function contactEnvFromProcess() {
  return {
    receiverEmail: process.env.RECEIVER_EMAIL,
    emailUser: process.env.EMAIL_USER,
    emailPass: process.env.EMAIL_APP_PASSWORD || process.env.EMAIL_PASSWORD,
  };
}

export async function POST(req: NextRequest) {
  let body: ContactPayload;
  try {
    body = (await req.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const result = await sendContactMessage(body, contactEnvFromProcess());

  if (result.ok) {
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: result.error }, { status: result.status });
}

export function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
