# 🌱 Botany Pokédex

[English](#english) | [Español](#español)

---

# Images | Imágenes:
- Presentation | Presentación:
  <img width="1496" height="552" alt="imagen" src="https://github.com/user-attachments/assets/5c9c5ed6-e8b5-4d3b-8229-33b189c66805" />

- Description | Descripción:
  <img width="2178" height="1340" alt="imagen" src="https://github.com/user-attachments/assets/1b342928-71cf-467f-966f-84c96aeb5937" />

- History | Historial:
  <img width="1714" height="524" alt="imagen" src="https://github.com/user-attachments/assets/cc5f396c-927b-400d-9950-a033f531fae9" />

---

<a name="english"></a>
## English

Full-stack web application designed for real-time botanical identification and classification from images, inspired by the classic Pokédex concept.

🔗 **Live Demo:** [https://tu-proyecto.vercel.app  ](https://botany-pokedex-frontend-op8sxjg9x-danielfernandezroldan2005.vercel.app/)
*(Note: Render free tier services spin down after inactivity. The first request may take 40-50 seconds to boot).*

### Features
- **Visual AI Identification:** Identifies plant species from photos uploaded or taken directly with mobile device cameras.
- **Botanical Profile:** Displays common names (localized in Spanish), scientific taxonomy, plant family, care tips, and pet safety flags.
- **Persistent Storage (My Pokédex):** Uses browser `localStorage` to retain scanned specimens across sessions.
- **Decoupled Architecture:** Secure proxy backend handling image transformations, protecting credentials, and managing CORS policies.

### Tech Stack
- **Frontend:** React 18 (Vite), JavaScript ES6+, Mobile-First CSS
- **Backend:** Node.js, Express.js, Multer (multipart/form-data)
- **APIs & Cloud:** Pl@ntNet API, Render (Backend hosting), Vercel (Frontend hosting)

### Local Setup

1. **Clone repository:**
   git clone https://github.com/tu-usuario/botany-pokedex.git
   cd botany-pokedex

2. **Backend configuration:**
   cd backend
   npm install
   # Create a .env file with:
   # PORT=3000
   # PLANTNET_API_KEY=your_key_here
   # ALLOWED_ORIGIN=http://localhost:5173
   npm run dev

3. **Frontend configuration:**
   cd ../frontend
   npm install
   # Create a .env file with:
   # VITE_API_URL=http://localhost:3000
   npm run dev

---

<a name="español"></a>
## Español

Aplicación web Full-Stack diseñada para la identificación y clasificación botánica en tiempo real a partir de fotografías, inspirada en el concepto de una Pokédex.

🔗 **Demo en vivo:** [https://tu-proyecto.vercel.app  ](https://botany-pokedex-frontend-op8sxjg9x-danielfernandezroldan2005.vercel.app/)
*(Nota: El servidor gratuito de Render entra en reposo tras inactividad. La primera petición puede tardar 40-50 segundos en responder).*

### Características
- **Identificación visual asistida por IA:** Reconocimiento de especies a partir de imágenes subidas o capturadas directamente desde la cámara del móvil.
- **Ficha botánica:** Muestra nombre común (en español), taxonomía científica, familia botánica, cuidados básicos y advertencia de toxicidad para mascotas.
- **Historial persistente (Mi Pokédex):** Guarda en `localStorage` las capturas del usuario para consultarlas en futuras sesiones.
- **Arquitectura desacoplada y segura:** Backend intermedio que gestiona la carga de archivos, protege las claves de API y aplica control de acceso CORS.

### Tecnologías utilizadas
- **Frontend:** React 18 (Vite), JavaScript ES6+, diseño adaptable móvil
- **Backend:** Node.js, Express.js, Multer
- **Servicios y APIs:** Pl@ntNet API, Render (alojamiento backend), Vercel (alojamiento frontend)

### Instalación local

1. **Clonar el repositorio:**
   git clone https://github.com/tu-usuario/botany-pokedex.git
   cd botany-pokedex

2. **Configuración del Backend:**
   cd backend
   npm install
   # Crear archivo .env con:
   # PORT=3000
   # PLANTNET_API_KEY=tu_clave_aqui
   # ALLOWED_ORIGIN=http://localhost:5173
   npm run dev

3. **Configuración del Frontend:**
   cd ../frontend
   npm install
   # Crear archivo .env con:
   # VITE_API_URL=http://localhost:3000
   npm run dev
