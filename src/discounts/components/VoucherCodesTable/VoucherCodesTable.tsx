import { Pagination } from "@dashboard/collections/components/CollectionProducts/Pagination";
import {
  AssignableListCell,
  AssignableListTable,
} from "@dashboard/components/AssignableListTable/AssignableListTable";
import { ASSIGNABLE_LIST_TABLE_CARD_LEADING_INSET } from "@dashboard/components/AssignableListTable/assignableListTableLayout";
import { BulkDeleteButton } from "@dashboard/components/BulkDeleteButton";
import { ProductAvailabilityStatusLabel } from "@dashboard/components/ChannelsAvailabilityDropdown/ProductAvailabilityStatusLabel";
import { CopyableText } from "@dashboard/components/CopyableText/CopyableText";
import { PLACEHOLDER } from "@dashboard/components/Datagrid/const";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { VOUCHER_CODES_PAGINATE_BY } from "@dashboard/config";
import { type UseListSettings } from "@dashboard/hooks/useListSettings";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import { Ticket } from "lucide-react";
import { useCallback, useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { columnsMessages, messages } from "../VoucherCodesDatagrid/messages";
import { type VoucherCode } from "../VoucherCodesDatagrid/types";
import styles from "./VoucherCodesTable.module.css";
import { getVoucherCodeStatusDot, getVoucherCodeStatusLabel } from "./voucherCodeStatus";

interface VoucherCodeRow extends VoucherCode {
  id: string;
}

interface VoucherCodesTableProps {
  codes: VoucherCode[];
  loading?: boolean;
  disabled?: boolean;
  selectedCodesIds: string[];
  onSelectedCodesChange: (ids: string[]) => void;
  onDeleteCode: (code: string) => void;
  onBulkDelete: () => void;
  settings: UseListSettings["settings"];
  onSettingsChange: UseListSettings["updateListSettings"];
}

export const VoucherCodesTable = ({
  codes,
  loading = false,
  disabled,
  selectedCodesIds,
  onSelectedCodesChange,
  onDeleteCode,
  onBulkDelete,
  settings,
  onSettingsChange,
}: VoucherCodesTableProps): JSX.Element => {
  const intl = useIntl();
  const rows: VoucherCodeRow[] | undefined = useMemo(() => {
    if (loading && codes.length === 0) {
      return undefined;
    }

    return codes.map(code => ({
      ...code,
      id: code.code,
    }));
  }, [codes, loading]);

  const isChecked = useCallback((id: string) => selectedCodesIds.includes(id), [selectedCodesIds]);

  const toggle = useCallback(
    (id: string) => {
      if (selectedCodesIds.includes(id)) {
        onSelectedCodesChange(selectedCodesIds.filter(selectedId => selectedId !== id));

        return;
      }

      onSelectedCodesChange([...selectedCodesIds, id]);
    },
    [onSelectedCodesChange, selectedCodesIds],
  );

  const toggleAll = useCallback(
    (items: VoucherCodeRow[], selected: number) => {
      if (selected === items.length) {
        onSelectedCodesChange([]);

        return;
      }

      onSelectedCodesChange(items.map(item => item.id));
    },
    [onSelectedCodesChange],
  );

  // Table-shaped shell (header + row + pagination) — not a single anonymous bar.
  if (loading && codes.length === 0) {
    return (
      <Box data-test-id="voucher-codes-table-skeleton" aria-busy="true">
        <Box
          paddingX={ASSIGNABLE_LIST_TABLE_CARD_LEADING_INSET}
          paddingY={3}
          display="flex"
          flexDirection="column"
          gap={3}
        >
          <Box display="flex" alignItems="center" gap={4}>
            <Skeleton __width="1rem" __height="1rem" />
            <Skeleton __width="3.5rem" __height="0.875rem" />
            <Skeleton __width="3.5rem" __height="0.875rem" />
            <Box __marginLeft="auto">
              <Skeleton __width="3rem" __height="0.875rem" />
            </Box>
          </Box>
          <Skeleton __height="3rem" borderRadius={2} />
        </Box>
        <Box
          paddingX={ASSIGNABLE_LIST_TABLE_CARD_LEADING_INSET}
          paddingY={3}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={3}
        >
          <Skeleton __width="7rem" __height="1.5rem" />
          <Skeleton __width="5rem" __height="1.5rem" />
        </Box>
      </Box>
    );
  }

  return (
    <>
      <AssignableListTable<VoucherCodeRow>
        data-test-id="voucher-codes-table"
        rowTestId="voucher-code-row"
        leadingInset={ASSIGNABLE_LIST_TABLE_CARD_LEADING_INSET}
        items={rows}
        disabled={disabled || loading}
        selected={selectedCodesIds.length}
        isChecked={isChecked}
        toggle={toggle}
        toggleAll={toggleAll}
        onUnassign={onDeleteCode}
        emptyMessage={<FormattedMessage {...messages.empty} />}
        emptyIcon={
          <Box color="default2" display="flex" aria-hidden>
            <Ticket size={iconSize.large} strokeWidth={iconStrokeWidthBySize.large} />
          </Box>
        }
        columns={[
          {
            id: "code",
            // Flexible remainder — avoid mixing % with rem or Status/Usage get crushed.
            header: <FormattedMessage {...columnsMessages.code} />,
          },
          {
            id: "status",
            width: "9rem",
            header: <FormattedMessage {...columnsMessages.status} />,
            hideHeaderWhenSelected: true,
          },
          {
            id: "usage",
            width: "7rem",
            align: "end",
            header: <FormattedMessage {...columnsMessages.usage} />,
            hideHeaderWhenSelected: true,
          },
        ]}
        renderCells={code => (
          <>
            <AssignableListCell truncate>
              <Box className={styles.codeCell}>
                <CopyableText text={code.code}>
                  <Text
                    ellipsis
                    display="block"
                    size={3}
                    fontWeight="medium"
                    className={styles.codeText}
                    minWidth={0}
                  >
                    {code.code}
                  </Text>
                </CopyableText>
              </Box>
            </AssignableListCell>
            <AssignableListCell>
              <ProductAvailabilityStatusLabel
                label={getVoucherCodeStatusLabel(code.isActive, intl)}
                status={getVoucherCodeStatusDot(code.isActive)}
                ellipsis={false}
              />
            </AssignableListCell>
            <AssignableListCell align="end">
              <Text size={2} color="default2">
                {code.used?.toString() ?? PLACEHOLDER}
              </Text>
            </AssignableListCell>
          </>
        )}
      />
      {codes.length > 0 ? (
        <Pagination
          numberOfRows={settings?.rowNumber ?? VOUCHER_CODES_PAGINATE_BY}
          onUpdateListSettings={onSettingsChange}
          paddingLeft={ASSIGNABLE_LIST_TABLE_CARD_LEADING_INSET}
          beforePagination={
            selectedCodesIds.length > 0 ? (
              <BulkDeleteButton onClick={onBulkDelete}>
                <FormattedMessage defaultMessage="Delete codes" id="UJ97Lb" />
              </BulkDeleteButton>
            ) : null
          }
        />
      ) : null}
    </>
  );
};

VoucherCodesTable.displayName = "VoucherCodesTable";
