import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ComplexityLevel, ComplexityContextValue, UserType } from '../types/complexity';
import { DisplayContext } from '../types/context';
import { displayConfigs } from '../utils/context/config';
import { complexityLevels, userTypeConfigs, getEffectiveLevel, isLevelSupported } from '../utils/complexity/config';

const ComplexityContext = createContext<ComplexityContextValue | undefined>(undefined);

interface ComplexityProviderProps {
  children: ReactNode;
  initialLevel?: ComplexityLevel;
  initialUserType?: UserType;
  context?: DisplayContext;
}

export const ComplexityProvider: React.FC<ComplexityProviderProps> = ({ 
  children, 
  initialLevel = 'mid',
  initialUserType = 'professional',
  context = 'desktop'
}) => {
  const [userLevel, setUserLevel] = useState<ComplexityLevel>(initialLevel);
  const [userType, setUserType] = useState<UserType>(initialUserType);
  const [currentContext, setCurrentContext] = useState<DisplayContext>(context);
  
  // Get user type configuration
  const userTypeConfig = userTypeConfigs[userType];
  
  // Ensure user level is valid for current user type and context
  useEffect(() => {
    const contextConfig = displayConfigs[currentContext];
    const typeConfig = userTypeConfigs[userType];
    
    // Check if current level is supported by user type
    if (!typeConfig.complexityLevels.includes(userLevel)) {
      // Set to default level for user type
      setUserLevel(typeConfig.defaultLevel);
    }
    
    // Also check context compatibility
    if (!contextConfig.availableLevels.includes(userLevel)) {
      setUserLevel(contextConfig.defaultLevel);
    }
  }, [currentContext, userType, userLevel]);
  
  // Get available levels (intersection of context and user type levels)
  const availableLevels = displayConfigs[currentContext].availableLevels.filter(
    level => userTypeConfig.complexityLevels.includes(level)
  );
  
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
        if (prev === 'low') return 'low';
        return prev;
      });
    }
  };
  
  // Smart level resolution for content with fewer levels
  const getEffectiveLevelForContent = (availableLevels: ComplexityLevel[]): ComplexityLevel => {
    return getEffectiveLevel(userLevel, availableLevels);
  };
  
  // Check if requested level is supported by content
  const isLevelSupportedByContent = (level: ComplexityLevel, availableLevels: ComplexityLevel[]): boolean => {
    return isLevelSupported(level, availableLevels);
  };
  
  const value: ComplexityContextValue = {
    userLevel,
    setUserLevel,
    userType,
    setUserType,
    context: currentContext,
    availableLevels,
    canUpgrade,
    canDowngrade,
    upgrade,
    downgrade,
    config: complexityLevels[userLevel],
    userTypeConfig,
    getEffectiveLevel: getEffectiveLevelForContent,
    isLevelSupported: isLevelSupportedByContent
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
