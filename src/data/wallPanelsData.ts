import { PanelProduct, PanelCollectionMeta } from './types';
import { PRIMO_WALL_PANELS, PRIMO_COLLECTION_META } from './primoPanelsData';
import { ELITE_WALL_PANELS, ELITE_COLLECTION_META } from './elitePanelsData';
import { PRIMO_FLUTED_WALL_PANELS, PRIMO_FLUTED_COLLECTION_META } from './primoFlutedPanelsData';

export type { PanelProduct, PanelCollectionMeta };

export { PRIMO_WALL_PANELS, PRIMO_COLLECTION_META };
export { ELITE_WALL_PANELS, ELITE_COLLECTION_META };
export { PRIMO_FLUTED_WALL_PANELS, PRIMO_FLUTED_COLLECTION_META };

export const WALL_PANEL_COLLECTIONS: PanelCollectionMeta[] = [
  PRIMO_COLLECTION_META,
  ELITE_COLLECTION_META,
  PRIMO_FLUTED_COLLECTION_META,
];

export const ALL_WALL_PANELS: PanelProduct[] = [
  ...PRIMO_WALL_PANELS,
  ...ELITE_WALL_PANELS,
  ...PRIMO_FLUTED_WALL_PANELS,
];
