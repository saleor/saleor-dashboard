import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { InfiniteScroll } from "@dashboard/components/InfiniteScroll";
import { DashboardModal } from "@dashboard/components/Modal";
import Money from "@dashboard/components/Money";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import TableCellAvatar from "@dashboard/components/TableCellAvatar";
import TableRowLink from "@dashboard/components/TableRowLink";
import { SearchProductsQuery } from "@dashboard/graphql";
import useSearchQuery from "@dashboard/hooks/useSearchQuery";
import { maybe, renderCollection } from "@dashboard/misc";
import { FetchMoreProps, RelayToFlat } from "@dashboard/types";
import { CircularProgress, Radio, TableBody, TableCell, TextField } from "@material-ui/core";
import { Text } from "@saleor/macaw-ui-next";
import React, { useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { AssignContainerDialogProps, Container } from "../AssignContainerDialog";
import BackButton from "../BackButton";
import { messages } from "./messages";
import { useStyles } from "./styles";
import { getCompositeLabel, VariantWithProductLabel } from "./utils";

export interface AssignVariantDialogSingleProps extends FetchMoreProps {
  confirmButtonState: ConfirmButtonTransitionState;
  products: RelayToFlat<SearchProductsQuery["search"]>;
  loading: boolean;
  onFetch: (value: string) => void;
  onSubmit: (data: Container[]) => void;
  onClose: () => void;
  selectedId?: string;
  labels?: Partial<AssignContainerDialogProps["labels"]>;
}

const scrollableTargetId = "assignVariantScrollableDialog";

export const AssignVariantDialogSingle = (props: AssignVariantDialogSingleProps) => {
  const {
    confirmButtonState,
    labels,
    hasMore,
    loading,
    products,
    onClose,
    onFetch,
    onFetchMore,
    onSubmit,
    selectedId,
  } = props;
  const classes = useStyles(props);
  const intl = useIntl();
  const [query, onQueryChange, queryReset] = useSearchQuery(onFetch);
  const [selectedVariantId, setSelectedVariantId] = React.useState<string>(selectedId ?? '');

  React.useEffect(() => {
    setSelectedVariantId(selectedId ?? '');
  }, [selectedId]);

  const productChoices = useMemo(() => products?.filter(product => product?.variants?.length > 0) || [], [products]);
  const productVariantChoices = useMemo(() => productChoices.flatMap(product => product.variants), [productChoices]);

  const handleSubmit = () => {
    if (selectedVariantId) {
      const variant = productVariantChoices.find(v => v.id === selectedVariantId);

      if (variant) {
        const variantWithLabel: VariantWithProductLabel = {
          ...variant,
          productName: variant.product.name
        };

        onSubmit([{
          name: getCompositeLabel(variantWithLabel),
          id: variant.id,
          ...variantWithLabel,
        }]);

        return;
      }

    }

    onSubmit([]);
  };

  const handleVariantSelect = (variantId: string) => {
    setSelectedVariantId(variantId === selectedVariantId ? '' : variantId);
  };

  const handleClose = () => {
    queryReset();
    onClose();
  };

  return (
    <>
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

      <InfiniteScroll
        id={scrollableTargetId}
        dataLength={productChoices.reduce((acc, product) => acc + product.variants.length, 0)}
        next={onFetchMore}
        hasMore={hasMore}
        scrollThreshold="100px"
        scrollableTarget={scrollableTargetId}
      >
        <ResponsiveTable key="table">
          <TableBody>
            {renderCollection(
              productChoices,
              (product) => (
                <React.Fragment key={product ? product.id : "skeleton"}>
                  {/* Product header row (non-selectable) */}
                  <TableRowLink>
                    <TableCell padding="checkbox" className={classes.productCheckboxCell}>
                      {/* No checkbox for products in single mode */}
                    </TableCell>
                    <TableCellAvatar
                      className={classes.avatar}
                      thumbnail={maybe(() => product.thumbnail.url)}
                    />
                    <TableCell className={classes.colName} colSpan={2}>
                      {maybe(() => product.name)}
                    </TableCell>
                  </TableRowLink>
                  {/* Variant rows (selectable) */}
                  {maybe(() => product.variants, []).map((variant) => {
                    const isSelected = selectedVariantId === variant.id;

                    return (
                      <TableRowLink
                        key={variant.id}
                        data-test-id="assign-variant-table-row"
                        onClick={() => handleVariantSelect(variant.id)}
                      >
                        <TableCell />
                        <TableCell className={classes.colVariantCheckbox}>
                          <Radio
                            className={classes.variantCheckbox}
                            checked={isSelected}
                            disabled={loading}
                            onChange={() => handleVariantSelect(variant.id)}
                            value={variant.id}
                            name="variant-selection"
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
                    );
                  })}
                </React.Fragment>
              ),
              () => (
                <Text className={classes.noContentText}>
                  {query
                    ? intl.formatMessage(messages.noProductsInQuery)
                    : intl.formatMessage(messages.noProductsInChannel)}
                </Text>
              ),
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
          {labels?.confirmBtn ?? <FormattedMessage {...messages.assignVariantDialogButton} />}
        </ConfirmButton>
      </DashboardModal.Actions>
    </>
  );
};

