// ============================================
// File Parser Utility
// Parses PDF, DOCX, TXT, and MD files
// PDF parsing is offloaded to a Web Worker for non-blocking UI
// ============================================

import mammoth from 'mammoth';
import PDFWorker from '../workers/pdfParser.worker.js?worker';

// Singleton worker instance (lazy-loaded)
let pdfWorker = null;
let workerRequestId = 0;
const pendingRequests = new Map();

/**
 * Get or create the PDF worker instance
 * @returns {Worker} The PDF worker instance
 */
const getPDFWorker = () => {
  if (!pdfWorker) {
    pdfWorker = new PDFWorker();

    // Set up message handler for all requests
    pdfWorker.onmessage = (event) => {
      const { type, id, ...data } = event.data;
      const request = pendingRequests.get(id);

      if (!request) return;

      switch (type) {
        case 'progress':
          request.onProgress?.(data);
          break;
        case 'complete':
          request.resolve(data.text);
          pendingRequests.delete(id);
          break;
        case 'error':
          request.reject(new Error(data.error.message));
          pendingRequests.delete(id);
          break;
      }
    };

    pdfWorker.onerror = (error) => {
      console.error('PDF Worker error:', error);
      // Reject all pending requests
      for (const [id, request] of pendingRequests) {
        request.reject(new Error('PDF Worker crashed'));
        pendingRequests.delete(id);
      }
      // Recreate worker for next request
      pdfWorker = null;
    };
  }

  return pdfWorker;
};

/**
 * Parse a PDF file using Web Worker (non-blocking)
 * @param {ArrayBuffer} arrayBuffer - The file content as ArrayBuffer
 * @param {string} filename - The original filename (for progress reporting)
 * @param {Function} onProgress - Optional progress callback ({page, total, filename})
 * @returns {Promise<string>} - Extracted text content
 */
const parsePDF = async (arrayBuffer, filename = 'document.pdf', onProgress = null) => {
  const worker = getPDFWorker();
  const id = ++workerRequestId;

  return new Promise((resolve, reject) => {
    pendingRequests.set(id, { resolve, reject, onProgress });

    // Transfer the ArrayBuffer to avoid copying (better performance)
    worker.postMessage(
      { arrayBuffer, filename, id },
      [arrayBuffer]
    );
  });
};

/**
 * Parse a PDF file synchronously (fallback for when worker fails)
 * Uses dynamic import to avoid loading pdfjs in main bundle when not needed
 * @param {ArrayBuffer} arrayBuffer - The file content as ArrayBuffer
 * @returns {Promise<string>} - Extracted text content
 */
const parsePDFFallback = async (arrayBuffer) => {
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

  try {
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const textParts = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
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
 * @param {Object} options - Parsing options
 * @param {Function} options.onProgress - Progress callback for PDF parsing
 * @returns {Promise<{name: string, size: number, content: string, lastModified: number}>}
 */
export const parseFile = async (file, options = {}) => {
  const extension = getFileExtension(file.name);
  let content;

  switch (extension) {
    case 'pdf': {
      const arrayBuffer = await file.arrayBuffer();
      try {
        // Try Web Worker first (non-blocking)
        content = await parsePDF(arrayBuffer, file.name, options.onProgress);
      } catch (workerError) {
        console.warn('PDF Worker failed, using fallback:', workerError);
        // Need to re-read the file since ArrayBuffer was transferred
        const fallbackBuffer = await file.arrayBuffer();
        content = await parsePDFFallback(fallbackBuffer);
      }
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
 * @param {Object} options - Parsing options
 * @param {Function} options.onProgress - Progress callback ({filename, page, total})
 * @param {Function} options.onFileComplete - Called when each file completes
 * @returns {Promise<{results: Array, errors: Array}>}
 */
export const parseFiles = async (files, options = {}) => {
  const results = [];
  const errors = [];

  for (const file of files) {
    try {
      const parsed = await parseFile(file, {
        onProgress: options.onProgress
          ? (progress) => options.onProgress({ ...progress, filename: file.name })
          : null,
      });
      results.push(parsed);
      options.onFileComplete?.(parsed);
    } catch (error) {
      errors.push({ file: file.name, error: error.message });
    }
  }

  if (errors.length > 0) {
    const errorMessages = errors.map(e => `${e.file}: ${e.error}`).join('\n');
    console.warn('Some files failed to parse:', errorMessages);
  }

  return { results, errors };
};

/**
 * Clean up the PDF worker when no longer needed
 * Call this on application unmount to release resources
 */
export const terminatePDFWorker = () => {
  if (pdfWorker) {
    pdfWorker.terminate();
    pdfWorker = null;
    pendingRequests.clear();
  }
};
