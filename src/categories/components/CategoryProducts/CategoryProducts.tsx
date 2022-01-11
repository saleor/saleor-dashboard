import { Card } from "@material-ui/core";
import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import CardTitle from "@saleor/components/CardTitle";
import { InternalLink } from "@saleor/components/InternalLink";
import { Button } from "@saleor/macaw-ui";
import { productListUrl } from "@saleor/products/urls";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ListActions, PageListProps } from "../../../types";
import { CategoryDetails_category_products_edges_node } from "../../types/CategoryDetails";
import CategoryProductList from "../CategoryProductList";
import { useStyles } from "./styles";

interface CategoryProductsProps extends PageListProps, ListActions {
  products: CategoryDetails_category_products_edges_node[];
  categoryName: string;
  categoryId: string;
}

export const CategoryProducts: React.FC<CategoryProductsProps> = ({
  products,
  disabled,
  pageInfo,
  onAdd,
  onNextPage,
  onPreviousPage,
  onRowClick,
  categoryId,
  categoryName,
  isChecked,
  selected,
  toggle,
  toggleAll,
  toolbar
}) => {
  const intl = useIntl();
  const classes = useStyles();

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
          <div className={classes.toolbar}>
            <InternalLink
              to={productListUrl({
                categories: [categoryId]
              })}
            >
              <Button variant="tertiary" data-test-id="viewProducts">
                <FormattedMessage
                  defaultMessage="View products"
                  description="button"
                />
              </Button>
            </InternalLink>
            <HorizontalSpacer />
            <Button
              variant="tertiary"
              onClick={onAdd}
              data-test-id="addProducts"
            >
              <FormattedMessage
                defaultMessage="Add product"
                description="button"
              />
            </Button>
          </div>
        }
      />
      <CategoryProductList
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
