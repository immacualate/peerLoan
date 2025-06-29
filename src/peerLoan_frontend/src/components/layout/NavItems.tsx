
import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

export interface NavItem {
  name: string;
  path: string;
  roles?: string[];
  highlight?: boolean;
}

interface NavItemsProps {
  items: NavItem[];
  isMobile?: boolean;
  onClick?: () => void;
}

const NavItems: React.FC<NavItemsProps> = ({ items, isMobile = false, onClick }) => {
  // No items to display
  if (items.length === 0) {
    return null;
  }
  
  // Desktop navigation
  if (!isMobile) {
    return (
      <nav className="hidden md:flex space-x-6">
        {items.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `
              text-sm font-medium transition-colors hover:text-foreground/90
              ${isActive 
                ? 'text-foreground font-semibold after:content-[""] after:block after:w-1/2 after:h-0.5 after:bg-adanfo-blue after:mx-auto after:mt-0.5' 
                : 'text-foreground/60'
              }
              ${item.highlight 
                ? 'bg-gradient-to-r from-adanfo-blue to-adanfo-purple text-white px-3 py-1.5 rounded-md hover:text-white' 
                : ''
              }
            `}
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    );
  }
  
  // Mobile navigation
  return (
    <nav className="flex flex-col space-y-1 pt-4">
      {items.map((item, index) => (
        <motion.div
          key={item.name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 + 0.1 }}
        >
          <NavLink
            to={item.path}
            onClick={onClick}
            className={({ isActive }) => `
              block px-3 py-2.5 text-base font-medium rounded-md transition-colors
              ${isActive 
                ? 'text-foreground bg-accent' 
                : 'text-foreground/70 hover:text-foreground hover:bg-accent/50'
              }
              ${item.highlight 
                ? 'bg-gradient-to-r from-adanfo-blue to-adanfo-purple text-white hover:text-white' 
                : ''
              }
            `}
          >
            {item.name}
          </NavLink>
        </motion.div>
      ))}
    </nav>
  );
};

export default NavItems;
