
import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, MapPin, Phone } from 'lucide-react';

export const Footer = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-900/95 backdrop-blur-sm border-t border-slate-700/50 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-purple-400" />
              <h3 className="text-xl font-bold text-white">MockIT</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Transforma tus productos en mockups profesionales con inteligencia artificial de última generación.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Mail className="h-4 w-4" />
              <span>contacto@mockit.com</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="col-span-1">
            <h4 className="text-white font-semibold mb-4">Producto</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-purple-400 transition-colors">
                  Generador de Mockups
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-purple-400 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('pricing')} 
                  className="hover:text-purple-400 transition-colors text-left"
                >
                  Precios
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('testimonials')} 
                  className="hover:text-purple-400 transition-colors text-left"
                >
                  Testimonios
                </button>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="col-span-1">
            <h4 className="text-white font-semibold mb-4">Soporte</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:ayuda@mockit.com" className="hover:text-purple-400 transition-colors">
                  Centro de Ayuda
                </a>
              </li>
              <li>
                <a href="mailto:contacto@mockit.com" className="hover:text-purple-400 transition-colors">
                  Contacto
                </a>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('faq')} 
                  className="hover:text-purple-400 transition-colors text-left"
                >
                  FAQ
                </button>
              </li>
              <li>
                <a href="mailto:soporte@mockit.com" className="hover:text-purple-400 transition-colors">
                  Soporte Técnico
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="col-span-1">
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy-policy" className="hover:text-purple-400 transition-colors">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="hover:text-purple-400 transition-colors">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="hover:text-purple-400 transition-colors">
                  Política de Cookies
                </Link>
              </li>
              <li>
                <Link to="/data-processing" className="hover:text-purple-400 transition-colors">
                  Tratamiento de Datos
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700/50 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © 2024 MockIT. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <span className="text-xs text-gray-500">Desarrollado con ❤️ usando IA</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
