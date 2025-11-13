import { Box, Input } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { useIntl } from "react-intl";

import { useConditionalFilterContext } from "../context";
import { QueryApiType } from "../FiltersQueryBuilder/types";
import { metadataInputMessages } from "../intl";
import { FilterEventEmitter } from "./EventEmitter";
import styles from "./MetadataInput.module.css";
import { DoubleTextOperator } from "./types";

interface MetadataInputProps {
  index: number;
  selected: DoubleTextOperator;
  emitter: FilterEventEmitter;
  error: boolean;
  disabled: boolean;
}

export const MetadataInput = ({
  index,
  selected,
  emitter,
  error,
  disabled,
}: MetadataInputProps) => {
  const intl = useIntl();
  const { queryApiType } = useConditionalFilterContext();

  const keyValue = selected.value[0] || "";
  const valueInput = selected.value[1] || "";

  const supportsOptionalValue = queryApiType === QueryApiType.WHERE;

  // Initialize hasKeyBlurred to true if there's already a key present
  // when reopening filters (only for WHERE API)
  const [hasKeyBlurred, setHasKeyBlurred] = useState(() =>
    supportsOptionalValue ? Boolean(keyValue) : false,
  );

  const hasKey = Boolean(keyValue);
  const hasValue = Boolean(valueInput);

  const handleKeyChange = (newKey: string) => {
    emitter.changeRightOperator(index, [newKey, valueInput]);

    if (!newKey) {
      setHasKeyBlurred(false);
    }
  };

  const handleKeyBlur = () => {
    emitter.blurRightOperator(index);

    // Only set hasKeyBlurred for WHERE API
    if (supportsOptionalValue && hasKey) {
      setHasKeyBlurred(true);
    }
  };

  const handleValueChange = (newValue: string) => {
    emitter.changeRightOperator(index, [keyValue, newValue]);
  };

  const getValuePlaceholder = () => {
    // For WHERE API: Show "No value" when user intentionally leaves it empty after entering key
    // -> this is because we make query for checking `key` existence only.
    // For FILTER API: Always show "Value" (requires both key and value)
    const shouldShowNoValue = supportsOptionalValue && hasKey && !hasValue && hasKeyBlurred;

    return intl.formatMessage(
      shouldShowNoValue
        ? metadataInputMessages.noValuePlaceholder
        : metadataInputMessages.valuePlaceholder,
    );
  };

  const getValueClassName = () => {
    if (hasValue) {
      return undefined;
    }

    // Only show italic "No value" for WHERE API
    const shouldShowNoValue = supportsOptionalValue && hasKey && hasKeyBlurred;

    return shouldShowNoValue ? styles.visiblePlaceholderItalic : styles.visiblePlaceholder;
  };

  return (
    <Box
      display="flex"
      className="conditional-metadata"
      borderWidth={1}
      borderStyle="solid"
      borderColor={{
        default: "default1",
        focusWithin: "accent1",
      }}
      borderRadius={3}
    >
      <Input
        data-test-id={`right-${index}-1`}
        value={keyValue}
        onChange={e => handleKeyChange(e.target.value)}
        onFocus={() => emitter.focusRightOperator(index)}
        onBlur={handleKeyBlur}
        error={error}
        placeholder={intl.formatMessage(metadataInputMessages.keyPlaceholder)}
        disabled={disabled}
        className={styles.visiblePlaceholder}
      />
      <Box borderLeftStyle="solid" borderLeftWidth={1} borderColor="default1" />
      <Input
        data-test-id={`right-${index}-2`}
        value={valueInput}
        onChange={e => handleValueChange(e.target.value)}
        onFocus={() => emitter.focusRightOperator(index)}
        onBlur={() => emitter.blurRightOperator(index)}
        error={error}
        placeholder={getValuePlaceholder()}
        disabled={disabled}
        className={getValueClassName()}
      />
    </Box>
  );
};
