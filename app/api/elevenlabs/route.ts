import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route for ElevenLabs Text-to-Speech
 * Handles server-side TTS requests to keep API key secure
 */

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'ZIlrSGI4jZqobxRKprJz'; // English voice

export async function POST(request: NextRequest) {
  try {
    if (!ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured' },
        { status: 500 }
      );
    }

    const { text, voiceId } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Use provided voiceId or default
    const voice = voiceId || ELEVENLABS_VOICE_ID;

    // Call ElevenLabs API
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_turbo_v2_5', // Latest model - works on free tier, voice determines language
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        voiceId: voice,
        hasApiKey: !!ELEVENLABS_API_KEY
      });
      return NextResponse.json(
        { error: 'Failed to generate speech', details: errorText, status: response.status },
        { status: response.status }
      );
    }

    // Get audio as ArrayBuffer
    const audioBuffer = await response.arrayBuffer();

    // Return audio as base64 or binary
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error('ElevenLabs TTS Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate speech', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    configured: !!ELEVENLABS_API_KEY,
    voiceId: ELEVENLABS_VOICE_ID,
    hasApiKey: !!ELEVENLABS_API_KEY,
    apiKeyLength: ELEVENLABS_API_KEY ? ELEVENLABS_API_KEY.length : 0,
  });
}

