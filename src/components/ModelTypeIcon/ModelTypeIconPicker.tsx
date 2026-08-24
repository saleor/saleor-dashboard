import useDebounce from "@dashboard/hooks/useDebounce";
import { buttonMessages } from "@dashboard/intl";
import { useTheme } from "@dashboard/theme";
import { Box, Button, Input, Popover, Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";

import {
  FALLBACK_ICON_COLOR,
  MODEL_TYPE_ICON_COLOR_NAMES,
  type ModelTypeIcon as ModelTypeIconValue,
  type ModelTypeIconColor,
  resolveModelTypeIconHex,
} from "./constants";
import { FALLBACK_MODEL_TYPE_ICON } from "./getModelTypeIcon";
import { getLucideIconNames } from "./loadLucideIcon";
import { messages } from "./messages";
import { ModelTypeIcon } from "./ModelTypeIcon";
import styles from "./ModelTypeIconPicker.module.css";

/**
 * ponytail: results are capped rather than virtualised — every rendered tile triggers its own
 * lazy icon import, so an uncapped grid over ~1900 icons would fire that many requests. Swap in
 * windowing if merchants start asking to browse the full set.
 */
const MAX_RESULTS = 60;

interface ModelTypeIconPickerProps {
  value: ModelTypeIconValue | null;
  disabled?: boolean;
  onChange: (icon: ModelTypeIconValue | null) => void;
}

export const ModelTypeIconPicker = ({ value, disabled, onChange }: ModelTypeIconPickerProps) => {
  const intl = useIntl();
  const { theme } = useTheme();
  const isDark = theme === "defaultDark";
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [names, setNames] = useState<string[]>([]);
  const setDebounced = useDebounce(setDebouncedQuery, 200);

  // The name list is only worth fetching once the merchant actually opens the picker.
  useEffect(() => {
    if (!open || names.length > 0) {
      return;
    }

    let cancelled = false;

    getLucideIconNames().then(loaded => {
      if (!cancelled) {
        setNames(loaded);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [open, names.length]);

  const matches = useMemo(() => {
    const needle = debouncedQuery.trim().toLowerCase();
    const matching = needle ? names.filter(name => name.includes(needle)) : names;

    return { total: matching.length, visible: matching.slice(0, MAX_RESULTS) };
  }, [names, debouncedQuery]);

  const selectedColor = value?.color ?? FALLBACK_ICON_COLOR;
  const handleColorChange = (color: ModelTypeIconColor) => {
    // Colour is a modifier on the icon, so picking one before an icon starts from the fallback.
    onChange({ name: value?.name ?? FALLBACK_MODEL_TYPE_ICON.name, color });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Popover.Trigger>
        <button
          type="button"
          className={styles.trigger}
          disabled={disabled}
          aria-label={intl.formatMessage(messages.triggerLabel)}
          data-test-id="model-type-icon-trigger"
        >
          <ModelTypeIcon icon={value ?? FALLBACK_MODEL_TYPE_ICON} size={20} />
        </button>
      </Popover.Trigger>
      <Popover.Content align="start" onOpenAutoFocus={event => event.preventDefault()}>
        <Box
          padding={4}
          display="flex"
          flexDirection="column"
          gap={3}
          backgroundColor="default1"
          borderRadius={2}
          boxShadow="defaultModal"
          __width="320px"
        >
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Text size={3} fontWeight="bold">
              {intl.formatMessage(messages.title)}
            </Text>
            <Button
              variant="tertiary"
              size="small"
              disabled={!value}
              onClick={() => onChange(null)}
              data-test-id="model-type-icon-reset"
            >
              {intl.formatMessage(buttonMessages.reset)}
            </Button>
          </Box>

          <Box display="flex" gap={2}>
            {MODEL_TYPE_ICON_COLOR_NAMES.map(color => (
              <button
                key={color}
                type="button"
                className={clsx(styles.swatch, color === selectedColor && styles.swatchSelected)}
                style={{ backgroundColor: resolveModelTypeIconHex(color, isDark) }}
                aria-label={intl.formatMessage(messages.colorLabel, { color })}
                aria-pressed={color === selectedColor}
                onClick={() => handleColorChange(color)}
                data-test-id={`model-type-icon-color-${color}`}
              />
            ))}
          </Box>

          <Input
            value={query}
            size="small"
            placeholder={intl.formatMessage(messages.searchPlaceholder)}
            onChange={event => {
              setQuery(event.target.value);
              setDebounced(event.target.value);
            }}
            data-test-id="model-type-icon-search"
          />

          {matches.visible.length === 0 ? (
            <Text size={2} color="default2">
              {intl.formatMessage(messages.noResults, { query: debouncedQuery })}
            </Text>
          ) : (
            <Box className={styles.grid}>
              {matches.visible.map(name => (
                <button
                  key={name}
                  type="button"
                  title={name}
                  aria-label={name}
                  aria-pressed={name === value?.name}
                  className={clsx(
                    styles.iconButton,
                    name === value?.name && styles.iconButtonSelected,
                  )}
                  onClick={() => onChange({ name, color: selectedColor })}
                >
                  <ModelTypeIcon icon={{ name, color: selectedColor }} size={20} />
                </button>
              ))}
            </Box>
          )}

          {matches.total > matches.visible.length && (
            <Text size={1} color="default2">
              {intl.formatMessage(messages.moreResults, { count: matches.visible.length })}
            </Text>
          )}
        </Box>
      </Popover.Content>
    </Popover>
  );
};
