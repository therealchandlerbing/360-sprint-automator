/**
 * Shared utility functions for filename formatting
 */

/**
 * Format date as dd.mm.yy for use in filenames
 * @param {string|Date} date - Date to format (defaults to current date)
 * @returns {string} Formatted date string
 */
export function formatDateForFilename(date) {
  const d = date ? new Date(date) : new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = String(d.getFullYear()).slice(-2);
  return `${day}.${month}.${year}`;
}

/**
 * Sanitize project name for use in filename
 * Removes special characters, replaces spaces with underscores, and truncates
 * @param {string} projectName - Project name to sanitize
 * @param {number} maxLength - Maximum length (default: 50)
 * @returns {string} Sanitized name
 */
export function sanitizeProjectName(projectName, maxLength = 50) {
  return (projectName || 'Assessment')
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, maxLength);
}
