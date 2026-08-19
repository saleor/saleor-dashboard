import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { ProductTypeKindEnum } from "@dashboard/graphql";
import { Box, Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { Gift, type LucideIcon, Package } from "lucide-react";
import { type KeyboardEvent, useRef } from "react";
import { useIntl } from "react-intl";

import { messages } from "./messages";
import styles from "./ProductTypeKindTiles.module.css";

interface ProductTypeKindTilesProps {
  value: ProductTypeKindEnum;
  disabled?: boolean;
  onChange: (kind: ProductTypeKindEnum) => void;
}

interface KindOption {
  value: ProductTypeKindEnum;
  title: string;
  description: string;
  icon: LucideIcon;
  testId: string;
}

const KindTile = ({
  checked,
  disabled,
  option,
  tileRef,
  onKeyDown,
  onSelect,
}: {
  checked: boolean;
  disabled?: boolean;
  option: KindOption;
  tileRef: (node: HTMLElement | null) => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  onSelect: (value: ProductTypeKindEnum) => void;
}): JSX.Element => {
  const Icon = option.icon;

  return (
    <Box
      as="button"
      type="button"
      role="radio"
      aria-checked={checked}
      disabled={disabled}
      tabIndex={checked ? 0 : -1}
      data-test-id={option.testId}
      className={clsx(styles.tile, checked && styles.tileChecked)}
      display="flex"
      flexDirection="column"
      gap={1}
      ref={tileRef}
      onKeyDown={onKeyDown}
      onClick={() => {
        if (!disabled) {
          onSelect(option.value);
        }
      }}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <Box
          color={disabled ? "defaultDisabled" : "default1"}
          display="flex"
          flexShrink="0"
          aria-hidden
        >
          <Icon size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
        </Box>
        <Text size={3} fontWeight="medium" color={disabled ? "defaultDisabled" : "default1"}>
          {option.title}
        </Text>
      </Box>
      <Text size={2} color={disabled ? "defaultDisabled" : "default2"} textAlign="left">
        {option.description}
      </Text>
    </Box>
  );
};

export const ProductTypeKindTiles = ({
  value,
  disabled,
  onChange,
}: ProductTypeKindTilesProps): JSX.Element => {
  const intl = useIntl();
  const tileRefs = useRef<Partial<Record<ProductTypeKindEnum, HTMLElement | null>>>({});
  const options: KindOption[] = [
    {
      value: ProductTypeKindEnum.NORMAL,
      title: intl.formatMessage(messages.optionNormalTitle),
      description: intl.formatMessage(messages.optionNormalDescription),
      icon: Package,
      testId: ProductTypeKindEnum.NORMAL,
    },
    {
      value: ProductTypeKindEnum.GIFT_CARD,
      title: intl.formatMessage(messages.optionGiftCardTitle),
      description: intl.formatMessage(messages.optionGiftCardDescription),
      icon: Gift,
      testId: ProductTypeKindEnum.GIFT_CARD,
    },
  ];

  const selectKind = (kind: ProductTypeKindEnum): void => {
    onChange(kind);
    tileRefs.current[kind]?.focus();
  };

  const handleTileKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    if (disabled) {
      return;
    }

    if (
      event.key !== "ArrowRight" &&
      event.key !== "ArrowDown" &&
      event.key !== "ArrowLeft" &&
      event.key !== "ArrowUp"
    ) {
      return;
    }

    event.preventDefault();

    const currentIndex = options.findIndex(option => option.value === value);
    const delta = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
    const nextIndex = (currentIndex + delta + options.length) % options.length;

    selectKind(options[nextIndex].value);
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Text size={3} fontWeight="medium">
        {intl.formatMessage(messages.kindLabel)}
      </Text>
      <Box
        role="radiogroup"
        aria-label={intl.formatMessage(messages.kindLabel)}
        className={styles.grid}
      >
        {options.map(option => (
          <KindTile
            key={option.value}
            option={option}
            checked={value === option.value}
            disabled={disabled}
            tileRef={node => {
              tileRefs.current[option.value] = node;
            }}
            onKeyDown={handleTileKeyDown}
            onSelect={selectKind}
          />
        ))}
      </Box>
    </Box>
  );
};
