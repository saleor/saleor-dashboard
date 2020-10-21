import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CardTitle from "@saleor/components/CardTitle";
import LinkChoice from "@saleor/components/LinkChoice";
import { SingleAutocompleteChoiceType } from "@saleor/components/SingleAutocompleteSelectField";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ListActions, PageListProps } from "../../../types";
import { CategoryDetails_category_products_edges_node } from "../../types/CategoryDetails";
import CategoryProductList from "../CategoryProductList";

interface CategoryProductsProps extends PageListProps, ListActions {
  products: CategoryDetails_category_products_edges_node[];
  channelChoices: SingleAutocompleteChoiceType[];
  channelsCount: number;
  categoryName: string;
}

const useStyles = makeStyles(
  theme => ({
    channelSelect: {
      marginRight: theme.spacing(1)
    },
    channelsSelectContainer: {
      paddingTop: theme.spacing(2)
    },
    label: {
      display: "inline-block",
      marginRight: theme.spacing(1)
    },
    select: {
      display: "inline-block"
    }
  }),
  { name: "CategoryProducts" }
);

export const CategoryProducts: React.FC<CategoryProductsProps> = ({
  channelChoices,
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
  toggle,
  toggleAll,
  toolbar
}) => {
  const intl = useIntl();
  const classes = useStyles({});

  const [channelChoice, setChannelChoice] = useStateFromProps(
    channelChoices?.length ? channelChoices[0]?.value : ""
  );

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
      <CardContent className={classes.channelsSelectContainer}>
        {channelChoices?.length && (
          <>
            <Typography className={classes.label}>
              <FormattedMessage
                defaultMessage="Channel:"
                description="categpry product channel"
              />
            </Typography>
            <LinkChoice
              className={classes.select}
              choices={channelChoices}
              name="channels"
              value={channelChoice}
              onChange={event => setChannelChoice(event.target.value)}
            />
          </>
        )}
      </CardContent>
      <CategoryProductList
        channelsCount={channelsCount}
        selectedChannel={channelChoice}
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
