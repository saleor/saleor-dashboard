import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { hasOneOfPermissions } from "@dashboard/components/RequirePermissions";
import { customerListUrlWithCustomerType } from "@dashboard/customers/urls";
import { PermissionEnum } from "@dashboard/graphql";
import { Box, Skeleton, Text, type TextProps, Tooltip } from "@saleor/macaw-ui-next";
import { UserRound } from "lucide-react";
import { useIntl } from "react-intl";
import { Link as RouterLink } from "react-router-dom";

import styles from "./CustomerType.module.css";
import { messages } from "./messages";

type CustomerTypeTextSize = NonNullable<TextProps["size"]>;

interface CustomerTypeLike {
  id?: string;
  name: string;
  slug?: string;
}

interface CustomerTypeProps {
  /**
   * The customer type to display. Pass `undefined` to render a skeleton placeholder while loading.
   */
  customerType: CustomerTypeLike | undefined;
  /**
   * Hide the leading customer type icon.
   * @default false
   */
  hideIcon?: boolean;
  /**
   * Macaw text size token used for the label.
   * @default 2
   */
  size?: CustomerTypeTextSize;
  /**
   * Macaw text color token used for the label.
   * @default "default2"
   */
  color?: TextProps["color"];
  /**
   * Optional override for the `data-test-id` attribute.
   * @default "customer-type-display"
   */
  "data-test-id"?: string;
  /**
   * Native hover tooltip for the customer type name.
   * @default customerType.name
   */
  title?: string;
}

const ICON_SIZE_BY_TEXT_SIZE: Record<CustomerTypeTextSize, number> = {
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

const CUSTOMER_LIST_PERMISSIONS = [
  PermissionEnum.MANAGE_USERS,
  PermissionEnum.MANAGE_ORDERS,
  PermissionEnum.MANAGE_STAFF,
];

export const CustomerTypeDisplay = ({
  customerType,
  hideIcon = false,
  size = 2,
  color = "default2",
  "data-test-id": dataTestId = "customer-type-display",
  title,
}: CustomerTypeProps): JSX.Element => {
  const intl = useIntl();

  if (!customerType) {
    return (
      <Box display="flex" alignItems="center" gap={1} data-test-id={dataTestId}>
        <Skeleton __width="6rem" __height="1rem" />
      </Box>
    );
  }

  const iconSize = ICON_SIZE_BY_TEXT_SIZE[size];
  const ariaLabel = `${intl.formatMessage(messages.customerTypeLabel)}: ${customerType.name}`;
  const nameTitle = title ?? customerType.name;

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
      {!hideIcon && <UserRound size={iconSize} aria-hidden="true" />}
      <span className={styles.name} title={nameTitle}>
        {customerType.name}
      </span>
    </Text>
  );
};

export const ClickableCustomerType = (props: CustomerTypeProps): JSX.Element => {
  const { customerType } = props;
  const intl = useIntl();
  const userPermissions = useUserPermissions();
  const canViewCustomers = hasOneOfPermissions(userPermissions ?? [], CUSTOMER_LIST_PERMISSIONS);

  if (!customerType?.id || !canViewCustomers) {
    return <CustomerTypeDisplay {...props} />;
  }

  const linkLabel = intl.formatMessage(messages.viewCustomersOfCustomerType, {
    customerTypeName: customerType.name,
  });

  if (!customerType.slug) {
    const unavailableTitle = intl.formatMessage(messages.customerTypeListFilterUnavailable);

    return (
      <Tooltip>
        <Tooltip.Trigger>
          <Box display="inline-flex" alignItems="center" __cursor="help">
            <CustomerTypeDisplay {...props} title={unavailableTitle} />
          </Box>
        </Tooltip.Trigger>
        <Tooltip.Content>
          <Tooltip.Arrow />
          <Box padding={2} __maxWidth="280px">
            <Text size={2}>{unavailableTitle}</Text>
          </Box>
        </Tooltip.Content>
      </Tooltip>
    );
  }

  return (
    <RouterLink
      to={customerListUrlWithCustomerType({
        id: customerType.id,
        name: customerType.name,
        slug: customerType.slug,
      })}
      className={styles.link}
      title={linkLabel}
      aria-label={linkLabel}
    >
      <CustomerTypeDisplay {...props} title={linkLabel} />
    </RouterLink>
  );
};
