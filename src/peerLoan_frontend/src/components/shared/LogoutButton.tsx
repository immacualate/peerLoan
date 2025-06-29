
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuthContext';
import { useWalletManager } from '@/hooks/useWalletManager';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface LogoutButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  variant = 'outline', 
  size = 'sm',
  className = '' 
}) => {
  const { logout } = useAuth();
  const { disconnectWallet, getConnectedWallets } = useWalletManager();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Disconnect all connected wallets first
      const connectedWallets = getConnectedWallets();
      
      for (const wallet of connectedWallets) {
        await disconnectWallet(wallet.type);
      }

      // Then logout from auth
      await logout();
      
      // Clear any cached verification status
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('verification_status_') || key === 'current_user_id') {
          localStorage.removeItem(key);
        }
      });

      toast({
        title: "Logged Out Successfully",
        description: "All wallets disconnected and you've been logged out.",
      });

      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Error",
        description: "There was an issue logging out. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Button 
      variant={variant} 
      size={size}
      onClick={handleLogout}
      className={className}
    >
      <LogOut className="h-4 w-4 mr-2" />
      Logout
    </Button>
  );
};

export default LogoutButton;
