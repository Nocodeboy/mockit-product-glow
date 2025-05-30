
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, FileX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
}

const ACCEPTED_IMAGE_TYPES = {
  'image/jpeg': ['.jpeg', '.jpg'],
  'image/png': ['.png'],
  'image/webp': ['.webp']
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const validateImage = useCallback(async (file: File): Promise<boolean> => {
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Archivo no válido",
        description: "Por favor selecciona una imagen (JPG, PNG, WEBP)",
        variant: "destructive",
      });
      return false;
    }

    // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "Archivo muy grande",
        description: `El archivo debe ser menor a ${Math.round(MAX_FILE_SIZE / (1024 * 1024))}MB`,
        variant: "destructive",
      });
      return false;
    }

    // Validar que realmente sea una imagen intentando cargarla
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(url);
        
        // Validar dimensiones mínimas
        if (img.width < 100 || img.height < 100) {
          toast({
            title: "Imagen muy pequeña",
            description: "La imagen debe tener al menos 100x100 píxeles",
            variant: "destructive",
          });
          resolve(false);
          return;
        }
        
        resolve(true);
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        toast({
          title: "Imagen corrupta",
          description: "El archivo no es una imagen válida",
          variant: "destructive",
        });
        resolve(false);
      };
      
      img.src = url;
    });
  }, [toast]);

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
    // Manejar archivos rechazados
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors.some((e: any) => e.code === 'file-too-large')) {
        toast({
          title: "Archivo muy grande",
          description: `El archivo debe ser menor a ${Math.round(MAX_FILE_SIZE / (1024 * 1024))}MB`,
          variant: "destructive",
        });
      } else if (rejection.errors.some((e: any) => e.code === 'file-invalid-type')) {
        toast({
          title: "Tipo de archivo no válido",
          description: "Solo se permiten imágenes JPG, PNG y WEBP",
          variant: "destructive",
        });
      }
      return;
    }

    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      // Validar la imagen
      const isValid = await validateImage(file);
      if (!isValid) {
        setIsUploading(false);
        return;
      }

      // Convertir a base64 para preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          onImageUpload(result);
          toast({
            title: "Imagen cargada exitosamente",
            description: "Tu imagen está lista para generar mockups",
          });
        }
        setIsUploading(false);
      };
      
      reader.onerror = () => {
        toast({
          title: "Error al procesar imagen",
          description: "No se pudo leer el archivo. Intenta con otra imagen.",
          variant: "destructive",
        });
        setIsUploading(false);
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing image:', error);
      setIsUploading(false);
      toast({
        title: "Error al procesar imagen",
        description: "Ocurrió un error inesperado. Por favor intenta nuevamente.",
        variant: "destructive",
      });
    }
  }, [onImageUpload, toast, validateImage]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: ACCEPTED_IMAGE_TYPES,
    multiple: false,
    disabled: isUploading,
    maxSize: MAX_FILE_SIZE
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
          transition-all duration-300 bg-white/5 backdrop-blur-sm
          ${isDragActive && !isDragReject
            ? 'border-purple-400 bg-purple-400/10' 
            : isDragReject
            ? 'border-red-400 bg-red-400/10'
            : 'border-gray-400 hover:border-purple-400 hover:bg-white/10'
          }
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
            isDragReject 
              ? 'bg-gradient-to-r from-red-500 to-red-600'
              : 'bg-gradient-to-r from-purple-500 to-pink-500'
          }`}>
            {isUploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            ) : isDragReject ? (
              <FileX className="h-8 w-8 text-white" />
            ) : (
              <Upload className="h-8 w-8 text-white" />
            )}
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {isUploading 
                ? 'Procesando imagen...' 
                : isDragReject
                ? 'Archivo no válido'
                : 'Sube la foto de tu producto'
              }
            </h3>
            <p className="text-gray-300 mb-4">
              {isDragActive && !isDragReject
                ? 'Suelta la imagen aquí...'
                : isDragReject
                ? 'Este tipo de archivo no es compatible'
                : 'Arrastra y suelta una imagen o haz clic para seleccionar'
              }
            </p>
            <p className="text-sm text-gray-400">
              Formatos: JPG, PNG, WEBP • Máximo {Math.round(MAX_FILE_SIZE / (1024 * 1024))}MB • Mínimo 100x100px
            </p>
          </div>
        </div>

        {/* Ejemplos visuales */}
        <div className="mt-8 flex justify-center gap-4 opacity-60">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
              <ImageIcon className="h-6 w-6 text-gray-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
