import BackButton from "@dashboard/components/BackButton";
import { ButtonLink } from "@dashboard/components/ButtonLink/ButtonLink";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { formatMoney } from "@dashboard/components/Money";
import {
  DiscountValueTypeEnum,
  type OrderErrorFragment,
  VoucherTypeEnum,
} from "@dashboard/graphql";
import useLocale from "@dashboard/hooks/useLocale";
import useModalDialogErrors from "@dashboard/hooks/useModalDialogErrors/useModalDialogErrors";
import { buttonMessages } from "@dashboard/intl";
import { type FetchMoreProps } from "@dashboard/types";
import getOrderErrorMessage from "@dashboard/utils/errors/order";
import { Box, DynamicCombobox, Input, type Option, Skeleton, Text } from "@saleor/macaw-ui-next";
import { type ReactNode, useCallback, useMemo, useState } from "react";
import { FormattedMessage, type IntlShape, useIntl } from "react-intl";

import { orderVoucherDialogMessages as messages } from "./messages";
import styles from "./OrderVoucherDialog.module.css";
import {
  getSubmittableCode,
  isCodeUsable,
  type ResolvedState,
  useVoucherPicker,
  type VoucherPicker,
  type VoucherSearchItem,
} from "./useVoucherPicker";

// Staff who can read vouchers pick one from a search; everyone else types the code.
export type VoucherInputMode =
  | {
      kind: "picker";
      vouchers: VoucherSearchItem[];
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

const MAX_CODE_LENGTH = 24;

// Single-use codes are long UUIDs; keep both ends, which is how staff tell them apart.
const middleTruncate = (code: string): string =>
  code.length <= MAX_CODE_LENGTH ? code : `${code.slice(0, 10)}…${code.slice(-10)}`;

const getDiscountSummary = (
  voucher: VoucherSearchItem,
  intl: IntlShape,
  locale: string,
): string | null => {
  if (voucher.type === VoucherTypeEnum.SHIPPING) {
    return intl.formatMessage(messages.freeShipping);
  }

  if (voucher.discountValue === null || voucher.discountValue === undefined) {
    return null;
  }

  if (voucher.discountValueType === DiscountValueTypeEnum.PERCENTAGE) {
    return intl.formatMessage(messages.percentageOff, { value: voucher.discountValue });
  }

  return voucher.currency
    ? intl.formatMessage(messages.fixedOff, {
        value: formatMoney({ amount: voucher.discountValue, currency: voucher.currency }, locale),
      })
    : null;
};

const useVoucherOption = (): ((voucher: VoucherSearchItem) => Option) => {
  const intl = useIntl();
  const { locale } = useLocale();

  return useCallback(
    (voucher: VoucherSearchItem): Option => {
      const summary = getDiscountSummary(voucher, intl, locale);

      return {
        value: voucher.id,
        label: voucher.name || intl.formatMessage(messages.unnamedVoucher),
        endAdornment: summary ? (
          <Text size={2} color="default2" className={styles.discount}>
            {summary}
          </Text>
        ) : undefined,
      };
    },
    [intl, locale],
  );
};

const VoucherCombobox = ({
  mode,
  picker,
  error,
}: {
  mode: Extract<VoucherInputMode, { kind: "picker" }>;
  picker: VoucherPicker;
  error: string | undefined;
}): ReactNode => {
  const intl = useIntl();
  const toOption = useVoucherOption();
  const { state } = picker;
  const selectedVoucher = "voucher" in state ? state.voucher : null;
  // Downshift compares the selected item by reference; a new object per render resets the input.
  const value = useMemo(
    () => (selectedVoucher ? toOption(selectedVoucher) : null),
    [selectedVoucher, toOption],
  );
  const options = mode.vouchers.map(toOption);
  const isEmpty = !mode.fetchMore.loading && mode.vouchers.length === 0;
  const pickerMessage =
    state.status === "noCodes"
      ? messages.noUsableCodes
      : state.status === "loadFailed"
        ? messages.codesLoadFailed
        : undefined;
  const helperText =
    error ??
    (pickerMessage
      ? intl.formatMessage(pickerMessage)
      : isEmpty
        ? intl.formatMessage(messages.noResults)
        : undefined);

  return (
    <DynamicCombobox
      data-test-id="voucher-picker"
      label={intl.formatMessage(messages.voucherLabel)}
      options={options}
      value={value}
      onChange={option =>
        picker.pickVoucher(mode.vouchers.find(voucher => voucher.id === option?.value) ?? null)
      }
      onInputValueChange={mode.onSearch}
      onFocus={() => mode.onSearch("")}
      onScrollEnd={() => {
        if (mode.fetchMore.hasMore) {
          mode.fetchMore.onFetchMore();
        }
      }}
      loading={mode.fetchMore.loading}
      error={!!error || !!pickerMessage}
      helperText={helperText}
    />
  );
};

const CodeCombobox = ({
  state,
  picker,
}: {
  state: ResolvedState;
  picker: VoucherPicker;
}): ReactNode => {
  const intl = useIntl();
  const [query, setQuery] = useState("");
  const value = useMemo<Option>(() => ({ value: state.code, label: state.code }), [state.code]);
  // The codes connection can't be filtered on the server, so the search narrows loaded codes.
  const options: Option[] = state.codes.items
    .filter(item => item.code?.toLowerCase().includes(query.toLowerCase()))
    .map(item => ({
      value: item.code ?? "",
      label: item.code ?? "",
      disabled: !isCodeUsable(item, state.voucher),
    }));

  return (
    <DynamicCombobox
      data-test-id="voucher-code-picker"
      label={intl.formatMessage(messages.codeLabel)}
      options={options}
      value={value}
      onChange={option => {
        if (option) {
          picker.pickCode(option.value);
        }
      }}
      onInputValueChange={setQuery}
      onScrollEnd={() => void picker.loadMoreCodes()}
      loading={state.loadingMoreCodes}
    />
  );
};

const ChosenCode = ({ picker }: { picker: VoucherPicker }): ReactNode => {
  const { state } = picker;

  if (state.status === "resolving") {
    return <Skeleton data-test-id="voucher-code-loading" __width="160px" />;
  }

  if (state.status !== "resolved") {
    return null;
  }

  if (state.changingCode) {
    return <CodeCombobox state={state} picker={picker} />;
  }

  const hasOtherCodes = state.codes.items.length > 1 || state.codes.hasNextPage;

  return (
    <Box display="flex" alignItems="center" gap={2}>
      <Text size={2} color="default2">
        <FormattedMessage {...messages.codeLabel} />
      </Text>
      <Text size={2} className={styles.code} title={state.code} data-test-id="voucher-code">
        {middleTruncate(state.code)}
      </Text>
      {hasOtherCodes && (
        <Text size={2}>
          <ButtonLink data-test-id="change-voucher-code" onClick={picker.changeCode}>
            <FormattedMessage {...messages.changeCode} />
          </ButtonLink>
        </Text>
      )}
    </Box>
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
  // Manual mode keeps the order's code to edit; the picker starts empty.
  const picker = useVoucherPicker(
    mode.kind === "manual" ? { status: "typing", code: currentCode ?? "" } : { status: "idle" },
  );
  const { state } = picker;
  const error = errors.length
    ? errors.map(err => getOrderErrorMessage(err, intl)).join(" ")
    : undefined;
  const code = getSubmittableCode(state);

  return (
    <DashboardModal.Content size="xs" data-test-id="order-voucher-dialog">
      <DashboardModal.Header>
        <FormattedMessage {...(currentCode ? messages.changeTitle : messages.addTitle)} />
      </DashboardModal.Header>
      <DashboardModal.Body>
        <DashboardModal.Inset>
          <Box display="flex" flexDirection="column" gap={3}>
            {state.status === "typing" ? (
              <Input
                data-test-id="voucher-code-input"
                label={intl.formatMessage(messages.codeLabel)}
                value={state.code}
                onChange={event => picker.setTypedCode(event.target.value)}
                error={!!error}
                helperText={error}
                autoFocus
              />
            ) : (
              mode.kind === "picker" && (
                <>
                  <VoucherCombobox mode={mode} picker={picker} error={error} />
                  <ChosenCode picker={picker} />
                </>
              )
            )}
            {mode.kind === "picker" && (
              <Text size={2}>
                {state.status === "typing" ? (
                  <ButtonLink data-test-id="search-vouchers" onClick={picker.searchVouchers}>
                    <FormattedMessage {...messages.searchVouchers} />
                  </ButtonLink>
                ) : (
                  <ButtonLink data-test-id="enter-code-manually" onClick={picker.typeCode}>
                    <FormattedMessage {...messages.enterCodeManually} />
                  </ButtonLink>
                )}
              </Text>
            )}
          </Box>
        </DashboardModal.Inset>
      </DashboardModal.Body>
      <DashboardModal.Actions>
        <BackButton onClick={onClose} />
        <ConfirmButton
          data-test-id="submit"
          transitionState={confirmButtonState}
          disabled={!code}
          onClick={() => onSubmit(code)}
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
