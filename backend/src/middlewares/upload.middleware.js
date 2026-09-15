// Import the multer library for handling multipart/form-data (file uploads)
import multer from 'multer';

// 1. Configure storage to hold the file buffer directly in RAM
const memoryStorage = multer.memoryStorage();

// 2. Define the file filter function (EXERCISE)
const imageFileFilter = (request, file, callback) => {
  // TODO: Implement logic here
  // Define formats for the valid images.
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp']
  // Check if the format of our image is valid using .includes().
  const isValidFormat = allowedMimeTypes.includes(file.mimetype);
  // Return if the format is valid or if there is an error.
  return isValidFormat 
    ? callback(null, true)
    : callback(new Error('Invalid image format. Only JPEG, PNG, and WebP are allowed.'), false);
};

// 3. Export the configured multer instance
export const imageUploadMiddleware = multer({
  storage: memoryStorage,
  limits: {
    // Limit file size to 10 Megabytes (10 * 1024 * 1024 bytes)
    fileSize: 10 * 1024 * 1024,
    // Only allow 1 file per request
    files: 1
  },
  fileFilter: imageFileFilter
});