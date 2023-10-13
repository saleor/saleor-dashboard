import { BulkDeleteButton } from "@dashboard/components/BulkDeleteButton";
import { UseListSettings } from "@dashboard/hooks/useListSettings";
import { LocalPagination } from "@dashboard/hooks/useLocalPaginator";
import { PaginatorContext } from "@dashboard/hooks/usePaginator";
import { Box, Text } from "@saleor/macaw-ui/next";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";

import { VoucherCodesAddButton } from "../VoucherCodesAddButton/VoucherCodesAddButton";
import {
  VoucherCodesDatagrid,
  VoucherCodesDatagridProps,
} from "../VoucherCodesDatagrid";
import { VoucherCodesDeleteDialog } from "../VoucherCodesDeleteDialog";
import {
  GenerateMultipleVoucherCodeFormData,
  VoucherCodesGenerateDialog,
} from "../VoucherCodesGenerateDialog";
import { VoucherCodesManualDialog } from "../VoucherCodesManualDialog";
import { VoucherCodesUrlDialog } from "./types";

interface VoucherCodesProps extends VoucherCodesDatagridProps {
  selectedCodesIds: string[];
  voucherCodesPagination: LocalPagination;
  settings: UseListSettings["settings"];
  onDeleteCodes: () => void;
  onSelectVoucherCodesIds: (rows: number[], clearSelection: () => void) => void;
  onSettingsChange: UseListSettings["updateListSettings"];
  onMultiCodesGenerate: (data: GenerateMultipleVoucherCodeFormData) => void;
  onCustomCodeGenerate: (code: string) => void;
}

export const VoucherCodes = ({
  selectedCodesIds,
  onMultiCodesGenerate,
  onCustomCodeGenerate,
  onDeleteCodes,
  voucherCodesPagination,
  ...datagridProps
}: VoucherCodesProps) => {
  const { pageInfo, ...paginationValues } = voucherCodesPagination;
  const [openModal, setOpenModal] = useState<VoucherCodesUrlDialog | null>(
    null,
  );

  const closeModal = () => {
    setOpenModal(null);
  };

  return (
    <>
      <PaginatorContext.Provider value={{ ...pageInfo, ...paginationValues }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          marginBottom={4}
          marginTop={8}
          paddingX={6}
        >
          <Text variant="heading">
            <FormattedMessage defaultMessage="Voucher codes" id="kVL3LM" />
          </Text>
          <Box display="flex" gap={3}>
            {selectedCodesIds.length > 0 && (
              <BulkDeleteButton onClick={() => setOpenModal("delete-codes")}>
                <FormattedMessage defaultMessage="Delete codes" id="UJ97Lb" />
              </BulkDeleteButton>
            )}
            <VoucherCodesAddButton
              onMultiCodesGenerate={() => setOpenModal("multiple-codes")}
              onSingleCodesGenerate={() => setOpenModal("single-codes")}
            />
          </Box>
        </Box>

        <VoucherCodesDatagrid {...datagridProps} />
      </PaginatorContext.Provider>

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
        onDelete={onDeleteCodes}
      />
    </>
  );
};
