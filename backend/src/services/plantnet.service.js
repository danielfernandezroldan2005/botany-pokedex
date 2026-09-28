export class PlantNetService {
  constructor() {
    this.apiKey = process.env.PLANTNET_API_KEY;
    this.apiUrl = `https://my-api.plantnet.org/v2/identify/all?api-key=${this.apiKey}`;
  }

  async identifyPlant(imageInput) {
    console.log("[Pl@ntNet] Processing image...");

    let imageBuffer;

    if (!imageInput) {
      throw new Error("No image input provided to PlantNet service.");
    }

    // Adaptación del formato recibido (inlineData, buffer o string base64)
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
      throw new Error("Formato de imagen no soportado en Pl@ntNet service.");
    }

    // Pl@ntNet requiere multipart/form-data
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
      console.log("[Pl@ntNet] ✅ Identificación exitosa");

      const bestMatch = data.results?.[0];
      if (!bestMatch) {
        throw new Error("No se encontraron coincidencias en Pl@ntNet.");
      }

      const species = bestMatch.species;
      const commonNames = species.commonNames || [];

      return {
        commonName: commonNames.length > 0 ? commonNames[0] : species.scientificNameWithoutAuthor,
        scientificName: species.scientificNameWithoutAuthor,
        family: species.family?.scientificNameWithoutAuthor || "Familia no disponible",
        description: `Identificado con Pl@ntNet (certeza: ${(bestMatch.score * 100).toFixed(1)}%).`,
        location: "Hábitat registrado en bases de datos botánicas.",
        careInstructions: {
          light: "Consultar requerimientos según especie.",
          water: "Consultar requerimientos según especie."
        },
        isToxicToPets: true
      };
    } catch (error) {
      console.error("[Pl@ntNet] ❌ Error en la conexión:", error.message);
      throw error;
    }
  }
}