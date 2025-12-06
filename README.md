# VIANEO Sprint Automator

A React-based web application that guides users through the 13-step VIANEO Innovation Framework, using Claude AI to process raw application materials into structured validation outputs.

## Features

### Core Functionality
- **13-step VIANEO methodology wizard** - Guided process through Foundation, Deep Dive, Synthesis, and Viability phases
- **Claude AI-powered analysis** - Intelligent document processing with context-aware prompts for each step
- **Secure API proxy** - API key stored server-side only, never exposed to the browser

### Document Processing
- **Multi-format file support** - Upload and parse PDF, DOCX, TXT, and Markdown files
- **Drag-and-drop uploads** - Easy file management with visual feedback
- **Content aggregation** - Combine multiple source documents for comprehensive analysis

### Session Management
- **Auto-save to localStorage** - Never lose your work; progress is saved automatically
- **Session export/import** - Save your complete session as JSON and restore it later
- **Unsaved work protection** - Browser warning when leaving with unsaved progress

### Export Options
- **Markdown export** - Individual step outputs or bundled complete sprint
- **HTML export** - Professionally styled documents with print support
- **ZIP bundle** - All outputs packaged with a manifest file for easy distribution

### User Experience
- **Mobile-responsive design** - Full functionality on desktop and mobile devices
- **Real-time processing log** - Monitor API calls and step progress
- **Progress tracking** - Visual sidebar showing completed steps and overall progress
- **Stripe-inspired UI** - Clean, professional interface with WCAG AA compliant colors

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
├── .github/
│   └── workflows/
│       └── node.js.yml              # CI workflow (Node 18, 20, 22)
├── api/
│   └── claude.js                    # Vercel serverless function (API proxy)
├── src/
│   ├── components/
│   │   ├── BranchSelector.jsx       # Organization branch selection
│   │   ├── ErrorBox.jsx             # Error display component
│   │   ├── Header.jsx               # App header with progress
│   │   ├── InputSection.jsx         # File upload and text input
│   │   ├── Navigation.jsx           # Step navigation controls
│   │   ├── OutputDisplay.jsx        # Rendered output with actions
│   │   ├── ProcessButton.jsx        # Step processing trigger
│   │   ├── ProcessingLog.jsx        # Real-time API log
│   │   ├── Sidebar.jsx              # Step list and session controls
│   │   ├── StepHeader.jsx           # Current step info display
│   │   └── index.js                 # Component exports
│   ├── constants/
│   │   ├── colors.js                # Design system colors
│   │   ├── docDesign.js             # Document styling config
│   │   ├── prompts.js               # AI prompts for each step
│   │   ├── steps.js                 # VIANEO framework steps
│   │   ├── storage.js               # localStorage keys
│   │   └── index.js                 # Constants exports
│   ├── hooks/
│   │   ├── useClaudeAPI.js          # API communication hook
│   │   ├── useDebounce.js           # Input debouncing
│   │   ├── useMobileMenu.js         # Mobile navigation state
│   │   ├── useSessionPersistence.js # localStorage management
│   │   └── index.js                 # Hooks exports
│   ├── styles/
│   │   └── appStyles.js             # Application CSS-in-JS
│   ├── utils/
│   │   ├── fileParser.js            # PDF/DOCX/TXT parsing
│   │   ├── htmlTemplate.js          # HTML export template
│   │   ├── markdownToHtml.js        # MD to HTML conversion
│   │   └── index.js                 # Utils exports
│   ├── App.jsx                      # Main application component
│   └── main.jsx                     # React entry point
├── public/                          # Static assets
├── .env.example                     # Environment variables template
├── eslint.config.js                 # ESLint configuration
├── package.json                     # Dependencies and scripts
├── vercel.json                      # Vercel configuration
└── vite.config.js                   # Vite build configuration
```

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
         ▼                      │
   No secrets exposed           │
   to browser                   ▼
                        Secure API proxy
```

### Key Dependencies

| Package | Purpose |
|---------|---------|
| `react` 19.x | UI framework |
| `vite` 7.x | Build tool and dev server |
| `pdfjs-dist` | PDF file parsing |
| `mammoth` | DOCX file parsing |
| `marked` | Markdown to HTML conversion |
| `jszip` | ZIP bundle creation |

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |
| `npm test` | Run tests |

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ANTHROPIC_API_KEY` | Yes | - | Your Anthropic API key |
| `CLAUDE_MODEL` | No | `claude-sonnet-4-20250514` | Claude model to use |
| `CLAUDE_MAX_TOKENS` | No | `8000` | Maximum response tokens |

## VIANEO Framework Steps

### Foundation Phase
| Step | Name | Description |
|------|------|-------------|
| 0 | Executive Brief | Extract structured brief from raw materials |
| 1 | Application Forms | Generate program-specific documentation |
| 2 | 40Q Diagnostic | 4-dimension rapid assessment (Team, Tech, Mgmt, Commercial) |
| 3 | 29Q Market Maturity | 5-dimension VIANEO scoring with weighted thresholds |

### Deep Dive Phase
| Step | Name | Description |
|------|------|-------------|
| 4 | Legitimacy Worksheet | Problem validation and means inventory |
| 5 | Needs & Requesters | WHO/WHAT/WHY/HOW analysis (4-file output) |
| 6 | Persona Development | Evidence-based personas from requesters |
| 7 | Needs Qualification | Interactive matrix & priority zones |
| 8 | Players & Influencers | Ecosystem acceptability mapping |
| 9 | Value Network Map | Network visualization & value flows |

### Synthesis Phase
| Step | Name | Description |
|------|------|-------------|
| 10 | Diagnostic Comment | Executive decision brief |
| 11 | Features-Needs Matrix | MVP scope analysis with entity validation |

### Viability Phase
| Step | Name | Description |
|------|------|-------------|
| 12 | Viability Assessment | Gate recommendation & dashboard |

## Usage Tips

1. **Start with Step 0** - Upload all your source materials (pitch decks, business plans, applications) to generate an Executive Brief
2. **Select your organization branch** - In Step 1, choose the appropriate program track for tailored application forms
3. **Review each output** - Use the copy, download (MD/HTML), or proceed to the next step
4. **Export your session** - Save your work as JSON to continue later or share with teammates
5. **Download complete bundle** - When finished, export all outputs as a ZIP with manifest

## Contributing

Contributions are welcome! Please ensure all code passes linting (`npm run lint`) and builds successfully (`npm run build`) before submitting a pull request.

## License

BSD 2-Clause License - see [LICENSE](LICENSE) for details.
