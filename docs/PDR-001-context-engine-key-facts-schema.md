# PDR-001: Context Engine & Key Facts Schema

**Status:** Draft
**Author:** Architecture Team
**Created:** 2024-12-09
**Last Updated:** 2024-12-09
**Reviewers:** @therealchandlerbing

---

## 1. Executive Summary

This PDR defines the technical architecture for a **Key Facts extraction and synchronization system** that solves the "Needle in a Haystack" problem in multi-step LLM workflows. The system ensures that critical data points extracted in early steps (0-3) remain accessible and accurate through the final step (12) without token bloat or information loss.

### Problem Statement

The current architecture passes raw prose between steps, leading to:
1. **Token inflation**: ~40K tokens by Step 12
2. **Information loss**: Summaries discard specific metrics
3. **Hallucination propagation**: Errors in Step 1 compound through Step 13
4. **No user correction path**: Binary approve/retry doesn't allow targeted fixes

### Proposed Solution

Implement a **dual-track output system** where each step produces:
1. **Prose Output**: Human-readable markdown (existing behavior)
2. **Key Facts Object**: Structured JSON with provenance metadata

The Key Facts accumulate across steps, providing high-fidelity context to later steps while consuming minimal tokens.

---

## 2. Detailed Requirements

### 2.1 Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01 | Each step MUST extract Key Facts alongside prose output | P0 |
| FR-02 | Key Facts MUST include source provenance (step, document, location) | P0 |
| FR-03 | User edits to prose MUST trigger Key Facts synchronization | P0 |
| FR-04 | Conflicting facts across steps MUST maintain version history | P1 |
| FR-05 | Step prompts MUST receive accumulated Key Facts as structured context | P0 |
| FR-06 | Key Facts MUST be exportable as standalone JSON | P2 |

### 2.2 Non-Functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-01 | Key Facts sync latency after user edit | < 2 seconds |
| NFR-02 | Key Facts token budget per step | < 500 tokens |
| NFR-03 | Total accumulated Key Facts by Step 12 | < 3000 tokens |
| NFR-04 | Sync accuracy (prose ↔ JSON agreement) | > 95% |

---

## 3. JSON Schema Definition

### 3.1 Core Schema: KeyFact

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://vianeo.io/schemas/key-fact.json",
  "title": "KeyFact",
  "description": "A structured data point extracted from workflow outputs with full provenance",
  "type": "object",
  "required": ["id", "category", "key", "value", "provenance", "metadata"],
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid",
      "description": "Unique identifier for this fact instance"
    },
    "category": {
      "type": "string",
      "enum": [
        "market",
        "financials",
        "team",
        "technology",
        "traction",
        "competition",
        "risks",
        "validation"
      ],
      "description": "Taxonomy category for grouping related facts"
    },
    "key": {
      "type": "string",
      "pattern": "^[a-z][a-z0-9_]*$",
      "description": "Machine-readable identifier (snake_case)",
      "examples": ["market_size_tam", "founding_year", "customer_count"]
    },
    "value": {
      "oneOf": [
        { "type": "string" },
        { "type": "number" },
        { "type": "boolean" },
        {
          "type": "object",
          "properties": {
            "amount": { "type": "number" },
            "unit": { "type": "string" },
            "currency": { "type": "string" }
          }
        }
      ],
      "description": "The extracted value"
    },
    "displayValue": {
      "type": "string",
      "description": "Human-readable formatted value for UI display",
      "examples": ["$4.7B", "15 employees", "Q2 2024"]
    },
    "provenance": {
      "$ref": "#/definitions/Provenance"
    },
    "metadata": {
      "$ref": "#/definitions/Metadata"
    },
    "history": {
      "type": "array",
      "items": { "$ref": "#/definitions/HistoryEntry" },
      "description": "Version history when fact is updated"
    }
  },
  "definitions": {
    "Provenance": {
      "type": "object",
      "required": ["extractedAt", "extractedBy", "sourceStep"],
      "properties": {
        "extractedAt": {
          "type": "string",
          "format": "date-time",
          "description": "ISO 8601 timestamp of extraction"
        },
        "extractedBy": {
          "type": "string",
          "enum": ["ai", "user", "sync"],
          "description": "Who/what created this fact"
        },
        "sourceStep": {
          "type": "integer",
          "minimum": 0,
          "maximum": 12,
          "description": "Step number where fact was first extracted"
        },
        "sourceDocument": {
          "type": "object",
          "properties": {
            "filename": { "type": "string" },
            "pageNumber": { "type": "integer" },
            "sectionHeader": { "type": "string" },
            "charOffset": {
              "type": "object",
              "properties": {
                "start": { "type": "integer" },
                "end": { "type": "integer" }
              }
            }
          },
          "description": "Pointer to original source document location"
        },
        "proseLocation": {
          "type": "object",
          "properties": {
            "stepId": { "type": "integer" },
            "sectionId": { "type": "string" },
            "paragraphIndex": { "type": "integer" },
            "textSnippet": {
              "type": "string",
              "maxLength": 200,
              "description": "Surrounding text for context matching"
            }
          },
          "description": "Location in generated prose where this fact appears"
        },
        "confidence": {
          "type": "string",
          "enum": ["high", "medium", "low", "assumed"],
          "description": "AI confidence in extraction accuracy"
        },
        "evidenceBasis": {
          "type": "string",
          "enum": ["validated", "assumed", "inferred", "user_provided"],
          "description": "Level of validation for this fact"
        }
      }
    },
    "Metadata": {
      "type": "object",
      "properties": {
        "version": {
          "type": "integer",
          "minimum": 1,
          "description": "Incremented on each update"
        },
        "lastModified": {
          "type": "string",
          "format": "date-time"
        },
        "lastModifiedBy": {
          "type": "string",
          "enum": ["ai", "user", "sync"]
        },
        "isOverridden": {
          "type": "boolean",
          "description": "True if user has manually edited this fact"
        },
        "overrideReason": {
          "type": "string",
          "description": "Optional user note explaining the override"
        },
        "supersedes": {
          "type": "string",
          "format": "uuid",
          "description": "ID of the fact this one replaces (for conflict resolution)"
        },
        "supersededBy": {
          "type": "string",
          "format": "uuid",
          "description": "ID of the fact that replaced this one"
        },
        "tags": {
          "type": "array",
          "items": { "type": "string" },
          "description": "Optional categorization tags"
        }
      }
    },
    "HistoryEntry": {
      "type": "object",
      "required": ["timestamp", "previousValue", "changedBy", "changeType"],
      "properties": {
        "timestamp": {
          "type": "string",
          "format": "date-time"
        },
        "previousValue": {
          "description": "Value before this change"
        },
        "changedBy": {
          "type": "string",
          "enum": ["ai", "user", "sync", "conflict_resolution"]
        },
        "changeType": {
          "type": "string",
          "enum": ["create", "update", "override", "supersede", "restore"]
        },
        "changeReason": {
          "type": "string"
        }
      }
    }
  }
}
```

### 3.2 Example Key Fact Instance

```json
{
  "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "category": "market",
  "key": "market_size_tam",
  "value": {
    "amount": 4700000000,
    "unit": "USD",
    "currency": "USD"
  },
  "displayValue": "$4.7B",
  "provenance": {
    "extractedAt": "2024-12-09T14:32:00Z",
    "extractedBy": "ai",
    "sourceStep": 0,
    "sourceDocument": {
      "filename": "pitch_deck.pdf",
      "pageNumber": 12,
      "sectionHeader": "Market Opportunity",
      "charOffset": { "start": 4521, "end": 4536 }
    },
    "proseLocation": {
      "stepId": 0,
      "sectionId": "B4",
      "paragraphIndex": 2,
      "textSnippet": "...addressable market of $4.7B according to Gartner's 2024..."
    },
    "confidence": "high",
    "evidenceBasis": "validated"
  },
  "metadata": {
    "version": 2,
    "lastModified": "2024-12-09T15:10:00Z",
    "lastModifiedBy": "user",
    "isOverridden": true,
    "overrideReason": "Updated to reflect Q3 2024 Gartner revision",
    "supersedes": null,
    "supersededBy": null,
    "tags": ["market-sizing", "gartner", "2024"]
  },
  "history": [
    {
      "timestamp": "2024-12-09T14:32:00Z",
      "previousValue": null,
      "changedBy": "ai",
      "changeType": "create",
      "changeReason": "Initial extraction from pitch_deck.pdf"
    },
    {
      "timestamp": "2024-12-09T15:10:00Z",
      "previousValue": { "amount": 5000000000, "unit": "USD", "currency": "USD" },
      "changedBy": "user",
      "changeType": "override",
      "changeReason": "Updated to reflect Q3 2024 Gartner revision"
    }
  ]
}
```

### 3.3 KeyFactsStore Schema (Accumulated State)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://vianeo.io/schemas/key-facts-store.json",
  "title": "KeyFactsStore",
  "description": "Accumulated key facts across all workflow steps",
  "type": "object",
  "required": ["projectId", "facts", "index", "metadata"],
  "properties": {
    "projectId": {
      "type": "string",
      "description": "Associated project identifier"
    },
    "facts": {
      "type": "object",
      "additionalProperties": {
        "$ref": "key-fact.json"
      },
      "description": "Map of fact ID to KeyFact object"
    },
    "index": {
      "type": "object",
      "properties": {
        "byCategory": {
          "type": "object",
          "additionalProperties": {
            "type": "array",
            "items": { "type": "string", "format": "uuid" }
          }
        },
        "byStep": {
          "type": "object",
          "additionalProperties": {
            "type": "array",
            "items": { "type": "string", "format": "uuid" }
          }
        },
        "byKey": {
          "type": "object",
          "additionalProperties": { "type": "string", "format": "uuid" }
        }
      },
      "description": "Indexes for fast lookup"
    },
    "conflicts": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "key": { "type": "string" },
          "factIds": {
            "type": "array",
            "items": { "type": "string", "format": "uuid" }
          },
          "resolution": {
            "type": "string",
            "enum": ["pending", "latest_wins", "user_selected", "merged"]
          },
          "resolvedFactId": { "type": "string", "format": "uuid" }
        }
      },
      "description": "Tracked conflicts between facts with same key"
    },
    "metadata": {
      "type": "object",
      "properties": {
        "createdAt": { "type": "string", "format": "date-time" },
        "lastUpdated": { "type": "string", "format": "date-time" },
        "factCount": { "type": "integer" },
        "conflictCount": { "type": "integer" },
        "tokenEstimate": { "type": "integer" }
      }
    }
  }
}
```

---

## 4. Edge Case Solutions

### 4.1 Edge Case #1: The Synchronization Problem (Text ↔ JSON)

**Scenario:**
```
AI generates prose:  "Target Audience: Gen Z."
AI extracts fact:    { "key": "target_audience", "value": "Gen Z" }
User edits prose to: "Target Audience: Millennials."
Challenge:           JSON still says "Gen Z" → downstream steps use wrong data
```

**Solution: Hybrid Sync Strategy**

We implement a **three-tier synchronization approach** based on edit complexity:

#### Tier 1: Pattern-Based Extraction (Immediate)

For simple, pattern-matchable facts, we use client-side regex extraction on save:

```javascript
// Patterns for common fact types
const EXTRACTION_PATTERNS = {
  target_audience: /Target Audience:\s*([^.\n]+)/i,
  market_size: /\$?([\d.]+)\s*(B|M|K|billion|million)/i,
  founding_year: /[Ff]ounded:?\s*((?:19|20)\d{2})/,
  team_size: /(\d+)\s*(?:employees?|team members?|people)/i,
};

// On prose save, attempt pattern extraction
function extractFactsFromProse(prose, existingFacts) {
  const updates = [];

  for (const [key, pattern] of Object.entries(EXTRACTION_PATTERNS)) {
    const match = prose.match(pattern);
    if (match && existingFacts[key]?.displayValue !== match[1]) {
      updates.push({
        key,
        newValue: match[1],
        confidence: 'medium',
        extractedBy: 'sync'
      });
    }
  }

  return updates;
}
```

#### Tier 2: Diff-Based LLM Sync (On Significant Edits)

When user edits exceed a threshold (>50 chars changed), we invoke a lightweight LLM pass:

```javascript
const SYNC_PROMPT = `You are a data synchronization agent.

ORIGINAL PROSE:
{ORIGINAL_PROSE}

EDITED PROSE:
{EDITED_PROSE}

CURRENT KEY FACTS:
{CURRENT_FACTS_JSON}

TASK: Identify which key facts need to be updated based on the user's edits.
Return ONLY a JSON array of updates:

[
  {
    "factId": "uuid-of-fact-to-update",
    "key": "target_audience",
    "oldValue": "Gen Z",
    "newValue": "Millennials",
    "confidence": "high",
    "reasoning": "User explicitly changed target audience in prose"
  }
]

If no updates needed, return: []`;
```

**Sync Trigger Logic:**

```javascript
function shouldTriggerLLMSync(originalProse, editedProse, patternUpdates) {
  const editDistance = levenshteinDistance(originalProse, editedProse);
  const editRatio = editDistance / originalProse.length;

  // Trigger LLM sync if:
  // 1. Edit ratio > 5% (significant changes)
  // 2. AND pattern extraction found no updates (complex edit)
  // 3. OR user explicitly requests "Re-sync Facts"

  return (editRatio > 0.05 && patternUpdates.length === 0);
}
```

#### Tier 3: Manual Fact Editor (User Override)

Users can directly edit facts via a dedicated panel:

```
┌─────────────────────────────────────────────────────────────┐
│ KEY FACTS PANEL                                    [Sync ↻] │
├─────────────────────────────────────────────────────────────┤
│ Category: Market                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ market_size_tam                                         │ │
│ │ Value: [$4.7B________]  ← Editable input                │ │
│ │ Source: pitch_deck.pdf, p.12                            │ │
│ │ Confidence: [HIGH ▼]                                    │ │
│ │ ⚠️ User Override (original: $5B)                        │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ target_audience                                         │ │
│ │ Value: [Millennials__]                                  │ │
│ │ Source: Step 0, Section B4                              │ │
│ │ Confidence: [MEDIUM ▼]  ← Changed by sync               │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

#### State Flow Diagram: User Edit → Fact Sync

```
┌──────────────────────────────────────────────────────────────────────┐
│                         USER EDITS PROSE                              │
└────────────────────────────────┬─────────────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    CALCULATE EDIT DELTA                               │
│                                                                       │
│   • Compute diff between original and edited prose                   │
│   • Calculate edit ratio (chars changed / total chars)               │
│   • Identify changed sections                                        │
└────────────────────────────────┬─────────────────────────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │  Edit Ratio < 5%?      │
                    └───────────┬────────────┘
                                │
              ┌─────────────────┴─────────────────┐
              │ YES                               │ NO
              ▼                                   ▼
┌─────────────────────────┐         ┌─────────────────────────────────┐
│ TIER 1: Pattern Match   │         │ TIER 2: LLM Sync                │
│                         │         │                                  │
│ • Run regex patterns    │         │ • Send diff to Claude (haiku)   │
│ • Extract updated values│         │ • Prompt: "What facts changed?" │
│ • ~0ms latency          │         │ • ~1-2s latency                 │
└───────────┬─────────────┘         └───────────────┬─────────────────┘
            │                                       │
            │         ┌─────────────────────────────┘
            │         │
            ▼         ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    UPDATES DETECTED?                                  │
└────────────────────────────────┬─────────────────────────────────────┘
                                 │
              ┌──────────────────┴──────────────────┐
              │ YES                                 │ NO
              ▼                                     ▼
┌──────────────────────────────────┐    ┌─────────────────────────────┐
│ SHOW SYNC CONFIRMATION MODAL     │    │ SAVE PROSE ONLY             │
│                                  │    │ (No fact changes detected)  │
│ "We detected these changes:      │    └─────────────────────────────┘
│  • target_audience: Gen Z →      │
│    Millennials                   │
│                                  │
│  [Apply Changes] [Keep Original] │
│  [Edit Manually]                 │
└───────────────┬──────────────────┘
                │
                ▼ (User clicks "Apply Changes")
┌──────────────────────────────────────────────────────────────────────┐
│                    UPDATE KEY FACTS STORE                             │
│                                                                       │
│   1. Update fact.value with new value                                │
│   2. Set fact.metadata.isOverridden = true                           │
│   3. Set fact.metadata.lastModifiedBy = "sync"                       │
│   4. Increment fact.metadata.version                                 │
│   5. Push previous value to fact.history[]                           │
│   6. Update fact.provenance.proseLocation with new snippet           │
│   7. Persist to localStorage / Zustand store                         │
└────────────────────────────────┬─────────────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    SAVE COMPLETE                                      │
│                                                                       │
│   • Prose saved with user edits                                      │
│   • Key Facts updated and synchronized                               │
│   • History preserved for audit trail                                │
│   • Ready for next step consumption                                  │
└──────────────────────────────────────────────────────────────────────┘
```

---

### 4.2 Edge Case #2: Provenance & Hallucination Checks

**Scenario:**
```
Step 13 generates: "Based on the $5B market opportunity..."
Challenge: Is this $5B from the original PDF, or did the AI hallucinate it?
```

**Solution: Source Pointer Chain**

Every Key Fact maintains a **complete provenance chain** back to source documents.

#### Document Fingerprinting (On Upload)

```javascript
// When user uploads documents, we create a fingerprint
async function processUploadedDocument(file) {
  const content = await parseFile(file);

  return {
    id: crypto.randomUUID(),
    filename: file.name,
    fingerprint: await hashContent(content.text),
    uploadedAt: new Date().toISOString(),
    pageCount: content.pages?.length || 1,
    sections: extractSectionHeaders(content),
    // Character offset index for precise location tracking
    charIndex: buildCharacterIndex(content)
  };
}

// Build character index for offset tracking
function buildCharacterIndex(content) {
  const index = [];
  let offset = 0;

  for (let page = 0; page < content.pages.length; page++) {
    const pageText = content.pages[page];
    index.push({
      page: page + 1,
      startOffset: offset,
      endOffset: offset + pageText.length,
      sections: extractPageSections(pageText, offset)
    });
    offset += pageText.length + 1; // +1 for page separator
  }

  return index;
}
```

#### Source Linking During Extraction

The AI prompt for Step 0 includes explicit source citation requirements:

```javascript
const STEP_0_SYSTEM_PROMPT = `
...existing prompt...

## KEY FACTS EXTRACTION REQUIREMENTS

After generating the Executive Brief, output a JSON block containing extracted Key Facts.

For EACH fact, you MUST provide:
1. The exact source location in the input documents
2. A text snippet (20-50 chars) surrounding the fact in the source
3. Your confidence level (high/medium/low/assumed)

Example format:
\`\`\`json
{
  "keyFacts": [
    {
      "key": "market_size_tam",
      "value": { "amount": 4700000000, "currency": "USD" },
      "displayValue": "$4.7B",
      "sourceDocument": {
        "filename": "pitch_deck.pdf",
        "pageNumber": 12,
        "textSnippet": "...total addressable market of $4.7B according to..."
      },
      "confidence": "high",
      "evidenceBasis": "validated"
    }
  ]
}
\`\`\`

If a fact is INFERRED (not explicitly stated), mark evidenceBasis as "inferred".
If a fact is ASSUMED (no supporting evidence), mark evidenceBasis as "assumed".
`;
```

#### Provenance Verification (UI)

The output display shows provenance on hover/click:

```
┌─────────────────────────────────────────────────────────────────────┐
│ Step 12: Viability Assessment                                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ The [$4.7B]¹ market opportunity represents significant...            │
│            ↑                                                         │
│     Clickable citation                                               │
│                                                                      │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ ¹ PROVENANCE DETAIL                                             │ │
│ │                                                                  │ │
│ │ Fact: market_size_tam                                           │ │
│ │ Value: $4.7B (4,700,000,000 USD)                                │ │
│ │                                                                  │ │
│ │ Source Chain:                                                    │ │
│ │ ┌──────────────────────────────────────────────────────────┐    │ │
│ │ │ 📄 pitch_deck.pdf                                        │    │ │
│ │ │    Page 12, chars 4521-4536                              │    │ │
│ │ │    "...addressable market of $4.7B according to..."      │    │ │
│ │ └──────────────────────────────────────────────────────────┘    │ │
│ │           ↓ Extracted by AI (Step 0)                             │ │
│ │ ┌──────────────────────────────────────────────────────────┐    │ │
│ │ │ 📝 Step 0: Executive Brief                               │    │ │
│ │ │    Section B4: Target Market                             │    │ │
│ │ │    "TAM: $4.7B (Gartner 2024)"                           │    │ │
│ │ └──────────────────────────────────────────────────────────┘    │ │
│ │           ↓ User Override (Step 3)                               │ │
│ │ ┌──────────────────────────────────────────────────────────┐    │ │
│ │ │ ✏️ User Edit                                              │    │ │
│ │ │    Changed from $5B → $4.7B                              │    │ │
│ │ │    Reason: "Q3 2024 Gartner revision"                    │    │ │
│ │ └──────────────────────────────────────────────────────────┘    │ │
│ │                                                                  │ │
│ │ Confidence: HIGH | Evidence: VALIDATED | Version: 2             │ │
│ └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

#### Hallucination Detection

Facts without valid provenance are flagged:

```javascript
function validateFactProvenance(fact, documentIndex) {
  const warnings = [];

  // Check 1: Source document exists
  if (fact.provenance.sourceDocument) {
    const doc = documentIndex[fact.provenance.sourceDocument.filename];
    if (!doc) {
      warnings.push({
        type: 'MISSING_SOURCE',
        message: `Source document "${fact.provenance.sourceDocument.filename}" not found`
      });
    }
  }

  // Check 2: Text snippet matches source
  if (fact.provenance.sourceDocument?.textSnippet) {
    const sourceText = getDocumentText(
      fact.provenance.sourceDocument.filename,
      fact.provenance.sourceDocument.charOffset
    );

    if (!sourceText.includes(fact.provenance.sourceDocument.textSnippet)) {
      warnings.push({
        type: 'SNIPPET_MISMATCH',
        message: 'Text snippet not found at specified location'
      });
    }
  }

  // Check 3: Assumed facts should be flagged
  if (fact.provenance.evidenceBasis === 'assumed') {
    warnings.push({
      type: 'ASSUMED_FACT',
      message: 'This fact has no supporting evidence in source documents'
    });
  }

  return {
    isValid: warnings.length === 0,
    warnings
  };
}
```

---

### 4.3 Edge Case #3: Conflict Resolution

**Scenario:**
```
Step 0: Extracts { "market_size": "$5B" } from pitch_deck.pdf
Step 3: Finds { "market_size": "$4.2B" } from industry_report.pdf
Challenge: Which value do downstream steps use?
```

**Solution: Conflict Resolution Strategy**

#### Conflict Detection

When a new fact is extracted with a key that already exists:

```javascript
function handleFactExtraction(newFact, keyFactsStore) {
  const existingFactId = keyFactsStore.index.byKey[newFact.key];

  if (!existingFactId) {
    // No conflict - add new fact
    return addFact(newFact, keyFactsStore);
  }

  const existingFact = keyFactsStore.facts[existingFactId];

  // Check if values are equivalent
  if (areValuesEquivalent(existingFact.value, newFact.value)) {
    // Same value - update provenance only (adds supporting evidence)
    return updateProvenance(existingFactId, newFact.provenance, keyFactsStore);
  }

  // CONFLICT DETECTED
  return registerConflict(existingFact, newFact, keyFactsStore);
}

function areValuesEquivalent(v1, v2) {
  // Handle numeric comparisons with tolerance
  if (typeof v1 === 'object' && v1.amount && typeof v2 === 'object' && v2.amount) {
    const tolerance = 0.05; // 5% tolerance
    return Math.abs(v1.amount - v2.amount) / v1.amount < tolerance;
  }

  // String comparison (case-insensitive, trimmed)
  if (typeof v1 === 'string' && typeof v2 === 'string') {
    return v1.trim().toLowerCase() === v2.trim().toLowerCase();
  }

  return v1 === v2;
}
```

#### Conflict Registration

```javascript
function registerConflict(existingFact, newFact, keyFactsStore) {
  // Create the new fact with supersedes relationship
  const newFactId = crypto.randomUUID();
  const newFactComplete = {
    ...newFact,
    id: newFactId,
    metadata: {
      ...newFact.metadata,
      version: 1,
      supersedes: existingFact.id
    }
  };

  // Update existing fact to mark as potentially superseded
  keyFactsStore.facts[existingFact.id].metadata.supersededBy = newFactId;

  // Add to conflicts list
  const conflict = {
    key: newFact.key,
    factIds: [existingFact.id, newFactId],
    resolution: 'pending',
    detectedAt: new Date().toISOString(),
    detectedInStep: newFact.provenance.sourceStep
  };

  keyFactsStore.conflicts.push(conflict);

  // Add new fact to store
  keyFactsStore.facts[newFactId] = newFactComplete;

  return {
    type: 'CONFLICT_REGISTERED',
    conflict,
    requiresResolution: true
  };
}
```

#### Conflict Resolution UI

```
┌─────────────────────────────────────────────────────────────────────┐
│ ⚠️ CONFLICT DETECTED: market_size                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ Two different values found for "market_size":                        │
│                                                                      │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ VALUE A: $5B                                              [Use] │ │
│ │ Source: pitch_deck.pdf (uploaded document)                      │ │
│ │ Extracted: Step 0 (Executive Brief)                             │ │
│ │ Confidence: MEDIUM                                              │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ VALUE B: $4.2B                                            [Use] │ │
│ │ Source: industry_report.pdf (uploaded document)                 │ │
│ │ Extracted: Step 3 (Market Maturity)                             │ │
│ │ Confidence: HIGH                                                │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ Resolution Options:                                                  │
│ ○ Use Value A ($5B) - Discard B                                     │
│ ○ Use Value B ($4.2B) - Discard A                                   │
│ ○ Keep Both (market_size_v1, market_size_v2)                        │
│ ● Enter Custom Value: [$4.7B_______]                                │
│                                                                      │
│ Note (optional): [More recent Gartner data_____________]            │
│                                                                      │
│                                    [Cancel] [Apply Resolution]       │
└─────────────────────────────────────────────────────────────────────┘
```

#### Resolution Strategies

```javascript
const RESOLUTION_STRATEGIES = {
  // Strategy 1: Latest step wins (default for non-user-overridden facts)
  latest_wins: (conflict, keyFactsStore) => {
    const facts = conflict.factIds.map(id => keyFactsStore.facts[id]);
    const latest = facts.reduce((a, b) =>
      a.provenance.sourceStep > b.provenance.sourceStep ? a : b
    );
    return { winnerId: latest.id, strategy: 'latest_wins' };
  },

  // Strategy 2: Highest confidence wins
  confidence_wins: (conflict, keyFactsStore) => {
    const confidenceOrder = { high: 3, medium: 2, low: 1, assumed: 0 };
    const facts = conflict.factIds.map(id => keyFactsStore.facts[id]);
    const winner = facts.reduce((a, b) =>
      confidenceOrder[a.provenance.confidence] > confidenceOrder[b.provenance.confidence] ? a : b
    );
    return { winnerId: winner.id, strategy: 'confidence_wins' };
  },

  // Strategy 3: User override always wins
  user_override_wins: (conflict, keyFactsStore) => {
    const facts = conflict.factIds.map(id => keyFactsStore.facts[id]);
    const userOverride = facts.find(f => f.metadata.isOverridden);
    if (userOverride) {
      return { winnerId: userOverride.id, strategy: 'user_override_wins' };
    }
    // Fallback to latest_wins
    return RESOLUTION_STRATEGIES.latest_wins(conflict, keyFactsStore);
  },

  // Strategy 4: Keep all versions (for reference)
  keep_all: (conflict, keyFactsStore) => {
    // Rename keys to include version suffix
    conflict.factIds.forEach((id, index) => {
      const fact = keyFactsStore.facts[id];
      fact.key = `${fact.key}_v${index + 1}`;
    });
    return { winnerId: null, strategy: 'keep_all', keptAll: true };
  }
};

// Apply resolution
function resolveConflict(conflictIndex, resolution, keyFactsStore) {
  const conflict = keyFactsStore.conflicts[conflictIndex];

  if (resolution.strategy === 'keep_all') {
    conflict.resolution = 'keep_all';
  } else {
    conflict.resolution = resolution.strategy;
    conflict.resolvedFactId = resolution.winnerId;

    // Update index to point to winner
    const winnerFact = keyFactsStore.facts[resolution.winnerId];
    keyFactsStore.index.byKey[winnerFact.key] = resolution.winnerId;

    // Mark losers as superseded
    conflict.factIds
      .filter(id => id !== resolution.winnerId)
      .forEach(loserId => {
        keyFactsStore.facts[loserId].metadata.supersededBy = resolution.winnerId;
      });
  }

  return keyFactsStore;
}
```

#### Auto-Resolution During Step Processing

For non-interactive flow, apply default resolution:

```javascript
function autoResolveConflicts(keyFactsStore, stepId) {
  const pendingConflicts = keyFactsStore.conflicts.filter(c => c.resolution === 'pending');

  pendingConflicts.forEach((conflict, index) => {
    // Default strategy: User overrides > Higher confidence > Latest step
    let resolution;

    const facts = conflict.factIds.map(id => keyFactsStore.facts[id]);
    const userOverride = facts.find(f => f.metadata.isOverridden);

    if (userOverride) {
      resolution = { winnerId: userOverride.id, strategy: 'user_override_wins' };
    } else {
      resolution = RESOLUTION_STRATEGIES.confidence_wins(conflict, keyFactsStore);
    }

    resolveConflict(
      keyFactsStore.conflicts.indexOf(conflict),
      resolution,
      keyFactsStore
    );
  });

  return keyFactsStore;
}
```

---

## 5. Context Injection for Downstream Steps

### 5.1 Building the Facts Context String

```javascript
function buildKeyFactsContext(keyFactsStore, targetStep) {
  // Get resolved facts only (ignore superseded)
  const activeFacts = Object.values(keyFactsStore.facts)
    .filter(f => !f.metadata.supersededBy)
    .sort((a, b) => {
      // Sort by category, then by key
      if (a.category !== b.category) return a.category.localeCompare(b.category);
      return a.key.localeCompare(b.key);
    });

  // Build markdown-formatted context
  let context = '## KEY FACTS (Verified Data Points)\n\n';

  let currentCategory = null;
  for (const fact of activeFacts) {
    if (fact.category !== currentCategory) {
      currentCategory = fact.category;
      context += `### ${currentCategory.toUpperCase()}\n`;
    }

    const sourceLabel = fact.metadata.isOverridden ? '(User Verified)' : `(Step ${fact.provenance.sourceStep})`;
    context += `- **${fact.key}**: ${fact.displayValue} ${sourceLabel}\n`;
  }

  // Add conflict warnings if any pending
  const pendingConflicts = keyFactsStore.conflicts.filter(c => c.resolution === 'pending');
  if (pendingConflicts.length > 0) {
    context += '\n### ⚠️ UNRESOLVED CONFLICTS\n';
    pendingConflicts.forEach(c => {
      context += `- ${c.key}: Multiple values detected, using latest\n`;
    });
  }

  return context;
}
```

### 5.2 Example Output (Injected into Step 12)

```markdown
## KEY FACTS (Verified Data Points)

### MARKET
- **market_size_tam**: $4.7B (User Verified)
- **market_size_sam**: $800M (Step 3)
- **market_growth_rate**: 12% CAGR (Step 3)

### FINANCIALS
- **funding_raised**: $2.5M (Step 0)
- **monthly_burn**: $150K (Step 0)
- **runway_months**: 16 (Step 0)

### TEAM
- **team_size**: 15 (Step 0)
- **founding_year**: 2022 (Step 0)
- **technical_founders**: 2 (Step 4)

### TRACTION
- **customer_count**: 12 (User Verified)
- **pilot_count**: 3 (Step 6)
- **nps_score**: 72 (Step 6)

### TECHNOLOGY
- **trl_level**: 6 (Step 0)
- **patent_count**: 2 pending (Step 4)

### VALIDATION
- **interview_count**: 47 (Step 5)
- **evidence_score**: 5/6 validated (Step 0)
```

This consumes approximately **400-600 tokens** while preserving all critical metrics with provenance.

---

## 6. Implementation Phases

### Phase 1A: Schema & Store (Week 1)

| Task | Deliverable | Owner |
|------|-------------|-------|
| Define TypeScript interfaces for KeyFact schema | `src/types/keyFacts.ts` | Dev |
| Implement KeyFactsStore with Zustand | `src/stores/keyFactsStore.ts` | Dev |
| Add localStorage persistence | Integration with existing persistence | Dev |
| Unit tests for store operations | `tests/keyFactsStore.test.ts` | Dev |

### Phase 1B: Extraction Integration (Week 2)

| Task | Deliverable | Owner |
|------|-------------|-------|
| Update Step 0 prompt for Key Facts extraction | `prompts/step0-executive-brief.js` | Dev |
| Implement JSON extraction from AI responses | `src/utils/keyFactsExtractor.ts` | Dev |
| Add provenance tracking on document upload | `src/hooks/useDocumentUpload.ts` | Dev |
| Integration tests for extraction flow | `tests/integration/extraction.test.ts` | Dev |

### Phase 1C: Sync & UI (Week 3)

| Task | Deliverable | Owner |
|------|-------------|-------|
| Pattern-based sync implementation | `src/utils/proseSyncPatterns.ts` | Dev |
| LLM sync prompt and handler | `src/services/factSyncService.ts` | Dev |
| Key Facts panel component | `src/components/KeyFactsPanel.jsx` | Dev |
| Conflict resolution modal | `src/components/ConflictResolver.jsx` | Dev |
| Rich text editor integration | TipTap integration | Dev |

### Phase 1D: Context Injection (Week 4)

| Task | Deliverable | Owner |
|------|-------------|-------|
| Update buildContext to include Key Facts | `src/App.jsx` modifications | Dev |
| Update remaining step prompts | All `prompts/step*.js` files | Dev |
| Provenance display in output | `src/components/OutputDisplay.jsx` | Dev |
| End-to-end testing | Full workflow test | QA |

---

## 7. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Fact extraction accuracy | >90% | Manual review of 50 assessments |
| Sync accuracy (prose ↔ JSON) | >95% | Automated comparison tests |
| Token reduction (Step 12 context) | 60% reduction | Before/after comparison |
| User override rate | <20% | Analytics tracking |
| Conflict resolution time | <30 seconds avg | UX timing measurement |

---

## 8. Open Questions for Review

1. **Sync Trigger Threshold**: Is 5% edit ratio the right threshold for LLM sync, or should it be based on semantic change detection?

2. **Conflict Auto-Resolution**: Should we auto-resolve conflicts silently, or always prompt the user? Current spec auto-resolves with "confidence_wins" strategy.

3. **Fact Categories**: Is the current taxonomy (market, financials, team, technology, traction, competition, risks, validation) sufficient, or do we need domain-specific categories?

4. **Provenance Depth**: How far back should we trace? Current spec goes to source document. Should we also link to external citations (e.g., "Gartner 2024")?

5. **Export Format**: Should Key Facts be exportable as standalone JSON for integration with other tools?

---

## 9. Appendix: Token Budget Analysis

### Current State (No Key Facts)

| Step | Context Size | Cumulative |
|------|--------------|------------|
| 0 | Input docs (~5K) | 5K |
| 1 | Step 0 output (~4K) | 9K |
| 2 | Step 0 (~4K) | 13K |
| ... | ... | ... |
| 12 | ALL_PRIOR_OUTPUTS (~40K) | 45K |

### Proposed State (With Key Facts)

| Step | Context Size | Cumulative |
|------|--------------|------------|
| 0 | Input docs (~5K) | 5K |
| 1 | Key Facts (~0.5K) + Step 0 (~4K) | 9.5K |
| 2 | Key Facts (~0.5K) + Step 0 (~4K) | 9.5K |
| ... | ... | ... |
| 12 | Key Facts (~0.6K) + Step 0 (~4K) + Recent 2 steps (~8K) | 12.6K |

**Reduction: 72% fewer tokens for synthesis steps**

---

*Document Version: 1.0*
*Review Deadline: [TBD]*
*Implementation Start: Upon Approval*
