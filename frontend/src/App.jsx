import { useState, useRef, useEffect } from 'react';

function App() {
  // --- STATES ---
  // State to store the file selected by the user.
  const[selectedFile, setSelectedFile] = useState(null);

  // State to store the plant data returned by the backend.
  const[plantData, setPlantData] = useState(null);

  // State to control the loading indicator while fetching the AI.
  const[isLoading, setIsLoading] = useState(false);

  // State to handle any potential error messages.
  const[errorMessage, setErrorMessage] = useState(null);

  // State to store the history (Read from phone memory if it exists).
  const [pokedexHistory, setPokedexHistory] = useState(() => {
    const savedData = localStorage.getItem('myLocalPokedex');
    if (savedData) {
      return JSON.parse(savedData); // Reload save data.
    }
    return []; // Start with empty array.
  });

  // --- REFS ---
  // Auto-save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('miPokedexLocal', JSON.stringify(pokedexHistory));
  }, [pokedexHistory]);

  // A direct reference to the HTML input element.
  const fileInputRef = useRef(null);

  // --- HANDLERS ---
  // Handler triggered when the user selects a file from their device.
  const handleFileChange = (event) => {
    // Grab the first file for the input list.
    // event.target is the HTML input element.
    setSelectedFile(event.target.files[0])
    // Reset previous plant data and errors when a new file is chosen.
    setPlantData(null);
    setErrorMessage(null);
  }

  // Handler when a file is being submitted.
  const handleSubmit = async (event) => {
    event.preventDefault(); // Stops the browser from refreshing the page.
    if (!selectedFile) return; // Return if there is any file selected.

    // Reset UI states before starting the network call.
    setIsLoading(true);
    setErrorMessage(null);
    setPlantData(null);

    // Prepare the multipart/form-data container.
    const formData = new FormData();
    formData.append('plantImage', selectedFile);

    // --- TEMPORARY MOCK FOR UI DEVELOPMENT ---
    setTimeout(() => {
      const newPlant = {
        id: Date.now(), // Added date as id.
        commonName: "Monstera (Simulated)",
        scientificName: "Monstera deliciosa",
        family: "Araceae",                                      
        location: "Tropical rainforests of Central America",    
        isToxicToPets: true, // Perfect for testing the warning badge                          
        description: "A popular houseplant known for its natural leaf holes.",
        careInstructions: {
          light: "Bright indirect sunlight.",
          water: "Water every 1-2 weeks..."
          // Note: Soil is optional, we'll test optional chaining here.       
        }
      };

      // Show plant in the main part.
      setPlantData(newPlant);

      // Add new plant in the first part of our history.
      setPokedexHistory((prevHistory) => [newPlant, ...prevHistory]);
      
      setIsLoading(false);
    }, 1500);

    // --- REAL NETWORK CALL ---
    /* try {
      // Send POST request carrying the binary formData.
      const response = await fetch('http://localhost:3000/api/v1/plants/identify', {
        method: 'POST',
        body: formData,
      });

      // Parse the incoming JSON stream.
      const data = await response.json();

      // Log AI response.
      console.log("📦 Respuesta bruta de Gemini:", data);

      // Inspect if the server responded with an error status code.
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to identify the plant specimen.');
      }
      // Update the state with the validated botanical data.
      setPlantData (data);
    } catch (error) {
      console.error('[Network Error]: ', error);
      setErrorMessage('Could not complete identification. Check your connection or backend server.');
    } finally {
      // Always restore the loading state to allow new submissions
      setIsLoading(false);
    } */
  };

  // Handler to clear the current session and start over.
  const handleReset = () => {
    setSelectedFile(null);
    setPlantData(null);
    setErrorMessage(null);

    // Forcefully clear the browser's real HTML input.
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // --- RETURN VISUAL PART ---
  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      
      {/* HEADER */}
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: '#2e7d32' }}>🌱 Botany Pokédex</h1>
        <p style={{ color: '#666' }}>Your AI-powered plant companion.</p>
      </header>

      {/* FORM */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input 
          type="file" 
          accept="image/*" 
          capture="environment"
          onChange={handleFileChange} 
          // Connect the "controller" here.
          ref={fileInputRef}
        />

        {/* --- IMAGE PREVIEW SECTION --- */}
        {selectedFile && (
          <div style={{ textAlign: 'center', margin: '1rem 0' }}>
            <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>
              Selected Specimen:
            </p>
            
            { /* Plant Image Preview */ }
            <img 
              src={URL.createObjectURL(selectedFile)}
              alt="Plant Preview"
              style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px' }}
            />
            
          </div>
        )}
        
        {/* The Smart Button: disabled if no file OR if currently loading */}
        <button 
          type="submit" 
          disabled={!selectedFile || isLoading}
          style={{ 
            padding: '0.8rem', 
            backgroundColor: '#2e7d32', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '8px',
            cursor: (!selectedFile || isLoading) ? 'not-allowed' : 'pointer',
            opacity: (!selectedFile || isLoading) ? 0.6 : 1
          }}
        >
          {isLoading ? 'Analyzing specimen...' : 'Identify Plant'}        
        </button>
      </form>

      {/* --- ERROR RENDERING (This was missing!) --- */}
      {/* If errorMessage has text, draw a red warning box */}
      {errorMessage && (
        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '8px' }}>
          <strong>Error:</strong> {errorMessage}
        </div>
      )}

      {/* --- RESULT RENDERING --- */}
      {/* If plantData has data, draw the green result card */}
      {plantData && (
        <div style={{ marginTop: '2rem', padding: '1.5rem', border: '1px solid #c8e6c9', borderRadius: '12px', backgroundColor: '#fdfdfd' }}>
          
          <h2 style={{ color: '#1b5e20', margin: '0 0 0.25rem 0' }}>
            {plantData.commonName}
          </h2>

          <h3 style={{ color: '#555', fontWeight: 'normal', margin: '0 0 1rem 0' }}>
            <em>{plantData.scientificName}</em>
          </h3>      

          {/* --- TAXONOMY & ORIGIN --- */}
          <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: '#555' }}>
            
            {/* Render the family and location */}
            <p style={{ margin: '0 0 0.3rem 0' }}><strong>Family:</strong> {plantData.family} </p>
            <p style={{ margin: '0 0 0.3rem 0' }}><strong>Origin:</strong> {plantData.location} </p>
            
            {/* Toxicity Badge (Ternary Operator) */}
            {/* HINT: Use plantData.isToxicToPets ? '...toxic UI...' : '...safe UI...' */}
            <p style={{ margin: 0 }}>
              <strong>Pet Safety: </strong> 
              {plantData.isToxicToPets ? (
                <span style={{ color: '#c62828', fontWeight: 'bold' }}>⚠️ Toxic</span>
              ) : (
                <span style={{ color: '#2e7d32', fontWeight: 'bold' }}>✅ Safe for pets</span>
              )}
            </p>
          </div>

          {/* --- DESCRIPTION & CARE --- */}
          <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '0.75rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Description</h4>
            
            {/* Render the plant description here */}
            <p style={{ margin: 0, color: '#444', lineHeight: '1.5' }}>
              {plantData.description}
            </p>
          </div>

          <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '0.75rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Care Instructions</h4>
            <ul style={{ paddingLeft: '1.2rem', margin: 0, lineHeight: '1.6', color: '#444' }}>
              
              {/* Render light, water, and soil navigating through the nested object */}
              <li>☀️ <strong>Light:</strong> {plantData.careInstructions?.light || 'Data not available'} </li>
              <li>💧 <strong>Water:</strong> {plantData.careInstructions?.water || 'Data not available'} </li>
              <li>🌱 <strong>Soil:</strong> {plantData.careInstructions?.soil || 'Data not available'} </li>
              
            </ul>
          </div>
      
          {/* Added Reset Button. */}
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
              Scan Another Plant
            </button>
          </div>
        </div>
      )}
      
      {/* --- HISTORY GALLERY SECTION --- */}
      {pokedexHistory.length > 0 && (
        <div style={{ marginTop: '3rem', borderTop: '2px dashed #c8e6c9', paddingTop: '2rem' }}>
          
          <h3 style={{ color: '#2e7d32', textAlign: 'center', marginBottom: '1.5rem' }}>
            📚 My Pokédex ({pokedexHistory.length})
          </h3>
          
          {/* CSS Grid for a responsive gallery */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
            
            {/* Loop through the history array and draw a mini-card for each plant */}
            {pokedexHistory.map((plant) => (
              <div key={plant.id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '1rem', backgroundColor: '#fafafa', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌿</div>
                <h5 style={{ margin: '0 0 0.25rem 0', color: '#1b5e20' }}>{plant.commonName}</h5>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#666', fontStyle: 'italic' }}>
                  {plant.scientificName}
                </p>
                {/* Visual indicator for pet safety in the mini card */}
                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
                  {plant.isToxicToPets ? '⚠️ Toxic' : '✅ Safe'}
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