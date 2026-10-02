import { Box, Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { type KeyboardEvent, useRef } from "react";
import { defineMessages, useIntl } from "react-intl";

import styles from "./AttributeBooleanControl.module.css";

const messages = defineMessages({
  yes: {
    id: "Vt7ZNF",
    defaultMessage: "Yes",
    description: "boolean attribute value",
  },
  no: {
    id: "0J0FPi",
    defaultMessage: "No",
    description: "boolean attribute value",
  },
  notSet: {
    id: "7AT1Ye",
    defaultMessage: "Not set",
    description: "boolean attribute has no value",
  },
  required: {
    id: "W+9IrM",
    defaultMessage: "Required",
    description: "boolean attribute must be yes or no",
  },
});

type BooleanOption = "yes" | "no" | "unset";

const toOption = (value: boolean | null | undefined): BooleanOption => {
  if (value === true) {
    return "yes";
  }

  if (value === false) {
    return "no";
  }

  return "unset";
};

const toValue = (option: BooleanOption): boolean | undefined => {
  if (option === "yes") {
    return true;
  }

  if (option === "no") {
    return false;
  }

  return undefined;
};

interface AttributeBooleanControlProps {
  name: string;
  label: string;
  value: boolean | null | undefined;
  required?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  onChange: (value: boolean | undefined) => void;
}

export const AttributeBooleanControl = ({
  name,
  label,
  value,
  required = false,
  invalid = false,
  disabled = false,
  onChange,
}: AttributeBooleanControlProps): React.ReactNode => {
  const intl = useIntl();
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selected = toOption(value);
  const options: BooleanOption[] = required ? ["yes", "no"] : ["yes", "no", "unset"];
  const selectedIndex = options.indexOf(selected);
  const showRequired = required && selectedIndex === -1;

  const labels: Record<BooleanOption, string> = {
    yes: intl.formatMessage(messages.yes),
    no: intl.formatMessage(messages.no),
    unset: intl.formatMessage(messages.notSet),
  };

  const selectAt = (index: number) => {
    const option = options[index];

    if (!option) {
      return;
    }

    onChange(toValue(option));
    optionRefs.current[index]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) {
      return;
    }

    const current = selectedIndex === -1 ? 0 : selectedIndex;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      selectAt((current + 1) % options.length);

      return;
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      selectAt((current - 1 + options.length) % options.length);

      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      selectAt(0);

      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      selectAt(options.length - 1);
    }
  };

  return (
    <Box className={styles.row}>
      <div
        role="radiogroup"
        aria-label={label}
        aria-required={required || undefined}
        aria-invalid={invalid || undefined}
        className={clsx(styles.track, invalid && styles.trackInvalid)}
        onKeyDown={onKeyDown}
      >
        {options.map((option, index) => {
          const isSelected = option === selected;
          const tabIndex = isSelected || (selectedIndex === -1 && index === 0) ? 0 : -1;

          return (
            <button
              key={option}
              ref={element => {
                optionRefs.current[index] = element;
              }}
              type="button"
              role="radio"
              name={name}
              className={clsx(styles.segment, {
                [styles.segmentActive]: isSelected && option === "unset",
                [styles.segmentActivePrimary]: isSelected && option !== "unset",
              })}
              aria-checked={isSelected}
              aria-invalid={invalid}
              tabIndex={tabIndex}
              disabled={disabled}
              onClick={() => onChange(toValue(option))}
            >
              {labels[option]}
            </button>
          );
        })}
      </div>
      {showRequired ? (
        <Text size={2} color="critical1">
          {intl.formatMessage(messages.required)}
        </Text>
      ) : null}
    </Box>
  );
};
