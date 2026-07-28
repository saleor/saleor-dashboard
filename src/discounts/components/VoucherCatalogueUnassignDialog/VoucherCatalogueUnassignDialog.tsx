import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { Box } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

export type VoucherCatalogueUnassignType = "category" | "collection" | "product" | "variant";

interface VoucherCatalogueUnassignDialogProps {
  catalogueType: VoucherCatalogueUnassignType;
  confirmButtonState: ConfirmButtonTransitionState;
  count: number;
  onClose: () => void;
  onConfirm: () => void;
  open: boolean;
}

const getSubtitle = (catalogueType: VoucherCatalogueUnassignType, count: number): JSX.Element => {
  const values = {
    counter: count,
    displayQuantity: <strong>{count}</strong>,
  };

  switch (catalogueType) {
    case "category":
      return (
        <FormattedMessage
          description="dialog content"
          id="GiJm1v"
          defaultMessage="{counter,plural,one{Are you sure you want to unassign this category?} other{Are you sure you want to unassign {displayQuantity} categories?}}"
          values={values}
        />
      );
    case "collection":
      return (
        <FormattedMessage
          description="dialog content"
          id="UjoSZB"
          defaultMessage="{counter,plural,one{Are you sure you want to unassign this collection?} other{Are you sure you want to unassign {displayQuantity} collections?}}"
          values={values}
        />
      );
    case "product":
      return (
        <FormattedMessage
          description="dialog content"
          id="AHK0K9"
          defaultMessage="{counter,plural,one{Are you sure you want to unassign this product?} other{Are you sure you want to unassign {displayQuantity} products?}}"
          values={values}
        />
      );
    case "variant":
      return (
        <FormattedMessage
          description="dialog content"
          id="iWyoZn"
          defaultMessage="{counter,plural,one{Are you sure you want to unassign this variant?} other{Are you sure you want to unassign {displayQuantity} variants?}}"
          values={values}
        />
      );
  }
};

const getTitle = (catalogueType: VoucherCatalogueUnassignType): JSX.Element => {
  switch (catalogueType) {
    case "category":
      return (
        <FormattedMessage
          description="dialog header"
          id="LOSNq0"
          defaultMessage="Unassign Categories From Voucher"
        />
      );
    case "collection":
      return (
        <FormattedMessage
          description="dialog header"
          id="MmGlkp"
          defaultMessage="Unassign Collections From Voucher"
        />
      );
    case "product":
      return (
        <FormattedMessage
          description="dialog header"
          id="cKCfSW"
          defaultMessage="Unassign Products From Voucher"
        />
      );
    case "variant":
      return (
        <FormattedMessage
          description="dialog header"
          id="F62RkR"
          defaultMessage="Unassign Variants From Voucher"
        />
      );
  }
};

export const VoucherCatalogueUnassignDialog = ({
  catalogueType,
  confirmButtonState,
  count,
  onClose,
  onConfirm,
  open,
}: VoucherCatalogueUnassignDialogProps): JSX.Element => {
  const isSubmitting = confirmButtonState === "loading";

  const handleClose = (): void => {
    if (isSubmitting) {
      return;
    }

    onClose();
  };

  return (
    <DashboardModal onChange={handleClose} open={open}>
      <DashboardModal.Content size="xs">
        <DashboardModal.Header subtitle={<Box>{getSubtitle(catalogueType, count)}</Box>}>
          {getTitle(catalogueType)}
        </DashboardModal.Header>

        <DashboardModal.Actions>
          <BackButton disabled={isSubmitting} onClick={handleClose} />
          <ConfirmButton
            data-test-id="submit"
            onClick={onConfirm}
            transitionState={confirmButtonState}
          >
            <FormattedMessage description="button" id="cNSLLO" defaultMessage="Unassign and save" />
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

VoucherCatalogueUnassignDialog.displayName = "VoucherCatalogueUnassignDialog";
