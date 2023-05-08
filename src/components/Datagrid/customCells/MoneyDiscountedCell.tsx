import { Locale } from "@dashboard/components/Locale";
import { formatMoneyAmount } from "@dashboard/components/Money";
import OrderDiscountCommonModal from "@dashboard/orders/components/OrderDiscountCommonModal/OrderDiscountCommonModal";
import {
  ORDER_LINE_DISCOUNT,
  OrderDiscountCommonInput,
} from "@dashboard/orders/components/OrderDiscountCommonModal/types";
import { useOrderLineDiscountContext } from "@dashboard/products/components/OrderDiscountProviders/OrderLineDiscountProvider";
import {
  CustomCell,
  CustomRenderer,
  getMiddleCenterBias,
  GridCellKind,
} from "@glideapps/glide-data-grid";
import React, { useCallback } from "react";

interface MoneyDiscountedCellProps {
  readonly kind: "money-discounted-cell";
  readonly currency: string;
  readonly undiscounted?: string | number;
  readonly value: number | string | null;
  readonly lineItemId?: string;
  readonly locale: Locale;
}

export type MoneyDiscuntedCell = CustomCell<MoneyDiscountedCellProps>;

const MoneyDiscountedCellEditor = ({ onFinishedEditing, value }) => {
  const getDiscountProviderValues = useOrderLineDiscountContext();
  const editedLineId = value.data.lineItemId;
  const discountProviderValues = editedLineId
    ? getDiscountProviderValues(editedLineId)
    : null;

  const handleDiscountConfirm = useCallback(
    async (discount: OrderDiscountCommonInput) => {
      await discountProviderValues.addOrderLineDiscount(discount);
      onFinishedEditing(undefined);
    },
    [discountProviderValues, onFinishedEditing],
  );
  const handleDiscountRemove = useCallback(async () => {
    await discountProviderValues.removeOrderLineDiscount();
    onFinishedEditing(undefined);
  }, [discountProviderValues, onFinishedEditing]);

  return (
    <OrderDiscountCommonModal
      onClose={() => onFinishedEditing(undefined)}
      modalType={ORDER_LINE_DISCOUNT}
      maxPrice={discountProviderValues.unitUndiscountedPrice}
      onConfirm={handleDiscountConfirm}
      onRemove={handleDiscountRemove}
      existingDiscount={discountProviderValues.orderLineDiscount}
      confirmStatus={discountProviderValues.orderLineDiscountUpdateStatus}
      removeStatus={discountProviderValues.orderLineDiscountRemoveStatus}
    />
  );
};

export const moneyDiscountedCellRenderer =
  (): CustomRenderer<MoneyDiscuntedCell> => ({
    kind: GridCellKind.Custom,
    isMatch: (c): c is MoneyDiscuntedCell =>
      (c.data as any).kind === "money-discounted-cell",
    draw: (args, cell) => {
      const { ctx, theme, rect } = args;
      const { currency, value, undiscounted, locale } = cell.data;
      const hasValue = value === 0 ? true : !!value;
      const formattedValue = value
        ? formatMoneyAmount({ amount: Number(value), currency }, locale)
        : "-";

      const formattedUndiscounted =
        undiscounted && undiscounted !== value
          ? formatMoneyAmount(
              { amount: Number(undiscounted), currency },
              locale,
            )
          : "";

      const formattedWithDiscount =
        formattedUndiscounted + " " + formattedValue;

      ctx.fillStyle = theme.textDark;
      ctx.textAlign = "right";
      ctx.fillText(
        formattedWithDiscount,
        rect.x + rect.width - 8,
        rect.y + rect.height / 2 + getMiddleCenterBias(ctx, theme),
      );

      // Draw crossed line above price without discount
      if (undiscounted && undiscounted !== value) {
        const { width: totalTextWidth } = ctx.measureText(
          formattedWithDiscount,
        );
        const { width: undiscountedTextWidth } = ctx.measureText(
          formattedUndiscounted,
        );

        ctx.fillRect(
          rect.x + rect.width - 8 - totalTextWidth,
          rect.y + rect.height / 2,
          undiscountedTextWidth,
          1,
        );
      }

      ctx.save();
      ctx.fillStyle = theme.textMedium;
      ctx.textAlign = "left";
      ctx.font = [
        theme.baseFontStyle.replace(/bold/g, "normal"),
        theme.fontFamily,
      ].join(" ");
      ctx.fillText(
        hasValue ? currency : "-",
        rect.x + 8,
        rect.y + rect.height / 2 + getMiddleCenterBias(ctx, theme),
      );
      ctx.restore();
      return true;
    },
    provideEditor: () => ({
      editor: MoneyDiscountedCellEditor,
      styleOverride: {
        padding: "41px 0 0 0",
      },
      disableStyling: true,
    }),
    onPaste: (value, data) => ({
      ...data,
      value: parseFloat(value),
    }),
  });
