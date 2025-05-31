
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ResultsGallery = () => {
  const examples = [
    {
      id: 1,
      before: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
      after: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop",
      style: "Minimalista",
      category: "Electrónicos"
    },
    {
      id: 2,
      before: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
      after: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop",
      style: "Lujo",
      category: "Moda"
    },
    {
      id: 3,
      before: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
      after: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop",
      style: "Lifestyle",
      category: "Hogar"
    },
    {
      id: 4,
      before: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300&h=300&fit=crop",
      after: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop",
      style: "E-commerce",
      category: "Cosméticos"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-slate-100 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100/20 via-pink-100/20 to-purple-100/20"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Transformaciones <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Increíbles</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Mira cómo nuestros usuarios han transformado sus productos simples en mockups profesionales
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {examples.map((example) => (
            <Card key={example.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm border border-gray-200/50">
              <CardContent className="p-0">
                <div className="relative">
                  <div className="flex">
                    <div className="w-1/2 relative overflow-hidden">
                      <img
                        src={example.before}
                        alt="Antes"
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge variant="secondary" className="text-xs bg-white/90 backdrop-blur-sm shadow-sm">
                          Antes
                        </Badge>
                      </div>
                    </div>
                    <div className="w-1/2 relative overflow-hidden">
                      <img
                        src={example.after}
                        alt="Después"
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge className="text-xs bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">
                          Después
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4">
                    <Badge variant="outline" className="mb-2 bg-white/95 backdrop-blur-sm border-white/50 shadow-sm">
                      {example.style}
                    </Badge>
                    <p className="text-white text-sm font-medium drop-shadow-lg">
                      {example.category}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResultsGallery;
