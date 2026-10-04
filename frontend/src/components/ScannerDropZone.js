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
}