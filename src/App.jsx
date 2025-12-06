// ============================================
// VIANEO Sprint Automator - Main Application
// Refactored modular architecture with Express Mode
// ============================================

import React, { useState, useCallback, useRef } from 'react';
import JSZip from 'jszip';

// Constants
import { STEPS } from './constants/steps.js';
import { STEP_PROMPTS, injectDynamicValues } from './constants/prompts.js';
import { getExpressModePrompts, validateExpressAssessment } from './constants/expressPrompt.js';

// Utilities
import { markdownToHtml } from './utils/markdownToHtml.js';
import { HTML_TEMPLATE } from './utils/htmlTemplate.js';
import { generateDOCXReport, downloadDOCX, generateFilename } from './utils/docxGenerator.js';

// Styles
import { styles, responsiveStyles } from './styles/appStyles.js';

// Hooks
import { useSessionPersistence } from './hooks/useSessionPersistence.js';
import { useMobileMenu } from './hooks/useMobileMenu.js';
import { useClaudeAPI } from './hooks/useClaudeAPI.js';

// Components
import {
  Header,
  Sidebar,
  StepHeader,
  BranchSelector,
  InputSection,
  ProcessButton,
  ProcessingLog,
  OutputDisplay,
  Navigation,
  ErrorBox,
  ExpressModeSelector,
  ExpressProcessing,
  ExpressCompletion,
} from './components/index.js';

// ============================================
// Main Application Component
// ============================================

export default function VianeoSprintAutomator() {
  // Session persistence hook
  const {
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
    exportSession,
    importSession,
    clearSession,
  } = useSessionPersistence();

  // Mobile menu hook
  const {
    isMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
  } = useMobileMenu();

  // Claude API hook
  const { callClaudeAPI } = useClaudeAPI();

  // Local state
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingLog, setProcessingLog] = useState([]);
  const [showBranchSelector, setShowBranchSelector] = useState(false);
  const [error, setError] = useState(null);
  const [copyFeedback, setCopyFeedback] = useState(null);

  // Express Assessment Mode state
  const [assessmentMode, setAssessmentMode] = useState('step-by-step'); // 'step-by-step' | 'express'
  const [expressAssessment, setExpressAssessment] = useState({
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
  });
  const [dashboard, setDashboard] = useState({
    status: 'not-started', // 'not-started' | 'processing' | 'complete' | 'error'
    outputs: {
      dashboardBlob: null,
      dashboardURL: null,
    },
  });

  // Ref to track if Express mode should be cancelled
  const expressAbortRef = useRef(false);

  // Derived state
  const completedSteps = Object.keys(stepOutputs).length;
  const currentStepInfo = STEPS[currentStep];
  const currentPhase = currentStepInfo?.phase;
  const canProceed = stepOutputs[currentStep] !== undefined;

  // Logging helper
  const addLog = useCallback((message) => {
    setProcessingLog(prev => [...prev, { time: new Date().toLocaleTimeString(), message }]);
  }, []);

  // File upload handler
  const handleFileUpload = useCallback((fileData) => {
    setUploadedFiles(prev => [...prev, ...fileData]);
    const combined = fileData.map(f => `--- ${f.name} ---\n${f.content}`).join('\n\n');
    setInputContent(prev => prev + (prev ? '\n\n' : '') + combined);

    if (!projectName && fileData.length > 0) {
      setProjectName(fileData[0].name.split('.')[0].replace(/[_-]/g, ' '));
    }
  }, [projectName, setInputContent, setProjectName]);

  // Remove file handler
  const removeFile = useCallback((index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Build context for step prompts
  const buildContext = useCallback((stepId) => {
    const context = {};

    // Always include Step 0 for steps 1+
    if (stepId >= 1 && stepOutputs[0]) context.STEP_0_OUTPUT = stepOutputs[0];
    if (stepId >= 3 && stepOutputs[2]) context.STEP_2_OUTPUT = stepOutputs[2];
    if (stepId >= 4 && stepOutputs[3]) context.STEP_3_OUTPUT = stepOutputs[3];
    if (stepId >= 5 && stepOutputs[4]) context.STEP_4_OUTPUT = stepOutputs[4];
    if (stepId >= 6 && stepOutputs[5]) context.STEP_5_OUTPUT = stepOutputs[5];
    if (stepId >= 7 && stepOutputs[6]) context.STEP_6_OUTPUT = stepOutputs[6];
    if (stepId >= 9 && stepOutputs[8]) context.STEP_8_OUTPUT = stepOutputs[8];

    // Steps 10-12: aggregate ALL prior outputs
    if (stepId >= 10) {
      context.ALL_PRIOR_OUTPUTS = Object.entries(stepOutputs)
        .filter(([id]) => parseInt(id) < stepId)
        .sort(([a], [b]) => parseInt(a) - parseInt(b))
        .map(([id, output]) => `## Step ${id}: ${STEPS[parseInt(id)].name}\n\n${output}`)
        .join('\n\n---\n\n');
    }

    return context;
  }, [stepOutputs]);

  // Express Mode: Process comprehensive assessment
  const processExpressAssessment = useCallback(async () => {
    if (!inputContent.trim()) {
      setError('Please upload files or paste content to analyze');
      return;
    }

    expressAbortRef.current = false;

    // Initialize processing state
    setExpressAssessment({
      status: 'processing',
      progress: { stage: 'foundation', percentage: 5, message: 'Starting comprehensive VIANEO assessment...' },
      startTime: Date.now(),
      outputs: { assessmentData: null, reportBlob: null, reportURL: null },
      error: null,
    });
    setDashboard({ status: 'not-started', outputs: { dashboardBlob: null, dashboardURL: null } });
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
        if (expressAbortRef.current) return;

        // Parse progress from message if possible
        let percentage = 15;
        let stage = 'foundation';

        if (message.includes('diagnostic') || message.includes('40Q')) {
          percentage = 25;
          stage = 'foundation';
        } else if (message.includes('maturity') || message.includes('market')) {
          percentage = 35;
          stage = 'deep-dive';
        } else if (message.includes('legitimacy') || message.includes('needs')) {
          percentage = 45;
          stage = 'deep-dive';
        } else if (message.includes('persona') || message.includes('ecosystem')) {
          percentage = 55;
          stage = 'deep-dive';
        } else if (message.includes('synthesis') || message.includes('diagnostic comment')) {
          percentage = 70;
          stage = 'synthesis';
        } else if (message.includes('features') || message.includes('matrix')) {
          percentage = 80;
          stage = 'synthesis';
        } else if (message.includes('viability') || message.includes('gate')) {
          percentage = 85;
          stage = 'viability';
        }

        setExpressAssessment(prev => ({
          ...prev,
          progress: { stage, percentage, message: message.substring(0, 100) },
        }));
      };

      // Call Claude API with Express mode prompt
      const data = await callClaudeAPI(systemPrompt, userPrompt, progressHandler);

      if (expressAbortRef.current) {
        setExpressAssessment(prev => ({ ...prev, status: 'idle' }));
        return;
      }

      // Extract the text response
      const responseText = data.content
        .filter(item => item.type === 'text')
        .map(item => item.text)
        .join('\n');

      // Update progress: Parsing response
      setExpressAssessment(prev => ({
        ...prev,
        progress: { stage: 'viability', percentage: 90, message: 'Parsing assessment data...' },
      }));

      // Parse JSON from response
      let assessmentData;
      try {
        // Try to extract JSON from the response
        // Handle case where response might have markdown code blocks
        let jsonStr = responseText;

        // Remove markdown code blocks if present
        const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
          jsonStr = jsonMatch[1];
        }

        assessmentData = JSON.parse(jsonStr.trim());
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        // Try to recover by finding JSON-like content
        const jsonStart = responseText.indexOf('{');
        const jsonEnd = responseText.lastIndexOf('}');
        if (jsonStart !== -1 && jsonEnd !== -1) {
          try {
            assessmentData = JSON.parse(responseText.substring(jsonStart, jsonEnd + 1));
          } catch {
            throw new Error('Failed to parse assessment data. The AI response was not in the expected JSON format.');
          }
        } else {
          throw new Error('Failed to parse assessment data. The AI response was not in the expected JSON format.');
        }
      }

      // Validate the assessment data
      const validation = validateExpressAssessment(assessmentData);
      if (!validation.valid) {
        console.warn('Assessment validation warnings:', validation.warnings);
        console.error('Assessment validation errors:', validation.errors);
      }

      if (expressAbortRef.current) {
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

      if (expressAbortRef.current) {
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
  }, [inputContent, projectName, callClaudeAPI]);

  // Cancel Express assessment
  const cancelExpressAssessment = useCallback(() => {
    expressAbortRef.current = true;
    setExpressAssessment(prev => ({
      ...prev,
      status: 'idle',
      progress: { stage: null, percentage: 0, message: '' },
    }));
  }, []);

  // Download Express report
  const downloadExpressReport = useCallback(() => {
    const { reportBlob, assessmentData } = expressAssessment.outputs;
    if (!reportBlob) return;

    const date = assessmentData?.metadata?.assessmentDate || new Date().toISOString().split('T')[0];
    const filename = generateFilename(projectName || assessmentData?.metadata?.projectName, date);
    downloadDOCX(reportBlob, filename);
  }, [expressAssessment.outputs, projectName]);

  // Start new Express assessment
  const startNewExpressAssessment = useCallback(() => {
    // Clean up existing URLs
    if (expressAssessment.outputs.reportURL) {
      URL.revokeObjectURL(expressAssessment.outputs.reportURL);
    }
    if (dashboard.outputs.dashboardURL) {
      URL.revokeObjectURL(dashboard.outputs.dashboardURL);
    }

    setExpressAssessment({
      status: 'idle',
      progress: { stage: null, percentage: 0, message: '' },
      startTime: null,
      outputs: { assessmentData: null, reportBlob: null, reportURL: null },
      error: null,
    });
    setDashboard({ status: 'not-started', outputs: { dashboardBlob: null, dashboardURL: null } });
    setAssessmentMode('step-by-step');
  }, [expressAssessment.outputs.reportURL, dashboard.outputs.dashboardURL]);

  // Generate dashboard (placeholder - can be expanded later)
  const generateDashboard = useCallback(async () => {
    setDashboard(prev => ({ ...prev, status: 'processing' }));

    try {
      const { assessmentData } = expressAssessment.outputs;
      if (!assessmentData) {
        throw new Error('No assessment data available');
      }

      // Generate simple HTML dashboard
      const dashboardHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>360 Business Validation Dashboard - ${assessmentData.metadata?.projectName || 'Assessment'}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    .card { background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
  </style>
</head>
<body class="bg-gray-100 min-h-screen">
  <header class="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-6">
    <h1 class="text-2xl font-bold">360 Business Validation Dashboard</h1>
    <p class="text-gray-300">${assessmentData.metadata?.projectName || 'Assessment'} | ${assessmentData.metadata?.assessmentDate || new Date().toISOString().split('T')[0]}</p>
  </header>

  <main class="container mx-auto p-6">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="card p-6 text-center">
        <div class="text-4xl font-bold ${assessmentData.executiveSummary?.recommendation === 'GO' ? 'text-green-600' : assessmentData.executiveSummary?.recommendation === 'CONDITIONAL_GO' ? 'text-yellow-600' : 'text-red-600'}">
          ${assessmentData.executiveSummary?.recommendation?.replace('_', ' ') || 'N/A'}
        </div>
        <div class="text-gray-500 uppercase text-sm mt-2">Recommendation</div>
      </div>
      <div class="card p-6 text-center">
        <div class="text-4xl font-bold text-slate-800">${assessmentData.executiveSummary?.investmentReadinessScore || '--'}</div>
        <div class="text-gray-500 uppercase text-sm mt-2">Investment Readiness Score</div>
      </div>
      <div class="card p-6 text-center">
        <div class="text-4xl font-bold text-slate-800">${assessmentData.marketMaturity?.weightedOverall?.toFixed(1) || '--'}</div>
        <div class="text-gray-500 uppercase text-sm mt-2">Overall VIANEO Score</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card p-6">
        <h2 class="text-lg font-semibold mb-4">Diagnostic Scores</h2>
        <canvas id="diagnosticChart"></canvas>
      </div>
      <div class="card p-6">
        <h2 class="text-lg font-semibold mb-4">VIANEO Dimensions</h2>
        <canvas id="vianeoChart"></canvas>
      </div>
    </div>

    <div class="card p-6 mt-6">
      <h2 class="text-lg font-semibold mb-4">Key Strengths</h2>
      <ul class="space-y-2">
        ${(assessmentData.executiveSummary?.keyStrengths || []).map(s => `<li class="flex items-center gap-2"><span class="text-green-500">✓</span>${s}</li>`).join('')}
      </ul>
    </div>

    <div class="card p-6 mt-6">
      <h2 class="text-lg font-semibold mb-4">Critical Risks</h2>
      <ul class="space-y-2">
        ${(assessmentData.executiveSummary?.criticalRisks || []).map(r => `<li class="flex items-center gap-2"><span class="text-red-500">!</span>${r}</li>`).join('')}
      </ul>
    </div>
  </main>

  <script>
    const data = ${JSON.stringify(assessmentData)};

    // Diagnostic Chart
    const diagCtx = document.getElementById('diagnosticChart').getContext('2d');
    new Chart(diagCtx, {
      type: 'bar',
      data: {
        labels: ['Team', 'Technology', 'Management', 'Commercial'],
        datasets: [{
          label: 'Score',
          data: [
            data.diagnosticAssessment?.team?.score || 0,
            data.diagnosticAssessment?.technology?.score || 0,
            data.diagnosticAssessment?.management?.score || 0,
            data.diagnosticAssessment?.commercial?.score || 0
          ],
          backgroundColor: ['#0A2540', '#0D5A66', '#1E6B4F', '#7C3AED']
        }]
      },
      options: {
        scales: { y: { beginAtZero: true, max: 5 } },
        plugins: { legend: { display: false } }
      }
    });

    // VIANEO Radar Chart
    const vianeoCtx = document.getElementById('vianeoChart').getContext('2d');
    new Chart(vianeoCtx, {
      type: 'radar',
      data: {
        labels: ['Legitimacy', 'Desirability', 'Acceptability', 'Feasibility', 'Viability'],
        datasets: [{
          label: 'Score',
          data: [
            data.marketMaturity?.legitimacy?.score || 0,
            data.marketMaturity?.desirability?.score || 0,
            data.marketMaturity?.acceptability?.score || 0,
            data.marketMaturity?.feasibility?.score || 0,
            data.marketMaturity?.viability?.score || 0
          ],
          borderColor: '#00A3B5',
          backgroundColor: 'rgba(0, 163, 181, 0.2)'
        }, {
          label: 'Threshold',
          data: [3.0, 3.5, 3.0, 3.0, 3.0],
          borderColor: '#F59E0B',
          borderDash: [5, 5],
          backgroundColor: 'transparent'
        }]
      },
      options: {
        scales: { r: { beginAtZero: true, max: 5 } }
      }
    });
  </script>
</body>
</html>`;

      const dashboardBlob = new Blob([dashboardHTML], { type: 'text/html' });
      const dashboardURL = URL.createObjectURL(dashboardBlob);

      setDashboard({
        status: 'complete',
        outputs: { dashboardBlob, dashboardURL },
      });
    } catch (err) {
      console.error('Dashboard generation error:', err);
      setDashboard(prev => ({ ...prev, status: 'error' }));
    }
  }, [expressAssessment.outputs]);

  // Download dashboard
  const downloadDashboard = useCallback(() => {
    const { dashboardBlob } = dashboard.outputs;
    if (!dashboardBlob) return;

    const filename = `360_Dashboard_${(projectName || 'Assessment').replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
    const url = URL.createObjectURL(dashboardBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, [dashboard.outputs, projectName]);

  // Process current step
  const processStep = useCallback(async () => {
    if (currentStep === 1 && !organizationBranch) {
      setShowBranchSelector(true);
      return;
    }
    if (currentStep === 0 && !inputContent.trim()) {
      setError('Please upload files or paste content to analyze');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProcessingLog([]);
    addLog(`Starting Step ${currentStep}: ${STEPS[currentStep].name}`);

    try {
      const promptConfig = STEP_PROMPTS[currentStep];
      const context = buildContext(currentStep);

      let userPrompt = promptConfig.userPromptTemplate;
      if (currentStep === 0) {
        userPrompt = userPrompt.replace('{INPUT_CONTENT}', inputContent);
      } else if (currentStep === 1) {
        userPrompt = userPrompt.replace('{BRANCH}', organizationBranch);
        userPrompt = userPrompt.replace('{STEP_0_OUTPUT}', context.STEP_0_OUTPUT || '');
      } else {
        Object.entries(context).forEach(([key, value]) => {
          userPrompt = userPrompt.replace(`{${key}}`, value || '[Not available]');
        });
      }

      addLog('Sending request to Claude API...');

      const data = await callClaudeAPI(injectDynamicValues(promptConfig.systemPrompt), userPrompt, addLog);
      addLog('Response received, processing...');

      const output = data.content.filter(item => item.type === "text").map(item => item.text).join("\n");
      setStepOutputs(prev => ({ ...prev, [currentStep]: output }));
      addLog(`Step ${currentStep} complete!`);
    } catch (err) {
      setError(`Error: ${err.message}`);
      addLog(`Error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  }, [currentStep, inputContent, organizationBranch, buildContext, addLog, callClaudeAPI, setStepOutputs]);

  // Download single output as MD
  const downloadOutput = useCallback((stepId) => {
    const output = stepOutputs[stepId];
    if (!output) return;
    const step = STEPS[stepId];
    const date = new Date().toISOString().split('T')[0];
    const safeName = (projectName || 'Project').replace(/\s+/g, '_');
    const filename = `${safeName}_${date}${step.outputFile}.md`;
    const blob = new Blob([output], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, [stepOutputs, projectName]);

  // Download all outputs as MD
  const downloadAllOutputs = useCallback(() => {
    const date = new Date().toISOString().split('T')[0];
    const safeName = (projectName || 'Project').replace(/\s+/g, '_');
    const allContent = Object.entries(stepOutputs)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([stepId, output]) => `# Step ${stepId}: ${STEPS[parseInt(stepId)].name}\n\n${output}`)
      .join('\n\n---\n\n');
    const blob = new Blob([allContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeName}_${date}_VIANEO_Sprint_Complete.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [stepOutputs, projectName]);

  // Download single output as HTML
  const downloadOutputAsHtml = useCallback((stepId) => {
    const output = stepOutputs[stepId];
    if (!output) return;
    const step = STEPS[stepId];
    const date = new Date().toISOString().split('T')[0];
    const safeName = (projectName || 'Project').replace(/\s+/g, '_');
    const filename = `${safeName}_${date}${step.outputFile}.html`;
    const htmlContent = markdownToHtml(output);
    const fullHtml = HTML_TEMPLATE(htmlContent, `${projectName} - ${step.name}`, projectName || 'Project', step.name, date);
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, [stepOutputs, projectName]);

  // Download all outputs as HTML
  const downloadAllOutputsAsHtml = useCallback(() => {
    const date = new Date().toISOString().split('T')[0];
    const safeName = (projectName || 'Project').replace(/\s+/g, '_');
    const allContent = Object.entries(stepOutputs)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([stepId, output]) => `<section class="step-section"><h1>Step ${stepId}: ${STEPS[parseInt(stepId)].name}</h1>${markdownToHtml(output)}</section>`)
      .join('<hr class="step-divider">');
    const fullHtml = HTML_TEMPLATE(allContent, `${projectName} - Complete VIANEO Sprint`, projectName || 'Project', 'Complete Sprint', date);
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeName}_${date}_VIANEO_Sprint_Complete.html`;
    a.click();
    URL.revokeObjectURL(url);
  }, [stepOutputs, projectName]);

  // Download all outputs as ZIP
  const downloadAllAsZip = useCallback(async () => {
    try {
      const date = new Date().toISOString().split('T')[0];
      const timestamp = new Date().toISOString();
      const safeName = (projectName || 'Project').replace(/\s+/g, '_');

      const zip = new JSZip();

      const files = [];
      Object.entries(stepOutputs)
        .sort(([a], [b]) => parseInt(a) - parseInt(b))
        .forEach(([stepId, output]) => {
          const step = STEPS[parseInt(stepId)];
          const filename = `${step.outputFile.replace(/^_\d+/, '_' + String(stepId).padStart(2, '0'))}.md`;
          zip.file(filename, output);
          files.push({
            step: parseInt(stepId),
            filename: filename,
            size: output.length
          });
        });

      const manifest = {
        projectName: projectName || 'Project',
        generatedAt: timestamp,
        completedSteps: Object.keys(stepOutputs).map(id => parseInt(id)).sort((a, b) => a - b),
        organizationBranch: organizationBranch,
        totalSteps: STEPS.length,
        files: files
      };
      zip.file('_manifest.json', JSON.stringify(manifest, null, 2));

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${safeName}_VIANEO_Sprint_${date}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error creating ZIP bundle:', err);
      setError(`Failed to create ZIP bundle: ${err.message}`);
    }
  }, [stepOutputs, projectName, organizationBranch]);

  // Copy output to clipboard (modern API only)
  const copyToClipboard = useCallback(async (stepId) => {
    const output = stepOutputs[stepId];
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output);
      setCopyFeedback(stepId);
      setTimeout(() => setCopyFeedback(null), 2000);
    } catch (err) {
      console.error('Clipboard copy failed:', err);
      setError('Failed to copy to clipboard. Please use HTTPS or localhost.');
    }
  }, [stepOutputs]);

  // Handle session import
  const handleImportSession = useCallback((file) => {
    importSession(
      file,
      (message) => {
        setError(null);
        setProcessingLog([{ time: new Date().toLocaleTimeString(), message }]);
        setUploadedFiles([]);
      },
      (errorMessage) => {
        setError(errorMessage);
      }
    );
  }, [importSession]);

  // Handle session clear
  const handleClearSession = useCallback(() => {
    if (clearSession()) {
      setUploadedFiles([]);
      setProcessingLog([]);
      setError(null);
      setShowBranchSelector(false);
    }
  }, [clearSession]);

  // Branch selection handler
  const handleBranchSelect = useCallback((branchId) => {
    setOrganizationBranch(branchId);
    setShowBranchSelector(false);
  }, [setOrganizationBranch]);

  // Step selection handler
  const handleStepSelect = useCallback((stepId) => {
    setCurrentStep(stepId);
    closeMobileMenu();
  }, [setCurrentStep, closeMobileMenu]);

  // Navigation handlers
  const handlePrevious = useCallback(() => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  }, [setCurrentStep]);

  const handleNext = useCallback(() => {
    setCurrentStep(prev => Math.min(STEPS.length - 1, prev + 1));
  }, [setCurrentStep]);

  return (
    <div style={styles.container}>
      {/* Responsive CSS */}
      <style>{responsiveStyles}</style>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="mobile-overlay"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Header */}
      <Header
        completedSteps={completedSteps}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={toggleMobileMenu}
      />

      {/* Main Layout */}
      <div className="main-layout" style={styles.mainLayout}>
        {/* Sidebar */}
        <Sidebar
          currentStep={currentStep}
          stepOutputs={stepOutputs}
          completedSteps={completedSteps}
          inputContent={inputContent}
          isMobileMenuOpen={isMobileMenuOpen}
          onStepSelect={handleStepSelect}
          onDownloadAllAsZip={downloadAllAsZip}
          onDownloadAllOutputs={downloadAllOutputs}
          onDownloadAllOutputsAsHtml={downloadAllOutputsAsHtml}
          onExportSession={exportSession}
          onImportSession={handleImportSession}
          onClearSession={handleClearSession}
        />

        {/* Main Content */}
        <main style={styles.mainContent}>
          {/* Express Mode: Processing View */}
          {expressAssessment.status === 'processing' || expressAssessment.status === 'generating-report' ? (
            <ExpressProcessing
              projectName={projectName}
              progress={expressAssessment.progress}
              startTime={expressAssessment.startTime}
              onCancel={cancelExpressAssessment}
            />
          ) : expressAssessment.status === 'complete' ? (
            /* Express Mode: Completion View */
            <ExpressCompletion
              projectName={projectName}
              assessmentData={expressAssessment.outputs.assessmentData}
              reportBlob={expressAssessment.outputs.reportBlob}
              reportURL={expressAssessment.outputs.reportURL}
              dashboardStatus={dashboard.status}
              dashboardURL={dashboard.outputs.dashboardURL}
              completionTime={expressAssessment.startTime ? new Date().toLocaleString() : null}
              error={null}
              onDownloadReport={downloadExpressReport}
              onGenerateDashboard={generateDashboard}
              onDownloadDashboard={downloadDashboard}
              onStartNewAssessment={startNewExpressAssessment}
              onRetry={processExpressAssessment}
            />
          ) : expressAssessment.status === 'error' ? (
            /* Express Mode: Error View */
            <ExpressCompletion
              projectName={projectName}
              assessmentData={null}
              reportBlob={null}
              reportURL={null}
              dashboardStatus="not-started"
              dashboardURL={null}
              completionTime={null}
              error={expressAssessment.error}
              onDownloadReport={() => {}}
              onGenerateDashboard={() => {}}
              onDownloadDashboard={() => {}}
              onStartNewAssessment={startNewExpressAssessment}
              onRetry={processExpressAssessment}
            />
          ) : (
            /* Standard Mode: Step-by-Step View */
            <>
              {/* Step Header */}
              <StepHeader step={currentStepInfo} phase={currentPhase} />

              {/* Branch Selector (Step 1) */}
              {showBranchSelector && currentStep === 1 && (
                <BranchSelector onSelect={handleBranchSelect} />
              )}

              {/* Input Section (Step 0) */}
              {currentStep === 0 && (
                <>
                  <InputSection
                    projectName={projectName}
                    inputContent={inputContent}
                    uploadedFiles={uploadedFiles}
                    onProjectNameChange={setProjectName}
                    onInputContentChange={setInputContent}
                    onFileUpload={handleFileUpload}
                    onRemoveFile={removeFile}
                    onError={setError}
                  />

                  {/* Mode Selector (shown after user provides content) */}
                  {inputContent.trim() && projectName && (
                    <ExpressModeSelector
                      selectedMode={assessmentMode}
                      onModeChange={setAssessmentMode}
                      disabled={isProcessing}
                    />
                  )}
                </>
              )}

              {/* Error Display */}
              <ErrorBox error={error} />

              {/* Process Button - Different based on mode */}
              {assessmentMode === 'express' && currentStep === 0 && inputContent.trim() && projectName ? (
                <button
                  style={{
                    ...styles.processButton,
                    backgroundColor: '#00A3B5',
                    boxShadow: '0 4px 12px rgba(0, 163, 181, 0.3)',
                    ...(isProcessing ? styles.processButtonDisabled : {}),
                  }}
                  disabled={isProcessing}
                  onClick={processExpressAssessment}
                >
                  {isProcessing ? (
                    <>
                      <span style={styles.spinner} />
                      Generating...
                    </>
                  ) : (
                    <>Generate 360 Business Validation Report</>
                  )}
                </button>
              ) : (
                <ProcessButton
                  currentStep={currentStep}
                  stepName={currentStepInfo.name}
                  isProcessing={isProcessing}
                  isDisabled={isProcessing || (currentStep === 0 && !inputContent.trim())}
                  onClick={processStep}
                />
              )}

              {/* Processing Log */}
              <ProcessingLog logs={processingLog} />

              {/* Output Display */}
              <OutputDisplay
                output={stepOutputs[currentStep]}
                currentStep={currentStep}
                copyFeedback={copyFeedback}
                onCopy={() => copyToClipboard(currentStep)}
                onDownloadMd={() => downloadOutput(currentStep)}
                onDownloadHtml={() => downloadOutputAsHtml(currentStep)}
              />

              {/* Navigation */}
              <Navigation
                currentStep={currentStep}
                canProceed={canProceed}
                onPrevious={handlePrevious}
                onNext={handleNext}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
