import Money from "@dashboard/components/Money";
import { HomeData, ProductTopToday } from "@dashboard/home/types";
import { productVariantEditUrl } from "@dashboard/products/urls";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { renderCollection } from "../../../misc";
import { HomeProductListItem } from "./HomeProductListItem";
import { generateAttributesInfo } from "./variant";

interface HomeProductListProps {
  testId?: string;
  topProducts: HomeData<ProductTopToday>;
}

export const HomeProductList = ({
  topProducts,
  testId,
}: HomeProductListProps) => {
  const intl = useIntl();
  const title = intl.formatMessage({
    id: "e08xWz",
    defaultMessage: "Top products",
    description: "header",
  });

  if (topProducts.hasError) {
    return (
      <Box data-test-id={testId}>
        <Text
          typeSize={5}
          fontWeight="bold"
          display="block"
          paddingTop={7}
          marginBottom={2}
        >
          {title}
        </Text>
        <Text color="default2">
          <FormattedMessage
            id="/Fa+RP"
            defaultMessage="Couldn't load top products"
          />
        </Text>
      </Box>
    );
  }

  if (topProducts.loading) {
    return (
      <Box data-test-id={testId}>
        <Text
          typeSize={5}
          fontWeight="bold"
          display="block"
          paddingTop={7}
          marginBottom={2}
        >
          {title}
        </Text>
        <Box display="flex" flexDirection="column">
          <ProductListSkeleton />
          <ProductListSkeleton />
          <ProductListSkeleton />
        </Box>
      </Box>
    );
  }

  return (
    <Box data-test-id={testId}>
      <Text
        typeSize={5}
        fontWeight="bold"
        display="block"
        paddingTop={7}
        marginBottom={2}
      >
        {title}
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
                      borderColor="default1"
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

                      <Text size="small" color="default2">
                        {generateAttributesInfo(variant)}
                      </Text>

                      <Text size="small" color="default2">
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
              borderColor="default1"
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

function ProductListSkeleton() {
  return (
    <Box
      borderColor="default1"
      borderWidth={1}
      borderBottomStyle="solid"
      paddingX={3}
      paddingY={6}
    >
      <Skeleton />
    </Box>
  );
}
