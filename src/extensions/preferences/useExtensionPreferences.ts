import { useUser } from "@dashboard/auth/useUser";
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

interface UseExtensionPreferences {
  getState: (extension: PreferenceKeyInput) => ResolvedPreferenceState;
  setState: (extension: PreferenceKeyInput, next: ResolvedPreferenceState) => void;
  isSaving: boolean;
}

export const useExtensionPreferences = (): UseExtensionPreferences => {
  const { user } = useUser();
  const [updatePreferences] = useUpdateExtensionPreferencesMutation();
  const [revision, setRevision] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const parsedFromUser = parseExtensionPreferences(
    user?.metadata.find(metadata => metadata.key === EXTENSION_PREFERENCES_METADATA_KEY)?.value,
  );
  const preferencesRef = useRef(parsedFromUser);
  const inFlightRef = useRef(false);
  const queuedRef = useRef(false);

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
        const metadataInput: MetadataInput = {
          key: EXTENSION_PREFERENCES_METADATA_KEY,
          value: nextValue,
        };
        const otherMetadata: Array<{ __typename: "MetadataItem"; key: string; value: string }> = (
          user?.metadata ?? []
        )
          .filter(item => item.key !== EXTENSION_PREFERENCES_METADATA_KEY)
          .map(item => ({ __typename: "MetadataItem", key: item.key, value: item.value }));

        await updatePreferences({
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
      } while (queuedRef.current);
    } finally {
      inFlightRef.current = false;
      setIsSaving(false);
    }
  }, [updatePreferences, user]);

  const getState = (extension: PreferenceKeyInput): ResolvedPreferenceState => {
    void revision;

    return preferencesRef.current[getExtensionPreferenceKey(extension)] ?? "default";
  };

  const setState = useCallback(
    (extension: PreferenceKeyInput, next: ResolvedPreferenceState) => {
      if (!user?.id) {
        return;
      }

      const key = getExtensionPreferenceKey(extension);

      preferencesRef.current = setPreferenceInMap(preferencesRef.current, key, next);
      setRevision(value => value + 1);
      void flushPreferences();
    },
    [flushPreferences, user?.id],
  );

  return { getState, setState, isSaving };
};
