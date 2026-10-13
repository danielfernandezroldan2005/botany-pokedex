# 🌱 BotanyDex

[English](#english) | [Español](#español)

---

## Gallery | Galería
- **Scanner & Upload | Escáner y Carga:**
  <img width="1496" height="552" alt="BotanyDex Scanner" src="https://github.com/user-attachments/assets/5c9c5ed6-e8b5-4d3b-8229-33b189c66805" />

- **Botanical Profile & Care Guide | Ficha Técnica y Cuidados:**
  <img width="2178" height="1340" alt="BotanyDex Profile" src="https://github.com/user-attachments/assets/1b342928-71cf-467f-966f-84c96aeb5937" />

- **Interactive Specimen Collection | Historial Interactivo de Especímenes:**
  <img width="1714" height="524" alt="BotanyDex History" src="https://github.com/user-attachments/assets/cc5f396c-927b-400d-9950-a033f531fae9" />

---

<a name="english"></a>
## English

Full-stack web application designed for real-time botanical identification, organ classification, and plant care reference, inspired by the classic Pokédex concept.

🔗 **Live Demo:** [https://botany-pokedex-frontend-op8sxjg9x-danielfernandezroldan2005.vercel.app/](https://botany-pokedex-frontend-op8sxjg9x-danielfernandezroldan2005.vercel.app/)  
*(Note: Render free tier services spin down after periods of inactivity. The initial request may take 40–50 seconds to boot).*

### Features
- **Visual Plant Identification:** Classifies species using the Pl@ntNet API from dragged/dropped files, file uploads, or mobile camera captures.
- **Botanical Organ Targeting:** Filters scans by anatomical parts (`Auto`, `Leaf`, `Flower`, `Fruit`, `Bark`) for higher identification accuracy.
- **Dynamic Pet Toxicity Analysis:** Analyzes identified families and genera against veterinary toxicity data (ASPCA-aligned) to flag safe vs. toxic species for dogs and cats.
- **Detailed Care Guidelines:** Returns localized common names (Spanish), family taxonomy, sunlight exposure, and watering instructions.
- **Interactive Local Specimen Deck:** Persists identified plants in browser `localStorage`, allowing users to revisit complete specimen profiles by clicking items in the gallery grid.
- **Secure Backend Proxy:** Mediates client calls with Multer memory storage, encapsulating API credentials and handling CORS.

### Tech Stack
- **Frontend:** React 18, Vite, Tailwind CSS, Lucide / Headless UI patterns
- **Backend:** Node.js, Express.js, Multer (`multipart/form-data`)
- **APIs & Cloud:** Pl@ntNet REST API v2, Vercel (Frontend), Render (Backend)

### Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tu-usuario/BotanyDex.git
   cd BotanyDex
   ```

2. **Backend configuration:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file inside the `backend` folder:
   ```env
   PORT=3000
   PLANTNET_API_KEY=your_plantnet_api_key_here
   ALLOWED_ORIGIN=http://localhost:5173
   ```
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Frontend configuration:**
   ```bash
   cd ../frontend
   npm install
   ```
   Create a `.env` file inside the `frontend` folder:
   ```env
   VITE_API_URL=http://localhost:3000
   ```
   Start the frontend application:
   ```bash
   npm run dev
   ```

---

<a name="español"></a>
## Español

Aplicación web Full-Stack diseñada para la identificación botánica en tiempo real, segmentación por órganos y consulta de pautas de cuidado, inspirada en la dinámica de una Pokédex.

🔗 **Demo en vivo:** [https://botany-pokedex-frontend-op8sxjg9x-danielfernandezroldan2005.vercel.app/](https://botany-pokedex-frontend-op8sxjg9x-danielfernandezroldan2005.vercel.app/)  
*(Nota: El plan gratuito de Render entra en reposo por inactividad. La primera petición puede demorarse 40–50 segundos).*

### Características
- **Identificación visual asistida:** Clasificación taxonómica mediante la API v2 de Pl@ntNet desde imágenes cargadas o tomadas con la cámara del dispositivo móvil.
- **Segmentación por órganos botánicos:** Permite afinar el escaneo según la parte de la muestra (`Auto`, `Hoja`, `Flor`, `Fruto`, `Corteza`) optimizando el porcentaje de certeza.
- **Evaluación dinámica de toxicidad para mascotas:** Analiza la familia botánica y el género frente a registros toxicológicos para determinar si el espécimen representa un riesgo para perros o gatos.
- **Ficha botánica completa:** Presenta nombres comunes localizados en español, taxonomía científica, familia, nivel de luz y frecuencia de riego.
- **Historial interactivo persistente:** Guarda los especímenes catalogados en `localStorage` y permite recargar la ficha técnica completa al pulsar cualquier registro de la colección.
- **Arquitectura desacoplada y segura:** Backend proxy en Express con Multer que procesa los binarios en memoria, resguarda las claves de API y aplica políticas CORS.

### Tecnologías utilizadas
- **Frontend:** React 18, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js, Multer (`multipart/form-data`)
- **Servicios y APIs:** Pl@ntNet API v2, Vercel (Frontend hosting), Render (Backend hosting)

### Instalación local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/BotanyDex.git
   cd BotanyDex
   ```

2. **Configuración del Backend:**
   ```bash
   cd backend
   npm install
   ```
   Crear el archivo `.env` dentro de la carpeta `backend`:
   ```env
   PORT=3000
   PLANTNET_API_KEY=tu_clave_plantnet_aqui
   ALLOWED_ORIGIN=http://localhost:5173
   ```
   Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

3. **Configuración del Frontend:**
   ```bash
   cd ../frontend
   npm install
   ```
   Crear el archivo `.env` dentro de la carpeta `frontend`:
   ```env
   VITE_API_URL=http://localhost:3000
   ```
   Iniciar el cliente web:
   ```bash
   npm run dev
   ```