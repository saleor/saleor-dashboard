import { ThemeType } from "@saleor/macaw-ui";
import moment from "moment-timezone";
import { MutationFunction, MutationResult } from "react-apollo";
import { IntlShape } from "react-intl";
import urlJoin from "url-join";

import { ConfirmButtonTransitionState } from "./components/ConfirmButton";
import { StatusType } from "./components/StatusChip/types";
import { StatusLabelProps } from "./components/StatusLabel";
import { APP_MOUNT_URI } from "./config";
import { AddressType, AddressTypeInput } from "./customers/types";
import {
  commonStatusMessages,
  orderStatusMessages,
  paymentStatusMessages
} from "./intl";
import {
  MutationResultAdditionalProps,
  PartialMutationProviderOutput,
  UserError
} from "./types";
import {
  AddressInput,
  CountryCode,
  DateRangeInput,
  OrderStatus,
  PaymentChargeStatusEnum
} from "./types/globalTypes";

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  { [K in Keys]-?: Required<Pick<T, K>> }[Keys];

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> &
      Partial<Record<Exclude<Keys, K>, undefined>>;
  }[Keys];

export function renderCollection<T>(
  collection: T[],
  renderItem: (
    item: T | undefined,
    index: number | undefined,
    collection: T[]
  ) => any,
  renderEmpty?: (collection: T[]) => any
) {
  if (collection === undefined) {
    return renderItem(undefined, undefined, collection);
  }
  if (collection.length === 0) {
    return !!renderEmpty ? renderEmpty(collection) : null;
  }
  return collection.map(renderItem);
}

export function decimal(value: string | number) {
  if (typeof value === "string") {
    return value === "" ? null : value;
  }
  return value;
}

export function weight(value: string) {
  return value === "" ? null : parseFloat(value);
}

export const removeDoubleSlashes = (url: string) =>
  url.replace(/([^:]\/)\/+/g, "$1");

export const transformPaymentStatus = (
  status: string,
  intl: IntlShape
): { localized: string; status: StatusLabelProps["status"] } => {
  switch (status) {
    case PaymentChargeStatusEnum.PARTIALLY_CHARGED:
      return {
        localized: intl.formatMessage(paymentStatusMessages.partiallyPaid),
        status: StatusType.ERROR
      };
    case PaymentChargeStatusEnum.FULLY_CHARGED:
      return {
        localized: intl.formatMessage(paymentStatusMessages.paid),
        status: StatusType.SUCCESS
      };
    case PaymentChargeStatusEnum.PARTIALLY_REFUNDED:
      return {
        localized: intl.formatMessage(paymentStatusMessages.partiallyRefunded),
        status: StatusType.ERROR
      };
    case PaymentChargeStatusEnum.FULLY_REFUNDED:
      return {
        localized: intl.formatMessage(paymentStatusMessages.refunded),
        status: StatusType.SUCCESS
      };
    case PaymentChargeStatusEnum.PENDING:
      return {
        localized: intl.formatMessage(paymentStatusMessages.pending),
        status: StatusType.NEUTRAL
      };
    case PaymentChargeStatusEnum.REFUSED:
      return {
        localized: intl.formatMessage(paymentStatusMessages.refused),
        status: StatusType.ERROR
      };
    case PaymentChargeStatusEnum.CANCELLED:
      return {
        localized: intl.formatMessage(commonStatusMessages.cancelled),
        status: StatusType.ERROR
      };
    case PaymentChargeStatusEnum.NOT_CHARGED:
      return {
        localized: intl.formatMessage(paymentStatusMessages.unpaid),
        status: StatusType.ERROR
      };
  }
  return {
    localized: status,
    status: StatusType.ERROR
  };
};

export const transformOrderStatus = (
  status: string,
  intl: IntlShape
): { localized: string; status: StatusType } => {
  switch (status) {
    case OrderStatus.FULFILLED:
      return {
        localized: intl.formatMessage(orderStatusMessages.fulfilled),
        status: StatusType.SUCCESS
      };
    case OrderStatus.PARTIALLY_FULFILLED:
      return {
        localized: intl.formatMessage(orderStatusMessages.partiallyFulfilled),
        status: StatusType.NEUTRAL
      };
    case OrderStatus.UNFULFILLED:
      return {
        localized: intl.formatMessage(orderStatusMessages.unfulfilled),
        status: StatusType.ERROR
      };
    case OrderStatus.CANCELED:
      return {
        localized: intl.formatMessage(commonStatusMessages.cancelled),
        status: StatusType.ERROR
      };
    case OrderStatus.DRAFT:
      return {
        localized: intl.formatMessage(orderStatusMessages.draft),
        status: StatusType.ERROR
      };
    case OrderStatus.UNCONFIRMED:
      return {
        localized: intl.formatMessage(orderStatusMessages.unconfirmed),
        status: StatusType.NEUTRAL
      };
    case OrderStatus.PARTIALLY_RETURNED:
      return {
        localized: intl.formatMessage(orderStatusMessages.partiallyReturned),
        status: StatusType.NEUTRAL
      };
    case OrderStatus.RETURNED:
      return {
        localized: intl.formatMessage(orderStatusMessages.returned),
        status: StatusType.NEUTRAL
      };
  }
  return {
    localized: status,
    status: StatusType.ERROR
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
  streetAddress2: data?.streetAddress2 || ""
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

export function only<T>(obj: T, key: keyof T): boolean {
  return Object.keys(obj).every(objKey =>
    objKey === key ? obj[key] !== undefined : obj[key] === undefined
  );
}

export function empty(obj: {}): boolean {
  return Object.keys(obj).every(key => obj[key] === undefined);
}

export function hasErrors(errorList: UserError[] | null): boolean {
  return !(
    errorList === undefined ||
    errorList === null ||
    errorList.length === 0
  );
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
    return errorList.map(hasErrors).reduce((acc, curr) => acc || curr, false)
      ? "error"
      : "success";
  }
  return "default";
}

interface SaleorMutationResult {
  errors?: UserError[];
}
export function getMutationErrors<
  TData extends Record<string, SaleorMutationResult>
>(data: TData): UserError[] {
  return Object.values(data).reduce(
    (acc: UserError[], mut) => [...acc, ...maybe(() => mut.errors, [])],
    []
  );
}
export function getMutationStatus<
  TData extends Record<string, SaleorMutationResult | any>
>(opts: MutationResult<TData>): ConfirmButtonTransitionState {
  const errors = opts.data ? getMutationErrors(opts.data) : [];

  return getMutationState(opts.called, opts.loading, errors);
}

export function getMutationProviderData<TData, TVariables>(
  mutateFn: MutationFunction<TData, TVariables>,
  opts: MutationResult<TData> & MutationResultAdditionalProps
): PartialMutationProviderOutput<TData, TVariables> {
  return {
    mutate: variables => mutateFn({ variables }),
    opts
  };
}

interface User {
  email: string;
  firstName?: string;
  lastName?: string;
}

export function getUserName(user?: User, returnEmail?: boolean) {
  return user && (user.email || (user.firstName && user.lastName))
    ? user.firstName && user.lastName
      ? [user.firstName, user.lastName].join(" ")
      : returnEmail
      ? user.email
      : user.email.split("@")[0]
    : undefined;
}

export function getUserInitials(user?: User) {
  return user && (user.email || (user.firstName && user.lastName))
    ? (user.firstName && user.lastName
        ? user.firstName[0] + user.lastName[0]
        : user.email.slice(0, 2)
      ).toUpperCase()
    : undefined;
}

export function createHref(url: string) {
  return urlJoin(APP_MOUNT_URI, url);
}

interface AnyEvent {
  stopPropagation: () => void;
}
export function stopPropagation(cb: (event?: AnyEvent) => void) {
  return (event: AnyEvent) => {
    event.stopPropagation();
    cb(event);
  };
}

export interface DateTime {
  date: string;
  time: string;
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
      time: ""
    };
  }
  // Default html input format YYYY-MM-DD HH:mm
  const splitDateTime = moment(dateTime)
    .format("YYYY-MM-DD HH:mm")
    .split(" ");
  return {
    date: splitDateTime[0],
    time: splitDateTime[1]
  };
}

export function generateCode(charNum: number) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (let i = 0; i < charNum; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function findInEnum<TEnum extends {}>(needle: string, haystack: TEnum) {
  const match = Object.keys(haystack).find(key => key === needle);
  if (!!match) {
    return haystack[needle as keyof TEnum];
  }

  throw new Error(`Key ${needle} not found in enum`);
}

export function findValueInEnum<TEnum extends {}>(
  needle: string,
  haystack: TEnum
): TEnum[keyof TEnum] {
  const match = Object.entries(haystack).find(([_, value]) => value === needle);

  if (!match) {
    throw new Error(`Value ${needle} not found in enum`);
  }

  return (needle as unknown) as TEnum[keyof TEnum];
}

export function parseBoolean(a: string, defaultValue: boolean): boolean {
  if (a === undefined) {
    return defaultValue;
  }
  return a === "true";
}

export function capitalize(s: string) {
  return s.charAt(0).toLocaleUpperCase() + s.slice(1);
}

export function transformFormToAddressInput<T>(
  address: T & AddressTypeInput
): T & AddressInput {
  return {
    ...address,
    country: findInEnum(address.country, CountryCode)
  };
}

export function getStringOrPlaceholder(
  s: string | undefined,
  placeholder?: string
): string {
  return s || placeholder || "...";
}

export const getDatePeriod = (days: number): DateRangeInput => {
  if (days < 1) {
    return {};
  }

  const end = moment().startOf("day");
  const start = end.subtract(days - 1);
  const format = "YYYY-MM-DD";

  return {
    gte: start.format(format),
    lte: end.format(format)
  };
};

export const isDarkTheme = (themeType: ThemeType) => themeType === "dark";

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
  streetAddress2: data?.streetAddress2 || ""
});

export function getFullName<T extends { firstName: string; lastName: string }>(
  data: T
) {
  if (!data || !data.firstName || !data.lastName) {
    return "";
  }

  return `${data.firstName} ${data.lastName}`;
}
export const flatten = (obj: unknown) => {
  // Be cautious that repeated keys are overwritten

  const result = {};

  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      Object.assign(result, flatten(obj[key]));
    } else {
      result[key] = obj[key];
    }
  });

  return result;
};
