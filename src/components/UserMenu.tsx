
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, User, LayoutDashboard, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const UserMenu = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  const handleProfile = () => {
    navigate('/dashboard');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-white/10 transition-colors duration-200">
          <Avatar className="h-9 w-9 border-2 border-white/20">
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold text-sm">
              {getInitials(user.email || 'U')}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-64 bg-white/95 backdrop-blur-md border border-white/20 shadow-xl" 
        align="end" 
        forceMount
        sideOffset={8}
      >
        <DropdownMenuLabel className="font-normal p-4 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-semibold text-gray-900 leading-none">
              {user.email?.split('@')[0] || 'Usuario'}
            </p>
            <p className="text-xs text-gray-600 leading-none">
              {user.email}
            </p>
            <p className="text-xs text-purple-600 font-medium mt-1">
              Cuenta activa
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-gray-200" />
        
        <div className="p-1">
          <DropdownMenuItem 
            onClick={handleProfile}
            className="cursor-pointer rounded-md px-3 py-2.5 hover:bg-purple-50 transition-colors duration-150"
          >
            <User className="mr-3 h-4 w-4 text-purple-600" />
            <span className="text-gray-700 font-medium">Mi Perfil</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={handleDashboard}
            className="cursor-pointer rounded-md px-3 py-2.5 hover:bg-blue-50 transition-colors duration-150"
          >
            <LayoutDashboard className="mr-3 h-4 w-4 text-blue-600" />
            <span className="text-gray-700 font-medium">Panel de Control</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={handleDashboard}
            className="cursor-pointer rounded-md px-3 py-2.5 hover:bg-green-50 transition-colors duration-150"
          >
            <CreditCard className="mr-3 h-4 w-4 text-green-600" />
            <span className="text-gray-700 font-medium">Créditos & Facturación</span>
          </DropdownMenuItem>
        </div>
        
        <DropdownMenuSeparator className="bg-gray-200" />
        
        <div className="p-1">
          <DropdownMenuItem 
            onClick={signOut}
            className="cursor-pointer rounded-md px-3 py-2.5 hover:bg-red-50 transition-colors duration-150 text-red-600"
          >
            <LogOut className="mr-3 h-4 w-4" />
            <span className="font-medium">Cerrar sesión</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
