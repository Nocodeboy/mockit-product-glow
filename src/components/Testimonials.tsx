
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "María García",
      role: "Diseñadora Freelance",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b132?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      comment: "MockIT ha revolucionado mi flujo de trabajo. En minutos tengo 10 mockups profesionales que antes me tomaban horas crear."
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      role: "E-commerce Manager",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      comment: "Increíble calidad y velocidad. Nuestras ventas aumentaron 40% después de actualizar todas nuestras fotos de producto con MockIT."
    },
    {
      id: 3,
      name: "Ana Martínez",
      role: "Emprendedora",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      comment: "Como startup, necesitábamos contenido visual profesional sin el costo de un fotógrafo. MockIT fue la solución perfecta."
    },
    {
      id: 4,
      name: "David López",
      role: "Marketing Director",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      comment: "La calidad es impresionante. Nuestro equipo ahora puede crear mockups de nivel publicitario en segundos."
    },
    {
      id: 5,
      name: "Laura Sánchez",
      role: "Influencer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      comment: "Perfecto para content creators. Mis posts ahora tienen un look mucho más profesional y mis seguidores lo notan."
    },
    {
      id: 6,
      name: "Roberto Silva",
      role: "Agencia de Marketing",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      comment: "Hemos integrado MockIT en todos nuestros proyectos de clientes. Es una herramienta indispensable para cualquier agencia."
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Lo que Dicen Nuestros Usuarios
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Miles de profesionales ya confían en MockIT para sus necesidades de mockups
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                
                <p className="text-gray-700 italic">"{testimonial.comment}"</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-8 text-gray-600">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">15,000+</div>
              <div className="text-sm">Usuarios Activos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">500K+</div>
              <div className="text-sm">Mockups Creados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">4.9/5</div>
              <div className="text-sm">Calificación Promedio</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
