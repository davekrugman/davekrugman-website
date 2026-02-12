import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, inquiryType, message } = await request.json();

    // Validate required fields
    if (!name || !email || !inquiryType || !message) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      );
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address.' },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: 'Contact Form <contact@davekrugman.com>',
      to: 'dave@davekrugman.com',
      replyTo: email,
      subject: `New Inquiry: ${inquiryType} — ${name}`,
      html: `
        <div style="font-family: monospace; color: #e0e0e0; background: #0a0a0c; padding: 2rem; border: 1px solid #2a2a2e;">
          <h2 style="color: #00ff41; margin-top: 0;">New Contact Form Submission</h2>
          <table style="border-collapse: collapse; width: 100%;">
            <tr>
              <td style="padding: 0.5rem 1rem 0.5rem 0; color: #7a7880; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.1em; vertical-align: top;">Name</td>
              <td style="padding: 0.5rem 0; color: #e0e0e0;">${escapeHtml(name)}</td>
            </tr>
            <tr>
              <td style="padding: 0.5rem 1rem 0.5rem 0; color: #7a7880; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.1em; vertical-align: top;">Email</td>
              <td style="padding: 0.5rem 0; color: #e0e0e0;"><a href="mailto:${escapeHtml(email)}" style="color: #00ff41;">${escapeHtml(email)}</a></td>
            </tr>
            <tr>
              <td style="padding: 0.5rem 1rem 0.5rem 0; color: #7a7880; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.1em; vertical-align: top;">Type</td>
              <td style="padding: 0.5rem 0; color: #e0e0e0;">${escapeHtml(inquiryType)}</td>
            </tr>
            <tr>
              <td style="padding: 0.5rem 1rem 0.5rem 0; color: #7a7880; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.1em; vertical-align: top;">Message</td>
              <td style="padding: 0.5rem 0; color: #e0e0e0; white-space: pre-wrap;">${escapeHtml(message)}</td>
            </tr>
          </table>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
