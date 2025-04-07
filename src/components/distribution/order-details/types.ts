export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  available: number;
  storage: StorageLocation;
  schools: {
    name: string;
    quantity: number;
  }[];
  substitutes?: SubstituteItem[];
}

export interface SubstituteItem {
  id: string;
  name: string;
  available: number;
  unit: string;
  conversionFactor: number;
}

export interface StorageLocation {
  category: string;
  location: string;
}