// DEV-ONLY-PERMISSION-OVERRIDE: see ./store.ts header for removal instructions.
import { type PermissionEnum } from "@dashboard/graphql";
import { Box, Button, Input, Text } from "@saleor/macaw-ui-next";
import { useEffect, useState } from "react";

import { ALL_SALEOR_PERMISSIONS } from "./allPermissions";
import styles from "./DevPermissionOverride.module.css";
import { type PermissionPreset } from "./permissionPresetStore";
import { usePermissionPresets } from "./usePermissionPresets";

interface SavedPresetPillProps {
  onApply: (permissions: PermissionEnum[]) => void;
  onRemove: (hash: string) => void;
  preset: PermissionPreset;
}

const SavedPresetPill = ({ onApply, onRemove, preset }: SavedPresetPillProps): JSX.Element => (
  <span className={styles.savedPresetPill}>
    <button
      type="button"
      className={styles.savedPresetApply}
      onClick={() => onApply(preset.permissions)}
    >
      {preset.name} ({preset.permissions.length})
    </button>
    <button
      type="button"
      className={styles.savedPresetRemove}
      aria-label={`Delete preset ${preset.name}`}
      onClick={() => onRemove(preset.hash)}
    >
      ×
    </button>
  </span>
);

const BUILT_IN_PRESETS: Array<{ id: string; label: string; permissions: PermissionEnum[] }> = [
  { id: "all", label: "All", permissions: ALL_SALEOR_PERMISSIONS },
  { id: "none", label: "None", permissions: [] },
];

interface DevPermissionPresetsProps {
  onApply: (permissions: PermissionEnum[]) => void;
  realPermissionCodes: PermissionEnum[];
  selectedPermissions: PermissionEnum[] | null;
}

export const DevPermissionPresets = ({
  onApply,
  realPermissionCodes,
  selectedPermissions,
}: DevPermissionPresetsProps): JSX.Element => {
  const { findPresetByPermissions, presets, removePreset, savePreset } = usePermissionPresets();
  const [presetName, setPresetName] = useState("");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaveFormOpen, setIsSaveFormOpen] = useState(false);
  const [matchingPresetName, setMatchingPresetName] = useState<string | null>(null);

  const canSave = selectedPermissions !== null;
  const canSaveSelection = canSave && matchingPresetName === null;

  useEffect(
    function syncMatchingPresetName() {
      if (!canSave || !selectedPermissions) {
        return;
      }

      let cancelled = false;

      void findPresetByPermissions(selectedPermissions).then(existing => {
        if (!cancelled) {
          setMatchingPresetName(existing?.name ?? null);
        }
      });

      return () => {
        cancelled = true;
      };
    },
    [canSave, findPresetByPermissions, selectedPermissions],
  );

  const showSaveForm = canSave && isSaveFormOpen;
  const displayMatchingPresetName = canSave ? matchingPresetName : null;

  const handleSavePreset = async (): Promise<void> => {
    if (!selectedPermissions) {
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    const result = await savePreset(presetName, selectedPermissions);

    if (result.status === "saved") {
      setPresetName("");
      setSaveMessage(null);
      setIsSaveFormOpen(false);
      setMatchingPresetName(presetName.trim());
    } else if (result.status === "duplicate") {
      setSaveMessage(`Already saved as "${result.name}".`);
    } else {
      setSaveMessage("Enter a preset name.");
    }

    setIsSaving(false);
  };

  const closeSaveForm = (): void => {
    setIsSaveFormOpen(false);
    setPresetName("");
    setSaveMessage(null);
  };

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <Text size={1} color="default2" fontWeight="medium">
        Presets
      </Text>
      <Box display="flex" flexWrap="wrap" gap={1} alignItems="center">
        <Button size="small" variant="secondary" onClick={() => onApply(realPermissionCodes)}>
          Real user ({realPermissionCodes.length})
        </Button>
        {BUILT_IN_PRESETS.map(preset => (
          <Button
            key={preset.id}
            size="small"
            variant="secondary"
            onClick={() => onApply(preset.permissions)}
          >
            {preset.label}
          </Button>
        ))}
        {presets.map(preset => (
          <SavedPresetPill
            key={preset.hash}
            preset={preset}
            onApply={onApply}
            onRemove={removePreset}
          />
        ))}
        <Button
          size="small"
          variant="tertiary"
          disabled={!canSaveSelection || showSaveForm}
          onClick={() => setIsSaveFormOpen(true)}
        >
          Save selected
        </Button>
      </Box>
      {!canSave && (
        <Text size={1} color="default2">
          Select permissions first to save a preset.
        </Text>
      )}
      {displayMatchingPresetName && (
        <Text size={1} color="default2">
          Matches saved preset &quot;{displayMatchingPresetName}&quot;.
        </Text>
      )}
      {showSaveForm && (
        <Box display="flex" flexDirection="column" gap={1}>
          <Input
            size="small"
            placeholder="Preset name…"
            value={presetName}
            disabled={isSaving}
            autoFocus
            onChange={event => {
              setPresetName(event.target.value);
              setSaveMessage(null);
            }}
          />
          <Box display="flex" flexWrap="wrap" gap={1} alignItems="center">
            <Button
              size="small"
              variant="secondary"
              disabled={isSaving || !presetName.trim()}
              onClick={() => void handleSavePreset()}
            >
              {isSaving ? "Saving…" : "Save preset"}
            </Button>
            <Button size="small" variant="tertiary" disabled={isSaving} onClick={closeSaveForm}>
              Cancel
            </Button>
            {saveMessage && (
              <Text size={1} color="critical1">
                {saveMessage}
              </Text>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};
