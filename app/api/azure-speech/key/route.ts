import { NextResponse } from 'next/server';

/**
 * API Route to securely provide Azure Speech Key to client
 * This endpoint returns the key for client-side Speech SDK usage
 */

const AZURE_SPEECH_KEY = process.env.AZURE_SPEECH_KEY;

export async function GET() {
  try {
    if (!AZURE_SPEECH_KEY) {
      return NextResponse.json(
        { error: 'Azure Speech key not configured' },
        { status: 500 }
      );
    }

    // Return the key (safe for client-side Speech SDK usage)
    return NextResponse.json({
      key: AZURE_SPEECH_KEY,
    });
  } catch (error) {
    console.error('Azure Speech Key API Error:', error);
    return NextResponse.json(
      { error: 'Failed to get Azure Speech key' },
      { status: 500 }
    );
  }
}

