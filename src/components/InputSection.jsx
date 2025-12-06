// ============================================
// Input Section Component
// File upload and text input for Step 0
// ============================================

import React, { useRef } from 'react';
import { COLORS } from '../constants/colors.js';
import { styles } from '../styles/appStyles.js';

/**
 * Input section with file upload and text area
 */
export const InputSection = ({
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
    <div style={styles.card}>
      <div className="card-header" style={styles.cardHeader}>
        <h3 style={styles.cardTitle}>Source Materials</h3>
      </div>
      <div className="card-body" style={styles.cardBody}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: COLORS.textSecondary, marginBottom: '8px' }}>
            Project Name
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => onProjectNameChange(e.target.value)}
            placeholder="Enter project or company name"
            style={styles.input}
          />
        </div>

        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept=".txt,.md,.pdf,.doc,.docx"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <div
          className="upload-zone"
          onClick={() => fileInputRef.current?.click()}
          style={styles.uploadZone}
        >
          <div style={styles.uploadIcon}>📄</div>
          <div style={styles.uploadText}>Drop files or click to upload</div>
          <div style={styles.uploadHint}>TXT, MD, PDF, DOCX supported</div>
        </div>

        {uploadedFiles.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            {uploadedFiles.map((file, idx) => (
              <div key={idx} style={styles.fileItem}>
                <span style={styles.fileName}>{file.name}</span>
                <span style={styles.fileSize}>{(file.size / 1024).toFixed(1)} KB</span>
                <button onClick={() => onRemoveFile(idx)} style={styles.removeButton}>×</button>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: COLORS.textSecondary, marginBottom: '8px' }}>
            Or paste content directly
          </label>
          <textarea
            value={inputContent}
            onChange={(e) => onInputContentChange(e.target.value)}
            placeholder="Paste pitch deck content, business plan, or other materials..."
            style={styles.textarea}
          />
        </div>
      </div>
    </div>
  );
};
