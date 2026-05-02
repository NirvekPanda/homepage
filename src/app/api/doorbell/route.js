import { NextResponse } from 'next/server';

/**
 * Doorbell proxy endpoint.
 * Accepts POSTs from the Discord interactions handler and the admin page button.
 * Forwards a formatted message to the Discord webhook.
 *
 * Body (all optional): { message?: string; source?: string }
 */

const WEBHOOK_URL = process.env.DOORBELL_WEBHOOK_URL;

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

  const source = body.source ?? 'unknown';
  const customMessage = body.message;
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
  const timestamp = new Date().toISOString();

  const content = customMessage
    ? `🔔 ${customMessage}`
    : '🔔 Someone rang the doorbell';

  const discordPayload = {
    content,
    embeds: [
      {
        fields: [
          { name: 'Source', value: source, inline: true },
          { name: 'Time', value: timestamp, inline: true },
          { name: 'IP', value: ip, inline: true },
        ],
      },
    ],
  };

  const res = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(discordPayload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('Discord webhook failed:', res.status, text);
    return NextResponse.json(
      { error: 'Failed to forward to Discord' },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
