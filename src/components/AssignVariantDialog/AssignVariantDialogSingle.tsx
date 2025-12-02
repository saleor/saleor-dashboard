import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { InfiniteScroll } from "@dashboard/components/InfiniteScroll";
import { DashboardModal } from "@dashboard/components/Modal";
import Money from "@dashboard/components/Money";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import TableCellAvatar from "@dashboard/components/TableCellAvatar";
import TableRowLink from "@dashboard/components/TableRowLink";
import { SaleorThrobber } from "@dashboard/components/Throbber";
import { SearchProductsQuery } from "@dashboard/graphql";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import useSearchQuery from "@dashboard/hooks/useSearchQuery";
import { maybe, renderCollection } from "@dashboard/misc";
import { Container, FetchMoreProps, RelayToFlat } from "@dashboard/types";
import { Radio, TableBody, TableCell, TextField } from "@material-ui/core";
import { Text } from "@saleor/macaw-ui-next";
import { Fragment, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { AssignContainerDialogProps } from "../AssignContainerDialog";
import BackButton from "../BackButton";
import { messages } from "./messages";
import { useStyles } from "./styles";
import { getCompositeLabel, VariantWithProductLabel } from "./utils";

interface AssignVariantDialogSingleProps extends FetchMoreProps {
  confirmButtonState: ConfirmButtonTransitionState;
  products: RelayToFlat<SearchProductsQuery["search"]>;
  loading: boolean;
  onFetch: (value: string) => void;
  onSubmit: (data: Container[]) => void;
  onClose: () => void;
  selectedId?: string;
  labels?: Partial<AssignContainerDialogProps["labels"]>;
  open: boolean;
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
    open,
  } = props;
  const classes = useStyles(props);
  const intl = useIntl();
  const [query, onQueryChange, queryReset] = useSearchQuery(onFetch);
  const [selectedVariantId, setSelectedVariantId] = useState<string>(selectedId ?? "");

  const handleClose = () => {
    queryReset();
    onClose();
  };

  useModalDialogOpen(open, {
    onClose: handleClose,
  });

  const productChoices = useMemo(
    () =>
      products?.filter(product => product && product.variants && product.variants.length > 0) || [],
    [products],
  );
  const productVariantChoices = useMemo(
    () => productChoices.flatMap(product => product.variants || []),
    [productChoices],
  );

  const handleSubmit = () => {
    if (selectedVariantId) {
      const variant = productVariantChoices.find(v => v && v.id === selectedVariantId);

      if (variant) {
        const variantWithLabel: VariantWithProductLabel = {
          ...variant,
          productName: variant.product.name,
        };

        onSubmit([
          {
            ...variantWithLabel,
            name: getCompositeLabel(variantWithLabel),
            id: variant.id,
          },
        ]);

        return;
      }
    }

    onSubmit([]);
  };

  const handleVariantSelect = (variantId: string) => {
    setSelectedVariantId(variantId === selectedVariantId ? "" : variantId);
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
          endAdornment: loading && <SaleorThrobber size={16} />,
        }}
      />

      <InfiniteScroll
        id={scrollableTargetId}
        dataLength={productChoices.reduce(
          (acc, product) => acc + (product.variants?.length || 0),
          0,
        )}
        next={onFetchMore}
        hasMore={hasMore}
        scrollThreshold="100px"
        scrollableTarget={scrollableTargetId}
      >
        <ResponsiveTable key="table">
          <TableBody>
            {renderCollection(
              productChoices,
              product => (
                <Fragment key={product ? product.id : "skeleton"}>
                  {/* Product header row (non-selectable) */}
                  <TableRowLink>
                    <TableCell padding="checkbox" className={classes.productCheckboxCell}>
                      {/* No checkbox for products in single mode */}
                    </TableCell>
                    <TableCellAvatar
                      className={classes.avatar}
                      thumbnail={product ? maybe(() => product.thumbnail?.url) : undefined}
                    />
                    <TableCell className={classes.colName} colSpan={2}>
                      {product ? maybe(() => product.name) : null}
                    </TableCell>
                  </TableRowLink>
                  {/* Variant rows (selectable) */}
                  {(product?.variants || [])
                    .filter(v => v !== null)
                    .map(variant => {
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
                            {variant?.channelListings?.[0]?.price && (
                              <Money money={variant.channelListings[0].price} />
                            )}
                          </TableCell>
                        </TableRowLink>
                      );
                    })}
                </Fragment>
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
