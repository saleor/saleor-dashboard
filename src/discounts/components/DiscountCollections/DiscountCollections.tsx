import { collectionUrl } from "@dashboard/collections/urls";
import { AssignableListPagination } from "@dashboard/components/AssignableListTable/AssignableListPagination";
import {
  AssignableListCell,
  AssignableListLinkCell,
  AssignableListTable,
} from "@dashboard/components/AssignableListTable/AssignableListTable";
import { DashboardCard } from "@dashboard/components/Card";
import { PAGINATE_BY } from "@dashboard/config";
import { type CollectionWithTotalProductsFragment } from "@dashboard/graphql";
import { type ListActions, type ListProps } from "@dashboard/types";
import { Button, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";

interface DiscountCollectionsProps extends Omit<ListProps, "onUpdateListSettings">, ListActions {
  collections: CollectionWithTotalProductsFragment[];
  onCollectionAssign: () => void;
  onCollectionUnassign: (id: string) => void;
  numberOfRows?: number;
  onUpdateListSettings?: (key: "rowNumber", value: number) => void;
  /** Skip card chrome when nested under catalogue action rows. */
  embedded?: boolean;
}

export const DiscountCollections = ({
  collections,
  disabled,
  onCollectionAssign,
  onCollectionUnassign,
  isChecked,
  selected,
  toggle,
  toggleAll,
  toolbar,
  numberOfRows = PAGINATE_BY,
  onUpdateListSettings,
  embedded = false,
}: DiscountCollectionsProps): JSX.Element => {
  const intl = useIntl();

  const body = (
    <>
      <AssignableListTable<CollectionWithTotalProductsFragment>
        data-test-id="assigned-specific-products-table"
        rowTestId="assigned-specific-product"
        items={collections}
        disabled={disabled}
        selected={selected}
        isChecked={isChecked}
        toggle={toggle}
        toggleAll={(items, count) => toggleAll(items, count)}
        onUnassign={onCollectionUnassign}
        toolbar={toolbar}
        emptyMessage={<FormattedMessage {...messages.discountCollectionsNotFound} />}
        columns={[
          {
            id: "name",
            width: "60%",
            header: <FormattedMessage {...messages.discountCollectionsTableProductHeader} />,
          },
          {
            id: "products",
            width: "30%",
            header: <FormattedMessage {...messages.discountCollectionsTableProductNumber} />,
            hideHeaderWhenSelected: true,
          },
        ]}
        renderCells={collection => (
          <>
            <AssignableListLinkCell href={collectionUrl(collection.id)} title={collection.name}>
              <Text ellipsis display="block" minWidth={0} __flex="1">
                {collection.name}
              </Text>
            </AssignableListLinkCell>
            <AssignableListCell>
              <Text size={2} color="default2">
                {collection.products?.totalCount ?? 0}
              </Text>
            </AssignableListCell>
          </>
        )}
      />
      {collections?.length && onUpdateListSettings ? (
        <AssignableListPagination
          inset="nested"
          numberOfRows={numberOfRows}
          onUpdateListSettings={onUpdateListSettings}
        />
      ) : null}
    </>
  );

  if (embedded) {
    return <div data-test-id="assign-collection-section">{body}</div>;
  }

  return (
    <DashboardCard data-test-id="assign-collection-section">
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage(messages.discountCollectionsHeader)}
        </DashboardCard.Title>
        <DashboardCard.Toolbar>
          <Button
            onClick={onCollectionAssign}
            data-test-id="assign-collection-button"
            variant="secondary"
          >
            <FormattedMessage {...messages.discountCollectionsButton} />
          </Button>
        </DashboardCard.Toolbar>
      </DashboardCard.Header>
      <DashboardCard.Content>{body}</DashboardCard.Content>
    </DashboardCard>
  );
};

DiscountCollections.displayName = "DiscountCollections";
