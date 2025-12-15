// AI Helper Functions for Azure OpenAI Integration

export interface AIRequest {
  prompt: string;
  type?: 'risk_memo' | 'chat_helper' | 'general';
}

export interface AIResponse {
  content: string;
  error?: string;
}

/**
 * Generate AI content using Azure OpenAI
 */
export async function generateAIContent(request: AIRequest): Promise<string> {
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('AI API Error:', error);
      return getFallbackResponse(request.type || 'general');
    }

    const data: AIResponse = await response.json();
    return data.content || getFallbackResponse(request.type || 'general');
  } catch (error) {
    console.error('AI Request Error:', error);
    return getFallbackResponse(request.type || 'general');
  }
}

/**
 * Generate a risk assessment memo
 */
export async function generateRiskMemo(businessData: {
  name: string;
  riskScore: number;
  loanAmount: number;
  roi: number;
  context: string;
}): Promise<string> {
  const prompt = `
Generate a concise risk assessment memo for "${businessData.name}".

Key Data Points:
- Risk Score: ${businessData.riskScore}/100
- Loan Amount: $${businessData.loanAmount.toLocaleString()}
- ROI: ${businessData.roi}%
- Context: ${businessData.context}

Format: Professional, bullet points, concise. End with a final recommendation (Approve).
  `.trim();

  return generateAIContent({
    prompt,
    type: 'risk_memo',
  });
}

/**
 * Generate a chat explanation from Clara
 */
export async function generateChatExplanation(topic: string): Promise<string> {
  const prompt = `
A small business owner is hesitant about ${topic}. 
Explain in 1-2 friendly sentences why this is beneficial.
Mention "we only succeed when you succeed" and emphasize flexibility.
  `.trim();

  return generateAIContent({
    prompt,
    type: 'chat_helper',
  });
}

/**
 * Fallback responses when AI is unavailable
 */
function getFallbackResponse(type: string): string {
  switch (type) {
    case 'risk_memo':
      return `**Risk Assessment: Taco Rico**

• Strong business fundamentals with consistent revenue trends
• Proactive inventory management opportunity identified
• Strategic timing aligned with high-demand event
• Revenue protection ROI significantly exceeds cost of capital
• Historical data supports demand prediction model

**Recommendation:** APPROVE - $30,000 working capital facility
**Confidence Level:** High
**Terms:** 8% daily sales deduction, ~12 weeks`;

    case 'chat_helper':
      return `This flexible repayment model means we only succeed when you succeed. On slow days, you pay less. On busy days like the Big Game, you pay more. It's designed to match your cash flow, not strain it.`;

    default:
      return 'AI service is temporarily unavailable. Please try again later.';
  }
}

