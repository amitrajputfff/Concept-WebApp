import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route for Azure Speech Service
 * Returns configuration for client-side Speech SDK usage
 */

const AZURE_SPEECH_KEY = process.env.AZURE_SPEECH_KEY;
const AZURE_SPEECH_REGION = process.env.AZURE_SPEECH_REGION || 'eastus';

export async function GET(request: NextRequest) {
  try {
    // Validate environment variables
    if (!AZURE_SPEECH_KEY) {
      return NextResponse.json(
        { 
          error: 'Azure Speech credentials not configured. Please check .env.local file.',
          configured: false
        },
        { status: 500 }
      );
    }

    // Return configuration (key is safe to expose to client for Speech SDK)
    return NextResponse.json({
      configured: true,
      region: AZURE_SPEECH_REGION,
      language: 'en-US', // English only
      voiceName: 'en-US-JennyNeural', // Best quality English voice - professional, natural, clear
      // Note: The subscription key will be used client-side by the Speech SDK
      // This is safe as Speech SDK keys are designed for client-side use
    });
  } catch (error) {
    console.error('Azure Speech API Error:', error);
    return NextResponse.json(
      { error: 'Failed to get Azure Speech configuration', configured: false },
      { status: 500 }
    );
  }
}

