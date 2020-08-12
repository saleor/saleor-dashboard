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
import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";
import { ExportErrorFragment } from "@saleor/fragments/types/ExportErrorFragment";
import useForm, { FormChange } from "@saleor/hooks/useForm";
import useModalDialogErrors from "@saleor/hooks/useModalDialogErrors";
import useModalDialogOpen from "@saleor/hooks/useModalDialogOpen";
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
import { toggle } from "@saleor/utils/lists";
import { mapNodeToChoice } from "@saleor/utils/maps";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ProductExportDialogInfo, {
  attributeNamePrefix
} from "./ProductExportDialogInfo";
import ProductExportDialogSettings, {
  ProductQuantity
} from "./ProductExportDialogSettings";

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
  productQuantity: ProductQuantity;
  selectedProducts: number;
  onFetch: (query: string) => void;
  onSubmit: (data: ExportProductsInput) => void;
}

const ProductExportDialog: React.FC<ProductExportDialogProps> = ({
  attributes,
  confirmButtonState,
  errors,
  productQuantity,
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
  const [selectedAttributes, setSelectedAttributes] = React.useState<
    MultiAutocompleteChoiceType[]
  >([]);
  const { change, data, reset, submit } = useForm(initialForm, onSubmit);

  useModalDialogOpen(open, {
    onClose: () => {
      reset();
      setStep(ProductExportStep.INFO);
    }
  });

  const attributeChoices = mapNodeToChoice(attributes);

  const handleAttributeSelect: FormChange = event => {
    const id = event.target.name.substr(attributeNamePrefix.length);

    change({
      target: {
        name: "exportInfo",
        value: {
          ...data.exportInfo,
          attributes: toggle(id, data.exportInfo.attributes, (a, b) => a === b)
        }
      }
    });

    const choice = attributeChoices.find(choice => choice.value === id);

    setSelectedAttributes(
      toggle(choice, selectedAttributes, (a, b) => a.value === b.value)
    );
  };

  return (
    <Dialog onClose={onClose} open={open} maxWidth="sm" fullWidth>
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
              attributes={attributeChoices}
              data={data}
              selectedAttributes={selectedAttributes}
              onAttrtibuteSelect={handleAttributeSelect}
              onChange={change}
              {...fetchMoreProps}
            />
          )}
          {step === ProductExportStep.SETTINGS && (
            <ProductExportDialogSettings
              data={data}
              errors={dialogErrors}
              productQuantity={productQuantity}
              selectedProducts={selectedProducts}
              onChange={change}
            />
          )}
        </DialogContent>

        {notFormErrors.length > 0 && (
          <DialogContent>
            {notFormErrors.map(err => (
              <Typography color="error" key={err.field + err.code}>
                {getExportErrorMessage(err, intl)}
              </Typography>
            ))}
          </DialogContent>
        )}

        <DialogActions>
          {step === ProductExportStep.INFO && (
            <Button onClick={onClose} data-test="cancel">
              <FormattedMessage {...buttonMessages.cancel} />
            </Button>
          )}
          {step === ProductExportStep.SETTINGS && (
            <Button onClick={prev} data-test="back">
              <FormattedMessage {...buttonMessages.back} />
            </Button>
          )}
          {step === ProductExportStep.INFO && (
            <Button
              color="primary"
              variant="contained"
              onClick={next}
              data-test="next"
            >
              <FormattedMessage {...buttonMessages.nextStep} />
            </Button>
          )}
          {step === ProductExportStep.SETTINGS && (
            <ConfirmButton
              transitionState={confirmButtonState}
              variant="contained"
              type="submit"
              data-test="submit"
              onClick={submit}
            >
              <FormattedMessage
                defaultMessage="export products"
                description="export products to csv file, button"
              />
            </ConfirmButton>
          )}
        </DialogActions>
      </>
    </Dialog>
  );
};

ProductExportDialog.displayName = "ProductExportDialog";
export default ProductExportDialog;
