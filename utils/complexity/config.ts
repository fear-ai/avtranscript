import { ComplexityConfig, ComplexityLevel } from '../../types/complexity';

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
