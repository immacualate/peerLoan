
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuthContext';
import NavbarLogo from './NavbarLogo';
import NavItems, { NavItem } from './NavItems';
import ThemeToggle from './ThemeToggle';
import MobileMenu from './MobileMenu';
import WalletConnect from '../shared/WalletConnect';
import UserMenu from './UserMenu';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const navItems: NavItem[] = [
    { name: 'Home', path: '/' },
    { name: 'Borrow', path: '/borrower-dashboard', roles: ['borrower'] },
    { name: 'Lend', path: '/lender-dashboard', roles: ['lender'] },
    { name: 'FAQs', path: '/resources/faq' },
  ];
  
  const filteredNavItems = navItems.filter(item => {
    if (!item.roles) return true;
    return user.isAuthenticated && item.roles.includes(user.role);
  });
  
  const mobileNavItems = [...filteredNavItems];
  if (!user.isAuthenticated) {
    mobileNavItems.push({
      name: 'Connect Wallet',
      path: '/wallet-connection',
      highlight: true
    });
  }
  
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);
  
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-background/60 dark:bg-background/40 border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <NavbarLogo />
          
          <NavItems items={filteredNavItems} />
          
          <div className="flex items-center gap-3">            
            <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            
            {!isMobile && (
              <div className="flex items-center gap-2">
                {user.isAuthenticated ? (
                  <UserMenu />
                ) : (
                  <WalletConnect />
                )}
              </div>
            )}
            
            {isMobile && (
              <MobileMenu 
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                navItems={mobileNavItems}
                userRole={user.role}
                isAuthenticated={user.isAuthenticated}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
