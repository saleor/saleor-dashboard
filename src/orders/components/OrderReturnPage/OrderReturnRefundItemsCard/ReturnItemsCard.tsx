// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import Money from "@dashboard/components/Money";
import { QuantityInput } from "@dashboard/components/QuantityInput";
import TableCellAvatar from "@dashboard/components/TableCellAvatar";
import TableRowLink from "@dashboard/components/TableRowLink";
import {
  type OrderDetailsFragment,
  type OrderErrorFragment,
  type OrderLineFragment,
} from "@dashboard/graphql";
import { type FormsetChange } from "@dashboard/hooks/useFormset";
import { getById, renderCollection } from "@dashboard/misc";
import { TableBody, TableCell, TableHead } from "@material-ui/core";
import { makeStyles, ResponsiveTable } from "@saleor/macaw-ui";
import { Button, Checkbox, Skeleton } from "@saleor/macaw-ui-next";
import { type CSSProperties, useState } from "react";
import { FormattedMessage } from "react-intl";

import { OrderCardTitle } from "../../OrderCardTitle/OrderCardTitle";
import { ReasonReferenceModal } from "../../ReasonReferenceModal/ReasonReferenceModal";
import { MaximalButton } from "../components/MaximalButton";
import {
  type FormsetLineReasonData,
  type FormsetQuantityData,
  type FormsetReplacementData,
  type LineReasonValue,
} from "../form";
import { getQuantityDataFromItems, getReplacementDataFromItems } from "../utils";
import { returnItemsCardMessages } from "./messages";
import ProductErrorCell from "./ProductErrorCell";

const useStyles = makeStyles(
  theme => {
    const inputPadding: CSSProperties = {
      paddingBottom: theme.spacing(2),
      paddingTop: theme.spacing(2),
    };

    return {
      cartContent: {
        paddingBottom: 0,
        paddingTop: 0,
      },

      notice: {
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(2),
      },

      quantityField: {
        minWidth: "80px",
      },
      quantityInnerInput: {
        ...inputPadding,
      },
      quantityInnerInputNoRemaining: {
        paddingRight: 0,
      },
      remainingQuantity: {
        ...inputPadding,
        color: theme.palette.text.secondary,
        whiteSpace: "nowrap",
      },
      setMaximalQuantityButton: {
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(2),
        padding: 0,
      },
    };
  },
  { name: "ItemsCard" },
);

interface OrderReturnRefundLinesCardProps {
  onChangeQuantity: FormsetChange<number>;
  fulfilmentId?: string;
  canReplace?: boolean;
  errors: OrderErrorFragment[];
  lines: OrderLineFragment[];
  order: OrderDetailsFragment;
  itemsSelections: FormsetReplacementData;
  itemsQuantities: FormsetQuantityData;
  lineReasons: FormsetLineReasonData;
  onChangeSelected: FormsetChange<boolean>;
  onChangeLineReason: FormsetChange<LineReasonValue>;
  reasonReferenceTypeId: string;
  onSetMaxQuantity: () => any;
}

const ItemsCard = ({
  lines,
  onSetMaxQuantity,
  onChangeQuantity,
  onChangeSelected,
  itemsSelections,
  itemsQuantities,
  lineReasons,
  onChangeLineReason,
  reasonReferenceTypeId,
  fulfilmentId,
  order,
}: OrderReturnRefundLinesCardProps) => {
  const classes = useStyles({});
  const [editedReasonLineId, setEditedReasonLineId] = useState<string | null>(null);
  const handleChangeQuantity = (id: string) => (event: React.ChangeEvent<HTMLInputElement>) =>
    onChangeQuantity(id, parseInt(event.target.value, 10));
  const fulfillment = order?.fulfillments.find(getById(fulfilmentId));
  const editedLineReason = editedReasonLineId
    ? lineReasons.find(getById(editedReasonLineId))?.value
    : undefined;

  return (
    <DashboardCard>
      <OrderCardTitle status={fulfillment?.status} />
      <DashboardCard.Content className={classes.cartContent}>
        <MaximalButton onClick={onSetMaxQuantity} />
      </DashboardCard.Content>
      <ResponsiveTable>
        <TableHead>
          <TableRowLink>
            <TableCell>
              <FormattedMessage
                id="aAAxKp"
                defaultMessage="Product"
                description="table column header"
              />
            </TableCell>
            <TableCell />
            <TableCell align="right">
              <FormattedMessage
                id="Y299ST"
                defaultMessage="Price"
                description="table column header"
              />
            </TableCell>
            <TableCell align="right">
              <FormattedMessage
                id="0qg33z"
                defaultMessage="Return"
                description="table column header"
              />
            </TableCell>
            <TableCell align="center">
              <FormattedMessage
                id="ikM00B"
                defaultMessage="Replace"
                description="table column header"
              />
            </TableCell>
            <TableCell align="center">
              <FormattedMessage {...returnItemsCardMessages.reasonColumn} />
            </TableCell>
          </TableRowLink>
        </TableHead>
        <TableBody>
          {renderCollection(
            lines,
            line => {
              const {
                quantity,
                quantityToFulfill,
                id,
                thumbnail,
                unitPrice,
                productName,
                variant,
              } = line;
              const isValueError = false;
              const { isRefunded, currentQuantity } = getQuantityDataFromItems(itemsQuantities, id);
              const { isSelected } = getReplacementDataFromItems(itemsSelections, id);
              const isReplacable = !!variant && !isRefunded;
              const isReturnable = !!variant;
              const isPreorder = !!variant?.preorder;
              const lineQuantity = fulfilmentId ? quantity : quantityToFulfill;
              const anyLineWithoutVariant = lines.some(({ variant }) => !variant);
              const productNameCellWidth = anyLineWithoutVariant ? "30%" : "50%";

              return (
                <TableRowLink key={id}>
                  <TableCellAvatar
                    thumbnail={thumbnail?.url}
                    style={{ width: productNameCellWidth }}
                  >
                    {productName || <Skeleton />}
                  </TableCellAvatar>
                  <ProductErrorCell hasVariant={isReturnable} />
                  <TableCell align="right">
                    <Money
                      money={{
                        amount: unitPrice.gross.amount,
                        currency: unitPrice.gross.currency,
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    {isReturnable && (
                      <QuantityInput
                        disabled={isPreorder}
                        className={classes.quantityField}
                        data-test-id={"quantityInput" + line?.id}
                        value={currentQuantity}
                        onChange={handleChangeQuantity(id)}
                        max={lineQuantity}
                        min={0}
                        textAlign="right"
                        error={isValueError}
                      />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {isReplacable && !isPreorder && (
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={value => onChangeSelected(id, value as boolean)}
                      />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {isReturnable && (
                      <Button
                        variant="secondary"
                        whiteSpace="nowrap"
                        data-test-id={"lineReasonButton" + id}
                        disabled={!currentQuantity}
                        onClick={() => setEditedReasonLineId(id)}
                      >
                        <FormattedMessage
                          {...(() => {
                            const value = lineReasons.find(getById(id))?.value;

                            return value?.reason || value?.reasonReference
                              ? returnItemsCardMessages.editReason
                              : returnItemsCardMessages.addReason;
                          })()}
                        />
                      </Button>
                    )}
                  </TableCell>
                </TableRowLink>
              );
            },
            () => (
              <TableRowLink>
                <TableCell colSpan={4}>
                  <Skeleton />
                </TableCell>
              </TableRowLink>
            ),
          )}
        </TableBody>
      </ResponsiveTable>
      <ReasonReferenceModal
        open={editedReasonLineId !== null}
        reason={editedLineReason?.reason ?? ""}
        reasonReference={editedLineReason?.reasonReference ?? ""}
        referenceModelTypeId={reasonReferenceTypeId}
        onClose={() => setEditedReasonLineId(null)}
        onConfirm={value => {
          if (editedReasonLineId) {
            onChangeLineReason(editedReasonLineId, value);
          }
        }}
      />
    </DashboardCard>
  );
};

export default ItemsCard;
