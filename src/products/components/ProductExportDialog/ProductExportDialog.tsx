import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import makeCreatorSteps, { Step } from "@saleor/components/CreatorSteps";
import Form from "@saleor/components/Form";
import { ExportErrorFragment } from "@saleor/fragments/types/ExportErrorFragment";
import useModalDialogErrors from "@saleor/hooks/useModalDialogErrors";
import useWizard from "@saleor/hooks/useWizard";
import { buttonMessages } from "@saleor/intl";
import { SearchAttributes_search_edges_node } from "@saleor/searches/types/SearchAttributes";
import { DialogProps, FetchMoreProps } from "@saleor/types";
import {
  ExportProductsInput,
  ExportScope,
  FileTypesEnum
} from "@saleor/types/globalTypes";
import getExportErrorMessage from "@saleor/utils/errors/export";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ProductExportDialogInfo from "./ProductExportDialogInfo";
import ProductExportDialogSettings from "./ProductExportDialogSettings";

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

const initialForm: ExportProductsInput = {
  exportInfo: {
    attributes: [],
    fields: []
  },
  fileType: FileTypesEnum.CSV,
  scope: ExportScope.ALL
};

const ProductExportSteps = makeCreatorSteps<ProductExportStep>();

export interface ProductExportDialogProps extends DialogProps, FetchMoreProps {
  attributes: SearchAttributes_search_edges_node[];
  confirmButtonState: ConfirmButtonTransitionState;
  errors: ExportErrorFragment[];
  selectedProducts: number;
  onFetch: (query: string) => void;
  onSubmit: (data: ExportProductsInput) => void;
}

const ProductExportDialog: React.FC<ProductExportDialogProps> = ({
  confirmButtonState,
  errors,
  onClose,
  onSubmit,
  open,
  selectedProducts,
  ...fetchMoreProps
}) => {
  const [step, { next, prev, set: setStep }] = useWizard(
    ProductExportStep.INFO,
    [ProductExportStep.INFO, ProductExportStep.SETTINGS]
  );
  const steps = useSteps();
  const dialogErrors = useModalDialogErrors(errors, open);
  const notFormErrors = dialogErrors.filter(err => !err.field);
  const intl = useIntl();

  return (
    <Dialog onClose={onClose} open={open} maxWidth="sm" fullWidth>
      <Form initial={initialForm} onSubmit={onSubmit}>
        {({ change, data }) => (
          <>
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
              {step === ProductExportStep.INFO && (
                <ProductExportDialogInfo
                  data={data}
                  onChange={change}
                  {...fetchMoreProps}
                />
              )}
              {step === ProductExportStep.SETTINGS && (
                <ProductExportDialogSettings
                  data={data}
                  errors={dialogErrors}
                  selectedProducts={selectedProducts}
                  onChange={change}
                />
              )}
            </DialogContent>

            {notFormErrors.length > 0 && (
              <DialogContent>
                {notFormErrors.map(err => (
                  <Typography color="error">
                    {getExportErrorMessage(err, intl)}
                  </Typography>
                ))}
              </DialogContent>
            )}

            <DialogActions>
              {step === ProductExportStep.INFO && (
                <Button onClick={onClose}>
                  <FormattedMessage {...buttonMessages.cancel} />
                </Button>
              )}
              {step === ProductExportStep.SETTINGS && (
                <Button onClick={prev}>
                  <FormattedMessage {...buttonMessages.back} />
                </Button>
              )}
              {step === ProductExportStep.INFO && (
                <Button color="primary" variant="contained" onClick={next}>
                  <FormattedMessage {...buttonMessages.nextStep} />
                </Button>
              )}
              {step === ProductExportStep.SETTINGS && (
                <ConfirmButton
                  transitionState={confirmButtonState}
                  variant="contained"
                  type="submit"
                >
                  <FormattedMessage
                    defaultMessage="export products"
                    description="export products to csv file, button"
                  />
                </ConfirmButton>
              )}
            </DialogActions>
          </>
        )}
      </Form>
    </Dialog>
  );
};

ProductExportDialog.displayName = "ProductExportDialog";
export default ProductExportDialog;
