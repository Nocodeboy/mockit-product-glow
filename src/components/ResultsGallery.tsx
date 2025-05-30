
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
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Transformaciones Increíbles
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Mira cómo nuestros usuarios han transformado sus productos simples en mockups profesionales
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {examples.map((example) => (
            <Card key={example.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="relative">
                  <div className="flex">
                    <div className="w-1/2 relative">
                      <img
                        src={example.before}
                        alt="Antes"
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge variant="secondary" className="text-xs">
                          Antes
                        </Badge>
                      </div>
                    </div>
                    <div className="w-1/2 relative">
                      <img
                        src={example.after}
                        alt="Después"
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="text-xs bg-green-500">
                          Después
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <Badge variant="outline" className="mb-2 bg-white/90">
                      {example.style}
                    </Badge>
                    <p className="text-white text-sm font-medium">
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
