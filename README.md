# Diffusion from Scratch

Learn to build Mercury-style diffusion language models from the ground up.

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## AI Code Generator

This project includes an **AI-powered Code Generator** that generates PyTorch code using GPT-4.

### Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Get your OpenAI API key from [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

3. Add your API key to `.env.local`:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Visit `/generate` to use the Code Generator

### Vercel Deployment

1. Push to GitHub
2. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
3. Add `OPENAI_API_KEY` with your API key
4. Redeploy

## Course Content

- **Module 1**: Transformer Foundations
- **Module 2**: Discrete Diffusion Theory
- **Module 3**: Masked Diffusion LM (MDLM)
- **Module 4**: Sampling Strategies
- **Module 5**: Scaling & Training
- **Module 6**: Conditioning & Guidance
- **Module 7**: Mercury Architecture
- **Module 8**: Evaluation

## Tech Stack

- Next.js 16 (App Router)
- Tailwind CSS
- TypeScript
- OpenAI GPT-4 (Code Generator)
- PyTorch (in lessons)

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Add `OPENAI_API_KEY` environment variable in Vercel settings
5. Deploy!

## License

MIT
