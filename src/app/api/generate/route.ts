import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are an expert PyTorch code generator specializing in diffusion language models and transformers.

Generate clean, well-documented PyTorch code for:
- Transformer architectures
- Diffusion models (masked, discrete)
- Attention mechanisms
- Training loops
- Sampling strategies

Format guidelines:
- Use Python with type hints where helpful
- Include docstrings for functions
- Keep code concise but readable
- Use standard PyTorch imports
- Follow PEP 8 style

Only output the code - no markdown code blocks, no explanations.`;

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured. Set OPENAI_API_KEY environment variable.' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to generate code. Please try again.' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const generatedCode = data.choices?.[0]?.message?.content?.trim();

    if (!generatedCode) {
      return NextResponse.json(
        { error: 'No code generated. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ code: generatedCode });

  } catch (error) {
    console.error('Code generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
