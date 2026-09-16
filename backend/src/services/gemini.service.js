import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

// Defined the exact JSON structure we expect from the AI
const plantPokedexSchema = {
  type: SchemaType.OBJECT,
  properties: {
    commonName: { type: SchemaType.STRING, description: "Common name of the plant" },
    scientificName: { type: SchemaType.STRING, description: "Scientific taxonomical name" },
    family: { type: SchemaType.STRING, description: "Botanical family" },
    description: { type: SchemaType.STRING, description: "A short, engaging description (max 2 sentences)" },
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
  required: ["commonName", "scientificName", "family", "description", "careInstructions", "isToxicToPets"]
};

// Export class for instancing in other files.
export class GeminiService {

  // Executed automatically when we make "new GeminiService()".
  constructor() {
    // Instantiate Google library sending our environment variable.
    // Saved in process.env
    this.ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  // Asyncron Method which receive image converted in Base64.
  async identifyPlant(imagePart) {
    // TODO: Implement AI call.
  }
}