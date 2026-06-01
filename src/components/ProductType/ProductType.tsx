import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { PermissionEnum } from "@dashboard/graphql";
import { productListUrlWithProductType } from "@dashboard/products/urls";
import { Box, Skeleton, Text, type TextProps, Tooltip } from "@saleor/macaw-ui-next";
import { Tag } from "lucide-react";
import { useIntl } from "react-intl";
import { Link as RouterLink } from "react-router-dom";

import { messages } from "./messages";
import styles from "./ProductType.module.css";

type ProductTypeTextSize = NonNullable<TextProps["size"]>;

interface ProductTypeLike {
  id?: string;
  name: string;
  slug?: string;
}

interface ProductTypeProps {
  /**
   * The product type to display. Pass `undefined` to render a skeleton placeholder while loading.
   */
  productType: ProductTypeLike | undefined;
  /**
   * Hide the leading product type icon.
   * @default false
   */
  hideIcon?: boolean;
  /**
   * Macaw text size token used for the label.
   * @default 2
   */
  size?: ProductTypeTextSize;
  /**
   * Macaw text color token used for the label.
   * @default "default2"
   */
  color?: TextProps["color"];
  /**
   * Optional override for the `data-test-id` attribute.
   * @default "product-type-display"
   */
  "data-test-id"?: string;
  /**
   * Native hover tooltip for the product type name.
   * @default productType.name
   */
  title?: string;
}

const ICON_SIZE_BY_TEXT_SIZE: Record<ProductTypeTextSize, number> = {
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

export const ProductTypeDisplay = ({
  productType,
  hideIcon = false,
  size = 2,
  color = "default2",
  "data-test-id": dataTestId = "product-type-display",
  title,
}: ProductTypeProps): JSX.Element => {
  const intl = useIntl();

  if (!productType) {
    return (
      <Box display="flex" alignItems="center" gap={1} data-test-id={dataTestId}>
        <Skeleton __width="6rem" __height="1rem" />
      </Box>
    );
  }

  const iconSize = ICON_SIZE_BY_TEXT_SIZE[size];
  const ariaLabel = `${intl.formatMessage(messages.productTypeLabel)}: ${productType.name}`;
  const nameTitle = title ?? productType.name;

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
      {!hideIcon && <Tag size={iconSize} aria-hidden="true" />}
      <span className={styles.name} title={nameTitle}>
        {productType.name}
      </span>
    </Text>
  );
};

export const ClickableProductType = (props: ProductTypeProps): JSX.Element => {
  const { productType } = props;
  const intl = useIntl();
  const userPermissions = useUserPermissions();
  const canViewProducts = hasPermissions(userPermissions ?? [], [PermissionEnum.MANAGE_PRODUCTS]);

  if (!productType?.id || !canViewProducts) {
    return <ProductTypeDisplay {...props} />;
  }

  const linkLabel = intl.formatMessage(messages.viewProductsOfProductType, {
    productTypeName: productType.name,
  });

  if (!productType.slug) {
    const unavailableTitle = intl.formatMessage(messages.productTypeListFilterUnavailable);

    return (
      <Tooltip>
        <Tooltip.Trigger>
          <Box display="inline-flex" alignItems="center" __cursor="help">
            <ProductTypeDisplay {...props} title={unavailableTitle} />
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
      to={productListUrlWithProductType({
        id: productType.id,
        name: productType.name,
        slug: productType.slug,
      })}
      className={styles.link}
      title={linkLabel}
      aria-label={linkLabel}
    >
      <ProductTypeDisplay {...props} title={linkLabel} />
    </RouterLink>
  );
};
