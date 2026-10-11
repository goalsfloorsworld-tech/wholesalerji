import { PRIMO_WALL_PANELS, PRIMO_ROOM_SCENES } from './primoPanelsData';
import { ELITE_WALL_PANELS, ELITE_ROOM_SCENES } from './elitePanelsData';
import { PRIMO_FLUTED_WALL_PANELS, PRIMO_FLUTED_ROOM_SCENES } from './primoFlutedPanelsData';

export type GalleryCollectionId = 'all' | 'primo' | 'elite' | 'primo-fluted';

export interface GalleryImageItem {
  id: string;
  imageUrl: string;
  collection: 'primo' | 'elite' | 'primo-fluted';
  collectionLabel: string;
  displayLabel: string; // Plain, minimal label: e.g. "Primo GF-301"
  parentPath: string;
  parentLabel: string;
  code?: string;
  colorName?: string;
  finishType?: string;
  materialType: string;
  dimensions: string;
  altText: string;
  popupDescription: string;
}

// ─────────────────────────────────────────────────────────────
// 1. PRIMO PANELS (24 installed room images)
// Mapped 1-to-1 to PRIMO_WALL_PANELS with individualized alt text
// & unique popup descriptions tailored for Gurgaon & Delhi NCR SEO
// ─────────────────────────────────────────────────────────────
const primoGalleryItems: GalleryImageItem[] = PRIMO_ROOM_SCENES.map((url, idx) => {
  const panel = PRIMO_WALL_PANELS.find((p) => p.installedImage === url) || PRIMO_WALL_PANELS[idx % PRIMO_WALL_PANELS.length];
  const code = panel.code;
  const color = panel.colorName;
  const finish = panel.finishType;

  const locationSignals = [
    'in modern Gurgaon apartment',
    'in Delhi NCR residence',
    'installed by Gurgaon contractor',
    'for Delhi NCR interior renovation',
    'supplied wholesale across Gurgaon Haryana',
    'in luxury Gurgaon home interior',
  ];
  const loc = locationSignals[idx % locationSignals.length];
  const altText = `Primo ${code} ${color} ${finish} PVC wall panel installation ${loc}`;

  const popupDescription = `The Primo ${code} panel features an authentic ${color.toLowerCase()} finish engineered with a ${finish.toLowerCase()} texture. Installed with a seamless tongue-and-groove joint profile across 300mm wide boards, it provides complete moisture and seelan immunity for bedrooms, hallways, and living spaces across Gurgaon and Delhi NCR.`;

  return {
    id: `primo-${code.toLowerCase()}`,
    imageUrl: url,
    collection: 'primo',
    collectionLabel: 'Primo Series (12" Flat PVC)',
    displayLabel: `Primo ${code}`,
    parentPath: '/wall-panels/primo',
    parentLabel: 'View full Primo collection →',
    code,
    colorName: color,
    finishType: finish,
    materialType: 'Seamless Flat PVC (5mm)',
    dimensions: panel.dimensions || '2950 × 300 mm (9.6 × 1 ft)',
    altText,
    popupDescription,
  };
});

// ─────────────────────────────────────────────────────────────
// 2. ELITE PANELS (12 installed room images)
// Mapped 1-to-1 to ELITE_WALL_PANELS with individualized alt text
// & unique popup descriptions for Italian UV marble & metallic finishes
// ─────────────────────────────────────────────────────────────
const eliteGalleryItems: GalleryImageItem[] = ELITE_ROOM_SCENES.map((url, idx) => {
  const panel = ELITE_WALL_PANELS.find((p) => p.installedImage === url) || ELITE_WALL_PANELS[idx % ELITE_WALL_PANELS.length];
  const code = panel.code;
  const color = panel.colorName;
  const finish = panel.finishType;
  const materialType =
    finish === 'Metallic'
      ? 'Metallic UV PVC Sheet'
      : finish === 'Fabric Weave'
      ? 'Textured Fabric Weave PVC'
      : 'High-Gloss Italian UV Marble Sheet';

  const locationSignals = [
    'in luxury Gurgaon villa',
    'in Delhi NCR executive drawing room',
    'in modern Gurgaon dining hall',
    'installed in premium Delhi NCR penthouse',
    'for corporate lobby feature wall in Gurgaon',
    'wholesale supplier in Sector 34 Gurugram',
  ];
  const loc = locationSignals[idx % locationSignals.length];
  const altText = `Elite ${code} ${color} ${materialType} wall panel installed ${loc}`;

  const popupDescription = `Elite ${code} showcases high-gloss specular clarity replicating ${color} with multi-coat UV acrylic curing. Offering mirror reflectance with zero stone weight or grout maintenance, this 300mm interlocking panel is designed for dining backdrops, TV consoles, and master suites throughout Gurgaon, Haryana and Delhi NCR.`;

  return {
    id: `elite-${code.toLowerCase()}-${idx}`,
    imageUrl: url,
    collection: 'elite',
    collectionLabel: 'Elite Series (High-Gloss UV Marble)',
    displayLabel: `Elite ${code}`,
    parentPath: '/wall-panels/elite',
    parentLabel: 'View full Elite collection →',
    code,
    colorName: color,
    finishType: finish,
    materialType,
    dimensions: panel.dimensions || '2950 × 300 mm (9.6 × 1 ft)',
    altText,
    popupDescription,
  };
});

// ─────────────────────────────────────────────────────────────
// 3. PRIMO FLUTED PANELS (13 installed room images)
// Mapped 1-to-1 to PRIMO_FLUTED_WALL_PANELS with verified room contexts
// & Gurgaon/NCR location signals
// ─────────────────────────────────────────────────────────────
const primoFlutedGalleryItems: GalleryImageItem[] = PRIMO_FLUTED_ROOM_SCENES.map((url, idx) => {
  const panel = PRIMO_FLUTED_WALL_PANELS.find((p) => p.installedImage === url) || PRIMO_FLUTED_WALL_PANELS[idx % PRIMO_FLUTED_WALL_PANELS.length];
  const code = panel.code;
  const color = panel.colorName;
  const finish = panel.finishType;

  const baseAlt = panel.installedImageAlt || `Primo Fluted ${code} ${color} 9mm architectural fluted louver panel`;
  const altText = baseAlt.includes('Gurgaon') || baseAlt.includes('Delhi')
    ? baseAlt
    : `${baseAlt} — Gurgaon Delhi NCR supplier`;

  const popupDescription = `The Primo Fluted ${code} in ${color} delivers deep 9mm architectural shadow grooves that create elegant vertical rhythm and acoustic scattering. Manufactured with extruded high-density wood-polymer composite matrix, it is completely termite and dampness proof, ideal for bedhead feature walls and TV consoles across Gurgaon and Delhi NCR.`;

  return {
    id: `primo-fluted-${code.toLowerCase()}`,
    imageUrl: url,
    collection: 'primo-fluted',
    collectionLabel: 'Primo Fluted (9mm WPC Louvers)',
    displayLabel: `Primo Fluted ${code}`,
    parentPath: '/wall-panels/primo-fluted',
    parentLabel: 'View full Primo Fluted collection →',
    code,
    colorName: color,
    finishType: finish,
    materialType: 'Architectural Fluted WPC (9mm)',
    dimensions: panel.dimensions || '2900 × 160 × 9 mm',
    altText,
    popupDescription,
  };
});

// ─────────────────────────────────────────────────────────────
// Unified 49 Verified Installed Room Images
// ─────────────────────────────────────────────────────────────
export const ALL_GALLERY_ITEMS: GalleryImageItem[] = [
  ...primoGalleryItems,
  ...eliteGalleryItems,
  ...primoFlutedGalleryItems,
];

export const GALLERY_COLLECTION_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'primo', label: 'Primo' },
  { id: 'elite', label: 'Elite' },
  { id: 'primo-fluted', label: 'Primo Fluted' },
] as const;
