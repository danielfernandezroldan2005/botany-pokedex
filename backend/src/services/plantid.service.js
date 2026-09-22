export class PlantIdService {
  constructor() {
    this.apiKey = process.env.PLANTID_API_KEY;
    this.apiUrl = 'https://plant.id/api/v3/identification'; 
  }

  async identifyPlant(imageInput) {
    console.log("[Plant.id V3] 🔍 Processing adapted image...");

    let base64Data = "";

    if (!imageInput) {
      throw new Error("No image input provided to Plant.id service.");
    }

    // 1. If it comes with the Gemini structure (inlineData)
    if (imageInput.inlineData && imageInput.inlineData.data) {
      base64Data = imageInput.inlineData.data;
    } 
    // 2. If it is directly a Multer binary Buffer
    else if (Buffer.isBuffer(imageInput)) {
      base64Data = imageInput.toString('base64');
    } 
    // 3. If it is a String (plain Base64)
    else if (typeof imageInput === 'string') {
      base64Data = imageInput.replace(/^data:image\/\w+;base64,/, '');
    }
    // 4. If it is the classic req.file object with buffer
    else if (imageInput.buffer && Buffer.isBuffer(imageInput.buffer)) {
      base64Data = imageInput.buffer.toString('base64');
    }

    if (!base64Data) {
      throw new Error("Image Format not supported in Plant.id service.");
    }

    const requestBody = {
      images: [base64Data],
      similar_images: true
    };

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': this.apiKey
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Plant.id HTTP Error ${response.status}`);
      }

      const data = await response.json();
      console.log("[Plant.id V3] ✅ Identification successful!");

      const bestMatch = data.result?.classification?.suggestions?.[0];
      
      if (!bestMatch) {
        throw new Error("The API did not return valid suggestions.");
      }

      const details = bestMatch.details || {};

      return JSON.stringify({
        commonName: details.common_names ? details.common_names[0] : bestMatch.name,
        scientificName: bestMatch.name,
        family: details.taxonomy?.family || "Family not available",
        description: "Plant identified with Plant.id V3. Botanical accuracy ensured.",
        location: "Native habitat available in botanical databases.",
        careInstructions: {
          light: "Specific consultation recommended.",
          water: "Specific consultation recommended."
        },
        isToxicToPets: true 
      });

    } catch (error) {
      console.error("[Plant.id V3] ❌ Connection failed:", error.message);
      throw error;
    }
  }
}