import { FetchResult, MutationFunction, MutationResult } from "@apollo/client";
import {
  AddressInput,
  CountryCode,
  OrderChargeStatusEnum,
  OrderStatus,
  OrderStatusFilter,
  PaymentChargeStatusEnum,
} from "@dashboard/graphql";
import {
  MutationResultAdditionalProps,
  Node,
  PartialMutationProviderOutput,
  SlugNode,
  StatusType,
  UserError,
} from "@dashboard/types";
import { DefaultTheme, ThemeTokensValues } from "@saleor/macaw-ui-next";
import Fuse from "fuse.js";
import moment from "moment-timezone";
import { IntlShape } from "react-intl";

import { ConfirmButtonTransitionState } from "./components/ConfirmButton";
import {
  hueToPillColorDark,
  hueToPillColorLight,
} from "./components/Datagrid/customCells/PillCell";
import { DotStatus } from "./components/StatusDot/StatusDot";
import { AddressType, AddressTypeInput } from "./customers/types";
import {
  commonStatusMessages,
  errorMessages,
  orderStatusMessages,
  paymentStatusMessages,
} from "./intl";

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  { [K in Keys]-?: Required<Pick<T, K>> }[Keys];

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>>;
  }[Keys];

export function renderCollection<T>(
  collection: T[] | undefined,
  renderItem: (item: T | undefined, index: number | undefined, collection: T[] | undefined) => any,
  renderEmpty?: (collection: T[]) => any,
) {
  if (collection === undefined) {
    return renderItem(undefined, undefined, collection);
  }

  if (collection.length === 0) {
    return renderEmpty ? renderEmpty(collection) : null;
  }

  return collection.map(renderItem);
}

export function weight(value: string) {
  return value === "" ? null : parseFloat(value);
}

export const transformPaymentStatus = (
  status: string,
  intl: IntlShape,
): { localized: string; status: StatusType } => {
  switch (status) {
    case PaymentChargeStatusEnum.PARTIALLY_CHARGED:
      return {
        localized: intl.formatMessage(paymentStatusMessages.partiallyPaid),
        status: StatusType.INFO,
      };
    case PaymentChargeStatusEnum.FULLY_CHARGED:
      return {
        localized: intl.formatMessage(paymentStatusMessages.paid),
        status: StatusType.SUCCESS,
      };
    case PaymentChargeStatusEnum.PARTIALLY_REFUNDED:
      return {
        localized: intl.formatMessage(paymentStatusMessages.partiallyRefunded),
        status: StatusType.ATTENTION,
      };
    case PaymentChargeStatusEnum.FULLY_REFUNDED:
      return {
        localized: intl.formatMessage(paymentStatusMessages.refunded),
        status: StatusType.NEUTRAL,
      };
    case PaymentChargeStatusEnum.PENDING:
      return {
        localized: intl.formatMessage(paymentStatusMessages.pending),
        status: StatusType.WARNING,
      };
    case PaymentChargeStatusEnum.REFUSED:
      return {
        localized: intl.formatMessage(paymentStatusMessages.refused),
        status: StatusType.ERROR,
      };
    case PaymentChargeStatusEnum.CANCELLED:
      return {
        localized: intl.formatMessage(commonStatusMessages.cancelled),
        status: StatusType.ERROR,
      };
    case PaymentChargeStatusEnum.NOT_CHARGED:
      return {
        localized: intl.formatMessage(paymentStatusMessages.unpaid),
        status: StatusType.NEUTRAL,
      };
  }

  return {
    localized: status,
    status: StatusType.ERROR,
  };
};

export const transformChargedStatus = (status: OrderChargeStatusEnum, intl: IntlShape) => {
  switch (status) {
    case OrderChargeStatusEnum.OVERCHARGED:
      return {
        localized: intl.formatMessage({
          defaultMessage: "Overcharged",
          id: "4VLj3S",
          description: "overcharged order status",
        }),
        status: StatusType.WARNING,
      };
    default:
      return {
        localized: status,
        status: StatusType.ERROR,
      };
  }
};

export const transformOrderStatus = (
  status: string,
  intl: IntlShape,
): { localized: string; status: StatusType } => {
  switch (status) {
    case OrderStatus.FULFILLED:
      return {
        localized: intl.formatMessage(orderStatusMessages.fulfilled),
        status: StatusType.SUCCESS,
      };
    case OrderStatus.PARTIALLY_FULFILLED:
      return {
        localized: intl.formatMessage(orderStatusMessages.partiallyFulfilled),
        status: StatusType.INFO,
      };
    case OrderStatus.UNFULFILLED:
      return {
        localized: intl.formatMessage(orderStatusMessages.unfulfilled),
        status: StatusType.WARNING,
      };
    case OrderStatus.CANCELED:
      return {
        localized: intl.formatMessage(commonStatusMessages.cancelled),
        status: StatusType.ERROR,
      };
    case OrderStatus.DRAFT:
      return {
        localized: intl.formatMessage(orderStatusMessages.draft),
        status: StatusType.NEUTRAL,
      };
    case OrderStatus.UNCONFIRMED:
      return {
        localized: intl.formatMessage(orderStatusMessages.unconfirmed),
        status: StatusType.NEUTRAL,
      };
    case OrderStatus.PARTIALLY_RETURNED:
      return {
        localized: intl.formatMessage(orderStatusMessages.partiallyReturned),
        status: StatusType.ATTENTION,
      };
    case OrderStatus.RETURNED:
      return {
        localized: intl.formatMessage(orderStatusMessages.returned),
        status: StatusType.NEUTRAL,
      };
    case OrderStatusFilter.READY_TO_CAPTURE:
      return {
        localized: intl.formatMessage(orderStatusMessages.readyToCapture),
        status: StatusType.INFO,
      };
    case OrderStatusFilter.READY_TO_FULFILL:
      return {
        localized: intl.formatMessage(orderStatusMessages.readyToFulfill),
        status: StatusType.INFO,
      };
    case OrderStatus.EXPIRED:
      return {
        localized: intl.formatMessage(orderStatusMessages.expired),
        status: StatusType.NEUTRAL,
      };
  }

  return {
    localized: status,
    status: StatusType.ERROR,
  };
};

export const transformAddressToForm = (data?: AddressType) => ({
  city: data?.city || "",
  cityArea: data?.cityArea || "",
  companyName: data?.companyName || "",
  country: data?.country?.code || "",
  countryArea: data?.countryArea || "",
  firstName: data?.firstName || "",
  lastName: data?.lastName || "",
  phone: data?.phone || "",
  postalCode: data?.postalCode || "",
  streetAddress1: data?.streetAddress1 || "",
  streetAddress2: data?.streetAddress2 || "",
});

export function maybe<T>(exp: () => T): T | undefined;
export function maybe<T>(exp: () => T, d: T): T;
export function maybe(exp: any, d?: any) {
  try {
    const result = exp();

    return result === undefined ? d : result;
  } catch {
    return d;
  }
}

function hasErrors(errorList: UserError[] | null): boolean {
  return !(errorList === undefined || errorList === null || errorList.length === 0);
}

export function getMutationState(
  called: boolean,
  loading: boolean,
  ...errorList: any[][]
): ConfirmButtonTransitionState {
  if (loading) {
    return "loading";
  }

  if (called) {
    return errorList.map(hasErrors).reduce((acc, curr) => acc || curr, false) ? "error" : "success";
  }

  return "default";
}

interface SaleorMutationResult {
  errors?: any[];
}

type InferPromiseResult<T> = T extends Promise<infer V> ? V : never;

export const extractMutationErrors = async <
  TData extends InferPromiseResult<TPromise>,
  TPromise extends Promise<FetchResult<TData>>,
  TErrors extends ReturnType<typeof getMutationErrors>,
>(
  submitPromise: TPromise,
): Promise<TErrors> => {
  const result = await submitPromise;
  const e = getMutationErrors(result);

  return e as TErrors;
};

export const getMutationErrors = <
  T extends FetchResult<any>,
  TData extends T["data"],
  TErrors extends TData[keyof TData]["errors"],
>(
  result: T,
): TErrors[] => {
  if (!result?.data) {
    return [] as TErrors;
  }

  return Object.values<TData>(result.data).reduce(
    (acc: TErrors[], mut) => [
      ...acc,
      ...(mut.errors || []),
      ...(mut?.results?.flatMap((res: { errors: TErrors[] }) => res.errors) || []),
    ],
    [] as TErrors[],
  ) as TErrors;
};

export function getMutationStatus<TData extends Record<string, SaleorMutationResult | any>>(
  opts: MutationResult<TData>,
): ConfirmButtonTransitionState {
  const errors = getMutationErrors(opts);

  return getMutationState(opts.called, opts.loading, errors);
}

export function getMutationProviderData<TData extends object, TVariables extends object>(
  mutateFn: MutationFunction<TData, TVariables>,
  opts: MutationResult<TData> & MutationResultAdditionalProps,
): PartialMutationProviderOutput<TData, TVariables> {
  return {
    mutate: variables => mutateFn({ variables }),
    opts,
  };
}

export const parseLogMessage = ({
  intl,
  code,
  field,
  voucherCodes,
}: {
  intl: IntlShape;
  code: string;
  field?: string;
  voucherCodes?: string[];
}) => {
  if (voucherCodes) {
    return (
      intl.formatMessage(
        voucherCodes.length > 1
          ? errorMessages.voucherCodesErrorMessage
          : errorMessages.voucherCodeErrorMessage,
      ) +
      ": \n" +
      voucherCodes.join("\n")
    );
  }

  return intl.formatMessage(errorMessages.baseCodeErrorMessage, {
    errorCode: code,
    fieldError:
      field &&
      intl.formatMessage(errorMessages.codeErrorFieldMessage, {
        fieldName: field,
      }),
  });
};

export interface User {
  email: string;
  firstName?: string;
  lastName?: string;
}

export function getUserName(user: User | null | undefined, returnEmail?: boolean) {
  return user && (user.email || (user.firstName && user.lastName))
    ? user.firstName && user.lastName
      ? [user.firstName, user.lastName].join(" ")
      : returnEmail
        ? user.email
        : user.email.split("@")[0]
    : undefined;
}

export function getUserInitials(user?: User) {
  const hasName = user?.firstName && user?.lastName;
  const hasEmail = !!user?.email;

  if (hasName) {
    return `${user.firstName![0] + user.lastName![0]}`.toUpperCase();
  }

  if (hasEmail) {
    return user.email.slice(0, 2).toUpperCase();
  }

  return undefined;
}

interface AnyEventWithPropagation {
  stopPropagation: () => void;
}
export function stopPropagation<T extends AnyEventWithPropagation>(cb: (event?: T) => void) {
  return (event: T) => {
    event.stopPropagation();
    cb(event);
  };
}

export function joinDateTime(date: string, time?: string) {
  if (!date) {
    return null;
  }

  const setTime = time || "00:00";
  const dateTime = moment(date + " " + setTime).format();

  return dateTime;
}

export function splitDateTime(dateTime: string) {
  if (!dateTime) {
    return {
      date: "",
      time: "",
    };
  }

  // Default html input format YYYY-MM-DD HH:mm
  const splitDateTime = moment(dateTime).format("YYYY-MM-DD HH:mm").split(" ");

  return {
    date: splitDateTime[0],
    time: splitDateTime[1],
  };
}

export function findInEnum<TEnum extends {}>(needle: string, haystack: TEnum) {
  const match = Object.keys(haystack).find(key => key === needle);

  if (match) {
    return haystack[needle as keyof TEnum];
  }

  throw new Error(`Key ${needle} not found in enum`);
}

export function findValueInEnum<TEnum extends {}>(
  needle: string,
  haystack: TEnum,
): TEnum[keyof TEnum] {
  const match = Object.entries(haystack).find(([_, value]) => value === needle);

  if (!match) {
    throw new Error(`Value ${needle} not found in enum`);
  }

  return needle as unknown as TEnum[keyof TEnum];
}

export function parseBoolean(a: string | undefined, defaultValue: boolean): boolean {
  if (a === undefined) {
    return defaultValue;
  }

  return a === "true";
}

export function capitalize(s: string) {
  return s.charAt(0).toLocaleUpperCase() + s.slice(1);
}

export function transformFormToAddressInput<T>(address: T & AddressTypeInput): T & AddressInput {
  return {
    ...address,
    country: findInEnum(address.country, CountryCode),
  };
}

export function getStringOrPlaceholder(s: string | undefined | null, placeholder?: string): string {
  return s || placeholder || "...";
}

export const transformAddressToAddressInput = (data?: AddressType) => ({
  city: data?.city || "",
  cityArea: data?.cityArea || "",
  companyName: data?.companyName || "",
  country: findInEnum(data?.country?.code || "", CountryCode),
  countryArea: data?.countryArea || "",
  firstName: data?.firstName || "",
  lastName: data?.lastName || "",
  phone: data?.phone || "",
  postalCode: data?.postalCode || "",
  streetAddress1: data?.streetAddress1 || "",
  streetAddress2: data?.streetAddress2 || "",
});

export function getFullName<T extends { firstName: string; lastName: string }>(data: T) {
  if (!data || (!data.firstName && !data.lastName)) {
    return "";
  }

  return `${data.firstName} ${data.lastName}`;
}
export const flatten = (obj: object) => {
  // Be cautious that repeated keys are overwritten

  const result = {};

  Object.keys(obj).forEach(key => {
    if (typeof obj[key as keyof typeof obj] === "object" && obj[key as keyof typeof obj] !== null) {
      Object.assign(result, flatten(obj[key as keyof typeof obj]));
    } else {
      result[key as keyof typeof obj] = obj[key as keyof typeof obj];
    }
  });

  return result;
};

export const getBySlug = (slugToCompare: string) => (obj: SlugNode) => obj.slug === slugToCompare;

export const getById = (idToCompare: string) => (obj: Node) => obj.id === idToCompare;

export const getByUnmatchingId = (idToCompare: string) => (obj: { id: string }) =>
  obj.id !== idToCompare;

export type PillStatusType =
  | "error"
  | "warning"
  | "info"
  | "success"
  | "neutral"
  | "attention"
  | "generic";

export const getStatusColor = ({
  status,
  currentTheme,
}: {
  status: PillStatusType;
  currentTheme: DefaultTheme;
}) => {
  const statusHue = getStatusHue(status);

  return currentTheme === "defaultDark"
    ? hueToPillColorDark(statusHue)
    : hueToPillColorLight(statusHue);
};

const getStatusHue = (status: PillStatusType): number => {
  const red = 8;
  const blue = 240;
  const green = 135;
  const amber = 75;
  const orange = 40;
  const gray = 0;

  switch (status) {
    case "error":
      return red;
    case "info":
      return blue;
    case "success":
      return green;
    case "warning":
      return amber;
    case "neutral":
    case "generic":
      return gray;
    case "attention":
      return orange;
    default:
      return gray;
  }
};

export const getDotColor = (status: DotStatus, themeValues: ThemeTokensValues) => {
  switch (status) {
    case "success":
      // TODO: add this as success2 to MacawUI
      return "hsla(173, 100%, 26%, 1)";
    case "error":
      return themeValues.colors.background.critical2;
    case "warning":
      return themeValues.colors.background.warning1;
  }
};

export const isFirstColumn = (column: number) => [-1, 0].includes(column);

const getAllRemovedRowsBeforeRowIndex = (rowIndex: number, removedRowsIndexs: number[]) =>
  removedRowsIndexs.filter(r => r <= rowIndex);

export const getDatagridRowDataIndex = (rowIndex: number, removedRowsIndexs: number[]) =>
  rowIndex + getAllRemovedRowsBeforeRowIndex(rowIndex, removedRowsIndexs).length;

export const fuzzySearch = <T>(
  array: T[],
  query: string | undefined,
  keys: string[],
  threshold = 0.3,
) => {
  if (!query) {
    return array;
  }

  const fuse = new Fuse(array, {
    keys,
    includeScore: true,
    threshold,
  });

  return fuse.search(query.toLocaleLowerCase()).map(({ item }) => item);
};
