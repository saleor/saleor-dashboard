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
    VoucherCodesDatagridProps {}

export const VoucherCodes = ({
  onMultiCodesGenerate,
  onSingleCodesGenerate,
  ...datagridProps
}: VoucherCodesProps) => {
  return (
    <Box>
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
        <VoucherCodesAddButton
          onMultiCodesGenerate={onMultiCodesGenerate}
          onSingleCodesGenerate={onSingleCodesGenerate}
        />
      </Box>

      <VoucherCodesDatagrid {...datagridProps} />
    </Box>
  );
};
