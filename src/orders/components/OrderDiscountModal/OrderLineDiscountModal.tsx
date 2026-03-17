import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import modalStyles from "@dashboard/components/Modal/DashboardModal.module.css";
import { type MoneyFragment } from "@dashboard/graphql";
import { Box, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import { DiscountModalBase } from "./DiscountModalBase";
import { type OrderDiscountCommonInput } from "./types";

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
  existingDiscount,
  confirmStatus,
  removeStatus,
  onConfirm,
  onRemove,
  onClose,
}: OrderLineDiscountModalProps) => {
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
    />
  );
};
