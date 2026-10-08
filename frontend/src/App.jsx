import { useState, useRef, useEffect } from 'react';
import ScannerDropZone from './components/ScannerDropZone.jsx';

function App() {
  // State definitions
  const [plantData, setPlantData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // Read local storage history
  const [pokedexHistory, setPokedexHistory] = useState(() => {
    try {
      const savedData = localStorage.getItem('miPokedexLocal');
      return savedData ? JSON.parse(savedData) : [];
    } catch (error) {
      console.warn("Could not read local history:", error);
      return [];
    }
  });

  // Persist history to localStorage
  useEffect(() => {
    localStorage.setItem('miPokedexLocal', JSON.stringify(pokedexHistory));
  }, [pokedexHistory]);


  const handleReset = () => {
    setPlantData(null);
    setErrorMessage(null);
  };

  // Handle identification request from ScannerDropZone
  const handleScan = async (file, organ) => {
    if (!file) return;

    setIsLoading(true);
    setErrorMessage(null);
    setPlantData(null);

    const formData = new FormData();
    formData.append('plantImage', file);
    if (organ && organ !== 'auto') {
      formData.append('organ', organ);
    }

    try {
      const response = await fetch(`${API_URL}/api/v1/plants/identify`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log("[Client] Response from backend:", data);

      if (!response.ok) {
        throw new Error(data.error?.message || 'Error al identificar el espécimen.');
      }

      if (!data.commonName || !data.scientificName) {
        throw new Error('La respuesta no contiene los datos botánicos necesarios.');
      }

      setPlantData(data);

      const newPlantForHistory = {
        ...data,
        id: Date.now()
      };
      setPokedexHistory((prevHistory) => [newPlantForHistory, ...prevHistory]);
    } catch (error) {
      console.error('[Client] Network Error:', error);
      setErrorMessage('No se pudo completar la identificación. Comprueba la conexión con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      
      {/* HEADER */}
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: '#2e7d32' }}>🌱 Pokédex Botánica</h1>
        <p style={{ color: '#666' }}>Tu asistente botánico para identificar plantas.</p>
      </header>

      {/* SCANNER COMPONENT */}
      <ScannerDropZone
          onScan={handleScan}
          isLoading={isLoading}
      />

      {/* ERROR MESSAGE */}
      {errorMessage && (
        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '8px' }}>
          <strong>Error:</strong> {errorMessage}
        </div>
      )}

      {/* RESULT CARD */}
      {plantData && (
        <div style={{ marginTop: '2rem', padding: '1.5rem', border: '1px solid #c8e6c9', borderRadius: '12px', backgroundColor: '#fdfdfd' }}>
          <h2 style={{ color: '#1b5e20', margin: '0 0 0.25rem 0' }}>
            {plantData.commonName}
          </h2>

          <h3 style={{ color: '#555', fontWeight: 'normal', margin: '0 0 1rem 0' }}>
            <em>{plantData.scientificName}</em>
          </h3>      

          <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: '#555' }}>
            <p style={{ margin: '0 0 0.3rem 0' }}><strong>Familia:</strong> {plantData.family}</p>
            <p style={{ margin: '0 0 0.3rem 0' }}><strong>Origen:</strong> {plantData.location}</p>
            <p style={{ margin: 0 }}>
              <strong>Seguridad para mascotas: </strong> 
              {plantData.isToxicToPets ? (
                <span style={{ color: '#c62828', fontWeight: 'bold' }}>⚠️ Tóxica (Precaución)</span>
              ) : (
                <span style={{ color: '#2e7d32', fontWeight: 'bold' }}>✅ Segura para mascotas</span>
              )}
            </p>
          </div>

          <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '0.75rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Descripción</h4>
            <p style={{ margin: 0, color: '#444', lineHeight: '1.5' }}>
              {plantData.description}
            </p>
          </div>

          <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '0.75rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Instrucciones de cuidado</h4>
            <ul style={{ paddingLeft: '1.2rem', margin: 0, lineHeight: '1.6', color: '#444' }}>
              <li>☀️ <strong>Luz:</strong> {plantData.careInstructions?.light || 'Información no disponible'}</li>
              <li>💧 <strong>Agua:</strong> {plantData.careInstructions?.water || 'Información no disponible'}</li>
            </ul>
          </div>
      
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button 
              onClick={handleReset} 
              style={{ 
                padding: '0.6rem 1.2rem', 
                backgroundColor: '#fff', 
                color: '#2e7d32', 
                border: '1px solid #2e7d32', 
                borderRadius: '8px', 
                cursor: 'pointer' 
              }}
            >
              Escanear otra planta
            </button>
          </div>
        </div>
      )}
      
      {/* HISTORY GALLERY */}
      {pokedexHistory.length > 0 && (
        <div style={{ marginTop: '3rem', borderTop: '2px dashed #c8e6c9', paddingTop: '2rem' }}>
          <h3 style={{ color: '#2e7d32', textAlign: 'center', marginBottom: '1.5rem' }}>
            📚 Mi Pokédex ({pokedexHistory.length})
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
            {pokedexHistory.map((plant) => (
              <div key={plant.id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '1rem', backgroundColor: '#fafafa', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌿</div>
                <h5 style={{ margin: '0 0 0.25rem 0', color: '#1b5e20' }}>{plant.commonName}</h5>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#666', fontStyle: 'italic' }}>
                  {plant.scientificName}
                </p>
                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
                  {plant.isToxicToPets ? '⚠️ Tóxica' : '✅ Segura'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;