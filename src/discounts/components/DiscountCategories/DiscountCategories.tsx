import { categoryUrl } from "@dashboard/categories/urls";
import { Pagination } from "@dashboard/collections/components/CollectionProducts/Pagination";
import {
  AssignableListCell,
  AssignableListLinkCell,
  AssignableListTable,
} from "@dashboard/components/AssignableListTable/AssignableListTable";
import { ASSIGNABLE_LIST_TABLE_LEADING_INSET } from "@dashboard/components/AssignableListTable/assignableListTableLayout";
import { DashboardCard } from "@dashboard/components/Card";
import { PAGINATE_BY } from "@dashboard/config";
import { type CategoryWithTotalProductsFragment } from "@dashboard/graphql";
import { type ListActions, type ListProps } from "@dashboard/types";
import { Button, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";

interface DiscountCategoriesProps extends Omit<ListProps, "onUpdateListSettings">, ListActions {
  categories: CategoryWithTotalProductsFragment[];
  onCategoryAssign: () => void;
  onCategoryUnassign: (id: string) => void;
  numberOfRows?: number;
  onUpdateListSettings?: (key: "rowNumber", value: number) => void;
  /** Skip card chrome when nested under catalogue action rows. */
  embedded?: boolean;
}

export const DiscountCategories = ({
  categories,
  disabled,
  onCategoryAssign,
  onCategoryUnassign,
  toolbar,
  toggle,
  toggleAll,
  selected,
  isChecked,
  numberOfRows = PAGINATE_BY,
  onUpdateListSettings,
  embedded = false,
}: DiscountCategoriesProps): JSX.Element => {
  const intl = useIntl();

  const body = (
    <>
      <AssignableListTable<CategoryWithTotalProductsFragment>
        data-test-id="assigned-specific-products-table"
        rowTestId="assigned-specific-product"
        items={categories}
        disabled={disabled}
        selected={selected}
        isChecked={isChecked}
        toggle={toggle}
        toggleAll={(items, count) => toggleAll(items, count)}
        onUnassign={onCategoryUnassign}
        toolbar={toolbar}
        emptyMessage={<FormattedMessage {...messages.discountCategoriesNotFound} />}
        columns={[
          {
            id: "name",
            width: "60%",
            header: <FormattedMessage {...messages.discountCategoriesTableProductHeader} />,
          },
          {
            id: "products",
            width: "30%",
            header: <FormattedMessage {...messages.discountCategoriesTableProductNumber} />,
            hideHeaderWhenSelected: true,
          },
        ]}
        renderCells={category => (
          <>
            <AssignableListLinkCell href={categoryUrl(category.id)} title={category.name}>
              <Text ellipsis display="block" minWidth={0} __flex="1">
                {category.name}
              </Text>
            </AssignableListLinkCell>
            <AssignableListCell>
              <Text size={2} color="default2">
                {category.products?.totalCount ?? 0}
              </Text>
            </AssignableListCell>
          </>
        )}
      />
      {categories?.length && onUpdateListSettings ? (
        <Pagination
          numberOfRows={numberOfRows}
          onUpdateListSettings={onUpdateListSettings}
          paddingLeft={ASSIGNABLE_LIST_TABLE_LEADING_INSET}
        />
      ) : null}
    </>
  );

  if (embedded) {
    return <div data-test-id="assign-category-section">{body}</div>;
  }

  return (
    <DashboardCard data-test-id="assign-category-section">
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage(messages.discountCategoriesHeader)}
        </DashboardCard.Title>
        <DashboardCard.Toolbar>
          <Button
            onClick={onCategoryAssign}
            data-test-id="assign-category-button"
            variant="secondary"
          >
            <FormattedMessage {...messages.discountCategoriesButton} />
          </Button>
        </DashboardCard.Toolbar>
      </DashboardCard.Header>
      <DashboardCard.Content>{body}</DashboardCard.Content>
    </DashboardCard>
  );
};

DiscountCategories.displayName = "DiscountCategories";
