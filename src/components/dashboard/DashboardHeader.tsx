
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardHeaderProps {
  user: any;
  profileData: any;
  subscription_tier: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  profileData,
  subscription_tier
}) => {
  const navigate = useNavigate();

  const getPlanDisplayName = (tier: string) => {
    const planNames = {
      'free': 'Gratuito',
      'pro': 'Pro',
      'enterprise': 'Empresas'
    };
    return planNames[tier as keyof typeof planNames] || tier;
  };

  const getPlanColor = (tier: string) => {
    const colors = {
      'free': 'bg-gray-100 text-gray-800',
      'pro': 'bg-purple-100 text-purple-800',
      'enterprise': 'bg-yellow-100 text-yellow-800'
    };
    return colors[tier as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
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
            <Badge className={getPlanColor(subscription_tier)}>
              Plan {getPlanDisplayName(subscription_tier)}
            </Badge>
            <Avatar>
              <AvatarImage src={profileData?.avatar_url} />
              <AvatarFallback>
                {user.email?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
