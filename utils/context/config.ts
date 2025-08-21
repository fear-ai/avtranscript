import { DisplayConfig, DisplayContext } from '../../types/context';
import { ComplexityLevel } from '../../types/complexity';

export const displayConfigs: Record<DisplayContext, DisplayConfig> = {
  mobile: {
    context: 'mobile',
    availableLevels: ['low', 'mid'],
    defaultLevel: 'low',
    fallbackLevel: 'low'
  },
  tablet: {
    context: 'tablet',
    availableLevels: ['low', 'mid'],
    defaultLevel: 'mid',
    fallbackLevel: 'low'
  },
  desktop: {
    context: 'desktop',
    availableLevels: ['low', 'mid', 'high'],
    defaultLevel: 'mid',
    fallbackLevel: 'mid'
  },
  embedded: {
    context: 'embedded',
    availableLevels: ['low'],
    defaultLevel: 'low',
    fallbackLevel: 'low'
  },
  widget: {
    context: 'widget',
    availableLevels: ['low', 'mid'],
    defaultLevel: 'low',
    fallbackLevel: 'low'
  }
};
