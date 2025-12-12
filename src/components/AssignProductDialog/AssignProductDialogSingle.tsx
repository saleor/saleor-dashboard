import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { InfiniteScroll } from "@dashboard/components/InfiniteScroll";
import { DashboardModal } from "@dashboard/components/Modal";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import TableCellAvatar from "@dashboard/components/TableCellAvatar";
import TableRowLink from "@dashboard/components/TableRowLink";
import { SaleorThrobber } from "@dashboard/components/Throbber";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import useSearchQuery from "@dashboard/hooks/useSearchQuery";
import { maybe } from "@dashboard/misc";
import { Container, FetchMoreProps } from "@dashboard/types";
import { Radio, TableBody, TableCell, TextField } from "@material-ui/core";
import { Text } from "@saleor/macaw-ui-next";
import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import BackButton from "../BackButton";
import { messages } from "./messages";
import { useStyles } from "./styles";
import { Products, SelectedChannel } from "./types";
import { isProductAvailableInVoucherChannels } from "./utils";

interface AssignProductDialogSingleProps extends FetchMoreProps {
  confirmButtonState: ConfirmButtonTransitionState;
  products: Products;
  selectedChannels?: SelectedChannel[];
  productUnavailableText?: string;
  selectedId?: string;
  loading: boolean;
  onFetch: (value: string) => void;
  onSubmit: (data: Array<Container & Omit<Partial<Products[number]>, "name">>) => void;
  onClose: () => void;
  labels?: {
    confirmBtn?: string;
  };
  open: boolean;
}

const scrollableTargetId = "assignProductScrollableDialog";

export const AssignProductDialogSingle = (props: AssignProductDialogSingleProps) => {
  const {
    confirmButtonState,
    selectedChannels,
    productUnavailableText,
    hasMore,
    loading,
    products,
    onClose,
    onFetch,
    onFetchMore,
    onSubmit,
    selectedId,
    labels,
    open,
  } = props;
  const classes = useStyles(props);
  const intl = useIntl();
  const [query, onQueryChange, queryReset] = useSearchQuery(onFetch);
  const [selectedProductId, setSelectedProductId] = useState<string>(selectedId ?? "");

  useEffect(() => {
    setSelectedProductId(selectedId ?? "");
  }, [selectedId]);

  const handleClose = () => {
    queryReset();
    onClose();
  };

  useModalDialogOpen(open, {
    onClose: handleClose,
  });

  const handleSubmit = () => {
    if (selectedProductId) {
      const selectedProduct = products.find(product => product.id === selectedProductId);

      if (selectedProduct) {
        onSubmit([
          {
            ...selectedProduct,
            id: selectedProduct.id,
            name: selectedProduct.name,
          },
        ]);

        return;
      }
    }

    onSubmit([]);
  };

  const handleChange = (productId: string) => {
    setSelectedProductId(productId === selectedProductId ? "" : productId);
  };

  return (
    <>
      <TextField
        name="query"
        value={query}
        onChange={onQueryChange}
        label={intl.formatMessage(messages.assignProductDialogSearch)}
        placeholder={intl.formatMessage(messages.assignProductDialogContent)}
        fullWidth
        InputProps={{
          autoComplete: "off",
          endAdornment: loading && <SaleorThrobber size={16} />,
        }}
      />

      <InfiniteScroll
        id={scrollableTargetId}
        dataLength={products?.length ?? 0}
        next={onFetchMore}
        hasMore={hasMore}
        scrollThreshold="100px"
        scrollableTarget={scrollableTargetId}
      >
        <ResponsiveTable key="table">
          <TableBody>
            {products &&
              products.map(product => {
                const isSelected = selectedProductId === product.id;
                const isProductAvailable = isProductAvailableInVoucherChannels(
                  product.channelListings ?? [],
                  selectedChannels,
                );

                return (
                  <TableRowLink
                    key={product.id}
                    data-test-id="assign-product-table-row"
                    onClick={() => (!isProductAvailable ? null : handleChange(product.id))}
                  >
                    <TableCell padding="checkbox" className={classes.checkboxCell}>
                      <Radio
                        checked={isSelected}
                        disabled={!isProductAvailable}
                        onChange={() => handleChange(product.id)}
                        value={product.id}
                        name="product-selection"
                      />
                    </TableCell>
                    <TableCellAvatar
                      className={classes.avatar}
                      thumbnail={maybe(() => product.thumbnail?.url)}
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
            {!loading && (products?.length ?? 0) === 0 && (
              <Text>
                <Text>{intl.formatMessage(messages.noProductsFound)}</Text>
              </Text>
            )}
          </TableBody>
        </ResponsiveTable>
      </InfiniteScroll>

      <DashboardModal.Actions>
        <BackButton onClick={handleClose} />
        <ConfirmButton
          data-test-id="submit"
          transitionState={confirmButtonState}
          type="submit"
          onClick={handleSubmit}
        >
          {labels?.confirmBtn ?? <FormattedMessage {...messages.assignProductDialogButton} />}
        </ConfirmButton>
      </DashboardModal.Actions>
    </>
  );
};
