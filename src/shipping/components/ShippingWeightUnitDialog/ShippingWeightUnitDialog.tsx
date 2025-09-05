import { DashboardModal } from "@dashboard/components/Modal";
import { WeightUnitsEnum } from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import { FormattedMessage } from "react-intl";

import ShippingWeightUnitForm from "../ShippingWeightUnitForm";

interface ShippingWeightUnitDialogProps {
  open: boolean;
  onSubmit: (unit: WeightUnitsEnum | null) => SubmitPromise;
  onClose: () => void;
  defaultWeightUnit: WeightUnitsEnum | null;
  disabled: boolean;
}

export const ShippingWeightUnitDialog = ({
  open,
  onSubmit,
  onClose,
  defaultWeightUnit,
  disabled,
}: ShippingWeightUnitDialogProps) => {
  return (
    <DashboardModal open={open} onChange={onClose}>
      <DashboardModal.Content size="sm">
        <DashboardModal.Header>
          <FormattedMessage
            description="weight config modal title"
            defaultMessage="Default weight unit configuration"
            id="9WmA6z"
          />
        </DashboardModal.Header>
        <ShippingWeightUnitForm
          defaultWeightUnit={defaultWeightUnit}
          onSubmit={onSubmit}
          disabled={disabled}
        />
      </DashboardModal.Content>
    </DashboardModal>
  );
};

export default ShippingWeightUnitDialog;
