// ============================================
// Config Context
// Centralized application settings management
// ============================================

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// Storage key for persisting settings
const STORAGE_KEY = 'vianeo_app_settings';

// Default configuration
const DEFAULT_CONFIG = {
  // UI Settings
  theme: 'light', // 'light' | 'dark' (future feature)
  sidebarCollapsed: false,
  showProcessingLog: true,

  // Assessment Settings
  defaultAssessmentMode: 'step-by-step', // 'step-by-step' | 'express'
  autoSaveEnabled: true,
  autoSaveInterval: 30000, // 30 seconds

  // Export Settings
  defaultExportFormat: 'md', // 'md' | 'html' | 'docx'
  includeTimestamps: true,

  // Advanced Settings
  debugMode: false,
  maxRetries: 3,
  apiTimeout: 120000, // 2 minutes
};

// Context
const ConfigContext = createContext(null);

/**
 * Config Provider Component
 * Provides centralized settings management with persistence
 */
export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(() => {
    // Load saved settings from localStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with defaults to handle new settings
        return { ...DEFAULT_CONFIG, ...parsed };
      }
    } catch (err) {
      console.warn('Failed to load saved settings:', err);
    }
    return DEFAULT_CONFIG;
  });

  // Persist settings to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (err) {
      console.warn('Failed to save settings:', err);
    }
  }, [config]);

  /**
   * Update a single setting
   */
  const setSetting = useCallback((key, value) => {
    setConfig((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  /**
   * Update multiple settings at once
   */
  const setSettings = useCallback((updates) => {
    setConfig((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  /**
   * Reset all settings to defaults
   */
  const resetSettings = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.warn('Failed to clear saved settings:', err);
    }
  }, []);

  /**
   * Get a specific setting with optional default
   */
  const getSetting = useCallback((key, defaultValue) => {
    return config[key] ?? defaultValue ?? DEFAULT_CONFIG[key];
  }, [config]);

  /**
   * Toggle a boolean setting
   */
  const toggleSetting = useCallback((key) => {
    setConfig((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  const value = {
    // Full config object
    config,

    // Individual getters/setters
    getSetting,
    setSetting,
    setSettings,
    toggleSetting,
    resetSettings,

    // Convenience accessors for common settings
    theme: config.theme,
    debugMode: config.debugMode,
    autoSaveEnabled: config.autoSaveEnabled,
  };

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
};

/**
 * Hook to access config context
 */
export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

/**
 * Hook to get a specific setting
 */
export const useSetting = (key, defaultValue) => {
  const { getSetting, setSetting } = useConfig();
  const value = getSetting(key, defaultValue);

  const setValue = useCallback(
    (newValue) => setSetting(key, newValue),
    [key, setSetting]
  );

  return [value, setValue];
};

export default ConfigContext;
