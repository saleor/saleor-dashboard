import { DashboardCard } from "@dashboard/components/Card";
import { Divider } from "@dashboard/components/Divider";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import { productVariantAddUrl } from "@dashboard/products/urls";
import { ReorderAction } from "@dashboard/types";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { renderCollection } from "../../../misc";
import { ProductVariantEmptyItem } from "./components/ProductVariantEmptyItem";
import { VariantItem } from "./components/ProductVariantItem";
import { useVariantDrag } from "./hooks/useVariantDrag";
import { messages } from "./messages";
import { ProductVariantItem } from "./types";

interface ProductVariantNavigationProps {
  current?: string;
  defaultVariantId?: string;
  fallbackThumbnail: string;
  productId: string;
  isCreate?: boolean;
  variants: ProductVariantItem[] | undefined;
  onReorder: ReorderAction;
}

const ProductVariantNavigation: React.FC<ProductVariantNavigationProps> = props => {
  const { current, defaultVariantId, productId, isCreate, variants, onReorder } = props;
  const navigate = useNavigator();
  const intl = useIntl();

  const { items, sensors, isSaving, handleDragEnd } = useVariantDrag({
    variants: variants ?? [],
    onReorder,
  });

  const hasVariants = variants && variants.length > 0;

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>{intl.formatMessage(sectionNames.variants)}</DashboardCard.Title>
      </DashboardCard.Header>

      <DashboardCard.Content paddingX={0}>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <Box data-test-id="variants-list">
            {hasVariants && <Divider />}
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
              {renderCollection(variants, variant => {
                if (!variant) {
                  return null;
                }

                const isDefault = variant.id === defaultVariantId;
                const isActive = variant.id === current;
                const thumbnail = variant.media?.filter(mediaObj => mediaObj.type === "IMAGE")[0];

                return (
                  <React.Fragment key={variant.id}>
                    <VariantItem
                      variant={variant}
                      thumbnail={thumbnail}
                      isDefault={isDefault}
                      isActive={isActive}
                      productId={productId}
                      draggable={!isSaving}
                    />
                    <Divider height={0} />
                  </React.Fragment>
                );
              })}
            </SortableContext>
          </Box>
        </DndContext>

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
          <ProductVariantEmptyItem hasVariants={hasVariants || false}>
            <Text>
              <FormattedMessage {...messages.newVariant} />
            </Text>
          </ProductVariantEmptyItem>
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};

ProductVariantNavigation.displayName = "ProductVariantNavigation";
export default ProductVariantNavigation;
