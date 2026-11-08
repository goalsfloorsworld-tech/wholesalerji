import { WallPanelProduct } from './schemas/product';
import { MaterialCategory } from './schemas/material';
import { PRIMO_FAQS } from '@/data/primoPanelsData';
import { ELITE_FAQS } from '@/data/elitePanelsData';
import { PRIMO_FLUTED_FAQS } from '@/data/primoFlutedPanelsData';
import { ELITE_FLUTED_FAQS } from '@/data/eliteFlutedPanelsData';


// Curated B2B mock dataset for instant rendering and SSG fallback
export const MOCK_MATERIALS: MaterialCategory[] = [
  {
    _id: 'mat-primo',
    name: 'Primo Panels',
    slug: 'primo',
    fullName: 'Primo Panels | 24 Colors Architectural Wall Cladding',
    seoTitle: 'Primo Wall Panels | Wholesale Architectural Panels | WholesalerJi',
    seoDescription: 'Explore the flagship Primo Panels collection. 24 production shades (GF-301 to GF-324) engineered for moisture-proof interior cladding at direct mill wholesale rates.',
    heroImage: '/images/dcezlxt8r/f_auto,q_auto/v1776780203/Primo_GF-301_Pvc_Panel_Goals_Floors.png',
    sortOrder: 1,
    faq: PRIMO_FAQS,
  },
  {
    _id: 'mat-elite',
    name: 'Elite Panels',
    slug: 'elite',
    fullName: 'Elite Panels | 12 UV High-Gloss Marble Wall Panels',
    seoTitle: 'Elite Wall Panels | Wholesale Architectural Panels | WholesalerJi',
    seoDescription: 'Explore Elite Panels. 12 UV high-gloss Italian Calacatta marble, black Portoro, and metallic wall panels in 12-inch wide seamless profiles at direct mill rates.',
    heroImage: '/images/dcezlxt8r/f_auto,q_auto/v1776777064/GF-401_Premium_Pvc_Panel_In_Gurgaon.png',
    sortOrder: 2,
    faq: ELITE_FAQS,
  },
  {
    _id: 'mat-primo-fluted',
    name: 'Primo Fluted Panels',
    slug: 'primo-fluted',
    fullName: 'Primo Fluted Panels | 13 Architectural Wood Finishes',
    seoTitle: 'Primo Fluted Wall Panels | Wholesale | WholesalerJi',
    seoDescription: 'Explore Primo Fluted Panels from the Classic Wood Series. 13 authentic wood louver finishes (FP-701 to FP-713) in 9MM WPC profile at ₹599 direct mill rates.',
    heroImage: '/images/dcezlxt8r/f_auto,q_auto/Fluted_Panel_FP_-_701.png',
    sortOrder: 3,
    faq: PRIMO_FLUTED_FAQS,
  },
  {
    _id: 'mat-elite-fluted',
    name: 'Elite Fluted Panels',
    slug: 'elite-fluted',
    fullName: 'Elite Fluted Panels | 9mm Premium Architectural WPC Panels',
    seoTitle: 'Elite Fluted Wall Panels | Wholesale | WholesalerJi',
    seoDescription: 'Discover Elite Fluted Panels. Featuring 9 MM thickness, 2950 x 300 MM dimensions, premium textured finish, and 100% waterproof WPC core for modern interior wall cladding.',
    heroImage: '/images/dcezlxt8r/f_auto,q_auto/Fluted_Panel_FP_-_714.png',
    sortOrder: 4,
    faq: ELITE_FLUTED_FAQS,
  },
];

export const MOCK_PRODUCTS: WallPanelProduct[] = [];

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
