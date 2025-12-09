# PDR-001: Context Engine & Key Facts Schema

**Status:** Approved for Implementation
**Version:** 2.0 (Consolidated)
**Author:** Architecture Team
**Created:** 2024-12-09
**Last Updated:** 2024-12-09
**Reviewers:** @therealchandlerbing

---

## Executive Summary

This PDR defines the technical architecture for a **Context Engine** that solves three critical problems in multi-step LLM workflows:

1. **Token Overflow:** Steps 10-12 would consume ~40K tokens of accumulated context, causing quality degradation
2. **Information Loss:** Summarization loses specific metrics needed for final assessment
3. **Data Inconsistency:** User edits to prose don't propagate to downstream steps

### The Solution: Hourglass Architecture + Key Facts Backbone

```
┌─────────────────────────────────────────────────────────────────────┐
│                    HOURGLASS ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  PHASE 1: ACCUMULATION (Steps 0-9)                                  │
│  ════════════════════════════════                                   │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                          │
│  │ S0  │→│ S1  │→│ S2  │→│ ... │→│ S9  │  ~35K tokens             │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘                          │
│      \       \       \       /       /                              │
│       \       \       \     /       /                               │
│        ▼       ▼       ▼   ▼       ▼                                │
│  ┌─────────────────────────────────────┐                           │
│  │     STEP 10: SYNTHESIS INFLECTION   │  ← The "Neck"             │
│  │     (Diagnostic Comment)            │                            │
│  │     Compresses 35K → 5K tokens      │                            │
│  └─────────────────────────────────────┘                           │
│                    │                                                 │
│                    ▼                                                 │
│  PHASE 2: FOCUSED OUTPUT (Steps 11-12)                              │
│  ═════════════════════════════════════                              │
│  ┌─────┐ ┌─────┐                                                    │
│  │ S11 │→│ S12 │  Uses Step 10 + Key Facts (~5K tokens)            │
│  └─────┘ └─────┘                                                    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**Key Insight:** Step 10 (Diagnostic Comment) is not just another step—it's the **synthesis layer** that compresses all prior analysis into a high-fidelity anchor for final assessment.

---

## 1. Core Architecture

### 1.1 The Dual-Track Output System

Every step produces two outputs:

| Track | Purpose | Token Cost | Mutability |
|-------|---------|------------|------------|
| **Prose Output** | Human-readable markdown | ~1,500-4,000 | User editable |
| **Key Facts** | Structured JSON with provenance | ~50-100 per fact | Auto-synced |

```
┌──────────────────────────────────────────────────────────────────┐
│                      STEP OUTPUT STRUCTURE                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ PROSE OUTPUT (stepOutputs[n])                                │ │
│  │ ─────────────────────────────                                │ │
│  │ # Executive Brief                                            │ │
│  │                                                               │ │
│  │ ## B4: Target Market                                         │ │
│  │ **Market Size:** $4.7B TAM (Gartner 2024)                   │ │
│  │ **Target Audience:** Enterprise CFOs                         │ │
│  │ ...                                                          │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                           │                                       │
│                           │ Extraction                            │
│                           ▼                                       │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ KEY FACTS (facts store)                                      │ │
│  │ ──────────────────────                                       │ │
│  │ {                                                            │ │
│  │   "market_size_tam": {                                       │ │
│  │     "value": "4.7B",                                         │ │
│  │     "sourceStepId": 0,                                       │ │
│  │     "confidence": 0.95,                                      │ │
│  │     "metadata": { "isCanonical": false, "userVerified": false }│ │
│  │   },                                                         │ │
│  │   "target_audience": {                                       │ │
│  │     "value": "Enterprise CFOs",                              │ │
│  │     ...                                                      │ │
│  │   }                                                          │ │
│  │ }                                                            │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 1.2 Canonical vs. Mutable Facts

| Fact Type | Can Be Overwritten? | Example |
|-----------|---------------------|---------|
| **Canonical** (`isCanonical: true`) | No - downstream steps cannot contradict | Company name, founding year, problem statement |
| **Mutable** (`isCanonical: false`) | Yes - can be refined with better data | Market size, customer count, team size |

Canonical facts form the **Entity Registry**—established truths that maintain consistency across all 13 steps.

---

## 2. Data Schema

### 2.1 TypeScript Interfaces (Implementation)

```typescript
// ============================================
// KEY FACT SCHEMA
// ============================================

type EnforcementLevel = 'strict' | 'warn' | 'soft';
type FactCategory = 'market' | 'financials' | 'team' | 'technology' |
                    'traction' | 'competition' | 'risks' | 'validation';

interface KeyFactProvenance {
  documentName?: string;      // e.g., "pitch_deck.pdf"
  pageNumber?: number;        // e.g., 12
  textSnippet?: string;       // ~50 chars surrounding context for verification
  extractionMethod: 'ai' | 'pattern' | 'user';
}

interface KeyFactMetadata {
  isCanonical: boolean;       // If true, downstream steps cannot contradict
  enforcement: EnforcementLevel;
  userVerified: boolean;      // True if user manually approved via editor
  version: number;            // Incremented on each update
  lastModified: string;       // ISO 8601 timestamp
}

interface KeyFact {
  key: string;                // Machine-readable identifier (snake_case)
  value: string | number | boolean | object;
  displayValue: string;       // Human-readable formatted value
  category: FactCategory;
  sourceStepId: number;       // Step where fact was first extracted
  confidence: number;         // 0.0 to 1.0
  provenance?: KeyFactProvenance;
  metadata: KeyFactMetadata;
  history: FactHistoryEntry[];
}

interface FactHistoryEntry {
  timestamp: string;
  previousValue: any;
  changedBy: 'ai' | 'user' | 'sync' | 'conflict_resolution';
  changeReason?: string;
}

// ============================================
// PROJECT STATE SCHEMA
// ============================================

interface ProjectState {
  projectId: string;
  projectName: string;
  organizationBranch: string | null;  // '360SIS' | 'CNEN' | 'GENERIC'
  currentStep: number;

  // The Key Facts store (Entity Registry)
  facts: Record<string, KeyFact>;

  // Prose outputs per step
  stepOutputs: Record<number, string>;

  // Original input content
  inputContent: string;

  // Metadata
  createdAt: string;
  lastSaved: string;
}
```

### 2.2 Branch Configuration Schema

```typescript
// ============================================
// BRANCH CONFIGURATION
// ============================================

interface BranchConfig {
  id: string;
  name: string;
  icon: string;
  description: string;

  // Custom prompts for specific steps
  promptOverrides: Record<number, string>;

  // Required Key Facts for this branch
  requiredKeyFacts: string[];

  // Steps to skip (e.g., GENERIC skips Step 1)
  skipSteps: number[];
}

// Implementation: src/config/branches.js
const BRANCHES: Record<string, BranchConfig> = {
  '360SIS': {
    id: '360SIS',
    name: '360 Social Impact Studios',
    icon: '🌍',
    description: 'Social impact metrics, SDG alignment',
    promptOverrides: {
      1: 'step1-360sis',
    },
    requiredKeyFacts: ['sdg_alignment', 'impact_metrics', 'beneficiary_count'],
    skipSteps: [],
  },
  'CNEN': {
    id: 'CNEN',
    name: 'CNEN (Brazil Nuclear)',
    icon: '🇧🇷',
    description: 'Nuclear safety, regulatory compliance',
    promptOverrides: {
      1: 'step1-cnen',
      4: 'step4-cnen',  // Regulatory-focused Legitimacy
    },
    requiredKeyFacts: ['trl_level', 'regulatory_status', 'safety_certification'],
    skipSteps: [],
  },
  'GENERIC': {
    id: 'GENERIC',
    name: 'Standard VIANEO Assessment',
    icon: '📊',
    description: 'Standard assessment without application form',
    promptOverrides: {},
    requiredKeyFacts: [],
    skipSteps: [1],  // Skip Application Form step
  },
};
```

---

## 3. Context Injection Strategy

### 3.1 The Context Matrix

This replaces the `ALL_PRIOR_OUTPUTS` concatenation pattern.

| Step | Inputs Injected | Est. Tokens | Rationale |
|------|-----------------|-------------|-----------|
| **0** | `INPUT_CONTENT` | ~5,000 | Foundation extraction |
| **1** | `STEP_0:full` + `BRANCH_CONFIG` | ~2,000 | Application form generation |
| **2** | `STEP_0:full` | ~1,500 | 40Q Diagnostic |
| **3** | `STEP_0:full` + `STEP_2:scores_only` | ~1,800 | Market Maturity (uses diagnostic scores) |
| **4** | `STEP_0:full` + `KEY_FACTS:market` | ~2,000 | Legitimacy deep dive |
| **5** | `STEP_0:full` + `STEP_4:full` | ~3,000 | Needs & Requesters |
| **6** | `STEP_0:full` + `STEP_5:full` | ~3,000 | Persona Development |
| **7** | `STEP_5:full` + `STEP_6:full` | ~3,500 | Needs Matrix |
| **8** | `STEP_0:full` + `KEY_FACTS:all` | ~2,500 | Players & Influencers |
| **9** | `STEP_8:full` + `KEY_FACTS:all` | ~3,000 | Value Network |
| **10** | **SYNTHESIS INFLECTION:** | **~5,000** | **Compression point** |
| | `KEY_FACTS:all` (~600) | | |
| | `STEP_0:full` (~1,500) | | |
| | `STEP_2:scores_only` (~300) | | |
| | `STEP_3:scores_only` (~300) | | |
| | `STEPS_4-9:ai_summary` (~2,300) | | |
| **11** | `STEP_0:full` + `STEP_10:full` + `KEY_FACTS:all` | ~4,000 | Features-Needs Matrix |
| **12** | `STEP_0:full` + `STEP_10:full` + `STEP_11:full` + `KEY_FACTS:all` | ~5,500 | Final Viability |

### 3.2 Context Builder Implementation

```typescript
// ============================================
// CONTEXT BUILDER
// ============================================

type CompressionLevel = 'full' | 'scores_only' | 'summary' | 'key_facts_only';

interface StepContextConfig {
  inputs: Array<{
    source: string;           // e.g., 'STEP_0', 'KEY_FACTS', 'INPUT_CONTENT'
    compression: CompressionLevel;
    filter?: string;          // e.g., 'market' for KEY_FACTS:market
  }>;
}

const CONTEXT_STRATEGY: Record<number, StepContextConfig> = {
  0: {
    inputs: [{ source: 'INPUT_CONTENT', compression: 'full' }]
  },
  1: {
    inputs: [
      { source: 'STEP_0', compression: 'full' },
      { source: 'BRANCH_CONFIG', compression: 'full' }
    ]
  },
  // ... steps 2-9
  10: {
    inputs: [
      { source: 'KEY_FACTS', compression: 'full' },
      { source: 'STEP_0', compression: 'full' },
      { source: 'STEP_2', compression: 'scores_only' },
      { source: 'STEP_3', compression: 'scores_only' },
      { source: 'STEPS_4_9', compression: 'summary' },  // AI-generated summary
    ]
  },
  11: {
    inputs: [
      { source: 'KEY_FACTS', compression: 'full' },
      { source: 'STEP_0', compression: 'full' },
      { source: 'STEP_10', compression: 'full' },
    ]
  },
  12: {
    inputs: [
      { source: 'KEY_FACTS', compression: 'full' },
      { source: 'STEP_0', compression: 'full' },
      { source: 'STEP_10', compression: 'full' },
      { source: 'STEP_11', compression: 'full' },
    ]
  },
};

// Build context string for a step
function buildStepContext(
  stepId: number,
  projectState: ProjectState,
  compressionFunctions: CompressionFunctions
): string {
  const strategy = CONTEXT_STRATEGY[stepId];
  const contextParts: string[] = [];

  for (const input of strategy.inputs) {
    const content = getContextContent(input, projectState, compressionFunctions);
    if (content) {
      contextParts.push(content);
    }
  }

  return contextParts.join('\n\n---\n\n');
}
```

### 3.3 Score Extraction Functions

```typescript
// Extract only scores from Step 2 (40Q Diagnostic)
function extractStep2Scores(step2Output: string): string {
  // Pattern match the scores table
  const scoresPattern = /\| Dimension \| Score \|[\s\S]*?\|[-\s|]+\|[\s\S]*?(?=\n\n|\n#|$)/;
  const match = step2Output.match(scoresPattern);

  if (match) {
    return `## 40Q Diagnostic Scores\n\n${match[0]}`;
  }

  // Fallback: extract individual dimension scores
  return extractDimensionScores(step2Output, ['Team', 'Technology', 'Management', 'Commercial']);
}

// Extract only scores from Step 3 (Market Maturity)
function extractStep3Scores(step3Output: string): string {
  return extractDimensionScores(step3Output, [
    'Legitimacy', 'Desirability', 'Acceptability', 'Feasibility', 'Viability'
  ]);
}
```

### 3.4 AI Summary Generation (Steps 4-9)

For Step 10, we generate a compressed summary of Steps 4-9:

```typescript
const SUMMARY_PROMPT = `You are a synthesis assistant.

Given the following deep-dive analysis outputs from Steps 4-9, create a concise executive summary (max 500 words) that captures:
1. Key validation findings (what's proven vs. assumed)
2. Critical risks identified
3. Ecosystem dynamics (players, influencers, value network)
4. Priority opportunities

STEP 4 - LEGITIMACY:
{STEP_4_OUTPUT}

STEP 5 - NEEDS & REQUESTERS:
{STEP_5_OUTPUT}

STEP 6 - PERSONAS:
{STEP_6_OUTPUT}

STEP 7 - NEEDS MATRIX:
{STEP_7_OUTPUT}

STEP 8 - PLAYERS & INFLUENCERS:
{STEP_8_OUTPUT}

STEP 9 - VALUE NETWORK:
{STEP_9_OUTPUT}

OUTPUT FORMAT:
## Deep Dive Summary (Steps 4-9)

### Validation Status
[Bullet points]

### Critical Risks
[Bullet points]

### Ecosystem Dynamics
[Bullet points]

### Priority Opportunities
[Bullet points]`;
```

---

## 4. Edge Case Solutions

### 4.1 The Synchronization Problem (Prose ↔ Key Facts)

**Scenario:** User edits prose, Key Facts become stale.

**Solution: Three-Tier Sync**

```
┌──────────────────────────────────────────────────────────────────────┐
│                    USER EDITS PROSE                                   │
└────────────────────────────────┬─────────────────────────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │  Calculate Edit Delta  │
                    │  (chars changed / total)│
                    └───────────┬────────────┘
                                │
              ┌─────────────────┴─────────────────┐
              │ < 5% change              ≥ 5% change
              ▼                                   ▼
┌─────────────────────────┐         ┌─────────────────────────────────┐
│ TIER 1: Pattern Match   │         │ TIER 2: LLM Sync (Claude Haiku) │
│ • Client-side regex     │         │ • "What facts changed?"         │
│ • ~0ms latency          │         │ • ~1-2s latency                 │
└───────────┬─────────────┘         └───────────────┬─────────────────┘
            │                                       │
            └───────────────┬───────────────────────┘
                            ▼
              ┌────────────────────────┐
              │  Changes Detected?      │
              └───────────┬────────────┘
                          │
            ┌─────────────┴─────────────┐
            │ YES                       │ NO
            ▼                           ▼
┌─────────────────────────────┐   ┌─────────────────────┐
│ Show Sync Confirmation      │   │ Save Prose Only     │
│ "Update market_size to $4B?"│   │ (No fact changes)   │
│ [Apply] [Keep Original]     │   └─────────────────────┘
└─────────────────────────────┘
```

**Pattern Matching Examples:**

```typescript
const EXTRACTION_PATTERNS: Record<string, RegExp> = {
  market_size_tam: /(?:TAM|total addressable market)[:\s]*\$?([\d.]+)\s*(B|M|billion|million)/i,
  target_audience: /(?:Target Audience|Primary Users)[:\s]*([^.\n,]+)/i,
  founding_year: /(?:Founded|Established)[:\s]*((?:19|20)\d{2})/i,
  team_size: /(\d+)\s*(?:employees?|team members?|people)/i,
  customer_count: /(\d+)\s*(?:customers?|clients?|users?)/i,
  funding_raised: /(?:raised|funding)[:\s]*\$?([\d.]+)\s*(M|K|million|thousand)/i,
};
```

### 4.2 Provenance & Hallucination Detection

**Every fact maintains a source chain:**

```typescript
const factWithProvenance: KeyFact = {
  key: 'market_size_tam',
  value: '4.7B',
  displayValue: '$4.7B',
  category: 'market',
  sourceStepId: 0,
  confidence: 0.95,
  provenance: {
    documentName: 'pitch_deck.pdf',
    pageNumber: 12,
    textSnippet: '...addressable market of $4.7B according to Gartner...',
    extractionMethod: 'ai',
  },
  metadata: {
    isCanonical: false,
    enforcement: 'warn',
    userVerified: true,  // User confirmed this value
    version: 2,
    lastModified: '2024-12-09T15:30:00Z',
  },
  history: [
    {
      timestamp: '2024-12-09T14:00:00Z',
      previousValue: '5B',
      changedBy: 'user',
      changeReason: 'Updated per Q3 2024 Gartner revision',
    }
  ],
};
```

**Hallucination Warning UI:**

Facts with `provenance.extractionMethod === 'ai'` and no `textSnippet` match are flagged:

```
┌────────────────────────────────────────────────────────────────┐
│ ⚠️ UNVERIFIED FACT                                             │
│                                                                 │
│ market_size_tam: $5B                                           │
│                                                                 │
│ This value was AI-generated but could not be verified against  │
│ the source documents. Consider reviewing manually.             │
│                                                                 │
│ [Verify] [Edit] [Mark as Assumed]                              │
└────────────────────────────────────────────────────────────────┘
```

### 4.3 Conflict Resolution

**Scenario:** Step 0 says market is $5B, Step 3 finds $4.2B.

**Resolution Strategy:**

```typescript
type ResolutionStrategy =
  | 'user_override_wins'   // User edits always take precedence
  | 'confidence_wins'      // Higher confidence score wins
  | 'latest_wins'          // Most recent extraction wins
  | 'keep_both';           // Create market_size_v1, market_size_v2

function resolveConflict(
  existingFact: KeyFact,
  newFact: KeyFact,
  strategy: ResolutionStrategy
): KeyFact {
  // User overrides always win
  if (existingFact.metadata.userVerified) {
    return existingFact;
  }

  // Canonical facts cannot be overwritten
  if (existingFact.metadata.isCanonical) {
    console.warn(`Attempted to overwrite canonical fact: ${existingFact.key}`);
    return existingFact;
  }

  switch (strategy) {
    case 'confidence_wins':
      return newFact.confidence > existingFact.confidence ? newFact : existingFact;
    case 'latest_wins':
      return newFact;
    case 'keep_both':
      // Handled separately - creates versioned keys
      return existingFact;
    default:
      return existingFact;
  }
}
```

**Conflict Resolution UI:**

```
┌────────────────────────────────────────────────────────────────┐
│ ⚠️ CONFLICTING VALUES: market_size                             │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ VALUE A: $5B                                          [Use] ││
│ │ Source: pitch_deck.pdf (Step 0)                             ││
│ │ Confidence: 75%                                             ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ VALUE B: $4.2B                                        [Use] ││
│ │ Source: industry_report.pdf (Step 3)                        ││
│ │ Confidence: 90%                                             ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ○ Use Value A    ○ Use Value B    ○ Enter Custom: [________]  │
│                                                                 │
│                               [Cancel] [Apply Resolution]       │
└────────────────────────────────────────────────────────────────┘
```

---

## 5. UX Specifications

### 5.1 Rich Text Editor for Output

**Requirement:** Replace read-only `<pre>` with editable Rich Text Editor (TipTap or Slate.js).

**User Flow:**

```
1. AI generates Step 1 output (Markdown)
2. User sees error: "Market Size: $50B" (hallucination)
3. User edits text to: "Market Size: $5B"
4. User clicks "Save & Continue"
5. System:
   a. Saves modified prose to stepOutputs[1]
   b. Runs pattern extraction (Tier 1 sync)
   c. If pattern matches → auto-updates KeyFact
   d. If no match → shows "Key Facts may need update" toast
6. Step 2 receives: User-corrected text + updated Key Facts
```

### 5.2 Streaming & Real-Time Feedback

**Implementation:** Use Vercel AI SDK (`streamText`) for all Claude API calls.

```typescript
import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

const result = await streamText({
  model: anthropic('claude-sonnet-4-20250514'),
  system: systemPrompt,
  prompt: userPrompt,
  onChunk: ({ chunk }) => {
    // Stream to UI as tokens arrive
    appendToEditor(chunk);
  },
});
```

**UI State Machine:**

| Time | State | Display |
|------|-------|---------|
| 0-2s | Initializing | "Preparing analysis..." |
| 2s+ | Streaming | Text appears token-by-token |
| Background | Extracting | "Extracting Key Facts..." (parallel) |
| Complete | Done | "✓ Step complete" + Key Facts panel updates |

### 5.3 PDF Parsing in Web Worker

**Requirement:** Move `pdfjs-dist` to Web Worker to prevent UI freeze.

```typescript
// workers/pdfParser.worker.ts
import * as pdfjsLib from 'pdfjs-dist';

self.onmessage = async (event) => {
  const { arrayBuffer, filename } = event.data;

  try {
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n\n';

      // Report progress
      self.postMessage({
        type: 'progress',
        page: i,
        total: pdf.numPages
      });
    }

    self.postMessage({ type: 'complete', text: fullText, filename });
  } catch (error) {
    self.postMessage({ type: 'error', error: error.message });
  }
};
```

---

## 6. Implementation Roadmap

### Phase 1: Stability & Infrastructure (Week 1)

| Task | Priority | Deliverable |
|------|----------|-------------|
| API Proxy Verification | P0 | Ensure all calls route through `/api/claude` |
| Streaming Implementation | P0 | Replace `fetch` with `streamText` from AI SDK |
| Web Worker for PDF | P1 | `workers/pdfParser.worker.ts` |
| Branch Configuration | P1 | `src/config/branches.ts` with GENERIC track |

### Phase 2: Context Engine (Week 2)

| Task | Priority | Deliverable |
|------|----------|-------------|
| Key Facts Store | P0 | Zustand store with localStorage persistence |
| Key Facts Extraction | P0 | Update Step 0 prompt + JSON parser |
| Context Matrix Implementation | P0 | Refactor `buildContext()` to use strategy |
| Score Extraction Functions | P1 | `extractStep2Scores()`, `extractStep3Scores()` |
| AI Summary for Steps 4-9 | P1 | Summary generation before Step 10 |

### Phase 3: UX Polish (Week 3)

| Task | Priority | Deliverable |
|------|----------|-------------|
| Rich Text Editor | P0 | TipTap integration in OutputDisplay |
| Prose ↔ Key Facts Sync | P0 | Pattern matching + LLM sync |
| Conflict Resolution UI | P1 | Modal component |
| Provenance Display | P2 | Clickable citations in output |
| Key Facts Panel | P2 | Sidebar panel for direct fact editing |

### Phase 4: Testing & Refinement (Week 4)

| Task | Priority | Deliverable |
|------|----------|-------------|
| End-to-End Testing | P0 | Full workflow test (Steps 0-12) |
| Token Budget Validation | P0 | Measure actual vs. estimated tokens |
| Sync Accuracy Testing | P1 | Verify prose ↔ JSON consistency |
| Performance Optimization | P2 | Identify and resolve bottlenecks |

---

## 7. Success Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Token reduction (Step 12 context) | ≥60% reduction | Before/after comparison |
| Key Facts extraction accuracy | ≥90% | Manual review of 50 assessments |
| Prose ↔ JSON sync accuracy | ≥95% | Automated comparison tests |
| User override rate | <20% | Analytics tracking |
| Step 10-12 completion rate | >95% | No timeout/overflow errors |
| Time to first token (streaming) | <3s | Performance monitoring |

---

## 8. Appendix: Detailed JSON Schema

For API documentation and validation, the full JSON Schema definitions are available below.

### A.1 KeyFact JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://vianeo.io/schemas/key-fact.json",
  "title": "KeyFact",
  "type": "object",
  "required": ["key", "value", "category", "sourceStepId", "confidence", "metadata"],
  "properties": {
    "key": {
      "type": "string",
      "pattern": "^[a-z][a-z0-9_]*$"
    },
    "value": {
      "oneOf": [
        { "type": "string" },
        { "type": "number" },
        { "type": "boolean" },
        { "type": "object" }
      ]
    },
    "displayValue": { "type": "string" },
    "category": {
      "type": "string",
      "enum": ["market", "financials", "team", "technology", "traction", "competition", "risks", "validation"]
    },
    "sourceStepId": { "type": "integer", "minimum": 0, "maximum": 12 },
    "confidence": { "type": "number", "minimum": 0, "maximum": 1 },
    "provenance": {
      "type": "object",
      "properties": {
        "documentName": { "type": "string" },
        "pageNumber": { "type": "integer" },
        "textSnippet": { "type": "string", "maxLength": 100 },
        "extractionMethod": { "type": "string", "enum": ["ai", "pattern", "user"] }
      }
    },
    "metadata": {
      "type": "object",
      "required": ["isCanonical", "enforcement", "userVerified", "version", "lastModified"],
      "properties": {
        "isCanonical": { "type": "boolean" },
        "enforcement": { "type": "string", "enum": ["strict", "warn", "soft"] },
        "userVerified": { "type": "boolean" },
        "version": { "type": "integer", "minimum": 1 },
        "lastModified": { "type": "string", "format": "date-time" }
      }
    },
    "history": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["timestamp", "changedBy"],
        "properties": {
          "timestamp": { "type": "string", "format": "date-time" },
          "previousValue": {},
          "changedBy": { "type": "string", "enum": ["ai", "user", "sync", "conflict_resolution"] },
          "changeReason": { "type": "string" }
        }
      }
    }
  }
}
```

### A.2 ProjectState JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://vianeo.io/schemas/project-state.json",
  "title": "ProjectState",
  "type": "object",
  "required": ["projectId", "projectName", "currentStep", "facts", "stepOutputs"],
  "properties": {
    "projectId": { "type": "string", "format": "uuid" },
    "projectName": { "type": "string" },
    "organizationBranch": { "type": ["string", "null"] },
    "currentStep": { "type": "integer", "minimum": 0, "maximum": 12 },
    "facts": {
      "type": "object",
      "additionalProperties": { "$ref": "key-fact.json" }
    },
    "stepOutputs": {
      "type": "object",
      "additionalProperties": { "type": "string" }
    },
    "inputContent": { "type": "string" },
    "createdAt": { "type": "string", "format": "date-time" },
    "lastSaved": { "type": "string", "format": "date-time" }
  }
}
```

---

## 9. Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2024-12-09 | Architecture Team | Initial Key Facts specification |
| 2.0 | 2024-12-09 | Architecture Team | Merged with PDR-002: Added Hourglass Architecture, Context Matrix, Branch Configuration, UX specs |

---

*Document approved for implementation.*
