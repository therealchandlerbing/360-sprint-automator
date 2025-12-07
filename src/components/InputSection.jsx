// ============================================
// Input Section Component
// File upload and text input for Step 0
// Enhanced with drag-and-drop feedback
// ============================================

import React, { useRef, useState, memo } from 'react';
import { COLORS } from '../constants/colors.js';
import { styles } from '../styles/appStyles.js';
import { parseFiles } from '../utils/fileParser.js';

// File icon helper
const getFileIcon = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
  const icons = { pdf: '📕', docx: '📘', doc: '📘', txt: '📄', md: '📝' };
  return icons[ext] || '📄';
};

// Format file size helper
const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

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
  const [isDragging, setIsDragging] = useState(false);
  const [removeHoveredIndex, setRemoveHoveredIndex] = useState(null);

  // Shared file processing logic (DRY principle)
  const processUploadedFiles = async (files) => {
    if (!files || files.length === 0) return;

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
    }
  };

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    await processUploadedFiles(files);
    // Reset input to allow re-uploading same file
    event.target.value = '';
  };

  // Drag event handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isParsingFiles) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only clear dragging state if leaving the drop zone entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (isParsingFiles) return;

    const files = Array.from(e.dataTransfer.files);
    await processUploadedFiles(files);
  };

  // Enhanced upload zone styles
  const uploadZoneStyles = {
    ...styles.uploadZone,
    ...(isParsingFiles ? { opacity: 0.6, cursor: 'wait' } : {}),
    ...(isDragging ? {
      borderColor: '#14B8A6',
      backgroundColor: 'rgba(20, 184, 166, 0.08)',
      boxShadow: '0 0 0 3px rgba(20, 184, 166, 0.15)',
    } : {}),
  };

  // Enhanced file item styles
  const fileItemStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 14px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    marginBottom: '8px',
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
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          style={uploadZoneStyles}
          role="button"
          tabIndex={isParsingFiles ? -1 : 0}
          aria-label="Upload files: TXT, MD, PDF, DOCX supported"
          aria-busy={isParsingFiles}
        >
          <div style={{ fontSize: '36px', marginBottom: '12px' }} aria-hidden="true">
            {isParsingFiles ? '⏳' : isDragging ? '📥' : '📄'}
          </div>
          <div style={{ fontSize: '15px', fontWeight: '500', color: '#4A5568', marginBottom: '4px' }}>
            {isParsingFiles ? 'Parsing files...' : isDragging ? 'Drop files here' : 'Drop files or click to upload'}
          </div>
          <div style={{ fontSize: '13px', color: '#A0AEC0' }}>
            Supports TXT, MD, PDF, DOCX
          </div>
        </div>

        {uploadedFiles.length > 0 && (
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }} role="list" aria-label="Uploaded files">
            {uploadedFiles.map((file, index) => (
              <div key={`${file.name}-${file.lastModified || index}`} style={fileItemStyles} role="listitem">
                <span style={{ fontSize: '22px', flexShrink: 0 }}>{getFileIcon(file.name)}</span>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#1A202C',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>{file.name}</span>
                  <span style={{ fontSize: '12px', color: '#A0AEC0', marginTop: '2px' }}>
                    {formatFileSize(file.size)}
                  </span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onRemoveFile(index); }}
                  onMouseEnter={() => setRemoveHoveredIndex(index)}
                  onMouseLeave={() => setRemoveHoveredIndex(null)}
                  style={{
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: removeHoveredIndex === index ? '#FFF5F5' : 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    color: removeHoveredIndex === index ? '#E53E3E' : '#A0AEC0',
                    cursor: 'pointer',
                    fontSize: '18px',
                    transition: 'all 0.15s ease',
                    flexShrink: 0,
                  }}
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
