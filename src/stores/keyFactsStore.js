// ============================================
// Key Facts Store (PDR-002 Section 2.1)
// Zustand store with localStorage persistence for Key Facts
// ============================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Enforcement levels for Key Facts validation
 * @typedef {'strict' | 'warn' | 'soft'} EnforcementLevel
 */

/**
 * Fact categories for organizing Key Facts
 * @typedef {'market' | 'financials' | 'team' | 'technology' | 'traction' | 'competition' | 'risks' | 'validation'} FactCategory
 */

/**
 * Extraction methods for provenance tracking
 * @typedef {'ai' | 'pattern' | 'user'} ExtractionMethod
 */

/**
 * Change source tracking
 * @typedef {'ai' | 'user' | 'sync' | 'conflict_resolution'} ChangeSource
 */

// ============================================
// Helper Functions
// ============================================

/**
 * Create a new KeyFact with proper defaults
 * @param {Object} params - Fact parameters
 * @returns {Object} KeyFact object
 */
const createKeyFact = ({
  key,
  value,
  displayValue,
  category,
  sourceStepId,
  confidence = 0.5,
  provenance = null,
  isCanonical = false,
  enforcement = 'warn',
}) => {
  const now = new Date().toISOString();
  return {
    key,
    value,
    displayValue: displayValue || String(value),
    category,
    sourceStepId,
    confidence,
    provenance,
    metadata: {
      isCanonical,
      enforcement,
      userVerified: false,
      version: 1,
      lastModified: now,
    },
    history: [],
  };
};

/**
 * Add history entry when a fact is updated
 * @param {Object} fact - Existing fact
 * @param {*} newValue - New value
 * @param {ChangeSource} changedBy - Who made the change
 * @param {string} [changeReason] - Optional reason
 * @returns {Object} History entry
 */
const createHistoryEntry = (fact, changedBy, changeReason = null) => ({
  timestamp: new Date().toISOString(),
  previousValue: fact.value,
  changedBy,
  changeReason,
});

/**
 * Resolve conflict between existing and new fact
 * @param {Object} existingFact - Existing fact
 * @param {Object} newFact - New fact to merge
 * @param {'user_override_wins' | 'confidence_wins' | 'latest_wins'} strategy - Resolution strategy
 * @returns {Object} Resolved fact
 */
const resolveConflict = (existingFact, newFact, strategy = 'confidence_wins') => {
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
    case 'user_override_wins':
    default:
      return existingFact;
  }
};

// ============================================
// Zustand Store Definition
// ============================================

/**
 * Key Facts Store
 * Manages structured facts extracted from step outputs with provenance tracking
 */
export const useKeyFactsStore = create(
  persist(
    (set, get) => ({
      // ============================================
      // State
      // ============================================

      /** @type {Record<string, Object>} Map of fact key to KeyFact object */
      facts: {},

      /** @type {string | null} Current project ID */
      projectId: null,

      // ============================================
      // Actions
      // ============================================

      /**
       * Set or create a fact
       * @param {Object} factData - Fact data to set
       */
      setFact: (factData) => {
        const { facts } = get();
        const existingFact = facts[factData.key];

        let newFact;
        if (existingFact) {
          // Update existing fact
          const historyEntry = createHistoryEntry(existingFact, 'ai', 'Updated by AI extraction');
          newFact = {
            ...existingFact,
            value: factData.value,
            displayValue: factData.displayValue || String(factData.value),
            confidence: factData.confidence ?? existingFact.confidence,
            provenance: factData.provenance ?? existingFact.provenance,
            metadata: {
              ...existingFact.metadata,
              version: existingFact.metadata.version + 1,
              lastModified: new Date().toISOString(),
            },
            history: [...existingFact.history, historyEntry],
          };

          // Apply conflict resolution
          newFact = resolveConflict(existingFact, newFact);
        } else {
          // Create new fact
          newFact = createKeyFact(factData);
        }

        set((state) => ({
          facts: {
            ...state.facts,
            [factData.key]: newFact,
          },
        }));
      },

      /**
       * Update an existing fact's value
       * @param {string} key - Fact key
       * @param {*} value - New value
       * @param {ChangeSource} changedBy - Who made the change
       * @param {string} [changeReason] - Optional reason
       */
      updateFact: (key, value, changedBy = 'user', changeReason = null) => {
        const { facts } = get();
        const existingFact = facts[key];

        if (!existingFact) {
          console.warn(`Attempted to update non-existent fact: ${key}`);
          return;
        }

        // Canonical facts can only be updated by user
        if (existingFact.metadata.isCanonical && changedBy !== 'user') {
          console.warn(`Attempted to auto-update canonical fact: ${key}`);
          return;
        }

        const historyEntry = createHistoryEntry(existingFact, changedBy, changeReason);

        set((state) => ({
          facts: {
            ...state.facts,
            [key]: {
              ...existingFact,
              value,
              displayValue: String(value),
              metadata: {
                ...existingFact.metadata,
                version: existingFact.metadata.version + 1,
                lastModified: new Date().toISOString(),
                userVerified: changedBy === 'user' ? true : existingFact.metadata.userVerified,
              },
              history: [...existingFact.history, historyEntry],
            },
          },
        }));
      },

      /**
       * Get a fact by key
       * @param {string} key - Fact key
       * @returns {Object | null} The fact or null
       */
      getFact: (key) => {
        return get().facts[key] || null;
      },

      /**
       * Get all facts in a category
       * @param {FactCategory} category - Category to filter by
       * @returns {Object[]} Array of facts in the category
       */
      getFactsByCategory: (category) => {
        const { facts } = get();
        return Object.values(facts).filter((fact) => fact.category === category);
      },

      /**
       * Get all facts from a specific step
       * @param {number} stepId - Step ID
       * @returns {Object[]} Array of facts from the step
       */
      getFactsByStep: (stepId) => {
        const { facts } = get();
        return Object.values(facts).filter((fact) => fact.sourceStepId === stepId);
      },

      /**
       * Get all canonical facts
       * @returns {Object[]} Array of canonical facts
       */
      getCanonicalFacts: () => {
        const { facts } = get();
        return Object.values(facts).filter((fact) => fact.metadata.isCanonical);
      },

      /**
       * Get all facts as formatted context string
       * @param {FactCategory} [filterCategory] - Optional category filter
       * @returns {string} Formatted facts string for context injection
       */
      getFactsAsContext: (filterCategory = null) => {
        const { facts } = get();
        let factsList = Object.values(facts);

        if (filterCategory) {
          factsList = factsList.filter((fact) => fact.category === filterCategory);
        }

        if (factsList.length === 0) {
          return '';
        }

        // Group by category
        const grouped = factsList.reduce((acc, fact) => {
          if (!acc[fact.category]) {
            acc[fact.category] = [];
          }
          acc[fact.category].push(fact);
          return acc;
        }, {});

        // Format as markdown
        const sections = Object.entries(grouped).map(([category, categoryFacts]) => {
          const factLines = categoryFacts
            .map((f) => `- **${f.key}**: ${f.displayValue} (confidence: ${Math.round(f.confidence * 100)}%)`)
            .join('\n');
          return `### ${category.charAt(0).toUpperCase() + category.slice(1)}\n${factLines}`;
        });

        return `## Key Facts\n\n${sections.join('\n\n')}`;
      },

      /**
       * Bulk set multiple facts at once (typically from AI extraction)
       * @param {Object} factsObject - Object with key-value pairs of facts
       * @param {number} sourceStepId - Step that extracted these facts
       * @param {FactCategory} [defaultCategory] - Default category for facts
       */
      bulkSetFacts: (factsObject, sourceStepId, defaultCategory = 'validation') => {
        Object.entries(factsObject).forEach(([key, factData]) => {
          const category = factData.category || inferCategory(key) || defaultCategory;

          get().setFact({
            key,
            value: factData.value,
            displayValue: factData.displayValue || String(factData.value),
            category,
            sourceStepId,
            confidence: factData.confidence ?? 0.5,
            provenance: factData.provenance ?? {
              extractionMethod: 'ai',
            },
            isCanonical: factData.isCanonical ?? false,
            enforcement: factData.enforcement ?? 'warn',
          });
        });
      },

      /**
       * Mark a fact as verified by user
       * @param {string} key - Fact key
       */
      verifyFact: (key) => {
        const { facts } = get();
        const existingFact = facts[key];

        if (!existingFact) {
          return;
        }

        set((state) => ({
          facts: {
            ...state.facts,
            [key]: {
              ...existingFact,
              metadata: {
                ...existingFact.metadata,
                userVerified: true,
                lastModified: new Date().toISOString(),
              },
            },
          },
        }));
      },

      /**
       * Delete a specific fact
       * @param {string} key - Fact key to delete
       */
      deleteFact: (key) => {
        set((state) => {
          const { [key]: _removed, ...remaining } = state.facts;
          return { facts: remaining };
        });
      },

      /**
       * Clear all facts (reset store)
       */
      clearFacts: () => {
        set({ facts: {}, projectId: null });
      },

      /**
       * Set project ID for the current facts
       * @param {string} projectId - Project ID
       */
      setProjectId: (projectId) => {
        set({ projectId });
      },

      /**
       * Get statistics about current facts
       * @returns {Object} Stats object
       */
      getStats: () => {
        const { facts } = get();
        const factsList = Object.values(facts);

        return {
          total: factsList.length,
          verified: factsList.filter((f) => f.metadata.userVerified).length,
          canonical: factsList.filter((f) => f.metadata.isCanonical).length,
          byCategory: factsList.reduce((acc, f) => {
            acc[f.category] = (acc[f.category] || 0) + 1;
            return acc;
          }, {}),
          averageConfidence: factsList.length > 0
            ? factsList.reduce((sum, f) => sum + f.confidence, 0) / factsList.length
            : 0,
        };
      },
    }),
    {
      name: 'vianeo-key-facts', // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        facts: state.facts,
        projectId: state.projectId,
      }),
    }
  )
);

// ============================================
// Category Inference Helper
// ============================================

/**
 * Infer category from fact key name
 * @param {string} key - Fact key
 * @returns {FactCategory | null} Inferred category
 */
const inferCategory = (key) => {
  const keyLower = key.toLowerCase();

  const categoryPatterns = {
    market: ['market', 'tam', 'sam', 'som', 'segment', 'audience', 'customer'],
    financials: ['revenue', 'funding', 'price', 'cost', 'margin', 'mrr', 'arr', 'ltv', 'cac'],
    team: ['team', 'founder', 'employee', 'role', 'experience'],
    technology: ['tech', 'trl', 'stack', 'platform', 'api', 'infrastructure'],
    traction: ['traction', 'user', 'pilot', 'customer_count', 'growth', 'retention'],
    competition: ['competitor', 'alternative', 'differentiat'],
    risks: ['risk', 'threat', 'dependency', 'compliance', 'regulatory'],
    validation: ['validated', 'interview', 'survey', 'feedback'],
  };

  for (const [category, patterns] of Object.entries(categoryPatterns)) {
    if (patterns.some((pattern) => keyLower.includes(pattern))) {
      return category;
    }
  }

  return null;
};

// ============================================
// Selectors (for optimized React re-renders)
// ============================================

export const selectFacts = (state) => state.facts;
export const selectProjectId = (state) => state.projectId;
export const selectFactsCount = (state) => Object.keys(state.facts).length;

// ============================================
// Export helper to parse Key Facts from AI output
// ============================================

/**
 * Parse Key Facts JSON block from AI output
 * @param {string} output - AI output text
 * @returns {Object | null} Parsed key_facts object or null
 */
export const parseKeyFactsFromOutput = (output) => {
  // Look for JSON code block with key_facts
  const jsonBlockMatch = output.match(/```json\s*([\s\S]*?)\s*```/);

  if (!jsonBlockMatch) {
    return null;
  }

  try {
    const parsed = JSON.parse(jsonBlockMatch[1]);
    return parsed.key_facts || parsed;
  } catch (e) {
    console.warn('Failed to parse Key Facts JSON block:', e);
    return null;
  }
};

export default useKeyFactsStore;
