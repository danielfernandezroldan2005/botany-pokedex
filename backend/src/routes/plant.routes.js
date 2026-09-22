import { Router } from 'express';
import { imageUploadMiddleware } from '../middlewares/upload.middleware.js';
import { fileToGenerativePart } from '../utils/image.util.js';
import { PlantIdService } from './plantid.service.js';

export const plantRouter = Router();
const aiService = new PlantIdService(); // Instantiate service

// POST endpoint to identify a plant from an uploaded image
plantRouter.post('/identify', imageUploadMiddleware.single('plantImage'), async (request, response) => {
  try{
    // Check if the image file is provided.
    if(!request.file) {
      return response.status(400).json({error: "No image file provided."});
    }

    // Convert the file.
    const imagePart = fileToGenerativePart(request.file);

    // Call the AI.
    const plantData = await aiService.identifyPlant(imagePart);

    // Return 200 OK.
    return response.status(200).json(plantData);
  } catch(error) {
    // Log the actual error in the server console for the developer to see.
    console.error("[GEMINI API ERROR]: ", error);

    // Return a 500 Internal Server Error to the client.
    return response.status(500).json({ 
      error: "An error occurred while identifying the plant. Please try again later." 
    });
  }
});