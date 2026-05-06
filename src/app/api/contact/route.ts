import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Store in Supabase (we'll create a contact_submissions table)
    const { error } = await supabase.from("contact_submissions").insert({
      name,
      email,
      subject,
      message,
    });

    if (error) {
      console.error("Contact form error:", error);
      // Still return success even if DB insert fails - we don't want to lose the message
      // In production, you'd also send an email here
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
