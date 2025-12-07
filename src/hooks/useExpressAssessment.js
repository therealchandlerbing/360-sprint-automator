// ============================================
// useExpressAssessment Hook
// Handles all Express Assessment Mode logic
// ============================================

import { useState, useCallback, useRef, useEffect } from 'react';
import { getExpressModePrompts, validateExpressAssessment } from '../constants/expressPrompt.js';
import { getExpressV2Prompts, validateExpressV2Assessment, calculateOverallScore, getGateRecommendation } from '../constants/expressPromptV2.js';
import { generateDOCXReport, downloadDOCX, generateFilename } from '../utils/docxGenerator.js';
import { generateDashboardHTML, generateDashboardFilename } from '../utils/dashboardGenerator.js';
import { downloadHTMLReport, printHTMLReport } from '../utils/pdfGeneratorV2.js';
import { parseLLMJson, extractResponseText } from '../utils/jsonParser.js';

/**
 * Initial state for Express Assessment
 */
const INITIAL_EXPRESS_STATE = {
  status: 'idle', // 'idle' | 'processing' | 'generating-report' | 'complete' | 'error'
  progress: {
    stage: null,
    percentage: 0,
    message: '',
  },
  startTime: null,
  outputs: {
    assessmentData: null,
    reportBlob: null,
    reportURL: null,
  },
  error: null,
};

/**
 * Initial state for Dashboard
 */
const INITIAL_DASHBOARD_STATE = {
  status: 'not-started', // 'not-started' | 'processing' | 'complete' | 'error'
  outputs: {
    dashboardBlob: null,
    dashboardURL: null,
  },
};

/**
 * Custom hook for Express Assessment Mode
 *
 * @param {object} params - Hook parameters
 * @param {string} params.projectName - Current project name
 * @param {string} params.inputContent - User input content
 * @param {function} params.callClaudeAPI - Claude API call function
 * @param {function} params.setError - Error state setter from parent
 * @param {object} params.toast - Optional toast notification object { success, error, info }
 * @returns {object} Express assessment state and handlers
 */
export function useExpressAssessment({ projectName, inputContent, callClaudeAPI, setError }) {
  // Express Assessment state
  const [expressAssessment, setExpressAssessment] = useState(INITIAL_EXPRESS_STATE);

  // Dashboard state
  const [dashboard, setDashboard] = useState(INITIAL_DASHBOARD_STATE);

  // Abort ref for cancellation
  const abortRef = useRef(false);

  // Cleanup URLs on unmount to prevent memory leaks
  useEffect(() => {
    const reportURL = expressAssessment.outputs.reportURL;
    const dashboardURL = dashboard.outputs.dashboardURL;

    return () => {
      if (reportURL) {
        URL.revokeObjectURL(reportURL);
      }
      if (dashboardURL) {
        URL.revokeObjectURL(dashboardURL);
      }
    };
  }, [expressAssessment.outputs.reportURL, dashboard.outputs.dashboardURL]);

  /**
   * Progress stage matchers - data-driven approach for maintainability
   * Each entry: { keywords: string[], percentage: number, stage: string }
   * Order matters: first match wins
   */
  const PROGRESS_MATCHERS = [
    { keywords: ['viability', 'gate'], percentage: 85, stage: 'viability' },
    { keywords: ['features', 'matrix'], percentage: 80, stage: 'synthesis' },
    { keywords: ['synthesis', 'diagnostic comment'], percentage: 70, stage: 'synthesis' },
    { keywords: ['persona', 'ecosystem'], percentage: 55, stage: 'deep-dive' },
    { keywords: ['legitimacy', 'needs'], percentage: 45, stage: 'deep-dive' },
    { keywords: ['maturity', 'market'], percentage: 35, stage: 'deep-dive' },
    { keywords: ['diagnostic', '40Q'], percentage: 25, stage: 'foundation' },
  ];

  /**
   * Determine progress stage and percentage from API message
   */
  const parseProgressFromMessage = useCallback((message) => {
    const lowerMessage = message.toLowerCase();

    for (const matcher of PROGRESS_MATCHERS) {
      if (matcher.keywords.some(kw => lowerMessage.includes(kw.toLowerCase()))) {
        return { percentage: matcher.percentage, stage: matcher.stage };
      }
    }

    // Default values if no match found
    return { percentage: 15, stage: 'foundation' };
  }, []);

  /**
   * Process Express Assessment
   */
  const processExpressAssessment = useCallback(async () => {
    if (!inputContent.trim()) {
      setError('Please upload files or paste content to analyze');
      return;
    }

    abortRef.current = false;

    // Initialize processing state
    setExpressAssessment({
      status: 'processing',
      progress: { stage: 'foundation', percentage: 5, message: 'Starting comprehensive VIANEO assessment...' },
      startTime: Date.now(),
      outputs: { assessmentData: null, reportBlob: null, reportURL: null },
      error: null,
    });
    setDashboard(INITIAL_DASHBOARD_STATE);
    setError(null);

    try {
      // Get the Express mode prompts
      const { systemPrompt, userPrompt } = getExpressModePrompts(projectName, inputContent);

      // Update progress: Foundation phase
      setExpressAssessment(prev => ({
        ...prev,
        progress: { stage: 'foundation', percentage: 10, message: 'Analyzing executive brief and diagnostic data...' },
      }));

      // Create progress update handler
      const progressHandler = (message) => {
        if (abortRef.current) return;

        const { percentage, stage } = parseProgressFromMessage(message);

        setExpressAssessment(prev => ({
          ...prev,
          progress: { stage, percentage, message: message.substring(0, 100) },
        }));
      };

      // Call Claude API with Express mode prompt
      const data = await callClaudeAPI(systemPrompt, userPrompt, progressHandler);

      if (abortRef.current) {
        setExpressAssessment(prev => ({ ...prev, status: 'idle' }));
        return;
      }

      // Extract the text response
      const responseText = extractResponseText(data);

      // Update progress: Parsing response
      setExpressAssessment(prev => ({
        ...prev,
        progress: { stage: 'viability', percentage: 90, message: 'Parsing assessment data...' },
      }));

      // Parse JSON from response using robust parser
      let assessmentData;
      try {
        assessmentData = parseLLMJson(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        // Include response preview for debugging (first 200 chars)
        const preview = responseText.substring(0, 200).replace(/\n/g, ' ');
        throw new Error(
          `Failed to parse assessment data. The AI response was not in the expected JSON format. ` +
          `Response preview: "${preview}${responseText.length > 200 ? '...' : ''}"`
        );
      }

      // Validate the assessment data
      const validation = validateExpressAssessment(assessmentData);
      if (!validation.valid) {
        console.warn('Assessment validation warnings:', validation.warnings);
        console.error('Assessment validation errors:', validation.errors);
      }

      if (abortRef.current) {
        setExpressAssessment(prev => ({ ...prev, status: 'idle' }));
        return;
      }

      // Update progress: Generating report
      setExpressAssessment(prev => ({
        ...prev,
        status: 'generating-report',
        progress: { stage: 'formatting', percentage: 95, message: 'Generating DOCX report...' },
        outputs: { ...prev.outputs, assessmentData },
      }));

      // Generate DOCX report
      const reportBlob = await generateDOCXReport(assessmentData);
      const reportURL = URL.createObjectURL(reportBlob);

      if (abortRef.current) {
        URL.revokeObjectURL(reportURL);
        setExpressAssessment(prev => ({ ...prev, status: 'idle' }));
        return;
      }

      // Complete!
      setExpressAssessment(prev => ({
        ...prev,
        status: 'complete',
        progress: { stage: 'formatting', percentage: 100, message: 'Assessment complete!' },
        outputs: {
          assessmentData,
          reportBlob,
          reportURL,
        },
      }));

    } catch (err) {
      console.error('Express assessment error:', err);
      setExpressAssessment(prev => ({
        ...prev,
        status: 'error',
        error: err.message || 'An unknown error occurred',
      }));
      setError(`Express Assessment Error: ${err.message}`);
    }
  }, [inputContent, projectName, callClaudeAPI, setError, parseProgressFromMessage]);

  /**
   * Cancel Express Assessment
   */
  const cancelExpressAssessment = useCallback(() => {
    abortRef.current = true;
    setExpressAssessment(prev => ({
      ...prev,
      status: 'idle',
      progress: { stage: null, percentage: 0, message: '' },
    }));
  }, []);

  /**
   * Download Express Report
   */
  const downloadExpressReport = useCallback(() => {
    const { reportBlob, assessmentData } = expressAssessment.outputs;
    if (!reportBlob) return;

    const date = assessmentData?.metadata?.assessmentDate || new Date().toISOString().split('T')[0];
    const filename = generateFilename(projectName || assessmentData?.metadata?.projectName, date);
    downloadDOCX(reportBlob, filename);
  }, [expressAssessment.outputs, projectName]);

  /**
   * Start New Express Assessment (reset state)
   */
  const startNewExpressAssessment = useCallback(() => {
    // Clean up existing URLs
    if (expressAssessment.outputs.reportURL) {
      URL.revokeObjectURL(expressAssessment.outputs.reportURL);
    }
    if (dashboard.outputs.dashboardURL) {
      URL.revokeObjectURL(dashboard.outputs.dashboardURL);
    }

    setExpressAssessment(INITIAL_EXPRESS_STATE);
    setDashboard(INITIAL_DASHBOARD_STATE);
  }, [expressAssessment.outputs.reportURL, dashboard.outputs.dashboardURL]);

  /**
   * Generate Dashboard HTML
   */
  const generateDashboard = useCallback(async () => {
    setDashboard(prev => ({ ...prev, status: 'processing' }));

    try {
      const { assessmentData } = expressAssessment.outputs;
      const dashboardBlob = generateDashboardHTML(assessmentData, projectName);
      const dashboardURL = URL.createObjectURL(dashboardBlob);

      setDashboard({
        status: 'complete',
        outputs: { dashboardBlob, dashboardURL },
      });
    } catch (err) {
      console.error('Dashboard generation error:', err);
      setDashboard(prev => ({ ...prev, status: 'error' }));
    }
  }, [expressAssessment.outputs, projectName]);

  /**
   * Download Dashboard HTML
   */
  const downloadDashboard = useCallback(() => {
    const { dashboardBlob } = dashboard.outputs;
    if (!dashboardBlob) return;

    const filename = generateDashboardFilename(projectName);
    const url = URL.createObjectURL(dashboardBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, [dashboard.outputs, projectName]);

  /**
   * Process Express V2 Assessment
   * Streamlined version with focused 5-dimension analysis
   */
  const processExpressV2Assessment = useCallback(async (formData) => {
    if (!formData.companyName || !formData.problem) {
      setError('Please provide at least a company name and problem statement');
      return;
    }

    abortRef.current = false;

    // Initialize processing state
    setExpressAssessment({
      status: 'processing',
      progress: { stage: 'foundation', percentage: 5, message: 'Starting VIANEO assessment...' },
      startTime: Date.now(),
      outputs: { assessmentData: null, reportBlob: null, reportURL: null },
      error: null,
    });
    setDashboard(INITIAL_DASHBOARD_STATE);
    setError(null);

    let progressInterval;

    try {
      // Get the Express V2 prompts
      const { systemPrompt, userPrompt } = getExpressV2Prompts(formData);

      // Update progress stages for V2
      const V2_PROGRESS_STAGES = [
        { percentage: 10, message: 'Analyzing Legitimacy & Market Validation...' },
        { percentage: 30, message: 'Evaluating Desirability & Product-Market Fit...' },
        { percentage: 50, message: 'Assessing Acceptability & Ecosystem Support...' },
        { percentage: 70, message: 'Determining Feasibility & Deliverability...' },
        { percentage: 85, message: 'Calculating Viability & Sustainability...' },
        { percentage: 90, message: 'Performing Cross-Dimensional Analysis...' },
      ];

      let currentStage = 0;
      progressInterval = setInterval(() => {
        if (abortRef.current || currentStage >= V2_PROGRESS_STAGES.length) {
          clearInterval(progressInterval);
          return;
        }
        setExpressAssessment(prev => ({
          ...prev,
          progress: {
            stage: 'processing',
            percentage: V2_PROGRESS_STAGES[currentStage].percentage,
            message: V2_PROGRESS_STAGES[currentStage].message,
          },
        }));
        currentStage++;
      }, 3000); // Update every 3 seconds

      // Call Claude API with Express V2 prompt
      // Note: Uses default max_tokens (16000) from API endpoint, which is fine for V2
      const data = await callClaudeAPI(systemPrompt, userPrompt, null);

      clearInterval(progressInterval);

      if (abortRef.current) {
        setExpressAssessment(prev => ({ ...prev, status: 'idle' }));
        return;
      }

      // Extract the text response
      const responseText = extractResponseText(data);

      // Update progress: Parsing response
      setExpressAssessment(prev => ({
        ...prev,
        progress: { stage: 'processing', percentage: 92, message: 'Parsing assessment data...' },
      }));

      // Parse JSON from response
      let assessmentData;
      try {
        assessmentData = parseLLMJson(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        const preview = responseText.substring(0, 200).replace(/\n/g, ' ');
        throw new Error(
          `Failed to parse assessment data. The AI response was not in the expected JSON format. ` +
          `Response preview: "${preview}${responseText.length > 200 ? '...' : ''}"`
        );
      }

      // Add computed fields
      assessmentData.companyName = formData.companyName;
      assessmentData.overallScore = calculateOverallScore(assessmentData.scores);
      assessmentData.gate = getGateRecommendation(assessmentData.overallScore);

      // Validate the assessment data
      const validation = validateExpressV2Assessment(assessmentData);
      if (!validation.valid) {
        console.warn('Assessment validation warnings:', validation.warnings);
        console.error('Assessment validation errors:', validation.errors);
      }

      if (abortRef.current) {
        setExpressAssessment(prev => ({ ...prev, status: 'idle' }));
        return;
      }

      // Update progress: Report ready
      setExpressAssessment(prev => ({
        ...prev,
        status: 'complete',
        progress: { stage: 'complete', percentage: 100, message: 'Assessment complete!' },
        outputs: { assessmentData, reportBlob: null, reportURL: null },
      }));

    } catch (err) {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      console.error('Express V2 assessment error:', err);
      setExpressAssessment(prev => ({
        ...prev,
        status: 'error',
        error: err.message || 'An unknown error occurred',
      }));
      setError(`Express V2 Assessment Error: ${err.message}`);
    }
  }, [callClaudeAPI, setError]);

  /**
   * Download Express V2 Report (HTML)
   */
  const downloadExpressV2Report = useCallback(() => {
    const { assessmentData } = expressAssessment.outputs;
    if (!assessmentData) return;

    downloadHTMLReport(assessmentData);
  }, [expressAssessment.outputs]);

  /**
   * Print Express V2 Report (open in print dialog)
   */
  const printExpressV2Report = useCallback(() => {
    const { assessmentData } = expressAssessment.outputs;
    if (!assessmentData) return;

    printHTMLReport(assessmentData);
  }, [expressAssessment.outputs]);

  return {
    // State
    expressAssessment,
    dashboard,

    // V1 Actions
    processExpressAssessment,
    cancelExpressAssessment,
    downloadExpressReport,
    startNewExpressAssessment,
    generateDashboard,
    downloadDashboard,

    // V2 Actions
    processExpressV2Assessment,
    downloadExpressV2Report,
    printExpressV2Report,
  };
}
