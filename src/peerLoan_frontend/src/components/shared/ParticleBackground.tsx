
import React from 'react';
import EnhancedParticleBackground from './EnhancedParticleBackground';

const ParticleBackground: React.FC = () => {
  return (
    <EnhancedParticleBackground 
      particleCount={70}
      particleColor="rgba(104, 129, 255, 0.4)"
      backgroundColor="transparent"
      blurAmount={0}
    />
  );
};

export default ParticleBackground;
