import { NextResponse } from 'next/server';
import { verifyKey, InteractionType, InteractionResponseType } from 'discord-interactions';

/**
 * Discord Interactions endpoint.
 * Handles PING handshake + /doorbell slash command.
 */

const PUBLIC_KEY = process.env.DISCORD_PUBLIC_KEY;

export async function POST(req) {
  if (!PUBLIC_KEY) {
    return new NextResponse('DISCORD_PUBLIC_KEY not configured', {
      status: 500,
    });
  }

  const signature = req.headers.get('x-signature-ed25519');
  const timestamp = req.headers.get('x-signature-timestamp');
  const rawBody = await req.text();

  if (!signature || !timestamp) {
    return new NextResponse('Missing signature headers', { status: 401 });
  }

  let isValid;
  try {
    isValid = await verifyKey(rawBody, signature, timestamp, PUBLIC_KEY);
  } catch {
    return new NextResponse('Invalid request signature', { status: 401 });
  }
  if (!isValid) {
    return new NextResponse('Invalid request signature', { status: 401 });
  }

  const interaction = JSON.parse(rawBody);

  if (interaction.type === InteractionType.PING) {
    return NextResponse.json({ type: InteractionResponseType.PONG });
  }

  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    if (interaction.data?.name === 'doorbell') {
      const userName =
        interaction.member?.user?.username ??
        interaction.user?.username ??
        'someone';

      const host =
        process.env.NEXT_PUBLIC_SITE_URL ??
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);

      if (!host) {
        console.error('Neither NEXT_PUBLIC_SITE_URL nor VERCEL_URL is set; cannot forward doorbell');
        return NextResponse.json({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: '🔔 Doorbell rung!',
            flags: 64,
          },
        });
      }

      const userMessage = interaction.data.options?.[0]?.value?.trim();
      const payload = {
        name: `discord:${userName}`,
      };
      if (userMessage) {
        payload.message = userMessage;
      }

      // Fire-and-forget — Discord requires a response within 3 seconds.
      fetch(`${host}/api/doorbell`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch((err) => console.error('Doorbell forward failed:', err));

      return NextResponse.json({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: '🔔 Doorbell rung!',
          flags: 64, // EPHEMERAL
        },
      });
    }
  }

  return new NextResponse('Unknown interaction', { status: 400 });
}
