import { useState, useEffect } from 'react';
import { ComplexityLevel } from '../../types/complexity';
import { DisplayContext } from '../../types/context';
import { displayConfigs } from '../../utils/context/config';
import { complexityLevels } from '../../utils/complexity/config';

export const useComplexityLevel = (context: DisplayContext, userPreference?: ComplexityLevel) => {
  const [currentLevel, setCurrentLevel] = useState<ComplexityLevel>('mid');
  
  useEffect(() => {
    const config = displayConfigs[context];
    const preferredLevel = userPreference && config.availableLevels.includes(userPreference) 
      ? userPreference 
      : config.defaultLevel;
    
    setCurrentLevel(preferredLevel);
  }, [context, userPreference]);
  
  const availableLevels = displayConfigs[context].availableLevels;
  const canUpgrade = availableLevels.indexOf(currentLevel) < availableLevels.length - 1;
  const canDowngrade = availableLevels.indexOf(currentLevel) > 0;
  
  const upgrade = () => {
    const currentIndex = availableLevels.indexOf(currentLevel);
    if (currentIndex < availableLevels.length - 1) {
      setCurrentLevel(availableLevels[currentIndex + 1]);
    }
  };
  
  const downgrade = () => {
    const currentIndex = availableLevels.indexOf(currentLevel);
    if (currentIndex > 0) {
      setCurrentLevel(availableLevels[currentIndex - 1]);
    }
  };
  
  return {
    currentLevel,
    availableLevels,
    canUpgrade,
    canDowngrade,
    upgrade,
    downgrade,
    config: complexityLevels[currentLevel]
  };
};
