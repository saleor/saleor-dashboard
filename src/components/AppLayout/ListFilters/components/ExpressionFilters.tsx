import { ConditionalFilters } from "@dashboard/components/ConditionalFilter/ConditionalFilters";
import { useConditionalFilterContext } from "@dashboard/components/ConditionalFilter/context/consumer";
import { conditionalFilterMessages } from "@dashboard/components/ConditionalFilter/messages";
import { CountPill, countPillFromNumber } from "@dashboard/components/CountPill/CountPill";
import { iconSize, iconStrokeWidth } from "@dashboard/components/icons";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { ChevronDown, ListFilter } from "lucide-react";
import { useIntl } from "react-intl";

import styles from "./ExpressionFilters.module.css";

const EXPRESSION_FILTERS_PANEL_ID = "expression-filters-panel";

export const ExpressionFilters = (): React.ReactNode => {
  const { formatMessage } = useIntl();
  const { valueProvider, containerState, filterWindow } = useConditionalFilterContext();
  const handleToggle = (): void => {
    if (filterWindow.isOpen) {
      containerState.resetToProvider();
      filterWindow.setOpen(false);

      return;
    }

    containerState.resetToProvider({ seedEmpty: true });
    filterWindow.setOpen(true);
  };

  return (
    <Button
      data-test-id="filters-button"
      data-state={filterWindow.isOpen ? "open" : "closed"}
      aria-expanded={filterWindow.isOpen}
      aria-controls={EXPRESSION_FILTERS_PANEL_ID}
      variant="secondary"
      gap={1.5}
      icon={<ListFilter size={iconSize.small} strokeWidth={iconStrokeWidth} />}
      onClick={handleToggle}
    >
      <Box as="span" display="inline-flex" alignItems="center" gap={1}>
        <Text as="span" size={3} fontWeight="regular">
          {formatMessage(conditionalFilterMessages.popoverTrigger)}
        </Text>
        <CountPill count={countPillFromNumber(valueProvider.count)} active />
      </Box>
      <ChevronDown
        className={clsx(styles.chevron, filterWindow.isOpen && styles.chevronOpen)}
        size={iconSize.small}
        strokeWidth={iconStrokeWidth}
        aria-hidden
      />
    </Button>
  );
};

export const ExpressionFilterPanel = (): JSX.Element | null => {
  const { containerState, filterWindow } = useConditionalFilterContext();

  if (!filterWindow.isOpen) {
    return null;
  }

  const collapse = (): void => {
    containerState.resetToProvider();
    filterWindow.setOpen(false);
  };

  return (
    <div className={styles.panel} id={EXPRESSION_FILTERS_PANEL_ID} data-test-id="filters-panel">
      <ConditionalFilters layout="panel" onClose={collapse} />
    </div>
  );
};
