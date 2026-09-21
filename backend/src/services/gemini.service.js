import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

// Defined the exact JSON structure we expect from the AI
const plantPokedexSchema = {
  type: SchemaType.OBJECT,
  properties: {
    commonName: { type: SchemaType.STRING, description: "Common name of the plant" },
    scientificName: { type: SchemaType.STRING, description: "Scientific taxonomical name" },
    family: { type: SchemaType.STRING, description: "Botanical family" },
    description: { type: SchemaType.STRING, description: "A short, engaging description (max 2 sentences)" },
    location: { type: SchemaType.STRING, description: "Native region or typical geographical location" },
    careInstructions: {
      type: SchemaType.OBJECT,
      properties: {
        light: { type: SchemaType.STRING, description: "Sunlight requirements" },
        water: { type: SchemaType.STRING, description: "Watering frequency" }
      },
      required: ["light", "water"]
    },
    isToxicToPets: { type: SchemaType.BOOLEAN, description: "True if toxic to dogs/cats or birds" }
  },
  required: ["commonName", "scientificName", "family", "location", "description", "careInstructions", "isToxicToPets"]
};

// Export class for instancing in other files.
export class GeminiService {

  // Executed automatically when we make "new GeminiService()".
  constructor() {
    // Instantiate Google library sending our environment variable.
    // Saved in process.env
    console.log("🔑 Reading Key:", process.env.GEMINI_API_KEY);
    this.ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  // Asyncron Method which receive image converted in Base64.
  async identifyPlant(imagePart) {
    // Define our resilient fallback list of models
    const fallbackModels = [
      "gemini-1.5-flash", // Fast, standard vision model
      "gemini-2.5-flash", // Newer standard model
      "gemini-1.5-pro",    // Slower but highly capable, usually on different servers
      "gemini-3.8-flash", // A few more if any necessity.
      "gemini-3.5-flash"
    ];

    // Create the prompt for Gemini.
    const prompt = "Analyze this plant image and provide the exact botanical data requested in the JSON schema.";
    
    // Iterate with each model.
    for (const modelName of fallbackModels) {
      try {
        console.log(`[Gemini] Attempting connection with model: ${modelName}...`);

        const model = this.ai.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: plantPokedexSchema // This must match the variable name of your schema
          }
        });

        // Make the actual call to Google's servers
        const result = await model.generateContent([prompt, imagePart]);
        console.log(`[Gemini] ✅ Success using ${modelName}!`);

        return result.response.text(); // Return the raw JSON string to your controller

      } catch (error) {
        // If Google throws 503 or 404, we catch it here
        console.warn(`[Gemini] ⚠️ ${modelName} failed with: ${error.statusText || error.message}`);

        // If this was the last model in our list, we have no more options. Throw to the frontend.
        if (modelName === fallbackModels[fallbackModels.length - 1]) {
          console.error("[Gemini] ❌ Critical: All fallback models are currently unavailable.");
          throw error;
        }

        // Wait 1.5 seconds before trying the next model to avoid hitting strict rate limits
        console.log("[Gemini] Switching to the next fallback model...");
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    }
  }
};