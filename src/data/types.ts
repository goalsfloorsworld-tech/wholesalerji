export interface PanelProduct {
  id: string;
  code: string;
  name: string;
  collection: 'primo' | 'elite' | 'primo-fluted' | 'elite-fluted';
  series?: 'primo' | 'elite' | string;
  collectionLabel: string;
  category: 'Seamless Flat (12")' | 'Architectural Fluted (9mm)';
  finishType: 'Wood Grain' | 'Italian Marble' | 'Metallic' | 'Designer Floral' | 'Fabric Weave' | 'Fluted Louver';
  pricePerPiece: number;
  mrpPerPiece?: number;
  pricePerSqFt: number;
  boxPacking: number;
  boxCoverageSqFt: number;
  dimensions: string;
  lengthMm: number;
  widthMm: number;
  thicknessMm: number;
  weightKg: number;
  imageUrl: string;
  colorSwatch: string;
  colorName: string;
  badge: string;
  description: string;
  features: string[];
  isFeatured?: boolean;
  bestseller?: boolean;
}

export interface PanelCollectionMeta {
  id: string;
  name: string;
  tagline: string;
  priceStarting: string;
  thickness: string;
  width: string;
  description: string;
  heroImage: string;
  count: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  categoryLabel?: string;
  gurgaonContext?: string;
  keyHighlight?: string;
}
