import { DisplayContext } from '../context';

export type ComplexityLevel = 'low' | 'mid' | 'high';

export interface ComplexityConfig {
  level: ComplexityLevel;
  displayName: string;
  description: string;
  features: string[];
  maxItems?: number;
  showAdvanced?: boolean;
}

export interface ComplexityContextValue {
  userLevel: ComplexityLevel;
  setUserLevel: (level: ComplexityLevel) => void;
  context: DisplayContext;
  availableLevels: ComplexityLevel[];
  canUpgrade: boolean;
  canDowngrade: boolean;
  upgrade: () => void;
  downgrade: () => void;
  config: ComplexityConfig;
}
