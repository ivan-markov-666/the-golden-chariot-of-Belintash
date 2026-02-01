import { useMemo } from 'react';
import { useEntitlements } from '@/store/entitlementsStore';
import { getDlcCatalog, getDlcDetails, type DlcDetail } from '@/game/dlc/DLCRegistry';

export type ActiveDlcDescriptor = DlcDetail & {
  hasEntitlement: boolean;
};

export type UseActiveDLCsResult = {
  activeIds: string[];
  activeDetails: ActiveDlcDescriptor[];
  missingEntitlements: ActiveDlcDescriptor[];
};

export const useActiveDLCs = (): UseActiveDLCsResult => {
  const entitlements = useEntitlements((state) => state.entitlements);

  const activeIds = useMemo(() => {
    return Object.entries(entitlements ?? {})
      .filter(([, enabled]) => Boolean(enabled))
      .map(([dlcId]) => dlcId);
  }, [entitlements]);

  const activeDetails = useMemo<ActiveDlcDescriptor[]>(() => {
    return getDlcDetails(activeIds).map((detail) => ({ ...detail, hasEntitlement: true }));
  }, [activeIds]);

  const missingEntitlements = useMemo<ActiveDlcDescriptor[]>(() => {
    const catalog = getDlcCatalog();
    return catalog
      .filter((dlc) => !activeIds.includes(dlc.id))
      .map((dlc) => ({
        id: dlc.id,
        name: dlc.name,
        version: dlc.version,
        shortName: dlc.shortName,
        badgeColor: dlc.badgeColor,
        hasEntitlement: false,
      }));
  }, [activeIds]);

  return {
    activeIds,
    activeDetails,
    missingEntitlements,
  };
};
