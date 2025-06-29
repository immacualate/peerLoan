
import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  glassmorphism?: boolean;
  children: React.ReactNode;
}

const EnhancedCard = ({
  interactive = false,
  glassmorphism = true,
  className,
  children,
  ...props
}: CardProps) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Only add event handlers if card is interactive
  const handleMouseMove = interactive ? (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Calculate mouse position relative to the card center
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Convert to rotation degrees (max 5 degrees - reduced from 6)
    const rotateX = -(y / (rect.height / 2)) * 5;
    const rotateY = (x / (rect.width / 2)) * 5;
    
    // Throttle updates
    requestAnimationFrame(() => {
      setRotation({ x: rotateX, y: rotateY });
    });
  } : undefined;

  const handleMouseLeave = interactive ? () => {
    setRotation({ x: 0, y: 0 });
    setIsHovered(false);
  } : undefined;

  const handleMouseEnter = interactive ? () => {
    setIsHovered(true);
  } : undefined;

  // Optimize motion component props
  const motionProps = {
    ref: cardRef,
    className: cn(
      'relative overflow-hidden rounded-2xl shadow-md transition-all duration-300',
      glassmorphism && 'glass-card',
      interactive && 'cursor-pointer',
      className
    ),
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onMouseEnter: handleMouseEnter,
    style: {
      transform: interactive && isHovered 
        ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(1.02)`
        : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
      transition: 'transform 0.2s ease-out',
      willChange: interactive ? 'transform' : 'auto'
    },
    initial: { opacity: 0, y: 15 }, // Reduced from y: 20
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 } // Reduced from 0.5
  };

  // Use type assertion for motion.div
  const MotionDiv = motion.div as any;

  return (
    <MotionDiv {...motionProps} {...props}>
      {children}
      
      {interactive && isHovered && (
        <div 
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-10 pointer-events-none"
          style={{
            backgroundPosition: `${(rotation.y + 5) * 8}% ${(rotation.x + 5) * 8}%`,
            transition: 'background-position 0.2s ease-out'
          }}
        />
      )}
    </MotionDiv>
  );
};

export { EnhancedCard };
