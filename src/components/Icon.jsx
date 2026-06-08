import React from 'react';
import * as Lucide from 'lucide-react';

/**
 * Dynamically renders a Lucide Icon based on string name.
 * Fallback to HelpCircle if not found.
 */
export const Icon = ({ name, className = '', size = 20 }) => {
  const IconComponent = Lucide[name];
  
  if (!IconComponent) {
    // Return a default icon if name is missing or not matching
    const Fallback = Lucide.HelpCircle;
    return <Fallback className={className} size={size} />;
  }
  
  return <IconComponent className={className} size={size} />;
};

export default Icon;
