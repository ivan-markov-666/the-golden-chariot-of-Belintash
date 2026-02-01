import { DLCService, type DLCManifest } from '@/services/DLCService';

export type DLCCatalogEntry = DLCManifest & {
  shortName: string;
  summary: string;
  badgeColor: string;
};

const DLC_CATALOG: DLCCatalogEntry[] = [
  {
    id: 'dlc-occult-expansion',
    name: 'Occult Expansion',
    shortName: 'Occult',
    summary: 'Разклонение Belintash Crack с окултни печати и нови ритуали.',
    version: '1.0.0',
    dependencies: [],
    badgeColor: '#a855f7',
    contentFlags: ['dlc.occult.unlocked', 'dlc.occult.tutorial'],
  },
];

let registered = false;

const registerIfNeeded = () => {
  if (registered) {
    return;
  }

  DLC_CATALOG.forEach((manifest) => {
    if (!DLCService.isDLCInstalled(manifest.id)) {
      DLCService.registerDLC(manifest);
    }
  });

  registered = true;
};

export const ensureDLCsRegistered = () => {
  registerIfNeeded();
};

export const getDlcCatalog = (): DLCCatalogEntry[] => {
  registerIfNeeded();
  return DLC_CATALOG;
};

export const getDlcDescriptor = (dlcId: string): DLCCatalogEntry | undefined => {
  return getDlcCatalog().find((dlc) => dlc.id === dlcId);
};

export type DlcDetail = {
  id: string;
  name: string;
  version: string;
  shortName?: string;
  badgeColor?: string;
};

export const getDlcDetails = (dlcIds: string[]): DlcDetail[] => {
  return dlcIds.map((dlcId) => {
    const descriptor = getDlcDescriptor(dlcId);
    return {
      id: dlcId,
      name: descriptor?.name ?? dlcId,
      version: descriptor?.version ?? 'unknown',
      shortName: descriptor?.shortName,
      badgeColor: descriptor?.badgeColor,
    };
  });
};
