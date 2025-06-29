
import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import NavItems, { NavItem } from './NavItems';
import UserRoleBadge from './UserRoleBadge';
import WalletConnect from '../shared/WalletConnect';

interface MobileMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  navItems: NavItem[];
  userRole?: string;
  isAuthenticated: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ 
  isMenuOpen, 
  setIsMenuOpen, 
  navItems, 
  userRole, 
  isAuthenticated 
}) => {
  return (
    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <SheetTrigger asChild>
        <motion.button
          className="p-2 rounded-full text-foreground/70 hover:text-foreground bg-background/80 border border-border/50 hover:border-border focus-ring"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </motion.button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[350px] pt-14">
        <div className="h-full flex flex-col">
          <NavItems items={navItems.filter(item => !item.highlight)} isMobile={true} onClick={() => setIsMenuOpen(false)} />
          
          {/* Highlighted wallet connection button if needed */}
          {navItems.find(item => item.highlight) && !isAuthenticated && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 px-2"
            >
              <Link 
                to="/wallet-connection" 
                className="flex items-center gap-2 bg-gradient-to-r from-adanfo-blue to-adanfo-purple text-white px-4 py-3 rounded-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <Wallet className="h-5 w-5" />
                <span>Connect Internet Identity</span>
              </Link>
            </motion.div>
          )}
          
          {isAuthenticated && userRole !== 'unknown' && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4"
            >
              <UserRoleBadge role={userRole} isMobile={true} />
            </motion.div>
          )}
          
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-auto mb-6 flex justify-center"
          >
            <WalletConnect />
          </motion.div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
