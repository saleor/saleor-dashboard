import {
  FALLBACK_ICON_COLOR,
  FALLBACK_ICON_NAME,
  MODEL_TYPE_ICON_COLOR_KEY,
  MODEL_TYPE_ICON_COLORS,
  MODEL_TYPE_ICON_NAME_KEY,
  type ModelTypeIcon,
  type ModelTypeIconColor,
} from "./constants";

interface MetadataEntry {
  key: string;
  value: string;
}

const readValue = (metadata: readonly MetadataEntry[] | null | undefined, key: string) =>
  metadata?.find(item => item.key === key)?.value?.trim() || undefined;

const isKnownColor = (value: string | undefined): value is ModelTypeIconColor =>
  !!value && value in MODEL_TYPE_ICON_COLORS;

/**
 * Returns null when the type has no icon configured. A colour without a name is inert — the
 * colour is a modifier on the icon, not an independent decoration.
 */
export const readModelTypeIcon = (
  metadata: readonly MetadataEntry[] | null | undefined,
): ModelTypeIcon | null => {
  const name = readValue(metadata, MODEL_TYPE_ICON_NAME_KEY);

  if (!name) {
    return null;
  }

  const color = readValue(metadata, MODEL_TYPE_ICON_COLOR_KEY);

  return { name, color: isKnownColor(color) ? color : FALLBACK_ICON_COLOR };
};

export const FALLBACK_MODEL_TYPE_ICON: ModelTypeIcon = {
  name: FALLBACK_ICON_NAME,
  color: FALLBACK_ICON_COLOR,
};

/** Never null — unconfigured types render the fallback so the icon slot stays a fixed width. */
export const getModelTypeIcon = (
  metadata: readonly MetadataEntry[] | null | undefined,
): ModelTypeIcon => readModelTypeIcon(metadata) ?? FALLBACK_MODEL_TYPE_ICON;

/**
 * `UpdateMetadata` carries both halves in one call, so setting and clearing an icon is a single
 * round trip. Clearing deletes the keys rather than blanking them, to keep the metadata editor
 * free of dead entries.
 */
export const buildModelTypeIconMetadataUpdate = (icon: ModelTypeIcon | null) =>
  icon
    ? {
        input: [
          { key: MODEL_TYPE_ICON_NAME_KEY, value: icon.name },
          { key: MODEL_TYPE_ICON_COLOR_KEY, value: icon.color },
        ],
        keysToDelete: [],
      }
    : {
        input: [],
        keysToDelete: [MODEL_TYPE_ICON_NAME_KEY, MODEL_TYPE_ICON_COLOR_KEY],
      };

export const isSameModelTypeIcon = (a: ModelTypeIcon | null, b: ModelTypeIcon | null): boolean =>
  a === b || (!!a && !!b && a.name === b.name && a.color === b.color);
