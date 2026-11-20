import { useApolloClient } from "@apollo/client";
import {
  type SearchVouchersQuery,
  type VoucherCodeFragment,
  VoucherCodesDocument,
  type VoucherCodesQuery,
  type VoucherCodesQueryVariables,
} from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { useReducer } from "react";

export type VoucherSearchItem = NonNullable<SearchVouchersQuery["search"]>["edges"][number]["node"];

interface VoucherCodesPage {
  items: VoucherCodeFragment[];
  endCursor: string | null;
  hasNextPage: boolean;
}

export type VoucherPickerState =
  | { status: "idle" }
  | { status: "typing"; code: string }
  | { status: "resolving"; voucher: VoucherSearchItem }
  | {
      status: "resolved";
      voucher: VoucherSearchItem;
      code: string;
      codes: VoucherCodesPage;
      loadingMoreCodes: boolean;
      changingCode: boolean;
    }
  | { status: "noCodes"; voucher: VoucherSearchItem }
  | { status: "loadFailed"; voucher: VoucherSearchItem };

type Action =
  | { type: "voucherPicked"; voucher: VoucherSearchItem | null }
  | { type: "codeResolved"; voucherId: string; code: string; codes: VoucherCodesPage }
  | { type: "resolveEnded"; voucherId: string; status: "noCodes" | "loadFailed" }
  | { type: "moreCodesRequested" }
  | { type: "moreCodesLoaded"; voucherId: string; codes: VoucherCodesPage | null }
  | { type: "changeCodeClicked" }
  | { type: "codePicked"; code: string }
  | { type: "typeCodeClicked" }
  | { type: "codeTyped"; code: string }
  | { type: "searchVouchersClicked" };

const CODES_PAGE_SIZE = 100;

export const isCodeUsable = (code: VoucherCodeFragment, voucher: VoucherSearchItem): boolean =>
  !!code.code && !!code.isActive && (!voucher.singleUse || code.used === 0);

export type ResolvedState = Extract<VoucherPickerState, { status: "resolved" }>;
type ResolvedAction = Extract<
  Action,
  { type: "moreCodesRequested" | "moreCodesLoaded" | "changeCodeClicked" | "codePicked" }
>;

const reduceResolved = (state: ResolvedState, action: ResolvedAction): ResolvedState => {
  switch (action.type) {
    case "moreCodesRequested":
      return { ...state, loadingMoreCodes: true };
    case "moreCodesLoaded":
      return {
        ...state,
        loadingMoreCodes: false,
        codes: action.codes
          ? { ...action.codes, items: [...state.codes.items, ...action.codes.items] }
          : state.codes,
      };
    case "changeCodeClicked":
      return { ...state, changingCode: true };
    case "codePicked":
      return { ...state, code: action.code, changingCode: false };
  }
};

const voucherPickerReducer = (state: VoucherPickerState, action: Action): VoucherPickerState => {
  // Results of a lookup started for one voucher are dropped once the staff member picks another.
  if ("voucherId" in action && !("voucher" in state && state.voucher.id === action.voucherId)) {
    return state;
  }

  switch (action.type) {
    case "voucherPicked":
      return action.voucher ? { status: "resolving", voucher: action.voucher } : { status: "idle" };
    case "codeResolved":
      return state.status === "resolving"
        ? {
            status: "resolved",
            voucher: state.voucher,
            code: action.code,
            codes: action.codes,
            loadingMoreCodes: false,
            changingCode: false,
          }
        : state;
    case "resolveEnded":
      return state.status === "resolving"
        ? { status: action.status, voucher: state.voucher }
        : state;
    case "moreCodesRequested":
    case "moreCodesLoaded":
    case "changeCodeClicked":
    case "codePicked":
      return state.status === "resolved" ? reduceResolved(state, action) : state;
    case "typeCodeClicked":
      return { status: "typing", code: "" };
    case "codeTyped":
      return { status: "typing", code: action.code };
    case "searchVouchersClicked":
      return { status: "idle" };
  }
};

export const getSubmittableCode = (state: VoucherPickerState): string => {
  switch (state.status) {
    case "resolved":
      return state.code;
    case "typing":
      return state.code.trim();
    default:
      return "";
  }
};

export interface VoucherPicker {
  state: VoucherPickerState;
  pickVoucher: (voucher: VoucherSearchItem | null) => void;
  loadMoreCodes: () => Promise<void>;
  changeCode: () => void;
  pickCode: (code: string) => void;
  typeCode: () => void;
  setTypedCode: (code: string) => void;
  searchVouchers: () => void;
}

export const useVoucherPicker = (initialState: VoucherPickerState): VoucherPicker => {
  const client = useApolloClient();
  const [state, dispatch] = useReducer(voucherPickerReducer, initialState);

  const fetchCodesPage = async (
    voucherId: string,
    after: string | null,
  ): Promise<VoucherCodesPage> => {
    const { data } = await client.query<VoucherCodesQuery, VoucherCodesQueryVariables>({
      query: VoucherCodesDocument,
      variables: { id: voucherId, first: CODES_PAGE_SIZE, after },
      // `used` changes whenever an order with the code is placed.
      fetchPolicy: "network-only",
    });
    const connection = data.voucher?.codes;

    return {
      items: mapEdgesToItems(connection) ?? [],
      endCursor: connection?.pageInfo.endCursor ?? null,
      hasNextPage: !!connection?.pageInfo.hasNextPage,
    };
  };

  const resolveCode = async (voucher: VoucherSearchItem): Promise<void> => {
    const items: VoucherCodeFragment[] = [];
    let after: string | null = null;

    try {
      for (;;) {
        const page = await fetchCodesPage(voucher.id, after);

        items.push(...page.items);

        const usable = page.items.find(code => isCodeUsable(code, voucher));

        if (usable?.code) {
          dispatch({
            type: "codeResolved",
            voucherId: voucher.id,
            code: usable.code,
            codes: { ...page, items },
          });

          return;
        }

        if (!page.hasNextPage) {
          dispatch({ type: "resolveEnded", voucherId: voucher.id, status: "noCodes" });

          return;
        }

        after = page.endCursor;
      }
    } catch {
      dispatch({ type: "resolveEnded", voucherId: voucher.id, status: "loadFailed" });
    }
  };

  const pickVoucher = (voucher: VoucherSearchItem | null): void => {
    dispatch({ type: "voucherPicked", voucher });

    if (voucher) {
      void resolveCode(voucher);
    }
  };

  const loadMoreCodes = async (): Promise<void> => {
    if (state.status !== "resolved" || state.loadingMoreCodes || !state.codes.hasNextPage) {
      return;
    }

    const voucherId = state.voucher.id;

    dispatch({ type: "moreCodesRequested" });

    try {
      dispatch({
        type: "moreCodesLoaded",
        voucherId,
        codes: await fetchCodesPage(voucherId, state.codes.endCursor),
      });
    } catch {
      dispatch({ type: "moreCodesLoaded", voucherId, codes: null });
    }
  };

  return {
    state,
    pickVoucher,
    loadMoreCodes,
    changeCode: () => dispatch({ type: "changeCodeClicked" }),
    pickCode: (code: string) => dispatch({ type: "codePicked", code }),
    typeCode: () => dispatch({ type: "typeCodeClicked" }),
    setTypedCode: (code: string) => dispatch({ type: "codeTyped", code }),
    searchVouchers: () => dispatch({ type: "searchVouchersClicked" }),
  };
};
