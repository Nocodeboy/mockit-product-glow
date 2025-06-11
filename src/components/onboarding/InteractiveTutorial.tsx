
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, ArrowRight, ArrowLeft, Upload, Sparkles, Download } from 'lucide-react';

interface InteractiveTutorialProps {
  currentStep: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  onComplete: () => void;
}

const tutorialSteps = [
  {
    title: "¡Bienvenido a MockIT! 🎉",
    description: "Transforma cualquier producto en mockups profesionales usando IA en solo 3 pasos",
    icon: Sparkles,
    highlight: "header",
    content: (
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
          <Badge className="bg-green-500">GRATIS</Badge>
          <span className="text-white">5 generaciones incluidas para empezar</span>
        </div>
        <p className="text-gray-300">
          Cada generación crea 10 mockups únicos que puedes descargar y usar comercialmente.
        </p>
      </div>
    )
  },
  {
    title: "Paso 1: Sube tu producto",
    description: "Arrastra cualquier imagen de tu producto o haz clic para seleccionar",
    icon: Upload,
    highlight: "upload",
    content: (
      <div className="space-y-3">
        <p className="text-gray-300">Funciona mejor con:</p>
        <ul className="space-y-2 text-sm text-gray-400">
          <li>• Fondo transparente o limpio</li>
          <li>• Buena iluminación</li>
          <li>• Producto centrado</li>
          <li>• Alta resolución (mín. 500px)</li>
        </ul>
      </div>
    )
  },
  {
    title: "Paso 2: IA genera mockups",
    description: "Nuestra IA crea 10 variaciones profesionales en 30-60 segundos",
    icon: Sparkles,
    highlight: "generate",
    content: (
      <div className="space-y-3">
        <p className="text-gray-300">La IA creará mockups para:</p>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
          <div>• E-commerce</div>
          <div>• Redes sociales</div>
          <div>• Marketing</div>
          <div>• Presentaciones</div>
        </div>
      </div>
    )
  },
  {
    title: "Paso 3: Descarga y usa",
    description: "Guarda tus mockups favoritos y úsalos en tu negocio",
    icon: Download,
    highlight: "download",
    content: (
      <div className="space-y-3">
        <p className="text-gray-300">Todos los mockups incluyen:</p>
        <ul className="space-y-2 text-sm text-gray-400">
          <li>• Alta resolución</li>
          <li>• Licencia comercial</li>
          <li>• Guardado permanente</li>
          <li>• Descarga ilimitada</li>
        </ul>
      </div>
    )
  }
];

export const InteractiveTutorial: React.FC<InteractiveTutorialProps> = ({
  currentStep,
  onNext,
  onPrev,
  onSkip,
  onComplete
}) => {
  const step = tutorialSteps[currentStep];
  const Icon = step.icon;
  const isLastStep = currentStep === tutorialSteps.length - 1;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-900 border-purple-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Icon className="h-6 w-6 text-purple-400" />
              <Badge variant="outline" className="border-purple-400 text-purple-400">
                {currentStep + 1} de {tutorialSteps.length}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSkip}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {step.title}
              </h3>
              <p className="text-gray-300 mb-4">
                {step.description}
              </p>
            </div>

            {step.content}

            <div className="flex items-center justify-between pt-4">
              <Button
                variant="ghost"
                onClick={onPrev}
                disabled={currentStep === 0}
                className="text-gray-400 hover:text-white disabled:opacity-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>

              {isLastStep ? (
                <Button
                  onClick={onComplete}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  ¡Empezar ahora!
                  <Sparkles className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={onNext}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Siguiente
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
