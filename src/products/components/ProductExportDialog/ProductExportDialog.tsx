// @ts-strict-ignore
import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import {
  type ChannelFragment,
  type ExportErrorFragment,
  type ExportProductsInput,
  type SearchAttributesQuery,
  type WarehouseFragment,
} from "@dashboard/graphql";
import useForm, { type FormChange } from "@dashboard/hooks/useForm";
import useModalDialogErrors from "@dashboard/hooks/useModalDialogErrors";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import useWizard from "@dashboard/hooks/useWizard";
import { buttonMessages } from "@dashboard/intl";
import { type DialogProps, type FetchMoreProps, type RelayToFlat } from "@dashboard/types";
import getExportErrorMessage from "@dashboard/utils/errors/export";
import { toggle } from "@dashboard/utils/lists";
import { mapNodeToChoice } from "@dashboard/utils/maps";
import { Box, Button, type Option, Text } from "@saleor/macaw-ui-next";
import { useMemo, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import {
  ExportDialogSettings,
  type ExportItemsQuantity,
  getFilteredItemsScopeLabel,
} from "./ExportDialogSettings";
import { productExportDialogMessages as messages } from "./messages";
import ProductExportDialogInfo, {
  attributeNamePrefix,
  warehouseNamePrefix,
} from "./ProductExportDialogInfo";
import { exportSettingsInitialFormData } from "./types";

enum ProductExportStep {
  INFO = 0,
  SETTINGS = 1,
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

export interface ProductExportDialogProps extends DialogProps, FetchMoreProps {
  attributes: RelayToFlat<SearchAttributesQuery["search"]>;
  channels: ChannelFragment[];
  confirmButtonState: ConfirmButtonTransitionState;
  errors: ExportErrorFragment[];
  productQuantity: ExportItemsQuantity;
  selectedProducts: number;
  hasListFilters: boolean;
  warehouses: WarehouseFragment[];
  onFetch: (query: string) => void;
  onSubmit: (data: ExportProductsInput) => void;
}

export const ProductExportDialog = ({
  attributes,
  channels,
  confirmButtonState,
  errors,
  productQuantity,
  onClose,
  onSubmit,
  open,
  selectedProducts,
  hasListFilters,
  warehouses,
  ...fetchMoreProps
}: ProductExportDialogProps): JSX.Element => {
  const [step, { next, prev, set: setStep }] = useWizard(ProductExportStep.INFO, [
    ProductExportStep.INFO,
    ProductExportStep.SETTINGS,
  ]);
  const dialogErrors = useModalDialogErrors(errors, open);
  const notFormErrors = dialogErrors.filter(err => !err.field);
  const intl = useIntl();
  const isSubmittingRef = useRef(false);
  const isSubmitting = confirmButtonState === "loading";

  isSubmittingRef.current = isSubmitting;

  const [selectedAttributes, setSelectedAttributes] = useState<Option[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<ChannelFragment[]>([]);
  const { change, data, reset, submit } = useForm(initialForm, onSubmit);

  useModalDialogOpen(open, {
    onClose: () => {
      reset();
      setStep(ProductExportStep.INFO);
      setSelectedAttributes([]);
      setSelectedChannels([]);
    },
  });

  const stepItems = useMemo(
    () => [
      {
        label: intl.formatMessage(messages.infoStep),
      },
      {
        label: intl.formatMessage(messages.settingsStep),
      },
    ],
    [intl],
  );

  const handleModalClose = (): void => {
    if (isSubmittingRef.current) {
      return;
    }

    onClose();
  };

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
    filteredItems: getFilteredItemsScopeLabel(intl, productQuantity.filter),
  };

  return (
    <DashboardModal onChange={handleModalClose} open={open}>
      {open ? (
        <DashboardModal.Content size="md">
          <DashboardModal.ContextHeader
            description={
              step === ProductExportStep.INFO ? (
                <FormattedMessage {...messages.infoStepDescription} />
              ) : (
                <FormattedMessage {...messages.settingsStepDescription} />
              )
            }
            steps={{
              current: step + 1,
              items: stepItems,
            }}
          >
            <FormattedMessage {...messages.title} />
          </DashboardModal.ContextHeader>

          <DashboardModal.Body fill>
            <DashboardModal.Inset>
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
                  selectedItems={selectedProducts}
                  exportScopeLabels={exportScopeLabels}
                  hasListFilters={hasListFilters}
                />
              )}

              {notFormErrors.length > 0 && (
                <Box paddingTop={4}>
                  {notFormErrors.map(err => (
                    <Text display="block" color="critical1" key={err.field + err.code}>
                      {getExportErrorMessage(err, intl)}
                    </Text>
                  ))}
                </Box>
              )}
            </DashboardModal.Inset>
          </DashboardModal.Body>

          <DashboardModal.Actions>
            {step === ProductExportStep.INFO ? (
              <>
                <BackButton
                  data-test-id="cancel"
                  disabled={isSubmitting}
                  onClick={handleModalClose}
                >
                  <FormattedMessage {...buttonMessages.cancel} />
                </BackButton>
                <Button
                  data-test-id="next"
                  disabled={isSubmitting}
                  onClick={next}
                  variant="primary"
                >
                  <FormattedMessage {...buttonMessages.nextStep} />
                </Button>
              </>
            ) : (
              <>
                <BackButton data-test-id="back" disabled={isSubmitting} onClick={prev} />
                <ConfirmButton
                  data-test-id="submit"
                  disabled={isSubmitting}
                  onClick={submit}
                  transitionState={confirmButtonState}
                  type="submit"
                >
                  <FormattedMessage {...messages.confirmButtonLabel} />
                </ConfirmButton>
              </>
            )}
          </DashboardModal.Actions>
        </DashboardModal.Content>
      ) : null}
    </DashboardModal>
  );
};

ProductExportDialog.displayName = "ProductExportDialog";
