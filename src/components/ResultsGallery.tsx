
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, CheckCircle } from 'lucide-react';

const ResultsGallery = () => {
  const results = [
    {
      id: 1,
      before: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
      after: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop",
      style: "E-commerce Pro",
      category: "Zapatos Deportivos",
      improvement: "+340% más ventas"
    },
    {
      id: 2,
      before: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
      after: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop",
      style: "Redes Sociales",
      category: "Smartwatch",
      improvement: "+180% engagement"
    },
    {
      id: 3,
      before: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      after: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop",
      style: "Premium Mockup",
      category: "Auriculares",
      improvement: "+250% CTR"
    }
  ];

  const benefits = [
    "10 mockups únicos por generación",
    "Resolución profesional (2K+)",
    "Licencia comercial incluida",
    "Guardado permanente",
    "Descarga ilimitada"
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-slate-800/50 to-slate-900/50">
      <div className="container mx-auto px-4">
        {/* Header mejorado */}
        <div className="text-center mb-16">
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white mb-4">
            IA DE ÚLTIMA GENERACIÓN
          </Badge>
          <h2 className="text-5xl font-bold text-white mb-6">
            Transformaciones <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Reales</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Mira cómo nuestros usuarios han transformado productos simples en mockups que <strong>venden más</strong>
          </p>
          
          {/* Benefits grid */}
          <div className="grid md:grid-cols-5 gap-4 max-w-4xl mx-auto mb-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Galería mejorada */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {results.map((result, index) => (
            <Card key={result.id} className="bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden hover:border-purple-400/50 transition-all duration-500 group">
              <CardContent className="p-0">
                <div className="relative">
                  {/* Antes/Después */}
                  <div className="grid grid-cols-2 gap-0">
                    <div className="relative overflow-hidden">
                      <img 
                        src={result.before} 
                        alt="Antes" 
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge variant="secondary" className="bg-gray-900/90 text-white border-0">
                          Antes
                        </Badge>
                      </div>
                      <div className="absolute inset-0 bg-black/20"></div>
                    </div>
                    <div className="relative overflow-hidden">
                      <img 
                        src={result.after} 
                        alt="Después" 
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                          Después
                        </Badge>
                      </div>
                      {/* Improvement badge */}
                      <div className="absolute bottom-3 right-3">
                        <Badge className="bg-green-500 text-white border-0 text-xs">
                          {result.improvement}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-white font-semibold text-lg mb-1">{result.category}</h3>
                        <p className="text-gray-400 text-sm">{result.style}</p>
                      </div>
                      <Badge variant="outline" className="border-purple-400 text-purple-400 text-xs">
                        IA Generado
                      </Badge>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white mb-1">30 seg</div>
                      <div className="text-xs text-gray-400">Tiempo de generación</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA mejorado */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <Sparkles className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">
                ¿Listo para transformar tus productos?
              </h3>
              <p className="text-gray-300 mb-6">
                Únete a más de 1,000 emprendedores que ya están creando mockups que venden más
              </p>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-4"
              >
                Empezar Gratis
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <p className="text-xs text-gray-400 mt-3">
                5 generaciones gratuitas • No requiere tarjeta de crédito
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ResultsGallery;
