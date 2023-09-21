import { BulkDeleteButton } from "@dashboard/components/BulkDeleteButton";
import { PaginatorContext } from "@dashboard/hooks/usePaginator";
import { Box, Text } from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage } from "react-intl";

import {
  VoucherCodesAddButton,
  VoucherCodesAddButtonProps,
} from "../VoucherCodesAddButton/VoucherCodesAddButton";
import {
  VoucherCodesDatagrid,
  VoucherCodesDatagridProps,
} from "../VoucherCodesDatagrid";

interface VoucherCodesProps
  extends VoucherCodesAddButtonProps,
    VoucherCodesDatagridProps {
  selectedCodesIds: string[];
  onDeleteCodes: () => void;
  onSelectVoucherCodesIds: (rows: number[], clearSelection: () => void) => void;
  voucherCodesPagination: any;
  onSettingsChange: any;
  settings: any;
}

export const VoucherCodes = ({
  selectedCodesIds,
  onMultiCodesGenerate,
  onSingleCodesGenerate,
  onDeleteCodes,
  voucherCodesPagination,
  ...datagridProps
}: VoucherCodesProps) => {
  const { pageInfo, ...paginationValues } = voucherCodesPagination;

  return (
    <PaginatorContext.Provider value={{ ...pageInfo, ...paginationValues }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom={4}
        paddingX={6}
      >
        <Text variant="heading">
          <FormattedMessage defaultMessage="Voucher codes" id="kVL3LM" />
        </Text>
        <Box display="flex" gap={3}>
          {selectedCodesIds.length > 0 && (
            <BulkDeleteButton onClick={onDeleteCodes}>
              <FormattedMessage defaultMessage="Delete codes" id="UJ97Lb" />
            </BulkDeleteButton>
          )}
          <VoucherCodesAddButton
            onMultiCodesGenerate={onMultiCodesGenerate}
            onSingleCodesGenerate={onSingleCodesGenerate}
          />
        </Box>
      </Box>

      <VoucherCodesDatagrid {...datagridProps} />
    </PaginatorContext.Provider>
  );
};
