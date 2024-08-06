// @ts-strict-ignore
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import TableCellAvatar from "@dashboard/components/TableCellAvatar";
import TableRowLink from "@dashboard/components/TableRowLink";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import useSearchQuery from "@dashboard/hooks/useSearchQuery";
import { maybe } from "@dashboard/misc";
import useScrollableDialogStyle from "@dashboard/styles/useScrollableDialogStyle";
import { DialogProps, FetchMoreProps } from "@dashboard/types";
import { CircularProgress, TableBody, TableCell, TextField } from "@material-ui/core";
import { Box, Text } from "@saleor/macaw-ui-next";
import React, { useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { FormattedMessage, useIntl } from "react-intl";

import { Container } from "../AssignContainerDialog";
import BackButton from "../BackButton";
import Checkbox from "../Checkbox";
import { messages } from "./messages";
import { useStyles } from "./styles";
import { Products, SelectedChannel } from "./types";
import { isProductAvailableInVoucherChannels } from "./utils";

export interface AssignProductDialogFormData {
  products: Products;
  query: string;
}

export interface AssignProductDialogProps extends FetchMoreProps, DialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  products: Products;
  selectedChannels?: SelectedChannel[];
  productUnavailableText?: string;
  selectedIds?: Record<string, boolean>;
  loading: boolean;
  onFetch: (value: string) => void;
  onSubmit: (data: Container[]) => void;
}

const scrollableTargetId = "assignProductScrollableDialog";
const AssignProductDialog: React.FC<AssignProductDialogProps> = props => {
  const {
    confirmButtonState,
    selectedChannels,
    productUnavailableText,
    hasMore,
    open,
    loading,
    products,
    onClose,
    onFetch,
    onFetchMore,
    onSubmit,
    selectedIds,
  } = props;
  const classes = useStyles(props);
  const scrollableDialogClasses = useScrollableDialogStyle({});
  const intl = useIntl();
  const [query, onQueryChange, queryReset] = useSearchQuery(onFetch);
  const [productsDict, setProductsDict] = React.useState(selectedIds || {});

  useEffect(() => {
    if (selectedIds) {
      setProductsDict(prev => {
        const prevIds = Object.keys(prev);
        const newIds = Object.keys(selectedIds);
        const preSelected = newIds
          .filter(n => !prevIds.includes(n))
          .reduce((p, c) => ({ ...p, [c]: true }), {});

        return { ...prev, ...preSelected };
      });
    }
  }, [selectedIds]);
  useModalDialogOpen(open, {
    onOpen: () => {
      queryReset();
      setProductsDict(selectedIds || {});
    },
  });

  const handleSubmit = () => {
    const selectedProductsAsArray = Object.keys(productsDict)
      .filter(key => productsDict[key])
      .map(key => key);

    onSubmit(
      selectedProductsAsArray.map(id => ({
        id,
        name: products.find(product => product.id === id)?.name,
      })),
    );
  };
  const handleChange = productId => {
    setProductsDict(prev => ({
      ...prev,
      [productId]: !prev[productId] ?? true,
    }));
  };
  const handleClose = () => {
    queryReset();
    onClose();
  };

  return (
    <DashboardModal onChange={handleClose} open={open}>
      <DashboardModal.Content size="sm" __gridTemplateRows="auto auto 1fr auto">
        <DashboardModal.Title>
          <FormattedMessage {...messages.assignVariantDialogHeader} />
        </DashboardModal.Title>

        <TextField
          name="query"
          value={query}
          onChange={onQueryChange}
          label={intl.formatMessage(messages.assignProductDialogSearch)}
          placeholder={intl.formatMessage(messages.assignProductDialogContent)}
          fullWidth
          InputProps={{
            autoComplete: "off",
            endAdornment: loading && <CircularProgress size={16} />,
          }}
        />

        <Box
          className={scrollableDialogClasses.scrollArea}
          id={scrollableTargetId}
          __maxHeight={465}
        >
          <InfiniteScroll
            dataLength={products?.length ?? 0}
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
                {products &&
                  products.map(product => {
                    const isSelected = productsDict[product.id] || false;
                    const isProductAvailable = isProductAvailableInVoucherChannels(
                      product.channelListings,
                      selectedChannels,
                    );

                    return (
                      <TableRowLink key={product.id} data-test-id="assign-product-table-row">
                        <TableCell padding="checkbox" className={classes.checkboxCell}>
                          <Checkbox
                            checked={isSelected}
                            disabled={!isProductAvailable}
                            onChange={() => handleChange(product.id)}
                          />
                        </TableCell>
                        <TableCellAvatar
                          className={classes.avatar}
                          thumbnail={maybe(() => product.thumbnail.url)}
                          style={{
                            opacity: !isProductAvailable ? 0.5 : 1,
                          }}
                        />
                        <TableCell className={classes.colName}>
                          {product.name}
                          {!isProductAvailable && productUnavailableText && (
                            <Text display="block" size={1} color="default2">
                              {productUnavailableText}
                            </Text>
                          )}
                        </TableCell>
                      </TableRowLink>
                    );
                  })}
              </TableBody>
            </ResponsiveTable>
          </InfiniteScroll>
        </Box>

        <DashboardModal.Actions>
          <BackButton onClick={onClose} />
          <ConfirmButton
            data-test-id="submit"
            transitionState={confirmButtonState}
            type="submit"
            onClick={handleSubmit}
          >
            <FormattedMessage {...messages.assignProductDialogButton} />
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

AssignProductDialog.displayName = "AssignProductDialog";
export default AssignProductDialog;
