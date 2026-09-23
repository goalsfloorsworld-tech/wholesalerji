import { WallPanelProduct } from './schemas/product';
import { MaterialCategory } from './schemas/material';

// Sample curated B2B mock dataset for instant rendering and SSG fallback
export const MOCK_MATERIALS: MaterialCategory[] = [
  {
    _id: 'mat-1',
    name: 'WPC Louvers',
    slug: 'wpc',
    fullName: 'Wood Polymer Composite Fluted Panels',
    seoTitle: 'WPC Wall Panels Wholesale | Buy Direct from Manufacturer',
    seoDescription: 'High-density exterior & interior WPC fluted wall panels at factory rates. 100% waterproof, Class B1 flame retardant. Fast pan-India dispatch.',
    heroImage: '/assets/panels/wpc_louver_texture.jpg',
    sortOrder: 1,
    faq: [
      {
        question: 'What is the standard price of WPC wall panels in wholesale?',
        answer: 'Wholesale pricing starts from ₹65/sq ft for bulk volume (500+ sq ft) up to ₹85/sq ft for small project quantities.',
      },
      {
        question: 'Are WPC panels suitable for exterior installation?',
        answer: 'Yes, our exterior grade WPC panels feature UV-stabilized coating and zero moisture absorption (<0.5%).',
      },
    ],
  },
  {
    _id: 'mat-2',
    name: 'PVC Marble Sheets',
    slug: 'pvc',
    fullName: 'High-Gloss UV Marble Cladding Sheets',
    seoTitle: 'PVC UV Marble Sheet 8x4 Wholesale | Calacatta & Onyx Rates',
    seoDescription: 'Premium 8x4 ft PVC UV marble wall sheets with high-gloss polished finish. Symmetrical bookmatch veining for commercial lobbies and interiors.',
    heroImage: '/assets/pvc_marble_sheet.jpg',
    sortOrder: 2,
    faq: [
      {
        question: 'What are the dimensions of PVC marble sheets?',
        answer: 'Standard sheet dimensions are 8 feet × 4 feet (2440mm × 1220mm) with 3mm to 4mm thickness options.',
      },
      {
        question: 'What is the minimum order quantity for PVC sheets?',
        answer: 'Standard wholesale MOQ is 20 sheets per order for direct mill dispatch.',
      },
    ],
  },
  {
    _id: 'mat-3',
    name: 'Charcoal Panels',
    slug: 'charcoal',
    fullName: 'High-Density Charcoal Acoustic Fluted Panels',
    seoTitle: 'Charcoal Fluted Wall Panels Wholesale | Luxury Commercial Cladding',
    seoDescription: 'Matte charcoal architectural louvers for executive offices, reception backdrops, and home theatres. Factory rates and bulk discounts.',
    heroImage: '/assets/charcoal_fluted_office_insitu.jpg',
    sortOrder: 3,
    faq: [
      {
        question: 'How are charcoal panels installed?',
        answer: 'Charcoal panels feature a tongue-and-groove interlock system, installed using high-tack construction adhesive and brad nails.',
      },
    ],
  },
];

export const MOCK_PRODUCTS: WallPanelProduct[] = [
  {
    _id: 'prod-1',
    name: 'Natural Oak WPC Fluted Louver Panel',
    slug: 'wpc-fluted-oak-001',
    sku: 'WPC-FLT-OAK-001',
    material: 'WPC Louvers',
    materialSlug: 'wpc',
    subcategory: 'Fluted Louvers',
    thickness: 12,
    width: 160,
    height: 2900,
    finish: 'Natural Matte Oak',
    colorFamily: 'Natural Wood',
    isWaterproof: true,
    isFireRetardant: true,
    isTermiteProof: true,
    isUVResistant: true,
    fireRating: 'Class B1',
    warrantyYears: 10,
    moq: 300,
    priceUnit: 'per sq ft',
    bulkPricing: [
      { minQuantity: 300, maxQuantity: 999, pricePerUnit: 85, label: 'Contractor Tier' },
      { minQuantity: 1000, maxQuantity: 4999, pricePerUnit: 72, label: 'Wholesale Tier' },
      { minQuantity: 5000, pricePerUnit: 62, label: 'Distributor Volume' },
    ],
    images: [
      { cloudinaryPublicId: '/assets/panels/wpc_louver_texture.jpg', alt: 'Oak WPC Fluted Louver Panel Texture', isPrimary: true },
      { cloudinaryPublicId: '/assets/panels/wpc_panel_wood_1787974740271.jpg', alt: 'Installed WPC Fluted Wall in Living Room', isPrimary: false },
    ],
    shortDescription: '12mm thickness extruded WPC acoustic fluted louvers. 100% waterproof and Class B1 flame retardant.',
    longDescription: 'Engineered for high-traffic architectural spaces. Features 60% wood fiber and 30% HDPE polymer matrix for ultimate durability against humidity and termites.',
    isFeatured: true,
    stockStatus: 'In Stock',
  },
  {
    _id: 'prod-2',
    name: 'Calacatta Gold UV PVC Marble Sheet',
    slug: 'pvc-marble-calacatta-002',
    sku: 'PVC-MRB-CAL-002',
    material: 'PVC Marble Sheets',
    materialSlug: 'pvc',
    subcategory: 'UV Marble Sheets',
    thickness: 3.5,
    width: 1220,
    height: 2440,
    finish: 'High Gloss UV Coated',
    colorFamily: 'Marble White & Gold',
    isWaterproof: true,
    isFireRetardant: true,
    isTermiteProof: true,
    isUVResistant: true,
    fireRating: 'Class B1',
    warrantyYears: 8,
    moq: 640,
    priceUnit: 'per sq ft',
    bulkPricing: [
      { minQuantity: 640, maxQuantity: 1599, pricePerUnit: 48, label: 'Project Tier (20-49 Sheets)' },
      { minQuantity: 1600, maxQuantity: 3199, pricePerUnit: 39, label: 'Wholesale (50-99 Sheets)' },
      { minQuantity: 3200, pricePerUnit: 32, label: 'Truckload (100+ Sheets)' },
    ],
    images: [
      { cloudinaryPublicId: '/assets/panels/pvc_marble_sheet.jpg', alt: 'Calacatta Gold UV PVC Marble Sheet', isPrimary: true },
      { cloudinaryPublicId: '/assets/panels/marble_surface_flat_1787974989087.jpg', alt: 'High Gloss Marble Sheet Texture Surface', isPrimary: false },
    ],
    shortDescription: '8x4 ft high-gloss PVC marble wall cladding sheets with bookmatched Calacatta gold veining.',
    longDescription: 'Ultra-lightweight replacement for natural Italian marble slabs. Zero maintenance, stain-resistant UV topcoat, and quick adhesive installation.',
    isFeatured: true,
    stockStatus: 'In Stock',
  },
  {
    _id: 'prod-3',
    name: 'Matte Charcoal Architectural Louver Panel',
    slug: 'charcoal-louver-matte-003',
    sku: 'CHR-LV-MAT-003',
    material: 'Charcoal Panels',
    materialSlug: 'charcoal',
    subcategory: 'Acoustic Louvers',
    thickness: 15,
    width: 120,
    height: 2900,
    finish: 'Matte Deep Charcoal',
    colorFamily: 'Black / Charcoal',
    isWaterproof: true,
    isFireRetardant: false,
    isTermiteProof: true,
    isUVResistant: false,
    fireRating: 'Class B2',
    warrantyYears: 7,
    moq: 250,
    priceUnit: 'per sq ft',
    bulkPricing: [
      { minQuantity: 250, maxQuantity: 999, pricePerUnit: 95, label: 'Contractor Tier' },
      { minQuantity: 1000, maxQuantity: 2999, pricePerUnit: 82, label: 'Wholesale Tier' },
      { minQuantity: 3000, pricePerUnit: 74, label: 'Commercial Bulk' },
    ],
    images: [
      { cloudinaryPublicId: '/assets/panels/charcoal_fluted_office_insitu.jpg', alt: 'Corporate Reception with Charcoal Fluted Wall', isPrimary: true },
    ],
    shortDescription: 'High-density polystyrene-charcoal composite louvers for executive offices and media rooms.',
    longDescription: 'Deep architectural vertical profile that absorbs reverberant sound while creating dramatic luxury shadows in commercial spaces.',
    isFeatured: true,
    stockStatus: 'In Stock',
  },
];

export async function getProducts(materialSlug?: string): Promise<WallPanelProduct[]> {
  if (!materialSlug || materialSlug === 'all') {
    return MOCK_PRODUCTS;
  }
  return MOCK_PRODUCTS.filter((p) => p.materialSlug === materialSlug);
}

export async function getProductBySlug(slug: string): Promise<WallPanelProduct | null> {
  const prod = MOCK_PRODUCTS.find((p) => p.slug === slug);
  return prod || null;
}

export async function getMaterials(): Promise<MaterialCategory[]> {
  return MOCK_MATERIALS;
}

export async function getMaterialBySlug(slug: string): Promise<MaterialCategory | null> {
  const mat = MOCK_MATERIALS.find((m) => m.slug === slug);
  return mat || null;
}
