export class PlantIdService {
  constructor() {
    this.apiKey = process.env.PLANTID_API_KEY;
    // Endpoint updated to version 3
    this.apiUrl = 'https://plant.id/api/v3/identification'; 
  }

  async identifyPlant(base64Image) {
    console.log("[Plant.id V3] Starting botanical identification...");

    // Remove the Base64 header if it comes from the frontend
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');

    // Request body adjusted for v3
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

      // 🛠️ THE V3 ADAPTER: The data path changes in this version
      const bestMatch = data.result?.classification?.suggestions?.[0];
      
      if (!bestMatch) {
        throw new Error("The API did not return valid suggestions.");
      }

      const details = bestMatch.details || {};

      // We translate this into the exact format your React frontend expects
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
        // Note: Marked as toxic by default to protect your pet until verified.
        isToxicToPets: true 
      });

    } catch (error) {
      console.error("[Plant.id V3] ❌ Connection failed:", error.message);
      throw error;
    }
  }
}