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
    // Create the prompt for Gemini.
    const prompt = "Act as an expert botanist. Identify this plant and provide the details strictly following the JSON schema.";
    
    // Initialize the Model.
    const model = this.ai.getGenerativeModel({
      model: "gemini-3.5-flash", // Fastest visual model.
      generationConfig: { // Inject our schema to force a JSON output.
        responseMimeType: "application/json", // Type of the response.
        responseSchema: plantPokedexSchema // Inject structure of the JSON.
      }
    });

    console.log("Validating image before sending:", imagePart?.inlineData?.mimeType);

    // Generate the content.
    // Send an array containing both the text prompt and the image part.
    // Remember to use 'await' because this calls the internet.
    const result = await model.generateContent([prompt, imagePart]);

    // Parse and return.
    // Extract the raw text string from the response.
    const rawText = result.response.text()

    // Convert that JSON string into a usable JavaScript object and return it.
    return JSON.parse(rawText);
  }
};