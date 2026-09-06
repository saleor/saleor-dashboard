import { type IconNode } from "@dashboard/components/AttributeInputTypeIcon/iconNodeToSvg";
import { type LucideIcon } from "lucide-react";

interface LoadedLucideIcon {
  Component: LucideIcon;
  iconNode: IconNode;
}

type DynamicIconImports = Record<
  string,
  () => Promise<{ default: LucideIcon; __iconNode: IconNode }>
>;

/**
 * The name-to-import map is ~1900 entries, so it is fetched lazily rather than shipped in the
 * main bundle. Every consumer already renders a fallback icon while a name resolves, so the
 * extra hop costs nothing visually.
 */
let importsPromise: Promise<DynamicIconImports> | null = null;

const getDynamicIconImports = (): Promise<DynamicIconImports> => {
  if (!importsPromise) {
    importsPromise = import("lucide-react/dynamicIconImports")
      .then(module => module.default as unknown as DynamicIconImports)
      .catch(() => ({}));
  }

  return importsPromise;
};

const cache = new Map<string, LoadedLucideIcon>();
const pending = new Map<string, Promise<LoadedLucideIcon | null>>();

/** Synchronous lookup for the datagrid, which paints on canvas and cannot await. */
export const getLoadedLucideIcon = (name: string): LoadedLucideIcon | undefined => cache.get(name);

export const loadLucideIcon = (name: string): Promise<LoadedLucideIcon | null> => {
  const cached = cache.get(name);

  if (cached) {
    return Promise.resolve(cached);
  }

  const inFlight = pending.get(name);

  if (inFlight) {
    return inFlight;
  }

  const request = getDynamicIconImports()
    .then(async imports => {
      const importIcon = imports[name];

      if (!importIcon) {
        return null;
      }

      const module = await importIcon();
      const loaded: LoadedLucideIcon = {
        Component: module.default,
        iconNode: module.__iconNode,
      };

      cache.set(name, loaded);

      return loaded;
    })
    // A renamed or hand-typed icon name must not break the view it is rendered in.
    .catch(() => null)
    .finally(() => {
      pending.delete(name);
    });

  pending.set(name, request);

  return request;
};

/** Resolves once every requested icon is in the cache, so canvas consumers can paint in one pass. */
export const preloadLucideIcons = async (names: readonly string[]): Promise<void> => {
  await Promise.all([...new Set(names)].map(loadLucideIcon));
};

export const getLucideIconNames = async (): Promise<string[]> =>
  Object.keys(await getDynamicIconImports());
