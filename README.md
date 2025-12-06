# VIANEO Sprint Automator

> AI-powered web application for the 13-step VIANEO Innovation Framework | Claude AI Integration | Secure API Proxy

![status](https://img.shields.io/badge/status-production--ready-brightgreen)
![react](https://img.shields.io/badge/react-19.x-blue)
![vite](https://img.shields.io/badge/vite-7.x-purple)
![license](https://img.shields.io/badge/license-BSD--2--Clause-orange)

## Repository Status

**PRODUCTION READY** - Full 13-step VIANEO methodology wizard with Claude AI integration, secure serverless API proxy, and comprehensive export options.

---

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Configuration](#configuration)
- [VIANEO Framework](#vianeo-framework)
- [Usage Guide](#usage-guide)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Core Capabilities

| Feature | Description |
|---------|-------------|
| **13-Step Wizard** | Guided process through Foundation, Deep Dive, Synthesis, and Viability phases |
| **Claude AI Analysis** | Intelligent document processing with context-aware prompts |
| **Secure API Proxy** | API key stored server-side only, never exposed to browser |

### Document Processing

| Feature | Description |
|---------|-------------|
| **Multi-format Support** | PDF, DOCX, TXT, and Markdown file parsing |
| **Drag-and-drop** | Easy file management with visual feedback |
| **Content Aggregation** | Combine multiple source documents |

### Session & Export

| Feature | Description |
|---------|-------------|
| **Auto-save** | Progress saved automatically to localStorage |
| **Session Import/Export** | Save and restore complete sessions as JSON |
| **Multiple Export Formats** | Markdown, HTML, or ZIP bundle with manifest |

### User Experience

| Feature | Description |
|---------|-------------|
| **Mobile Responsive** | Full functionality on all devices |
| **Real-time Logging** | Monitor API calls and step progress |
| **Progress Tracking** | Visual sidebar with completion status |

---

## Quick Start

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- [Anthropic API key](https://console.anthropic.com/)

### Installation

```bash
# Clone repository
git clone https://github.com/therealchandlerbing/360-sprint-automator.git
cd 360-sprint-automator

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Add your ANTHROPIC_API_KEY to .env.local

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/therealchandlerbing/360-sprint-automator)

**Setup Steps:**
1. Click deploy button or import project in [Vercel Dashboard](https://vercel.com/new)
2. Add environment variable: `ANTHROPIC_API_KEY`
3. Select all environments (Production, Preview, Development)
4. Deploy

---

## Project Structure

```
360-sprint-automator/
├── api/
│   └── claude.js              # Vercel serverless API proxy
├── src/
│   ├── components/            # React UI components
│   │   ├── BranchSelector.jsx
│   │   ├── ErrorBox.jsx
│   │   ├── Header.jsx
│   │   ├── InputSection.jsx
│   │   ├── Navigation.jsx
│   │   ├── OutputDisplay.jsx
│   │   ├── ProcessButton.jsx
│   │   ├── ProcessingLog.jsx
│   │   ├── Sidebar.jsx
│   │   └── StepHeader.jsx
│   ├── constants/             # Configuration & prompts
│   │   ├── colors.js          # Design system
│   │   ├── docDesign.js       # Document styling
│   │   ├── prompts.js         # AI prompts per step
│   │   ├── steps.js           # Framework step definitions
│   │   └── storage.js         # localStorage keys
│   ├── hooks/                 # Custom React hooks
│   │   ├── useClaudeAPI.js    # API communication
│   │   ├── useDebounce.js     # Input debouncing
│   │   ├── useMobileMenu.js   # Mobile navigation
│   │   └── useSessionPersistence.js
│   ├── styles/
│   │   └── appStyles.js       # CSS-in-JS styles
│   ├── utils/                 # Helper functions
│   │   ├── fileParser.js      # PDF/DOCX/TXT parsing
│   │   ├── htmlTemplate.js    # HTML export template
│   │   └── markdownToHtml.js  # MD to HTML conversion
│   ├── App.jsx                # Main application
│   └── main.jsx               # Entry point
├── .github/workflows/         # CI configuration
├── public/                    # Static assets
└── [config files]             # Vite, ESLint, Vercel configs
```

---

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  React Frontend │────▶│  /api/claude    │────▶│  Anthropic API  │
│  (Vite + React) │     │  (Serverless)   │     │  (Claude)       │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                      │
         │                      │ API key stored
         │                      │ server-side only
         ▼                      ▼
   No secrets in browser    Secure proxy
```

### Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | 19.x | UI framework |
| vite | 7.x | Build tool |
| pdfjs-dist | 5.x | PDF parsing |
| mammoth | 1.x | DOCX parsing |
| marked | 17.x | Markdown conversion |
| jszip | 3.x | ZIP creation |

---

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|:--------:|---------|-------------|
| `ANTHROPIC_API_KEY` | Yes | - | Your Anthropic API key |
| `CLAUDE_MODEL` | No | `claude-sonnet-4-20250514` | Claude model ID |
| `CLAUDE_MAX_TOKENS` | No | `8000` | Max response tokens |

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

---

## VIANEO Framework

### Foundation Phase (Steps 0-3)

| Step | Name | Output |
|:----:|------|--------|
| 0 | Executive Brief | Structured brief from raw materials |
| 1 | Application Forms | Program-specific documentation |
| 2 | 40Q Diagnostic | 4-dimension rapid assessment |
| 3 | 29Q Market Maturity | 5-dimension VIANEO scoring |

### Deep Dive Phase (Steps 4-9)

| Step | Name | Output |
|:----:|------|--------|
| 4 | Legitimacy Worksheet | Problem validation & means inventory |
| 5 | Needs & Requesters | WHO/WHAT/WHY/HOW analysis |
| 6 | Persona Development | Evidence-based personas |
| 7 | Needs Qualification | Interactive matrix & priorities |
| 8 | Players & Influencers | Ecosystem mapping |
| 9 | Value Network Map | Network visualization |

### Synthesis Phase (Steps 10-11)

| Step | Name | Output |
|:----:|------|--------|
| 10 | Diagnostic Comment | Executive decision brief |
| 11 | Features-Needs Matrix | MVP scope analysis |

### Viability Phase (Step 12)

| Step | Name | Output |
|:----:|------|--------|
| 12 | Viability Assessment | Gate recommendation & dashboard |

---

## Usage Guide

1. **Start with Step 0** - Upload source materials (pitch decks, business plans) to generate Executive Brief
2. **Select organization branch** - In Step 1, choose the appropriate program track
3. **Review each output** - Copy, download (MD/HTML), or proceed to next step
4. **Export session** - Save as JSON to continue later or share
5. **Download bundle** - Export all outputs as ZIP with manifest

---

## Contributing

Contributions welcome! Please ensure:

- Code passes linting: `npm run lint`
- Build succeeds: `npm run build`

---

## License

BSD 2-Clause License - see [LICENSE](LICENSE) for details.
