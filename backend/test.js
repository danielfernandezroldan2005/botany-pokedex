import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the AI client using the API key from .env
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function checkAvailableModels() {
  try {
    console.log("🔍 Fetching available models for your API Key...");
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.models) {
      console.log("✅ Models you have access to:");
      // Extract and map just the names for readability
      const modelNames = data.models.map(m => m.name);
      console.log(modelNames);
    } else {
      console.log("❌ Unexpected response:", data);
    }
  } catch (error) {
    console.error("❌ Connection error:", error);
  }
}

async function runModelTest() {
  try {
    console.log("⏳ 1. Contacting Google...");
    
    // Using an active model from the previously retrieved list
    const model = ai.getGenerativeModel({ model: "gemini-3.5-flash" });
    
    console.log("⏳ 2. Sending text-only test request...");
    const result = await model.generateContent("Reply only with the word: Confirmed.");
    
    console.log("✅ AI RESPONSE:", result.response.text());
  } catch (error) {
    console.error("❌ DETAILED ERROR:", {
      status: error.status,
      message: error.message,
      name: error.name
    });
  }
}

// Execute tests sequentially to avoid mixed console outputs
async function runAll() {
  await checkAvailableModels();
  console.log("\n--------------------------------------------------\n");
  await runModelTest();
}

runAll();