import { Pagination } from "@dashboard/collections/components/CollectionProducts/Pagination";
import {
  AssignableListCell,
  AssignableListLinkCell,
  AssignableListTable,
} from "@dashboard/components/AssignableListTable/AssignableListTable";
import { ASSIGNABLE_LIST_TABLE_LEADING_INSET } from "@dashboard/components/AssignableListTable/assignableListTableLayout";
import { DashboardCard } from "@dashboard/components/Card";
import { ProductChannelsAvailability } from "@dashboard/components/ChannelsAvailabilityDropdown";
import { EmptyImage } from "@dashboard/components/EmptyImage";
import { PAGINATE_BY } from "@dashboard/config";
import { type SearchProductFragment } from "@dashboard/graphql";
import { maybe } from "@dashboard/misc";
import { productUrl } from "@dashboard/products/urls";
import { type ListActions, type ListProps } from "@dashboard/types";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";

interface SaleProductsProps extends Omit<ListProps, "onUpdateListSettings">, ListActions {
  products: SearchProductFragment[];
  onProductAssign: () => void;
  onProductUnassign: (id: string) => void;
  numberOfRows?: number;
  onUpdateListSettings?: (key: "rowNumber", value: number) => void;
  /** Skip card chrome when nested under catalogue action rows. */
  embedded?: boolean;
}

export const DiscountProducts = ({
  products,
  disabled,
  onProductAssign,
  onProductUnassign,
  isChecked,
  selected,
  toggle,
  toggleAll,
  toolbar,
  numberOfRows = PAGINATE_BY,
  onUpdateListSettings,
  embedded = false,
}: SaleProductsProps): JSX.Element => {
  const intl = useIntl();

  const body = (
    <>
      <AssignableListTable<SearchProductFragment>
        data-test-id="assigned-specific-products-table"
        rowTestId="assigned-specific-product"
        items={products}
        disabled={disabled}
        selected={selected}
        isChecked={isChecked}
        toggle={toggle}
        toggleAll={(items, count) => toggleAll(items, count)}
        onUnassign={onProductUnassign}
        toolbar={toolbar}
        emptyMessage={<FormattedMessage {...messages.discountProductsNotFound} />}
        columns={[
          {
            id: "name",
            // Slightly prefer name, but keep type/availability readable in the catalogue panel.
            width: "42%",
            header: <FormattedMessage {...messages.discountProductsTableProductHeader} />,
          },
          {
            id: "type",
            width: "24%",
            header: <FormattedMessage {...messages.discountProductsTableTypeHeader} />,
            hideHeaderWhenSelected: true,
          },
          {
            id: "availability",
            width: "26%",
            header: <FormattedMessage {...messages.discountProductsTableAvailabilityHeader} />,
            hideHeaderWhenSelected: true,
          },
        ]}
        renderCells={product => (
          <>
            <AssignableListLinkCell
              href={productUrl(product.id)}
              title={maybe(() => product.name) ?? undefined}
            >
              <Box flexShrink="0">
                {product.thumbnail?.url ? (
                  <Box
                    borderColor="default1"
                    borderWidth={1}
                    borderRadius={3}
                    borderStyle="solid"
                    overflow="hidden"
                  >
                    <Box
                      as="img"
                      src={product.thumbnail.url}
                      alt={product.name}
                      __width="31px"
                      __height="31px"
                    />
                  </Box>
                ) : (
                  <EmptyImage />
                )}
              </Box>
              <Text ellipsis display="block" minWidth={0} __flex="1">
                {maybe(() => product.name)}
              </Text>
            </AssignableListLinkCell>
            <AssignableListCell truncate>
              <Text ellipsis display="block" size={2} color="default2">
                {maybe(() => product.productType.name)}
              </Text>
            </AssignableListCell>
            <AssignableListCell truncate>
              {product.channelListings?.length ? (
                <ProductChannelsAvailability channels={product.channelListings} />
              ) : (
                "-"
              )}
            </AssignableListCell>
          </>
        )}
      />
      {products?.length && onUpdateListSettings ? (
        <Pagination
          numberOfRows={numberOfRows}
          onUpdateListSettings={onUpdateListSettings}
          paddingLeft={ASSIGNABLE_LIST_TABLE_LEADING_INSET}
        />
      ) : null}
    </>
  );

  if (embedded) {
    return <div data-test-id="assign-product-section">{body}</div>;
  }

  return (
    <DashboardCard data-test-id="assign-product-section">
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage(messages.discountProductsHeader)}
        </DashboardCard.Title>
        <DashboardCard.Toolbar>
          <Button onClick={onProductAssign} data-test-id="assign-products" variant="secondary">
            <FormattedMessage {...messages.discountProductsButton} />
          </Button>
        </DashboardCard.Toolbar>
      </DashboardCard.Header>
      <DashboardCard.Content>{body}</DashboardCard.Content>
    </DashboardCard>
  );
};

DiscountProducts.displayName = "DiscountProducts";
