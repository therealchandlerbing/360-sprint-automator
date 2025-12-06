// ============================================
// Input Section Component
// File upload and text input for Step 0
// ============================================

import React, { useRef, useState, memo } from 'react';
import { COLORS } from '../constants/colors.js';
import { styles } from '../styles/appStyles.js';
import { parseFiles } from '../utils/fileParser.js';

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
  onError,
}) => {
  const fileInputRef = useRef(null);
  const [isParsingFiles, setIsParsingFiles] = useState(false);

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setIsParsingFiles(true);

    try {
      const { results, errors } = await parseFiles(files);

      if (errors.length > 0 && onError) {
        const errorMessages = errors.map(e => `${e.file}: ${e.error}`).join('\n');
        onError(`Some files could not be parsed:\n${errorMessages}`);
      }

      if (results.length > 0) {
        onFileUpload(results);
      }
    } catch (error) {
      if (onError) {
        onError(`Failed to parse files: ${error.message}`);
      }
    } finally {
      setIsParsingFiles(false);
      // Reset input to allow re-uploading same file
      event.target.value = '';
    }
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
          accept=".txt,.md,.pdf,.docx"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          aria-hidden="true"
          id="file-upload-input"
          disabled={isParsingFiles}
        />
        <div
          className="upload-zone"
          onClick={() => !isParsingFiles && fileInputRef.current?.click()}
          onKeyDown={(e) => { if (!isParsingFiles && (e.key === 'Enter' || e.key === ' ')) fileInputRef.current?.click(); }}
          style={{
            ...styles.uploadZone,
            ...(isParsingFiles ? { opacity: 0.6, cursor: 'wait' } : {}),
          }}
          role="button"
          tabIndex={isParsingFiles ? -1 : 0}
          aria-label="Upload files: TXT, MD, PDF, DOCX supported"
          aria-busy={isParsingFiles}
        >
          <div style={styles.uploadIcon} aria-hidden="true">{isParsingFiles ? '⏳' : '📄'}</div>
          <div style={styles.uploadText}>{isParsingFiles ? 'Parsing files...' : 'Drop files or click to upload'}</div>
          <div style={styles.uploadHint}>TXT, MD, PDF, DOCX supported</div>
        </div>

        {uploadedFiles.length > 0 && (
          <div style={{ marginTop: '16px' }} role="list" aria-label="Uploaded files">
            {uploadedFiles.map((file, index) => (
              <div key={`${file.name}-${file.lastModified || index}`} style={styles.fileItem} role="listitem">
                <span style={styles.fileName}>{file.name}</span>
                <span style={styles.fileSize}>{(file.size / 1024).toFixed(1)} KB</span>
                <button
                  onClick={() => onRemoveFile(index)}
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
