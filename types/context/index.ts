import { ComplexityLevel } from '../complexity';

export type DisplayContext = 'mobile' | 'tablet' | 'desktop' | 'embedded' | 'widget';

export interface DisplayConfig {
  context: DisplayContext;
  availableLevels: ComplexityLevel[];
  defaultLevel: ComplexityLevel;
  fallbackLevel?: ComplexityLevel;
}

export interface ContextDetectionResult {
  context: DisplayContext;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isEmbedded: boolean;
  isWidget: boolean;
}
