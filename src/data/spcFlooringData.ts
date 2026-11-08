import { GenericShowcaseProduct } from '@/components/artificial-grass/GrassShowcase';

export interface SpcSpecFactor {
  title: string;
  shortTitle: string;
  specValue: string;
  guidance: string;
  architecturalContext: string;
}

export interface FlooringComparisonRow {
  parameter: string;
  spc: string;
  laminate: string;
  vitrifiedTiles: string;
  engineeredWood: string;
  highlightNote: string;
}

export interface ApplicationSpace {
  title: string;
  metric: string;
  description: string;
  icon: string;
}

export const SPC_META = {
  categoryName: 'Stone Plastic Composite (SPC) Flooring',
  shortName: 'SPC Flooring',
  tagline: 'Rigid Limestone Core • 100% Waterproof • Floating Click-Lock Installation',
  depotLocation: 'Sector 34, Gurugram, Haryana',
  leadTimes: 'Daily dispatch with 2–4 days express transport delivery across all Indian states',
  contactPhone: '+919217400163',
  whatsappDirect:
    'https://wa.me/919217400163?text=Hi%20WholesalerJi%2C%20I%20am%20inquiring%20about%20SPC%20Flooring%20wholesale%20rates%20and%20catalogues%20for%20my%20project.',
  salesEmail: 'sales@wholesalerji.com',
};

// 15 Curated Architectural SPC Planks with authentic specs & high-res closeups/installed renders
export const SPC_DESIGNS: GenericShowcaseProduct[] = [
  // --- SERIES 1: 1220mm x 153mm Handscrapped with Cushion (₹180 / sq.ft, MRP ₹390, 54% OFF) ---
  {
    code: 'WJ-SPC-295',
    name: 'G-F SPC 295 (Natural Warm Oak)',
    price: 180,
    mrp: 390,
    description:
      'Warm natural honey-amber tones with authentic cathedral woodgrain lines. Built with a 6mm total build including an integrated acoustic cushion and heavy-duty 0.5mm commercial wear layer.',
    image: '/images/dcezlxt8r/f_auto,q_auto/v1775452465/G-F_SPC_295.jpg',
    installedImage:
      '/images/def2qsxjg/f_auto,q_auto/v1792831101/spc-flooring-295-natural-warm-oak-installed-wholesalerji-gurgaon.jpg',
    altText: 'G-F SPC 295 natural warm oak close-up woodgrain texture swatch',
    installedImageAlt:
      'Natural warm oak SPC rigid core plank flooring with authentic woodgrain installed in modern apartment living room',
    badge: '6mm with Cushion',
    specs: [
      { label: 'Plank Size', value: '1220mm × 153mm (48" × 6")' },
      { label: 'Thickness', value: '6mm with Cushion' },
      { label: 'Wear Layer', value: '0.5mm (Commercial Grade)' },
      { label: 'Surface Texture', value: 'Handscrapped Woodgrain' },
      { label: 'Edge Finish', value: 'Painted Bevel Edge' },
      { label: 'Installation', value: 'Uniclick System' },
      { label: 'Packing', value: '10 Planks - 20 SQF / Box' },
      { label: 'Warranty', value: '10Y Res / 5Y Comm' },
    ],
  },
  {
    code: 'WJ-SPC-296',
    name: 'G-F SPC 296 (Chestnut Mocha Oak)',
    price: 180,
    mrp: 390,
    description:
      'Deep rich chestnut-mocha oak tones with authentic heartwood knots and warm undertones. Built with a 6mm build including integrated acoustic cushion and 0.5mm commercial wear layer.',
    image: '/images/dcezlxt8r/f_auto,q_auto/v1779019189/G-F_SPC_296.jpg',
    installedImage:
      '/images/def2qsxjg/f_auto,q_auto/v1792831034/spc-flooring-296-chestnut-mocha-oak-installed-wholesalerji-gurgaon.jpg',
    altText: 'G-F SPC 296 chestnut mocha oak close-up woodgrain texture swatch',
    installedImageAlt:
      'Chestnut mocha oak rigid core SPC plank flooring installed in warm minimalist bedroom',
    badge: '6mm with Cushion',
    specs: [
      { label: 'Plank Size', value: '1220mm × 153mm (48" × 6")' },
      { label: 'Thickness', value: '6mm with Cushion' },
      { label: 'Wear Layer', value: '0.5mm (Commercial Grade)' },
      { label: 'Surface Texture', value: 'Handscrapped Woodgrain' },
      { label: 'Edge Finish', value: 'Painted Bevel Edge' },
      { label: 'Installation', value: 'Uniclick System' },
      { label: 'Packing', value: '10 Planks - 20 SQF / Box' },
      { label: 'Warranty', value: '10Y Res / 5Y Comm' },
    ],
  },
  {
    code: 'WJ-SPC-297',
    name: 'G-F SPC 297 (Rustic Weathered Taupe Oak)',
    price: 180,
    mrp: 390,
    description:
      'Distressed weathered taupe-brown oak featuring horizontal saw-mark accents and authentic rustic fissures. Perfectly complements earthy interiors, industrial loft spaces, and contemporary rustic decor.',
    image: '/images/dcezlxt8r/f_auto,q_auto/v1775452460/G-F_SPC_297.jpg',
    installedImage:
      '/images/def2qsxjg/f_auto,q_auto/v1792831037/spc-flooring-297-rustic-weathered-taupe-oak-installed-wholesalerji-gurgaon.jpg',
    altText: 'G-F SPC 297 rustic weathered taupe oak close-up woodgrain texture swatch',
    installedImageAlt:
      'Distressed weathered taupe oak SPC flooring with horizontal saw-mark texture installed in home office study',
    badge: '6mm with Cushion',
    specs: [
      { label: 'Plank Size', value: '1220mm × 153mm (48" × 6")' },
      { label: 'Thickness', value: '6mm with Cushion' },
      { label: 'Wear Layer', value: '0.5mm (Commercial Grade)' },
      { label: 'Surface Texture', value: 'Handscrapped Woodgrain' },
      { label: 'Edge Finish', value: 'Painted Bevel Edge' },
      { label: 'Installation', value: 'Uniclick System' },
      { label: 'Packing', value: '10 Planks - 20 SQF / Box' },
      { label: 'Warranty', value: '10Y Res / 5Y Comm' },
    ],
  },
  {
    code: 'WJ-SPC-298',
    name: 'G-F SPC 298 (Rustic Brown Oak)',
    price: 180,
    mrp: 390,
    description:
      'Deep rustic brown oak with rich heartwood knots and mineral grain swirls. Provides grounding warmth for luxury bedrooms and executive lounges with zero moisture sensitivity.',
    image: '/images/dcezlxt8r/f_auto,q_auto/v1775452460/G-F_SPC_298.jpg',
    installedImage:
      '/images/def2qsxjg/f_auto,q_auto/v1792831093/spc-flooring-298-rustic-brown-oak-installed-wholesalerji-gurgaon.jpg',
    altText: 'G-F SPC 298 rustic brown oak close-up woodgrain texture swatch',
    installedImageAlt:
      'Rustic brown oak rigid core composite flooring with natural knots installed in cozy master bedroom',
    badge: '6mm with Cushion',
    specs: [
      { label: 'Plank Size', value: '1220mm × 153mm (48" × 6")' },
      { label: 'Thickness', value: '6mm with Cushion' },
      { label: 'Wear Layer', value: '0.5mm (Commercial Grade)' },
      { label: 'Surface Texture', value: 'Handscrapped Woodgrain' },
      { label: 'Edge Finish', value: 'Painted Bevel Edge' },
      { label: 'Installation', value: 'Uniclick System' },
      { label: 'Packing', value: '10 Planks - 20 SQF / Box' },
      { label: 'Warranty', value: '10Y Res / 5Y Comm' },
    ],
  },
  {
    code: 'WJ-SPC-299',
    name: 'G-F SPC 299 (Caramel Teak)',
    price: 180,
    mrp: 390,
    description:
      'Warm caramel teak with smooth flowing grain lines. 100% waterproof rigid composite core allows safe installation in modular kitchens, pantries, and wet-mop dining corridors.',
    image: '/images/dcezlxt8r/f_auto,q_auto/v1775452460/G-F_SPC_299.jpg',
    installedImage:
      '/images/def2qsxjg/f_auto,q_auto/v1792831127/spc-flooring-299-caramel-teak-installed-wholesalerji-gurgaon.jpg',
    altText: 'G-F SPC 299 caramel teak close-up woodgrain texture swatch',
    installedImageAlt:
      'Caramel teak waterproof SPC flooring planks installed in modern modular kitchen',
    badge: '6mm with Cushion',
    specs: [
      { label: 'Plank Size', value: '1220mm × 153mm (48" × 6")' },
      { label: 'Thickness', value: '6mm with Cushion' },
      { label: 'Wear Layer', value: '0.5mm (Commercial Grade)' },
      { label: 'Surface Texture', value: 'Handscrapped Woodgrain' },
      { label: 'Edge Finish', value: 'Painted Bevel Edge' },
      { label: 'Installation', value: 'Uniclick System' },
      { label: 'Packing', value: '10 Planks - 20 SQF / Box' },
      { label: 'Warranty', value: '10Y Res / 5Y Comm' },
    ],
  },
  {
    code: 'WJ-SPC-300',
    name: 'G-F SPC 300 (Mocha Dark Walnut)',
    price: 180,
    mrp: 390,
    description:
      'Substantial dark mocha walnut with deep roasted espresso tones. Heavy commercial 0.5mm wear layer resists castor chair wheels and high footfall in executive meeting spaces.',
    image: '/images/dcezlxt8r/f_auto,q_auto/v1775452460/G-F_SPC_300.jpg',
    installedImage:
      '/images/def2qsxjg/f_auto,q_auto/v1792831123/spc-flooring-300-mocha-dark-walnut-installed-wholesalerji-gurgaon.jpg',
    altText: 'G-F SPC 300 mocha dark walnut close-up woodgrain texture swatch',
    installedImageAlt:
      'Dark mocha walnut commercial-grade rigid core flooring installed in corporate meeting room',
    badge: '6mm with Cushion',
    specs: [
      { label: 'Plank Size', value: '1220mm × 153mm (48" × 6")' },
      { label: 'Thickness', value: '6mm with Cushion' },
      { label: 'Wear Layer', value: '0.5mm (Commercial Grade)' },
      { label: 'Surface Texture', value: 'Handscrapped Woodgrain' },
      { label: 'Edge Finish', value: 'Painted Bevel Edge' },
      { label: 'Installation', value: 'Uniclick System' },
      { label: 'Packing', value: '10 Planks - 20 SQF / Box' },
      { label: 'Warranty', value: '10Y Res / 5Y Comm' },
    ],
  },

  // --- SERIES 2: 1220mm x 183mm Wider Architectural Planks with EIR Real Wood Grain (₹195 / sq.ft, MRP ₹490, 60% OFF) ---
  {
    code: 'WJ-SPC-301',
    name: 'G-F SPC 301 (Pale Sand Blonde Oak EIR)',
    price: 195,
    mrp: 490,
    description:
      'Luminous pale sand blonde oak with synchronized Embossed In Register (EIR) texture. Expansive 183mm wide plank format imparts an airy, Scandinavian architectural aesthetic to open living rooms.',
    image: '/images/dcezlxt8r/f_auto,q_auto/v1775453026/G-F_SPC_301.jpg',
    installedImage:
      '/images/def2qsxjg/f_auto,q_auto/v1792831094/spc-flooring-301-pale-sand-blonde-oak-installed-wholesalerji-gurgaon.jpg',
    altText: 'G-F SPC 301 pale sand blonde oak EIR registered woodgrain texture swatch',
    installedImageAlt:
      'Pale sand blonde oak EIR wide-plank floating floor installed in airy Scandinavian bedroom',
    badge: 'EIR Wide Plank (183mm)',
    specs: [
      { label: 'Plank Size', value: '1220mm × 183mm (48" × 7.2")' },
      { label: 'Thickness', value: '6mm Rigid Core' },
      { label: 'Wear Layer', value: '0.5mm (Commercial Grade)' },
      { label: 'Surface Texture', value: 'EIR Real Wood Grain' },
      { label: 'Edge Finish', value: 'Painted Bevel Edge' },
      { label: 'Installation', value: 'Uniclick System' },
      { label: 'Warranty', value: '10Y Res / 5Y Comm' },
    ],
  },
  {
    code: 'WJ-SPC-302',
    name: 'G-F SPC 302 (Natural Highland Oak EIR)',
    price: 195,
    mrp: 490,
    description:
      'Authentic raw Highland oak with tactile wood knots aligned precisely to the physical embossing. Broad 183mm wide format eliminates repetitive visual patterns across larger rooms.',
    image: '/images/dcezlxt8r/f_auto,q_auto/v1775453027/G-F_SPC_302.jpg',
    installedImage:
      '/images/def2qsxjg/f_auto,q_auto/v1792831146/spc-flooring-302-natural-highland-oak-installed-wholesalerji-gurgaon.jpg',
    altText: 'G-F SPC 302 natural highland oak EIR registered woodgrain texture swatch',
    installedImageAlt:
      'Natural highland oak registered emboss wide-plank flooring installed in sunlit guest bedroom',
    badge: 'EIR Wide Plank (183mm)',
    specs: [
      { label: 'Plank Size', value: '1220mm × 183mm (48" × 7.2")' },
      { label: 'Thickness', value: '6mm Rigid Core' },
      { label: 'Wear Layer', value: '0.5mm (Commercial Grade)' },
      { label: 'Surface Texture', value: 'EIR Real Wood Grain' },
      { label: 'Edge Finish', value: 'Painted Bevel Edge' },
      { label: 'Installation', value: 'Uniclick System' },
      { label: 'Warranty', value: '10Y Res / 5Y Comm' },
    ],
  },
  {
    code: 'WJ-SPC-303',
    name: 'G-F SPC 303 (Smoked Ash EIR)',
    price: 195,
    mrp: 490,
    description:
      'Smoked brownish-grey ash with tactile EIR ridges. High-density limestone composite core provides rock-solid stability under heavy boutique retail and commercial footwear traffic.',
    image: '/images/dcezlxt8r/f_auto,q_auto/v1775453027/G-F_SPC_303.jpg',
    installedImage:
      '/images/def2qsxjg/f_auto,q_auto/v1792831043/spc-flooring-303-smoked-ash-installed-wholesalerji-gurgaon.jpg',
    altText: 'G-F SPC 303 smoked ash EIR registered woodgrain texture swatch',
    installedImageAlt:
      'Smoked ash wide-plank rigid core flooring installed in boutique fashion retail space',
    badge: 'EIR Wide Plank (183mm)',
    specs: [
      { label: 'Plank Size', value: '1220mm × 183mm (48" × 7.2")' },
      { label: 'Thickness', value: '6mm Rigid Core' },
      { label: 'Wear Layer', value: '0.5mm (Commercial Grade)' },
      { label: 'Surface Texture', value: 'EIR Real Wood Grain' },
      { label: 'Edge Finish', value: 'Painted Bevel Edge' },
      { label: 'Installation', value: 'Uniclick System' },
      { label: 'Warranty', value: '10Y Res / 5Y Comm' },
    ],
  },
  {
    code: 'WJ-SPC-304',
    name: 'G-F SPC 304 (Sand Blonde Oak EIR)',
    price: 195,
    mrp: 490,
    description:
      'Warm sand blonde oak designed to brighten shaded hallways and urban corridors. The 183mm wide plank reduces the number of joint seams for an expansive architectural feel.',
    image: '/images/dcezlxt8r/f_auto,q_auto/v1775453026/G-F_SPC_304.jpg',
    installedImage:
      '/images/def2qsxjg/f_auto,q_auto/v1792831040/spc-flooring-304-sand-blonde-oak-installed-wholesalerji-gurgaon.jpg',
    altText: 'G-F SPC 304 sand blonde oak EIR registered woodgrain texture swatch',
    installedImageAlt:
      'Sand blonde oak architectural wide-plank flooring installed through entrance foyer and hallway',
    badge: 'EIR Wide Plank (183mm)',
    specs: [
      { label: 'Plank Size', value: '1220mm × 183mm (48" × 7.2")' },
      { label: 'Thickness', value: '6mm Rigid Core' },
      { label: 'Wear Layer', value: '0.5mm (Commercial Grade)' },
      { label: 'Surface Texture', value: 'EIR Real Wood Grain' },
      { label: 'Edge Finish', value: 'Painted Bevel Edge' },
      { label: 'Installation', value: 'Uniclick System' },
      { label: 'Warranty', value: '10Y Res / 5Y Comm' },
    ],
  },
  {
    code: 'WJ-SPC-305',
    name: 'G-F SPC 305 (Earthy Chestnut Oak EIR)',
    price: 195,
    mrp: 490,
    description:
      'Medium chestnut amber tone with deep-set grain embossing. Hygienic, 100% waterproof, and easy to clean with daily damp mopping in clinics, reception areas, and busy family homes.',
    image: '/images/dcezlxt8r/f_auto,q_auto/v1775453031/G-F_SPC_305.jpg',
    installedImage:
      '/images/def2qsxjg/f_auto,q_auto/v1792831043/spc-flooring-305-earthy-chestnut-oak-installed-wholesalerji-gurgaon.jpg',
    altText: 'G-F SPC 305 earthy chestnut oak EIR registered woodgrain texture swatch',
    installedImageAlt:
      'Earthy chestnut amber oak SPC click-lock flooring installed in modern clinic reception lounge',
    badge: 'EIR Wide Plank (183mm)',
    specs: [
      { label: 'Plank Size', value: '1220mm × 183mm (48" × 7.2")' },
      { label: 'Thickness', value: '6mm Rigid Core' },
      { label: 'Wear Layer', value: '0.5mm (Commercial Grade)' },
      { label: 'Surface Texture', value: 'EIR Real Wood Grain' },
      { label: 'Edge Finish', value: 'Painted Bevel Edge' },
      { label: 'Installation', value: 'Uniclick System' },
      { label: 'Warranty', value: '10Y Res / 5Y Comm' },
    ],
  },
  {
    code: 'WJ-SPC-306',
    name: 'G-F SPC 306 (Nordic Pale Pine EIR)',
    price: 195,
    mrp: 490,
    description:
      'Ultra-clean Scandinavian pale pine with gentle blonde sapwood. Reflects soft ambient light across compact apartments and studio floorplans without yellowing over time.',
    image: '/images/dcezlxt8r/f_auto,q_auto/v1775453031/G-F_SPC_306.jpg',
    installedImage:
      '/images/def2qsxjg/f_auto,q_auto/v1792831044/spc-flooring-306-nordic-pale-pine-installed-wholesalerji-gurgaon.jpg',
    altText: 'G-F SPC 306 Nordic pale pine EIR registered woodgrain texture swatch',
    installedImageAlt:
      'Nordic pale pine wide-plank floating floor installed in open-plan studio apartment',
    badge: 'EIR Wide Plank (183mm)',
    specs: [
      { label: 'Plank Size', value: '1220mm × 183mm (48" × 7.2")' },
      { label: 'Thickness', value: '6mm Rigid Core' },
      { label: 'Wear Layer', value: '0.5mm (Commercial Grade)' },
      { label: 'Surface Texture', value: 'EIR Real Wood Grain' },
      { label: 'Edge Finish', value: 'Painted Bevel Edge' },
      { label: 'Installation', value: 'Uniclick System' },
      { label: 'Warranty', value: '10Y Res / 5Y Comm' },
    ],
  },

  // --- SERIES 3: 600mm x 125mm Herringbone Parquet (₹215 / sq.ft, MRP ₹495, 56% OFF) ---
  {
    code: 'WJ-SPC-H01',
    name: 'Herringbone Smoke Grey (H-GREY)',
    price: 215,
    mrp: 495,
    description:
      'Sophisticated smoke-grey herringbone parquet. Precision 600mm x 125mm planks interlock at a classic 90-degree angle to create an iconic European luxury floor statement.',
    image: '/images/dcezlxt8r/f_auto,q_auto/v1775453460/H-GREY.jpg',
    installedImage:
      '/images/def2qsxjg/f_auto,q_auto/v1792831112/spc-herringbone-flooring-h-grey-smoke-grey-installed-wholesalerji-gurgaon.jpg',
    altText: 'Herringbone smoke grey H-GREY close-up woodgrain texture swatch',
    installedImageAlt:
      'Smoke grey herringbone parquet SPC click-lock flooring installed in elegant contemporary living room',
    badge: 'Herringbone Parquet',
    specs: [
      { label: 'Plank Size', value: '600mm × 125mm (24" × 5")' },
      { label: 'Thickness', value: '6mm Rigid Core' },
      { label: 'Wear Layer', value: '0.5mm (Commercial Grade)' },
      { label: 'Surface Texture', value: 'Handscrapped Texture' },
      { label: 'Edge Finish', value: 'Painted Bevel Edge' },
      { label: 'Installation', value: 'Uniclick 90° Herringbone' },
      { label: 'Packing', value: '20 Planks - 16.15 SQF / Box' },
      { label: 'Warranty', value: '10Y Res / 5Y Comm' },
    ],
  },
  {
    code: 'WJ-SPC-H02',
    name: 'Herringbone Warm Walnut (H-BROWN)',
    price: 215,
    mrp: 495,
    description:
      'Classic warm walnut brown herringbone parquet. Provides timeless architectural prestige for luxury master suites, private libraries, and executive consulting cabins.',
    image: '/images/dcezlxt8r/f_auto,q_auto/v1775453460/H-BROWN.jpg',
    installedImage:
      '/images/def2qsxjg/f_auto,q_auto/v1792831046/spc-herringbone-flooring-h-brown-warm-walnut-installed-wholesalerji-gurgaon.jpg',
    altText: 'Herringbone warm walnut H-BROWN close-up woodgrain texture swatch',
    installedImageAlt:
      'Warm walnut herringbone parquet rigid core flooring installed in open kitchen and dining area',
    badge: 'Herringbone Parquet',
    specs: [
      { label: 'Plank Size', value: '600mm × 125mm (24" × 5")' },
      { label: 'Thickness', value: '6mm Rigid Core' },
      { label: 'Wear Layer', value: '0.5mm (Commercial Grade)' },
      { label: 'Surface Texture', value: 'Handscrapped Texture' },
      { label: 'Edge Finish', value: 'Painted Bevel Edge' },
      { label: 'Installation', value: 'Uniclick 90° Herringbone' },
      { label: 'Packing', value: '20 Planks - 16.15 SQF / Box' },
      { label: 'Warranty', value: '10Y Res / 5Y Comm' },
    ],
  },
  {
    code: 'WJ-SPC-H03',
    name: 'Herringbone Hazelnut Oak (H-GAZLENUT)',
    price: 215,
    mrp: 495,
    description:
      'Warm golden hazelnut oak herringbone parquet with delicate grain highlights. Delivers authentic solid parquet elegance with zero risk of termite infestation or seasonal swelling.',
    image: '/images/dcezlxt8r/f_auto,q_auto/v1775453464/H-GAZLENUT.jpg',
    installedImage:
      '/images/def2qsxjg/f_auto,q_auto/v1792831042/spc-herringbone-flooring-h-gazlenut-installed-wholesalerji-gurgaon.jpg',
    altText: 'Herringbone hazelnut oak H-GAZLENUT close-up woodgrain texture swatch',
    installedImageAlt:
      'Golden hazelnut oak herringbone parquet waterproof flooring installed in penthouse living room',
    badge: 'Herringbone Parquet',
    specs: [
      { label: 'Plank Size', value: '600mm × 125mm (24" × 5")' },
      { label: 'Thickness', value: '6mm Rigid Core' },
      { label: 'Wear Layer', value: '0.5mm (Commercial Grade)' },
      { label: 'Surface Texture', value: 'Handscrapped Texture' },
      { label: 'Edge Finish', value: 'Painted Bevel Edge' },
      { label: 'Installation', value: 'Uniclick 90° Herringbone' },
      { label: 'Packing', value: '20 Planks - 16.15 SQF / Box' },
      { label: 'Warranty', value: '10Y Res / 5Y Comm' },
    ],
  },
];

export interface SpcHeroSlide {
  url: string;
  title: string;
  spec: string;
  badge: string;
  alt: string;
}

export const SPC_HERO_SLIDES: SpcHeroSlide[] = [
  {
    url: '/images/def2qsxjg/f_auto,q_auto/v1792831568/spc_archived_296_home_office.jpg',
    title: 'Modern Study & Workstation',
    spec: 'Honey Oak Natural Plank Finish',
    badge: 'Study Suite',
    alt: 'SPC rigid core flooring installed in modern home office study room with desk',
  },
  {
    url: '/images/def2qsxjg/f_auto,q_auto/v1792831568/spc_archived_297_dining.jpg',
    title: 'Contemporary Dining Space',
    spec: 'Golden Grain Natural Texture',
    badge: 'Dining Area',
    alt: 'SPC woodgrain flooring installed in contemporary dining room with family table',
  },
  {
    url: '/images/def2qsxjg/f_auto,q_auto/v1792831569/spc_archived_301_grey_lounge.jpg',
    title: 'Sunlit Living Room & Balcony',
    spec: 'Cool Grey Ash Architectural Format',
    badge: 'Living Lounge',
    alt: 'SPC rigid core flooring installed in sunlit living room with floor to ceiling glass windows',
  },
  {
    url: '/images/def2qsxjg/f_auto,q_auto/v1792831559/spc_archived_h_brown_light_penthouse.jpg',
    title: 'Minimalist Penthouse Suite',
    spec: 'Classic Herringbone Parquet Craftsmanship',
    badge: 'Herringbone Suite',
    alt: 'Herringbone 90 degree parquet SPC flooring installed in luxury penthouse interior',
  },
];

// Specifications & Technical Factors
export const SPC_SPECIFICATIONS: SpcSpecFactor[] = [
  {
    title: 'Total Thickness',
    shortTitle: 'Total Thickness',
    specValue: '4.0 mm Core + 1.0 mm Attached IXPE',
    guidance: 'Total thickness dictates joint locking strength and subfloor deflection tolerance.',
    architecturalContext:
      'A 5.0mm total build (4mm rigid limestone core + 1mm factory IXPE underlay) delivers optimal rigidity over existing tiles while retaining low profile clearance under standard doors.',
  },
  {
    title: 'Wear Layer',
    shortTitle: 'Wear Layer',
    specValue: '0.30 mm (Residential) / 0.50 mm (Commercial)',
    guidance: 'Crucial distinction: wear layer thickness determines abrasion longevity, NOT total plank thickness.',
    architecturalContext:
      '0.30mm (12 mil) provides 15+ years of daily home durability against pet claws and family shoes. For offices, corridors, and stores with castor wheels, specify 0.50mm (20 mil) heavy commercial grade.',
  },
  {
    title: 'Core Density',
    shortTitle: 'Core Density',
    specValue: '1900 – 2100 kg/m³ Rigid Stone Matrix',
    guidance: 'Formulated with 70–75% crushed calcium carbonate (limestone) and 25–30% virgin PVC resin.',
    architecturalContext:
      'High limestone density renders the core virtually impervious to water absorption (0.01%) and yields exceptional dimensional stability under thermal cycling between 10°C and 45°C.',
  },
  {
    title: 'Click-Lock Joint',
    shortTitle: 'Click-Lock Joint',
    specValue: 'Uniclic / Valinge Floating Interlock',
    guidance: 'Precision-milled mechanical tongue-and-groove joint requires zero glue, adhesive, or nails.',
    architecturalContext:
      'Planks lock securely into place using a simple 45-degree angle-insertion and tap method. Enables damage-free uninstallation and reuse in tenant-leased commercial properties.',
  },
  {
    title: 'Acoustic Underlay',
    shortTitle: 'Acoustic Underlay',
    specValue: '1.0 mm High-Density IXPE Closed-Cell Foam',
    guidance: 'Cross-linked polyethylene foam permanently laminated to the underside of every plank.',
    architecturalContext:
      'Eliminates hollow hollow-click sounds, reduces footstep impact transmission by up to 18–20 dB (IIC certified), and bridges microscopic subfloor grain without shifting.',
  },
  {
    title: 'Fire & Safety',
    shortTitle: 'Fire & Safety',
    specValue: 'Class B1-s1 Flame Retardant • E0 Zero Formaldehyde',
    guidance: 'Self-extinguishing polymer formulation that emits non-toxic white vapor if exposed to open flame.',
    architecturalContext:
      'Zero urea-formaldehyde resin binders. Safe for enclosed nurseries, air-conditioned bedrooms, and LEED-certified commercial projects with strict indoor air quality mandates.',
  },
];

// Comprehensive Flooring Material Comparison Table
export const FLOORING_COMPARISONS: FlooringComparisonRow[] = [
  {
    parameter: 'Core Construction',
    spc: 'Rigid Limestone (CaCO3) + Virgin PVC Composite',
    laminate: 'High-Density Fiberboard (HDF Compressed Wood Fibers)',
    vitrifiedTiles: 'Fired Clay, Silica & Feldspar Mineral Slabs',
    engineeredWood: 'Multi-layer Plywood Core with Real Hardwood Top Veneer',
    highlightNote: 'SPC contains zero wood fibers to absorb water; tiles are mineral; engineered wood is real timber.',
  },
  {
    parameter: 'Water & Moisture Immunity',
    spc: '100% Waterproof Core (Zero Swelling or Peeling)',
    laminate: 'Vulnerable to Edge Swelling & Blistering when Wet',
    vitrifiedTiles: '100% Waterproof (Grout lines require periodic sealing)',
    engineeredWood: 'Water Resistant Only (Standing water causes staining & warp)',
    highlightNote: 'SPC and vitrified tiles are immune to flood/mopping; laminate swells permanently if water seeps.',
  },
  {
    parameter: 'Installation Speed & Mess',
    spc: 'Dry Floating Click-Lock (150–200 sq.ft/hour per mason)',
    laminate: 'Dry Floating Click-Lock (Requires separate underlayment)',
    vitrifiedTiles: 'Wet Masonry Mortar (Cement dust, curing water, 3–5 days wait)',
    engineeredWood: 'Nail-down or Adhesive Trowel (Skilled carpentry required)',
    highlightNote: 'SPC installs dry over existing tiles in 1 day with zero demolition dust or curing downtime.',
  },
  {
    parameter: 'Underfoot Temperature & Comfort',
    spc: 'Warm & Yielding with 1mm IXPE Cushioning',
    laminate: 'Warm but often sounds hollow without dense underlay',
    vitrifiedTiles: 'Cold and Hard on joints during North Indian winters',
    engineeredWood: 'Naturally warm, organic, and comfortable underfoot',
    highlightNote: 'Tiles conduct winter chill; SPC maintains comfortable ambient room temperature.',
  },
  {
    parameter: 'Subfloor Levelness Requirement',
    spc: 'Strict: Must be flat within 2–3mm over 2 meters',
    laminate: 'Moderate: Slight deflection absorbed by foam',
    vitrifiedTiles: 'Tolerant: Cement mortar bed compensates for floor slopes',
    engineeredWood: 'Moderate to Strict: Requires flat structural subfloor',
    highlightNote: 'Because SPC is rigid, sharp dips in the subfloor can stress click-joints if not leveled.',
  },
  {
    parameter: 'Impact & Dent Resistance',
    spc: 'High: Dense limestone core resists shoe heels and furniture',
    laminate: 'Moderate: Heavy dropped pots can chip surface finish',
    vitrifiedTiles: 'High: Extremely hard, but heavy cast-iron drops can crack tiles',
    engineeredWood: 'Low to Moderate: Real wood veneer dents easily under points',
    highlightNote: 'SPC offers superior dent resistance compared to real timber and softer vinyl planks.',
  },
  {
    parameter: 'Lifespan & Maintenance',
    spc: '15–25 Years (Neutral damp mop; zero polish required)',
    laminate: '10–15 Years (Dry mop only; damp-sensitive)',
    vitrifiedTiles: '25+ Years (Grout cleaning required; grout darkens)',
    engineeredWood: '20+ Years (Can be re-sanded once or twice; periodic polish)',
    highlightNote: 'Engineered wood offers refinishing; SPC offers zero-maintenance everyday practicality.',
  },
];

// Price and Cost Factors Breakdown
export const PRICE_FACTORS = [
  {
    title: 'Material Specification & Thickness',
    description:
      '4.0mm vs 5.0mm total thickness. Thicker planks incorporate heavier limestone core mass, deeper click profiles, and thicker IXPE underlay.',
    impact: 'Base plank tier variance',
  },
  {
    title: 'Wear Layer Rating (0.30mm vs 0.50mm)',
    description:
      '0.30mm wear layer for residential master bedrooms vs 0.50mm with UV ceramic-bead topcoat for commercial offices and retail stores.',
    impact: 'Commercial durability premium',
  },
  {
    title: 'Subfloor Condition & Self-Leveling',
    description:
      'Existing vitrified or marble tiles require zero screed. Rough or uneven concrete requires a thin self-leveling polymer screed compound before installation.',
    impact: 'Subfloor prep scope',
  },
  {
    title: 'Perimeter Trims, Transitions & Skirting',
    description:
      'Matching SPC skirting, T-moldings for doorways between different floor surfaces, and aluminum reducer edge profiles at bathroom thresholds.',
    impact: 'Finishing accessories',
  },
  {
    title: 'Order Volume & Project Logistics',
    description:
      'Wholesale pallet quantities (1,000+ sq.ft) qualify for direct factory mill pricing compared to small residential repair orders.',
    impact: 'Volume tier discount',
  },
];

// Essential SEO FAQs
export const SPC_FAQS = [
  {
    question: 'What is SPC flooring and what does SPC stand for?',
    answer:
      'SPC stands for Stone Plastic Composite (also referred to as Stone Polymer Composite). It is an advanced rigid-core luxury vinyl flooring engineered with approximately 70% natural limestone powder (calcium carbonate), 25% virgin polyvinyl chloride, and stabilizing agents. Unlike traditional laminate flooring made with wood fiberboards that swell when wet, SPC flooring has an ultra-dense, stone-based core that is 100% waterproof and structurally stable across extreme temperature swings.',
  },
  {
    question: 'How much does SPC flooring cost per sq. ft. in India?',
    answer:
      'SPC flooring material costs in India typically range from ₹65 to ₹110 per sq. ft., depending on plank thickness (4mm vs 5mm), wear layer thickness (0.3mm residential vs 0.50mm commercial), embossing technology (standard vs EIR synchronized grain), and whether high-density IXPE acoustic underlay is pre-attached. Professional floating installation generally adds ₹15 to ₹25 per sq. ft., plus edge trims and subfloor leveling if required. For project and wholesale quantities, contact WholesalerJi for formalized mill rate cards.',
  },
  {
    question: 'Is SPC flooring truly 100% waterproof?',
    answer:
      'Yes, the core of SPC flooring is 100% waterproof. Because it contains zero wood fibers or hygroscopic organic matter, the planks will not swell, buckle, curl, or disintegrate even if submerged under water. However, keep in mind that while the planks themselves are waterproof, floating installation does not create a sealed subfloor tanking membrane. Water can still seep through perimeter expansion gaps onto the concrete slab below, so major pipe bursts or ground-level moisture must be dried out.',
  },
  {
    question: 'Can SPC flooring be installed directly over existing floor tiles or marble?',
    answer:
      'Yes. One of the greatest architectural advantages of rigid SPC flooring is that it can be installed directly over existing ceramic tiles, vitrified slabs, granite, or cured terrazzo without breaking up the old floor. Because the core is stone-rigid, it will not telegraph grout joint lines like soft vinyl does, provided the existing grout joints are under 4mm wide and the surface is level within 2mm to 3mm across a 2-meter straightedge.',
  },
  {
    question: 'Is SPC flooring suitable for bedrooms and corporate offices?',
    answer:
      'Absolutely. For residential bedrooms, SPC flooring provides a warm, quiet, and comfortable surface underfoot due to its integrated 1mm IXPE acoustic foam, eliminating the cold shock of ceramic tiles during North Indian winters. For corporate offices, selecting an SPC product with a 0.50mm commercial wear layer ensures complete resistance to rolling office castor chairs, high daily footfall, and accidental coffee spills without scuffing.',
  },
  {
    question: 'How do I choose between 4mm and 5mm thickness for SPC flooring?',
    answer:
      'Standard residential projects with flat subfloors (such as existing smooth tiles) perform exceptionally well with 4.0mm SPC with 1.0mm attached IXPE (5.0mm total build). For heavy commercial projects, uneven subfloors, or spaces requiring maximum joint locking tensile strength against heavy furniture, a 5.0mm core (6.0mm total build) with a 0.50mm wear layer is recommended.',
  },
  {
    question: 'What affects the installation cost of SPC flooring?',
    answer:
      'Installation cost is influenced by three main factors: subfloor preparation (cleaning and checking for levelness), room geometry (complex corridors, angled walls, and pillar cutouts require more cutting and waste factor than open rectangles), and finishing trims (installing matching skirting boards, door threshold T-moldings, and reducer strips). Dry floating click installation typically proceeds at 150 to 200 sq.ft per installer per day.',
  },
  {
    question: 'Does SPC flooring require an expansion gap during installation?',
    answer:
      'Yes. Even though SPC expands significantly less than laminate or solid wood due to its rigid stone core, an expansion perimeter gap of 6mm to 8mm must be maintained along all walls, doorframes, and permanent fixtures. This perimeter gap is cleanly concealed beneath matching skirting boards or quarter-round molding, allowing the floating floor to breathe naturally under seasonal temperature fluctuations.',
  },
  {
    question: 'How do you clean and maintain SPC click-lock floors?',
    answer:
      'SPC flooring is exceptionally easy to maintain. Daily care requires sweeping or vacuuming with a soft brush attachment to remove surface grit. For regular mopping, use a well-wrung damp microfiber mop with plain water or a neutral-pH floor cleaner. Avoid steam mops with concentrated high heat, abrasive scouring powders, bleach, or wax polishing, as the factory UV ceramic coating never needs buffing or waxing.',
  },
  {
    question: 'Can I order wholesale quantities or sample swatch kits for pan-India delivery?',
    answer:
      'Yes. WholesalerJi operates an architectural materials warehousing depot maintaining ready stock for express project dispatch and transport carrier delivery to all 28 states and union territories across India. Verified architects, interior designers, contractors, and retail dealers can request physical hand-sample swatch kits to inspect texture and lock profiles before ordering.',
  },
];

export const APPLICATION_SPACES: ApplicationSpace[] = [
  {
    title: 'Master Suites & Bedrooms',
    metric: '18 dB Sound Absorption',
    description:
      'Warm barefoot surface eliminating the cold shock of vitrified tile during North Indian winters. The pre-laminated IXPE foam cushions footfalls and dampens room reverberation.',
    icon: 'BedDouble',
  },
  {
    title: 'Modular Kitchens & Pantries',
    metric: '100% Moisture Proof',
    description:
      'Immune to boiling water splashes, oil splatters, and daily damp mopping. Does not harbor mold or rot beneath kitchen kickplates like conventional MDF wood laminate.',
    icon: 'Utensils',
  },
  {
    title: 'Corporate Cabins & Workspaces',
    metric: '0.50mm Castor Shield',
    description:
      'High-density limestone core resists indentation from heavy executive desks and rolling office castor chairs without requiring unsightly plastic floor mats.',
    icon: 'Building2',
  },
  {
    title: 'Retail Stores & Boutiques',
    metric: 'Zero-Downtime Install',
    description:
      'Fast floating installation directly over old tenant tiles in a single weekend. No cement slurry, no drying wait, and no lost trading revenue.',
    icon: 'Store',
  },
  {
    title: 'Clinics & Wellness Centers',
    metric: 'E0 Non-Toxic & Antibacterial',
    description:
      'Non-porous UV topcoat prevents bacterial colonization and chemical staining from medical sanitizers. Free of phthalates and volatile organic compounds (VOCs).',
    icon: 'Activity',
  },
  {
    title: 'Basements & Damp-Prone Floors',
    metric: 'Subfloor Moisture Barrier',
    description:
      'Ideal for ground-floor builder floors and basements across India where rising ground moisture causes traditional hardwood to rot and laminate edges to swell.',
    icon: 'ShieldCheck',
  },
];

export interface SpcLayerItem {
  id: string;
  num: string;
  shortName: string;
  title: string;
  spec: string;
  tagline: string;
  description: string;
  benefits: string[];
}

export const SPC_LAYERS_DATA: SpcLayerItem[] = [
  {
    id: 'layer-1',
    num: '01',
    shortName: 'UV Topcoat',
    title: 'UV Ceramic Protective Topcoat',
    spec: 'Double-Cure Ceramic Bead Shield',
    tagline: 'Scratch, Stain & Sunlight UV Oxidation Defense',
    description:
      'The topmost microscopic shield formulated with double-cured ceramic beads. Blocks harsh UV degradation, prevents discoloration from Indian sunlight, and completely eliminates stubborn stains from turmeric, tea, coffee, and daily shoe scuffs.',
    benefits: [
      'Stain & spill resistant (100% wipe-clean)',
      'UV50+ anti-yellowing & anti-fade protection',
      'Zero waxing, polishing, or resealing required',
    ],
  },
  {
    id: 'layer-2',
    num: '02',
    shortName: 'Wear Layer',
    title: 'Clear Commercial Wear Layer',
    spec: '0.30mm – 0.50mm High-Traffic Armor',
    tagline: 'Heavy-Duty Impact & Rolling Friction Shield',
    description:
      'A dense, transparent virgin polymer wear film that bears the daily physical friction of foot traffic, rolling office chairs, and pet claws. Certified Group T commercial abrasion resistance ensures the plank never loses its luster.',
    benefits: [
      'Commercial Grade Group T abrasion rating',
      'High resistance to rolling casters & high heels',
      'Embossed-In-Register (EIR) synchronized surface texture',
    ],
  },
  {
    id: 'layer-3',
    num: '03',
    shortName: '3D Film',
    title: 'High-Definition Decorative Film',
    spec: '3D Synchronized Wood Grain (EIR)',
    tagline: 'Photorealistic Architectural Timber Aesthetic',
    description:
      'State-of-the-art photographic decorative sheet replicating natural Nordic oak, smoked walnut, and teak grains with microscopic realism. The grain texture on the wear layer aligns perfectly with the visual grain beneath.',
    benefits: [
      'True-to-life architectural natural timber visual',
      'Consistent mill-matched batch shading across boxes',
      'Natural matte finish without artificial plastic glare',
    ],
  },
  {
    id: 'layer-4',
    num: '04',
    shortName: 'Limestone Core',
    title: 'Rigid Limestone Composite Core',
    spec: '70% Crushed Limestone + 30% Virgin Polymer',
    tagline: '100% Waterproof & Dimensionally Stable Heart',
    description:
      'The structural powerhouse of SPC flooring. Combines 70% natural limestone powder (calcium carbonate) with virgin PVC polymer resin. Creates an inert, stone-rigid core that never absorbs water, expands in monsoons, or telegraphs subfloor tile joints.',
    benefits: [
      '100% waterproof – zero swelling in kitchens & damp zones',
      'Floating click-lock install directly over existing ceramic tiles',
      'Extreme dimensional stability from -10°C to 50°C',
    ],
  },
  {
    id: 'layer-5',
    num: '05',
    shortName: 'IXPE Foam',
    title: 'IXPE Acoustic Underlayment',
    spec: '1.0mm Pre-Attached Closed-Cell Foam',
    tagline: '19dB Impact Sound Insulation & Footing Comfort',
    description:
      'Permanently pre-laminated irradiated cross-linked polyethylene (IXPE) acoustic cushion backing. Eliminates hollow clicking sounds, absorbs micro-imperfections in the subfloor, and saves significant project time and material costs.',
    benefits: [
      '19dB certified impact sound absorption',
      'Pre-attached pad saves separate underlayment installation cost',
      'Closed-cell moisture barrier prevents mildew & subfloor odor',
    ],
  },
];
