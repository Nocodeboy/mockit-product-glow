
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "María González",
      role: "Fundadora de BellezaNatural",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b830?w=150&h=150&fit=crop&crop=face",
      content: "MockIT revolucionó completamente mi negocio. En minutos tengo mockups profesionales que antes me costaban días crear.",
      rating: 5,
      company: "BellezaNatural"
    },
    {
      id: 2,
      name: "Carlos Ruiz",
      role: "Director Creativo",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      content: "La calidad de los mockups es increíble. Nuestros clientes quedan impresionados con las presentaciones.",
      rating: 5,
      company: "StudiCreativo"
    },
    {
      id: 3,
      name: "Ana Martín",
      role: "E-commerce Manager",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      content: "Desde que uso MockIT, mis ventas han aumentado un 40%. Los productos se ven mucho más profesionales.",
      rating: 5,
      company: "ModaOnline"
    },
    {
      id: 4,
      name: "David López",
      role: "Freelancer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      content: "Como freelancer, MockIT me ahorra horas de trabajo. Puedo entregar más proyectos en menos tiempo.",
      rating: 5,
      company: "Independiente"
    },
    {
      id: 5,
      name: "Laura Jiménez",
      role: "Marketing Digital",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      content: "La variedad de estilos es perfecta para diferentes campañas. Cada mockup es único y profesional.",
      rating: 5,
      company: "DigitalMax"
    },
    {
      id: 6,
      name: "Roberto Silva",
      role: "CEO",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
      content: "MockIT es una inversión que se paga sola. La presentación de productos nunca había sido tan fácil.",
      rating: 5,
      company: "TechStart"
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-20 bg-gradient-to-br from-purple-900 via-slate-900 to-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="7" cy="7" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Lo que dicen nuestros <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">usuarios</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Miles de empresarios y creativos confían en MockIT para presentar sus productos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="group bg-white/5 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="border-2 border-purple-400/50">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-300">{testimonial.role}</p>
                    <p className="text-xs text-purple-400">{testimonial.company}</p>
                  </div>
                  <Quote className="h-6 w-6 text-purple-400/50" />
                </div>
                
                <div className="flex items-center gap-1 mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                
                <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors duration-300">
                  "{testimonial.content}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <div className="text-3xl font-bold text-white mb-2">10,000+</div>
            <div className="text-gray-300">Usuarios activos</div>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <div className="text-3xl font-bold text-white mb-2">500K+</div>
            <div className="text-gray-300">Mockups creados</div>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <div className="text-3xl font-bold text-white mb-2">4.9/5</div>
            <div className="text-gray-300">Calificación</div>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <div className="text-3xl font-bold text-white mb-2">99.9%</div>
            <div className="text-gray-300">Uptime</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
