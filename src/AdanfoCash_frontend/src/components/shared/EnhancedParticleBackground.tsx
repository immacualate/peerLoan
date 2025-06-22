
import React from 'react';
import ParticleCanvas from './particles/ParticleCanvas';

interface EnhancedParticleBackgroundProps {
  className?: string;
  particleCount?: number;
  particleColor?: string;
  backgroundColor?: string;
  blurAmount?: number;
}

const EnhancedParticleBackground: React.FC<EnhancedParticleBackgroundProps> = ({
  className = '',
  particleCount = 60, // Reduced from 90
  particleColor = 'rgba(104, 129, 255, 0.4)',
  backgroundColor = 'transparent',
  blurAmount = 0
}) => {
  // Only render the blur element if actually needed
  const shouldRenderBlur = blurAmount > 0;
  
  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden ${className}`}>
      <ParticleCanvas 
        particleCount={particleCount}
        particleColor={particleColor}
        backgroundColor={backgroundColor}
      />
      {shouldRenderBlur && (
        <div 
          className="absolute inset-0" 
          style={{ 
            backdropFilter: `blur(${blurAmount}px)`,
            WebkitBackdropFilter: `blur(${blurAmount}px)`
          }}
        />
      )}
    </div>
  );
};

export default React.memo(EnhancedParticleBackground);
