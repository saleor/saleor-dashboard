import { Pagination } from "@dashboard/collections/components/CollectionProducts/Pagination";
import {
  AssignableListCell,
  AssignableListLinkCell,
  AssignableListTable,
} from "@dashboard/components/AssignableListTable/AssignableListTable";
import { ASSIGNABLE_LIST_TABLE_LEADING_INSET } from "@dashboard/components/AssignableListTable/assignableListTableLayout";
import { DashboardCard } from "@dashboard/components/Card";
import { EmptyImage } from "@dashboard/components/EmptyImage";
import { PAGINATE_BY } from "@dashboard/config";
import { type SaleDetailsFragment, type VoucherCatalogueFragment } from "@dashboard/graphql";
import { maybe } from "@dashboard/misc";
import { productVariantEditPath } from "@dashboard/products/urls";
import { type ListActions, type ListProps } from "@dashboard/types";
import { getLoadableList } from "@dashboard/utils/maps";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";

interface SaleVariantsProps extends Omit<ListProps, "onUpdateListSettings">, ListActions {
  variants: SaleDetailsFragment["variants"] | VoucherCatalogueFragment["variants"];
  onVariantAssign: () => void;
  onVariantUnassign: (id: string) => void;
  numberOfRows?: number;
  onUpdateListSettings?: (key: "rowNumber", value: number) => void;
  /** Skip card chrome when nested under catalogue action rows. */
  embedded?: boolean;
}

type DiscountVariantRow = {
  id: string;
  name: string;
  product: {
    name: string;
    thumbnail?: { url: string } | null;
    productType: { name: string };
  };
};

export const DiscountVariants = ({
  variants: discountVariants,
  disabled,
  onVariantAssign,
  onVariantUnassign,
  isChecked,
  selected,
  toggle,
  toggleAll,
  toolbar,
  numberOfRows = PAGINATE_BY,
  onUpdateListSettings,
  embedded = false,
}: SaleVariantsProps): JSX.Element => {
  const intl = useIntl();
  const variants = getLoadableList(discountVariants) as DiscountVariantRow[] | undefined;

  const body = (
    <>
      <AssignableListTable<DiscountVariantRow>
        data-test-id="assigned-specific-variants-table"
        rowTestId="assigned-specific-variant"
        items={variants}
        disabled={disabled}
        selected={selected}
        isChecked={isChecked}
        toggle={toggle}
        toggleAll={(items, count) => toggleAll(items, count)}
        onUnassign={onVariantUnassign}
        toolbar={toolbar}
        emptyMessage={<FormattedMessage {...messages.discountVariantsNotFound} />}
        columns={[
          {
            id: "product",
            width: "40%",
            header: <FormattedMessage {...messages.discountVariantsTableProductHeader} />,
          },
          {
            id: "variant",
            width: "26%",
            header: <FormattedMessage {...messages.discountVariantsTableVariantHeader} />,
            hideHeaderWhenSelected: true,
          },
          {
            id: "type",
            width: "26%",
            header: <FormattedMessage {...messages.discountVariantsTableProductHeader} />,
            hideHeaderWhenSelected: true,
          },
        ]}
        renderCells={variant => {
          const productName = maybe(() => variant.product.name);
          const variantName = maybe(() => variant.name);
          const linkTitle = [productName, variantName].filter(Boolean).join(" · ") || undefined;

          return (
            <>
              <AssignableListLinkCell href={productVariantEditPath(variant.id)} title={linkTitle}>
                <Box flexShrink="0">
                  {variant.product.thumbnail?.url ? (
                    <Box
                      borderColor="default1"
                      borderWidth={1}
                      borderRadius={3}
                      borderStyle="solid"
                      overflow="hidden"
                    >
                      <Box
                        as="img"
                        src={variant.product.thumbnail.url}
                        alt={variant.product.name}
                        __width="31px"
                        __height="31px"
                      />
                    </Box>
                  ) : (
                    <EmptyImage />
                  )}
                </Box>
                <Text ellipsis display="block" minWidth={0} __flex="1">
                  {productName}
                </Text>
              </AssignableListLinkCell>
              <AssignableListCell truncate>
                <Text ellipsis display="block" size={2} color="default2">
                  {variantName}
                </Text>
              </AssignableListCell>
              <AssignableListCell truncate>
                <Text ellipsis display="block" size={2} color="default2">
                  {maybe(() => variant.product.productType.name)}
                </Text>
              </AssignableListCell>
            </>
          );
        }}
      />
      {variants?.length && onUpdateListSettings ? (
        <Pagination
          numberOfRows={numberOfRows}
          onUpdateListSettings={onUpdateListSettings}
          paddingLeft={ASSIGNABLE_LIST_TABLE_LEADING_INSET}
        />
      ) : null}
    </>
  );

  if (embedded) {
    return <div data-test-id="assign-variant-section">{body}</div>;
  }

  return (
    <DashboardCard data-test-id="assign-variant-section">
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage(messages.discountVariantsHeader)}
        </DashboardCard.Title>
        <DashboardCard.Toolbar>
          <Button onClick={onVariantAssign} data-test-id="assign-variant" variant="secondary">
            <FormattedMessage {...messages.discountVariantsButton} />
          </Button>
        </DashboardCard.Toolbar>
      </DashboardCard.Header>
      <DashboardCard.Content>{body}</DashboardCard.Content>
    </DashboardCard>
  );
};

DiscountVariants.displayName = "DiscountVariants";
