// ============================================
// PDF Parser Web Worker
// Offloads PDF parsing to a background thread to prevent UI freeze
// ============================================

import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker (runs in main worker thread context)
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Handle incoming messages from main thread
 */
self.onmessage = async (event) => {
  const { arrayBuffer, filename, id } = event.data;

  try {
    // Load the PDF document
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const totalPages = pdf.numPages;
    let fullText = '';

    // Extract text from each page
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n\n';

      // Report progress to main thread
      self.postMessage({
        type: 'progress',
        id,
        page: pageNum,
        total: totalPages,
        filename,
      });
    }

    // Send completed result
    self.postMessage({
      type: 'complete',
      id,
      text: fullText.trim(),
      filename,
      pageCount: totalPages,
    });
  } catch (error) {
    // Send error back to main thread with detailed info
    self.postMessage({
      type: 'error',
      id,
      error: {
        message: error.message,
        stack: error.stack,
        filename,
      },
    });
  }
};

/**
 * Handle worker errors
 */
self.onerror = (error) => {
  self.postMessage({
    type: 'error',
    error: {
      message: error.message || 'Unknown worker error',
      filename: error.filename,
      lineno: error.lineno,
    },
  });
};
