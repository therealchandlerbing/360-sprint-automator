# 360 Sprint Automator

> AI-powered business validation platform implementing the VIANEO Innovation Framework | Claude AI | React 19 | Vercel Serverless

![status](https://img.shields.io/badge/status-production--ready-brightgreen)
![react](https://img.shields.io/badge/react-19.x-blue)
![vite](https://img.shields.io/badge/vite-7.x-purple)
![license](https://img.shields.io/badge/license-BSD--2--Clause-orange)

---

## Table of Contents

1. [Introduction](#introduction)
2. [The VIANEO Framework](#the-vianeo-framework)
   - [The 5 Dimensions](#the-5-dimensions)
   - [The 13 Steps](#the-13-steps)
   - [Gate Recommendations](#gate-recommendations)
3. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Deployment](#deployment)
4. [Tutorial: Step-by-Step Mode](#tutorial-step-by-step-mode)
5. [Tutorial: Express Mode](#tutorial-express-mode)
6. [Input Documents](#input-documents)
7. [Output Formats](#output-formats)
8. [Architecture](#architecture)
9. [Project Structure](#project-structure)
10. [Configuration](#configuration)
11. [Contributing](#contributing)
12. [License](#license)

---

## Introduction

The **360 Sprint Automator** transforms raw business materials (pitch decks, business plans, interview notes) into comprehensive innovation assessments using the VIANEO Framework. Powered by Claude AI, it automates the evaluation process that traditionally takes days or weeks of expert analysis.

### What It Does

1. **Ingests** your business documents (PDF, DOCX, TXT, Markdown)
2. **Analyzes** using AI against the structured VIANEO methodology
3. **Generates** professional reports with scores, recommendations, and actionable roadmaps

### Two Operating Modes

| Mode | Best For | Time | Output |
|------|----------|------|--------|
| **Step-by-Step** | Learning, collaboration, deep analysis | 45-60 min | 13 individual markdown files |
| **Express** | Board presentations, investment committees | 15-20 min | Professional DOCX report (20-25 pages) |

---

## The VIANEO Framework

The VIANEO Framework is a structured methodology for validating innovation projects across five weighted dimensions. It answers the fundamental question: *Should we invest resources in this venture?*

### The 5 Dimensions

Each dimension is scored on a 1-5 scale with specific thresholds that must be met:

```
┌─────────────────────────────────────────────────────────────────────┐
│                        VIANEO SCORING MODEL                         │
├─────────────────┬────────┬───────────┬─────────────────────────────┤
│ Dimension       │ Weight │ Threshold │ Key Question                │
├─────────────────┼────────┼───────────┼─────────────────────────────┤
│ Legitimacy      │  15%   │   ≥3.0    │ Is the problem real?        │
│ Desirability    │  25%   │   ≥3.5    │ Do people want YOUR fix?    │
│ Acceptability   │  20%   │   ≥3.0    │ Will the ecosystem help?    │
│ Feasibility     │  20%   │   ≥3.0    │ Can you actually deliver?   │
│ Viability       │  20%   │   ≥3.0    │ Is the model sustainable?   │
├─────────────────┼────────┼───────────┼─────────────────────────────┤
│ OVERALL         │ 100%   │   ≥3.2    │ Weighted average            │
└─────────────────┴────────┴───────────┴─────────────────────────────┘
```

**Note:** Desirability has the highest bar (≥3.5) because without genuine market demand, no amount of technical excellence matters.

### The 13 Steps

The framework is organized into four phases:

#### Phase 1: Foundation (Steps 0-3)

| Step | Name | Purpose |
|:----:|------|---------|
| 0 | **Executive Brief** | Extract structured information from raw materials into a standardized format covering company overview (B1-B7), maturity stage, and TRL level |
| 1 | **Application Forms** | Generate program-specific documentation based on organization branch (e.g., accelerator, incubator, grant program) |
| 2 | **40Q Diagnostic** | Rapid 4-dimension assessment scoring Team (9Q), Technology (11Q), Management (12Q), and Commercial (8Q) |
| 3 | **29Q Market Maturity** | Deep-dive into all 5 VIANEO dimensions with weighted threshold scoring |

#### Phase 2: Deep Dive (Steps 4-9)

| Step | Name | Purpose |
|:----:|------|---------|
| 4 | **Legitimacy Worksheet** | Validate the problem exists and inventory available means (human, physical/IP, financial resources) |
| 5 | **Needs & Requesters** | Identify WHO has the problem, WHAT they need, WHY it matters, HOW they currently cope |
| 6 | **Persona Development** | Create evidence-based user personas from validated requesters |
| 7 | **Needs Qualification** | Build priority matrix classifying needs into Tier 1/2/3 opportunities |
| 8 | **Players & Influencers** | Map ecosystem actors (customers, competitors, partners, regulators) and their acceptability |
| 9 | **Value Network Map** | Visualize the 5-column value flow from enablers through channels to end users |

#### Phase 3: Synthesis (Steps 10-11)

| Step | Name | Purpose |
|:----:|------|---------|
| 10 | **Diagnostic Comment** | Executive synthesis consolidating all findings into strengths, risks, and recommendations |
| 11 | **Features-Needs Matrix** | Analyze product features against needs to define MVP scope and roadmap |

#### Phase 4: Viability (Step 12)

| Step | Name | Purpose |
|:----:|------|---------|
| 12 | **Viability Assessment** | Final gate recommendation with 90-day roadmap, KPIs, and investment readiness score |

### Gate Recommendations

Based on the weighted overall score, the framework produces one of four recommendations:

| Score Range | Recommendation | Meaning |
|:-----------:|:--------------:|---------|
| **≥90** | GO | Strong pass - proceed with investment |
| **75-89** | CONDITIONAL GO | Proceed with specific conditions to address |
| **60-74** | HOLD | Significant gaps - needs more work before proceeding |
| **<60** | NO GO | Decline - fundamental issues prevent success |

---

## Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Anthropic API key** from [console.anthropic.com](https://console.anthropic.com/)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/therealchandlerbing/360-sprint-automator.git
cd 360-sprint-automator

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY

# 4. Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Deployment

#### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/therealchandlerbing/360-sprint-automator)

1. Click the deploy button or import project in [Vercel Dashboard](https://vercel.com/new)
2. Add environment variable: `ANTHROPIC_API_KEY`
3. Select all environments (Production, Preview, Development)
4. Deploy

The serverless function at `/api/claude` handles all API calls, keeping your API key secure on the server side.

---

## Tutorial: Step-by-Step Mode

Step-by-Step mode gives you full control over the assessment process, allowing review and refinement between each step. This is ideal for learning the framework, collaboration, and deep analysis.

### Step 1: Prepare Your Materials

Gather your source documents:
- Pitch deck (PDF or DOCX)
- Business plan
- Interview transcripts
- Market research
- Any supporting materials

### Step 2: Upload and Configure

1. **Open the application** at your deployed URL or `localhost:5173`
2. **Enter a project name** (e.g., "Acme Widget Co")
3. **Upload files** by dragging and dropping onto the upload zone, or click to browse
   - Supported formats: PDF, DOCX, TXT, MD
   - Multiple files are combined automatically
4. **Or paste content** directly into the text area

### Step 3: Choose Step-by-Step Mode

After providing content, you'll see the **Assessment Approach** selector:
- Select **"Step-by-Step Framework Analysis"**
- Click **"Process Step 0: Executive Brief"**

### Step 4: Work Through Each Step

For each of the 13 steps:

1. **Review the AI output** displayed in the main panel
2. **Copy, download, or refine** using the action buttons:
   - Copy to clipboard
   - Download as Markdown (.md)
   - Download as HTML
3. **Navigate forward** when satisfied using the "Next" button
4. **Branch selection** (Step 1 only): Choose your organization type

The sidebar shows your progress with checkmarks for completed steps.

### Step 5: Export Your Work

When finished:
- **Download All (MD)**: Single markdown file with all outputs
- **Download All (HTML)**: Styled HTML document
- **Download ZIP**: Bundle with manifest.json
- **Export Session**: Save as JSON to resume later

### Tips for Step-by-Step Mode

- **Review critically**: The AI extracts information but can't validate claims. Mark items as `[ASSUMED]` vs `[VALIDATED]`
- **Iterate**: You can re-process any step with refined inputs
- **Save progress**: Sessions auto-save to localStorage, but export regularly
- **Use later steps**: Steps 10-12 aggregate all prior outputs for synthesis

---

## Tutorial: Express Mode

Express Mode generates a comprehensive 360 Business Validation Report in a single execution. This produces a professional DOCX document suitable for board presentations and investment committees.

### Step 1: Prepare Your Materials

Same as Step-by-Step mode - gather all relevant business documents.

### Step 2: Upload and Configure

1. **Enter project name**
2. **Upload or paste** your source materials

### Step 3: Choose Express Mode

After providing content:
- Select **"Express Assessment Report"**
- Click **"Generate 360 Business Validation Report"**

### Step 4: Wait for Processing

The assessment takes 15-20 minutes. You'll see a progress indicator showing:
- Current phase (Foundation → Deep Dive → Synthesis → Viability)
- Progress percentage
- Current operation

**Do not close the browser** during processing.

### Step 5: Download Your Report

When complete, you'll see the **Express Completion** screen:

1. **Download DOCX Report** (Primary output)
   - 20-25 page professional document
   - Includes all assessments, scores, and recommendations
   - Ready for board presentation

2. **Generate Dashboard** (Optional)
   - Interactive HTML dashboard
   - Visual charts (diagnostic bar chart, VIANEO radar)
   - Download for offline viewing

### What's in the Express Report?

The DOCX report includes:

| Section | Content |
|---------|---------|
| Cover Page | Project name, recommendation badge, investment readiness score |
| Executive Summary | Gate decision, confidence level, key strengths, critical risks, narrative |
| Company Overview | B1-B7 sections, maturity stage, TRL assessment |
| Diagnostic Assessment | 40Q scores across Team, Technology, Management, Commercial |
| Market Maturity | 5-dimension VIANEO scores with threshold analysis |
| Needs Analysis | Requesters, needs, existing solutions |
| Viability Assessment | Final recommendation, risk register, 90-day roadmap, KPIs |

---

## Input Documents

### Supported Formats

| Format | Extension | Notes |
|--------|-----------|-------|
| PDF | `.pdf` | Full text extraction |
| Word Document | `.docx` | Full text extraction |
| Legacy Word | `.doc` | Not supported - convert to .docx |
| Plain Text | `.txt` | Direct read |
| Markdown | `.md` | Direct read |

### Best Practices for Input

1. **More context = better analysis**: Include all relevant materials
2. **Structure helps**: Organized documents produce better extractions
3. **Quantify claims**: Include specific numbers (users, revenue, dates)
4. **Be honest**: The framework rewards validated evidence over assumptions

### What to Include

- Pitch deck or investor presentation
- Business plan or executive summary
- Customer interview notes or surveys
- Market research data
- Technical documentation
- Team bios and relevant experience
- Financial projections (if available)
- Traction metrics (users, revenue, pilots)

---

## Output Formats

### Step-by-Step Mode Outputs

| Format | Description | Use Case |
|--------|-------------|----------|
| Markdown (.md) | Raw text with formatting | Documentation, version control |
| HTML | Styled web page | Sharing, printing |
| ZIP Bundle | All steps + manifest.json | Archival, sharing |
| Session JSON | Complete state export | Resume later, backup |

### Express Mode Outputs

| Format | Description | Use Case |
|--------|-------------|----------|
| DOCX | Professional Word document | Board presentations, formal reports |
| HTML Dashboard | Interactive visualization | Quick overview, stakeholder demos |

### Report Naming Convention

Files are named using the pattern:
```
{ProjectName}_{Date}_{OutputType}.{extension}

Examples:
- AcmeWidget_2025-12-07_VIANEO_Sprint_Complete.md
- 360_Validation_Report_AcmeWidget_2025-12-07.docx
- 360_Dashboard_AcmeWidget_2025-12-07.html
```

---

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                            │
├─────────────────────────────────────────────────────────────────────┤
│  React 19 + Vite 7                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │
│  │ Components  │  │   Hooks     │  │   Utils     │                 │
│  │ - App       │  │ - Claude API│  │ - File Parse│                 │
│  │ - Sidebar   │  │ - Session   │  │ - DOCX Gen  │                 │
│  │ - Express   │  │ - Express   │  │ - Dashboard │                 │
│  └─────────────┘  └─────────────┘  └─────────────┘                 │
│         │                │                                          │
│         └────────────────┼──────────────────────────────────────────┤
│                          │                                          │
│                   POST /api/claude                                  │
│                          │                                          │
└──────────────────────────┼──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    SERVER (Vercel Serverless)                       │
├─────────────────────────────────────────────────────────────────────┤
│  /api/claude.js                                                     │
│  - Validates request                                                │
│  - Injects API key from env                                         │
│  - Proxies to Anthropic API                                         │
│  - Returns response                                                 │
│                                                                     │
│  API key NEVER sent to browser                                      │
└─────────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     Anthropic Claude API                            │
├─────────────────────────────────────────────────────────────────────┤
│  Model: claude-sonnet-4-20250514 (default)                          │
│  Max Tokens: 8000 (configurable)                                    │
│  Timeout: 60 seconds                                                │
└─────────────────────────────────────────────────────────────────────┘
```

### Security Model

- **API key isolation**: The Anthropic API key is stored only in Vercel environment variables
- **Server-side proxy**: All Claude API calls go through `/api/claude`, never directly from the browser
- **No secrets in client**: The frontend never sees or transmits the API key

### Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | 19.x | UI framework |
| `vite` | 7.x | Build tool and dev server |
| `pdfjs-dist` | 5.x | PDF text extraction |
| `mammoth` | 1.x | DOCX text extraction |
| `docx` | 9.x | DOCX report generation |
| `marked` | 17.x | Markdown to HTML conversion |
| `jszip` | 3.x | ZIP bundle creation |
| `chart.js` | 4.x | Dashboard visualizations |

---

## Project Structure

```
360-sprint-automator/
├── api/
│   └── claude.js              # Vercel serverless API proxy
├── src/
│   ├── components/            # React UI components
│   │   ├── Header.jsx         # App header with progress
│   │   ├── Sidebar.jsx        # Step navigation and actions
│   │   ├── InputSection.jsx   # File upload and text input
│   │   ├── OutputDisplay.jsx  # Rendered markdown output
│   │   ├── ProcessButton.jsx  # Step execution trigger
│   │   ├── ProcessingLog.jsx  # Real-time API logs
│   │   ├── Navigation.jsx     # Previous/Next controls
│   │   ├── BranchSelector.jsx # Organization branch picker
│   │   ├── ExpressModeSelector.jsx    # Mode selection UI
│   │   ├── ExpressProcessing.jsx      # Progress display
│   │   └── ExpressCompletion.jsx      # Results & downloads
│   ├── constants/             # Configuration & prompts
│   │   ├── steps.js           # 13-step definitions
│   │   ├── prompts.js         # Step-specific AI prompts
│   │   ├── expressPrompt.js   # Express mode mega-prompt
│   │   ├── colors.js          # Design system tokens
│   │   └── storage.js         # localStorage keys
│   ├── hooks/                 # Custom React hooks
│   │   ├── useClaudeAPI.js    # API calls with retry
│   │   ├── useExpressAssessment.js    # Express mode logic
│   │   ├── useSessionPersistence.js   # localStorage sync
│   │   └── useMobileMenu.js   # Mobile navigation
│   ├── utils/                 # Helper functions
│   │   ├── fileParser.js      # PDF/DOCX/TXT parsing
│   │   ├── docxGenerator.js   # DOCX report builder
│   │   ├── dashboardGenerator.js  # HTML dashboard
│   │   ├── markdownToHtml.js  # MD conversion
│   │   ├── jsonParser.js      # LLM JSON extraction
│   │   └── htmlTemplate.js    # HTML export template
│   ├── styles/
│   │   └── appStyles.js       # CSS-in-JS styles
│   ├── App.jsx                # Main application
│   └── main.jsx               # Entry point
├── public/                    # Static assets
├── .github/workflows/         # CI configuration
├── .env.example               # Environment template
├── vercel.json                # Vercel configuration
├── package.json               # Dependencies
└── vite.config.js             # Vite configuration
```

---

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|:--------:|---------|-------------|
| `ANTHROPIC_API_KEY` | Yes | - | Your Anthropic API key |
| `CLAUDE_MODEL` | No | `claude-sonnet-4-20250514` | Claude model ID |
| `CLAUDE_MAX_TOKENS` | No | `8000` | Maximum response tokens |

### Local Development

Create `.env.local` (not committed to git):
```bash
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```

### Production (Vercel)

Add variables in the Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add `ANTHROPIC_API_KEY`
3. Select all environments (Production, Preview, Development)
4. Redeploy

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at localhost:5173 |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build locally |

---

## Contributing

Contributions are welcome! Please ensure:

1. Code passes linting: `npm run lint`
2. Build succeeds: `npm run build`
3. Follow existing code style and patterns
4. Update documentation for new features

### Development Guidelines

- **Components**: Functional React with hooks
- **Styling**: CSS-in-JS via inline styles
- **State**: React hooks (no external state library)
- **API calls**: Through `useClaudeAPI` hook
- **Persistence**: Through `useSessionPersistence` hook

---

## License

BSD 2-Clause License - see [LICENSE](LICENSE) for details.

---

## Acknowledgments

- **VIANEO Framework** - The innovation validation methodology
- **Anthropic** - Claude AI powering the analysis
- **Vercel** - Hosting and serverless infrastructure
