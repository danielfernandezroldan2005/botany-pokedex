import {useState, useRef} from "react";
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
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    }

    const handleDragLeave = () => {
        setIsDragging(false);
    }

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];

        if (file) {
            handleFileChange(file);
        }
    }

    // Trigger scan callback to parent component.
    const handleSubmit = (e) => {
        // Avoid browser reloading webpage.
        e.preventDefault();

        if (!selectedFile || isLoading) {
            return;
        }

        onScan(selectedFile, selectedOrgan);
    }

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
            </form>
        </div>
    );

}