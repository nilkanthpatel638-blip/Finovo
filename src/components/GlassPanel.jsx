import React from 'react';

export const GlassPanel = ({ children, className = '', hoverEffect = false, glowColor = '' }) => {
  let glowStyle = '';
  if (glowColor === 'emerald') glowStyle = 'glow-emerald';
  if (glowColor === 'gold') glowStyle = 'glow-gold';
  if (glowColor === 'navy') glowStyle = 'glow-navy';
  
  return (
    <div className={`glass-panel rounded-2xl p-6 ${hoverEffect ? 'glass-panel-hover' : ''} ${glowStyle} ${className}`}>
      {children}
    </div>
  );
};

export default GlassPanel;
