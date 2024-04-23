// @ts-strict-ignore
import { ChannelVoucherData } from "@dashboard/channels/utils";
import {
  ConfirmButton,
  ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import TableCellAvatar from "@dashboard/components/TableCellAvatar";
import TableRowLink from "@dashboard/components/TableRowLink";
import { SearchProductsQuery } from "@dashboard/graphql";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import useSearchQuery from "@dashboard/hooks/useSearchQuery";
import { maybe } from "@dashboard/misc";
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
} from "@material-ui/core";
import React, { useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { FormattedMessage, useIntl } from "react-intl";

import { Container } from "../AssignContainerDialog";
import BackButton from "../BackButton";
import Checkbox from "../Checkbox";
import { messages } from "./messages";
import { useStyles } from "./styles";
import { isProductChannelInSelectedChannels } from "./utils";

export interface AssignProductDialogFormData {
  products: RelayToFlat<SearchProductsQuery["search"]>;
  query: string;
}

export interface AssignProductDialogProps extends FetchMoreProps, DialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  products: RelayToFlat<SearchProductsQuery["search"]>;
  selectedChannels: ChannelVoucherData[];
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
    <Dialog
      onClose={handleClose}
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
          label={intl.formatMessage(messages.assignProductDialogSearch)}
          placeholder={intl.formatMessage(messages.assignProductDialogContent)}
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

                  return (
                    <TableRowLink
                      key={product.id}
                      data-test-id="assign-product-table-row"
                    >
                      <TableCellAvatar
                        className={classes.avatar}
                        thumbnail={maybe(() => product.thumbnail.url)}
                      />
                      <TableCell className={classes.colName}>
                        {product.name}
                      </TableCell>
                      <TableCell>
                        {isProductChannelInSelectedChannels(
                          product.channelListings,
                          selectedChannels,
                        )
                          ? "Included"
                          : "Not included"}
                      </TableCell>
                      <TableCell
                        padding="checkbox"
                        className={classes.checkboxCell}
                      >
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleChange(product.id)}
                        />
                      </TableCell>
                    </TableRowLink>
                  );
                })}
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
          <FormattedMessage {...messages.assignProductDialogButton} />
        </ConfirmButton>
      </DialogActions>
    </Dialog>
  );
};
AssignProductDialog.displayName = "AssignProductDialog";
export default AssignProductDialog;
