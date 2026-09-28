export class PlantNetService {
  constructor() {
    this.apiKey = process.env.PLANTNET_API_KEY;
    // Added '&lang=es' to request localized common names in Spanish
    this.apiUrl = `https://my-api.plantnet.org/v2/identify/all?api-key=${this.apiKey}&lang=es`;
  }

  async identifyPlant(imageInput) {
    console.log("[Pl@ntNet] Processing image input...");

    let imageBuffer;

    if (!imageInput) {
      throw new Error("No image input provided to PlantNet service.");
    }

    // Standardize incoming image formats into a binary buffer
    if (imageInput.inlineData?.data) {
      imageBuffer = Buffer.from(imageInput.inlineData.data, 'base64');
    } else if (Buffer.isBuffer(imageInput)) {
      imageBuffer = imageInput;
    } else if (typeof imageInput === 'string') {
      const cleanBase64 = imageInput.replace(/^data:image\/\w+;base64,/, '');
      imageBuffer = Buffer.from(cleanBase64, 'base64');
    } else if (imageInput.buffer && Buffer.isBuffer(imageInput.buffer)) {
      imageBuffer = imageInput.buffer;
    } else {
      throw new Error("Unsupported image format in PlantNet service.");
    }

    // Prepare multipart/form-data required by Pl@ntNet API
    const formData = new FormData();
    const blob = new Blob([imageBuffer], { type: 'image/jpeg' });
    formData.append('images', blob, 'plant.jpg');
    formData.append('organs', 'auto');

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Pl@ntNet HTTP Error ${response.status}`);
      }

      const data = await response.json();
      console.log("[Pl@ntNet] ✅ Identification successful!");

      const bestMatch = data.results?.[0];
      if (!bestMatch) {
        throw new Error("No plant match identified in Pl@ntNet database.");
      }

      const species = bestMatch.species;
      const commonNames = species.commonNames || [];

      // Return clean user-facing values in Spanish
      return {
        commonName: commonNames.length > 0 ? commonNames[0] : species.scientificNameWithoutAuthor,
        scientificName: species.scientificNameWithoutAuthor,
        family: species.family?.scientificNameWithoutAuthor || "Familia no disponible",
        description: `Especie identificada mediante Pl@ntNet con un nivel de certeza del ${(bestMatch.score * 100).toFixed(1)}%.`,
        location: "Hábitat registrado en colecciones botánicas.",
        careInstructions: {
          light: "Luz solar indirecta o semisombra según la variedad.",
          water: "Riego moderado permitiendo secar la capa superior del sustrato."
        },
        isToxicToPets: true
      };
    } catch (error) {
      console.error("[Pl@ntNet] ❌ Connection error:", error.message);
      throw error;
    }
  }
}