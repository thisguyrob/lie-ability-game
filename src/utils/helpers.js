/**
 * Utility helper functions for the Lie-Ability game
 */

/**
 * Validate player name
 * @param {string} name - Player name to validate
 * @returns {Object} Validation result with success and error
 */
function validatePlayerName(name) {
  if (!name || typeof name !== 'string') {
    return { success: false, error: 'Name is required' };
  }
  
  const trimmed = name.trim();
  
  if (trimmed.length < 2) {
    return { success: false, error: 'Name must be at least 2 characters' };
  }
  
  if (trimmed.length > 20) {
    return { success: false, error: 'Name must be 20 characters or less' };
  }
  
  // Check for inappropriate characters
  if (!/^[a-zA-Z0-9\s\-_\.]+$/.test(trimmed)) {
    return { success: false, error: 'Name contains invalid characters' };
  }
  
  return { success: true, name: trimmed };
}

/**
 * Validate lie submission
 * @param {string} lie - Lie to validate
 * @returns {Object} Validation result with success and error
 */
function validateLie(lie) {
  if (!lie || typeof lie !== 'string') {
    return { success: false, error: 'Lie is required' };
  }
  
  const trimmed = lie.trim();
  
  if (trimmed.length < 1) {
    return { success: false, error: 'Lie cannot be empty' };
  }
  
  if (trimmed.length > 100) {
    return { success: false, error: 'Lie must be 100 characters or less' };
  }
  
  return { success: true, lie: trimmed };
}

/**
 * Sanitize user input for display
 * @param {string} input - User input to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 100); // Limit length
}

module.exports = {
  validatePlayerName,
  validateLie,
  sanitizeInput
};
