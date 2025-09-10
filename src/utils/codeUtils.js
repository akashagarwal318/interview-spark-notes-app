/**
 * Extracts code blocks from markdown-formatted text
 * @param {string} text - Markdown text containing fenced code blocks (```language code ```)  
 * @returns {Array<{language: string, code: string}>} - Array of code block objects
 */
export const extractCodeBlocks = (text) => {
  if (!text || typeof text !== 'string') return [];
  
  const codeBlocks = [];
  const regex = /```([a-zA-Z0-9_\-]*)?[\s]*([^`]*?)```/g;
  
  let match;
  while ((match = regex.exec(text)) !== null) {
    const language = match[1]?.trim() || 'javascript'; // Default to javascript if no language specified
    const code = match[2]?.trim() || '';
    
    if (code) {
      codeBlocks.push({
        language,
        code
      });
    }
  }
  
  return codeBlocks;
};

/**
 * Checks if a string contains code blocks
 */
export const hasCodeBlocks = (text) => extractCodeBlocks(text).length > 0;
