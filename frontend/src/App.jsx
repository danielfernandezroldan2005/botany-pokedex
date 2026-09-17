import { useState } from 'react';

function App() {
  // Save the foto that user selects.
  const[file, setFile] = useState(null);

  // Save JSON return by backend.
  const[result, setResult] = useState(null);

  // Boolean to know if AI is processing an image.
  const[loading, setLoading] = useState(null);

  const handleSubmit = async(e) => {
    // Avoid reloading the page when user push de button.
    e.preventDefault();
    // If any image is load, we abort the function.
    if(!file) return;

    // Activate the loading state.
    setLoading(true);
    // Clean results of other searches.
    setResult(null);

    // Prepare image using FormData (important for sending binary files).
    const formData = new FormData();
    formData.append('plantImage', file);

    try {
      // Make HTTP call for our Express server using the port 3000.
      const response = await fetch('http://localhost:3000/api/v1/plants/identify', { 
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
    
      // Save Google's JSON in our state.
      setResult(data);
    } catch(error) {
      console.error("Error connecting to the backend: ", error);
      setResult({ error: "Fail connection with the server."});
    } finally {
      // Switch off the loading state in all cases (correct or error).
      setLoading(false);
    }
  };

    return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem', fontFamily: 'system-ui' }}>
      <h1 style={{ textAlign: 'center' }}>🌱 Botany Pokédex</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* When a file is selected, we trigger the onChange event and save the image in the 'file' state */}
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => setFile(e.target.files[0])} 
        />
        
        {/* The button is disabled if there is no file or if it's loading */}
        <button 
          type="submit" 
          disabled={!file || loading}
          style={{ padding: '0.8rem', fontSize: '1.1rem', cursor: 'pointer' }}
        >
          {loading ? 'Analyzing with Gemini...' : 'Identify Plant'}
        </button>
      </form>

      {/* Conditional rendering: If the 'result' variable has data, we show this green box */}
      {result && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Result:</h2>
          <pre style={{ backgroundColor: '#1a1a1a', color: '#00ff00', padding: '1rem', borderRadius: '8px', overflowX: 'auto' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default App;