import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TableBody,
  TableCell,
  TableRow,
  TextField
} from "@material-ui/core";
import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import Money from "@saleor/components/Money";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import useSearchQuery from "@saleor/hooks/useSearchQuery";
import { buttonMessages } from "@saleor/intl";
import { Button } from "@saleor/macaw-ui";
import { maybe, renderCollection } from "@saleor/misc";
import {
  getById,
  getByUnmatchingId
} from "@saleor/orders/components/OrderReturnPage/utils";
import {
  SearchProducts_search_edges_node,
  SearchProducts_search_edges_node_variants
} from "@saleor/searches/types/SearchProducts";
import useScrollableDialogStyle from "@saleor/styles/useScrollableDialogStyle";
import { DialogProps, FetchMoreProps } from "@saleor/types";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { FormattedMessage, useIntl } from "react-intl";

import Checkbox from "../Checkbox";
import { messages } from "./messages";
import { useStyles } from "./styles";

type SetVariantsAction = (
  data: SearchProducts_search_edges_node_variants[]
) => void;
export interface AssignVariantDialogFormData {
  products: SearchProducts_search_edges_node[];
  query: string;
}
export interface AssignVariantDialogProps extends FetchMoreProps, DialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  products: SearchProducts_search_edges_node[];
  loading: boolean;
  onFetch: (value: string) => void;
  onSubmit: (data: SearchProducts_search_edges_node_variants[]) => void;
}

function isVariantSelected(
  variant: SearchProducts_search_edges_node_variants,
  selectedVariantsToProductsMap: SearchProducts_search_edges_node_variants[]
): boolean {
  return !!selectedVariantsToProductsMap.find(getById(variant.id));
}

const handleProductAssign = (
  product: SearchProducts_search_edges_node,
  productIndex: number,
  productsWithAllVariantsSelected: boolean[],
  variants: SearchProducts_search_edges_node_variants[],
  setVariants: SetVariantsAction
) =>
  productsWithAllVariantsSelected[productIndex]
    ? setVariants(
        variants.filter(
          selectedVariant => !product.variants.find(getById(selectedVariant.id))
        )
      )
    : setVariants([
        ...variants,
        ...product.variants.filter(
          productVariant => !variants.find(getById(productVariant.id))
        )
      ]);

const handleVariantAssign = (
  variant: SearchProducts_search_edges_node_variants,
  variantIndex: number,
  productIndex: number,
  variants: SearchProducts_search_edges_node_variants[],
  selectedVariantsToProductsMap: boolean[][],
  setVariants: SetVariantsAction
) =>
  selectedVariantsToProductsMap[productIndex][variantIndex]
    ? setVariants(variants.filter(getByUnmatchingId(variant.id)))
    : setVariants([...variants, variant]);

function hasAllVariantsSelected(
  productVariants: SearchProducts_search_edges_node_variants[],
  selectedVariantsToProductsMap: SearchProducts_search_edges_node_variants[]
): boolean {
  return productVariants.reduce(
    (acc, productVariant) =>
      acc && !!selectedVariantsToProductsMap.find(getById(productVariant.id)),
    true
  );
}

const scrollableTargetId = "assignVariantScrollableDialog";

const AssignVariantDialog: React.FC<AssignVariantDialogProps> = props => {
  const {
    confirmButtonState,
    hasMore,
    open,
    loading,
    products,
    onClose,
    onFetch,
    onFetchMore,
    onSubmit
  } = props;
  const classes = useStyles(props);
  const scrollableDialogClasses = useScrollableDialogStyle({});

  const intl = useIntl();
  const [query, onQueryChange] = useSearchQuery(onFetch);
  const [variants, setVariants] = React.useState<
    SearchProducts_search_edges_node_variants[]
  >([]);

  const productChoices =
    products?.filter(product => product?.variants?.length > 0) || [];

  const selectedVariantsToProductsMap = productChoices
    ? productChoices.map(product =>
        product.variants.map(variant => isVariantSelected(variant, variants))
      )
    : [];

  const productsWithAllVariantsSelected = productChoices
    ? productChoices.map(product =>
        hasAllVariantsSelected(product.variants, variants)
      )
    : [];

  const handleSubmit = () => onSubmit(variants);

  return (
    <Dialog
      onClose={onClose}
      open={open}
      classes={{ paper: scrollableDialogClasses.dialog }}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        <FormattedMessage {...messages.assignVariantDialogHeader} />
      </DialogTitle>
      <DialogContent className={scrollableDialogClasses.topArea}>
        <TextField
          name="query"
          value={query}
          onChange={onQueryChange}
          label={intl.formatMessage(messages.assignVariantDialogSearch)}
          placeholder={intl.formatMessage(messages.assignVariantDialogContent)}
          fullWidth
          InputProps={{
            autoComplete: "off",
            endAdornment: loading && <CircularProgress size={16} />
          }}
        />
      </DialogContent>
      <DialogContent
        className={scrollableDialogClasses.scrollArea}
        id={scrollableTargetId}
      >
        <InfiniteScroll
          dataLength={variants?.length}
          next={onFetchMore}
          hasMore={hasMore}
          scrollThreshold="100px"
          loader={
            <div className={scrollableDialogClasses.loadMoreLoaderContainer}>
              <CircularProgress size={16} />
            </div>
          }
          scrollableTarget={scrollableTargetId}
        >
          <ResponsiveTable key="table">
            <TableBody>
              {renderCollection(
                productChoices,
                (product, productIndex) => (
                  <React.Fragment key={product ? product.id : "skeleton"}>
                    <TableRow>
                      <TableCell
                        padding="checkbox"
                        className={classes.productCheckboxCell}
                      >
                        <Checkbox
                          checked={
                            productsWithAllVariantsSelected[productIndex]
                          }
                          disabled={loading}
                          onChange={() =>
                            handleProductAssign(
                              product,
                              productIndex,
                              productsWithAllVariantsSelected,
                              variants,
                              setVariants
                            )
                          }
                        />
                      </TableCell>
                      <TableCellAvatar
                        className={classes.avatar}
                        thumbnail={maybe(() => product.thumbnail.url)}
                      />
                      <TableCell className={classes.colName} colSpan={2}>
                        {maybe(() => product.name)}
                      </TableCell>
                    </TableRow>
                    {maybe(() => product.variants, []).map(
                      (variant, variantIndex) => (
                        <TableRow
                          key={variant.id}
                          data-test-id="assign-variant-table-row"
                        >
                          <TableCell />
                          <TableCell className={classes.colVariantCheckbox}>
                            <Checkbox
                              className={classes.variantCheckbox}
                              checked={
                                selectedVariantsToProductsMap[productIndex][
                                  variantIndex
                                ]
                              }
                              disabled={loading}
                              onChange={() =>
                                handleVariantAssign(
                                  variant,
                                  variantIndex,
                                  productIndex,
                                  variants,
                                  selectedVariantsToProductsMap,
                                  setVariants
                                )
                              }
                            />
                          </TableCell>
                          <TableCell className={classes.colName}>
                            <div>{variant.name}</div>
                            <div className={classes.grayText}>
                              <FormattedMessage
                                {...messages.assignVariantDialogSKU}
                                values={{
                                  sku: variant.sku
                                }}
                              />
                            </div>
                          </TableCell>
                          <TableCell className={classes.textRight}>
                            {variant?.channelListings[0]?.price && (
                              <Money money={variant.channelListings[0].price} />
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </React.Fragment>
                ),
                () => (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <FormattedMessage defaultMessage="No products available in order channel matching given query" />
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </ResponsiveTable>
        </InfiniteScroll>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          <FormattedMessage {...buttonMessages.back} />
        </Button>
        <ConfirmButton
          data-test="submit"
          transitionState={confirmButtonState}
          type="submit"
          onClick={handleSubmit}
        >
          <FormattedMessage {...messages.assignVariantDialogButton} />
        </ConfirmButton>
      </DialogActions>
    </Dialog>
  );
};
AssignVariantDialog.displayName = "AssignVariantDialog";
export default AssignVariantDialog;
