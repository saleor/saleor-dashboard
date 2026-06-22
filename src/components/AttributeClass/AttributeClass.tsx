import { attributeListUrlWithAttributeType } from "@dashboard/attributes/urls";
import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { AttributeTypeEnum, PermissionEnum } from "@dashboard/graphql";
import Attributes from "@dashboard/icons/Attributes";
import { ModelingIcon } from "@dashboard/icons/Modeling";
import { Box, Skeleton, Text, type TextProps } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";
import { Link as RouterLink } from "react-router-dom";

import styles from "./AttributeClass.module.css";
import { getAttributeClassLabel } from "./getAttributeClassLabel";
import { messages } from "./messages";

type AttributeClassTextSize = NonNullable<TextProps["size"]>;

interface AttributeClassProps {
  /**
   * The attribute class to display. Pass `undefined` to render a skeleton placeholder while loading.
   */
  attributeType: AttributeTypeEnum | undefined;
  /**
   * Hide the leading attribute class icon.
   * @default false
   */
  hideIcon?: boolean;
  /**
   * Macaw text size token used for the label.
   * @default 2
   */
  size?: AttributeClassTextSize;
  /**
   * Macaw text color token used for the label.
   * @default "default2"
   */
  color?: TextProps["color"];
  /**
   * Optional override for the `data-test-id` attribute.
   * @default "attribute-class-display"
   */
  "data-test-id"?: string;
  /**
   * Native hover tooltip for the attribute class name.
   */
  title?: string;
}

const ICON_SIZE_BY_TEXT_SIZE: Record<AttributeClassTextSize, number> = {
  1: 12,
  2: 14,
  3: 14,
  4: 16,
  5: 18,
  6: 20,
  7: 24,
  8: 28,
  9: 32,
  10: 36,
  11: 40,
};

const AttributeClassIcon = ({ attributeType }: { attributeType: AttributeTypeEnum }) => {
  if (attributeType === AttributeTypeEnum.PAGE_TYPE) {
    return <ModelingIcon />;
  }

  return <Attributes />;
};

export const AttributeClassDisplay = ({
  attributeType,
  hideIcon = false,
  size = 2,
  color = "default2",
  "data-test-id": dataTestId = "attribute-class-display",
  title,
}: AttributeClassProps): JSX.Element => {
  const intl = useIntl();

  if (!attributeType) {
    return (
      <Box display="flex" alignItems="center" gap={1} data-test-id={dataTestId}>
        <Skeleton __width="6rem" __height="1rem" />
      </Box>
    );
  }

  const label = getAttributeClassLabel(attributeType, intl);
  const iconSize = ICON_SIZE_BY_TEXT_SIZE[size];
  const ariaLabel = `${intl.formatMessage(messages.attributeClassLabel)}: ${label}`;
  const nameTitle = title ?? label;

  return (
    <Text
      size={size}
      color={color}
      fontWeight="medium"
      display="flex"
      alignItems="center"
      gap={1}
      data-test-id={dataTestId}
      aria-label={ariaLabel}
    >
      {!hideIcon && (
        <Box
          className={styles.icon}
          __width={`${iconSize}px`}
          __height={`${iconSize}px`}
          aria-hidden="true"
        >
          <AttributeClassIcon attributeType={attributeType} />
        </Box>
      )}
      <span className={styles.name} title={nameTitle}>
        {label}
      </span>
    </Text>
  );
};

export const ClickableAttributeClass = (props: AttributeClassProps): JSX.Element => {
  const { attributeType } = props;
  const intl = useIntl();
  const userPermissions = useUserPermissions();
  const canViewAttributes = hasPermissions(userPermissions ?? [], [
    PermissionEnum.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES,
  ]);

  if (!attributeType || !canViewAttributes) {
    return <AttributeClassDisplay {...props} />;
  }

  const attributeClassName = getAttributeClassLabel(attributeType, intl);
  const linkLabel = intl.formatMessage(messages.viewAttributesOfAttributeClass, {
    attributeClassName,
  });

  return (
    <RouterLink
      to={attributeListUrlWithAttributeType(attributeType)}
      className={styles.link}
      title={linkLabel}
      aria-label={linkLabel}
    >
      <AttributeClassDisplay {...props} title={linkLabel} />
    </RouterLink>
  );
};
