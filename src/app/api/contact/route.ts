import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const TO_EMAIL = "comicbookstorefinder@gmail.com";

function escape(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    c === "&"
      ? "&amp;"
      : c === "<"
        ? "&lt;"
        : c === ">"
          ? "&gt;"
          : c === '"'
            ? "&quot;"
            : "&#39;",
  );
}

async function sendNotificationEmail(form: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY not configured" };
  }
  const fromAddress = process.env.RESEND_FROM_EMAIL || "Comic Book Store Finder <onboarding@resend.dev>";

  const subjectLine = `New contact form: ${form.subject} — from ${form.name}`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px;">
      <h2 style="margin: 0 0 16px 0;">New Contact Form Submission</h2>
      <table style="border-collapse: collapse; width: 100%;">
        <tr><td style="padding: 8px 0; font-weight: 600; width: 90px;">Name:</td><td>${escape(form.name)}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: 600;">Email:</td><td><a href="mailto:${escape(form.email)}">${escape(form.email)}</a></td></tr>
        <tr><td style="padding: 8px 0; font-weight: 600;">Topic:</td><td>${escape(form.subject)}</td></tr>
      </table>
      <hr style="margin: 16px 0; border: 0; border-top: 1px solid #ddd;" />
      <p style="white-space: pre-wrap; line-height: 1.6;">${escape(form.message)}</p>
      <hr style="margin: 24px 0 16px 0; border: 0; border-top: 1px solid #ddd;" />
      <p style="font-size: 12px; color: #888;">Reply directly to this email to respond to ${escape(form.name)}.</p>
    </div>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [TO_EMAIL],
        reply_to: form.email,
        subject: subjectLine,
        html,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `Resend ${res.status}: ${text.slice(0, 300)}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    // Always store the submission in Supabase (source of truth)
    const { error: dbError } = await supabase.from("contact_submissions").insert({
      name,
      email,
      subject,
      message,
    });
    if (dbError) {
      console.error("contact form db insert failed:", dbError);
    }

    // Best-effort email notification — won't block success response
    const emailResult = await sendNotificationEmail({ name, email, subject, message });
    if (!emailResult.ok) {
      console.warn("contact form email skipped:", emailResult.error);
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("contact form error:", e);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}
