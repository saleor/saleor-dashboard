import Money from "@dashboard/components/Money";
import { ProductTopToday } from "@dashboard/home/types";
import { productVariantEditUrl } from "@dashboard/products/urls";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { renderCollection } from "../../../misc";
import { HomeProductListItem } from "./HomeProductListItem";
import { generateAttributesInfo } from "./variant";

interface HomeProductListProps {
  testId?: string;
  topProducts: {
    data: ProductTopToday | null;
    loading: boolean;
    error: any;
  };
}

export const HomeProductList = ({
  topProducts,
  testId,
}: HomeProductListProps) => {
  const intl = useIntl();

  if (topProducts.loading) {
    <Box data-test-id={testId}>
      <Text variant="heading" display="block" paddingTop={7} marginBottom={2}>
        {intl.formatMessage({
          id: "e08xWz",
          defaultMessage: "Top products",
          description: "header",
        })}
      </Text>
      <Box>
        <Skeleton />
      </Box>
    </Box>;
  }

  return (
    <Box data-test-id={testId}>
      <Text variant="heading" display="block" paddingTop={7} marginBottom={2}>
        {intl.formatMessage({
          id: "e08xWz",
          defaultMessage: "Top products",
          description: "header",
        })}
      </Text>
      <Box>
        {renderCollection(
          topProducts.data,
          variant => (
            <HomeProductListItem
              key={variant ? variant.id : "skeleton"}
              linkUrl={
                variant
                  ? productVariantEditUrl(variant.product.id, variant.id)
                  : ""
              }
            >
              {variant ? (
                <>
                  <Box display="flex" gap={3} alignItems="center">
                    <Box
                      borderColor="neutralHighlight"
                      borderStyle="solid"
                      borderWidth={1}
                      borderRadius={3}
                      as="img"
                      width={16}
                      height={16}
                      padding={0.5}
                      alt={variant.product.name}
                      objectFit="scale-down"
                      src={variant.product.thumbnail?.url}
                    />

                    <Box display="flex" flexDirection="column">
                      <Text size="small">{variant.product.name}</Text>

                      <Text size="small" color="textNeutralSubdued">
                        {generateAttributesInfo(variant)}
                      </Text>

                      <Text size="small" color="textNeutralSubdued">
                        <FormattedMessage
                          id="nII/qB"
                          defaultMessage="{amount, plural,one {One ordered}other {{amount} ordered}}"
                          description="number of ordered products"
                          values={{
                            amount: variant.quantityOrdered,
                          }}
                        />
                      </Text>
                    </Box>
                  </Box>

                  <Text textAlign="right">
                    {variant.revenue ? (
                      <Money money={variant.revenue.gross} />
                    ) : (
                      "-"
                    )}
                  </Text>
                </>
              ) : (
                <Skeleton />
              )}
            </HomeProductListItem>
          ),
          () => (
            <Box
              borderColor="neutralPlain"
              borderWidth={1}
              paddingY={5}
              borderBottomStyle="solid"
            >
              <Text size="small">
                <FormattedMessage
                  id="Q1Uzbb"
                  defaultMessage="No products found"
                />
              </Text>
            </Box>
          ),
        )}
      </Box>
    </Box>
  );
};

HomeProductList.displayName = "HomeProductList";
export default HomeProductList;
