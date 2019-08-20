import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import ProductList from "@saleor/components/ProductList";
import { ListActions, PageListProps } from "../../../types";
import { CategoryDetails_category_products_edges_node } from "../../types/CategoryDetails";

interface CategoryProductsCardProps extends PageListProps, ListActions {
  products: CategoryDetails_category_products_edges_node[];
  categoryName: string;
}

export const CategoryProductsCard: React.StatelessComponent<
  CategoryProductsCardProps
> = ({
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
            defaultMessage: "Products in {name}",
            description: "products in category, section header",
            id: "categoryProductsCardHeader"
          },
          {
            name: categoryName
          }
        )}
        toolbar={
          <Button color="primary" variant="text" onClick={onAdd}>
            <FormattedMessage
              defaultMessage="Add product"
              description="button"
              id="categoryProductsCardAddProductButton"
            />
          </Button>
        }
      />
      <ProductList
        settings={{
          columns: ["isPublished", "price", "productType"],
          rowNumber: undefined
        }}
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

CategoryProductsCard.displayName = "CategoryProductsCard";
export default CategoryProductsCard;
