// @ts-strict-ignore
import { Button } from "@dashboard/components/Button";
import CardTitle from "@dashboard/components/CardTitle";
import HorizontalSpacer from "@dashboard/components/HorizontalSpacer";
import { InternalLink } from "@dashboard/components/InternalLink";
import { CategoryDetailsQuery } from "@dashboard/graphql";
import { productAddUrl, productListUrl } from "@dashboard/products/urls";
import { Card } from "@material-ui/core";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ListActions, PageListProps, RelayToFlat } from "../../../types";
import CategoryProductList from "../CategoryProductList";
import { useStyles } from "./styles";

interface CategoryProductsProps extends PageListProps, ListActions {
  products: RelayToFlat<CategoryDetailsQuery["category"]["products"]>;
  categoryName: string;
  categoryId: string;
}

export const CategoryProducts: React.FC<CategoryProductsProps> = ({
  products,
  disabled,
  categoryId,
  categoryName,
  isChecked,
  selected,
  toggle,
  toggleAll,
  toolbar,
}) => {
  const intl = useIntl();
  const classes = useStyles();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage(
          {
            id: "+43JV5",
            defaultMessage: "Products in {categoryName}",
            description: "header",
          },
          { categoryName },
        )}
        toolbar={
          <div className={classes.toolbar}>
            <InternalLink
              to={productListUrl({
                categories: [categoryId],
              })}
            >
              <Button variant="tertiary" data-test-id="view-products">
                <FormattedMessage
                  id="z8jo8h"
                  defaultMessage="View products"
                  description="button"
                />
              </Button>
            </InternalLink>
            <HorizontalSpacer />
            <Button
              variant="tertiary"
              href={productAddUrl()}
              data-test-id="add-products"
            >
              <FormattedMessage
                id="x/pIZ9"
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
