// ============================================
// Express V2 Input Component
// Document upload OR manual form entry for Express Assessment V2
// ============================================

import React, { useState, useRef, memo } from 'react';
import { COLORS } from '../constants/colors.js';

const styles = {
  container: {
    backgroundColor: COLORS.white,
    borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)',
    marginBottom: '24px',
    overflow: 'hidden',
  },
  header: {
    padding: '20px 24px',
    borderBottom: `1px solid ${COLORS.border}`,
    backgroundColor: COLORS.background,
  },
  title: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  subtitle: {
    margin: '4px 0 0',
    fontSize: '14px',
    color: COLORS.textSecondary,
  },
  body: {
    padding: '24px',
  },
  modeToggle: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    padding: '4px',
    backgroundColor: COLORS.background,
    borderRadius: '12px',
  },
  modeButton: {
    flex: 1,
    padding: '12px 16px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: 'transparent',
    color: COLORS.textSecondary,
  },
  modeButtonActive: {
    backgroundColor: COLORS.white,
    color: COLORS.textPrimary,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    fontWeight: '600',
  },
  uploadZone: {
    border: `2px dashed ${COLORS.border}`,
    borderRadius: '12px',
    padding: '48px 24px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: COLORS.background,
  },
  uploadZoneHover: {
    borderColor: COLORS.primaryAccent,
    backgroundColor: '#F0FDFA',
  },
  uploadZoneSuccess: {
    borderColor: COLORS.success,
    backgroundColor: COLORS.successLight,
  },
  uploadIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  uploadText: {
    fontSize: '16px',
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: '8px',
  },
  uploadSubtext: {
    fontSize: '14px',
    color: COLORS.textSecondary,
  },
  extractionNotice: {
    marginTop: '16px',
    padding: '12px 16px',
    backgroundColor: COLORS.successLight,
    border: `1px solid ${COLORS.success}`,
    borderRadius: '8px',
  },
  extractionText: {
    fontSize: '14px',
    color: '#065F46',
    fontWeight: '500',
    marginBottom: '4px',
  },
  extractionSubtext: {
    fontSize: '13px',
    color: '#047857',
  },
  formFields: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  required: {
    color: COLORS.error,
  },
  input: {
    padding: '12px 16px',
    fontSize: '14px',
    border: `1px solid ${COLORS.border}`,
    borderRadius: '8px',
    color: COLORS.textPrimary,
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
  },
  textarea: {
    padding: '12px 16px',
    fontSize: '14px',
    border: `1px solid ${COLORS.border}`,
    borderRadius: '8px',
    color: COLORS.textPrimary,
    minHeight: '120px',
    resize: 'vertical',
    fontFamily: 'inherit',
    lineHeight: 1.5,
    transition: 'all 0.2s ease',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  },
  submitButton: {
    flex: 1,
    padding: '14px 24px',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: COLORS.primaryAccent,
    color: COLORS.white,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.border,
    color: COLORS.textMuted,
    cursor: 'not-allowed',
  },
  progressBar: {
    width: '100%',
    height: '6px',
    backgroundColor: COLORS.borderLight,
    borderRadius: '3px',
    overflow: 'hidden',
    marginTop: '16px',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primaryAccent,
    transition: 'width 0.3s ease',
    borderRadius: '3px',
  },
  helperText: {
    fontSize: '13px',
    color: COLORS.textMuted,
    marginTop: '4px',
  },
  fieldRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
};

/**
 * Express V2 Input Component
 * Provides document upload OR manual form entry
 */
const ExpressV2InputComponent = ({
  onSubmit,
  onExtract,
  loading = false,
  extracting = false,
  initialData = {},
}) => {
  const [inputMode, setInputMode] = useState('form'); // 'form' | 'upload'
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadHover, setUploadHover] = useState(false);
  const [extractionSuccess, setExtractionSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    companyName: initialData.companyName || '',
    tagline: initialData.tagline || '',
    problem: initialData.problem || '',
    solution: initialData.solution || '',
    targetMarket: initialData.targetMarket || '',
    businessModel: initialData.businessModel || '',
    traction: initialData.traction || '',
    team: initialData.team || '',
    competition: initialData.competition || '',
    additionalContext: initialData.additionalContext || '',
  });

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadedFile(file);
    setExtractionSuccess(false);

    // Read file as base64
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result.split(',')[1];

      // Call extraction handler
      const extractedData = await onExtract(base64, file.name, file.type);

      if (extractedData) {
        setFormData(extractedData);
        setExtractionSuccess(true);
        // Switch to form mode to show extracted data
        setTimeout(() => setInputMode('form'), 1000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.companyName || !formData.problem) {
      return;
    }
    onSubmit(formData);
  };

  const isFormValid = formData.companyName && formData.problem;

  return (
    <section style={styles.container} aria-labelledby="express-input-title">
      <div style={styles.header}>
        <h3 id="express-input-title" style={styles.title}>
          Express Validation - Business Information
        </h3>
        <p style={styles.subtitle}>
          Upload a document or enter information manually
        </p>
      </div>

      <div style={styles.body}>
        {/* Mode Toggle */}
        <div style={styles.modeToggle}>
          <button
            style={{
              ...styles.modeButton,
              ...(inputMode === 'form' ? styles.modeButtonActive : {}),
            }}
            onClick={() => setInputMode('form')}
            disabled={loading || extracting}
          >
            📝 Manual Entry
          </button>
          <button
            style={{
              ...styles.modeButton,
              ...(inputMode === 'upload' ? styles.modeButtonActive : {}),
            }}
            onClick={() => setInputMode('upload')}
            disabled={loading || extracting}
          >
            📄 Upload Document
          </button>
        </div>

        {/* Upload Zone */}
        {inputMode === 'upload' && (
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.docx,.pptx,.md,.markdown,.txt"
              style={{ display: 'none' }}
              disabled={loading || extracting}
            />

            <div
              style={{
                ...styles.uploadZone,
                ...(uploadHover && !extracting && !extractionSuccess
                  ? styles.uploadZoneHover
                  : {}),
                ...(extractionSuccess ? styles.uploadZoneSuccess : {}),
              }}
              onClick={() => !loading && !extracting && fileInputRef.current?.click()}
              onMouseEnter={() => setUploadHover(true)}
              onMouseLeave={() => setUploadHover(false)}
            >
              {extracting ? (
                <>
                  <div style={styles.uploadIcon}>⏳</div>
                  <p style={styles.uploadText}>Processing Document...</p>
                  <p style={styles.uploadSubtext}>
                    Extracting business information using AI
                  </p>
                </>
              ) : extractionSuccess ? (
                <>
                  <div style={styles.uploadIcon}>✅</div>
                  <p style={styles.uploadText}>{uploadedFile?.name}</p>
                  <p style={styles.uploadSubtext}>
                    Information extracted successfully
                  </p>
                </>
              ) : uploadedFile ? (
                <>
                  <div style={styles.uploadIcon}>📄</div>
                  <p style={styles.uploadText}>{uploadedFile.name}</p>
                  <p style={styles.uploadSubtext}>Click to upload a different file</p>
                </>
              ) : (
                <>
                  <div style={styles.uploadIcon}>📤</div>
                  <p style={styles.uploadText}>
                    Drop your file here or click to browse
                  </p>
                  <p style={styles.uploadSubtext}>
                    Supports PDF, DOCX, PPTX, and Markdown files
                  </p>
                </>
              )}
            </div>

            {extractionSuccess && (
              <div style={styles.extractionNotice}>
                <p style={styles.extractionText}>
                  ✓ Information extracted from your document
                </p>
                <p style={styles.extractionSubtext}>
                  Switch to Manual Entry to review and edit the extracted data
                </p>
              </div>
            )}
          </>
        )}

        {/* Form Fields */}
        {inputMode === 'form' && (
          <div style={styles.formFields}>
            {/* Company Name & Tagline */}
            <div style={styles.fieldRow}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Company Name <span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  style={styles.input}
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Enter company name"
                  disabled={loading}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Tagline</label>
                <input
                  type="text"
                  style={styles.input}
                  value={formData.tagline}
                  onChange={(e) => handleInputChange('tagline', e.target.value)}
                  placeholder="One-line description"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Problem Statement */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Problem Statement <span style={styles.required}>*</span>
              </label>
              <textarea
                style={styles.textarea}
                value={formData.problem}
                onChange={(e) => handleInputChange('problem', e.target.value)}
                placeholder="What problem are you solving? Who has this problem?"
                disabled={loading}
              />
              <span style={styles.helperText}>
                Describe the problem in detail. This is critical for assessment.
              </span>
            </div>

            {/* Solution */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Solution</label>
              <textarea
                style={styles.textarea}
                value={formData.solution}
                onChange={(e) => handleInputChange('solution', e.target.value)}
                placeholder="How does your solution address this problem?"
                disabled={loading}
              />
            </div>

            {/* Target Market */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Target Market</label>
              <textarea
                style={styles.textarea}
                value={formData.targetMarket}
                onChange={(e) => handleInputChange('targetMarket', e.target.value)}
                placeholder="Who are your customers? What is the market size?"
                disabled={loading}
              />
            </div>

            {/* Business Model */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Business Model</label>
              <textarea
                style={styles.textarea}
                value={formData.businessModel}
                onChange={(e) => handleInputChange('businessModel', e.target.value)}
                placeholder="How do you make money? What is your pricing strategy?"
                disabled={loading}
              />
            </div>

            {/* Traction & Validation */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Traction & Validation</label>
              <textarea
                style={styles.textarea}
                value={formData.traction}
                onChange={(e) => handleInputChange('traction', e.target.value)}
                placeholder="Users, revenue, partnerships, pilots, testimonials, etc."
                disabled={loading}
              />
            </div>

            {/* Team */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Team</label>
              <textarea
                style={styles.textarea}
                value={formData.team}
                onChange={(e) => handleInputChange('team', e.target.value)}
                placeholder="Key team members and their relevant experience"
                disabled={loading}
              />
            </div>

            {/* Competition */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Competition</label>
              <textarea
                style={styles.textarea}
                value={formData.competition}
                onChange={(e) => handleInputChange('competition', e.target.value)}
                placeholder="Who else is solving this problem? What is your competitive advantage?"
                disabled={loading}
              />
            </div>

            {/* Additional Context */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Additional Context</label>
              <textarea
                style={styles.textarea}
                value={formData.additionalContext}
                onChange={(e) =>
                  handleInputChange('additionalContext', e.target.value)
                }
                placeholder="Any other relevant information"
                disabled={loading}
              />
            </div>

            {/* Submit Button */}
            <div style={styles.buttonGroup}>
              <button
                style={{
                  ...styles.submitButton,
                  ...(loading || !isFormValid ? styles.submitButtonDisabled : {}),
                }}
                onClick={handleSubmit}
                disabled={loading || !isFormValid}
              >
                {loading ? 'Running Assessment...' : 'Run Express Validation'}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export const ExpressV2Input = memo(ExpressV2InputComponent);
