// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import { Divider } from "@dashboard/components/Divider";
import Skeleton from "@dashboard/components/Skeleton";
import { ProductVariantCreateDataQuery, ProductVariantDetailsQuery } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import { productVariantAddUrl, productVariantEditUrl } from "@dashboard/products/urls";
import { ReorderAction } from "@dashboard/types";
import { Box, Button, GripIcon, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { renderCollection } from "../../../misc";
import { ImagePlaceholder } from "./components/ImagePlaceholder";
import { SortableContainer, SortableElement } from "./components/SortableContainer";
import { messages } from "./messages";

interface ProductVariantNavigationProps {
  current?: string;
  defaultVariantId?: string;
  fallbackThumbnail: string;
  productId: string;
  isCreate?: boolean;
  variants:
    | Array<ProductVariantDetailsQuery["productVariant"]>
    | ProductVariantCreateDataQuery["product"]["variants"];
  onReorder: ReorderAction;
}

const ProductVariantNavigation: React.FC<ProductVariantNavigationProps> = props => {
  const { current, defaultVariantId, productId, isCreate, variants, onReorder } = props;
  const navigate = useNavigator();
  const intl = useIntl();

  return (
    <DashboardCard>
      <DashboardCard.Title>{intl.formatMessage(sectionNames.variants)}</DashboardCard.Title>
      <SortableContainer onSortEnd={onReorder} data-test-id="variants-list">
        {variants?.length > 0 && <Divider />}
        {renderCollection(variants, (variant, variantIndex) => {
          const isDefault = variant && variant.id === defaultVariantId;
          const isActive = variant && variant.id === current;
          const thumbnail = variant?.media?.filter(mediaObj => mediaObj.type === "IMAGE")[0];

          return (
            <Link to={variant ? productVariantEditUrl(productId, variant.id) : undefined}>
              <SortableElement
                key={variant ? variant.id : "skeleton"}
                index={variantIndex || 0}
                display="block"
                borderLeftStyle="solid"
                __borderLeftWidth={2}
                __borderColor={isActive ? "hsla(0, 0%, 0%, 0.6)" : "transparent"}
              >
                <Box
                  maxWidth="100%"
                  paddingX={5}
                  paddingY={3}
                  display="flex"
                  alignItems="center"
                  gap={5}
                >
                  <GripIcon />
                  {thumbnail?.url ? (
                    <Box
                      as="img"
                      width={10}
                      height={10}
                      objectFit="cover"
                      borderRadius={2}
                      borderColor="default1"
                      borderStyle="solid"
                      borderWidth={1}
                      padding={1}
                      flexShrink="0"
                      src={thumbnail.url}
                    />
                  ) : (
                    <ImagePlaceholder />
                  )}
                  <Box>
                    <Text wordBreak="break-word" data-test-id="variant-name">
                      {variant ? variant.name || variant.sku : <Skeleton />}
                    </Text>
                    {isDefault && (
                      <Text display="block" size={2} color="default2">
                        {intl.formatMessage(messages.defaultVariant)}
                      </Text>
                    )}
                  </Box>
                </Box>
                <Divider />
              </SortableElement>
            </Link>
          );
        })}
        {!isCreate ? (
          <Button
            marginTop={4}
            marginLeft={6}
            variant="secondary"
            onClick={() => navigate(productVariantAddUrl(productId))}
            data-test-id="button-add-variant"
          >
            <FormattedMessage {...messages.addVariant} />
          </Button>
        ) : (
          <Box
            paddingX={5}
            paddingY={3}
            display="flex"
            alignItems="center"
            gap={5}
            borderLeftStyle="solid"
            __borderLeftWidth={2}
            __borderColor={"hsla(0, 0%, 0%, 0.6)"}
          >
            <Box opacity="0">
              <GripIcon />
            </Box>
            <ImagePlaceholder />
            <Text>
              <FormattedMessage {...messages.newVariant} />
            </Text>
          </Box>
        )}
      </SortableContainer>
    </DashboardCard>
  );
};
ProductVariantNavigation.displayName = "ProductVariantNavigation";
export default ProductVariantNavigation;
