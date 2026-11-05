import { useCallback, useState } from "react";

import {
  type CatalogueMembershipBucket,
  createEmptyVoucherCatalogueDraft,
  stageCatalogueAdd,
  stageCatalogueRemove,
  type VoucherCatalogueDraft,
  type VoucherCatalogueKind,
} from "./voucherCatalogueDraft";

export const useVoucherCatalogueDraft = () => {
  const [draft, setDraft] = useState<VoucherCatalogueDraft>(createEmptyVoucherCatalogueDraft);

  const resetDraft = useCallback(() => {
    setDraft(createEmptyVoucherCatalogueDraft());
  }, []);

  /**
   * Drops staged catalogue additions, removals or both, once they are saved. Countries are saved
   * separately and are kept.
   */
  const resetCatalogueItems = useCallback(
    ({ additions, removals }: { additions: boolean; removals: boolean }) => {
      const resetBucket = (bucket: CatalogueMembershipBucket): CatalogueMembershipBucket => ({
        idsToAdd: additions ? [] : bucket.idsToAdd,
        idsToRemove: removals ? [] : bucket.idsToRemove,
        toDisplay: additions ? [] : bucket.toDisplay,
      });

      setDraft(current => ({
        categories: resetBucket(current.categories),
        collections: resetBucket(current.collections),
        products: resetBucket(current.products),
        variants: resetBucket(current.variants),
        countryCodes: current.countryCodes,
      }));
    },
    [],
  );

  const resetCountryCodes = useCallback(() => {
    setDraft(current => ({
      ...current,
      countryCodes: null,
    }));
  }, []);

  const assignItems = useCallback(
    <T extends { id: string }>(kind: VoucherCatalogueKind, items: T[]) => {
      setDraft(current => ({
        ...current,
        [kind]: stageCatalogueAdd(current[kind] as typeof current.categories, items),
      }));
    },
    [],
  );

  const unassignIds = useCallback((kind: VoucherCatalogueKind, ids: string[]) => {
    setDraft(current => ({
      ...current,
      [kind]: stageCatalogueRemove(current[kind], ids),
    }));
  }, []);

  const setCountryCodes = useCallback((countryCodes: string[]) => {
    setDraft(current => ({
      ...current,
      countryCodes,
    }));
  }, []);

  const unassignCountryCode = useCallback((code: string, baselineCodes: string[]) => {
    setDraft(current => {
      const currentCodes = current.countryCodes ?? baselineCodes;

      return {
        ...current,
        countryCodes: currentCodes.filter(countryCode => countryCode !== code),
      };
    });
  }, []);

  return {
    draft,
    resetDraft,
    resetCatalogueItems,
    resetCountryCodes,
    assignItems,
    unassignIds,
    setCountryCodes,
    unassignCountryCode,
  };
};
