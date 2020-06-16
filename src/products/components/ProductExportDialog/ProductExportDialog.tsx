import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import makeCreatorSteps, { Step } from "@saleor/components/CreatorSteps";
import { buttonMessages } from "@saleor/intl";
import { DialogProps } from "@saleor/types";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ProductExportDialogSettings from "./ProductExportDialogSettings";

export interface ProductExportSubmitData {}

export enum ProductExportStep {
  INFO,
  SETTINGS
}

function useSteps(): Array<Step<ProductExportStep>> {
  const intl = useIntl();

  return [
    {
      label: intl.formatMessage({
        defaultMessage: "Information exported",
        description: "product export to csv file, header"
      }),
      value: ProductExportStep.INFO
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Export Settings",
        description: "product export to csv file, header"
      }),
      value: ProductExportStep.SETTINGS
    }
  ];
}

const ProductExportSteps = makeCreatorSteps<ProductExportStep>();

export interface ProductExportDialogProps extends DialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  onSubmit: (data: ProductExportSubmitData) => void;
}

const ProductExportDialog: React.FC<ProductExportDialogProps> = ({
  confirmButtonState,
  onClose,
  onSubmit,
  open
}) => {
  const [step, setStep] = React.useState(ProductExportStep.SETTINGS);
  const steps = useSteps();

  return (
    <Dialog onClose={onClose} open={open} maxWidth="sm" fullWidth>
      <DialogTitle>
        <FormattedMessage
          defaultMessage="Export Information"
          description="export products to csv file, dialog header"
        />
      </DialogTitle>
      <DialogContent>
        <ProductExportSteps
          currentStep={step}
          steps={steps}
          onStepClick={setStep}
        />
        {step === ProductExportStep.SETTINGS && <ProductExportDialogSettings />}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          <FormattedMessage {...buttonMessages.back} />
        </Button>
        <ConfirmButton
          onClick={onSubmit}
          transitionState={confirmButtonState}
          variant="contained"
          type="submit"
        >
          <FormattedMessage
            defaultMessage="export products"
            description="export products to csv file, button"
          />
        </ConfirmButton>
      </DialogActions>
    </Dialog>
  );
};

ProductExportDialog.displayName = "ProductExportDialog";
export default ProductExportDialog;
