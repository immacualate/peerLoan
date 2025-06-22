
import React, { useEffect, useRef, useMemo } from 'react';

interface ParticleCanvasProps {
  className?: string;
  particleCount?: number;
  particleColor?: string;
  backgroundColor?: string;
}

const ParticleCanvas: React.FC<ParticleCanvasProps> = ({
  className = '',
  particleCount = 70, // Reduced from 100
  particleColor = 'rgba(255, 255, 255, 0.7)',
  backgroundColor = 'transparent'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<any[]>([]);
  const requestRef = useRef<number>();
  
  // Create particles once with useMemo
  const particles = useMemo(() => {
    const initialParticles = [];
    for (let i = 0; i < particleCount; i++) {
      initialParticles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 1.5 + 0.5, // Smaller particles
        speedX: Math.random() * 0.3 - 0.15, // Slower movement
        speedY: Math.random() * 0.3 - 0.15, // Slower movement
        opacity: Math.random() * 0.5 + 0.3
      });
    }
    return initialParticles;
  }, [particleCount]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    // Initialize particles from memoized value
    const initParticles = () => {
      particlesRef.current = [...particles];
    };
    
    // Optimized animation function with reduced drawing operations
    const animate = () => {
      if (!canvas || !ctx) return;
      
      // Only clear and fill if backgroundColor is not transparent
      if (backgroundColor !== 'transparent') {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      
      particlesRef.current.forEach(particle => {
        // Update position (less frequent updates for better performance)
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // More efficient boundary handling
        if (particle.x < 0) particle.x = canvas.width;
        else if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        else if (particle.y > canvas.height) particle.y = 0;
        
        // Batch drawing operations
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
      });
      
      // Request next frame with RAF
      requestRef.current = requestAnimationFrame(animate);
    };
    
    // Set up canvas and start animation
    updateSize();
    
    // Throttled resize listener
    let resizeTimeout: number;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(updateSize, 200);
    };
    
    window.addEventListener('resize', handleResize);
    initParticles();
    requestRef.current = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [particles, particleColor, backgroundColor]); 
  
  return (
    <canvas 
      ref={canvasRef} 
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ willChange: 'transform' }} // Hardware acceleration hint
    />
  );
};

export default React.memo(ParticleCanvas); // Prevent unnecessary re-renders
