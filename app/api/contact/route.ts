import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    // ── Basic validation ──────────────────────────────
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { success: false, message: 'All fields are required.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('[contact] Missing RESEND_API_KEY env var');
      return NextResponse.json(
        { success: false, message: 'Server email configuration is missing.' },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const escapedName = escapeHtml(name);
    const escapedEmail = escapeHtml(email);
    const escapedMessage = escapeHtml(message);

    // ── Email delivered to YOU ────────────────────────
    const { error: sendError } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',  // Resend's verified sender (free tier)
      to: ['iamviishalkumar@gmail.com'],
      replyTo: email,
      subject: `Portfolio Contact from ${escapedName}`,
      html: `
        <div style="font-family:monospace;max-width:600px;margin:0 auto;padding:32px;background:#0d0d0d;color:#f4f4f5;border-radius:12px;">
          <p style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#e31616;margin:0 0 24px">
            New message from vishalmaurya.dev
          </p>
          <h2 style="font-size:24px;font-weight:900;margin:0 0 24px;letter-spacing:-0.03em;">
            ${escapedName}
          </h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:12px;">
            <tr>
              <td style="padding:8px 12px;background:#1a1a1a;color:#888;width:80px;">From</td>
              <td style="padding:8px 12px;background:#1a1a1a;color:#f4f4f5;">${escapedEmail}</td>
            </tr>
            <tr>
              <td style="padding:8px 12px;background:#111;color:#888;">Reply-to</td>
              <td style="padding:8px 12px;background:#111;color:#a8ff78;">${escapedEmail}</td>
            </tr>
          </table>
          <div style="background:#161616;border-left:3px solid #e31616;padding:20px;border-radius:0 8px 8px 0;font-size:14px;line-height:1.7;color:#d4d4d4;white-space:pre-wrap;">${escapedMessage}</div>
          <p style="margin:24px 0 0;font-size:11px;color:#444;">
            Sent via portfolio contact form · vishalmaurya.dev
          </p>
        </div>
      `,
    });

    if (sendError) {
      console.error('[contact] Resend error:', sendError);
      return NextResponse.json(
        { success: false, message: 'Failed to send email. Please try again.' },
        { status: 500 }
      );
    }

    // ── Auto-reply to visitor ─────────────────────────
    await resend.emails.send({
      from: 'Vishal Maurya <onboarding@resend.dev>',
      to: [email],
      subject: `Got your message, ${escapedName.split(' ')[0]}!`,
      html: `
        <div style="font-family:monospace;max-width:600px;margin:0 auto;padding:32px;background:#0d0d0d;color:#f4f4f5;border-radius:12px;">
          <p style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#e31616;margin:0 0 24px">
            vishalmaurya.dev
          </p>
          <h2 style="font-size:22px;font-weight:900;margin:0 0 12px;letter-spacing:-0.03em;">
            Hey ${escapedName.split(' ')[0]}, message received!
          </h2>
          <p style="color:#888;font-size:14px;line-height:1.7;margin:0 0 24px;">
            Thanks for reaching out. I've received your message and will get back to you as soon as possible — usually within 24–48 hours.
          </p>
          <div style="background:#161616;border-left:3px solid #333;padding:16px 20px;border-radius:0 8px 8px 0;font-size:13px;color:#666;white-space:pre-wrap;">${escapedMessage}</div>
          <p style="margin:24px 0 0;font-size:11px;color:#444;">
            — Vishal Maurya · Backend Engineer
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('[contact route] Unexpected error:', err);
    return NextResponse.json(
      { success: false, message: 'Unexpected error. Please try again.' },
      { status: 500 }
    );
  }
}
