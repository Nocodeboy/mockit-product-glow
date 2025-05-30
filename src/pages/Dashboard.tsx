
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  ImageIcon, 
  Star, 
  Calendar, 
  Settings, 
  Crown,
  ArrowLeft,
  Download,
  Heart,
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Datos simulados del usuario
  const userStats = {
    creditsRemaining: 85,
    totalCredits: 100,
    mockupsCreated: 47,
    currentPlan: 'Pro',
    memberSince: 'Marzo 2024'
  };

  const recentActivity = [
    {
      id: 1,
      action: 'Mockup creado',
      product: 'Zapatos deportivos',
      date: '2 horas',
      status: 'completado'
    },
    {
      id: 2,
      action: 'Descarga realizada',
      product: 'Reloj inteligente',
      date: '5 horas',
      status: 'completado'
    },
    {
      id: 3,
      action: 'Mockup guardado',
      product: 'Auriculares',
      date: '1 día',
      status: 'completado'
    }
  ];

  const savedMockups = [
    {
      id: 1,
      title: 'Zapatos Deportivos - Estilo Minimalista',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop',
      createdAt: '2024-03-15',
      isFavorite: true,
      downloads: 12
    },
    {
      id: 2,
      title: 'Smartwatch - Lifestyle',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
      createdAt: '2024-03-14',
      isFavorite: false,
      downloads: 8
    },
    {
      id: 3,
      title: 'Auriculares - Premium',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
      createdAt: '2024-03-13',
      isFavorite: true,
      downloads: 15
    },
    {
      id: 4,
      title: 'Perfume - Lujo',
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&h=300&fit=crop',
      createdAt: '2024-03-12',
      isFavorite: false,
      downloads: 6
    }
  ];

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Créditos Restantes</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.creditsRemaining}</div>
            <p className="text-xs text-muted-foreground">
              de {userStats.totalCredits} créditos este mes
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-purple-600 h-2 rounded-full" 
                style={{ width: `${(userStats.creditsRemaining / userStats.totalCredits) * 100}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mockups Creados</CardTitle>
            <ImageIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.mockupsCreated}</div>
            <p className="text-xs text-muted-foreground">
              +12 desde la semana pasada
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plan Actual</CardTitle>
            <Crown className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.currentPlan}</div>
            <p className="text-xs text-muted-foreground">
              Miembro desde {userStats.memberSince}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actividad</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Alta</div>
            <p className="text-xs text-muted-foreground">
              Última actividad: 2 horas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Actividad Reciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.product}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">hace {activity.date}</p>
                  <Badge variant="outline" className="text-xs">
                    {activity.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const GalleryTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Mi Galería ({savedMockups.length} mockups)</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Filtrar
          </Button>
          <Button variant="outline" size="sm">
            Ordenar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedMockups.map((mockup) => (
          <Card key={mockup.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative">
              <img
                src={mockup.image}
                alt={mockup.title}
                className="w-full h-48 object-cover"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                onClick={() => {/* Toggle favorite */}}
              >
                <Heart className={`h-4 w-4 ${mockup.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
              </Button>
            </div>
            
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2 line-clamp-2">{mockup.title}</h4>
              <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                <span>{mockup.createdAt}</span>
                <span>{mockup.downloads} descargas</span>
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  <Download className="h-4 w-4 mr-1" />
                  Descargar
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const SettingsTab = () => (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Perfil de Usuario</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" />
              <AvatarFallback>JD</AvatarFallback>
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
                defaultValue="Juan Pérez"
                className="w-full p-2 border rounded-md mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <input 
                type="email" 
                defaultValue="juan@ejemplo.com"
                className="w-full p-2 border rounded-md mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notificaciones</CardTitle>
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
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver a MockIT
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Mi Cuenta</h1>
                <p className="text-gray-600">Gestiona tu perfil y contenido</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-purple-100 text-purple-800">
                Plan {userStats.currentPlan}
              </Badge>
              <Avatar>
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 lg:w-400">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Vista General
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Mi Galería
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuración
            </TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <TabsContent value="overview">
              <OverviewTab />
            </TabsContent>
            
            <TabsContent value="gallery">
              <GalleryTab />
            </TabsContent>
            
            <TabsContent value="settings">
              <SettingsTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
