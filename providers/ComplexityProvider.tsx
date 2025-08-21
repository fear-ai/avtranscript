import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ComplexityLevel, ComplexityContextValue } from '../types/complexity';
import { DisplayContext } from '../types/context';
import { displayConfigs } from '../utils/context/config';
import { complexityLevels } from '../utils/complexity/config';

const ComplexityContext = createContext<ComplexityContextValue | undefined>(undefined);

interface ComplexityProviderProps {
  children: ReactNode;
  initialLevel?: ComplexityLevel;
  context?: DisplayContext;
}

export const ComplexityProvider: React.FC<ComplexityProviderProps> = ({ 
  children, 
  initialLevel = 'mid',
  context = 'desktop'
}) => {
  const [userLevel, setUserLevel] = useState<ComplexityLevel>(initialLevel);
  const [currentContext, setCurrentContext] = useState<DisplayContext>(context);
  
  // Ensure user level is valid for current context
  useEffect(() => {
    const config = displayConfigs[currentContext];
    if (!config.availableLevels.includes(userLevel)) {
      setUserLevel(config.defaultLevel);
    }
  }, [currentContext, userLevel]);
  
  const availableLevels = displayConfigs[currentContext].availableLevels;
  const canUpgrade = availableLevels.indexOf(userLevel) < availableLevels.length - 1;
  const canDowngrade = availableLevels.indexOf(userLevel) > 0;
  
  const upgrade = () => {
    if (canUpgrade) {
      setUserLevel(prev => {
        if (prev === 'low') return 'mid';
        if (prev === 'mid') return 'high';
        return prev;
      });
    }
  };
  
  const downgrade = () => {
    if (canDowngrade) {
      setUserLevel(prev => {
        if (prev === 'high') return 'mid';
        if (prev === 'mid') return 'low';
        return prev;
      });
    }
  };
  
  const value: ComplexityContextValue = {
    userLevel,
    setUserLevel,
    context: currentContext,
    availableLevels,
    canUpgrade,
    canDowngrade,
    upgrade,
    downgrade,
    config: complexityLevels[userLevel]
  };
  
  return (
    <ComplexityContext.Provider value={value}>
      {children}
    </ComplexityContext.Provider>
  );
};

export const useComplexity = (): ComplexityContextValue => {
  const context = useContext(ComplexityContext);
  if (context === undefined) {
    throw new Error('useComplexity must be used within a ComplexityProvider');
  }
  return context;
};
