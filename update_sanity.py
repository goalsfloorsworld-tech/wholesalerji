import os

file_path = r"c:\Users\MD NEYAZ\Videos\My Sites\goalsfloors-universe\wholesalerji\src\sanity\client.ts"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

imports_to_add = """
import { PRIMO_FAQS } from '@/data/primoPanelsData';
import { ELITE_FAQS } from '@/data/elitePanelsData';
import { PRIMO_FLUTED_FAQS } from '@/data/primoFlutedPanelsData';
import { ELITE_FLUTED_FAQS } from '@/data/eliteFlutedPanelsData';
"""

materials_to_add = """  {
    _id: 'mat-primo',
    name: 'Primo Panels',
    slug: 'primo',
    fullName: 'Primo Panels | 24 Colors Architectural Wall Cladding',
    seoTitle: 'Primo Wall Panels | Wholesale Architectural Panels | WholesalerJi',
    seoDescription: 'Explore the flagship Primo Panels collection. 24 production shades (GF-301 to GF-324) engineered for moisture-proof interior cladding at direct mill wholesale rates.',
    heroImage: 'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776780203/Primo_GF-301_Pvc_Panel_Goals_Floors.png',
    sortOrder: 4,
    faq: PRIMO_FAQS,
  },
  {
    _id: 'mat-elite',
    name: 'Elite Panels',
    slug: 'elite',
    fullName: 'Elite Panels | 12 UV High-Gloss Marble Wall Panels',
    seoTitle: 'Elite Wall Panels | Wholesale Architectural Panels | WholesalerJi',
    seoDescription: 'Explore Elite Panels. 12 UV high-gloss Italian Calacatta marble, black Portoro, and metallic wall panels in 12-inch wide seamless profiles at direct mill rates.',
    heroImage: 'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776777064/GF-401_Premium_Pvc_Panel_In_Gurgaon.png',
    sortOrder: 5,
    faq: ELITE_FAQS,
  },
  {
    _id: 'mat-primo-fluted',
    name: 'Primo Fluted Panels',
    slug: 'primo-fluted',
    fullName: 'Primo Fluted Panels | 13 Architectural Wood Finishes',
    seoTitle: 'Primo Fluted Wall Panels | Wholesale | WholesalerJi',
    seoDescription: 'Explore Primo Fluted Panels from the Classic Wood Series. 13 authentic wood louver finishes (FP-701 to FP-713) in 9MM WPC profile at ₹599 direct mill rates.',
    heroImage: 'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_701.png',
    sortOrder: 6,
    faq: PRIMO_FLUTED_FAQS,
  },
  {
    _id: 'mat-elite-fluted',
    name: 'Elite Fluted Panels',
    slug: 'elite-fluted',
    fullName: 'Elite Fluted Panels | 9mm Premium Architectural WPC Panels',
    seoTitle: 'Elite Fluted Wall Panels | Wholesale | WholesalerJi',
    seoDescription: 'Discover Elite Fluted Panels by Goals Floors. Featuring 9 MM thickness, 2950 x 300 MM dimensions, premium textured finish, and 100% waterproof WPC core for modern interior wall cladding.',
    heroImage: 'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_714.png',
    sortOrder: 7,
    faq: ELITE_FLUTED_FAQS,
  },
];"""

content = content.replace("import { MaterialCategory } from './schemas/material';", "import { MaterialCategory } from './schemas/material';" + imports_to_add)
content = content.replace("  },\n];\n\nexport const MOCK_PRODUCTS", "  },\n" + materials_to_add + "\n\nexport const MOCK_PRODUCTS")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated sanity client")
