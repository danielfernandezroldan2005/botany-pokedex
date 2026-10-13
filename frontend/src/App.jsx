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
    const handleScan = async (arg1, arg2) => {
        console.log("[DEBUG 1] arg1:", arg1);
        console.log("[DEBUG 2] arg2:", arg2);

        // Normalize to accept {file, organ} or parameters alone.
        const file = arg1?.file || (arg1 instanceof File ? arg1 : null);
        const organ = arg1?.organ || arg2 || 'auto';

        console.log("[DEBUG 3] File completed:", file);
        if (!file) {
            console.error("[DEBUG 4] File does not exist or is not in File format.");
            return;
        }

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
            <header className="text-center mb-8">
                <h1 className="flex items-center justify-center gap-3 text-3xl font-extrabold tracking-tight text-slate-900">
                    <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-emerald-100/80 text-emerald-800 shadow-sm">
                        <span className="text-2xl">🌱</span>
                    </div>
                    <span>
                        Botany<span className="text-emerald-600">Dex</span>
                    </span>
                </h1>
                <p className="text-sm text-slate-500 mt-2">
                    Identificación botánica inteligente y registro de especímenes
                </p>
            </header>

            {/* SCANNER COMPONENT */}
            <ScannerDropZone
                key={plantData ? 'has-data' : 'empty'}
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
                <section className="mt-12 pt-8 border-t border-dashed border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-slate-500 flex items-center gap-2">
                            <span>📚</span> Muestras Guardadas
                        </h3>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            {pokedexHistory.length} registros
                        </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {pokedexHistory.map((plant) => (
                            <button
                                key={plant.id}
                                type="button"
                                onClick={() => {
                                    setPlantData(plant);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="group text-left p-3.5 bg-white border border-slate-200/80 rounded-xl hover:border-emerald-400 hover:shadow-md transition-all active:scale-[0.98]"
                            >
                                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform origin-left">
                                    🌿
                                </div>
                                <h5 className="font-semibold text-xs text-slate-900 truncate">
                                    {plant.commonName}
                                </h5>
                                <p className="text-[11px] italic text-slate-400 truncate">
                                    {plant.scientificName}
                                </p>
                                <div className="mt-2 text-[10px] font-medium text-slate-500">
                                    {plant.isToxicToPets ? '⚠️ Tóxica' : '✅ Segura'}
                                </div>
                            </button>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

export default App;