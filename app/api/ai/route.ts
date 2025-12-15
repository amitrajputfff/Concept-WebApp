import { NextRequest, NextResponse } from 'next/server';

const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const AZURE_OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY;
const AZURE_OPENAI_DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT;
const AZURE_OPENAI_API_VERSION = process.env.AZURE_OPENAI_API_VERSION || '2024-02-15-preview';

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    if (!AZURE_OPENAI_ENDPOINT || !AZURE_OPENAI_API_KEY || !AZURE_OPENAI_DEPLOYMENT) {
      return NextResponse.json(
        { error: 'Azure OpenAI credentials not configured. Please check .env.local file.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { prompt, type = 'general' } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Construct the Azure OpenAI endpoint URL
    const url = `${AZURE_OPENAI_ENDPOINT}/openai/deployments/${AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=${AZURE_OPENAI_API_VERSION}`;

    // Call Azure OpenAI
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': AZURE_OPENAI_API_KEY,
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: getSystemPrompt(type),
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Azure OpenAI Error:', errorData);
      return NextResponse.json(
        { error: 'Failed to generate AI response', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || 'AI response unavailable.';

    return NextResponse.json({ content });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function getSystemPrompt(type: string): string {
  switch (type) {
    case 'risk_memo':
      return `You are a senior credit underwriter at Propel Capital. Generate concise, professional risk assessment memos. Use bullet points, be direct, and always end with a clear recommendation (Approve/Decline/Review).`;
    
    case 'chat_helper':
      return `You are Clara, an empathetic CFO agent for Propel Capital. Your role is to help small business owners understand lending terms in a friendly, reassuring way. Keep responses to 1-2 sentences. Emphasize flexibility and partnership, not pressure.`;
    
    default:
      return `You are an AI assistant for Propel Capital, a proactive lending platform. Be helpful, professional, and concise.`;
  }
}

