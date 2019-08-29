import moment from "moment-timezone";
import { MutationFunction, MutationResult } from "react-apollo";
import urlJoin from "url-join";

import { defineMessages, IntlShape } from "react-intl";
import { ConfirmButtonTransitionState } from "./components/ConfirmButton/ConfirmButton";
import { APP_MOUNT_URI } from "./config";
import { AddressType } from "./customers/types";
import { PartialMutationProviderOutput, UserError } from "./types";
import {
  AuthorizationKeyType,
  OrderStatus,
  PaymentChargeStatusEnum,
  TaxRateType
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

export const removeDoubleSlashes = (url: string) =>
  url.replace(/([^:]\/)\/+/g, "$1");

const paymentStatusMessages = defineMessages({
  paid: {
    defaultMessage: "Fully paid",
    description: "payment status"
  },
  partiallyPaid: {
    defaultMessage: "Partially paid",
    description: "payment status"
  },
  partiallyRefunded: {
    defaultMessage: "Partially refunded",
    description: "payment status"
  },
  refunded: {
    defaultMessage: "Fully refunded",
    description: "payment status"
  },
  unpaid: {
    defaultMessage: "Unpaid",
    description: "payment status"
  }
});

export const transformPaymentStatus = (status: string, intl: IntlShape) => {
  switch (status) {
    case PaymentChargeStatusEnum.PARTIALLY_CHARGED:
      return {
        localized: intl.formatMessage(paymentStatusMessages.partiallyPaid),
        status: "error"
      };
    case PaymentChargeStatusEnum.FULLY_CHARGED:
      return {
        localized: intl.formatMessage(paymentStatusMessages.paid),
        status: "success"
      };
    case PaymentChargeStatusEnum.PARTIALLY_REFUNDED:
      return {
        localized: intl.formatMessage(paymentStatusMessages.partiallyRefunded),
        status: "error"
      };
    case PaymentChargeStatusEnum.FULLY_REFUNDED:
      return {
        localized: intl.formatMessage(paymentStatusMessages.refunded),
        status: "success"
      };
    default:
      return {
        localized: intl.formatMessage(paymentStatusMessages.unpaid),
        status: "error"
      };
  }
};

const orderStatusMessages = defineMessages({
  cancelled: {
    defaultMessage: "Cancelled",
    description: "order status"
  },
  draft: {
    defaultMessage: "Draft",
    description: "order status"
  },
  fulfilled: {
    defaultMessage: "Fulfilled",
    description: "order status"
  },
  partiallyFulfilled: {
    defaultMessage: "Partially fulfilled",
    description: "order status"
  },
  unfulfilled: {
    defaultMessage: "Unfulfilled",
    description: "order status"
  }
});

export const transformOrderStatus = (status: string, intl: IntlShape) => {
  switch (status) {
    case OrderStatus.FULFILLED:
      return {
        localized: intl.formatMessage(orderStatusMessages.fulfilled),
        status: "success"
      };
    case OrderStatus.PARTIALLY_FULFILLED:
      return {
        localized: intl.formatMessage(orderStatusMessages.partiallyFulfilled),
        status: "neutral"
      };
    case OrderStatus.UNFULFILLED:
      return {
        localized: intl.formatMessage(orderStatusMessages.unfulfilled),
        status: "error"
      };
    case OrderStatus.CANCELED:
      return {
        localized: intl.formatMessage(orderStatusMessages.cancelled),
        status: "error"
      };
    case OrderStatus.DRAFT:
      return {
        localized: intl.formatMessage(orderStatusMessages.draft),
        status: "error"
      };
  }
  return {
    localized: status,
    status: "error"
  };
};

export const transformAddressToForm = (data: AddressType) => ({
  city: maybe(() => data.city, ""),
  cityArea: maybe(() => data.cityArea, ""),
  companyName: maybe(() => data.companyName, ""),
  country: maybe(() => data.country.code, ""),
  countryArea: maybe(() => data.countryArea, ""),
  firstName: maybe(() => data.firstName, ""),
  lastName: maybe(() => data.lastName, ""),
  phone: maybe(() => data.phone, ""),
  postalCode: maybe(() => data.postalCode, ""),
  streetAddress1: maybe(() => data.streetAddress1, ""),
  streetAddress2: maybe(() => data.streetAddress2, "")
});

const taxRatesMessages = defineMessages({
  accommodation: {
    defaultMessage: "Accommodation",
    description: "tax rate"
  },
  admissionToCulturalEvents: {
    defaultMessage: "Admission to cultural events",
    description: "tax rate"
  },
  admissionToEntertainmentEvents: {
    defaultMessage: "Admission to entertainment events",
    description: "tax rate"
  },
  admissionToSportingEvents: {
    defaultMessage: "Admission to sporting events",
    description: "tax rate"
  },
  advertising: {
    defaultMessage: "Advertising",
    description: "tax rate"
  },
  agriculturalSupplies: {
    defaultMessage: "Agricultural supplies",
    description: "tax rate"
  },
  babyFoodstuffs: {
    defaultMessage: "Baby foodstuffs",
    description: "tax rate"
  },
  bikes: {
    defaultMessage: "Bikes",
    description: "tax rate"
  },
  books: {
    defaultMessage: "Books",
    description: "tax rate"
  },
  childrensClothing: {
    defaultMessage: "Children's clothing",
    description: "tax rate"
  },
  domesticFuel: {
    defaultMessage: "Domestic fuel",
    description: "tax rate"
  },
  domesticServices: {
    defaultMessage: "Domestic services",
    description: "tax rate"
  },
  ebooks: {
    defaultMessage: "E-books",
    description: "tax rate"
  },
  foodstuffs: {
    defaultMessage: "Foodstuffs",
    description: "tax rate"
  },
  hotels: {
    defaultMessage: "Hotels",
    description: "tax rate"
  },
  medical: {
    defaultMessage: "Medical",
    description: "tax rate"
  },
  newspapers: {
    defaultMessage: "Newspapers",
    description: "tax rate"
  },
  passengerTransport: {
    defaultMessage: "Passenger transport",
    description: "tax rate"
  },
  pharmaceuticals: {
    defaultMessage: "Pharmaceuticals",
    description: "tax rate"
  },
  propertyRenovations: {
    defaultMessage: "Property renovations",
    description: "tax rate"
  },
  restaurants: {
    defaultMessage: "Restaurants",
    description: "tax rate"
  },
  socialHousing: {
    defaultMessage: "Social housing",
    description: "tax rate"
  },
  standard: {
    defaultMessage: "Standard",
    description: "tax rate"
  },
  water: {
    defaultMessage: "Water",
    description: "tax rate"
  }
});

export const translatedTaxRates = (intl: IntlShape) => ({
  [TaxRateType.ACCOMMODATION]: intl.formatMessage(
    taxRatesMessages.accommodation
  ),
  [TaxRateType.ADMISSION_TO_CULTURAL_EVENTS]: intl.formatMessage(
    taxRatesMessages.admissionToCulturalEvents
  ),
  [TaxRateType.ADMISSION_TO_ENTERTAINMENT_EVENTS]: intl.formatMessage(
    taxRatesMessages.admissionToEntertainmentEvents
  ),
  [TaxRateType.ADMISSION_TO_SPORTING_EVENTS]: intl.formatMessage(
    taxRatesMessages.admissionToSportingEvents
  ),
  [TaxRateType.ADVERTISING]: intl.formatMessage(taxRatesMessages.advertising),
  [TaxRateType.AGRICULTURAL_SUPPLIES]: intl.formatMessage(
    taxRatesMessages.agriculturalSupplies
  ),
  [TaxRateType.BABY_FOODSTUFFS]: intl.formatMessage(
    taxRatesMessages.babyFoodstuffs
  ),
  [TaxRateType.BIKES]: intl.formatMessage(taxRatesMessages.bikes),
  [TaxRateType.BOOKS]: intl.formatMessage(taxRatesMessages.books),
  [TaxRateType.CHILDRENS_CLOTHING]: intl.formatMessage(
    taxRatesMessages.childrensClothing
  ),
  [TaxRateType.DOMESTIC_FUEL]: intl.formatMessage(
    taxRatesMessages.domesticFuel
  ),
  [TaxRateType.DOMESTIC_SERVICES]: intl.formatMessage(
    taxRatesMessages.domesticServices
  ),
  [TaxRateType.E_BOOKS]: intl.formatMessage(taxRatesMessages.ebooks),
  [TaxRateType.FOODSTUFFS]: intl.formatMessage(taxRatesMessages.foodstuffs),
  [TaxRateType.HOTELS]: intl.formatMessage(taxRatesMessages.hotels),
  [TaxRateType.MEDICAL]: intl.formatMessage(taxRatesMessages.medical),
  [TaxRateType.NEWSPAPERS]: intl.formatMessage(taxRatesMessages.newspapers),
  [TaxRateType.PASSENGER_TRANSPORT]: intl.formatMessage(
    taxRatesMessages.passengerTransport
  ),
  [TaxRateType.PHARMACEUTICALS]: intl.formatMessage(
    taxRatesMessages.pharmaceuticals
  ),
  [TaxRateType.PROPERTY_RENOVATIONS]: intl.formatMessage(
    taxRatesMessages.propertyRenovations
  ),
  [TaxRateType.RESTAURANTS]: intl.formatMessage(taxRatesMessages.restaurants),
  [TaxRateType.SOCIAL_HOUSING]: intl.formatMessage(
    taxRatesMessages.socialHousing
  ),
  [TaxRateType.STANDARD]: intl.formatMessage(taxRatesMessages.standard),
  [TaxRateType.WATER]: intl.formatMessage(taxRatesMessages.water)
});

export const authorizationKeyTypes = {
  [AuthorizationKeyType.FACEBOOK]: "Facebook",
  [AuthorizationKeyType.GOOGLE_OAUTH2]: "Google OAuth2"
};

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

export function empty(obj: object): boolean {
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
  ...errorList: UserError[][]
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

export function getMutationProviderData<TData, TVariables>(
  mutateFn: MutationFunction<TData, TVariables>,
  opts: MutationResult<TData>
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
export function stopPropagation(cb: () => void) {
  return (event: AnyEvent) => {
    event.stopPropagation();
    cb();
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
