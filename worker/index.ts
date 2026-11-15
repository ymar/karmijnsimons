/**
 * Cloudflare Worker for karmijnsimons.com.
 * Static pages are served from ./dist by the assets binding; this script only
 * handles the contact form at POST /api/contact and emails it to Karmijn.
 */

interface EmailAddress {
  email: string;
  name?: string;
}
interface SendEmail {
  send(message: {
    to: string | EmailAddress;
    from: string | EmailAddress;
    subject: string;
    text?: string;
    html?: string;
    replyTo?: string | EmailAddress;
  }): Promise<{ messageId: string }>;
}
interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  EMAIL: SendEmail;
}

// Must be a verified destination address on the Cloudflare account (Email Service > Destination addresses).
const TO = 'hi@karmijnsimons.com';
// Sent from ymar.nl, the domain onboarded for Cloudflare Email Sending.
const FROM = { email: 'website@ymar.nl', name: 'karmijnsimons.com' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

const clean = (v: FormDataEntryValue | null, max: number) =>
  typeof v === 'string' ? v.trim().slice(0, max) : '';

async function handleContact(request: Request, env: Env): Promise<Response> {
  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return json({ ok: false, error: 'Invalid form data' }, 400);
  }

  // Honeypot: real visitors never see or fill this field. Pretend it worked.
  if (clean(data.get('_gotcha'), 200)) return json({ ok: true });

  const name = clean(data.get('name'), 200);
  const email = clean(data.get('email'), 320);
  const message = clean(data.get('message'), 10_000);

  if (!message) return json({ ok: false, error: 'Message is required' }, 400);
  if (email && !EMAIL_RE.test(email)) return json({ ok: false, error: 'Invalid email address' }, 400);

  const subject = `Website enquiry${name ? ` from ${name}` : ''}`.replace(/[\r\n]+/g, ' ');
  const text = [
    message,
    '',
    '---',
    `Name: ${name || '(not given)'}`,
    `Email: ${email || '(not given)'}`,
    '',
    'Sent from the contact form on karmijnsimons.com',
  ].join('\n');

  try {
    const result = await env.EMAIL.send({
      to: TO,
      from: FROM,
      subject,
      text,
      ...(email ? { replyTo: name ? { email, name } : email } : {}),
    });
    console.log('Contact form sent:', result?.messageId);
    return json({ ok: true });
  } catch (err) {
    const e = err as { code?: string; message?: string };
    console.error('Contact form send failed:', e.code, e.message);
    return json({ ok: false, error: 'Could not send message' }, 502);
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/api/contact') {
      if (request.method !== 'POST') return json({ ok: false, error: 'Method not allowed' }, 405);
      return handleContact(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};
