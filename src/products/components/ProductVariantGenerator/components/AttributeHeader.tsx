import { Button, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { messages } from "../messages";
import styles from "./AttributeHeader.module.css";

interface AttributeHeaderProps {
  name: string | null;
  allSelected: boolean;
  noneSelected: boolean;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export const AttributeHeader = ({
  name,
  allSelected,
  noneSelected,
  onSelectAll,
  onDeselectAll,
}: AttributeHeaderProps) => {
  const intl = useIntl();

  return (
    <div className={styles.header}>
      <Text size={3} fontWeight="medium">
        {name}
      </Text>
      <div className={styles.actions}>
        <Button variant="tertiary" size="small" onClick={onSelectAll} disabled={allSelected}>
          {intl.formatMessage(messages.selectAll)}
        </Button>
        <Button variant="tertiary" size="small" onClick={onDeselectAll} disabled={noneSelected}>
          {intl.formatMessage(messages.selectNone)}
        </Button>
      </div>
    </div>
  );
};
