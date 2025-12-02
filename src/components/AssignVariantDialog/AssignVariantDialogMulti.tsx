// @ts-strict-ignore
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
import { TableBody, TableCell, TextField } from "@material-ui/core";
import { Text } from "@saleor/macaw-ui-next";
import { Fragment, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { AssignContainerDialogProps } from "../AssignContainerDialog";
import BackButton from "../BackButton";
import Checkbox from "../Checkbox";
import { messages } from "./messages";
import { useStyles } from "./styles";
import {
  getCompositeLabel,
  handleProductAssign,
  handleVariantAssign,
  hasAllVariantsSelected,
  isVariantSelected,
  VariantWithProductLabel,
} from "./utils";

interface AssignVariantDialogMultiProps extends FetchMoreProps {
  confirmButtonState: ConfirmButtonTransitionState;
  products: RelayToFlat<SearchProductsQuery["search"]>;
  loading: boolean;
  onFetch: (value: string) => void;
  onSubmit: (data: Container[]) => void;
  onClose: () => void;
  labels?: Partial<AssignContainerDialogProps["labels"]>;
  open: boolean;
}

const scrollableTargetId = "assignVariantScrollableDialog";

export const AssignVariantDialogMulti = (props: AssignVariantDialogMultiProps) => {
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
    open,
  } = props;
  const classes = useStyles(props);
  const intl = useIntl();
  const [query, onQueryChange, queryReset] = useSearchQuery(onFetch);
  const [variants, setVariants] = useState<VariantWithProductLabel[]>([]);
  const productChoices = products?.filter(product => product?.variants?.length > 0) || [];
  const selectedVariantsToProductsMap = productChoices
    ? productChoices.map(product =>
        product.variants.map(variant => isVariantSelected(variant, variants)),
      )
    : [];
  const productsWithAllVariantsSelected = productChoices
    ? productChoices.map(product => hasAllVariantsSelected(product.variants, variants))
    : [];
  const handleSubmit = () =>
    onSubmit(
      variants.map(variant => ({
        name: getCompositeLabel(variant),
        id: variant.id,
        ...variant,
      })),
    );

  const handleClose = () => {
    queryReset();
    onClose();
  };

  useModalDialogOpen(open, {
    onOpen: () => {
      queryReset();
    },
    onClose: handleClose,
  });

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
        dataLength={variants?.length ?? 0}
        next={onFetchMore}
        hasMore={hasMore}
        scrollThreshold="100px"
        scrollableTarget={scrollableTargetId}
      >
        <ResponsiveTable key="table">
          <TableBody>
            {renderCollection(
              productChoices,
              (product, productIndex) => (
                <Fragment key={product ? product.id : "skeleton"}>
                  <TableRowLink>
                    <TableCell padding="checkbox" className={classes.productCheckboxCell}>
                      <Checkbox
                        checked={productsWithAllVariantsSelected[productIndex]}
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
                  {maybe(() => product.variants, []).map((variant, variantIndex) => (
                    <TableRowLink key={variant.id} data-test-id="assign-variant-table-row">
                      <TableCell />
                      <TableCell className={classes.colVariantCheckbox}>
                        <Checkbox
                          className={classes.variantCheckbox}
                          checked={selectedVariantsToProductsMap[productIndex][variantIndex]}
                          disabled={loading}
                          onChange={() =>
                            handleVariantAssign(
                              variant,
                              product,
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
                  ))}
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
