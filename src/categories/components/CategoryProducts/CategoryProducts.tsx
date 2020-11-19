import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardTitle from "@saleor/components/CardTitle";
import { SingleAutocompleteChoiceType } from "@saleor/components/SingleAutocompleteSelectField";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ChannelProps, ListActions, PageListProps } from "../../../types";
import { CategoryDetails_category_products_edges_node } from "../../types/CategoryDetails";
import CategoryProductList from "../CategoryProductList";

interface CategoryProductsProps
  extends PageListProps,
    ListActions,
    ChannelProps {
  products: CategoryDetails_category_products_edges_node[];
  channelChoices: SingleAutocompleteChoiceType[];
  channelsCount: number;
  categoryName: string;
}

export const CategoryProducts: React.FC<CategoryProductsProps> = ({
  channelsCount,
  products,
  disabled,
  pageInfo,
  onAdd,
  onNextPage,
  onPreviousPage,
  onRowClick,
  categoryName,
  isChecked,
  selected,
  selectedChannelId,
  toggle,
  toggleAll,
  toolbar
}) => {
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage(
          {
            defaultMessage: "Products in {categoryName}",
            description: "header"
          },
          { categoryName }
        )}
        toolbar={
          <Button color="primary" variant="text" onClick={onAdd}>
            <FormattedMessage
              defaultMessage="Add product"
              description="button"
            />
          </Button>
        }
      />
      <CategoryProductList
        channelsCount={channelsCount}
        selectedChannelId={selectedChannelId}
        products={products}
        disabled={disabled}
        pageInfo={pageInfo}
        onNextPage={onNextPage}
        onPreviousPage={onPreviousPage}
        onRowClick={onRowClick}
        selected={selected}
        isChecked={isChecked}
        toggle={toggle}
        toggleAll={toggleAll}
        toolbar={toolbar}
      />
    </Card>
  );
};

CategoryProducts.displayName = "CategoryProducts";
export default CategoryProducts;
