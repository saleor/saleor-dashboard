import { messages as attributeClassMessages } from "@dashboard/components/AttributeClass/messages";
import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { AttributeTypeEnum } from "@dashboard/graphql";
import { type FormChange } from "@dashboard/hooks/useForm";
import { Box, Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { FileText, type LucideIcon, Tag } from "lucide-react";
import { type KeyboardEvent, useRef } from "react";
import { useIntl } from "react-intl";

import { type AttributePageFormData } from "../AttributePage";
import styles from "./AttributeOrganization.module.css";
import { messages } from "./messages";

interface AttributeOrganizationProps {
  data: AttributePageFormData;
  disabled: boolean;
  onChange: FormChange;
}

interface ClassOption {
  value: AttributeTypeEnum;
  title: string;
  description: string;
  icon: LucideIcon;
  testId: string;
}

const ClassTile = ({
  checked,
  disabled,
  option,
  tileRef,
  onKeyDown,
  onSelect,
}: {
  checked: boolean;
  disabled?: boolean;
  option: ClassOption;
  tileRef: (node: HTMLElement | null) => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  onSelect: (value: AttributeTypeEnum) => void;
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

const AttributeOrganization = ({
  data,
  disabled,
  onChange,
}: AttributeOrganizationProps): JSX.Element => {
  const intl = useIntl();
  const tileRefs = useRef<Partial<Record<AttributeTypeEnum, HTMLElement | null>>>({});
  const value = data.type ?? AttributeTypeEnum.PRODUCT_TYPE;
  const options: ClassOption[] = [
    {
      value: AttributeTypeEnum.PRODUCT_TYPE,
      title: intl.formatMessage(attributeClassMessages.productAttribute),
      description: intl.formatMessage(messages.productDescription),
      icon: Tag,
      testId: AttributeTypeEnum.PRODUCT_TYPE,
    },
    {
      value: AttributeTypeEnum.PAGE_TYPE,
      title: intl.formatMessage(attributeClassMessages.modelAttribute),
      description: intl.formatMessage(messages.modelDescription),
      icon: FileText,
      testId: AttributeTypeEnum.PAGE_TYPE,
    },
  ];

  const selectClass = (next: AttributeTypeEnum): void => {
    onChange({ target: { name: "type", value: next } });
    tileRefs.current[next]?.focus();
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

    selectClass(options[nextIndex].value);
  };

  return (
    <DetailSettingsCard
      title={intl.formatMessage(messages.title)}
      intro={
        <Text size={3} color="default2">
          {intl.formatMessage(messages.intro)}
        </Text>
      }
      data-test-id="attribute-organization"
    >
      <Box
        role="radiogroup"
        aria-label={intl.formatMessage(messages.intro)}
        className={styles.grid}
      >
        {options.map(option => (
          <ClassTile
            key={option.value}
            option={option}
            checked={value === option.value}
            disabled={disabled}
            tileRef={node => {
              tileRefs.current[option.value] = node;
            }}
            onKeyDown={handleTileKeyDown}
            onSelect={selectClass}
          />
        ))}
      </Box>
    </DetailSettingsCard>
  );
};

AttributeOrganization.displayName = "AttributeOrganization";
export default AttributeOrganization;
