import ConfirmButton from "@dashboard/components/ConfirmButton";
import Money from "@dashboard/components/Money";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import TableCellAvatar from "@dashboard/components/TableCellAvatar";
import TableRowLink from "@dashboard/components/TableRowLink";
import { SearchProductsQuery } from "@dashboard/graphql";
import useSearchQuery from "@dashboard/hooks/useSearchQuery";
import { maybe, renderCollection } from "@dashboard/misc";
import useScrollableDialogStyle from "@dashboard/styles/useScrollableDialogStyle";
import { DialogProps, FetchMoreProps, RelayToFlat } from "@dashboard/types";
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TableBody,
  TableCell,
  TextField,
  Typography,
} from "@material-ui/core";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { FormattedMessage, useIntl } from "react-intl";

import BackButton from "../BackButton";
import Checkbox from "../Checkbox";
import { messages } from "./messages";
import { useStyles } from "./styles";
import {
  handleProductAssign,
  handleVariantAssign,
  hasAllVariantsSelected,
  isVariantSelected,
  SearchVariant,
} from "./utils";

export interface AssignVariantDialogFormData {
  products: RelayToFlat<SearchProductsQuery["search"]>;
  query: string;
}
export interface AssignVariantDialogProps extends FetchMoreProps, DialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  products: RelayToFlat<SearchProductsQuery["search"]>;
  loading: boolean;
  onFetch: (value: string) => void;
  onSubmit: (data: string[]) => void;
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
    onSubmit,
  } = props;
  const classes = useStyles(props);
  const scrollableDialogClasses = useScrollableDialogStyle({});

  const intl = useIntl();
  const [query, onQueryChange] = useSearchQuery(onFetch);
  const [variants, setVariants] = React.useState<SearchVariant[]>([]);

  const productChoices =
    products?.filter(product => product?.variants?.length > 0) || [];

  const selectedVariantsToProductsMap = productChoices
    ? productChoices.map(product =>
        product.variants.map(variant => isVariantSelected(variant, variants)),
      )
    : [];

  const productsWithAllVariantsSelected = productChoices
    ? productChoices.map(product =>
        hasAllVariantsSelected(product.variants, variants),
      )
    : [];

  const handleSubmit = () => onSubmit(variants.map(variant => variant.id));

  return (
    <Dialog
      onClose={onClose}
      open={open}
      classes={{ paper: scrollableDialogClasses.dialog }}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle disableTypography>
        <FormattedMessage {...messages.assignVariantDialogHeader} />
      </DialogTitle>
      <DialogContent>
        <TextField
          name="query"
          value={query}
          onChange={onQueryChange}
          label={intl.formatMessage(messages.assignVariantDialogSearch)}
          placeholder={intl.formatMessage(messages.assignVariantDialogContent)}
          fullWidth
          InputProps={{
            autoComplete: "off",
            endAdornment: loading && <CircularProgress size={16} />,
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
                    <TableRowLink>
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
                              setVariants,
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
                    </TableRowLink>
                    {maybe(() => product.variants, []).map(
                      (variant, variantIndex) => (
                        <TableRowLink
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
                                  setVariants,
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
                                  sku: variant.sku,
                                }}
                              />
                            </div>
                          </TableCell>
                          <TableCell className={classes.textRight}>
                            {variant?.channelListings[0]?.price && (
                              <Money money={variant.channelListings[0].price} />
                            )}
                          </TableCell>
                        </TableRowLink>
                      ),
                    )}
                  </React.Fragment>
                ),
                () => (
                  <Typography className={classes.noContentText}>
                    {!!query
                      ? intl.formatMessage(messages.noProductsInQuery)
                      : intl.formatMessage(messages.noProductsInChannel)}
                  </Typography>
                ),
              )}
            </TableBody>
          </ResponsiveTable>
        </InfiniteScroll>
      </DialogContent>
      <DialogActions>
        <BackButton onClick={onClose} />
        <ConfirmButton
          data-test-id="submit"
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
