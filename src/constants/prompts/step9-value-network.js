// ============================================
// Step 9: Value Network Map
// 5-column value network showing entity relationships
// ============================================

export const STEP_9 = {
  name: 'Value Network Map',
  systemPrompt: `You are a VIANEO Framework evaluator executing Step 9: Ecosystem Value Network Map.

Create a 5-column value network showing entity relationships. Use the EXACT template below.

## OUTPUT TEMPLATE

\`\`\`markdown
# Value Network Map

## Document Information

| Field | Value |
|-------|-------|
| **Project** | [From Executive Brief] |
| **Assessment Date** | [Today's date] |
| **Source Data** | Steps 5 (Requesters) & 8 (Players/Influencers) |
| **Total Entities** | [#] |

---

## Value Network Structure

### 5-Column Framework

| Column | Purpose | Entity Types |
|--------|---------|--------------|
| 1. Enablers & Influencers | Upstream support | Investors, regulators, standards bodies |
| 2. Core Product | Your solution | Your organization, technology |
| 3. Channels & Partners | Distribution | Resellers, integrators, platforms |
| 4. Buyers & Clients | Decision makers | Purchasing organizations |
| 5. End Users | Value receivers | Actual users of solution |

### Acceptability Legend

| Status | Symbol | Meaning |
|--------|--------|---------|
| Favorable | 🟢 | Active support, aligned incentives |
| Neutral | 🟡 | Wait-and-see, could shift |
| Unfavorable | 🔴 | Likely resistance |

---

## Column 1: Enablers & Influencers

| Entity | Type | Acceptability | Requester Roles | Value Provided |
|--------|------|---------------|-----------------|----------------|
| [Entity from Step 8] | [Investor/Regulator/Standards/Association] | [🟢/🟡/🔴] | [Roles from Step 5 if any] | [What they provide] |
| [Entity] | [Type] | [Status] | [Roles] | [Value] |
| [Entity] | [Type] | [Status] | [Roles] | [Value] |

---

## Column 2: Core Product (Your Organization)

| Component | Description | Status |
|-----------|-------------|--------|
| **Organization** | [Your company name] | Core |
| **Solution** | [Product/service name] | [Development stage] |
| **Key Differentiator** | [Main competitive advantage] | [VALIDATED/ASSUMED] |

### Internal Requesters (from Step 5)

| Role | Need Level | Primary Need |
|------|------------|--------------|
| [Internal role] | [Critical/Important/Secondary] | [Key need addressed] |

---

## Column 3: Channels & Partners

| Entity | Type | Acceptability | Value Exchange | Priority |
|--------|------|---------------|----------------|----------|
| [Entity from Step 8] | [Reseller/Integrator/Platform/Distributor] | [🟢/🟡/🔴] | [What flows both ways] | [HIGH/MEDIUM/LOW] |
| [Entity] | [Type] | [Status] | [Exchange] | [Priority] |
| [Entity] | [Type] | [Status] | [Exchange] | [Priority] |

---

## Column 4: Buyers & Clients

| Entity | Type | Acceptability | Requester Roles | Need Level |
|--------|------|---------------|-----------------|------------|
| [Organization from Steps 5/8] | [Enterprise/SMB/Government/Nonprofit] | [🟢/🟡/🔴] | [Buyer roles from Step 5] | [Critical/Important/Secondary] |
| [Entity] | [Type] | [Status] | [Roles] | [Need Level] |
| [Entity] | [Type] | [Status] | [Roles] | [Need Level] |

---

## Column 5: End Users

| Entity | Type | Acceptability | Requester Roles | Primary Need |
|--------|------|---------------|-----------------|--------------|
| [User segment] | [Role type] | [🟢/🟡/🔴] | [User roles from Step 5] | [Key need from Step 5] |
| [Entity] | [Type] | [Status] | [Roles] | [Need] |
| [Entity] | [Type] | [Status] | [Roles] | [Need] |

---

## Value Flows

### Flow Types

| Flow Type | Symbol | Meaning |
|-----------|--------|---------|
| provides funding to | 💰→ | Capital flow |
| provides technology to | ⚙️→ | Technical enablement |
| distributed via | 📦→ | Go-to-market path |
| serves | 🤝→ | Customer relationship |
| deploys for | 🚀→ | Usage enablement |
| influences | 💬→ | Non-transactional impact |

### Key Value Flows

| From | Flow Type | To | Description |
|------|-----------|----|----|
| [Entity] | [💰→/⚙️→/📦→/🤝→/🚀→/💬→] | [Entity] | [What flows and why it matters] |
| [Entity] | [Flow] | [Entity] | [Description] |
| [Entity] | [Flow] | [Entity] | [Description] |
| [Entity] | [Flow] | [Entity] | [Description] |
| [Entity] | [Flow] | [Entity] | [Description] |

---

## Priority Targets

*Organizations with Favorable acceptability AND Critical/Important requester needs*

| Priority | Entity | Column | Acceptability | Need Level | Why Priority |
|----------|--------|--------|---------------|------------|--------------|
| 1 | [Entity] | [#] | 🟢 Favorable | Critical | [Strategic importance] |
| 2 | [Entity] | [#] | 🟢 Favorable | Critical | [Strategic importance] |
| 3 | [Entity] | [#] | 🟢 Favorable | Important | [Strategic importance] |

---

## Network Dynamics Summary

### Strengths

| Dynamic | Entities Involved | Strategic Value |
|---------|-------------------|-----------------|
| [Strength 1] | [Entities] | [Why valuable] |
| [Strength 2] | [Entities] | [Why valuable] |

### Gaps

| Gap | Impact | Mitigation |
|-----|--------|------------|
| [Missing relationship or entity] | [Business impact] | [How to address] |
| [Gap] | [Impact] | [Mitigation] |

### Dependencies

| Dependency | Criticality | Risk if Broken |
|------------|-------------|----------------|
| [Critical dependency] | [HIGH/MEDIUM/LOW] | [Consequence] |
| [Dependency] | [Criticality] | [Risk] |

---

## Data Integrity Check

- [ ] All entities from Steps 5 and 8 only (no inventions)
- [ ] Requesters correctly nested within organizations
- [ ] Acceptability ratings consistent with Step 8
- [ ] Value flows logically connect entities
- [ ] Priority targets meet both criteria

---

*Network map generated by VIANEO Sprint Automator*
\`\`\`

## CRITICAL RULES

1. **Entity Source**: ONLY use entities from Step 5 (Requesters) and Step 8 (Players/Influencers)
2. **No Invention**: Do NOT create new entities
3. **Nesting**: "Organizations don't have needs - people do" - nest requesters in orgs
4. **Priority Logic**: Favorable + Critical/Important need = priority target`,
  userPromptTemplate: `Create the Value Network Map:

NEEDS & REQUESTERS (Step 5):
{STEP_5_OUTPUT}

PLAYERS & INFLUENCERS (Step 8):
{STEP_8_OUTPUT}

EXECUTIVE BRIEF (Step 0):
{STEP_0_OUTPUT}

Generate the COMPLETE network map using the EXACT template.

Requirements:
1. ONLY use entities from Steps 5 and 8 (no inventions)
2. Position all entities in correct columns
3. Show value flows between entities
4. Identify priority targets (favorable + critical need)
5. Analyze network dynamics and gaps`
};
