
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SettingsTabProps {
  user: any;
  profileData: any;
  onSignOut: () => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({
  user,
  profileData,
  onSignOut
}) => {
  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Perfil de Usuario</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profileData?.avatar_url} />
              <AvatarFallback>
                {user.email?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm">
                Cambiar Avatar
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Nombre</label>
              <input 
                type="text" 
                defaultValue={profileData?.full_name || user.email}
                className="w-full p-2 border rounded-md mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <input 
                type="email" 
                defaultValue={user.email}
                className="w-full p-2 border rounded-md mt-1"
                disabled
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuración de Cuenta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notificaciones por Email</p>
              <p className="text-sm text-gray-600">Recibir actualizaciones sobre nuevas funciones</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Recordatorios de Créditos</p>
              <p className="text-sm text-gray-600">Avisar cuando queden pocos créditos</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button>Guardar Cambios</Button>
        <Button variant="outline">Cancelar</Button>
        <Button variant="destructive" onClick={onSignOut}>
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
};

export default SettingsTab;
