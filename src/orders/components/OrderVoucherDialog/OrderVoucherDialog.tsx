import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { type OrderErrorFragment } from "@dashboard/graphql";
import useModalDialogErrors from "@dashboard/hooks/useModalDialogErrors/useModalDialogErrors";
import { buttonMessages } from "@dashboard/intl";
import { type FetchMoreProps } from "@dashboard/types";
import getOrderErrorMessage from "@dashboard/utils/errors/order";
import { DynamicCombobox, Input, type Option } from "@saleor/macaw-ui-next";
import { type ReactNode, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { orderVoucherDialogMessages as messages } from "./messages";

// Staff who can read vouchers pick a code from a search; everyone else types it.
export type VoucherInputMode =
  | {
      kind: "picker";
      options: Option[];
      onSearch: (query: string) => void;
      fetchMore: FetchMoreProps;
    }
  | { kind: "manual" };

interface OrderVoucherDialogProps {
  open: boolean;
  mode: VoucherInputMode;
  currentCode: string | null;
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  onClose: () => void;
  onSubmit: (voucherCode: string) => void;
}

type ContentProps = Omit<OrderVoucherDialogProps, "open">;

const VoucherCodePicker = ({
  mode,
  code,
  error,
  onChange,
}: {
  mode: Extract<VoucherInputMode, { kind: "picker" }>;
  code: string;
  error: string | undefined;
  onChange: (code: string) => void;
}): ReactNode => {
  const intl = useIntl();
  // Downshift compares the selected item by reference; a new object per render resets the input.
  const value = useMemo<Option | null>(() => (code ? { value: code, label: code } : null), [code]);
  const isEmpty = !mode.fetchMore.loading && mode.options.length === 0;

  return (
    <DynamicCombobox
      data-test-id="voucher-code-picker"
      label={intl.formatMessage(messages.codeLabel)}
      options={mode.options}
      value={value}
      onChange={option => onChange(option?.value ?? "")}
      onInputValueChange={mode.onSearch}
      onFocus={() => mode.onSearch("")}
      onScrollEnd={() => {
        if (mode.fetchMore.hasMore) {
          mode.fetchMore.onFetchMore();
        }
      }}
      loading={mode.fetchMore.loading}
      error={!!error}
      helperText={error ?? (isEmpty ? intl.formatMessage(messages.noResults) : undefined)}
    />
  );
};

const OrderVoucherDialogContent = ({
  mode,
  currentCode,
  confirmButtonState,
  errors,
  onClose,
  onSubmit,
}: ContentProps): ReactNode => {
  const intl = useIntl();
  const [code, setCode] = useState(currentCode ?? "");
  const error = errors.length
    ? errors.map(err => getOrderErrorMessage(err, intl)).join(" ")
    : undefined;
  const trimmedCode = code.trim();

  return (
    <DashboardModal.Content size="xs" data-test-id="order-voucher-dialog">
      <DashboardModal.Header>
        <FormattedMessage {...(currentCode ? messages.changeTitle : messages.addTitle)} />
      </DashboardModal.Header>
      <DashboardModal.Body>
        {mode.kind === "picker" ? (
          <VoucherCodePicker mode={mode} code={code} error={error} onChange={setCode} />
        ) : (
          <Input
            data-test-id="voucher-code-input"
            label={intl.formatMessage(messages.codeLabel)}
            value={code}
            onChange={event => setCode(event.target.value)}
            error={!!error}
            helperText={error}
            autoFocus
          />
        )}
      </DashboardModal.Body>
      <DashboardModal.Actions>
        <BackButton onClick={onClose} />
        <ConfirmButton
          data-test-id="submit"
          transitionState={confirmButtonState}
          disabled={!trimmedCode}
          onClick={() => onSubmit(trimmedCode)}
        >
          <FormattedMessage {...buttonMessages.apply} />
        </ConfirmButton>
      </DashboardModal.Actions>
    </DashboardModal.Content>
  );
};

export const OrderVoucherDialog = ({
  open,
  errors,
  ...props
}: OrderVoucherDialogProps): ReactNode => {
  const dialogErrors = useModalDialogErrors(errors, open);

  return (
    <DashboardModal onChange={props.onClose} open={open}>
      {open && <OrderVoucherDialogContent errors={dialogErrors} {...props} />}
    </DashboardModal>
  );
};
