import { toBrandedImageUrl } from '@/lib/imageUtils';

export interface BaseArtificialGrassProduct {
  code: string;
  name: string;
  pileHeight: string;
  stitches: string;
  density: string;
  dtex: number;
  backing: string;
  areaPerRoll: string;
  price: number;
  mrp?: number;
  unit: 'sq.ft';
  image: string;
  altText: string;
  rollDimensions?: string;
  // Installed room/lawn landscape image (can be updated with user URLs anytime)
  installedImage?: string;
  installedImageAlt?: string;
  gauge?: string;
  uvWarranty?: string;
  yarnMaterial?: string;
}

export interface NormalGrassProduct extends BaseArtificialGrassProduct {
  category: 'normal';
  use: string;
  recommendedSpaces: string[];
  trafficRating: 'Light to Moderate' | 'Moderate to High' | 'High Traffic' | 'Heavy Duty Commercial';
  highlight: string;
  description: string;
}

export interface DesignerGrassProduct extends BaseArtificialGrassProduct {
  category: 'designer';
  pattern: string;
  motifType: string;
  recommendedSpaces: string[];
  designConcept: string;
  description: string;
}

export type ArtificialGrassProduct = NormalGrassProduct | DesignerGrassProduct;

const CLOUD_ACCOUNT = 'dcezlxt8r';

// Helper to construct branded proxy URL
function makeGrassImageUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return toBrandedImageUrl(`/images/${CLOUD_ACCOUNT}/f_auto,q_auto/${cleanPath}`);
}

export const ARTIFICIAL_GRASS_NORMAL: NormalGrassProduct[] = [
  {
    code: 'GF-N25',
    name: 'Premium Grass 25mm',
    category: 'normal',
    pileHeight: '25mm',
    stitches: '14/10 Cm',
    density: '14650/M2',
    dtex: 9000,
    backing: 'Double Backing',
    areaPerRoll: '539 sq.ft',
    rollDimensions: '2m × 25m (6.56ft × 82ft)',
    price: 45,
    mrp: 70,
    unit: 'sq.ft',
    use: 'Apartment balconies and budget-friendly landscaping',
    trafficRating: 'Light to Moderate',
    gauge: '3/8 inch',
    uvWarranty: '5 Years UV Stabilization',
    yarnMaterial: 'Virgin Monofilament PE + Curled PP Thatch',
    highlight: 'Best-selling value turf for high-rise apartment balconies in Gurgaon and compact residential corridors.',
    description: 'Engineered specifically for Gurgaon apartment balconies, utility terraces, and cost-conscious landscaping projects. The 25mm pile height offers a crisp, manicured lawn texture that sweeps and washes clean in minutes with zero water accumulation.',
    image: makeGrassImageUrl('v1787308037/25mm_Artificial_Grass.png'),
    altText: 'GF-N25 25mm artificial grass roll texture close-up showing dual-tone green fibers and double backing',
    recommendedSpaces: ['High-rise Balconies', 'Apartment Sit-outs', 'Window Ledges', 'Rental Renovations', 'Indoor Courtyards'],
    installedImage: toBrandedImageUrl('https://res.cloudinary.com/dcezlxt8r/image/upload/v1772476444/artificial_grass_supplier_in_india.jpg'),
    installedImageAlt: 'GF-N25 25mm artificial turf installed in modern residential balcony setting',
  },
  {
    code: 'GF-N35',
    name: 'Premium Grass 35mm',
    category: 'normal',
    pileHeight: '35mm',
    stitches: '16/10 Cm',
    density: '16900/M2',
    dtex: 10500,
    backing: 'Double Backing',
    areaPerRoll: '539 sq.ft',
    rollDimensions: '2m × 25m (6.56ft × 82ft)',
    price: 65,
    mrp: 95,
    unit: 'sq.ft',
    use: 'Residential terrace gardens, rooftop cafes, moderate-traffic decor',
    trafficRating: 'Moderate to High',
    gauge: '3/8 inch',
    uvWarranty: '7 Years UV Stabilization',
    yarnMaterial: 'Virgin Monofilament PE + Curled PP Thatch',
    highlight: 'The architect-preferred balance of lush underfoot cushion, authentic four-tone green depth, and upright spring-back resilience.',
    description: 'Our most popular specification across Delhi NCR rooftop gardens and residential terraces. Calibrated with a dense 16,900 tuft count and reinforced 10,500 Dtex fibers that resist matting under patio furniture and steady foot traffic.',
    image: makeGrassImageUrl('v1787308036/35mm_Artificial_Grass.png'),
    altText: 'GF-N35 35mm high density artificial grass pile close-up texture shot with multi-tone thatch fibers',
    recommendedSpaces: ['Rooftop Terrace Gardens', 'Boutique Cafes', 'Villa Front Lawns', 'Pool Decks', 'Covered Patios'],
    installedImage: toBrandedImageUrl('https://res.cloudinary.com/dcezlxt8r/image/upload/v1772476421/artificial_grass_supplier_in_delhi.jpg'),
    installedImageAlt: 'GF-N35 35mm landscape grass installed in rooftop terrace garden setting',
  },
  {
    code: 'GF-N40',
    name: 'Premium Grass 40mm',
    category: 'normal',
    pileHeight: '40mm',
    stitches: '16/10 Cm',
    density: '16900/M2',
    dtex: 10500,
    backing: 'Double Backing',
    areaPerRoll: '539 sq.ft',
    rollDimensions: '2m × 25m (6.56ft × 82ft)',
    price: 75,
    mrp: 115,
    unit: 'sq.ft',
    use: 'Luxury villas, commercial landscapes, high-end recreational areas',
    trafficRating: 'High Traffic',
    gauge: '3/8 inch',
    uvWarranty: '8 Years UV Stabilization',
    yarnMaterial: 'C-Shape Spine Virgin PE + Dense Root Thatch',
    highlight: 'Plush botanical density designed for luxury farmhouses, golf simulator perimeters, and premium commercial hospitality zones.',
    description: 'A 40mm deep-pile landscape turf mimicking lush natural Bermuda grass with curled micro-thatch root simulation. Built with enhanced UV inhibitors to withstand severe North Indian summer surface temperatures exceeding 45°C without fiber discoloration or brittleness.',
    image: makeGrassImageUrl('v1787308037/40mm_Artificial_Grass.png'),
    altText: 'GF-N40 40mm luxury artificial grass dense pile close-up macro texture showing micro-spine blades',
    recommendedSpaces: ['Luxury Farmhouses', 'Corporate Campuses', 'Hotel Courtyards', 'Golf Putting Borders', 'Recreational Lounges'],
    installedImage: toBrandedImageUrl('https://res.cloudinary.com/dcezlxt8r/image/upload/v1772476497/artificial_grass_wholesaler_in_delhi.jpg'),
    installedImageAlt: 'GF-N40 40mm luxury turf installed in outdoor villa lawn landscape',
  },
  {
    code: 'GF-N50',
    name: 'Premium Grass 50mm',
    category: 'normal',
    pileHeight: '50mm',
    stitches: '24/10 Cm',
    density: '24900/M2',
    dtex: 12000,
    backing: 'Double Backing',
    areaPerRoll: '539 sq.ft',
    rollDimensions: '2m × 25m (6.56ft × 82ft)',
    price: 110,
    mrp: 160,
    unit: 'sq.ft',
    use: 'Heavy-traffic zones, pet play areas, resorts, professional landscaping',
    trafficRating: 'Heavy Duty Commercial',
    gauge: '3/8 inch',
    uvWarranty: '10 Years Heavy Commercial UV',
    yarnMaterial: 'Max-Resilience W-Fiber 12000 Dtex Monofilament',
    highlight: 'Our ultimate heavy-duty flagship specification: 24,900 density tufts per square meter with 50mm ultra-plush pile height.',
    description: 'The heavyweight benchmark in synthetic turf engineering. Packed with an astonishing 24,900 stitches/m² and 12,000 Dtex structural yarn, this 50mm turf delivers maximum shock absorption for pet agility zones, resort event lawns, and rigorous commercial installations.',
    image: makeGrassImageUrl('v1787308036/50mm_Artificial_Grass_Goals_FLoors.png'),
    altText: 'GF-N50 50mm ultra high density 24900 tufts heavy duty commercial artificial grass close-up texture shot',
    recommendedSpaces: ['Pet Play Resorts', 'School Playgrounds', 'Luxury Resort Lawns', 'Event Lawns', 'Sports Training Turfs'],
    installedImage: toBrandedImageUrl('https://res.cloudinary.com/dcezlxt8r/image/upload/v1772476418/premium_Artificial_grass_installed_photo.jpg'),
    installedImageAlt: 'GF-N50 50mm commercial turf installed in high-end resort landscape',
  },
];

export const ARTIFICIAL_GRASS_DESIGNER: DesignerGrassProduct[] = [
  {
    code: 'GF-D-LEAF',
    name: 'Leaf Green Designer Grass',
    category: 'designer',
    pattern: 'Leaf Green',
    motifType: 'Organic Foliage Weave',
    pileHeight: '35mm',
    stitches: '16/10 Cm',
    density: '16900/M2',
    dtex: 10500,
    backing: 'Double Backing',
    areaPerRoll: '539 sq.ft',
    rollDimensions: '2m × 25m (6.56ft × 82ft)',
    price: 95,
    mrp: 145,
    unit: 'sq.ft',
    gauge: '3/8 inch',
    uvWarranty: '7 Years UV Stabilization',
    yarnMaterial: 'Engineered Multi-Tone Embossed PE Fibers',
    designConcept: 'Curved botanical leaf contours sculpted directly into the turf weave for high-end biophilic feature walls and luxury garden courtyards.',
    description: 'Transforms ordinary flooring into an architectural botanical statement. The Leaf Green motif introduces subtle alternating yarn heights and tone contrasts that evoke lush tropical foliage under changing sunlight angles.',
    image: makeGrassImageUrl('v1787310307/Green_Leaf_Upper_Shot.jpg'),
    altText: 'GF-D-LEAF Leaf Green designer artificial grass close-up top-down shot showing organic leaf patterns in tufted pile',
    recommendedSpaces: ['Architectural Feature Walls', 'Luxury Penthouse Terraces', 'Boutique Showroom Displays', 'Vertical Green Facades'],
    installedImage: toBrandedImageUrl('https://res.cloudinary.com/def2qsxjg/image/upload/v1792437351/leaf_grass_at_swiming_pool.jpg'),
    installedImageAlt: 'GF-D-LEAF Leaf Green designer grass installed at swimming pool feature deck',
  },
  {
    code: 'GF-D-WAVE',
    name: 'Wave Pattern Designer Grass',
    category: 'designer',
    pattern: 'Wave Pattern',
    motifType: 'Fluid Architectural Ripples',
    pileHeight: '35mm',
    stitches: '16/10 Cm',
    density: '16900/M2',
    dtex: 10500,
    backing: 'Double Backing',
    areaPerRoll: '539 sq.ft',
    rollDimensions: '2m × 25m (6.56ft × 82ft)',
    price: 95,
    mrp: 145,
    unit: 'sq.ft',
    gauge: '3/8 inch',
    uvWarranty: '7 Years UV Stabilization',
    yarnMaterial: 'Engineered Multi-Tone Embossed PE Fibers',
    designConcept: 'Continuous rhythmic wave lines that elongate compact terraces and pool corridors with directional visual motion.',
    description: 'Designed for contemporary urban architecture where traditional uniform grass feels static. The Wave Pattern creates an optical rhythm that guides the eye along balcony walkways and pool surrounds, masking panel seams seamlessly.',
    image: makeGrassImageUrl('v1787310353/wave_patter_upper_shot.jpg'),
    altText: 'GF-D-WAVE Wave Pattern designer artificial grass top-down texture shot showing fluid rhythmic ripple lines',
    recommendedSpaces: ['Poolside Decks', 'Long Terrace Walkways', 'Hotel Terrace Lounges', 'Rooftop Bar Flooring'],
    installedImage: toBrandedImageUrl('https://res.cloudinary.com/def2qsxjg/image/upload/v1792437621/wave_grass_at_garden_in_gurgaon.jpg'),
    installedImageAlt: 'GF-D-WAVE Wave Pattern designer grass installed at garden in Gurgaon',
  },
  {
    code: 'GF-D-HEXA',
    name: 'Hexa Green Designer Grass',
    category: 'designer',
    pattern: 'Hexa Green',
    motifType: 'Geometric Honeycomb Tessellation',
    pileHeight: '35mm',
    stitches: '16/10 Cm',
    density: '16900/M2',
    dtex: 10500,
    backing: 'Double Backing',
    areaPerRoll: '539 sq.ft',
    rollDimensions: '2m × 25m (6.56ft × 82ft)',
    price: 95,
    mrp: 145,
    unit: 'sq.ft',
    gauge: '3/8 inch',
    uvWarranty: '7 Years UV Stabilization',
    yarnMaterial: 'Engineered Multi-Tone Embossed PE Fibers',
    designConcept: 'Structured hexagonal geometric cells delivering modern parametric aesthetics for high-end corporate breakout zones and luxury residential verandas.',
    description: 'The Hexa Green motif brings geometric precision to synthetic landscaping. Precise hexagonal stitch formations catch light directionally, providing a designer carpet feel with all the all-weather durability and drainage of outdoor turf.',
    image: makeGrassImageUrl('v1787310302/hexa_green_upper_shot.jpg'),
    altText: 'GF-D-HEXA Hexa Green designer artificial grass close-up top-down view showing geometric hexagonal tuft cells',
    recommendedSpaces: ['Corporate Cafeterias', 'Executive Terraces', 'Luxury Balcony Balustrades', 'Modern Villa Verandas'],
    installedImage: toBrandedImageUrl('https://res.cloudinary.com/def2qsxjg/image/upload/v1792437423/hexa_grass_at_balcony.jpg'),
    installedImageAlt: 'GF-D-HEXA Hexa Green designer turf installed at balcony setting',
  },
  {
    code: 'GF-D-ZENTRA',
    name: 'Zentra Designer Grass',
    category: 'designer',
    pattern: 'Zentra',
    motifType: 'Contemporary Minimalist Geometry',
    pileHeight: '35mm',
    stitches: '16/10 Cm',
    density: '16900/M2',
    dtex: 10500,
    backing: 'Double Backing',
    areaPerRoll: '539 sq.ft',
    rollDimensions: '2m × 25m (6.56ft × 82ft)',
    price: 95,
    mrp: 145,
    unit: 'sq.ft',
    gauge: '3/8 inch',
    uvWarranty: '7 Years UV Stabilization',
    yarnMaterial: 'Engineered Multi-Tone Embossed PE Fibers',
    designConcept: 'Zen-garden inspired linear and textural variations that instill tranquility and visual order into residential terraces and rooftop sanctuaries.',
    description: 'Crafted for minimalist interior designers and landscape architects seeking understated luxury. The Zentra pattern blends fine-stitched fiber orientations to emulate raked Zen stone formations rendered in rich emerald greenery.',
    image: makeGrassImageUrl('v1787310377/zentra_design_upper_shot.jpg'),
    altText: 'GF-D-ZENTRA Zentra designer artificial grass macro top-down texture shot with contemporary minimalist line formations',
    recommendedSpaces: ['Zen Gardens & Meditation Decks', 'Villa Balconies', 'Fine Dining Rooftops', 'Architectural Accent Walls'],
    installedImage: toBrandedImageUrl('https://res.cloudinary.com/def2qsxjg/image/upload/v1792437521/zentra_grass_at_garden.png'),
    installedImageAlt: 'GF-D-ZENTRA Zentra designer grass installed at garden terrace',
  },
];

export const ALL_ARTIFICIAL_GRASS: ArtificialGrassProduct[] = [
  ...ARTIFICIAL_GRASS_NORMAL,
  ...ARTIFICIAL_GRASS_DESIGNER,
];

export interface GrassFAQ {
  id: string;
  question: string;
  answer: string;
  category: 'Pricing & Supply' | 'Climate & Durability' | 'Installation & Maintenance';
}

export const ARTIFICIAL_GRASS_FAQS: GrassFAQ[] = [
  {
    id: 'faq-1',
    category: 'Pricing & Supply',
    question: 'What is the wholesale price of artificial grass per sq.ft in Gurgaon & Delhi NCR?',
    answer: 'At WholesalerJi, wholesale factory-direct artificial grass starts at ₹45 per sq.ft for standard 25mm balcony grass (GF-N25), ₹65 per sq.ft for premium 35mm landscape grass (GF-N35), ₹75 per sq.ft for 40mm luxury grass (GF-N40), and ₹110 per sq.ft for 50mm heavy commercial turf (GF-N50). Designer pattern grass (Hexa, Leaf, Wave, Zentra) is available at wholesale ₹95 per sq.ft. Full master roll purchases (539 sq.ft per roll: 2m × 25m) and bulk contractor orders qualify for additional volume tier discounts.',
  },
  {
    id: 'faq-2',
    category: 'Climate & Durability',
    question: 'Which pile height should I choose for an apartment balcony versus a rooftop terrace garden?',
    answer: 'For standard high-rise apartment balconies in Gurgaon (DLF Phase 1-5, Sohna Road, Dwarka Expressway), 25mm (GF-N25) or 35mm (GF-N35) is the ideal specification. They provide comfortable foot cushion while remaining low-profile enough for simple broom sweeping and water hose cleaning. For rooftop terraces, open farmhouses, and outdoor cafes exposed to heavy sunlight and patio furniture, 35mm or 40mm (GF-N40) is strongly recommended for superior spring-back fiber memory and thermal comfort.',
  },
  {
    id: 'faq-3',
    category: 'Climate & Durability',
    question: 'How does WholesalerJi artificial grass withstand Gurgaon’s intense 45°C+ summer heat and UV rays?',
    answer: 'Our synthetic turf fibers are extruded with industrial-grade UV50+ stabilizers directly melted into the virgin polyethylene resin, rather than a superficial top-spray. This prevents polymer degradation, fiber brittleness, and fading even during peak North Indian heatwaves exceeding 48°C. While turf will absorb ambient heat under direct midday sun like any outdoor surface, a quick 30-second misting with water drops surface temperatures by 15°C immediately.',
  },
  {
    id: 'faq-4',
    category: 'Climate & Durability',
    question: 'Will artificial grass cause waterlogging or pool water on my terrace during Delhi NCR monsoon rains?',
    answer: 'No. WholesalerJi artificial grass features a pre-punched SBR latex backing with calibrated drainage eyelets spaced every 10–12 cm throughout the roll. It boasts a high drainage capacity exceeding 60 liters per minute per square meter, which exceeds the heaviest recorded Delhi NCR cloudburst rainfall. As long as your underlying floor slab has an adequate slope toward rainwater outlets, water drains straight through the turf backing without puddling.',
  },
  {
    id: 'faq-5',
    category: 'Installation & Maintenance',
    question: 'Is artificial grass safe for dogs and pets? How do you clean pet urine and solid waste?',
    answer: 'Yes, 100%. Our grass is manufactured from non-toxic, lead-free, and hypoallergenic virgin polymers certified safe for pets and young children. For solid waste, allow it to dry slightly and scoop it as you would on natural grass. For liquid pet urine, the permeable backing lets it flow straight to the floor drain below. Periodically rinse the area with a water hose and mild diluted disinfectant or vinegar solution to neutralize organic odors.',
  },
  {
    id: 'faq-6',
    category: 'Pricing & Supply',
    question: 'What is the standard roll size, MOQ, and warehouse dispatch timeline in Gurgaon?',
    answer: 'All our landscape and designer artificial grass variants come in standard mill rolls measuring 2 meters width by 25 meters length (50 square meters or approximately 539 sq.ft per master roll). Our Minimum Order Quantity (MOQ) for wholesale roll rates is 1 master roll (539 sq.ft). Cut-length rolls for compact residential balconies are also supported for verified contractors and homeowners. Orders are dispatched same-day or next-day directly from our central warehouse depot in Sector 34, Gurugram.',
  },
  {
    id: 'faq-7',
    category: 'Installation & Maintenance',
    question: 'Can artificial grass be installed vertically on walls or directly over existing floor tiles?',
    answer: 'Yes. Artificial grass can be installed directly over existing ceramic floor tiles, vitrified slabs, or cured concrete without tearing up the old surface. For vertical accent walls, balcony balustrades, or corporate logo backdrops, the backing is fastened to the wall using synthetic turf adhesive, silicon adhesive, or stainless steel mechanical screws with rubber washers anchored into wall plugs.',
  },
  {
    id: 'faq-8',
    category: 'Climate & Durability',
    question: 'What is the expected lifespan of WholesalerJi artificial turf in Indian conditions?',
    answer: 'Depending on the pile height and traffic intensity, our artificial turf delivers an operational lifespan of 7 to 10+ years under Indian climatic conditions. The double-woven polypropylene backing resists rot, insect infestation, and subterranean termites completely, making it an enduring one-time investment compared to real grass which demands recurring gardener payroll, chemical fertilizers, and expensive water bills.',
  },
];
