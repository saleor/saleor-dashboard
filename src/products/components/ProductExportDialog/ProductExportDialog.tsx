// @ts-strict-ignore
import { Button } from "@dashboard/components/Button";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import makeCreatorSteps, { Step } from "@dashboard/components/CreatorSteps";
import { DashboardModal } from "@dashboard/components/Modal";
import {
  ChannelFragment,
  ExportErrorFragment,
  ExportProductsInput,
  SearchAttributesQuery,
  WarehouseFragment,
} from "@dashboard/graphql";
import useForm, { FormChange } from "@dashboard/hooks/useForm";
import useModalDialogErrors from "@dashboard/hooks/useModalDialogErrors";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import useWizard from "@dashboard/hooks/useWizard";
import { buttonMessages } from "@dashboard/intl";
import { DialogProps, FetchMoreProps, RelayToFlat } from "@dashboard/types";
import getExportErrorMessage from "@dashboard/utils/errors/export";
import { toggle } from "@dashboard/utils/lists";
import { mapNodeToChoice } from "@dashboard/utils/maps";
import { Box, Option, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ExportDialogSettings, { ExportItemsQuantity } from "./ExportDialogSettings";
import { productExportDialogMessages as messages } from "./messages";
import ProductExportDialogInfo, {
  attributeNamePrefix,
  warehouseNamePrefix,
} from "./ProductExportDialogInfo";
import { exportSettingsInitialFormData } from "./types";

export enum ProductExportStep {
  INFO = 0,
  SETTINGS = 1,
}

function useSteps(): Array<Step<ProductExportStep>> {
  const intl = useIntl();

  return [
    {
      label: intl.formatMessage({
        id: "/68iG8",
        defaultMessage: "Information exported",
        description: "product export to csv file, header",
      }),
      value: ProductExportStep.INFO,
    },
    {
      label: intl.formatMessage({
        id: "ki7Mr8",
        defaultMessage: "Export Settings",
        description: "product export to csv file, header",
      }),
      value: ProductExportStep.SETTINGS,
    },
  ];
}

const initialForm: ExportProductsInput = {
  exportInfo: {
    attributes: [],
    channels: [],
    fields: [],
    warehouses: [],
  },
  ...exportSettingsInitialFormData,
};
const ProductExportSteps = makeCreatorSteps<ProductExportStep>();

export interface ProductExportDialogProps extends DialogProps, FetchMoreProps {
  attributes: RelayToFlat<SearchAttributesQuery["search"]>;
  channels: ChannelFragment[];
  confirmButtonState: ConfirmButtonTransitionState;
  errors: ExportErrorFragment[];
  productQuantity: ExportItemsQuantity;
  selectedProducts: number;
  warehouses: WarehouseFragment[];
  onFetch: (query: string) => void;
  onSubmit: (data: ExportProductsInput) => void;
}

const ProductExportDialog = ({
  attributes,
  channels,
  confirmButtonState,
  errors,
  productQuantity,
  onClose,
  onSubmit,
  open,
  selectedProducts,
  warehouses,
  ...fetchMoreProps
}: ProductExportDialogProps) => {
  const [step, { next, prev, set: setStep }] = useWizard(ProductExportStep.INFO, [
    ProductExportStep.INFO,
    ProductExportStep.SETTINGS,
  ]);
  const steps = useSteps();
  const dialogErrors = useModalDialogErrors(errors, open);
  const notFormErrors = dialogErrors.filter(err => !err.field);
  const intl = useIntl();
  const [selectedAttributes, setSelectedAttributes] = React.useState<Option[]>([]);
  const [selectedChannels, setSelectedChannels] = React.useState([]);
  const { change, data, reset, submit } = useForm(initialForm, onSubmit);

  useModalDialogOpen(open, {
    onClose: () => {
      reset();
      setStep(ProductExportStep.INFO);
    },
  });

  const attributeChoices = mapNodeToChoice(attributes);
  const warehouseChoices = mapNodeToChoice(warehouses);
  const handleAttributeSelect: FormChange = event => {
    const id = event.target.name.substr(attributeNamePrefix.length);

    change({
      target: {
        name: "exportInfo",
        value: {
          ...data.exportInfo,
          attributes: toggle(id, data.exportInfo.attributes, (a, b) => a === b),
        },
      },
    });

    const choice = attributeChoices.find(choice => choice.value === id);

    setSelectedAttributes(toggle(choice, selectedAttributes, (a, b) => a.value === b.value));
  };
  const handleChannelSelect = (option: ChannelFragment) => {
    change({
      target: {
        name: "exportInfo",
        value: {
          ...data.exportInfo,
          channels: toggle(option.id, data.exportInfo.channels, (a, b) => a === b),
        },
      },
    });

    const choice = channels.find(choice => choice.id === option.id);

    setSelectedChannels(toggle(choice, selectedChannels, (a, b) => a.id === b.id));
  };
  const handleToggleAllChannels = (items: ChannelFragment[], selected: number) => {
    setSelectedChannels(selected === items.length ? [] : channels);
    change({
      target: {
        name: "exportInfo",
        value: {
          ...data.exportInfo,
          channels: selected === items.length ? [] : channels.map(channel => channel.id),
        },
      },
    });
  };
  const handleWarehouseSelect: FormChange = event =>
    change({
      target: {
        name: "exportInfo",
        value: {
          ...data.exportInfo,
          warehouses: toggle(
            event.target.name.substr(warehouseNamePrefix.length),
            data.exportInfo.warehouses,
            (a, b) => a === b,
          ),
        },
      },
    });
  const handleToggleAllWarehouses: FormChange = () =>
    change({
      target: {
        name: "exportInfo",
        value: {
          ...data.exportInfo,
          warehouses:
            data.exportInfo.warehouses.length === warehouses.length
              ? []
              : warehouses.map(warehouse => warehouse.id),
        },
      },
    });
  const exportScopeLabels = {
    allItems: intl.formatMessage(
      {
        id: "xtUXnK",
        defaultMessage: "All products ({number})",
        description: "export all items to csv file",
      },
      {
        number: productQuantity.all || "...",
      },
    ),
    selectedItems: intl.formatMessage(
      {
        id: "qEZ463",
        defaultMessage: "Selected products ({number})",
        description: "export selected items to csv file",
      },
      {
        number: selectedProducts,
      },
    ),
  };

  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="sm">
        <DashboardModal.Header>
          <FormattedMessage {...messages.title} />
        </DashboardModal.Header>

        <ProductExportSteps currentStep={step} steps={steps} onStepClick={setStep} />
        {step === ProductExportStep.INFO && (
          <ProductExportDialogInfo
            attributes={attributeChoices}
            channels={channels}
            data={data}
            selectedChannels={selectedChannels}
            selectedAttributes={selectedAttributes}
            onAttrtibuteSelect={handleAttributeSelect}
            onWarehouseSelect={handleWarehouseSelect}
            onChange={change}
            warehouses={warehouseChoices}
            onChannelSelect={handleChannelSelect}
            onSelectAllChannels={handleToggleAllChannels}
            onSelectAllWarehouses={handleToggleAllWarehouses}
            {...fetchMoreProps}
          />
        )}
        {step === ProductExportStep.SETTINGS && (
          <ExportDialogSettings
            data={data}
            errors={dialogErrors}
            onChange={change}
            itemsQuantity={productQuantity}
            selectedItems={selectedProducts}
            exportScopeLabels={exportScopeLabels}
          />
        )}

        {notFormErrors.length > 0 && (
          <Box>
            {notFormErrors.map(err => (
              <Text display="block" color="critical1" key={err.field + err.code}>
                {getExportErrorMessage(err, intl)}
              </Text>
            ))}
          </Box>
        )}

        <DashboardModal.Actions>
          {step === ProductExportStep.INFO && (
            <Button variant="secondary" color="text" onClick={onClose} data-test-id="cancel">
              <FormattedMessage {...buttonMessages.cancel} />
            </Button>
          )}
          {step === ProductExportStep.SETTINGS && (
            <Button variant="secondary" color="text" onClick={prev} data-test-id="back">
              <FormattedMessage {...buttonMessages.back} />
            </Button>
          )}
          {step === ProductExportStep.INFO && (
            <Button variant="primary" onClick={next} data-test-id="next">
              <FormattedMessage {...buttonMessages.nextStep} />
            </Button>
          )}
          {step === ProductExportStep.SETTINGS && (
            <ConfirmButton
              transitionState={confirmButtonState}
              type="submit"
              data-test-id="submit"
              onClick={submit}
            >
              <FormattedMessage {...messages.confirmButtonLabel} />
            </ConfirmButton>
          )}
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

ProductExportDialog.displayName = "ProductExportDialog";
export default ProductExportDialog;
