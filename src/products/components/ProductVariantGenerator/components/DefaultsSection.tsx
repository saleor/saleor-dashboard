import { Box, Checkbox, Input, Text } from "@saleor/macaw-ui-next";
import { useCallback } from "react";
import { useIntl } from "react-intl";

import { messages } from "../messages";
import { GeneratorDefaults } from "../types";
import styles from "./DefaultsSection.module.css";

interface DefaultsSectionProps {
  defaults: GeneratorDefaults;
  onChange: (defaults: GeneratorDefaults) => void;
  skuPreviewExample?: string;
}

export const DefaultsSection = ({
  defaults,
  onChange,
  skuPreviewExample,
}: DefaultsSectionProps) => {
  const intl = useIntl();

  const handleSkuEnabledChange = useCallback(
    (checked: boolean) => {
      onChange({ ...defaults, skuEnabled: checked });
    },
    [defaults, onChange],
  );

  const handleSkuPrefixChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...defaults, skuPrefix: e.target.value });
    },
    [defaults, onChange],
  );

  const handleStockEnabledChange = useCallback(
    (checked: boolean) => {
      onChange({ ...defaults, stockEnabled: checked });
    },
    [defaults, onChange],
  );

  const handleStockChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...defaults, stockQuantity: e.target.value });
    },
    [defaults, onChange],
  );

  return (
    <Box className={styles.container}>
      {/* SKU row */}
      <Box className={styles.row}>
        <Box
          as="label"
          className={styles.checkboxLabel}
          cursor="pointer"
          display="flex"
          alignItems="center"
          gap={2}
        >
          <Checkbox
            checked={defaults.skuEnabled}
            onCheckedChange={handleSkuEnabledChange}
            name="skuEnabled"
          />
          <Text size={2} color={defaults.skuEnabled ? "default1" : "default2"}>
            {intl.formatMessage(messages.skuPrefix)}
          </Text>
        </Box>
        <Box className={styles.inputWithPreview}>
          <Input
            type="text"
            value={defaults.skuPrefix}
            onChange={handleSkuPrefixChange}
            disabled={!defaults.skuEnabled}
            size="small"
            __width="120px"
            placeholder="TSHIRT"
          />
          {defaults.skuEnabled && skuPreviewExample && (
            <Text size={1} color="default2">
              {intl.formatMessage(messages.skuPreview, { example: skuPreviewExample })}
            </Text>
          )}
        </Box>
      </Box>

      {/* Stock row */}
      <Box className={styles.row}>
        <Box
          as="label"
          className={styles.checkboxLabel}
          cursor="pointer"
          display="flex"
          alignItems="center"
          gap={2}
        >
          <Checkbox
            checked={defaults.stockEnabled}
            onCheckedChange={handleStockEnabledChange}
            name="stockEnabled"
          />
          <Text size={2} color={defaults.stockEnabled ? "default1" : "default2"}>
            {intl.formatMessage(messages.initialStock)}
          </Text>
        </Box>
        <Input
          type="number"
          value={defaults.stockQuantity}
          onChange={handleStockChange}
          disabled={!defaults.stockEnabled}
          min={0}
          size="small"
          __width="80px"
        />
      </Box>
    </Box>
  );
};
