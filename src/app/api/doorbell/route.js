import { NextResponse } from 'next/server';

/**
 * Doorbell proxy endpoint.
 * Accepts POSTs from the bell widget.
 * Forwards a formatted message to the Discord webhook.
 *
 * Body: { name: string; message?: string; source?: string }
 */

const WEBHOOK_URL = process.env.DOORBELL_WEBHOOK_URL;

function formatTimestamp(date) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const dayName = days[date.getUTCDay()];
  const month = months[date.getUTCMonth()];
  const day = date.getUTCDate();

  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12 || 12;
  const minuteStr = minutes === 0 ? '' : `:${String(minutes).padStart(2, '0')}`;

  return `${dayName}, ${month} ${day}, ${hours}${minuteStr}${ampm}`;
}

export async function POST(req) {
  if (!WEBHOOK_URL) {
    return NextResponse.json(
      { error: 'DOORBELL_WEBHOOK_URL not configured' },
      { status: 500 },
    );
  }

  let body = {};
  try {
    body = await req.json();
  } catch {
    // empty/invalid body is fine — defaults below
  }

  const name = body.name?.trim();
  const text = body.message?.trim();

  if (!name) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }

  const timestamp = formatTimestamp(new Date());
  const content = text
    ? `${timestamp}\n${name}: ${text}`
    : `${timestamp}\n${name} is at the door!`;

  const discordPayload = { content };

  const res = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(discordPayload),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    console.error('Discord webhook failed:', res.status, errText);
    return NextResponse.json(
      { error: 'Failed to forward to Discord' },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
