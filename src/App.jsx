// ============================================
// VIANEO Sprint Automator - Main Application
// Refactored modular architecture with Express Mode
// ============================================

import React, { useState, useCallback } from 'react';
import JSZip from 'jszip';

// Constants
import { STEPS } from './constants/steps.js';
import { STEP_PROMPTS, injectDynamicValues } from './constants/prompts.js';

// Utilities
import { markdownToHtml } from './utils/markdownToHtml.js';
import { HTML_TEMPLATE } from './utils/htmlTemplate.js';

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

  // Local state
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingLog, setProcessingLog] = useState([]);
  const [showBranchSelector, setShowBranchSelector] = useState(false);
  const [error, setError] = useState(null);
  const [copyFeedback, setCopyFeedback] = useState(null);
  const [assessmentMode, setAssessmentMode] = useState('step-by-step'); // 'step-by-step' | 'express'
  const [showMethodologyModal, setShowMethodologyModal] = useState(false);

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
                  className="process-button btn-express"
                  disabled={isProcessing}
                  onClick={processExpressAssessment}
                >
                  {isProcessing ? (
                    <>
                      <span className="spinner" />
                      Generating...
                    </>
                  ) : (
                    'Generate 360 Business Validation Report'
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
    </ErrorBoundary>
  );
}
