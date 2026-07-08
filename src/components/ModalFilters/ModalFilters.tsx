import {
  conditionalFilterMessages,
  ConditionalFilters,
  useConditionalFilterContext,
} from "@dashboard/components/ConditionalFilter";
import { iconSize, iconStrokeWidth } from "@dashboard/components/icons";
import { ModelTypeDisplay } from "@dashboard/components/ModelType/ModelType";
import { ProductTypeDisplay } from "@dashboard/components/ProductType/ProductType";
import { Box, Button, DropdownButton, Text } from "@saleor/macaw-ui-next";
import { X } from "lucide-react";
import { type FC } from "react";
import { useIntl } from "react-intl";

import {
  isItemOptionArray,
  type ItemOption,
} from "../ConditionalFilter/FilterElement/ConditionValue";
import {
  type FilterContainer,
  FilterElement,
} from "../ConditionalFilter/FilterElement/FilterElement";
import { getRestrictionFieldLabel } from "./getRestrictionFieldLabel";
import { messages } from "./messages";
import styles from "./ModalFilters.module.css";

const getLockedElements = (value: FilterContainer): FilterElement[] =>
  value.filter(
    (element): element is FilterElement =>
      FilterElement.isFilterElement(element) && Boolean(element.constraint?.isGlobal),
  );

const getLockedValueOptions = (element: FilterElement): ItemOption[] =>
  isItemOptionArray(element.condition.selected.value) ? element.condition.selected.value : [];

/** Renders a locked value with the canonical read-only type component so the
 * restriction hint matches how model/product types appear in detail page headers. */
const LockedValue = ({ field, option }: { field: string; option: ItemOption }): JSX.Element => {
  if (field === "pageTypes") {
    return <ModelTypeDisplay modelType={{ id: option.value, name: option.label }} />;
  }

  if (field === "productType") {
    return <ProductTypeDisplay productType={{ id: option.value, name: option.label }} />;
  }

  return (
    <Text size={2} color="default2" fontWeight="medium">
      {option.label}
    </Text>
  );
};

const LockedRestrictionHint = ({ elements }: { elements: FilterElement[] }): JSX.Element => {
  const { formatMessage } = useIntl();

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      {elements.map(element => {
        const options = getLockedValueOptions(element);

        return (
          <Box key={element.value.value} display="flex" alignItems="center" flexWrap="wrap" gap={1}>
            <Text size={2} color="default2">
              {formatMessage(messages.restrictedTo, {
                label: getRestrictionFieldLabel(
                  element.value.value,
                  formatMessage,
                  element.value.label,
                ),
              })}
            </Text>
            {options.map((option, index) => (
              <Box key={option.value} display="flex" alignItems="center">
                <LockedValue field={element.value.value} option={option} />
                {index < options.length - 1 && (
                  <Text size={2} color="default2">
                    ,
                  </Text>
                )}
              </Box>
            ))}
          </Box>
        );
      })}
    </Box>
  );
};

export const ModalFilters: FC = () => {
  const { formatMessage } = useIntl();
  const { valueProvider, containerState, filterWindow, leftOperandsProvider } =
    useConditionalFilterContext();

  const hasAddableFilters = leftOperandsProvider.operands.length > 0;
  const hasUserFilters = valueProvider.count > 0;
  const lockedElements = getLockedElements(valueProvider.value);
  const restrictionHint =
    lockedElements.length > 0 ? <LockedRestrictionHint elements={lockedElements} /> : null;

  // When every filter dimension is either locked by the reference attribute
  // restriction or excluded, the filter UI is a dead end: nothing can be added
  // and the pinned row cannot be edited. Replace it with a passive hint (or
  // nothing), unless user filters somehow exist and need to be clearable.
  if (!hasAddableFilters && !hasUserFilters) {
    return restrictionHint;
  }

  const clearEmpty = () => {
    containerState.clearEmpty();
  };

  const collapse = () => {
    filterWindow.setOpen(false);
  };

  const handleToggle = () => {
    if (filterWindow.isOpen) {
      clearEmpty();
    }

    filterWindow.setOpen(!filterWindow.isOpen);
  };

  const handleDismiss = () => {
    clearEmpty();
    collapse();
  };

  return (
    <Box display="flex" flexDirection="column" gap={3} width="100%">
      {restrictionHint}

      <DropdownButton
        className={styles.toggleButton}
        data-test-id="modal-filters-button"
        onClick={handleToggle}
      >
        {formatMessage(conditionalFilterMessages.popoverTrigger, {
          count: valueProvider.count,
        })}
      </DropdownButton>

      {filterWindow.isOpen ? (
        <Box
          className={styles.panel}
          borderWidth={1}
          borderStyle="solid"
          borderColor="default1"
          borderRadius={3}
          backgroundColor="default2"
          data-test-id="modal-filters-panel"
        >
          <Box
            className={styles.panelHeader}
            paddingTop={4}
            paddingX={4}
            paddingBottom={3}
            display="flex"
            gap={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Text size={3} fontWeight="bold">
              {formatMessage(conditionalFilterMessages.popoverTitle)}
            </Text>
            <Button
              data-test-id="modal-filters-close-button"
              icon={<X size={iconSize.small} strokeWidth={iconStrokeWidth} />}
              onClick={handleDismiss}
              size="small"
              type="button"
              variant="tertiary"
            />
          </Box>
          <Box className={styles.panelBody} paddingX={4} paddingBottom={4}>
            <ConditionalFilters layout="inline" onClose={collapse} />
          </Box>
        </Box>
      ) : null}
    </Box>
  );
};
