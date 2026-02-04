import { DashboardCard } from "@dashboard/components/Card";
import { Divider } from "@dashboard/components/Divider";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import { productVariantAddUrl } from "@dashboard/products/urls";
import { ReorderAction } from "@dashboard/types";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Box, Button, Skeleton, Text } from "@saleor/macaw-ui-next";
import { Fragment } from "react";
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
  loading?: boolean;
  variants: ProductVariantItem[] | undefined;
  onReorder: ReorderAction;
}

const ProductVariantNavigation = (props: ProductVariantNavigationProps) => {
  const { current, defaultVariantId, productId, isCreate, loading, variants, onReorder } = props;
  const navigate = useNavigator();
  const intl = useIntl();

  const { items, sensors, isSaving, handleDragEnd } = useVariantDrag({
    variants: variants ?? [],
    onReorder,
  });

  const hasVariants = variants && variants.length > 0;

  return (
    <DashboardCard>
      <DashboardCard.Header paddingRight={0}>
        <DashboardCard.Title>{intl.formatMessage(sectionNames.variants)}</DashboardCard.Title>
        {!isCreate && (
          <DashboardCard.Toolbar>
            <Button
              variant="secondary"
              onClick={() => navigate(productVariantAddUrl(productId))}
              data-test-id="button-add-variant"
            >
              <FormattedMessage {...messages.addVariant} />
            </Button>
          </DashboardCard.Toolbar>
        )}
      </DashboardCard.Header>

      <Box __maxHeight="calc(100vh - 220px)" overflowY="auto" paddingBottom={4}>
        {loading ? (
          <Box data-test-id="variants-list">
            <Divider />
            {[1, 2, 3].map(i => (
              <Fragment key={i}>
                <Box display="flex" alignItems="center" gap={4} paddingX={6} paddingY={4}>
                  <Skeleton __width={48} __height={48} borderRadius={2} />
                  <Skeleton __width="60%" />
                </Box>
                <Divider />
              </Fragment>
            ))}
          </Box>
        ) : (
          <>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <Box data-test-id="variants-list">
                {hasVariants && <Divider />}
                <SortableContext items={items} strategy={verticalListSortingStrategy}>
                  {renderCollection(variants, variant => {
                    if (!variant) {
                      return null;
                    }

                    const isDefault = variant.id === defaultVariantId;
                    const isActive = variant.id === current;
                    const thumbnail = variant.media?.filter(
                      mediaObj => mediaObj.type === "IMAGE",
                    )[0];

                    return (
                      <Fragment key={variant.id}>
                        <VariantItem
                          variant={variant}
                          thumbnail={thumbnail}
                          isDefault={isDefault}
                          isActive={isActive}
                          productId={productId}
                          draggable={!isSaving}
                        />
                        <Divider height={0} />
                      </Fragment>
                    );
                  })}
                </SortableContext>
              </Box>
            </DndContext>

            {isCreate && (
              <ProductVariantEmptyItem hasVariants={hasVariants || false}>
                <Text>
                  <FormattedMessage {...messages.newVariant} />
                </Text>
              </ProductVariantEmptyItem>
            )}
          </>
        )}
      </Box>
    </DashboardCard>
  );
};

ProductVariantNavigation.displayName = "ProductVariantNavigation";
export default ProductVariantNavigation;
