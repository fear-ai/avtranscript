import { ComplexityConfig, ComplexityLevel, UserTypeConfig, UserType } from '../../types/complexity';

export const complexityLevels: Record<ComplexityLevel, ComplexityConfig> = {
  low: {
    level: 'low',
    displayName: 'Basic',
    description: 'Essential information and simple interactions',
    features: ['core_details', 'basic_pricing', 'simple_actions'],
    maxItems: 3,
    showAdvanced: false
  },
  mid: {
    level: 'mid',
    displayName: 'Standard',
    description: 'Comprehensive information with moderate complexity',
    features: ['detailed_features', 'comparison_tools', 'advanced_filtering'],
    maxItems: 6,
    showAdvanced: true
  },
  high: {
    level: 'high',
    displayName: 'Advanced',
    description: 'Full feature set with complex interactions',
    features: ['enterprise_features', 'api_integration', 'workflow_tools'],
    maxItems: 10,
    showAdvanced: true
  }
};

export const userTypeConfigs: Record<UserType, UserTypeConfig> = {
  amateur: {
    type: 'amateur',
    displayName: 'Amateur Creator',
    description: 'Simple solutions for beginners and hobbyists',
    pricing: 'Free to $20/month',
    features: ['basic_features', 'simple_interface', 'affordable_pricing'],
    complexityLevels: ['low', 'mid'], // Amateurs don't need high complexity
    defaultLevel: 'low'
  },
  professional: {
    type: 'professional',
    displayName: 'Professional Creator',
    description: 'Advanced features for business and professional use',
    pricing: 'Professional pricing',
    features: ['advanced_features', 'integration_ready', 'workflow_automation'],
    complexityLevels: ['low', 'mid', 'high'], // Full range for professionals
    defaultLevel: 'mid'
  },
  agency: {
    type: 'agency',
    displayName: 'Agency & Business',
    description: 'Enterprise solutions for teams and organizations',
    pricing: 'Enterprise pricing',
    features: ['enterprise_features', 'white_label', 'volume_pricing'],
    complexityLevels: ['mid', 'high'], // Agencies don't need low complexity
    defaultLevel: 'high'
  }
};

// Helper function to get the highest available level <= requested level
export function getEffectiveLevel(requestedLevel: ComplexityLevel, availableLevels: ComplexityLevel[]): ComplexityLevel {
  const levelOrder: ComplexityLevel[] = ['low', 'mid', 'high'];
  const requestedIndex = levelOrder.indexOf(requestedLevel);
  
  // Find the highest available level that's <= requested level
  for (let i = requestedIndex; i >= 0; i--) {
    if (availableLevels.includes(levelOrder[i])) {
      return levelOrder[i];
    }
  }
  
  // Fallback to lowest available level
  return availableLevels[0] || 'low';
}

// Helper function to check if a level is supported
export function isLevelSupported(level: ComplexityLevel, availableLevels: ComplexityLevel[]): boolean {
  return availableLevels.includes(level);
}
