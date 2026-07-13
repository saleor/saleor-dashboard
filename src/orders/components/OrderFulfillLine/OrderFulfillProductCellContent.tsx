import { useOverflowDetection } from "@dashboard/hooks/useOverflowDetection/useOverflowDetection";
import { Box, Text, Tooltip } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";

import styles from "./OrderFulfillProductCellContent.module.css";

interface OrderFulfillProductCellContentProps {
  productName: string;
  attributesCaption?: string;
  children?: ReactNode;
}

export const OrderFulfillProductCellContent = ({
  productName,
  attributesCaption,
  children,
}: OrderFulfillProductCellContentProps): JSX.Element => {
  const { elementRef: productNameRef, isOverflowing: isProductNameOverflowing } =
    useOverflowDetection<HTMLDivElement>();
  const { elementRef: attributesRef, isOverflowing: isAttributesOverflowing } =
    useOverflowDetection<HTMLDivElement>();
  const showTooltip = Boolean(
    isProductNameOverflowing() || (attributesCaption && isAttributesOverflowing()),
  );

  return (
    <Tooltip open={showTooltip ? undefined : false}>
      <Tooltip.Trigger>
        <Box className={styles.content} overflow="hidden" minWidth={0} width="100%">
          <Box
            ref={productNameRef}
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            className={styles.productName}
          >
            {productName}
          </Box>
          {attributesCaption ? (
            <Box ref={attributesRef} overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
              <Text
                color="default2"
                size={2}
                fontWeight="light"
                textOverflow="ellipsis"
                overflow="hidden"
                whiteSpace="nowrap"
              >
                {attributesCaption}
              </Text>
            </Box>
          ) : null}
          {children}
        </Box>
      </Tooltip.Trigger>
      <Tooltip.Content side="bottom">
        <Tooltip.Arrow />
        <Box display="flex" flexDirection="column" gap={1} __maxWidth={320} wordBreak="break-word">
          <Text size={2}>{productName}</Text>
          {attributesCaption ? (
            <Text size={2} color="default2">
              {attributesCaption}
            </Text>
          ) : null}
          {children}
        </Box>
      </Tooltip.Content>
    </Tooltip>
  );
};
