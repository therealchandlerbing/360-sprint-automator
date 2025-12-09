// ============================================
// VIANEO Sprint Automator - Main Application
// Refactored modular architecture with Express Mode
// ============================================

import React, { useState, useCallback, useEffect } from 'react';
import JSZip from 'jszip';

// Constants
import { STEPS } from './constants/steps.js';
import { STEP_PROMPTS, injectDynamicValues } from './constants/prompts/index.js';

// Utilities
import { markdownToHtml } from './utils/markdownToHtml.js';
import { HTML_TEMPLATE } from './utils/htmlTemplate.js';
import { terminatePDFWorker } from './utils/fileParser.js';
import {
  buildStepContext,
  buildLegacyContext,
  setStepsSummary,
  setScoreExtractorFunctions,
} from './utils/contextBuilder.js';
import {
  extractScoresFromOutput,
  formatScoresForContext,
} from './utils/scoreExtractor.js';
import {
  generateStepsSummary,
  canGenerateSummary,
  createFallbackSummary,
} from './utils/summaryGenerator.js';

// Stores
import { useKeyFactsStore, parseKeyFactsFromOutput } from './stores/keyFactsStore.js';

// Branch configuration
import { BRANCHES } from './config/branches.js';

// Styles
import { styles } from './styles/appStyles.js';
import './App.css';

// Hooks
import { useSessionPersistence } from './hooks/useSessionPersistence.js';
import { useMobileMenu } from './hooks/useMobileMenu.js';
import { useClaudeAPI } from './hooks/useClaudeAPI.js';
import { useExpressAssessment } from './hooks/useExpressAssessment.js';

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
  ErrorBoundary,
  ExpressModeSelector,
  ExpressProcessing,
  ExpressCompletion,
  ExpressV2Input,
  ExpressV2Results,
  MethodologyModal,
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

  // Key Facts store (PDR-002)
  const {
    bulkSetFacts,
    clearFacts,
  } = useKeyFactsStore();

  // Initialize score extractor functions for context builder
  useEffect(() => {
    setScoreExtractorFunctions(extractScoresFromOutput, formatScoresForContext);
  }, []);

  // Local state
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingLog, setProcessingLog] = useState([]);
  const [error, setError] = useState(null);
  const [copyFeedback, setCopyFeedback] = useState(null);
  const [assessmentMode, setAssessmentMode] = useState('step-by-step'); // 'step-by-step' | 'express'
  const [showMethodologyModal, setShowMethodologyModal] = useState(false);
  const [extractingDocument, setExtractingDocument] = useState(false);

  // Cleanup PDF worker on unmount to release resources
  useEffect(() => {
    return () => {
      terminatePDFWorker();
    };
  }, []);

  // Express Assessment hook - handles all Express mode state and logic
  const {
    expressAssessment,
    dashboard,
    processExpressAssessment,
    cancelExpressAssessment,
    downloadExpressReport,
    startNewExpressAssessment: startNewAssessmentBase,
    generateDashboard,
    downloadDashboard,
    // V2 functions
    processExpressV2Assessment,
    downloadExpressV2Report,
    printExpressV2Report,
  } = useExpressAssessment({
    projectName,
    inputContent,
    callClaudeAPI,
    setError,
  });

  // Wrap startNewAssessment to also reset assessment mode
  const startNewExpressAssessment = useCallback(() => {
    startNewAssessmentBase();
    setAssessmentMode('step-by-step');
  }, [startNewAssessmentBase]);

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

  // Document extraction handler for Express V2
  const handleDocumentExtraction = useCallback(async (base64, fileName, fileType) => {
    setExtractingDocument(true);
    setError(null);

    try {
      const response = await fetch('/api/extract-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: base64, fileName, fileType })
      });

      // Get response as text first to handle non-JSON error responses
      const responseText = await response.text();

      // Try to parse as JSON
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        // Response is not valid JSON - likely a server error message
        const errorPreview = responseText.substring(0, 100);
        throw new Error(`Server returned a non-JSON response (status: ${response.status}): ${errorPreview}${responseText.length > 100 ? '...' : ''}`);
      }

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to extract document');
      }

      return result.data;
    } catch (err) {
      console.error('Document extraction error:', err);
      setError(`Failed to extract document: ${err.message}`);
      return null;
    } finally {
      setExtractingDocument(false);
    }
  }, []);

  // Build context for step prompts using Context Matrix (PDR-002)
  const buildContext = useCallback((stepId) => {
    // Get Key Facts store instance for context building
    const keyFactsStore = useKeyFactsStore.getState();

    // Use new Context Matrix strategy for steps 10+
    // For earlier steps, use legacy format for backward compatibility with existing prompts
    if (stepId >= 10) {
      const projectState = {
        stepOutputs,
        inputContent,
        organizationBranch,
      };

      const newContext = buildStepContext(stepId, projectState, {
        keyFactsStore,
        branchesConfig: BRANCHES,
      });

      // Map new context keys to legacy placeholder names
      const context = {};
      if (newContext.STEP_0_OUTPUT) context.STEP_0_OUTPUT = newContext.STEP_0_OUTPUT;
      if (newContext.KEY_FACTS) context.KEY_FACTS = newContext.KEY_FACTS;
      if (newContext.STEPS_4_9_SUMMARY) context.STEPS_4_9_SUMMARY = newContext.STEPS_4_9_SUMMARY;
      if (newContext.ALL_CONTEXT) context.ALL_PRIOR_OUTPUTS = newContext.ALL_CONTEXT;

      // Include individual step outputs as needed
      if (newContext.STEP_10_OUTPUT) context.STEP_10_OUTPUT = newContext.STEP_10_OUTPUT;
      if (newContext.STEP_11_OUTPUT) context.STEP_11_OUTPUT = newContext.STEP_11_OUTPUT;

      return context;
    }

    // Use legacy context builder for steps 0-9
    const legacyContext = buildLegacyContext(stepId, stepOutputs);

    // Add Key Facts for steps that use them (4, 8, 9)
    if ([4, 8, 9].includes(stepId)) {
      const keyFactsContext = keyFactsStore.getFactsAsContext();
      if (keyFactsContext) {
        legacyContext.KEY_FACTS = keyFactsContext;
      }
    }

    return legacyContext;
  }, [stepOutputs, inputContent, organizationBranch]);

  // Process current step
  const processStep = useCallback(async () => {
    if (currentStep === 0 && !inputContent.trim()) {
      setError('Please upload files or paste content to analyze');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProcessingLog([]);
    addLog(`Starting Step ${currentStep}: ${STEPS[currentStep].name}`);

    try {
      // Pre-Step 10: Generate summary of Steps 4-9 (PDR-002 Hourglass Architecture)
      if (currentStep === 10 && canGenerateSummary(stepOutputs)) {
        addLog('Generating summary of Steps 4-9 for context compression...');
        try {
          const summary = await generateStepsSummary(stepOutputs, callClaudeAPI, addLog);
          setStepsSummary(summary);
          addLog('Summary generated successfully');
        } catch (summaryErr) {
          console.warn('Summary generation failed, using fallback:', summaryErr);
          addLog('Using fallback summary (AI generation failed)');
          const fallbackSummary = createFallbackSummary(stepOutputs);
          setStepsSummary(fallbackSummary);
        }
      }

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

      // Post-Step 0: Extract Key Facts (PDR-002)
      if (currentStep === 0) {
        addLog('Extracting Key Facts from Executive Brief...');
        const extractedFacts = parseKeyFactsFromOutput(output);
        if (extractedFacts && Object.keys(extractedFacts).length > 0) {
          bulkSetFacts(extractedFacts, 0, 'validation');
          addLog(`Extracted ${Object.keys(extractedFacts).length} Key Facts`);
        } else {
          addLog('No Key Facts JSON block found in output');
        }
      }

      addLog(`Step ${currentStep} complete!`);
    } catch (err) {
      setError(`Error: ${err.message}`);
      addLog(`Error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  }, [currentStep, inputContent, organizationBranch, stepOutputs, buildContext, addLog, callClaudeAPI, setStepOutputs, bulkSetFacts]);

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
      // Clear Key Facts store (PDR-002)
      clearFacts();
    }
  }, [clearSession, clearFacts]);

  // Branch selection handler
  const handleBranchSelect = useCallback((branchId) => {
    setOrganizationBranch(branchId);
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
    <ErrorBoundary
      inputContent={inputContent}
      stepOutputs={stepOutputs}
      projectName={projectName}
    >
      <div className="app-container">
        {/* Mobile Overlay - button for accessibility */}
        {isMobileMenuOpen && (
          <button
            className="mobile-overlay"
            onClick={closeMobileMenu}
            aria-label="Close navigation menu"
            type="button"
          />
        )}

        {/* Header */}
        <Header
          completedSteps={completedSteps}
          onOpenMethodology={() => setShowMethodologyModal(true)}
          onToggleMobileMenu={toggleMobileMenu}
        />

        {/* Methodology Modal */}
        <MethodologyModal
          isOpen={showMethodologyModal}
          onClose={() => setShowMethodologyModal(false)}
        />

        {/* Main Layout */}
        <div className="main-layout">
          {/* Sidebar */}
          <Sidebar
            currentStep={currentStep}
            stepOutputs={stepOutputs}
            completedSteps={completedSteps}
            hasInput={inputContent.length > 0}
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
          <main className="main-content">
          {/* Express Mode: Processing View */}
          {expressAssessment.status === 'processing' || expressAssessment.status === 'generating-report' ? (
            <ExpressProcessing
              projectName={projectName}
              progress={expressAssessment.progress}
              startTime={expressAssessment.startTime}
              onCancel={cancelExpressAssessment}
            />
          ) : expressAssessment.status === 'complete' ? (
            /* Express Mode: Completion View - Use V2 Results */
            <ExpressV2Results
              assessmentData={expressAssessment.outputs.assessmentData}
              onDownloadReport={downloadExpressV2Report}
              onPrintReport={printExpressV2Report}
              onStartNew={startNewExpressAssessment}
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
              onRetry={() => setAssessmentMode('express')}
            />
          ) : (
            /* Standard Mode: Step-by-Step View */
            <>
              {/* Step Header */}
              <StepHeader step={currentStepInfo} phase={currentPhase} />

              {/* Branch Selector (Step 1) - show automatically when no branch selected */}
              {currentStep === 1 && !organizationBranch && (
                <BranchSelector onSelect={handleBranchSelect} />
              )}

              {/* Process Button for Steps 1+ (after branch selection for Step 1) */}
              {currentStep >= 1 && (currentStep !== 1 || organizationBranch) && (
                <ProcessButton
                  currentStep={currentStep}
                  stepName={currentStepInfo.name}
                  isProcessing={isProcessing}
                  isDisabled={isProcessing}
                  onClick={processStep}
                />
              )}

              {/* Input Section (Step 0) */}
              {currentStep === 0 && (
                <>
                  {/* Express Mode: Use V2 Input Component */}
                  {assessmentMode === 'express' ? (
                    <ExpressV2Input
                      onSubmit={processExpressV2Assessment}
                      onExtract={handleDocumentExtraction}
                      loading={expressAssessment.status === 'processing'}
                      extracting={extractingDocument}
                    />
                  ) : (
                    /* Standard Mode: Use regular InputSection */
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

                      {/* Process Button for step-by-step mode */}
                      <ProcessButton
                        currentStep={currentStep}
                        stepName={currentStepInfo.name}
                        isProcessing={isProcessing}
                        isDisabled={isProcessing || (currentStep === 0 && !inputContent.trim())}
                        onClick={processStep}
                      />
                    </>
                  )}
                </>
              )}

              {/* Error Display */}
              <ErrorBox error={error} />

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
    </ErrorBoundary>
  );
}
