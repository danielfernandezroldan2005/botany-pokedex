/**
 * Converts a Multer file object into the format required by the Gemini API.
 * 
 * @param {Object} file - The file object provided by Multer middleware.
 * @returns {Object} The formatted object containing inlineData.
 */
export const fileToGenerativePart = (file) => {
  // TODO: Implement the return object here
  // 1. Convert the buffer to a Base64 encoded string (¡Lo que tú hiciste!)
  const base64Data = file.buffer.toString('base64');

  // 2. Return the exact object structure required by the Gemini SDK
  return {
    inlineData: {
      data: base64Data,
      mimeType: file.mimetype // Multer provides the original mime type here
    }
  };
};