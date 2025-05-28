
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Archivo no válido",
        description: "Por favor selecciona una imagen",
        variant: "destructive",
      });
      return;
    }

    // Validar tamaño (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Archivo muy grande",
        description: "El archivo debe ser menor a 10MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // Convertir a base64 para preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onImageUpload(result);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setIsUploading(false);
      toast({
        title: "Error al subir imagen",
        description: "Por favor intenta nuevamente",
        variant: "destructive",
      });
    }
  }, [onImageUpload, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false,
    disabled: isUploading
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
          transition-all duration-300 bg-white/5 backdrop-blur-sm
          ${isDragActive 
            ? 'border-purple-400 bg-purple-400/10' 
            : 'border-gray-400 hover:border-purple-400 hover:bg-white/10'
          }
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            {isUploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            ) : (
              <Upload className="h-8 w-8 text-white" />
            )}
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {isUploading ? 'Subiendo imagen...' : 'Sube la foto de tu producto'}
            </h3>
            <p className="text-gray-300 mb-4">
              {isDragActive 
                ? 'Suelta la imagen aquí...'
                : 'Arrastra y suelta una imagen o haz clic para seleccionar'
              }
            </p>
            <p className="text-sm text-gray-400">
              Formatos soportados: JPG, PNG, WEBP • Máximo 10MB
            </p>
          </div>
        </div>

        {/* Ejemplos visuales */}
        <div className="mt-8 flex justify-center gap-4 opacity-60">
          <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
            <ImageIcon className="h-6 w-6 text-gray-400" />
          </div>
          <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
            <ImageIcon className="h-6 w-6 text-gray-400" />
          </div>
          <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
            <ImageIcon className="h-6 w-6 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
