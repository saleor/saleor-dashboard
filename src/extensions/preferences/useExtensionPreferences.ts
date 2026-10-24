import { useUser } from "@dashboard/auth/useUser";
import { useAnalytics } from "@dashboard/components/ProductAnalytics/useAnalytics";
import { type MetadataInput, useUpdateExtensionPreferencesMutation } from "@dashboard/graphql";
import { useCallback, useRef, useState } from "react";

import { EXTENSION_PREFERENCES_METADATA_KEY } from "./constants";
import {
  parseExtensionPreferences,
  serializeExtensionPreferences,
  setPreferenceInMap,
} from "./extensionPreferencesMetadata";
import { getExtensionPreferenceKey } from "./getExtensionPreferenceKey";
import { type PreferenceKeyInput, type ResolvedPreferenceState } from "./types";

type ExtensionPreferenceSurface = "account_settings" | "entity_page" | "home";

interface AnalyticsPreferenceKeyInput extends PreferenceKeyInput {
  isSaleorOfficial?: boolean;
  mountName?: string;
}

interface ExtensionPreferenceAnalyticsProperties {
  action: "hide" | "pin" | "show" | "unpin";
  extension_origin: "saleor" | "third_party" | "unknown";
  mount: string;
  surface: ExtensionPreferenceSurface;
}

interface UseExtensionPreferences {
  getState: (extension: PreferenceKeyInput) => ResolvedPreferenceState;
  setState: (extension: AnalyticsPreferenceKeyInput, next: ResolvedPreferenceState) => void;
  isSaving: boolean;
}

export const useExtensionPreferences = (
  surface: ExtensionPreferenceSurface = "entity_page",
): UseExtensionPreferences => {
  const { user } = useUser();
  const { trackEvent } = useAnalytics();
  const [updatePreferences] = useUpdateExtensionPreferencesMutation();
  const [revision, setRevision] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const parsedFromUser = parseExtensionPreferences(
    user?.metadata.find(metadata => metadata.key === EXTENSION_PREFERENCES_METADATA_KEY)?.value,
  );
  const preferencesRef = useRef(parsedFromUser);
  const inFlightRef = useRef(false);
  const queuedRef = useRef(false);
  const pendingAnalyticsEventsRef = useRef<ExtensionPreferenceAnalyticsProperties[]>([]);

  // Server/optimistic `user` is source of truth only when no write is in flight.
  // Otherwise keep the stacked local map so a slower mutation cannot clobber it.
  if (!inFlightRef.current && !queuedRef.current) {
    preferencesRef.current = parsedFromUser;
  }

  const flushPreferences = useCallback(async (): Promise<void> => {
    const userId = user?.id;

    if (!userId || inFlightRef.current) {
      if (userId) {
        queuedRef.current = true;
      }

      return;
    }

    inFlightRef.current = true;
    setIsSaving(true);

    try {
      do {
        queuedRef.current = false;

        const nextMap = preferencesRef.current;
        const nextValue = serializeExtensionPreferences(nextMap);
        const analyticsEvents = pendingAnalyticsEventsRef.current;

        pendingAnalyticsEventsRef.current = [];

        const metadataInput: MetadataInput = {
          key: EXTENSION_PREFERENCES_METADATA_KEY,
          value: nextValue,
        };
        const otherMetadata: Array<{ __typename: "MetadataItem"; key: string; value: string }> = (
          user?.metadata ?? []
        )
          .filter(item => item.key !== EXTENSION_PREFERENCES_METADATA_KEY)
          .map(item => ({ __typename: "MetadataItem", key: item.key, value: item.value }));

        try {
          const result = await updatePreferences({
            variables: { input: { metadata: [metadataInput] } },
            optimisticResponse: {
              __typename: "Mutation",
              accountUpdate: {
                __typename: "AccountUpdate",
                errors: [],
                user: {
                  __typename: "User",
                  id: userId,
                  metadata: [
                    ...otherMetadata,
                    { __typename: "MetadataItem", key: metadataInput.key, value: nextValue },
                  ],
                },
              },
            },
          });
          const payload = result.data?.accountUpdate;
          const analyticsResult =
            payload && !result.errors?.length && payload.errors.length === 0 ? "success" : "error";

          analyticsEvents.forEach(properties =>
            trackEvent("extension_preference_changed", {
              ...properties,
              result: analyticsResult,
            }),
          );
        } catch (error) {
          analyticsEvents.forEach(properties =>
            trackEvent("extension_preference_changed", {
              ...properties,
              result: "error",
            }),
          );
          throw error;
        }
      } while (queuedRef.current);
    } finally {
      inFlightRef.current = false;
      setIsSaving(false);
    }
  }, [trackEvent, updatePreferences, user]);

  const getState = (extension: PreferenceKeyInput): ResolvedPreferenceState => {
    void revision;

    return preferencesRef.current[getExtensionPreferenceKey(extension)] ?? "default";
  };

  const setState = useCallback(
    (extension: AnalyticsPreferenceKeyInput, next: ResolvedPreferenceState) => {
      if (!user?.id) {
        return;
      }

      const key = getExtensionPreferenceKey(extension);
      const current = preferencesRef.current[key] ?? "default";
      const action =
        next === "pinned"
          ? "pin"
          : next === "hidden"
            ? "hide"
            : current === "pinned"
              ? "unpin"
              : "show";

      preferencesRef.current = setPreferenceInMap(preferencesRef.current, key, next);
      pendingAnalyticsEventsRef.current.push({
        action,
        extension_origin:
          extension.isSaleorOfficial === undefined
            ? "unknown"
            : extension.isSaleorOfficial
              ? "saleor"
              : "third_party",
        mount: extension.mountName ?? "unknown",
        surface,
      });
      setRevision(value => value + 1);
      void flushPreferences();
    },
    [flushPreferences, surface, user?.id],
  );

  return { getState, setState, isSaving };
};
