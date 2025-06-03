
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "María González",
      role: "Diseñadora de Productos",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b830?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      comment: "MockIT ha revolucionado mi flujo de trabajo. En minutos tengo mockups profesionales que antes me tomaban horas crear."
    },
    {
      id: 2,
      name: "Carlos Ruiz",
      role: "E-commerce Manager",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      comment: "La calidad de los mockups generados es impresionante. Mis ventas online han aumentado un 40% desde que uso MockIT."
    },
    {
      id: 3,
      name: "Ana López",
      role: "Fundadora de Startup",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      comment: "Como startup, necesitábamos resultados rápidos y profesionales. MockIT nos permitió presentar nuestros productos de manera increíble."
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-400'
        }`}
      />
    ));
  };

  return (
    <section className="py-20 bg-gradient-to-br from-purple-900/20 to-slate-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Lo que Dicen Nuestros Clientes
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Miles de empresas ya confían en MockIT para crear mockups profesionales
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback className="bg-purple-500 text-white">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-white font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex gap-1 mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                
                <p className="text-gray-300 italic">
                  "{testimonial.comment}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
            <span className="text-white font-semibold">4.9/5</span>
            <span className="text-gray-300">basado en +1,200 reseñas</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
