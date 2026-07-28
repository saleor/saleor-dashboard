import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import {
  type ProductSaveStepId,
  type ProductSaveStepResult,
  type ProductSaveStepStatus,
} from "../../views/ProductUpdate/handlers/productSaveSteps";
import { messages } from "./messages";

interface ProductSaveStepsBannerProps {
  steps: ProductSaveStepResult[];
  onDismiss: () => void;
}

const STEP_LABELS: Record<ProductSaveStepId, (typeof messages)[keyof typeof messages]> = {
  files: messages.saveStepFiles,
  product: messages.saveStepProduct,
  channels: messages.saveStepChannels,
  variantDelete: messages.saveStepVariantDelete,
  variantCreate: messages.saveStepVariantCreate,
  variantUpdate: messages.saveStepVariantUpdate,
};

const statusLabel = (status: ProductSaveStepStatus, intl: ReturnType<typeof useIntl>): string => {
  if (status === "success") {
    return intl.formatMessage(messages.saveStepStatusSuccess);
  }

  if (status === "error") {
    return intl.formatMessage(messages.saveStepStatusError);
  }

  return intl.formatMessage(messages.saveStepStatusSkipped);
};

export const ProductSaveStepsBanner = ({ steps, onDismiss }: ProductSaveStepsBannerProps) => {
  const intl = useIntl();
  const relevantSteps = steps.filter(step => step.status !== "skipped");

  if (relevantSteps.length === 0) {
    return null;
  }

  return (
    <Box
      marginBottom={4}
      padding={4}
      borderRadius={4}
      borderWidth={1}
      borderStyle="solid"
      borderColor="default1"
      backgroundColor="default1"
      display="flex"
      flexDirection="column"
      gap={3}
      data-test-id="product-save-steps-banner"
    >
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={3}>
        <Box display="flex" flexDirection="column" gap={1}>
          <Text size={3} fontWeight="medium">
            <FormattedMessage {...messages.saveStepsTitle} />
          </Text>
          <Text size={2} color="default2">
            <FormattedMessage {...messages.saveStepsDescription} />
          </Text>
        </Box>
        <Button
          variant="secondary"
          size="small"
          onClick={onDismiss}
          data-test-id="dismiss-save-steps"
        >
          <FormattedMessage {...messages.saveStepsDismiss} />
        </Button>
      </Box>
      <Box display="flex" flexDirection="column" gap={1}>
        {relevantSteps.map(step => (
          <Box key={step.id} display="flex" justifyContent="space-between" gap={4}>
            <Text size={2}>{intl.formatMessage(STEP_LABELS[step.id])}</Text>
            <Text
              size={2}
              color={step.status === "error" ? "critical1" : "default2"}
              data-test-id={`save-step-${step.id}-${step.status}`}
            >
              {statusLabel(step.status, intl)}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
