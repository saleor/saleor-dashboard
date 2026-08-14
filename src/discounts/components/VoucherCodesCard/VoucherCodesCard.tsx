import { AssignableListCard } from "@dashboard/components/AssignableListTable/AssignableListCard";
import { Callout } from "@dashboard/components/Callout/Callout";
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { type DiscountErrorFragment } from "@dashboard/graphql";
import { type UseListSettings } from "@dashboard/hooks/useListSettings";
import { type LocalPagination } from "@dashboard/hooks/useLocalPaginator";
import { PaginatorContext } from "@dashboard/hooks/usePaginator";
import { Box, Text } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

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
import { formatVoucherCodesErrorMessage } from "./voucherCodesErrors";

export interface VoucherCodesCardProps {
  codes: VoucherCode[];
  loading?: boolean;
  disabled?: boolean;
  selectedCodesIds: string[];
  voucherCodesPagination: LocalPagination;
  settings: UseListSettings["settings"];
  deleteCodesTransitionState: ConfirmButtonTransitionState;
  /** Save/mutation errors for the codes section (e.g. ALREADY_EXISTS on addCodes). */
  errors?: DiscountErrorFragment[];
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
  errors = [],
}: VoucherCodesCardProps): JSX.Element => {
  const intl = useIntl();
  const { pageInfo, ...paginationValues } = voucherCodesPagination;
  const [openModal, setOpenModal] = useState<VoucherCodesUrlDialog | null>(null);
  const codesErrorMessage = formatVoucherCodesErrorMessage(errors, intl);
  const closeModal = () => {
    setOpenModal(null);
  };

  const handleDeleteCode = (code: string) => {
    onSelectedCodesChange([code]);
    setOpenModal("delete-codes");
  };

  return (
    <>
      <AssignableListCard
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
      >
        {codesErrorMessage ? (
          <Box paddingX={6} paddingY={4} data-test-id="voucher-codes-error">
            <Callout type="error" title={codesErrorMessage} />
          </Box>
        ) : null}
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
      </AssignableListCard>

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
