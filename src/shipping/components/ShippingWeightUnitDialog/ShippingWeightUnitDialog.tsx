import { DashboardModal } from "@dashboard/components/Modal";
import { WeightUnitsEnum } from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import ShippingWeightUnitForm from "../ShippingWeightUnitForm";

interface ShippingWeightUnitDialogProps {
  open: boolean;
  onSubmit: (unit: WeightUnitsEnum | null) => SubmitPromise;
  onClose: () => void;
  defaultWeightUnit: WeightUnitsEnum | null;
  disabled: boolean;
}

export const ShippingWeightUnitDialog: React.FC<ShippingWeightUnitDialogProps> = ({
  open,
  onSubmit,
  onClose,
  defaultWeightUnit,
  disabled,
}) => {
  return (
    <DashboardModal open={open} onChange={onClose}>
      <DashboardModal.Content size="sm">
        <Box alignItems="center" display="flex" gap={3} justifyContent="space-between">
          <DashboardModal.Title>
            <FormattedMessage
              description="weight config modal title"
              defaultMessage="Default weight unit configuration"
              id="9WmA6z"
            />
          </DashboardModal.Title>
          <DashboardModal.Close onClose={onClose} />
        </Box>
        <ShippingWeightUnitForm
          defaultWeightUnit={defaultWeightUnit}
          onSubmit={onSubmit}
          disabled={disabled}
        />
      </DashboardModal.Content>
    </DashboardModal>
  );
};
