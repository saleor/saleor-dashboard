import BackButton from "@dashboard/components/BackButton";
import { DashboardModal } from "@dashboard/components/Modal";
import modalStyles from "@dashboard/components/Modal/DashboardModal.module.css";
import { buttonMessages } from "@dashboard/intl";
import { Box, Button, Modal, Text } from "@saleor/macaw-ui-next";
import { AlertTriangle, X } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "../messages";
import { type LinePriceWaterfall, type PriceWarning } from "../utils/types";
import { PriceWaterfallList } from "./PriceWaterfallList";

interface LinePriceWaterfallModalProps {
  open: boolean;
  waterfall: LinePriceWaterfall | null;
  thumbnailUrl?: string | null;
  productSku?: string | null;
  onClose: () => void;
}

export const LinePriceWaterfallModal = ({
  open,
  waterfall,
  thumbnailUrl,
  productSku,
  onClose,
}: LinePriceWaterfallModalProps) => {
  const intl = useIntl();

  if (!waterfall) return null;

  return (
    <DashboardModal open={open} onChange={onClose}>
      <DashboardModal.Content size="sm" className={modalStyles.modalContent}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          gap={4}
          overflow="hidden"
        >
          <Box display="flex" gap={4} alignItems="center" overflow="hidden" __minWidth={0}>
            {thumbnailUrl && (
              <Box
                as="img"
                src={thumbnailUrl}
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
                <FormattedMessage {...messages.modalTitle} />
              </Text>
              <Text size={2} color="default2" className={modalStyles.truncatedText}>
                {waterfall.productName}
                {waterfall.variantName && ` \u00b7 ${waterfall.variantName}`}
              </Text>
              <Text size={2} color="default2" className={modalStyles.truncatedText}>
                {productSku && (
                  <>
                    <FormattedMessage defaultMessage="SKU" id="k4brJy" />
                    {`: ${productSku} \u00b7 `}
                  </>
                )}
                <FormattedMessage defaultMessage="Qty" id="7gXPhB" />
                {`: ${waterfall.quantity}`}
              </Text>
            </Box>
          </Box>
          <Modal.Close>
            <Button
              data-test-id="close-button"
              icon={<X size={20} />}
              size="small"
              variant="tertiary"
              flexShrink="0"
              aria-label={intl.formatMessage(buttonMessages.close)}
              title={intl.formatMessage(buttonMessages.close)}
            />
          </Modal.Close>
        </Box>

        <PriceWaterfallList waterfall={waterfall} />

        {waterfall.warnings.length > 0 && (
          <Box display="flex" flexDirection="column" gap={2}>
            {waterfall.warnings.map((w, i) => (
              <WarningCallout key={i} warning={w} />
            ))}
          </Box>
        )}

        <DashboardModal.Actions>
          <Box flexGrow="1" />
          <BackButton onClick={onClose}>{intl.formatMessage(buttonMessages.close)}</BackButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

interface WarningCalloutProps {
  warning: PriceWarning;
}

const WarningCallout = ({ warning }: WarningCalloutProps) => {
  const intl = useIntl();
  const message = (() => {
    switch (warning.id) {
      case "manual_overrides_automatic":
        return intl.formatMessage(messages.warningManualOverridesAutomatic);
      case "order_discount_propagated_to_line":
        return intl.formatMessage(messages.warningOrderDiscountPropagated);
    }
  })();

  return (
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
        <AlertTriangle size={16} />
      </Box>
      <Text size={2} color="default2">
        {message}
      </Text>
    </Box>
  );
};
