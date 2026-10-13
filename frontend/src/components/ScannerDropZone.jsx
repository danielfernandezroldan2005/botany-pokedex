import {useState, useRef, useEffect} from "react";
import { Leaf, Flower, Apple, Trees, Sparkles } from 'lucide-react';

export default function ScannerDropZone ({onScan, isLoading}) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewURL, setPreviewURL] = useState(null);
    const [selectedOrgan, setSelectedOrgan] = useState('auto');
    const [isDragging, setIsDragging] = useState(false);

    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    const ORGANS = [
        { id: 'auto', label: 'Auto', icon: Sparkles },
        { id: 'leaf', label: 'Hoja', icon: Leaf },
        { id: 'flower', label: 'Flor', icon: Flower },
        { id: 'fruit', label: 'Fruto', icon: Apple },
        { id: 'bark', label: 'Corteza', icon: Trees },
    ];

    // Avoid memory leaks (fugas de memoria).
    useEffect(() => {
        if (!selectedFile) {
            setPreviewURL(null);
            return;
        }

        const objectURL = URL.createObjectURL(selectedFile);
        setPreviewURL(objectURL);

        return () => URL.revokeObjectURL(objectURL);
    }, [selectedFile]);

    // Function to handle the file change.
    const handleFileChange = (file) => {
        // Check  if the file exists and if it is an image.
        if (!file || !file.type.startsWith('image/')) {
            return;
        }

        // Save the binary file in the state.
        setSelectedFile(file);

        // Generate a temporal URL for preview.
        const objectUrl = URL.createObjectURL(file);
        setPreviewURL(objectUrl);
    };

    // Function to clean the selection.
    const handleClear = () => {
        // Free memory created in the browser.
        if (previewURL) {
            URL.revokeObjectURL(previewURL);
        }

        // Clear local states.
        setSelectedFile(null);
        setPreviewURL(null);

        // Clean native input value for giving the possibility to choose the same image.
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (cameraInputRef.current) cameraInputRef.current.value = '';
    };

    // --- Drag and Drop Event Handlers ---
    // Prevent default browser behavior and manage file capture via DataTransfer API.
    // File over the box.
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    // Mouse out of the box without releasing.
    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    // File dropped in the box.
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
        }
    };

    // Trigger scan callback to parent component.
    const handleSubmit = (event) => {
        event.preventDefault();
        if (!selectedFile || isLoading) return;

        // 1. Dispatch scan request to the parent component
        onScan({ file: selectedFile, organ: selectedOrgan });

        // 2. Clear local file and preview state
        setSelectedFile(null);
        setPreviewURL(null);

        // 3. Reset the hidden file input element if referenced
        if (fileInputRef?.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleFileInputChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
        // Reset input in the case the same image is selected.
        e.target.value = '';
    };

    // Remove selected image.
    const handleRemoveImage = (e) => {
        e.stopPropagation(); // Avoid re-open files selector with clic.
        setSelectedFile(null);
        setPreviewURL(null);
    };

    return (
        <div className="w-full max-w-xl mx-auto bg-white rounded-3xl p-6 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-1xl font-bold uppercase tracking-wider text-slate-500 mb-3">
                        Muestra Botánica
                    </label>

                    {/* Grid of buttons */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {ORGANS.map((organ) => {
                            const Icon = organ.icon;
                            const isSelected = selectedOrgan === organ.id;

                            return (
                                <button
                                    className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all ${
                                        isSelected
                                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 scale-[1.02]'
                                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-400'
                                    }`}
                                    key={organ.id}
                                    type="button"
                                    onClick={() => setSelectedOrgan(organ.id)}
                                >
                                    {/* Icon and Text */}
                                    <Icon className="w-3.5 h-3.5" />
                                    <span>{organ.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleFileInputChange}
                />
                <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                        isDragging
                            ? 'border-emerald-500 bg-emerald-50/50'
                            : 'border-slate-300 hover:border-emerald-400 bg-slate-50/50'
                    }`}
                >
                    {selectedFile ? (
                            <div className="relative w-full max-h-72 rounded-xl overflow-hidden bg-slate-900/5 flex items-center justify-center">
                                <img
                                    src={previewURL}
                                    alt="Muestra seleccionada"
                                    className="w-full h-full max-h-72 object-contain rounded-xl"
                                />
                                    {<button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute top-2 right-2 p-1.5 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full transition-all shadow-md"
                                        title="Eliminar foto"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>}
                            </div>
                        ) : (
                            <div>
                                {<div className="flex flex-col items-center justify-center py-6 text-slate-500">
                                    {
                                        <div className="w-12 h-12 mb-3 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                            <svg
                                                className="w-6 h-6"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                            </svg>
                                        </div>
                                    }
                                    <p className="text-sm font-semibold text-slate-700">
                                        Toca para hacer foto o subir archivo
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">
                                        o arrastra y suelta aquí tu muestra (PNG, JPG)
                                    </p>
                                </div>}
                            </div>
                        )}
                </div>
                <button
                    type="submit"
                    disabled={!selectedFile || isLoading}
                    className={`w-full mt-4 py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                        !selectedFile || isLoading
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25 active:scale-[0.99]'
                    }`}
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                            </svg>
                            <span>Identificando espécimen...</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <span>Identificar planta</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );

}