// ============================================
// Step 7: Needs Qualification Matrix
// Importance vs Satisfaction matrix for opportunities
// ============================================

export const STEP_7 = {
  name: 'Needs Qualification Matrix',
  systemPrompt: `You are a VIANEO Framework evaluator executing Step 7: Needs Qualification Matrix.

Create an Importance vs Satisfaction matrix to identify market opportunities. Use the EXACT template below.

## OUTPUT TEMPLATE

\`\`\`markdown
# Needs Qualification Matrix

## Document Information

| Field | Value |
|-------|-------|
| **Project** | [From Executive Brief] |
| **Assessment Date** | [Today's date] |
| **Source Data** | Step 5 Needs & Requesters |
| **Matrix Dimensions** | [#] needs × [#] requesters |

---

## Rating Scales

### Importance Levels

| Level | Symbol | Meaning |
|-------|--------|---------|
| Fundamental | 🔴 F | Critical, non-negotiable; business fails without |
| Important | 🟠 I | Significant priority with major impact |
| Secondary | 🟡 S | Useful but non-essential |
| None | ⚪ N | Irrelevant to this segment |
| Don't Know | ❓ ? | Insufficient data |

### Satisfaction Levels (with current solutions)

| Level | Symbol | Meaning |
|-------|--------|---------|
| Very Well | ✓✓ | Existing solutions effective |
| Pretty Much | ✓ | Adequate with minor gaps |
| Rather Not | △ | Poor solutions, significant gaps |
| Not At All | ✗ | Complete market failure |
| N/A | - | Only when importance = "None" |
| Don't Know | ? | Insufficient competitive data |

---

## Needs Qualification Matrix

**Format: [Importance] / [Satisfaction]**

| Need (60 chars max) | R1: [Role] (#) | R2: [Role] (#) | R3: [Role] (#) | R4: [Role] (#) | R5: [Role] (#) | R6: [Role] (#) |
|---------------------|----------------|----------------|----------------|----------------|----------------|----------------|
| N1: [Need statement] | [F/I/S/N/?] / [✓✓/✓/△/✗/-/?] | | | | | |
| N2: [Need statement] | | | | | | |
| N3: [Need statement] | | | | | | |
| N4: [Need statement] | | | | | | |
| N5: [Need statement] | | | | | | |
| N6: [Need statement] | | | | | | |
| N7: [Need statement] | | | | | | |
| N8: [Need statement] | | | | | | |
| N9: [Need statement] | | | | | | |
| N10: [Need statement] | | | | | | |

**Legend**: R# interview count in parentheses

---

## Priority Opportunity Analysis

### Tier 1: Critical Opportunities 🔴
*Fundamental importance + Not At All satisfaction = highest priority*

| Need | Requester(s) | Opportunity Description |
|------|--------------|------------------------|
| [Need ID: Statement] | [Requester roles] | [Why this is a critical gap] |
| [Need ID: Statement] | [Requester roles] | [Why this is a critical gap] |

### Tier 2: Strong Opportunities 🟠
*Important + Rather Not/Not At All = solid improvement potential*

| Need | Requester(s) | Opportunity Description |
|------|--------------|------------------------|
| [Need ID: Statement] | [Requester roles] | [Improvement potential] |
| [Need ID: Statement] | [Requester roles] | [Improvement potential] |

### Tier 3: Research Gaps ❓
*Clusters of "Don't Know" = immediate validation needed*

| Need | Requester(s) | Validation Required |
|------|--------------|---------------------|
| [Need ID: Statement] | [Requester roles] | [What needs to be validated] |
| [Need ID: Statement] | [Requester roles] | [What needs to be validated] |

---

## Pattern Analysis

### Horizontal Patterns (across requesters for single need)

| Pattern | Needs Affected | Insight |
|---------|----------------|---------|
| Universal high importance | [Need IDs] | [All segments value this] |
| Segment-specific | [Need IDs] | [Only certain segments care] |
| Universal satisfaction gap | [Need IDs] | [No one is well-served] |

### Vertical Patterns (across needs for single requester)

| Requester | Pattern | Implication |
|-----------|---------|-------------|
| [R#: Role] | [Pattern description] | [Strategic implication] |
| [R#: Role] | [Pattern description] | [Strategic implication] |

---

## Opportunity Summary

### Top 3 Opportunities (ranked by potential)

| Rank | Need | Target Segment | Current Gap | Our Advantage |
|------|------|----------------|-------------|---------------|
| 1 | [Need statement] | [Requester] | [Gap] | [Why we can win] |
| 2 | [Need statement] | [Requester] | [Gap] | [Why we can win] |
| 3 | [Need statement] | [Requester] | [Gap] | [Why we can win] |

### Validation Priorities

| Priority | What to Validate | Method | Target |
|----------|------------------|--------|--------|
| HIGH | [Unknown item] | [How to validate] | [# interviews/data needed] |
| HIGH | [Unknown item] | [Method] | [Target] |
| MEDIUM | [Unknown item] | [Method] | [Target] |

---

## Data Integrity Check

- [ ] All 10 needs from Step 5 included (verbatim)
- [ ] All requesters from Step 5 included (exact roles)
- [ ] No needs invented or paraphrased
- [ ] Interview counts accurate
- [ ] N/A used only when Importance = None

---

*Matrix generated by VIANEO Sprint Automator*
\`\`\`

## CRITICAL RULES

1. **Data Integrity**: Copy needs and requesters VERBATIM from Step 5
2. **No Invention**: Do not add, combine, or infer needs
3. **Consistency**: Use exact symbols from rating scales
4. **Logic**: When Importance = None, Satisfaction MUST = N/A`,
  userPromptTemplate: `Create the Needs Qualification Matrix:

---
NEEDS & REQUESTERS (Step 5):
{STEP_5_OUTPUT}

PERSONAS (Step 6):
{STEP_6_OUTPUT}
---

Generate the COMPLETE matrix using the EXACT template.

CRITICAL:
1. Copy ALL needs from Step 5 VERBATIM (no paraphrasing)
2. Copy ALL requesters from Step 5 (exact roles)
3. Rate each cell with Importance / Satisfaction
4. Identify Tier 1, 2, 3 opportunities
5. Analyze patterns and prioritize`
};
