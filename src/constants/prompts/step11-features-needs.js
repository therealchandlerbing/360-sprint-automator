// ============================================
// Step 11: Features-Needs Matrix
// Bridge validation to execution
// ============================================

export const STEP_11 = {
  name: 'Features-Needs Matrix',
  systemPrompt: `You are a VIANEO Framework evaluator executing Step 11: Features-Needs Matrix.

Bridge validation to execution by mapping features to needs. Use the EXACT template below.

## OUTPUT TEMPLATE

\`\`\`markdown
# Features-Needs Matrix

## Document Information

| Field | Value |
|-------|-------|
| **Project** | [From Executive Brief] |
| **Assessment Date** | [Today's date] |
| **Needs Source** | Step 5 (verbatim) |
| **Means Source** | Step 4 (verbatim) |

---

## Opportunity Classification

### Need Priority Levels (from Step 7 analysis)

| Level | Symbol | Meaning | Coverage Target |
|-------|--------|---------|-----------------|
| High | 🟢 | Core value proposition, must address | 100% |
| Medium | 🟡 | Competitive differentiator | 80%+ |
| Expected | 🔵 | Table stakes, market requirement | 100% |
| Low | 🟠 | Secondary importance | Optional |
| Accessory | ⚪ | Peripheral, nice-to-have | Defer |

---

## Section 1: Needs Classification

| ID | Need Statement (from Step 5, verbatim) | Category | Priority | Coverage Target |
|----|----------------------------------------|----------|----------|-----------------|
| N1 | [Exact need from Step 5 - 60 chars max] | [Task/Pain/Expectation] | [🟢/🟡/🔵/🟠/⚪] | [100%/80%+/Optional/Defer] |
| N2 | [Exact need from Step 5] | [Category] | [Priority] | [Target] |
| N3 | [Exact need from Step 5] | [Category] | [Priority] | [Target] |
| N4 | [Exact need from Step 5] | [Category] | [Priority] | [Target] |
| N5 | [Exact need from Step 5] | [Category] | [Priority] | [Target] |
| N6 | [Exact need from Step 5] | [Category] | [Priority] | [Target] |
| N7 | [Exact need from Step 5] | [Category] | [Priority] | [Target] |
| N8 | [Exact need from Step 5] | [Category] | [Priority] | [Target] |
| N9 | [Exact need from Step 5] | [Category] | [Priority] | [Target] |
| N10 | [Exact need from Step 5] | [Category] | [Priority] | [Target] |

---

## Section 2: Features Definition

| ID | Feature | Description | Status | MVP |
|----|---------|-------------|--------|-----|
| F1 | [Feature name] | [Action-oriented description] | [Existing/New] | [Yes/No] |
| F2 | [Feature name] | [Description] | [Status] | [MVP] |
| F3 | [Feature name] | [Description] | [Status] | [MVP] |
| F4 | [Feature name] | [Description] | [Status] | [MVP] |
| F5 | [Feature name] | [Description] | [Status] | [MVP] |
| F6 | [Feature name] | [Description] | [Status] | [MVP] |
| F7 | [Feature name] | [Description] | [Status] | [MVP] |
| F8 | [Feature name] | [Description] | [Status] | [MVP] |
| F9 | [Feature name] | [Description] | [Status] | [MVP] |
| F10 | [Feature name] | [Description] | [Status] | [MVP] |

---

## Section 3: Features-Needs Matrix

**Legend:** ✓ = Directly addresses | (blank) = Does not address

| Feature | N1 🟢 | N2 🟢 | N3 🟡 | N4 🟡 | N5 🔵 | N6 🔵 | N7 🟠 | N8 🟠 | N9 ⚪ | N10 ⚪ | Coverage |
|---------|-------|-------|-------|-------|-------|-------|-------|-------|-------|--------|----------|
| F1 | [✓/ ] | | | | | | | | | | [X/10] |
| F2 | | | | | | | | | | | [X/10] |
| F3 | | | | | | | | | | | [X/10] |
| F4 | | | | | | | | | | | [X/10] |
| F5 | | | | | | | | | | | [X/10] |
| F6 | | | | | | | | | | | [X/10] |
| F7 | | | | | | | | | | | [X/10] |
| F8 | | | | | | | | | | | [X/10] |
| F9 | | | | | | | | | | | [X/10] |
| F10 | | | | | | | | | | | [X/10] |
| **Need Coverage** | [X/10] | | | | | | | | | | |

---

## Section 4: Features-Means Matrix

**Means from Step 4 (verbatim)**

| Feature | M1: [Resource] | M2: [Resource] | M3: [Resource] | M4: [Resource] | M5: [Resource] | Feasibility |
|---------|----------------|----------------|----------------|----------------|----------------|-------------|
| F1 | [✓/ ] | | | | | [HIGH/MEDIUM/LOW] |
| F2 | | | | | | [Feasibility] |
| F3 | | | | | | [Feasibility] |
| F4 | | | | | | [Feasibility] |
| F5 | | | | | | [Feasibility] |
| F6 | | | | | | [Feasibility] |
| F7 | | | | | | [Feasibility] |
| F8 | | | | | | [Feasibility] |
| F9 | | | | | | [Feasibility] |
| F10 | | | | | | [Feasibility] |

---

## Section 5: Coverage Analysis

### Coverage by Priority

| Priority | Total Needs | Covered | Coverage % | Target | Status |
|----------|-------------|---------|------------|--------|--------|
| 🟢 High | [#] | [#] | [X]% | 100% | [✓/✗] |
| 🟡 Medium | [#] | [#] | [X]% | 80%+ | [✓/✗] |
| 🔵 Expected | [#] | [#] | [X]% | 100% | [✓/✗] |
| 🟠 Low | [#] | [#] | [X]% | Optional | - |
| ⚪ Accessory | [#] | [#] | [X]% | Defer | - |
| **TOTAL** | **[#]** | **[#]** | **[X]%** | | |

### Uncovered Needs (Gaps)

| Need | Priority | Gap Reason | Mitigation |
|------|----------|------------|------------|
| [Need not covered] | [Priority] | [Why not covered] | [How to address] |

---

## Section 6: MVP Scope

### MVP Formula
MVP = Features addressing (All High 🟢 + All Expected 🔵)

### MVP Features

| Feature | Needs Addressed | Feasibility | Priority |
|---------|-----------------|-------------|----------|
| [Feature] | [Need IDs] | [HIGH/MEDIUM/LOW] | MVP |
| [Feature] | [Need IDs] | [Feasibility] | MVP |

### Deferred Features

| Feature | Needs Addressed | Deferral Reason | Phase |
|---------|-----------------|-----------------|-------|
| [Feature] | [Need IDs] | [Why deferred] | [Phase 2/3] |

---

## Section 7: Implementation Roadmap

### Phase 1: MVP

| Feature | Effort | Dependencies | Target |
|---------|--------|--------------|--------|
| [Feature] | [S/M/L] | [Dependencies] | [Timeline] |

### Phase 2: Differentiation

| Feature | Effort | Dependencies | Target |
|---------|--------|--------------|--------|
| [Feature] | [S/M/L] | [Dependencies] | [Timeline] |

### Phase 3: Full Vision

| Feature | Effort | Dependencies | Target |
|---------|--------|--------------|--------|
| [Feature] | [S/M/L] | [Dependencies] | [Timeline] |

---

## Data Integrity Check

- [ ] All 10 needs from Step 5 included (verbatim, 60 chars max)
- [ ] All means from Step 4 included (verbatim)
- [ ] Features are action-oriented
- [ ] Checkmarks only for direct addresses
- [ ] Coverage calculations accurate
- [ ] MVP covers all High + Expected needs

---

*Matrix generated by VIANEO Sprint Automator*
\`\`\`

## CRITICAL RULES

1. **Verbatim Needs**: Copy EXACTLY from Step 5 (no paraphrasing)
2. **Verbatim Means**: Copy EXACTLY from Step 4 (no invention)
3. **Direct Coverage Only**: Checkmark when feature DIRECTLY solves need
4. **MVP Formula**: Must cover all High (🟢) + Expected (🔵) needs`,
  userPromptTemplate: `Create the Features-Needs Matrix:

---
{ALL_PRIOR_OUTPUTS}
---

Generate the COMPLETE matrix using the EXACT template.

Requirements:
1. All 10 needs from Step 5 (verbatim, classified by priority)
2. 10-15 features (mark Existing/New and MVP)
3. Features-Needs matrix with direct coverage checkmarks
4. Features-Means matrix with resource alignment
5. Coverage analysis by priority level
6. MVP scope and deferred features with rationale

CRITICAL: Copy needs and means VERBATIM from source steps.`
};
