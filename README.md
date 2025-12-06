# VIANEO Sprint Automator

A React-based web application that guides users through the 13-step VIANEO Innovation Framework, using Claude AI to process raw application materials into structured validation outputs.

## Features

- 13-step VIANEO methodology wizard
- Claude AI-powered document analysis
- Secure API proxy (API key never exposed to client)
- Professional output formatting
- Export individual or bundled Markdown outputs
- Stripe-inspired UI with WCAG AA compliant colors

## Quick Start

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Anthropic API key ([get one here](https://console.anthropic.com/))

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/therealchandlerbing/360-sprint-automator.git
   cd 360-sprint-automator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env.local
   ```

4. Add your Anthropic API key to `.env.local`:
   ```
   ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:5173](http://localhost:5173)

## Vercel Deployment

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/therealchandlerbing/360-sprint-automator)

### Manual Deployment

1. Push your code to GitHub

2. Import project in [Vercel Dashboard](https://vercel.com/new)

3. **Important:** Add environment variable in Vercel:
   - Go to Project Settings > Environment Variables
   - Add `ANTHROPIC_API_KEY` with your API key
   - Select all environments (Production, Preview, Development)

4. Deploy!

## Project Structure

```
360-sprint-automator/
├── api/
│   └── claude.js          # Vercel serverless function (API proxy)
├── src/
│   ├── App.jsx            # Main application component
│   └── main.jsx           # React entry point
├── vercel.json            # Vercel configuration
├── .env.example           # Environment variables template
└── package.json           # Dependencies
```

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  React Frontend │────▶│  /api/claude    │────▶│  Anthropic API  │
│  (Client-side)  │     │  (Serverless)   │     │  (Claude)       │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                      │
         │                      │ API key stored
         │                      │ server-side only
         ▼                      │
   No secrets exposed           │
   to browser                   ▼
                        Secure API proxy
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Your Anthropic API key |

## VIANEO Framework Steps

| Step | Name | Phase |
|------|------|-------|
| 0 | Executive Brief | Foundation |
| 1 | Application Forms | Foundation |
| 2 | 40Q Diagnostic | Foundation |
| 3 | 29Q Market Maturity | Foundation |
| 4 | Legitimacy Worksheet | Deep Dive |
| 5 | Needs & Requesters | Deep Dive |
| 6 | Persona Development | Deep Dive |
| 7 | Needs Qualification | Deep Dive |
| 8 | Players & Influencers | Deep Dive |
| 9 | Value Network Map | Deep Dive |
| 10 | Diagnostic Comment | Synthesis |
| 11 | Features-Needs Matrix | Synthesis |
| 12 | Viability Assessment | Viability |

## License

BSD 2-Clause License - see [LICENSE](LICENSE) for details.
