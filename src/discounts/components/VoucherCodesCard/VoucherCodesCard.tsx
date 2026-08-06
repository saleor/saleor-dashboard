import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { type UseListSettings } from "@dashboard/hooks/useListSettings";
import { type LocalPagination } from "@dashboard/hooks/useLocalPaginator";
import { PaginatorContext } from "@dashboard/hooks/usePaginator";
import { Text } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

import { type VoucherCodesUrlDialog } from "../VoucherCodes/types";
import { VoucherCodesAddButton } from "../VoucherCodesAddButton/VoucherCodesAddButton";
import { type VoucherCode } from "../VoucherCodesDatagrid/types";
import { VoucherCodesDeleteDialog } from "../VoucherCodesDeleteDialog";
import {
  type GenerateMultipleVoucherCodeFormData,
  VoucherCodesGenerateDialog,
} from "../VoucherCodesGenerateDialog";
import { VoucherCodesManualDialog } from "../VoucherCodesManualDialog";
import { VoucherCodesTable } from "../VoucherCodesTable/VoucherCodesTable";

export interface VoucherCodesCardProps {
  codes: VoucherCode[];
  loading?: boolean;
  disabled?: boolean;
  selectedCodesIds: string[];
  voucherCodesPagination: LocalPagination;
  settings: UseListSettings["settings"];
  deleteCodesTransitionState: ConfirmButtonTransitionState;
  onDeleteCodes: () => Promise<boolean>;
  onSelectedCodesChange: (ids: string[]) => void;
  onSettingsChange: UseListSettings["updateListSettings"];
  onMultiCodesGenerate: (data: GenerateMultipleVoucherCodeFormData) => void;
  onCustomCodeGenerate: (code: string) => void;
}

export const VoucherCodesCard = ({
  codes,
  loading,
  disabled,
  selectedCodesIds,
  onSelectedCodesChange,
  onMultiCodesGenerate,
  onCustomCodeGenerate,
  onDeleteCodes,
  deleteCodesTransitionState,
  voucherCodesPagination,
  settings,
  onSettingsChange,
}: VoucherCodesCardProps): JSX.Element => {
  const { pageInfo, ...paginationValues } = voucherCodesPagination;
  const [openModal, setOpenModal] = useState<VoucherCodesUrlDialog | null>(null);
  const closeModal = () => {
    setOpenModal(null);
  };

  const handleDeleteCode = (code: string) => {
    onSelectedCodesChange([code]);
    setOpenModal("delete-codes");
  };

  return (
    <>
      <DetailSettingsCard
        data-test-id="voucher-codes-section"
        title={<FormattedMessage defaultMessage="Voucher codes" id="kVL3LM" />}
        intro={
          <Text size={3} color="default2">
            <FormattedMessage
              id="Xzp951"
              defaultMessage="All codes share the same discount rules. Delete codes you no longer want customers to redeem."
              description="voucher codes section intro"
            />
          </Text>
        }
        headerEnd={
          <VoucherCodesAddButton
            onMultiCodesGenerate={() => setOpenModal("multiple-codes")}
            onSingleCodesGenerate={() => setOpenModal("single-codes")}
          />
        }
        contentFlush
      >
        <PaginatorContext.Provider value={{ ...pageInfo, ...paginationValues }}>
          <VoucherCodesTable
            codes={codes}
            loading={loading}
            disabled={disabled}
            selectedCodesIds={selectedCodesIds}
            onSelectedCodesChange={onSelectedCodesChange}
            onDeleteCode={handleDeleteCode}
            onBulkDelete={() => setOpenModal("delete-codes")}
            settings={settings}
            onSettingsChange={onSettingsChange}
          />
        </PaginatorContext.Provider>
      </DetailSettingsCard>

      <VoucherCodesManualDialog
        open={openModal === "single-codes"}
        confirmButtonTransitionState="default"
        onClose={closeModal}
        onSubmit={onCustomCodeGenerate}
      />
      <VoucherCodesGenerateDialog
        open={openModal === "multiple-codes"}
        onClose={closeModal}
        onSubmit={onMultiCodesGenerate}
      />
      <VoucherCodesDeleteDialog
        onClose={closeModal}
        open={openModal === "delete-codes"}
        confirmButtonTransitionState={deleteCodesTransitionState}
        onDelete={onDeleteCodes}
      />
    </>
  );
};
