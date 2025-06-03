
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ResultsGallery = () => {
  const results = [
    {
      id: 1,
      before: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
      after: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=300&fit=crop",
      style: "Profesional",
      category: "Zapatos"
    },
    {
      id: 2,
      before: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
      after: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300&h=300&fit=crop",
      style: "Minimalista",
      category: "Reloj"
    },
    {
      id: 3,
      before: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
      after: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=300&fit=crop",
      style: "Elegante",
      category: "Auriculares"
    }
  ];

  return (
    <section className="py-20 bg-slate-800/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Galería de Resultados
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Descubre las increíbles transformaciones que nuestra IA puede crear para tus productos
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {results.map((result) => (
            <Card key={result.id} className="bg-white/10 backdrop-blur-sm border border-white/20 overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
              <CardContent className="p-0">
                <div className="relative">
                  <div className="grid grid-cols-2">
                    <div className="relative">
                      <img 
                        src={result.before} 
                        alt="Antes" 
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge variant="secondary" className="bg-gray-900/80 text-white">
                          Antes
                        </Badge>
                      </div>
                    </div>
                    <div className="relative">
                      <img 
                        src={result.after} 
                        alt="Después" 
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          Después
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{result.category}</span>
                      <Badge variant="outline" className="border-purple-400 text-purple-400">
                        {result.style}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-300 text-lg">
            ¿Listo para transformar tus productos? ¡Empieza ahora!
          </p>
        </div>
      </div>
    </section>
  );
};

export default ResultsGallery;
