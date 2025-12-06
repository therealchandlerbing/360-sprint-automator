// ============================================
// Session Persistence Hook
// Handles localStorage save/restore
// ============================================

import { useEffect, useState, useCallback } from 'react';
import { STORAGE_KEYS } from '../constants/storage.js';
import { STEPS } from '../constants/steps.js';

// Helper functions for lazy initialization from localStorage
const getStoredProjectName = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.PROJECT_NAME) || '';
  } catch {
    return '';
  }
};

const getStoredInputContent = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.INPUT_CONTENT) || '';
  } catch {
    return '';
  }
};

const getStoredStepOutputs = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.STEP_OUTPUTS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error parsing saved step outputs:', err);
  }
  return {};
};

const getStoredBranch = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.ORGANIZATION_BRANCH) || null;
  } catch {
    return null;
  }
};

const getStoredCurrentStep = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_STEP);
    if (saved) {
      const step = parseInt(saved, 10);
      if (!isNaN(step) && step >= 0 && step < STEPS.length) {
        return step;
      }
    }
  } catch {
    // Ignore errors
  }
  return 0;
};

/**
 * Hook to manage session persistence with localStorage
 * Uses lazy initialization to restore state on mount
 * @returns {Object} Session state and management functions
 */
export const useSessionPersistence = () => {
  // Use lazy initialization to restore state from localStorage
  const [currentStep, setCurrentStep] = useState(getStoredCurrentStep);
  const [inputContent, setInputContent] = useState(getStoredInputContent);
  const [stepOutputs, setStepOutputs] = useState(getStoredStepOutputs);
  const [organizationBranch, setOrganizationBranch] = useState(getStoredBranch);
  const [projectName, setProjectName] = useState(getStoredProjectName);
  const [isSessionLoaded] = useState(true);

  // Auto-save to localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECT_NAME, projectName);
      localStorage.setItem(STORAGE_KEYS.INPUT_CONTENT, inputContent);
      localStorage.setItem(STORAGE_KEYS.STEP_OUTPUTS, JSON.stringify(stepOutputs));
      localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, String(currentStep));
      localStorage.setItem(STORAGE_KEYS.LAST_SAVED, new Date().toISOString());
      // Handle organizationBranch - remove from storage if null, otherwise save
      if (organizationBranch) {
        localStorage.setItem(STORAGE_KEYS.ORGANIZATION_BRANCH, organizationBranch);
      } else {
        localStorage.removeItem(STORAGE_KEYS.ORGANIZATION_BRANCH);
      }
    } catch (err) {
      console.error('Error saving session to localStorage:', err);
    }
  }, [projectName, inputContent, stepOutputs, currentStep, organizationBranch]);

  // Warn before closing with unsaved work
  useEffect(() => {
    const hasUnsavedWork = Object.keys(stepOutputs).length > 0 || inputContent.trim().length > 0;

    const handleBeforeUnload = (e) => {
      if (hasUnsavedWork) {
        e.preventDefault();
        e.returnValue = 'You have unsaved work. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [stepOutputs, inputContent]);

  // Export session as JSON
  const exportSession = useCallback(() => {
    const date = new Date().toISOString().split('T')[0];
    const safeName = (projectName || 'Project').replace(/\s+/g, '_');

    const sessionData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      projectName: projectName,
      organizationBranch: organizationBranch,
      currentStep: currentStep,
      stepOutputs: stepOutputs,
      inputContent: inputContent
    };

    const blob = new Blob([JSON.stringify(sessionData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeName}_session_${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [projectName, organizationBranch, currentStep, stepOutputs, inputContent]);

  // Import session from JSON file
  const importSession = useCallback((file, onSuccess, onError) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const sessionData = JSON.parse(e.target.result);

        // Validate session data
        if (
          !sessionData.version ||
          typeof sessionData.stepOutputs !== 'object' ||
          sessionData.stepOutputs === null ||
          Array.isArray(sessionData.stepOutputs)
        ) {
          onError?.('Invalid session file format or missing critical data');
          return;
        }

        // Restore session state
        setProjectName(sessionData.projectName ?? '');
        setOrganizationBranch(sessionData.organizationBranch ?? null);
        setInputContent(sessionData.inputContent ?? '');
        setStepOutputs(sessionData.stepOutputs);

        // Validate currentStep range before setting
        if (
          typeof sessionData.currentStep === 'number' &&
          sessionData.currentStep >= 0 &&
          sessionData.currentStep < STEPS.length
        ) {
          setCurrentStep(sessionData.currentStep);
        }

        onSuccess?.(`Session restored from ${file.name}`);
      } catch (err) {
        onError?.(`Failed to import session: ${err.message}`);
      }
    };
    reader.readAsText(file);
  }, []);

  // Clear session from localStorage and reset state
  const clearSession = useCallback(() => {
    if (!window.confirm('Are you sure you want to clear all session data? This cannot be undone.')) {
      return false;
    }

    // Clear localStorage
    try {
      Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    } catch (err) {
      console.error('Error clearing localStorage:', err);
    }

    // Reset state
    setProjectName('');
    setInputContent('');
    setStepOutputs({});
    setCurrentStep(0);
    setOrganizationBranch(null);

    return true;
  }, []);

  return {
    // State
    currentStep,
    setCurrentStep,
    inputContent,
    setInputContent,
    stepOutputs,
    setStepOutputs,
    organizationBranch,
    setOrganizationBranch,
    projectName,
    setProjectName,
    isSessionLoaded,

    // Actions
    exportSession,
    importSession,
    clearSession,
  };
};
