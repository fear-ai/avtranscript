import { DisplayContext } from '../context';
import { ComplexityLevel } from '../complexity';

export interface Vendor {
  id: string;
  name: string;
  description: string;
  price: number;
  accuracy: number;
  turnaroundTime: string;
  category: string;
  features: string[];
  apiAccess: boolean;
  workflowIntegration: boolean;
  volumePrice?: number;
  logo?: string;
}

export interface VendorCardProps {
  vendor: Vendor;
  context?: DisplayContext;
  userPreference?: ComplexityLevel;
  showComplexityControls?: boolean;
}
