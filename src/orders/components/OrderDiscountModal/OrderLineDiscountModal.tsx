import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import modalStyles from "@dashboard/components/Modal/DashboardModal.module.css";
import { type MoneyFragment } from "@dashboard/graphql";
import { type AutomaticDiscountInfo } from "@dashboard/products/components/OrderDiscountProviders/types";
import { Box, Text } from "@saleor/macaw-ui-next";
import { TicketPercent } from "lucide-react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import { DiscountModalBase } from "./DiscountModalBase";
import { formatDiscountSource } from "./formatDiscountSource";
import { type OrderDiscountCommonInput } from "./types";

const discountMessages = defineMessages({
  helperText: {
    id: "ZaDvwq",
    defaultMessage: "This line is already discounted by {source}.",
    description: "helper text shown in line discount modal when automatic discount is applied",
  },
  helperSubtext: {
    id: "MtBjgE",
    defaultMessage: "A manual discount below will replace the existing one.",
    description:
      "secondary helper text in line discount modal, explaining what happens when a manual discount is added on top of an automatic one",
  },
});

interface OrderLineData {
  productName: string;
  variantName?: string;
  productSku?: string | null;
  quantity: number;
  thumbnail?: { url: string } | null;
}

interface OrderLineDiscountModalProps {
  open: boolean;
  maxPrice: MoneyFragment;
  lineData?: OrderLineData;
  automaticDiscounts?: AutomaticDiscountInfo[];
  existingDiscount?: OrderDiscountCommonInput;
  confirmStatus: ConfirmButtonTransitionState;
  removeStatus: ConfirmButtonTransitionState;
  onConfirm: (discount: OrderDiscountCommonInput) => void;
  onRemove: () => void;
  onClose: () => void;
}

export const OrderLineDiscountModal = ({
  open,
  maxPrice,
  lineData,
  automaticDiscounts = [],
  existingDiscount,
  confirmStatus,
  removeStatus,
  onConfirm,
  onRemove,
  onClose,
}: OrderLineDiscountModalProps) => {
  const intl = useIntl();
  const hasAutomaticDiscount = automaticDiscounts.length > 0;

  const automaticDiscountCallout = hasAutomaticDiscount ? (
    <Box
      display="flex"
      alignItems="flex-start"
      gap={2}
      padding={3}
      borderStyle="solid"
      borderColor="default1"
      borderWidth={1}
      borderRadius={3}
    >
      <Box color="default2" __lineHeight="0" __marginTop="2px" flexShrink="0">
        <TicketPercent size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
      </Box>
      <Box display="flex" flexDirection="column" gap={1}>
        <Text size={2} color="default2">
          {intl.formatMessage(discountMessages.helperText, {
            source: formatDiscountSource(automaticDiscounts, intl),
          })}
        </Text>
        <Text size={2} color="default2">
          {intl.formatMessage(discountMessages.helperSubtext)}
        </Text>
      </Box>
    </Box>
  ) : null;

  const preFormContent = automaticDiscountCallout;

  const header = (
    <Box display="flex" gap={4} alignItems="center" overflow="hidden" __minWidth={0}>
      {lineData?.thumbnail?.url && (
        <Box
          as="img"
          src={lineData.thumbnail.url}
          alt=""
          __width="48px"
          __height="48px"
          objectFit="cover"
          borderRadius={2}
          flexShrink="0"
        />
      )}
      <Box display="flex" flexDirection="column" gap={0.5} overflow="hidden" __minWidth={0}>
        <Text size={5} fontWeight="bold">
          <FormattedMessage
            defaultMessage="Line discount"
            id="SIrDwV"
            description="dialog title for order line discount"
          />
        </Text>
        {lineData && (
          <>
            <Text size={2} color="default2" className={modalStyles.truncatedText}>
              {lineData.productName}
              {lineData.variantName && ` · ${lineData.variantName}`}
            </Text>
            <Text size={2} color="default2" className={modalStyles.truncatedText}>
              {lineData.productSku && (
                <>
                  <FormattedMessage defaultMessage="SKU" id="k4brJy" />
                  {`: ${lineData.productSku} · `}
                </>
              )}
              <FormattedMessage defaultMessage="Qty" id="7gXPhB" />
              {`: ${lineData.quantity}`}
            </Text>
          </>
        )}
      </Box>
    </Box>
  );

  return (
    <DiscountModalBase
      open={open}
      maxPrice={maxPrice}
      existingDiscount={existingDiscount}
      confirmStatus={confirmStatus}
      removeStatus={removeStatus}
      onConfirm={onConfirm}
      onRemove={onRemove}
      onClose={onClose}
      header={header}
      preFormContent={preFormContent}
    />
  );
};
