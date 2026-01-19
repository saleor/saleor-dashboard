import { Box, Input, Text } from "@saleor/macaw-ui-next";
import { useCallback } from "react";
import { useIntl } from "react-intl";

import { messages } from "../messages";
import { GeneratorDefaults } from "../types";
import styles from "./DefaultsSection.module.css";

interface DefaultsSectionProps {
  defaults: GeneratorDefaults;
  onChange: (defaults: GeneratorDefaults) => void;
}

export const DefaultsSection = ({ defaults, onChange }: DefaultsSectionProps) => {
  const intl = useIntl();

  const handleStockChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({
        ...defaults,
        stockQuantity: e.target.value,
      });
    },
    [defaults, onChange],
  );

  return (
    <Box className={styles.container}>
      <Box className={styles.field}>
        <Text size={2} color="default2">
          {intl.formatMessage(messages.initialStock)}
        </Text>
        <Input
          type="number"
          value={defaults.stockQuantity}
          onChange={handleStockChange}
          min={0}
          size="small"
          __width="70px"
        />
      </Box>
    </Box>
  );
};
