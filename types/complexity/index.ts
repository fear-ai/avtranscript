import { DisplayContext } from '../context';

export type ComplexityLevel = 'low' | 'mid' | 'high';
export type UserType = 'amateur' | 'professional' | 'agency';

export interface ComplexityConfig {
  level: ComplexityLevel;
  displayName: string;
  description: string;
  features: string[];
  maxItems?: number;
  showAdvanced?: boolean;
}

export interface UserTypeConfig {
  type: UserType;
  displayName: string;
  description: string;
  pricing: string;
  features: string[];
  complexityLevels: ComplexityLevel[];
  defaultLevel: ComplexityLevel;
}

export interface ComplexityContextValue {
  userLevel: ComplexityLevel;
  setUserLevel: (level: ComplexityLevel) => void;
  userType: UserType;
  setUserType: (type: UserType) => void;
  context: DisplayContext;
  availableLevels: ComplexityLevel[];
  canUpgrade: boolean;
  canDowngrade: boolean;
  upgrade: () => void;
  downgrade: () => void;
  config: ComplexityConfig;
  userTypeConfig: UserTypeConfig;
  // Smart level resolution for content with fewer levels
  getEffectiveLevel: (availableLevels: ComplexityLevel[]) => ComplexityLevel;
  // Check if content supports requested level
  isLevelSupported: (level: ComplexityLevel, availableLevels: ComplexityLevel[]) => boolean;
}
