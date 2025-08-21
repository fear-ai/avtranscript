import { useState, useEffect } from 'react';
import { DisplayContext, ContextDetectionResult } from '../../types/context';

export const useDisplayContext = (): ContextDetectionResult => {
  const [context, setContext] = useState<DisplayContext>('desktop');
  
  useEffect(() => {
    const detectContext = () => {
      const width = window.innerWidth;
      const userAgent = navigator.userAgent;
      
      if (width < 768) {
        setContext('mobile');
      } else if (width < 1024) {
        setContext('tablet');
      } else {
        setContext('desktop');
      }
      
      // Detect embedded context (iframe, etc.)
      if (window !== window.top) {
        setContext('embedded');
      }
      
      // Detect widget context (small viewport, specific URL patterns)
      if (width < 400 || window.location.pathname.includes('/widget')) {
        setContext('widget');
      }
    };
    
    detectContext();
    window.addEventListener('resize', detectContext);
    
    return () => window.removeEventListener('resize', detectContext);
  }, []);
  
  return {
    context,
    isMobile: context === 'mobile',
    isTablet: context === 'tablet',
    isDesktop: context === 'desktop',
    isEmbedded: context === 'embedded',
    isWidget: context === 'widget'
  };
};
