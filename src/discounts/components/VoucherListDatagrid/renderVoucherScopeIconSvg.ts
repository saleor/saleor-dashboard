/**
 * Canvas / Datagrid only — SVG markup for voucher scope icons.
 * Paths match Lucide ShoppingBag / Tag / Truck used in VoucherDiscountSection tiles.
 * React UI should keep importing those Lucide icons directly.
 */
import {
  type IconNode,
  iconNodeToSvg,
} from "@dashboard/components/AttributeInputTypeIcon/iconNodeToSvg";
import {
  attributeInputTypeIconPixelSize,
  attributeInputTypeIconStrokeWidthBySize,
} from "@dashboard/components/AttributeInputTypeIcon/types";

export type VoucherScopeIconKind = "entireOrder" | "products" | "shipping";

/** Lucide shopping-bag — keep in sync with VoucherDiscountSection. */
const entireOrderIconNode: IconNode = [
  ["path", { d: "M16 10a4 4 0 0 1-8 0" }],
  ["path", { d: "M3.103 6.034h17.794" }],
  [
    "path",
    {
      d: "M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z",
    },
  ],
];

/** Lucide tag — keep in sync with VoucherDiscountSection. */
const productsIconNode = (color: string): IconNode => [
  [
    "path",
    {
      d: "M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",
    },
  ],
  ["circle", { cx: "7.5", cy: "7.5", r: ".5", fill: color }],
];

/** Lucide truck — keep in sync with VoucherDiscountSection. */
const shippingIconNode: IconNode = [
  ["path", { d: "M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" }],
  ["path", { d: "M15 18H9" }],
  [
    "path",
    {
      d: "M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14",
    },
  ],
  ["circle", { cx: "17", cy: "18", r: "2" }],
  ["circle", { cx: "7", cy: "18", r: "2" }],
];

export const renderVoucherScopeIconSvg = (
  kind: VoucherScopeIconKind,
  size: number = attributeInputTypeIconPixelSize.xsmall,
  color = "currentColor",
): string => {
  const strokeWidth = attributeInputTypeIconStrokeWidthBySize.xsmall;
  const iconNode =
    kind === "products"
      ? productsIconNode(color)
      : kind === "shipping"
        ? shippingIconNode
        : entireOrderIconNode;

  return iconNodeToSvg(iconNode, size, strokeWidth, color);
};
