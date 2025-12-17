import { FetchResult } from "@apollo/client";
import { Channel, isAvailableInChannel } from "@dashboard/channels/utils";
import BackButton from "@dashboard/components/BackButton";
import Checkbox from "@dashboard/components/Checkbox";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { InfiniteScroll } from "@dashboard/components/InfiniteScroll";
import { DashboardModal } from "@dashboard/components/Modal";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import TableCellAvatar from "@dashboard/components/TableCellAvatar";
import TableRowLink from "@dashboard/components/TableRowLink";
import { SaleorThrobber } from "@dashboard/components/Throbber";
import { ShippingPriceExcludeProductMutation } from "@dashboard/graphql";
import useSearchQuery from "@dashboard/hooks/useSearchQuery";
import { renderCollection } from "@dashboard/misc";
import { isProductSelected } from "@dashboard/shipping/components/ShippingMethodProductsAddDialog/utils";
import { FetchMoreProps } from "@dashboard/types";
import { TableBody, TableCell, TextField } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import { Fragment, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { Product, Products } from "./types";

const useStyles = makeStyles(
  () => ({
    avatar: {
      paddingLeft: 0,
      width: 64,
    },
    colName: {
      paddingLeft: 0,
    },
    productCheckboxCell: {
      "&:first-child": {
        paddingLeft: 0,
        paddingRight: 0,
      },
    },
  }),
  { name: "ShippingMethodProductsAddDialog" },
);

interface ShippingMethodProductsAddDialogProps extends FetchMoreProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  products: Products;
  onClose: () => void;
  onFetch: (query: string) => void;
  onSubmit: (ids: string[]) => Promise<FetchResult<ShippingPriceExcludeProductMutation>>;
  availableChannels: Channel[];
}

const handleProductAssign = (
  product: Product,
  isSelected: boolean,
  selectedProducts: Products,
  setSelectedProducts: (data: Products) => void,
) => {
  if (isSelected) {
    setSelectedProducts(
      selectedProducts.filter(selectedProduct => selectedProduct.id !== product.id),
    );
  } else {
    setSelectedProducts([...selectedProducts, product]);
  }
};

const scrollableTargetId = "shippingMethodProductsAddScrollableDialog";

const ShippingMethodProductsAddDialog = ({
  confirmButtonState,
  open,
  loading,
  hasMore,
  products,
  onFetch,
  onFetchMore,
  onClose,
  onSubmit,
  availableChannels,
}: ShippingMethodProductsAddDialogProps) => {
  const classes = useStyles();
  const intl = useIntl();
  const [query, onQueryChange, resetQuery] = useSearchQuery(onFetch);
  const [selectedProducts, setSelectedProducts] = useState<Products>([]);
  const handleSubmit = () => {
    onSubmit(selectedProducts.map(product => product.id)).then(() => {
      setSelectedProducts([]);
      resetQuery();
    });
  };
  const handleClose = () => {
    onClose();
    setSelectedProducts([]);
    resetQuery();
  };

  return (
    <DashboardModal onChange={handleClose} open={open}>
      <DashboardModal.Content size="sm" __gridTemplateRows="auto auto 1fr">
        <DashboardModal.Header>
          <FormattedMessage
            id="xZhxBJ"
            defaultMessage="Assign Products"
            description="dialog header"
          />
        </DashboardModal.Header>

        <Box data-test-id="assign-products-dialog-content">
          <TextField
            data-test-id="search-bar"
            name="query"
            value={query}
            onChange={onQueryChange}
            label={intl.formatMessage({
              id: "/TF6BZ",
              defaultMessage: "Search Products",
            })}
            placeholder={intl.formatMessage({
              id: "/TF6BZ",
              defaultMessage: "Search Products",
            })}
            fullWidth
            InputProps={{
              autoComplete: "off",
              endAdornment: loading && <SaleorThrobber size={16} />,
            }}
          />
        </Box>

        <InfiniteScroll
          id={scrollableTargetId}
          dataLength={products?.length ?? 0}
          next={onFetchMore}
          hasMore={hasMore}
          scrollThreshold="100px"
          scrollableTarget={scrollableTargetId}
        >
          <ResponsiveTable key="table">
            <TableBody data-test-id="assign-product-list">
              {renderCollection(
                products,
                (product, productIndex) => {
                  const isSelected = isProductSelected(selectedProducts, product?.id);

                  const isProductAvailable = isAvailableInChannel({
                    availableChannels,
                    channelListings: product?.channelListings ?? [],
                  });

                  const isProductDisabled = loading || !isProductAvailable;

                  return (
                    <Fragment key={product ? product.id : `skeleton-${productIndex}`}>
                      <TableRowLink data-test-id="product-row">
                        <TableCell padding="checkbox" className={classes.productCheckboxCell}>
                          {product && (
                            <Checkbox
                              checked={isSelected}
                              disabled={isProductDisabled}
                              onChange={() =>
                                handleProductAssign(
                                  product,
                                  isSelected,
                                  selectedProducts,
                                  setSelectedProducts,
                                )
                              }
                            />
                          )}
                        </TableCell>
                        <TableCellAvatar
                          className={classes.avatar}
                          thumbnail={product?.thumbnail?.url}
                          style={{
                            opacity: isProductDisabled ? 0.5 : 1,
                          }}
                        />
                        <TableCell className={classes.colName} colSpan={2}>
                          {product?.name || <Skeleton />}
                          {!isProductAvailable && (
                            <Text display="block" size={1} color="default2">
                              {intl.formatMessage({
                                defaultMessage: "Product is not available in selected channels",
                                id: "jmZSK1",
                              })}
                            </Text>
                          )}
                        </TableCell>
                      </TableRowLink>
                    </Fragment>
                  );
                },
                () => (
                  <TableRowLink>
                    <TableCell colSpan={4}>
                      <FormattedMessage
                        id="5ZvuVw"
                        defaultMessage="No products matching given query"
                      />
                    </TableCell>
                  </TableRowLink>
                ),
              )}
            </TableBody>
          </ResponsiveTable>
        </InfiniteScroll>

        <DashboardModal.Actions>
          <BackButton onClick={handleClose} />
          <ConfirmButton
            data-test-id="assign-and-save-button"
            transitionState={confirmButtonState}
            type="submit"
            disabled={loading || !selectedProducts?.length}
            onClick={handleSubmit}
          >
            <FormattedMessage
              id="FzEew9"
              defaultMessage="Assign and save"
              description="assign products to shipping rate and save, button"
            />
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

ShippingMethodProductsAddDialog.displayName = "ShippingMethodProductsAddDialog";
export default ShippingMethodProductsAddDialog;
