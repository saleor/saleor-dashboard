import { gql } from "@apollo/client";
import {
  AppErrorCode,
  AppErrorFragment,
  WebhookEventTypeAsyncEnum,
  WebhookFragment,
} from "@dashboard/graphql";
import { errorTracker } from "@dashboard/services/errorTracking";
import { IntlShape } from "react-intl";

import { appManifestErrorMessages, localAppErrorMessages } from "./messages";

export const getAppErrorMessageDescriptor = (code: AppErrorCode) => {
  switch (code) {
    case AppErrorCode.INVALID_MANIFEST_FORMAT:
      return appManifestErrorMessages.invalidManifestFormat;
    case AppErrorCode.INVALID_PERMISSION:
      return appManifestErrorMessages.invalidPermission;
    case AppErrorCode.INVALID_URL_FORMAT:
      return appManifestErrorMessages.invalidUrlFormat;
    case AppErrorCode.INVALID:
      return appManifestErrorMessages.invalidManifest;
    case AppErrorCode.INVALID_CUSTOM_HEADERS:
      return appManifestErrorMessages.invalidCustomHeaders;
    case AppErrorCode.MANIFEST_URL_CANT_CONNECT:
      return appManifestErrorMessages.invalidManifestUrlCannotConnect;
    case AppErrorCode.REQUIRED:
      return appManifestErrorMessages.required;
    case AppErrorCode.UNSUPPORTED_SALEOR_VERSION:
      return appManifestErrorMessages.unsupportedSaleorVersion;
    case AppErrorCode.OUT_OF_SCOPE_PERMISSION:
      return appManifestErrorMessages.outOfScopePermission;
    case AppErrorCode.INVALID_STATUS:
      return appManifestErrorMessages.invalidStatus;
    case AppErrorCode.OUT_OF_SCOPE_APP:
      return appManifestErrorMessages.outOfScopeApp;
    case AppErrorCode.UNIQUE:
      return appManifestErrorMessages.unique;
    case AppErrorCode.GRAPHQL_ERROR:
      return appManifestErrorMessages.graphqlError;
    case AppErrorCode.FORBIDDEN:
      return appManifestErrorMessages.forbidden;
    case AppErrorCode.NOT_FOUND:
      return appManifestErrorMessages.notFound;
    default:
      const _exhaustiveCheck: never = code;

      errorTracker.captureException(new Error(`Unhandled AppErrorCode: ${code}`));

      return appManifestErrorMessages.genericError;
  }
};

/** This method is used for getting formatted error message in place when we cannot use link for Learn more... */
export function getAppInstallErrorMessage(
  err: AppErrorFragment,
  intl: IntlShape,
): string | undefined {
  if (err) {
    const errorCode = err.code;

    const messageDescriptor = getAppErrorMessageDescriptor(errorCode);

    return intl.formatMessage(messageDescriptor, {
      errorCode,
      docsLink: "",
    });
  }

  return undefined;
}

function getCustomAppErrorMessageDescriptor(code: AppErrorCode) {
  switch (code) {
    case AppErrorCode.INVALID_PERMISSION:
      return localAppErrorMessages.invalidPermission;
    case AppErrorCode.OUT_OF_SCOPE_APP:
      return localAppErrorMessages.outOfScopeApp;
    case AppErrorCode.OUT_OF_SCOPE_PERMISSION:
      return localAppErrorMessages.outOfScopePermission;
    case AppErrorCode.UNIQUE:
      return localAppErrorMessages.unique;
    case AppErrorCode.FORBIDDEN:
      return localAppErrorMessages.forbidden;
    case AppErrorCode.INVALID_STATUS:
      return localAppErrorMessages.invalidStatus;
    case AppErrorCode.REQUIRED:
      return localAppErrorMessages.required;
    default:
      return localAppErrorMessages.genericError;
  }
}

export function getCustomAppErrorMessage(
  err: AppErrorFragment,
  intl: IntlShape,
): string | undefined {
  if (err) {
    return intl.formatMessage(getCustomAppErrorMessageDescriptor(err.code));
  }

  return undefined;
}

export interface IntrospectionNode {
  name: string;
  interfaces: Array<{
    name: string;
  }> | null;
  description: string;
}

// cannot be in `queries.ts` as codegen cannot handle `__schema`
export const IntrospectionQuery = gql`
  query EventsIntrospection {
    __schema {
      types {
        name
        interfaces {
          name
        }
        description
      }
    }
  }
`;

const isEvent = ({ name }: { name: string }) => name === "Event";

export const buildEventsMap = (elements: IntrospectionNode[]) =>
  elements.filter(({ interfaces }) => (interfaces || []).some(isEvent));

export function isUnnamed(webhook: WebhookFragment | undefined): boolean {
  return !webhook?.name;
}

export const filterSelectedAsyncEvents = (asyncEvents: WebhookEventTypeAsyncEnum[]) => {
  const anyEvent = asyncEvents.find(event => event === WebhookEventTypeAsyncEnum.ANY_EVENTS);

  if (anyEvent) {
    return [anyEvent];
  }

  return asyncEvents;
};
