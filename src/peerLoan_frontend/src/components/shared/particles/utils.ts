
import { Particle, COLORS, WEB3_COLORS } from './types';

// Initialize particles
export const initializeParticles = (canvasWidth: number, canvasHeight: number, count: number = 90): Particle[] => {
  return Array.from({ length: count }, () => {
    const isRocket = Math.random() < 0.05; // 5% chance to be a rocket
    const isOrbit = Math.random() < 0.25; // 25% chance to be in orbit
    
    const shapes: ('circle' | 'square' | 'triangle' | 'diamond' | 'hex' | 'star')[] = 
      ['circle', 'square', 'triangle', 'diamond', 'hex', 'star'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    
    // Random position on the canvas
    const x = Math.random() * canvasWidth;
    const y = Math.random() * canvasHeight;
    
    // Parameters for orbital particles
    let orbitRadius, orbitSpeed, orbitCenterX, orbitCenterY, orbitAngle;
    
    if (isOrbit) {
      orbitRadius = 50 + Math.random() * 200; // Increased max radius
      orbitSpeed = 0.005 + Math.random() * 0.02;
      orbitCenterX = Math.random() * canvasWidth;
      orbitCenterY = Math.random() * canvasHeight;
      orbitAngle = Math.random() * Math.PI * 2;
    }
    
    return {
      x,
      y,
      size: isRocket ? 3 + Math.random() * 2 : 1 + Math.random() * 3,
      color: isOrbit 
        ? WEB3_COLORS[Math.floor(Math.random() * WEB3_COLORS.length)] 
        : COLORS[Math.floor(Math.random() * COLORS.length)],
      speed: isRocket ? 1 + Math.random() * 3 : 0.1 + Math.random() * 0.5,
      direction: Math.random() * Math.PI * 2,
      opacity: 0.1 + Math.random() * 0.6,
      trail: [],
      isRocket,
      isOrbit,
      orbitRadius,
      orbitSpeed,
      orbitCenterX,
      orbitCenterY,
      orbitAngle,
      shape
    };
  });
};

// Draw a particle based on its shape
export const drawParticle = (
  ctx: CanvasRenderingContext2D, 
  particle: Particle
) => {
  // Draw the particle based on its shape
  ctx.fillStyle = particle.isRocket ? 
    `rgba(255, 255, 255, ${particle.opacity})` : 
    particle.color;
  
  ctx.beginPath();
  
  switch(particle.shape) {
    case 'square':
      ctx.rect(
        particle.x - particle.size, 
        particle.y - particle.size, 
        particle.size * 2, 
        particle.size * 2
      );
      break;
    case 'triangle':
      ctx.moveTo(particle.x, particle.y - particle.size);
      ctx.lineTo(particle.x - particle.size, particle.y + particle.size);
      ctx.lineTo(particle.x + particle.size, particle.y + particle.size);
      ctx.closePath();
      break;
    case 'diamond':
      ctx.moveTo(particle.x, particle.y - particle.size);
      ctx.lineTo(particle.x + particle.size, particle.y);
      ctx.lineTo(particle.x, particle.y + particle.size);
      ctx.lineTo(particle.x - particle.size, particle.y);
      ctx.closePath();
      break;
    case 'hex':
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const xPos = particle.x + particle.size * Math.cos(angle);
        const yPos = particle.y + particle.size * Math.sin(angle);
        
        if (i === 0) {
          ctx.moveTo(xPos, yPos);
        } else {
          ctx.lineTo(xPos, yPos);
        }
      }
      ctx.closePath();
      break;
    case 'star':
      for (let i = 0; i < 10; i++) {
        const radius = i % 2 === 0 ? particle.size : particle.size / 2;
        const angle = (Math.PI / 5) * i;
        const xPos = particle.x + radius * Math.cos(angle);
        const yPos = particle.y + radius * Math.sin(angle);
        
        if (i === 0) {
          ctx.moveTo(xPos, yPos);
        } else {
          ctx.lineTo(xPos, yPos);
        }
      }
      ctx.closePath();
      break;
    case 'circle':
    default:
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      break;
  }
  
  ctx.fill();
};

// Draw particle trail (for rockets)
export const drawParticleTrail = (
  ctx: CanvasRenderingContext2D,
  particle: Particle
) => {
  if (!particle.isRocket || particle.trail.length === 0) return;
  
  particle.trail.forEach((point, index) => {
    const trailOpacity = point.opacity * (1 - index / 10);
    const trailSize = particle.size * (1 - index / 10);
    
    ctx.fillStyle = `rgba(255, 165, 0, ${trailOpacity})`;
    ctx.beginPath();
    ctx.arc(point.x, point.y, trailSize, 0, Math.PI * 2);
    ctx.fill();
  });
};

// Draw connecting lines between particles
export const drawConnectingLines = (
  ctx: CanvasRenderingContext2D,
  particle: Particle,
  otherParticles: Particle[]
) => {
  otherParticles.forEach(otherParticle => {
    if (particle === otherParticle) return;
    
    const dx = particle.x - otherParticle.x;
    const dy = particle.y - otherParticle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Only connect if particles are close enough
    if (distance < 100) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 100)})`; // Fade with distance
      ctx.moveTo(particle.x, particle.y);
      ctx.lineTo(otherParticle.x, otherParticle.y);
      ctx.stroke();
    }
  });
};

// Update particle position
export const updateParticlePosition = (
  particle: Particle, 
  canvasWidth: number, 
  canvasHeight: number
): Particle => {
  const updatedParticle = {...particle};
  
  // Add current position to trail (only for rockets)
  if (updatedParticle.isRocket) {
    updatedParticle.trail.unshift({
      x: updatedParticle.x,
      y: updatedParticle.y,
      opacity: updatedParticle.opacity
    });
    
    // Limit trail length
    if (updatedParticle.trail.length > 10) {
      updatedParticle.trail.pop();
    }
  }
  
  // Move particle based on whether it's orbital or not
  if (updatedParticle.isOrbit && updatedParticle.orbitCenterX && updatedParticle.orbitCenterY && 
      updatedParticle.orbitAngle !== undefined && updatedParticle.orbitRadius && updatedParticle.orbitSpeed) {
    // Update orbit angle
    updatedParticle.orbitAngle += updatedParticle.orbitSpeed;
    
    // Calculate new position based on orbit
    updatedParticle.x = updatedParticle.orbitCenterX + Math.cos(updatedParticle.orbitAngle) * updatedParticle.orbitRadius;
    updatedParticle.y = updatedParticle.orbitCenterY + Math.sin(updatedParticle.orbitAngle) * updatedParticle.orbitRadius;
  } else {
    // Move particle as before for non-orbital particles
    updatedParticle.x += Math.cos(updatedParticle.direction) * updatedParticle.speed;
    updatedParticle.y += Math.sin(updatedParticle.direction) * updatedParticle.speed;
    
    // Randomly change direction slightly
    updatedParticle.direction += (Math.random() - 0.5) * 0.1;
    
    // Boundary check
    if (updatedParticle.x < 0) updatedParticle.x = canvasWidth;
    if (updatedParticle.x > canvasWidth) updatedParticle.x = 0;
    if (updatedParticle.y < 0) updatedParticle.y = canvasHeight;
    if (updatedParticle.y > canvasHeight) updatedParticle.y = 0;
  }
  
  return updatedParticle;
};
