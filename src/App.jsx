import React, { useState, useCallback } from 'react';

// Step definitions based on VIANEO Framework
const STEPS = [
  { id: 0, name: 'Executive Brief', description: 'Extract structured brief from raw materials', phase: 'Foundation' },
  { id: 1, name: 'Application Forms', description: 'Generate program-specific documentation', phase: 'Foundation', hasBranch: true },
  { id: 2, name: '40Q Diagnostic', description: '4-dimension rapid assessment', phase: 'Foundation' },
  { id: 3, name: '29Q Market Maturity', description: '5-dimension VIANEO scoring', phase: 'Foundation' },
  { id: 4, name: 'Legitimacy Worksheet', description: 'Problem validation framework', phase: 'Deep Dive' },
  { id: 5, name: 'Needs & Requesters', description: 'WHO/WHAT/WHY/HOW analysis', phase: 'Deep Dive' },
  { id: 6, name: 'Persona Development', description: 'Evidence-based personas', phase: 'Deep Dive' },
  { id: 7, name: 'Needs Qualification', description: 'Interactive matrix & priority zones', phase: 'Deep Dive' },
  { id: 8, name: 'Players & Influencers', description: 'Ecosystem acceptability mapping', phase: 'Deep Dive' },
  { id: 9, name: 'Value Network Map', description: 'Network visualization & value flows', phase: 'Deep Dive' },
  { id: 10, name: 'Diagnostic Comment', description: 'Executive decision brief', phase: 'Synthesis' },
  { id: 11, name: 'Features-Needs Matrix', description: 'MVP scope analysis', phase: 'Synthesis' },
  { id: 12, name: 'Viability Assessment', description: 'Gate recommendation & dashboard', phase: 'Viability', hasSubSteps: true },
];

const PHASES = ['Foundation', 'Deep Dive', 'Synthesis', 'Viability'];

const PHASE_COLORS = {
  'Foundation': '#0D4F4F',
  'Deep Dive': '#1A6B6B',
  'Synthesis': '#2A8585',
  'Viability': '#3A9F9F',
};

// Mock outputs for demo testing
const MOCK_OUTPUTS = {
  0: `# Executive Brief

## 1. Company Overview (150 chars)
**TechVenture Inc** | Founded: 2022 | São Paulo, Brazil | S.A. (Sociedade Anônima)

## 2. Problem Statement (250 chars)
Small and medium enterprises in Latin America lack affordable, localized AI-powered inventory management systems, leading to 23% average waste and $4.2B annual losses in the region.

## 3. Solution Description (300 chars)
AI-driven inventory prediction platform using computer vision and ML to reduce waste by 40%. Mobile-first design for warehouse workers, integrates with existing POS systems, supports Portuguese and Spanish with local tax compliance built-in.

## 4. Target Market (250 chars)
Primary: SME retailers (50-500 employees) in Brazil and Mexico
Secondary: Food & beverage distributors
TAM: $2.1B | SAM: $420M | SOM (Y1): $12M

## 5. Business Model (200 chars)
SaaS subscription: $299-$999/month based on SKU count
Implementation fee: $2,500-$10,000 one-time
Avg. contract value: $8,400/year | Gross margin: 78%

## 6. Team Summary (200 chars)
CEO: Maria Santos (ex-Amazon LatAm, 12y logistics)
CTO: Carlos Oliveira (PhD ML, MIT, 15 patents)
COO: Ana Pereira (ex-McKinsey, 8y operations consulting)

## 7. Current Status (150 chars)
Stage: Series A raising $5M
Traction: 47 paying customers, $890K ARR, 112% NRR
Runway: 14 months at current burn

**Maturity Stage: PROMISING**`,

  1: `# Application Form: 360 Social Impact Studios

## Section A: Organization Profile

| Field | Response |
|-------|----------|
| Legal Name | TechVenture Inc |
| DBA | TechVenture AI |
| Registration | CNPJ: 12.345.678/0001-90 |
| Founded | March 2022 |
| HQ Location | São Paulo, SP, Brazil |
| Employees | 23 FTE |

## Section B: Impact Thesis

**Primary SDG Alignment:** SDG 12 (Responsible Consumption)
**Secondary SDGs:** SDG 8 (Decent Work), SDG 9 (Industry Innovation)

**Impact Statement:**
Reducing food and product waste in Latin American SMEs through accessible AI technology, targeting 40% waste reduction that translates to both environmental benefit and economic empowerment for underserved businesses.

**Theory of Change:**
IF we provide affordable AI inventory tools to SMEs
THEN they reduce waste and improve margins
WHICH enables business growth and job creation
LEADING TO more sustainable consumption patterns at scale

## Section C: Innovation Assessment

| Criterion | Score (1-5) | Evidence |
|-----------|-------------|----------|
| Technical Innovation | 4 | Proprietary ML model, 15 patents pending |
| Business Model Innovation | 3 | Standard SaaS with regional adaptation |
| Social Innovation | 4 | First AI inventory for LatAm SME segment |
| Scalability Potential | 5 | Proven unit economics, clear expansion path |

## Section D: Financial Health

- Burn Rate: $63K/month
- Revenue (TTM): $890K
- Growth Rate: 22% MoM
- Unit Economics: LTV:CAC = 4.2:1

**Recommendation: INVITE TO INTERVIEW**`,

  2: `# 40-Question Diagnostic Assessment

## Overall Score: 3.6/5.0

---

## TEAM DIMENSION (Avg: 3.8/5.0)

| # | Question | Score | Evidence |
|---|----------|-------|----------|
| 1 | Founder domain expertise | 5 | CEO: 12y Amazon LatAm logistics |
| 2 | Technical capability | 4 | CTO: PhD ML, MIT, 15 patents |
| 3 | Previous startup experience | 3 | CEO: 1 prior exit (small) |
| 4 | Team completeness | 4 | Core roles filled, need VP Sales |
| 5 | Advisory board strength | 3 | 2 advisors, need industry veterans |
| 6 | Hiring capability | 4 | 15 hires in 8 months |
| 7 | Culture documentation | 3 | Values defined, processes informal |
| 8 | Equity structure | 4 | Clean cap table, ESOP in place |
| 9 | Founder commitment | 5 | All founders full-time, 4y vesting |
| 10 | Team communication | 4 | Weekly all-hands, Slack active |

---

## TECHNOLOGY DIMENSION (Avg: 3.9/5.0)

| # | Question | Score | Evidence |
|---|----------|-------|----------|
| 11 | Technical differentiation | 4 | Proprietary LatAm-trained ML model |
| 12 | IP protection | 4 | 15 patents pending, trade secrets |
| 13 | Tech debt level | 3 | Moderate, refactoring needed Q2 |
| 14 | Scalability architecture | 4 | AWS-based, handles 10x current load |
| 15 | Security posture | 4 | SOC2 Type 1, Type 2 in progress |
| 16 | Data advantage | 5 | 2M+ SKU training data, exclusive partnerships |
| 17 | Development velocity | 4 | 2-week sprints, 85% sprint completion |
| 18 | Technical documentation | 3 | API docs good, internal docs sparse |
| 19 | QA processes | 3 | Automated testing 60%, manual QA |
| 20 | Infrastructure reliability | 4 | 99.7% uptime, incident response defined |

---

## MANAGEMENT DIMENSION (Avg: 3.2/5.0)

| # | Question | Score | Evidence |
|---|----------|-------|----------|
| 21 | Strategic clarity | 4 | 3-year roadmap documented |
| 22 | OKR/KPI tracking | 3 | OKRs set, tracking inconsistent |
| 23 | Board governance | 3 | Quarterly meetings, need independents |
| 24 | Financial controls | 3 | Basic processes, need CFO |
| 25 | Risk management | 2 | ⚠️ RED FLAG: No formal risk register |
| 26 | Process documentation | 3 | Sales process documented, ops informal |
| 27 | Decision-making speed | 4 | Fast executive decisions |
| 28 | Stakeholder management | 3 | Investor updates regular, others ad-hoc |
| 29 | Compliance readiness | 3 | LGPD compliant, SOX prep starting |
| 30 | Operational efficiency | 4 | Lean team, good automation |

---

## COMMERCIAL DIMENSION (Avg: 3.5/5.0)

| # | Question | Score | Evidence |
|---|----------|-------|----------|
| 31 | Market size validation | 4 | Third-party research confirms TAM |
| 32 | Customer concentration | 3 | Top 3 = 28% revenue (improving) |
| 33 | Sales pipeline health | 4 | 3.2x coverage, 45-day cycle |
| 34 | Pricing power | 3 | Competitive, some willingness to pay more |
| 35 | Customer retention | 4 | 112% NRR, <5% logo churn |
| 36 | Channel strategy | 3 | Direct only, partnerships planned |
| 37 | Brand awareness | 2 | ⚠️ LOW: Limited market recognition |
| 38 | Competitive moat | 4 | Data + local expertise + relationships |
| 39 | Expansion revenue | 4 | 18% of customers upgraded in 6 months |
| 40 | Reference customers | 4 | 5 case studies, 2 willing to speak |

---

## RED FLAGS REQUIRING IMMEDIATE ATTENTION

1. **Risk Management (Score: 2)** - No formal risk register or mitigation planning
2. **Brand Awareness (Score: 2)** - Limited market recognition despite product quality

## RECOMMENDATIONS

1. Establish formal risk management framework within 30 days
2. Allocate marketing budget for brand building (recommend 15% of raise)
3. Hire VP Sales with LatAm enterprise experience
4. Add 2 independent board members before Series A close`,

  3: `# 29-Question Market Maturity Assessment

## Overall Weighted Score: 3.4/5.0 ✅ (Threshold: ≥3.2)

---

## LEGITIMACY (15% weight) - Score: 3.8/5.0 ✅

*Is there a real problem worth solving?*

| # | Question | Score | Evidence |
|---|----------|-------|----------|
| 1 | Problem specificity | 4 | Clearly defined: inventory waste in SME retail |
| 2 | Problem measurability | 4 | 23% avg waste, $4.2B regional loss documented |
| 3 | Affected population size | 4 | 2.3M SMEs in target markets |
| 4 | Problem urgency | 3 | Chronic pain, not acute crisis |
| 5 | Willingness to change | 4 | 67% survey respondents seeking solutions |
| 6 | Evidence quality | 4 | Primary research + third-party validation |

**Legitimacy Gap:** Problem urgency could be higher. Consider crisis-driven messaging (inflation impact on margins).

---

## DESIRABILITY (25% weight) - Score: 3.6/5.0 ✅

*Do specific people want YOUR solution?*

| # | Question | Score | Evidence |
|---|----------|-------|----------|
| 7 | Solution fit to need | 4 | 40% waste reduction validated |
| 8 | User enthusiasm | 4 | NPS: 62, "life-changing" testimonials |
| 9 | Switching motivation | 3 | Current tools work but inefficient |
| 10 | Willingness to pay | 4 | $299-999 accepted, price sensitivity low |
| 11 | Feature-need alignment | 3 | Core features strong, some gaps in reporting |
| 12 | User engagement depth | 4 | Daily active usage 78% |
| 13 | Referral behavior | 4 | 23% of new customers from referrals |

**Desirability Gap:** Feature gaps in advanced reporting. Roadmap Q2 addition recommended.

---

## ACCEPTABILITY (20% weight) - Score: 3.2/5.0 ✅

*Will the ecosystem support you?*

| # | Question | Score | Evidence |
|---|----------|-------|----------|
| 14 | Competitor response risk | 3 | No major response yet, monitoring needed |
| 15 | Regulatory alignment | 4 | LGPD compliant, ANVISA favorable |
| 16 | Partner willingness | 3 | 3 signed, 5 in negotiation |
| 17 | Investor appetite | 4 | Series A oversubscribed |
| 18 | Public perception | 3 | Neutral, opportunity for positive framing |
| 19 | Industry body support | 3 | ABRASEL interested, not committed |

**Acceptability Gap:** Need stronger industry association relationships. Recommend ABRASEL partnership push.

---

## FEASIBILITY (20% weight) - Score: 3.4/5.0 ✅

*Can you actually deliver?*

| # | Question | Score | Evidence |
|---|----------|-------|----------|
| 20 | Technical capability | 4 | Proven tech, 15 patents |
| 21 | Resource availability | 3 | Current team stretched, hiring needed |
| 22 | Timeline realism | 3 | Aggressive roadmap, achievable with hires |
| 23 | Dependency management | 3 | AWS dependency, monitoring needed |
| 24 | Scale readiness | 4 | Architecture supports 10x |

**Feasibility Gap:** Team capacity constraint. Prioritize 3 engineering hires post-close.

---

## VIABILITY (20% weight) - Score: 3.2/5.0 ✅

*Is the business model sustainable?*

| # | Question | Score | Evidence |
|---|----------|-------|----------|
| 25 | Unit economics | 4 | LTV:CAC 4.2:1, improving |
| 26 | Margin sustainability | 4 | 78% gross margin, scalable |
| 27 | Revenue predictability | 3 | 90% recurring, some seasonality |
| 28 | Funding runway | 3 | 14 months current, 24+ post-raise |
| 29 | Exit pathway clarity | 3 | Multiple options, none imminent |

**Viability Gap:** Revenue seasonality needs smoothing. Consider annual contract incentives.

---

## DIMENSION SUMMARY

| Dimension | Weight | Score | Threshold | Status |
|-----------|--------|-------|-----------|--------|
| Legitimacy | 15% | 3.8 | ≥3.0 | ✅ PASS |
| Desirability | 25% | 3.6 | ≥3.5 | ✅ PASS |
| Acceptability | 20% | 3.2 | ≥3.0 | ✅ PASS |
| Feasibility | 20% | 3.4 | ≥3.0 | ✅ PASS |
| Viability | 20% | 3.2 | ≥3.0 | ✅ PASS |
| **OVERALL** | 100% | **3.4** | ≥3.2 | ✅ **PASS** |

## PRIORITY RECOMMENDATIONS

1. **Acceptability**: Formalize ABRASEL partnership (industry legitimacy)
2. **Feasibility**: Accelerate engineering hiring (capacity constraint)
3. **Viability**: Introduce annual contract incentives (revenue smoothing)`,

  4: `# Legitimacy Worksheet

## Problem Validation Framework

---

## 1. PROBLEM SPECIFICITY

**Problem Statement:**
Small and medium enterprises in Latin America lack affordable, localized AI-powered inventory management systems, leading to systematic overordering, spoilage, and stockouts.

**Specificity Checklist:**
- [x] Clear target population defined
- [x] Specific pain point articulated
- [x] Geographic scope bounded
- [x] Business segment identified
- [ ] Temporal dimension specified (partially)

**Score: 4/5** - Strong specificity, could add time-sensitivity framing

---

## 2. PROBLEM MEASURABILITY

| Metric | Value | Source | Confidence |
|--------|-------|--------|------------|
| Average waste rate | 23% | Industry survey (n=450) | HIGH |
| Annual regional loss | $4.2B | McKinsey LatAm 2023 | HIGH |
| SMEs affected | 2.3M | SEBRAE + INEGI data | HIGH |
| Avg. margin lost | 8.7% | Customer interviews (n=34) | MEDIUM |
| Manual hours/week | 12.4 | Time study (n=15) | MEDIUM |

**Score: 4/5** - Well-documented, primary + secondary sources

---

## 3. AFFECTED POPULATION

**Primary Segment Profile:**
- SME retailers (50-500 employees)
- Brazil and Mexico focus
- Food, beverage, general merchandise
- Revenue: $2M-$50M annually
- Decision maker: Owner/Operations Manager

**Population Size Analysis:**
| Market | SMEs in Target Segment | Addressable % |
|--------|------------------------|---------------|
| Brazil | 1,400,000 | 35% (490K) |
| Mexico | 620,000 | 28% (174K) |
| Colombia | 180,000 | 15% (27K) |
| **Total** | **2,200,000** | **31% (691K)** |

**Score: 4/5** - Clear segmentation, validated sizing

---

## 4. CURRENT ALTERNATIVES

| Alternative | Market Share | Strengths | Weaknesses |
|-------------|--------------|-----------|------------|
| Manual spreadsheets | 62% | Free, familiar | Error-prone, no prediction |
| Legacy ERP modules | 24% | Integrated | Expensive, complex, not AI |
| Global AI tools (US) | 8% | Advanced features | Not localized, expensive |
| Local point solutions | 6% | Regional knowledge | Limited features, poor UX |

**Competitive Gap Identified:**
No solution combines: AI prediction + Local language/tax + SME pricing + Mobile-first UX

**Score: 4/5** - Clear gap in market

---

## 5. URGENCY & WILLINGNESS TO CHANGE

**Urgency Drivers:**
- Inflation pressure on margins (URGENT)
- Rising labor costs (MODERATE)
- Sustainability requirements emerging (GROWING)
- Customer expectations for availability (MODERATE)

**Willingness Survey Results (n=450):**
| Question | Response |
|----------|----------|
| "Actively seeking solution" | 67% |
| "Would switch if better option" | 54% |
| "Willing to pay premium for AI" | 41% |
| "Need Portuguese/Spanish" | 89% |

**Score: 3.5/5** - Moderate urgency, but strong willingness when solution presented

---

## 6. EVIDENCE QUALITY ASSESSMENT

| Evidence Type | Available | Quality |
|---------------|-----------|---------|
| Primary interviews | 34 | HIGH |
| Survey data | 450 responses | HIGH |
| Third-party research | McKinsey, Gartner | HIGH |
| Customer usage data | 47 customers | HIGH |
| Competitor analysis | 12 reviewed | MEDIUM |
| Pilot results | 8 pilots | HIGH |

**Evidence Gaps:**
- Long-term retention data (only 14 months history)
- Mexico-specific validation (Brazil-heavy)

**Score: 4/5** - Strong evidence base, some geographic gaps

---

## LEGITIMACY SUMMARY

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Problem Specificity | 4 | 15% | 0.60 |
| Measurability | 4 | 20% | 0.80 |
| Population Size | 4 | 20% | 0.80 |
| Current Alternatives | 4 | 15% | 0.60 |
| Urgency/Willingness | 3.5 | 15% | 0.53 |
| Evidence Quality | 4 | 15% | 0.60 |
| **TOTAL** | | 100% | **3.93/5.0** |

**LEGITIMACY VERDICT: ✅ VALIDATED**

The problem is real, measurable, affects a substantial population, and existing alternatives leave meaningful gaps. Evidence quality is strong.`,

  5: `# Needs & Requesters Analysis

## WHO/WHAT/WHY/HOW Framework Output

---

## FILE 1: REQUESTERS

### Primary Requester: SME Operations Manager

| Attribute | Description |
|-----------|-------------|
| Title | Operations Manager / Owner |
| Company Size | 50-500 employees |
| Industry | Retail, F&B Distribution |
| Age Range | 35-55 |
| Tech Savviness | Moderate (uses mobile apps daily) |
| Decision Authority | HIGH (budget holder) |
| Time Pressure | HIGH (operational demands) |

**Quote:** "I spend 3 hours every Monday guessing what to order. Half the time I'm wrong."

### Secondary Requester: Warehouse Staff

| Attribute | Description |
|-----------|-------------|
| Title | Warehouse Lead / Stock Clerk |
| Age Range | 22-45 |
| Tech Savviness | Moderate-Low |
| Decision Authority | LOW (execution focus) |
| Pain Tolerance | HIGH (used to inefficiency) |

**Quote:** "The system tells me one thing, the shelf shows another. I just count manually."

### Tertiary Requester: Finance/Accounting

| Attribute | Description |
|-----------|-------------|
| Title | CFO / Controller / Accountant |
| Age Range | 30-50 |
| Decision Authority | MEDIUM (budget influence) |
| Primary Concern | Margin protection, compliance |

**Quote:** "Every month I see write-offs for expired goods. Nobody can tell me why."

---

## FILE 2: NEEDS INVENTORY

| ID | Need Statement | Requester | Priority |
|----|----------------|-----------|----------|
| N1 | Predict demand accurately to reduce overordering | Operations Manager | CRITICAL |
| N2 | Real-time inventory visibility across locations | Operations Manager | HIGH |
| N3 | Automatic reorder point calculations | Operations Manager | HIGH |
| N4 | Mobile access for on-the-go decisions | Operations Manager | MEDIUM |
| N5 | Simple interface for counting/receiving | Warehouse Staff | HIGH |
| N6 | Barcode/QR scanning for speed | Warehouse Staff | MEDIUM |
| N7 | Portuguese language throughout | All | CRITICAL |
| N8 | Integration with existing POS | Operations Manager | HIGH |
| N9 | Waste tracking and reporting | Finance | HIGH |
| N10 | Tax-compliant documentation | Finance | MEDIUM |
| N11 | Supplier performance tracking | Operations Manager | LOW |
| N12 | Seasonal pattern recognition | Operations Manager | MEDIUM |

---

## FILE 3: MOTIVATIONS (WHY)

### Operations Manager Motivations

| Surface Need | Underlying Motivation | Emotional Driver |
|--------------|----------------------|------------------|
| Accurate predictions | Stop wasting time on guessing | **Frustration** with uncertainty |
| Reduce waste | Protect profit margins | **Fear** of financial loss |
| Real-time visibility | Make faster decisions | **Desire** for control |
| Mobile access | Work from anywhere | **Need** for flexibility |

**Root Motivation:** "I want to feel confident in my ordering decisions instead of anxious every week."

### Warehouse Staff Motivations

| Surface Need | Underlying Motivation | Emotional Driver |
|--------------|----------------------|------------------|
| Simple interface | Complete tasks faster | **Desire** for efficiency |
| Accurate counts | Avoid being blamed for errors | **Fear** of consequences |
| Portuguese support | Understand without struggling | **Frustration** with complexity |

**Root Motivation:** "I want to do my job well without fighting with complicated systems."

### Finance Motivations

| Surface Need | Underlying Motivation | Emotional Driver |
|--------------|----------------------|------------------|
| Waste reporting | Identify problems | **Frustration** with blind spots |
| Compliance | Avoid penalties | **Fear** of audit issues |
| Clear data | Make accurate forecasts | **Desire** for predictability |

**Root Motivation:** "I want to explain our numbers with confidence and prevent losses."

---

## FILE 4: CURRENT SOLUTIONS (HOW)

### Current Solution Mapping

| Need | Current Solution | Satisfaction | Gap |
|------|------------------|--------------|-----|
| N1: Demand prediction | Manual spreadsheets + intuition | LOW (2/5) | No ML, high error rate |
| N2: Real-time visibility | Phone calls between locations | LOW (1/5) | Time delay, errors |
| N3: Reorder points | Fixed thresholds, manual | MEDIUM (3/5) | Not dynamic |
| N4: Mobile access | WhatsApp groups | LOW (2/5) | Informal, no data |
| N5: Simple counting | Paper + Excel | MEDIUM (3/5) | Double entry, errors |
| N6: Scanning | Some use basic scanners | MEDIUM (3/5) | Not integrated |
| N7: Portuguese | Mixed (some US tools) | LOW (2/5) | Poor translations |
| N8: POS integration | Manual export/import | LOW (2/5) | Time-consuming |
| N9: Waste tracking | Monthly manual count | LOW (2/5) | Too late to act |
| N10: Tax compliance | Accountant handles | MEDIUM (3/5) | Separate workflow |

### Solution Landscape

\`\`\`
HIGH SATISFACTION
     │
     │                    [Basic scanners]
     │          [Fixed reorder] [Paper counting]
     │                    [Tax via accountant]
     ├────────────────────────────────────────
     │    [WhatsApp]  [Spreadsheets]
     │         [Phone calls]  [Waste counting]
     │              [US tools w/ poor PT]
     │
LOW SATISFACTION
\`\`\`

**Key Insight:** No current solution addresses multiple needs simultaneously. Users cobble together 5+ tools, losing efficiency at every handoff.`,

  6: `# Persona Development

## Evidence-Based Personas

---

## PERSONA 1: CARLOS - The Overwhelmed Owner

### Demographics
- **Name:** Carlos Mendes
- **Age:** 47
- **Role:** Owner/General Manager
- **Company:** Supermercado Mendes (3 locations)
- **Location:** São Paulo metropolitan area
- **Employees:** 85

### Profile Photo Description
Middle-aged Brazilian man in polo shirt, standing in warehouse aisle, smartphone in hand, slightly stressed expression.

### Goals & Motivations
| Goal | Importance | Current Achievement |
|------|------------|---------------------|
| Reduce waste from 28% to under 15% | HIGH | 28% (not achieving) |
| Spend less time on inventory decisions | HIGH | 12 hrs/week (too much) |
| Open 4th location within 2 years | MEDIUM | Delayed due to margin pressure |
| Have Sundays free for family | HIGH | Works most Sundays |

### Pain Points
1. **"I'm flying blind"** - Makes ordering decisions based on gut feeling
2. **"Every location is different"** - No unified view, lots of phone calls
3. **"My team needs my input constantly"** - Can't delegate effectively
4. **"The numbers never match"** - Inventory counts don't reconcile

### Day in the Life
- 6:00 AM - Checks WhatsApp messages from night staff
- 7:00 AM - Reviews yesterday's sales on POS (manual export)
- 8:00 AM - Updates Excel forecasts (estimated 2 hrs)
- 10:00 AM - Calls suppliers with orders
- 12:00 PM - Visits one location, troubleshoots issues
- 3:00 PM - Receives deliveries, reconciles with PO
- 5:00 PM - Reviews waste/expiration reports (when time permits)
- 7:00 PM - Answers more WhatsApp questions from staff

### Technology Usage
- **Comfort Level:** Moderate
- **Primary Device:** Samsung Galaxy (Android)
- **Apps Used:** WhatsApp, Banking apps, basic POS reporting
- **Frustration:** "American software with bad Portuguese"

### Decision Criteria
1. Must work in Portuguese with local tax support
2. Must save at least 5 hours/week on decisions
3. Must show ROI within 3 months
4. Staff must be able to use it without constant help

### Quote
> "I started this business to have freedom. Now I work more than when I was employed. Something has to change or I'll burn out."

### Validation Badge
- **Source:** Interview #7, #12, #23
- **Survey Segment:** Owner-Operators (n=67)
- **Usage Data:** 5 active customers match profile

---

## PERSONA 2: LUCIA - The Capable Operations Lead

### Demographics
- **Name:** Lucia Ferreira
- **Age:** 34
- **Role:** Operations Manager
- **Company:** DistribuidoraNorte (beverage distributor)
- **Location:** Fortaleza, Ceará
- **Employees reporting:** 15 warehouse staff

### Goals & Motivations
| Goal | Importance | Current Achievement |
|------|------------|---------------------|
| Reduce picking errors to under 1% | HIGH | 3.2% (frustrating) |
| Get promoted to Regional Manager | HIGH | On track if she proves efficiency |
| Leave work by 6 PM consistently | MEDIUM | Leaves at 7:30 PM average |
| Earn performance bonus | HIGH | Missed last quarter due to waste |

### Pain Points
1. **"My team can't use our ERP"** - SAP is too complex for warehouse staff
2. **"I'm the bottleneck"** - Every decision flows through her
3. **"Reports take forever"** - Spends Friday afternoons on Excel
4. **"Surprises kill me"** - Finds out about stockouts too late

### Decision Criteria
1. Team must be able to use it independently
2. Must integrate with SAP (no double entry)
3. Needs mobile app for floor use
4. Real-time alerts for exceptions

### Quote
> "I know we can do better. I can see the waste happening. I just don't have the tools to stop it in time."

### Validation Badge
- **Source:** Interview #3, #15, #28
- **Survey Segment:** Mid-level managers (n=124)
- **Usage Data:** 12 active customers match profile

---

## PERSONA 3: ROBERTO - The Cautious CFO

### Demographics
- **Name:** Roberto Santos
- **Age:** 52
- **Role:** CFO
- **Company:** Grupo Varejo (retail chain, 8 stores)
- **Location:** Belo Horizonte, MG
- **Team:** 4 finance staff

### Goals & Motivations
| Goal | Importance | Current Achievement |
|------|------------|---------------------|
| Reduce inventory write-offs by 50% | HIGH | Flat year-over-year |
| Clean audit with no findings | HIGH | 2 findings last year |
| Board-ready reporting monthly | HIGH | Manual effort, often late |
| Retire in 5 years with legacy | MEDIUM | Worried about company health |

### Pain Points
1. **"I can't trust the numbers"** - Inventory vs. financial records don't match
2. **"Waste is a black box"** - Discovers losses weeks after they happen
3. **"Compliance is a nightmare"** - SPED/NF-e integration is manual
4. **"No one can tell me why"** - Root cause analysis impossible

### Decision Criteria
1. Must integrate with financial systems
2. Must have audit trail and compliance features
3. ROI must be provable within 6 months
4. Implementation cannot disrupt operations

### Quote
> "Every quarter I have to explain to the board why we wrote off R$400K in inventory. I need to show them a plan."

### Validation Badge
- **Source:** Interview #9, #31
- **Survey Segment:** Finance decision-makers (n=43)
- **Usage Data:** 3 active customers match profile`,

  7: `# Needs Qualification Matrix

## Interactive Matrix & Priority Zones

---

## QUALIFICATION MATRIX

| Need ID | Need Statement | Importance (1-5) | Satisfaction (1-5) | Opportunity Score |
|---------|----------------|------------------|--------------------|--------------------|
| N1 | Predict demand accurately | **5** | 1.5 | **17.5** ⭐ |
| N2 | Real-time inventory visibility | **5** | 1.8 | **16.4** ⭐ |
| N7 | Portuguese language throughout | **5** | 2.0 | **16.0** ⭐ |
| N9 | Waste tracking and reporting | **4.5** | 1.8 | **14.9** |
| N3 | Automatic reorder calculations | **4.5** | 2.5 | **12.8** |
| N8 | Integration with existing POS | **4** | 2.0 | **12.0** |
| N5 | Simple interface for counting | **4** | 2.5 | **11.0** |
| N4 | Mobile access for decisions | **3.5** | 2.2 | **9.7** |
| N6 | Barcode/QR scanning | **3.5** | 3.0 | **7.0** |
| N10 | Tax-compliant documentation | **3** | 3.0 | **6.0** |
| N12 | Seasonal pattern recognition | **3** | 2.5 | **6.8** |
| N11 | Supplier performance tracking | **2.5** | 2.0 | **5.5** |

*Opportunity Score = Importance + (Importance - Satisfaction)*

---

## VISUAL MATRIX

\`\`\`
                    IMPORTANCE
                    5.0
         PRIORITY    │    MAINTAIN
         ZONE        │    ZONE
                     │
    ┌────────────────┼────────────────┐
    │   N1 ⭐        │                │
    │   N2 ⭐   N7 ⭐ │                │
    │   N9           │                │
    │      N3   N8   │                │
    │         N5     │   N6    N10    │
    │           N4   │                │
    │                │                │
    │   N12     N11  │                │
    │                │                │
    └────────────────┼────────────────┘
                     │
         OPPORTUNIST │    IGNORE
         ZONE        │    ZONE
                     │
                    1.0
         1.0        SATISFACTION        5.0
\`\`\`

---

## PRIORITY ZONES ANALYSIS

### ⭐ PRIORITY ZONE (High Importance, Low Satisfaction)

**Must Address - Core Value Proposition**

| Need | Opportunity | Strategic Fit | MVP? |
|------|-------------|---------------|------|
| N1: Demand Prediction | 17.5 | Core ML capability | ✅ YES |
| N2: Real-time Visibility | 16.4 | Platform foundation | ✅ YES |
| N7: Portuguese | 16.0 | Market requirement | ✅ YES |

**Insight:** These three needs define the product's right to exist. All competitors fail here.

### SECONDARY PRIORITY (High Importance, Moderate Satisfaction)

**Should Address - Competitive Differentiation**

| Need | Opportunity | Strategic Fit | MVP? |
|------|-------------|---------------|------|
| N9: Waste Tracking | 14.9 | Unique to our approach | ✅ YES |
| N3: Reorder Calculation | 12.8 | Extension of N1 | ✅ YES |
| N8: POS Integration | 12.0 | Adoption enabler | ✅ YES |
| N5: Simple Interface | 11.0 | Adoption enabler | ✅ YES |

### OPPORTUNIST ZONE (Moderate Importance, Low Satisfaction)

**Could Address - Roadmap Items**

| Need | Opportunity | Timeline |
|------|-------------|----------|
| N12: Seasonal Patterns | 6.8 | Q3 (post-launch) |
| N11: Supplier Tracking | 5.5 | Q4 (enterprise tier) |

### MAINTAIN/IGNORE ZONES

| Need | Status | Action |
|------|--------|--------|
| N4: Mobile Access | Moderate satisfaction exists | Include, don't over-invest |
| N6: Scanning | Decent solutions exist | Basic support only |
| N10: Tax Compliance | Accountants handle | Integration, not replace |

---

## NEEDS PRIORITY RANKING

| Rank | Need | Score | MVP Inclusion | Rationale |
|------|------|-------|---------------|-----------|
| 1 | N1: Demand Prediction | 17.5 | ✅ MUST | Core differentiator |
| 2 | N2: Real-time Visibility | 16.4 | ✅ MUST | Platform foundation |
| 3 | N7: Portuguese | 16.0 | ✅ MUST | Market requirement |
| 4 | N9: Waste Tracking | 14.9 | ✅ MUST | Unique value prop |
| 5 | N3: Reorder Calculation | 12.8 | ✅ MUST | Extension of prediction |
| 6 | N8: POS Integration | 12.0 | ✅ MUST | Adoption enabler |
| 7 | N5: Simple Interface | 11.0 | ✅ MUST | Adoption enabler |
| 8 | N4: Mobile Access | 9.7 | ✅ SHOULD | Convenience |
| 9 | N6: Scanning | 7.0 | ⚡ COULD | Nice to have |
| 10 | N12: Seasonal Patterns | 6.8 | 📅 LATER | Post-launch |
| 11 | N10: Tax Compliance | 6.0 | ⚡ COULD | Integration only |
| 12 | N11: Supplier Tracking | 5.5 | 📅 LATER | Enterprise tier |

---

## MVP SCOPE RECOMMENDATION

**IN SCOPE (7 needs - Priority Zone + Critical Secondary):**
- N1, N2, N3, N5, N7, N8, N9

**SHOULD INCLUDE (1 need):**
- N4 (Mobile)

**COULD INCLUDE (2 needs):**
- N6 (Scanning), N10 (Tax integration)

**DEFER (2 needs):**
- N11 (Supplier), N12 (Seasonal)`,

  8: `# Players & Influencers Mapping

## Ecosystem Acceptability Analysis

---

## ECOSYSTEM MAP

\`\`\`
                         INFLUENCE
                         HIGH
              │
    ADVOCATES │  GATEKEEPERS
              │
    ──────────┼──────────
              │
    OBSERVERS │  BLOCKERS
              │
                         LOW
         SUPPORTIVE ─────────── RESISTANT
                    DISPOSITION
\`\`\`

---

## DIRECT COMPETITORS

| Player | Market Position | Threat Level | Our Advantage |
|--------|-----------------|--------------|---------------|
| **TOTVS Protheus** | Legacy leader (BR) | MEDIUM | AI prediction, UX simplicity |
| **SAP Business One** | Enterprise standard | LOW | Price, localization, SME fit |
| **Bling** | SME rising star (BR) | HIGH | AI capabilities, depth |
| **ContaAzul** | Accounting-first | MEDIUM | Inventory specialization |
| **Nuvemshop** | E-commerce focused | LOW | Physical retail focus |

**Competitive Response Risk:**
- TOTVS: Likely to acquire/copy in 18-24 months
- Bling: May add AI features in 12 months
- SAP: Unlikely to move downmarket

**Strategy:** Establish market position before incumbents can respond. Focus on data moat.

---

## INDIRECT COMPETITORS

| Player | Category | Relationship |
|--------|----------|--------------|
| **Excel/Google Sheets** | Free DIY | Replace, not fight |
| **WhatsApp Groups** | Informal communication | Integrate alongside |
| **Paper/Manual** | Traditional | Modernization path |

**Insight:** Biggest "competitor" is status quo inertia, not software.

---

## POTENTIAL PARTNERS

| Partner | Type | Value Exchange | Status |
|---------|------|----------------|--------|
| **Stone** | Payments/POS | Integration + distribution | SIGNED |
| **iFood** | Marketplace | Data sharing + channel | NEGOTIATING |
| **SEBRAE** | SME support org | Credibility + reach | INTERESTED |
| **AWS** | Infrastructure | Credits + case study | SIGNED |
| **Linx** | POS provider | Integration | EVALUATING |

**Partner Priority Matrix:**

| Partner | Strategic Value | Effort | Priority |
|---------|----------------|--------|----------|
| Stone | HIGH (distribution) | LOW | ⭐ P1 |
| SEBRAE | HIGH (credibility) | MEDIUM | ⭐ P1 |
| iFood | MEDIUM (data) | HIGH | P2 |
| Linx | MEDIUM (reach) | MEDIUM | P2 |

---

## REGULATORS & GATEKEEPERS

| Entity | Role | Current Status | Risk |
|--------|------|----------------|------|
| **LGPD (ANPD)** | Data protection | COMPLIANT | LOW |
| **ANVISA** | Food safety | N/A (software only) | NONE |
| **Receita Federal** | Tax authority | Aligned via NF-e | LOW |
| **INMETRO** | Measurement standards | N/A | NONE |
| **CFC** | Accounting standards | N/A | NONE |

**Regulatory Advantage:** No specific sector regulation. Data protection is main consideration, already addressed.

---

## INFLUENCERS & ADVOCATES

| Influencer | Platform/Reach | Disposition | Engagement Plan |
|------------|----------------|-------------|-----------------|
| **Gustavo Caetano** | LinkedIn (45K) | POSITIVE | Customer, willing to advocate |
| **Pequenas Empresas & Grandes Negócios** | Magazine/500K | NEUTRAL | PR outreach planned |
| **ABRASEL** | Industry assoc. | INTERESTED | Partnership discussion |
| **Thiago Nigro (Primo Rico)** | YouTube (6M) | UNKNOWN | Long-term target |
| **Local university partnerships** | Academic | POSITIVE | 3 research partnerships |

**Influencer Strategy:**
1. Activate customer advocates (Carlos-type personas)
2. Secure ABRASEL endorsement for credibility
3. Target business media (PEGN, Exame) for thought leadership

---

## BLOCKERS & RESISTORS

| Blocker | Type | Concern | Mitigation |
|---------|------|---------|------------|
| **Traditional consultants** | Channel | Fee displacement | Partner program with rev share |
| **Incumbent IT staff** | Internal | Job security | "Augment not replace" messaging |
| **Risk-averse CFOs** | Decision maker | Change hesitation | ROI guarantees, references |
| **Manual process defenders** | User | Comfort zone | Gradual adoption path |

**Blocker Analysis:**
- Most resistance is change-aversion, not product-specific
- Mitigation through clear ROI, testimonials, and gradual onboarding

---

## ACCEPTABILITY RISK MATRIX

| Factor | Risk Level | Mitigation Status |
|--------|------------|-------------------|
| Regulatory compliance | LOW | ✅ Addressed |
| Competitor response | MEDIUM | ⚡ Monitoring |
| Partner alignment | LOW | ✅ Key partners signed |
| Influencer support | MEDIUM | ⚡ Building |
| Blocker intensity | LOW | ✅ Playbook in place |
| Market readiness | LOW | ✅ Strong demand signals |

**Overall Acceptability Score: 3.4/5.0** ✅

---

## KEY ACTIONS

1. **Formalize ABRASEL Partnership** (Q1)
   - Industry credibility boost
   - Access to member events
   
2. **Activate Customer Advocates** (Ongoing)
   - 5 case study program
   - Referral incentive structure
   
3. **Monitor Bling Response** (Continuous)
   - Feature tracking
   - Competitive intelligence

4. **Consultant Partner Program** (Q2)
   - Revenue share model
   - Turn blockers into allies`,

  9: `# Value Network Map

## Network Visualization & Value Flows

---

## NETWORK VISUALIZATION

\`\`\`
                            ┌─────────────────┐
                            │   TECHVENTURE   │
                            │   (Platform)    │
                            └────────┬────────┘
                                     │
           ┌─────────────────────────┼─────────────────────────┐
           │                         │                         │
           ▼                         ▼                         ▼
    ┌──────────────┐         ┌──────────────┐         ┌──────────────┐
    │    SME       │         │   Partners   │         │   Data       │
    │  Customers   │         │   (POS/Pay)  │         │   Partners   │
    │   (47)       │         │              │         │              │
    └──────────────┘         └──────────────┘         └──────────────┘
           │                         │                         │
           │  $$, Data               │  Integration,          │  Market data,
           │                         │  Referrals             │  Research
           │                         │                         │
           ▼                         ▼                         ▼
    ┌──────────────┐         ┌──────────────┐         ┌──────────────┐
    │  Suppliers   │         │   Industry   │         │   Investors  │
    │  (Indirect)  │         │   Assocs.    │         │              │
    │              │         │              │         │              │
    └──────────────┘         └──────────────┘         └──────────────┘
\`\`\`

---

## KEY ACTORS & ROLES

| Actor | Role in Network | Value Created | Value Captured |
|-------|-----------------|---------------|----------------|
| **TechVenture** | Platform orchestrator | AI predictions, integration | Subscription fees |
| **SME Customers** | Primary users | Usage data, revenue | Efficiency gains, cost savings |
| **Stone (POS)** | Distribution partner | Customer referrals | Integration stickiness |
| **SEBRAE** | Credibility partner | Endorsement, education | Innovation showcase |
| **iFood** | Data partner | Market demand signals | Supplier insights |
| **Suppliers** | Indirect beneficiary | Better forecasting from customers | Reduced returns |
| **Investors** | Capital provider | Growth capital | Equity appreciation |

---

## VALUE FLOWS ANALYSIS

### 💵 MONETARY FLOWS

\`\`\`
Customers ──[$8,400/yr avg]──► TechVenture
TechVenture ──[Rev share 15%]──► Stone (on referrals)
Investors ──[$5M Series A]──► TechVenture
TechVenture ──[$1.2M/yr]──► AWS (infra)
\`\`\`

**Revenue Sustainability:**
- 78% gross margin maintained
- Partner costs manageable
- Unit economics positive

### 📊 DATA FLOWS

\`\`\`
Customers ──[Inventory/Sales data]──► TechVenture
TechVenture ──[Predictions/Insights]──► Customers
iFood ──[Demand signals]──► TechVenture
TechVenture ──[Aggregated trends]──► Industry (anonymized)
\`\`\`

**Data Moat:**
- 2M+ SKU training data (proprietary)
- Real-time customer behavior
- Regional demand patterns

### 🤝 RELATIONSHIP FLOWS

\`\`\`
SEBRAE ──[Credibility/Reach]──► TechVenture
TechVenture ──[Success stories]──► SEBRAE
Stone ──[Customer trust]──► TechVenture
TechVenture ──[Product quality]──► Stone (reputation)
\`\`\`

---

## DEPENDENCY ANALYSIS

| Dependency | Severity | Mitigation |
|------------|----------|------------|
| AWS infrastructure | MEDIUM | Multi-cloud strategy (Year 2) |
| Stone partnership | LOW | Multiple POS integrations (3) |
| Customer concentration | MEDIUM | Top 3 = 28% (reducing) |
| ML talent | HIGH | Retention packages, university pipeline |
| Market timing | LOW | Clear demand validation |

**Critical Dependencies:**
1. **ML Talent** - CTO + 2 senior engineers = 60% of IP. Retention is priority.
2. **Data Volume** - Predictions improve with data. Growth = quality.

---

## POWER DYNAMICS

### Power Balance Matrix

| Actor | Power Over Us | Our Power Over Them |
|-------|---------------|---------------------|
| Customers (aggregate) | LOW | LOW |
| Stone (partner) | LOW | LOW |
| AWS | MEDIUM | LOW |
| Investors | MEDIUM | LOW |
| Competitors | MEDIUM | MEDIUM |
| Regulators | MEDIUM | NONE |

**Analysis:**
- Relatively balanced network
- No single actor holds outsized power
- Diversification reduces vulnerability

### Negotiation Positions

| Negotiation | Our Position | Leverage |
|-------------|--------------|----------|
| Series A terms | MODERATE | Multiple term sheets |
| Stone rev share | STRONG | They need AI partners |
| AWS pricing | WEAK | Standard startup tier |
| Customer pricing | MODERATE | Competitive alternatives exist |

---

## NETWORK GAPS & OPPORTUNITIES

### Current Gaps

| Gap | Impact | Opportunity |
|-----|--------|-------------|
| No Mexico partner | Limits expansion | Target Clip (MX POS leader) |
| Limited supplier data | Incomplete view | Supplier API program |
| No accounting integration | Manual reconciliation | QuickBooks/ContaAzul integration |

### Strategic Opportunities

| Opportunity | Value | Timeline | Investment |
|-------------|-------|----------|------------|
| Supplier platform | Additional revenue stream | Year 2 | HIGH |
| iFood deeper integration | Demand prediction improvement | Q3 | MEDIUM |
| ABRASEL co-marketing | Market reach | Q1 | LOW |

---

## NETWORK STRATEGY RECOMMENDATIONS

1. **Strengthen Core Network** (Q1-Q2)
   - Formalize Stone partnership terms
   - Activate SEBRAE relationship
   - Close ABRASEL endorsement

2. **Expand Data Network** (Q2-Q3)
   - Launch supplier API program
   - Deepen iFood integration
   - Add 2 more POS integrations

3. **Build Moat** (Ongoing)
   - Data volume growth
   - Partner lock-in through integration depth
   - Talent retention

4. **Geographic Expansion** (Q4)
   - Mexico partner identification
   - Colombia market entry planning`,

  10: `# Diagnostic Comment

## Executive Decision Brief

---

## EXECUTIVE SUMMARY

**Company:** TechVenture Inc
**Assessment Date:** December 2024
**Assessor:** VIANEO Sprint Automator

### OVERALL ASSESSMENT

**Score: 3.5/5.0** | **Recommendation: CONDITIONAL GO** ✅

TechVenture presents a compelling opportunity with validated market demand, differentiated technology, and strong unit economics. The path to Series A close is clear with specific conditions that must be addressed.

---

## KEY STRENGTHS (TOP 3)

### 1. ⭐ Differentiated Technology with Data Moat
- Proprietary ML model trained on 2M+ LatAm SKU data
- 15 patents pending, defensible IP position
- Real-time prediction accuracy validated at 40% waste reduction
- **Strategic Implication:** Sustainable competitive advantage in regional market

### 2. ⭐ Strong Unit Economics & Growth Trajectory
- LTV:CAC ratio of 4.2:1 (healthy for SaaS)
- 78% gross margin with scale efficiency path
- 112% NRR indicates product-market fit
- 22% MoM growth demonstrates market pull
- **Strategic Implication:** Capital efficient growth, attractive to investors

### 3. ⭐ Experienced Leadership Team
- CEO: 12 years Amazon LatAm logistics (domain expertise)
- CTO: MIT PhD, 15 patents (technical credibility)
- COO: McKinsey operations background (execution capability)
- **Strategic Implication:** Team can navigate Series A and scale challenges

---

## CRITICAL GAPS (TOP 3)

### 1. ⚠️ Risk Management Framework (URGENT)
- **Issue:** No formal risk register or mitigation planning
- **40Q Score:** 2/5 (Red Flag)
- **Impact:** Investor due diligence concern, operational blindspot
- **Required Action:** Establish risk framework within 30 days

### 2. ⚠️ Brand Awareness (IMPORTANT)
- **Issue:** Limited market recognition despite product quality
- **40Q Score:** 2/5 (Red Flag)
- **Impact:** Slower customer acquisition, higher CAC
- **Required Action:** Allocate 15% of Series A to brand building

### 3. ⚠️ Team Capacity Constraint (MODERATE)
- **Issue:** Engineering team stretched, VP Sales gap
- **Feasibility Score:** 3.4/5.0
- **Impact:** Execution risk on roadmap
- **Required Action:** 3 engineering hires + VP Sales within 90 days of close

---

## RISK FACTORS

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Competitor response (Bling) | MEDIUM | HIGH | Accelerate data moat, lock in partners |
| Key person dependency (CTO) | LOW | HIGH | Retention package, knowledge distribution |
| Market timing (economic) | LOW | MEDIUM | SME cost-saving value prop strengthens in downturn |
| Regulatory change (LGPD) | LOW | LOW | Already compliant, monitoring active |
| Integration complexity | MEDIUM | MEDIUM | Dedicated integration team, partner SLAs |

---

## GATE RECOMMENDATION

### ✅ CONDITIONAL GO

**Conditions for Unconditional Go:**

| # | Condition | Timeline | Verification |
|---|-----------|----------|--------------|
| 1 | Risk management framework documented | 30 days | Board review |
| 2 | VP Sales hired or signed offer | 60 days | Contract |
| 3 | ABRASEL partnership formalized | 45 days | MOU signed |
| 4 | Series A term sheet signed | 90 days | Legal confirmation |

**If conditions are met:** Proceed to full viability assessment and investment close

**If conditions are not met:** Reassess at 90-day checkpoint with detailed progress report

---

## REQUIRED NEXT STEPS

### Immediate (0-30 days)
1. [ ] Draft risk management framework
2. [ ] Initiate VP Sales search (engage recruiter)
3. [ ] Schedule ABRASEL partnership meeting
4. [ ] Prepare investor data room

### Short-term (30-60 days)
1. [ ] Risk framework board approval
2. [ ] VP Sales finalist interviews
3. [ ] ABRASEL MOU negotiation
4. [ ] Series A investor meetings

### Medium-term (60-90 days)
1. [ ] VP Sales offer signed
2. [ ] ABRASEL partnership announced
3. [ ] Series A term sheet finalized
4. [ ] Engineering hiring pipeline active

---

## INVESTMENT THESIS SUMMARY

**Why This Works:**
1. Large, underserved market with validated pain ($4.2B waste problem)
2. Technical solution that incumbents cannot easily replicate
3. Strong team with relevant experience
4. Unit economics that support venture scale growth
5. Clear path to exit (acquisition by TOTVS, SAP, or strategic)

**What Could Go Wrong:**
1. Incumbents respond faster than expected
2. Key talent departure
3. Brazil economic instability
4. Slower-than-expected enterprise sales cycle

**Mitigants in Place:**
- Data moat grows daily
- Retention packages for key staff
- SME focus (faster sales cycle)
- Cost-saving value prop resilient to downturn

---

## CONFIDENCE LEVEL

| Assessment Area | Confidence |
|-----------------|------------|
| Market validation | HIGH (primary + secondary research) |
| Technical capability | HIGH (product in market, 47 customers) |
| Team assessment | HIGH (references checked) |
| Financial projections | MEDIUM (14 months history only) |
| Competitive analysis | MEDIUM (market evolving) |

**Overall Confidence: HIGH**

The assessment is based on substantial evidence including customer interviews, product usage data, market research, and team evaluation. Gaps are identified and actionable.`,

  11: `# Features-Needs Matrix

## MVP Scope Analysis

---

## FEATURE INVENTORY

| ID | Feature | Status | Priority | Effort |
|----|---------|--------|----------|--------|
| F1 | AI Demand Prediction Engine | BUILT | P0 | LARGE |
| F2 | Real-time Inventory Dashboard | BUILT | P0 | MEDIUM |
| F3 | Automatic Reorder Alerts | BUILT | P0 | MEDIUM |
| F4 | Portuguese Language UI | BUILT | P0 | SMALL |
| F5 | Mobile App (iOS/Android) | BUILT | P1 | LARGE |
| F6 | Stone POS Integration | BUILT | P1 | MEDIUM |
| F7 | Linx POS Integration | IN PROGRESS | P1 | MEDIUM |
| F8 | Waste Tracking Module | BUILT | P0 | MEDIUM |
| F9 | Barcode Scanner | BUILT | P2 | SMALL |
| F10 | Multi-location Management | BUILT | P1 | LARGE |
| F11 | Supplier Portal | PLANNED | P3 | LARGE |
| F12 | Seasonal Pattern Engine | PLANNED | P2 | MEDIUM |
| F13 | Tax/NF-e Integration | IN PROGRESS | P2 | MEDIUM |
| F14 | Advanced Reporting | PLANNED | P2 | MEDIUM |
| F15 | API for Custom Integrations | BUILT | P2 | SMALL |

---

## FEATURE-NEED ALIGNMENT MATRIX

\`\`\`
             NEEDS (Opportunity Score)
             N1    N2    N3    N5    N7    N8    N9    N4    N6   N10   N12   N11
            17.5  16.4  12.8  11.0  16.0  12.0  14.9  9.7   7.0  6.0   6.8   5.5
         ┌─────────────────────────────────────────────────────────────────────────
F1  AI   │ ●●●         ●●●                     ●●●                 ●●
F2  Dash │       ●●●         ●●●                     ●●
F3  Alert│       ●●   ●●●
F4  PT   │                         ●●●
F5  Mobile│                   ●●         ●●                 ●●●
F6  Stone│                               ●●●
F7  Linx │                               ●●●
F8  Waste│                                     ●●●
F9  Scan │                         ●●               ●●●
F10 Multi│       ●●●         ●●●                     ●●
F11 Suppl│                                                              ●●●
F12 Season│ ●●                                                    ●●●
F13 Tax  │                                                 ●●●
F14 Report│      ●●                                  ●●                 ●●
F15 API  │                               ●●

Legend: ●●● = Primary fit | ●● = Secondary fit | (empty) = No direct fit
\`\`\`

---

## GAP ANALYSIS

### ✅ FULLY COVERED NEEDS

| Need | Coverage | Features |
|------|----------|----------|
| N1: Demand Prediction | STRONG | F1 (AI Engine) |
| N2: Real-time Visibility | STRONG | F2, F10 |
| N7: Portuguese | COMPLETE | F4 |
| N9: Waste Tracking | STRONG | F8, F2 |

### ⚡ PARTIALLY COVERED NEEDS

| Need | Coverage | Gap | Remediation |
|------|----------|-----|-------------|
| N3: Reorder Calculations | 80% | Advanced multi-supplier logic | F3 enhancement (Q2) |
| N8: POS Integration | 60% | 3 more POS systems | F7 completion + 2 more (Q2) |
| N5: Simple Interface | 70% | Warehouse-specific views | UI research + iteration (Q1) |
| N4: Mobile Access | 90% | Offline mode | F5 enhancement (Q2) |

### ❌ INADEQUATELY COVERED NEEDS

| Need | Coverage | Gap | Plan |
|------|----------|-----|------|
| N12: Seasonal Patterns | 20% | Full seasonal engine | F12 (Q3 roadmap) |
| N11: Supplier Tracking | 0% | Not started | F11 (Q4 enterprise tier) |
| N10: Tax Compliance | 50% | Full NF-e integration | F13 completion (Q2) |

---

## MVP SCOPE RECOMMENDATION

### ✅ MVP MUST INCLUDE (7 Features)

| Feature | Need Addressed | Status |
|---------|----------------|--------|
| F1: AI Demand Prediction | N1, N3, N9, N12 | ✅ BUILT |
| F2: Real-time Dashboard | N2, N4, N9 | ✅ BUILT |
| F3: Reorder Alerts | N3, N2 | ✅ BUILT |
| F4: Portuguese UI | N7 | ✅ BUILT |
| F5: Mobile App | N4, N5, N9 | ✅ BUILT |
| F6: Stone Integration | N8 | ✅ BUILT |
| F8: Waste Tracking | N9, N2 | ✅ BUILT |

**MVP Status: COMPLETE** ✅

### ⚡ SHOULD INCLUDE (3 Features)

| Feature | Need Addressed | Timeline |
|---------|----------------|----------|
| F7: Linx Integration | N8 | Q1 (in progress) |
| F9: Barcode Scanner | N6, N7 | Q1 (built) |
| F10: Multi-location | N2, N5 | Q1 (built) |

**Should-Have Status: 90% COMPLETE** ✅

### 💡 COULD INCLUDE (3 Features)

| Feature | Need Addressed | Timeline |
|---------|----------------|----------|
| F13: Tax Integration | N10 | Q2 |
| F14: Advanced Reporting | N9, N2, N12 | Q2 |
| F15: API | N8 | ✅ BUILT |

### 📅 DEFER (2 Features)

| Feature | Need Addressed | Timeline |
|---------|----------------|----------|
| F11: Supplier Portal | N11 | Q4 (enterprise) |
| F12: Seasonal Patterns | N12, N1 | Q3 |

---

## ENTITY VALIDATION

### Cross-Reference Check

| Entity | Step 5 (Needs) | Step 6 (Personas) | Step 7 (Matrix) | Consistent? |
|--------|----------------|-------------------|-----------------|-------------|
| SME Operations Manager | ✅ Primary | Carlos persona | N1, N2, N3, N8 | ✅ YES |
| Warehouse Staff | ✅ Secondary | Lucia-adjacent | N5, N6 | ✅ YES |
| Finance/CFO | ✅ Tertiary | Roberto persona | N9, N10 | ✅ YES |

### Feature-Persona Alignment

| Persona | Primary Features | Coverage |
|---------|------------------|----------|
| Carlos (Owner) | F1, F2, F3, F5, F10 | STRONG |
| Lucia (Ops Mgr) | F2, F5, F9, F10 | STRONG |
| Roberto (CFO) | F8, F13, F14 | MODERATE (F14 pending) |

---

## PRIORITIZATION SUMMARY (MoSCoW)

| Category | Features | % of Scope |
|----------|----------|------------|
| **MUST** | F1, F2, F3, F4, F5, F6, F8 | 47% |
| **SHOULD** | F7, F9, F10 | 20% |
| **COULD** | F13, F14, F15 | 20% |
| **WON'T (now)** | F11, F12 | 13% |

**Current Product Completeness: 87%** of MVP + Should-Have features built.

---

## RECOMMENDATIONS

1. **Complete Linx Integration (F7)** - Unlocks significant customer segment
2. **Prioritize Roberto Persona Features** - F13 (Tax) and F14 (Reporting) for enterprise sales
3. **Defer Supplier Portal** - Good idea, but not MVP-critical
4. **Monitor Seasonal Patterns Need** - May increase priority after more customer feedback`,

  12: `# Viability Assessment

## Gate Recommendation & Dashboard

---

## PART A: INITIAL GATE ASSESSMENT

### Gate Decision: ✅ CONDITIONAL GO

| Criterion | Score | Threshold | Status |
|-----------|-------|-----------|--------|
| Overall VIANEO Score | 3.4/5.0 | ≥3.2 | ✅ PASS |
| Legitimacy | 3.8/5.0 | ≥3.0 | ✅ PASS |
| Desirability | 3.6/5.0 | ≥3.5 | ✅ PASS |
| Acceptability | 3.2/5.0 | ≥3.0 | ✅ PASS |
| Feasibility | 3.4/5.0 | ≥3.0 | ✅ PASS |
| Viability | 3.2/5.0 | ≥3.0 | ✅ PASS |

### Conditions for Unconditional Go

| # | Condition | Status | Due |
|---|-----------|--------|-----|
| 1 | Risk management framework | PENDING | 30 days |
| 2 | VP Sales hired | PENDING | 60 days |
| 3 | ABRASEL partnership signed | PENDING | 45 days |
| 4 | Series A term sheet | IN PROGRESS | 90 days |

---

## PART B: PRODUCT-MARKET FIT VALIDATION

### PMF Signals

| Signal | Target | Actual | Status |
|--------|--------|--------|--------|
| NPS | ≥40 | 62 | ✅ STRONG |
| Logo Churn (Monthly) | <5% | 2.1% | ✅ STRONG |
| Net Revenue Retention | >100% | 112% | ✅ STRONG |
| Organic Acquisition | >20% | 23% | ✅ STRONG |
| Daily Active Users | >60% | 78% | ✅ STRONG |

### PMF Score: 4.2/5.0 ⭐

**Assessment:** Strong product-market fit validated. Customers are retained, expanding, and referring.

### PMF Validation Pathways

| Pathway | Evidence | Confidence |
|---------|----------|------------|
| **Retention** | 112% NRR, <5% logo churn | HIGH |
| **Expansion** | 18% upgrade rate | HIGH |
| **Referral** | 23% organic acquisition | HIGH |
| **Engagement** | 78% DAU/MAU ratio | HIGH |
| **Testimonials** | 5 case studies, 2 reference calls | HIGH |

---

## PART C: SEGMENT-SPECIFIC BUSINESS MODELS

### Segment Analysis

| Segment | Size | ACV | Margin | CAC | LTV | LTV:CAC |
|---------|------|-----|--------|-----|-----|---------|
| **SME Retail (Core)** | 65% | $6,800 | 78% | $1,400 | $24,000 | 17:1 |
| **F&B Distribution** | 25% | $12,400 | 76% | $2,800 | $41,000 | 15:1 |
| **Enterprise** | 10% | $28,000 | 72% | $8,500 | $84,000 | 10:1 |

### Segment Viability Matrix

| Segment | Revenue % | Profit Contribution | Strategic Value | Priority |
|---------|-----------|---------------------|-----------------|----------|
| SME Retail | 48% | 52% | Market leadership | P1 (Core) |
| F&B Distribution | 34% | 32% | Higher ACV | P1 (Expand) |
| Enterprise | 18% | 16% | Reference value | P2 (Selective) |

### Business Model Recommendation

**Primary Model:** SaaS Subscription (validated)
- SME tier: $299-599/month
- Professional tier: $599-999/month
- Enterprise tier: Custom pricing

**Secondary Revenue Streams (Future):**
- Implementation services: 10-15% of revenue
- Partner rev share: 3-5% of revenue
- Supplier platform: TBD (Year 2)

---

## PART D: VIABILITY DASHBOARD

### Financial Health

\`\`\`
┌────────────────────────────────────────────────────────────────┐
│                     FINANCIAL DASHBOARD                        │
├────────────────────────────────────────────────────────────────┤
│  ARR          │  MRR Growth   │  Runway       │  Burn Multiple │
│  $890K        │  22% MoM      │  14 months    │  1.8x          │
│  ████████░░   │  ████████░░   │  ██████░░░░   │  ████░░░░░░    │
│  Target: $2M  │  Target: 15%  │  Target: 24mo │  Target: 1.5x  │
├────────────────────────────────────────────────────────────────┤
│  Gross Margin │  LTV:CAC      │  NRR          │  Logo Churn    │
│  78%          │  4.2:1        │  112%         │  2.1%          │
│  ████████████ │  ████████░░░  │  ███████████  │  █████████████ │
│  Target: 75%  │  Target: 3:1  │  Target: 100% │  Target: <5%   │
└────────────────────────────────────────────────────────────────┘
\`\`\`

### Operational Health

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Customers | 47 | 50 | ⚡ ON TRACK |
| Pipeline Coverage | 3.2x | 3.0x | ✅ HEALTHY |
| Sales Cycle | 45 days | 60 days | ✅ HEALTHY |
| Support Tickets/Customer | 2.1/mo | <3/mo | ✅ HEALTHY |
| Uptime | 99.7% | 99.5% | ✅ HEALTHY |

### Team Health

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Headcount | 23 | 30 (post-raise) | ⚡ HIRING |
| Eng:Non-Eng Ratio | 1.3:1 | 1.5:1 | ⚡ CLOSE |
| Key Role Gaps | 1 (VP Sales) | 0 | ⚠️ ACTION |
| Voluntary Turnover | 4% | <10% | ✅ HEALTHY |

---

## VIABILITY SUMMARY SCORECARD

\`\`\`
┌────────────────────────────────────────────────────────────────┐
│              VIABILITY ASSESSMENT SCORECARD                    │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  LEGITIMACY      [████████████████░░░░]  3.8/5.0  ✅           │
│  DESIRABILITY    [████████████████░░░░]  3.6/5.0  ✅           │
│  ACCEPTABILITY   [████████████░░░░░░░░]  3.2/5.0  ✅           │
│  FEASIBILITY     [██████████████░░░░░░]  3.4/5.0  ✅           │
│  VIABILITY       [████████████░░░░░░░░]  3.2/5.0  ✅           │
│                                                                │
│  ─────────────────────────────────────────────────────         │
│  OVERALL SCORE   [██████████████░░░░░░]  3.4/5.0  ✅           │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  GATE DECISION:  ✅ CONDITIONAL GO                             │
│                                                                │
│  CONDITIONS:                                                   │
│  [ ] Risk framework (30 days)                                  │
│  [ ] VP Sales hired (60 days)                                  │
│  [ ] ABRASEL partnership (45 days)                             │
│  [ ] Series A signed (90 days)                                 │
│                                                                │
└────────────────────────────────────────────────────────────────┘
\`\`\`

---

## FINAL RECOMMENDATION

### Investment Decision: ✅ PROCEED WITH CONDITIONS

**Rationale:**
TechVenture demonstrates strong product-market fit, defensible technology, and experienced leadership. Unit economics support venture-scale growth. The $5M Series A is appropriately sized for the 24-month execution plan.

**Key Thesis Points:**
1. Large, underserved market with validated demand
2. Technical moat through proprietary ML and data
3. Clear path to $10M ARR within 24 months
4. Multiple exit opportunities (strategic acquisition likely)

**Risk Acknowledgment:**
- Execution risk on hiring and market expansion
- Competitive response possible but manageable
- Economic sensitivity (mitigated by cost-saving value prop)

**Recommended Allocation:**
- $5M Series A at $20M pre-money
- 18-month runway post-raise
- Milestone-based tranching optional

---

## APPENDIX: SPRINT COMPLETION STATUS

| Step | Name | Status | Output |
|------|------|--------|--------|
| 0 | Executive Brief | ✅ COMPLETE | 7-section brief |
| 1 | Application Forms | ✅ COMPLETE | 360 SIS format |
| 2 | 40Q Diagnostic | ✅ COMPLETE | 3.6/5.0 score |
| 3 | 29Q Market Maturity | ✅ COMPLETE | 3.4/5.0 score |
| 4 | Legitimacy Worksheet | ✅ COMPLETE | 3.93/5.0 validated |
| 5 | Needs & Requesters | ✅ COMPLETE | 4 files generated |
| 6 | Persona Development | ✅ COMPLETE | 3 personas |
| 7 | Needs Qualification | ✅ COMPLETE | Matrix + priorities |
| 8 | Players & Influencers | ✅ COMPLETE | Ecosystem mapped |
| 9 | Value Network Map | ✅ COMPLETE | Network visualized |
| 10 | Diagnostic Comment | ✅ COMPLETE | Decision brief |
| 11 | Features-Needs Matrix | ✅ COMPLETE | MVP validated |
| 12 | Viability Assessment | ✅ COMPLETE | Conditional Go |

**SPRINT COMPLETE** ✅

Total Assessment Time: ~4 hours (vs. 2-3 weeks traditional)
Documents Generated: 13
Confidence Level: HIGH`,
};

// Main App Component
export default function VianeoSprintDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [stepOutputs, setStepOutputs] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [organizationBranch, setOrganizationBranch] = useState(null);
  const [showBranchSelector, setShowBranchSelector] = useState(false);
  const [demoMode, setDemoMode] = useState(true); // Demo mode by default

  // Handle file upload (demo mode simulates files)
  const handleFileUpload = useCallback((event) => {
    if (demoMode) {
      // Simulate file upload in demo mode
      setUploadedFiles([
        { name: 'TechVenture_PitchDeck.pdf', size: 2456789 },
        { name: 'Financial_Model_2024.xlsx', size: 1234567 },
        { name: 'Product_Overview.docx', size: 876543 },
      ]);
    } else {
      const files = Array.from(event.target.files);
      setUploadedFiles(prev => [...prev, ...files]);
    }
  }, [demoMode]);

  const removeFile = useCallback((index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Process current step (uses mock data in demo mode)
  const processStep = async () => {
    if (currentStep === 1 && !organizationBranch) {
      setShowBranchSelector(true);
      return;
    }

    setIsProcessing(true);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Use mock output
    setStepOutputs(prev => ({ ...prev, [currentStep]: MOCK_OUTPUTS[currentStep] }));
    setIsProcessing(false);
  };

  // Download output as markdown
  const downloadOutput = (stepId) => {
    const output = stepOutputs[stepId];
    if (!output) return;

    const step = STEPS.find(s => s.id === stepId);
    const filename = `Step_${stepId}_${step?.name.replace(/\s+/g, '_')}.md`;
    
    const blob = new Blob([output], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download all outputs
  const downloadAllOutputs = () => {
    const allContent = Object.entries(stepOutputs)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([stepId, output]) => {
        const step = STEPS.find(s => s.id === parseInt(stepId));
        return `# Step ${stepId}: ${step?.name}\n\n${output}`;
      })
      .join('\n\n---\n\n');

    const blob = new Blob([allContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'VIANEO_Sprint_Complete.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Auto-run all steps
  const runAllSteps = async () => {
    for (let i = 0; i <= 12; i++) {
      setCurrentStep(i);
      if (i === 1 && !organizationBranch) {
        setOrganizationBranch('360SIS');
      }
      setIsProcessing(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setStepOutputs(prev => ({ ...prev, [i]: MOCK_OUTPUTS[i] }));
      setIsProcessing(false);
    }
  };

  // Navigation
  const canProceed = stepOutputs[currentStep] !== undefined;
  const canGoBack = currentStep > 0;

  const goToNextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Calculate progress
  const completedSteps = Object.keys(stepOutputs).length;
  const progressPercent = Math.round((completedSteps / STEPS.length) * 100);

  // Current step info
  const currentStepInfo = STEPS[currentStep];
  const currentPhase = currentStepInfo?.phase;

  return (
    <div style={styles.container}>
      {/* Demo Banner */}
      {demoMode && (
        <div style={styles.demoBanner}>
          <span style={styles.demoIcon}>🎯</span>
          <span>DEMO MODE: Testing UI/UX flow with mock data</span>
          <button onClick={runAllSteps} style={styles.runAllButton}>
            ▶ Run All 13 Steps
          </button>
        </div>
      )}

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logoSection}>
            <div style={styles.logo}>V</div>
            <div>
              <h1 style={styles.title}>VIANEO Sprint Automator</h1>
              <p style={styles.subtitle}>Evidence-Based Business Validation</p>
            </div>
          </div>
          <div style={styles.progressSection}>
            <div style={styles.progressLabel}>
              Sprint Progress: {completedSteps}/{STEPS.length} steps
            </div>
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>
      </header>

      <div style={styles.mainLayout}>
        {/* Sidebar */}
        <aside style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <h2 style={styles.sidebarTitle}>Steps</h2>
          </div>
          
          {PHASES.map(phase => (
            <div key={phase} style={styles.phaseGroup}>
              <div style={{ ...styles.phaseLabel, backgroundColor: PHASE_COLORS[phase] }}>
                {phase}
              </div>
              {STEPS.filter(s => s.phase === phase).map(step => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  style={{
                    ...styles.stepButton,
                    ...(currentStep === step.id ? styles.stepButtonActive : {}),
                    ...(stepOutputs[step.id] ? styles.stepButtonComplete : {}),
                  }}
                >
                  <span style={styles.stepNumber}>{step.id}</span>
                  <span style={styles.stepName}>{step.name}</span>
                  {stepOutputs[step.id] && <span style={styles.checkmark}>✓</span>}
                </button>
              ))}
            </div>
          ))}

          {completedSteps > 0 && (
            <button onClick={downloadAllOutputs} style={styles.downloadAllButton}>
              ↓ Download All Outputs
            </button>
          )}
        </aside>

        {/* Main Content */}
        <main style={styles.mainContent}>
          {/* Step Header */}
          <div style={styles.stepHeader}>
            <div style={{ ...styles.phaseBadge, backgroundColor: PHASE_COLORS[currentPhase] }}>
              {currentPhase}
            </div>
            <h2 style={styles.stepTitle}>
              Step {currentStepInfo.id}: {currentStepInfo.name}
            </h2>
            <p style={styles.stepDescription}>{currentStepInfo.description}</p>
          </div>

          {/* Branch Selector for Step 1 */}
          {showBranchSelector && currentStep === 1 && (
            <div style={styles.branchSelector}>
              <h3 style={styles.branchTitle}>Select Organization</h3>
              <p style={styles.branchDescription}>
                Choose the application format based on the program:
              </p>
              <div style={styles.branchButtons}>
                <button
                  onClick={() => {
                    setOrganizationBranch('CNEN');
                    setShowBranchSelector(false);
                  }}
                  style={styles.branchButton}
                >
                  <span style={styles.branchIcon}>🇧🇷</span>
                  <span style={styles.branchLabel}>CNEN</span>
                  <span style={styles.branchSub}>Brazil Nuclear Commission</span>
                </button>
                <button
                  onClick={() => {
                    setOrganizationBranch('360SIS');
                    setShowBranchSelector(false);
                  }}
                  style={styles.branchButton}
                >
                  <span style={styles.branchIcon}>🌍</span>
                  <span style={styles.branchLabel}>360 SIS</span>
                  <span style={styles.branchSub}>Social Impact Studios</span>
                </button>
              </div>
            </div>
          )}

          {/* File Upload (Step 0) */}
          {currentStep === 0 && (
            <div style={styles.uploadSection}>
              <h3 style={styles.sectionTitle}>Upload Source Materials</h3>
              <div style={styles.uploadZone}>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                  onChange={handleFileUpload}
                  style={styles.fileInput}
                  id="file-upload"
                />
                <label htmlFor="file-upload" style={styles.uploadLabel}>
                  <span style={styles.uploadIcon}>📄</span>
                  <span style={styles.uploadText}>
                    {demoMode ? 'Click to simulate file upload' : 'Drop files or click to upload'}
                  </span>
                  <span style={styles.uploadHint}>PDF, DOCX, PPTX, XLSX supported</span>
                </label>
              </div>

              {uploadedFiles.length > 0 && (
                <div style={styles.fileList}>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} style={styles.fileItem}>
                      <span style={styles.fileName}>{file.name}</span>
                      <span style={styles.fileSize}>
                        {(file.size / 1024).toFixed(1)} KB
                      </span>
                      <button
                        onClick={() => removeFile(index)}
                        style={styles.removeFileButton}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Process Button */}
          <div style={styles.processSection}>
            <button
              onClick={processStep}
              disabled={isProcessing || (currentStep === 0 && uploadedFiles.length === 0)}
              style={{
                ...styles.processButton,
                ...(isProcessing || (currentStep === 0 && uploadedFiles.length === 0) 
                  ? styles.processButtonDisabled : {}),
              }}
            >
              {isProcessing ? (
                <>
                  <span style={styles.spinner} />
                  Processing Step {currentStep}...
                </>
              ) : (
                `Execute Step ${currentStep}: ${currentStepInfo.name}`
              )}
            </button>
          </div>

          {/* Output Display */}
          {stepOutputs[currentStep] && (
            <div style={styles.outputSection}>
              <div style={styles.outputHeader}>
                <h3 style={styles.sectionTitle}>Output</h3>
                <button
                  onClick={() => downloadOutput(currentStep)}
                  style={styles.downloadButton}
                >
                  ↓ Download
                </button>
              </div>
              <div style={styles.outputContent}>
                <pre style={styles.outputText}>{stepOutputs[currentStep]}</pre>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={styles.navigation}>
            <button
              onClick={goToPreviousStep}
              disabled={!canGoBack}
              style={{
                ...styles.navButton,
                ...(!canGoBack ? styles.navButtonDisabled : {}),
              }}
            >
              ← Previous Step
            </button>
            <button
              onClick={goToNextStep}
              disabled={!canProceed || currentStep >= STEPS.length - 1}
              style={{
                ...styles.navButton,
                ...styles.navButtonPrimary,
                ...(!canProceed || currentStep >= STEPS.length - 1 ? styles.navButtonDisabled : {}),
              }}
            >
              Next Step →
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

// Styles
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#F8F9FA',
    fontFamily: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  demoBanner: {
    backgroundColor: '#FEF3C7',
    borderBottom: '2px solid #F59E0B',
    padding: '12px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#92400E',
  },
  demoIcon: {
    fontSize: '18px',
  },
  runAllButton: {
    marginLeft: '16px',
    padding: '6px 16px',
    backgroundColor: '#0D4F4F',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#0D3B3B',
    color: 'white',
    padding: '16px 24px',
    borderBottom: '3px solid #1A6B6B',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  logo: {
    width: '48px',
    height: '48px',
    backgroundColor: '#1A6B6B',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: '700',
    color: '#E0F2F2',
  },
  title: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '600',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    margin: '2px 0 0',
    fontSize: '13px',
    opacity: 0.8,
  },
  progressSection: {
    textAlign: 'right',
  },
  progressLabel: {
    fontSize: '13px',
    marginBottom: '6px',
    opacity: 0.9,
  },
  progressBar: {
    width: '200px',
    height: '6px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3A9F9F',
    transition: 'width 0.3s ease',
  },
  mainLayout: {
    display: 'flex',
    maxWidth: '1400px',
    margin: '0 auto',
    minHeight: 'calc(100vh - 100px)',
  },
  sidebar: {
    width: '280px',
    backgroundColor: 'white',
    borderRight: '1px solid #E5E7EB',
    padding: '20px 0',
    overflowY: 'auto',
  },
  sidebarHeader: {
    padding: '0 20px 16px',
    borderBottom: '1px solid #E5E7EB',
  },
  sidebarTitle: {
    margin: 0,
    fontSize: '14px',
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  phaseGroup: {
    padding: '16px 12px 8px',
  },
  phaseLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: 'white',
    padding: '4px 10px',
    borderRadius: '4px',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  stepButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.15s ease',
    marginBottom: '2px',
  },
  stepButtonActive: {
    backgroundColor: '#E0F2F2',
    borderLeft: '3px solid #0D4F4F',
  },
  stepButtonComplete: {
    backgroundColor: '#F0FDF4',
  },
  stepNumber: {
    width: '24px',
    height: '24px',
    backgroundColor: '#E5E7EB',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '600',
    color: '#374151',
  },
  stepName: {
    flex: 1,
    fontSize: '13px',
    color: '#374151',
    fontWeight: '500',
  },
  checkmark: {
    color: '#10B981',
    fontSize: '16px',
    fontWeight: '700',
  },
  downloadAllButton: {
    width: 'calc(100% - 24px)',
    margin: '16px 12px',
    padding: '12px',
    backgroundColor: '#0D4F4F',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
  },
  mainContent: {
    flex: 1,
    padding: '24px 32px',
    overflowY: 'auto',
  },
  stepHeader: {
    marginBottom: '24px',
  },
  phaseBadge: {
    display: 'inline-block',
    fontSize: '11px',
    fontWeight: '600',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '4px',
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  stepTitle: {
    margin: '0 0 8px',
    fontSize: '24px',
    fontWeight: '600',
    color: '#111827',
    letterSpacing: '-0.02em',
  },
  stepDescription: {
    margin: 0,
    fontSize: '16px',
    color: '#6B7280',
  },
  branchSelector: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    border: '2px solid #E5E7EB',
  },
  branchTitle: {
    margin: '0 0 8px',
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
  },
  branchDescription: {
    margin: '0 0 20px',
    fontSize: '14px',
    color: '#6B7280',
  },
  branchButtons: {
    display: 'flex',
    gap: '16px',
  },
  branchButton: {
    flex: 1,
    padding: '20px',
    backgroundColor: '#F9FAFB',
    border: '2px solid #E5E7EB',
    borderRadius: '12px',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.15s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  branchIcon: {
    fontSize: '32px',
  },
  branchLabel: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
  },
  branchSub: {
    fontSize: '12px',
    color: '#6B7280',
  },
  uploadSection: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    border: '1px solid #E5E7EB',
  },
  sectionTitle: {
    margin: '0 0 16px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
  },
  uploadZone: {
    position: 'relative',
  },
  fileInput: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer',
  },
  uploadLabel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px',
    backgroundColor: '#F9FAFB',
    border: '2px dashed #D1D5DB',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  uploadIcon: {
    fontSize: '40px',
    marginBottom: '12px',
  },
  uploadText: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '4px',
  },
  uploadHint: {
    fontSize: '13px',
    color: '#9CA3AF',
  },
  fileList: {
    marginTop: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  fileItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    backgroundColor: '#F9FAFB',
    borderRadius: '8px',
    gap: '12px',
  },
  fileName: {
    flex: 1,
    fontSize: '14px',
    color: '#374151',
    fontWeight: '500',
  },
  fileSize: {
    fontSize: '12px',
    color: '#9CA3AF',
  },
  removeFileButton: {
    width: '24px',
    height: '24px',
    backgroundColor: '#FEE2E2',
    color: '#DC2626',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  processSection: {
    marginBottom: '24px',
  },
  processButton: {
    width: '100%',
    padding: '16px 24px',
    backgroundColor: '#0D4F4F',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'all 0.15s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  processButtonDisabled: {
    backgroundColor: '#9CA3AF',
    cursor: 'not-allowed',
  },
  spinner: {
    width: '18px',
    height: '18px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: 'white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  outputSection: {
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid #E5E7EB',
    marginBottom: '24px',
    overflow: 'hidden',
  },
  outputHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid #E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  downloadButton: {
    padding: '8px 16px',
    backgroundColor: '#0D4F4F',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
  },
  outputContent: {
    padding: '20px',
    maxHeight: '500px',
    overflowY: 'auto',
  },
  outputText: {
    margin: 0,
    fontSize: '13px',
    lineHeight: '1.7',
    color: '#374151',
    whiteSpace: 'pre-wrap',
    fontFamily: "'IBM Plex Mono', monospace",
  },
  navigation: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    paddingTop: '24px',
    borderTop: '1px solid #E5E7EB',
  },
  navButton: {
    padding: '12px 24px',
    backgroundColor: 'white',
    color: '#374151',
    border: '1px solid #D1D5DB',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.15s ease',
  },
  navButtonPrimary: {
    backgroundColor: '#0D4F4F',
    color: 'white',
    border: 'none',
  },
  navButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
};

// Add keyframe animation for spinner
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono&display=swap');
  `;
  document.head.appendChild(styleSheet);
}