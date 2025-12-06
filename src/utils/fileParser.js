// ============================================
// File Parser Utility
// Parses PDF, DOCX, TXT, and MD files
// ============================================

import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Parse a PDF file and extract text content
 * @param {ArrayBuffer} arrayBuffer - The file content as ArrayBuffer
 * @returns {Promise<string>} - Extracted text content
 */
const parsePDF = async (arrayBuffer) => {
  try {
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const textParts = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map(item => item.str)
        .join(' ');
      textParts.push(pageText);
    }

    return textParts.join('\n\n');
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
};

/**
 * Parse a DOCX file and extract text content
 * @param {ArrayBuffer} arrayBuffer - The file content as ArrayBuffer
 * @returns {Promise<string>} - Extracted text content
 */
const parseDOCX = async (arrayBuffer) => {
  try {
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    console.error('DOCX parsing error:', error);
    throw new Error(`Failed to parse DOCX: ${error.message}`);
  }
};

/**
 * Parse a text file (TXT or MD)
 * @param {File} file - The file object
 * @returns {Promise<string>} - File text content
 */
const parseText = async (file) => {
  return await file.text();
};

/**
 * Get file extension from filename
 * @param {string} filename - The filename
 * @returns {string} - Lowercase file extension
 */
const getFileExtension = (filename) => {
  return filename.split('.').pop().toLowerCase();
};

/**
 * Parse a file based on its type
 * @param {File} file - The file to parse
 * @returns {Promise<{name: string, size: number, content: string, lastModified: number}>}
 */
export const parseFile = async (file) => {
  const extension = getFileExtension(file.name);
  let content;

  switch (extension) {
    case 'pdf': {
      const arrayBuffer = await file.arrayBuffer();
      content = await parsePDF(arrayBuffer);
      break;
    }
    case 'docx': {
      const arrayBuffer = await file.arrayBuffer();
      content = await parseDOCX(arrayBuffer);
      break;
    }
    case 'doc': {
      // .doc format is legacy and complex - inform user
      throw new Error(
        'Legacy .doc format is not supported. Please convert to .docx or paste content directly.'
      );
    }
    case 'txt':
    case 'md':
    default: {
      content = await parseText(file);
      break;
    }
  }

  return {
    name: file.name,
    size: file.size,
    content,
    lastModified: file.lastModified,
  };
};

/**
 * Parse multiple files
 * @param {FileList|File[]} files - Array of files to parse
 * @returns {Promise<Array<{name: string, size: number, content: string, lastModified: number}>>}
 */
export const parseFiles = async (files) => {
  const results = [];
  const errors = [];

  for (const file of files) {
    try {
      const parsed = await parseFile(file);
      results.push(parsed);
    } catch (error) {
      errors.push({ file: file.name, error: error.message });
    }
  }

  if (errors.length > 0) {
    const errorMessages = errors.map(e => `${e.file}: ${e.error}`).join('\n');
    console.warn('Some files failed to parse:', errorMessages);
    // Still return successfully parsed files, but also include error info
    return { results, errors };
  }

  return { results, errors: [] };
};
