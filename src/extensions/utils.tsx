import { gql } from "@apollo/client";
import {
  AppErrorCode,
  AppErrorFragment,
  WebhookEventTypeAsyncEnum,
  WebhookFragment,
} from "@dashboard/graphql";
import errorTracker from "@dashboard/services/errorTracking";
import { IntlShape } from "react-intl";

import { appManifestErrorMessages } from "./messages";

export function getAppInstallErrorMessage(
  err: AppErrorFragment,
  intl: IntlShape,
): string | undefined {
  if (err) {
    switch (err.code) {
      case AppErrorCode.INVALID_MANIFEST_FORMAT:
        return intl.formatMessage(appManifestErrorMessages.invalidManifestFormat);
      case AppErrorCode.INVALID_STATUS:
        return intl.formatMessage(appManifestErrorMessages.invalidStatus);
      case AppErrorCode.OUT_OF_SCOPE_APP:
        return intl.formatMessage(appManifestErrorMessages.outOfScopeApp);
      case AppErrorCode.OUT_OF_SCOPE_PERMISSION:
        return intl.formatMessage(appManifestErrorMessages.outOfScopePermission);
      case AppErrorCode.INVALID_PERMISSION:
        return intl.formatMessage(appManifestErrorMessages.invalidPermission);
      case AppErrorCode.INVALID_URL_FORMAT:
        return intl.formatMessage(appManifestErrorMessages.invalidUrlFormat);
      case AppErrorCode.UNIQUE:
        return intl.formatMessage(appManifestErrorMessages.unique);
      case AppErrorCode.INVALID:
        return intl.formatMessage(appManifestErrorMessages.invalidManifest);
      case AppErrorCode.INVALID_CUSTOM_HEADERS:
        return intl.formatMessage(appManifestErrorMessages.invalidCustomHeaders);
      case AppErrorCode.MANIFEST_URL_CANT_CONNECT:
        return intl.formatMessage(appManifestErrorMessages.invalidManifestUrlCannotConnect);
      case AppErrorCode.REQUIRED:
        return intl.formatMessage(appManifestErrorMessages.required);
      case AppErrorCode.GRAPHQL_ERROR:
        return intl.formatMessage(appManifestErrorMessages.graphqlError);
      case AppErrorCode.UNSUPPORTED_SALEOR_VERSION:
        return intl.formatMessage(appManifestErrorMessages.unsupportedSaleorVersion);
      case AppErrorCode.FORBIDDEN:
        return intl.formatMessage(appManifestErrorMessages.forbidden);
      case AppErrorCode.NOT_FOUND:
        return intl.formatMessage(appManifestErrorMessages.notFound);
      default: {
        // Check if all cases are handled:
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _exhaustiveCheck: never = err.code;

        errorTracker.captureException(new Error(`Unhandled AppErrorCode: ${err.code}`));

        return intl.formatMessage(appManifestErrorMessages.genericError);
      }
    }
  }

  return undefined;
}

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
