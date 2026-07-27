import { atom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";

import { type PopupCandidate } from "./open-popup";

/**
 * Registry of the extensions currently mounted on the page, keyed per
 * `useExtensions` caller.
 *
 * The popup state lives in a single global provider, but the `openPopup` action
 * must resolve a target extension against the extensions the current page
 * already fetched (a widget may only open a popup co-located on the same page).
 * Each `useExtensions` call publishes its extensions here so the resolver can
 * read the union without re-fetching.
 */
const registryAtom = atom<Record<string, PopupCandidate[]>>({});

export const useRegisterExtensions = (key: string, extensions: PopupCandidate[]) => {
  const setRegistry = useSetAtom(registryAtom);

  // The extensions array is rebuilt on every render, so depend on a stable
  // signature instead of the array identity to avoid an update loop.
  //
  // `accessToken` is part of the signature on purpose: extensions first paint
  // from cache with an empty token (`cache-and-network`), then the network
  // response fills in the real JWT. Without it the registry would keep the
  // cached empty token and open popups with an invalid JWT.
  const signature = extensions
    .map(
      ({ app, identifier, targetName, url, accessToken }) =>
        `${app.id}:${identifier ?? ""}:${targetName}:${url}:${accessToken}`,
    )
    .join("|");

  useEffect(() => {
    setRegistry(prev => ({ ...prev, [key]: extensions }));

    return () => {
      setRegistry(prev => {
        const next = { ...prev };

        delete next[key];

        return next;
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, signature, setRegistry]);
};

export const useRegisteredExtensions = (): PopupCandidate[] => {
  const registry = useAtomValue(registryAtom);

  return Object.values(registry).flat();
};
