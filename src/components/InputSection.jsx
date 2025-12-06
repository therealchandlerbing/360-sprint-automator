// ============================================
// Input Section Component
// File upload and text input for Step 0
// ============================================

import React, { useRef, memo } from 'react';
import { COLORS } from '../constants/colors.js';
import { styles } from '../styles/appStyles.js';

/**
 * Input section with file upload and text area
 * Memoized to prevent unnecessary re-renders
 */
const InputSectionComponent = ({
  projectName,
  inputContent,
  uploadedFiles,
  onProjectNameChange,
  onInputContentChange,
  onFileUpload,
  onRemoveFile,
}) => {
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    const fileData = [];

    for (const file of files) {
      const text = await file.text();
      fileData.push({ name: file.name, size: file.size, content: text });
    }

    onFileUpload(fileData);
  };

  return (
    <section style={styles.card} aria-label="Source materials input">
      <div className="card-header" style={styles.cardHeader}>
        <h3 style={styles.cardTitle}>Source Materials</h3>
      </div>
      <div className="card-body" style={styles.cardBody}>
        <div style={{ marginBottom: '20px' }}>
          <label
            htmlFor="project-name-input"
            style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: COLORS.textSecondary, marginBottom: '8px' }}
          >
            Project Name
          </label>
          <input
            id="project-name-input"
            type="text"
            value={projectName}
            onChange={(e) => onProjectNameChange(e.target.value)}
            placeholder="Enter project or company name"
            style={styles.input}
            aria-describedby="project-name-hint"
          />
        </div>

        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept=".txt,.md,.pdf,.doc,.docx"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          aria-hidden="true"
          id="file-upload-input"
        />
        <div
          className="upload-zone"
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
          style={styles.uploadZone}
          role="button"
          tabIndex={0}
          aria-label="Upload files: TXT, MD, PDF, DOCX supported"
        >
          <div style={styles.uploadIcon} aria-hidden="true">📄</div>
          <div style={styles.uploadText}>Drop files or click to upload</div>
          <div style={styles.uploadHint}>TXT, MD, PDF, DOCX supported</div>
        </div>

        {uploadedFiles.length > 0 && (
          <div style={{ marginTop: '16px' }} role="list" aria-label="Uploaded files">
            {uploadedFiles.map((file, idx) => (
              <div key={`${file.name}-${idx}`} style={styles.fileItem} role="listitem">
                <span style={styles.fileName}>{file.name}</span>
                <span style={styles.fileSize}>{(file.size / 1024).toFixed(1)} KB</span>
                <button
                  onClick={() => onRemoveFile(idx)}
                  style={styles.removeButton}
                  aria-label={`Remove file ${file.name}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '20px' }}>
          <label
            htmlFor="content-textarea"
            style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: COLORS.textSecondary, marginBottom: '8px' }}
          >
            Or paste content directly
          </label>
          <textarea
            id="content-textarea"
            value={inputContent}
            onChange={(e) => onInputContentChange(e.target.value)}
            placeholder="Paste pitch deck content, business plan, or other materials..."
            style={styles.textarea}
            aria-label="Content input area"
          />
        </div>
      </div>
    </section>
  );
};

// Memoize to prevent re-renders when unrelated state changes
export const InputSection = memo(InputSectionComponent);
