import { createElement, Fragment } from "react";

/**
 * Minimal ICU-ish formatter for unit tests.
 * The real react-intl is mapped away via jest moduleNameMapper; without this,
 * `{name}` / `{count, plural, ...}` stay literal and copy assertions are useless.
 */
const formatMessageImpl = (
  descriptor: { defaultMessage?: string; id?: string },
  values: Record<string, unknown> = {},
): string => {
  let msg = descriptor?.defaultMessage ?? descriptor?.id ?? "";

  msg = msg.replace(
    /\{(\w+), plural, one \{([^}]*)\} other \{([^}]*)\}\}/g,
    (_match, key: string, one: string, other: string) => {
      const n = Number(values[key]);
      const template = n === 1 ? one : other;

      return template.replace(/#/g, String(values[key]));
    },
  );

  Object.entries(values).forEach(([key, value]) => {
    msg = msg.replace(new RegExp(`\\{${key}\\}`, "g"), String(value));
  });

  return msg;
};

const useIntl = jest.fn(() => ({
  formatMessage: jest.fn(formatMessageImpl),
  formatDate: jest.fn(x => x),
  formatTime: jest.fn(x => x),
  formatNumber: jest.fn(x => x),
  locale: "en",
}));

const defineMessages = jest.fn(x => x);
const defineMessage = jest.fn(x => x);

const FormattedMessage = jest.fn(
  ({
    defaultMessage,
    id,
    values,
  }: {
    defaultMessage?: string;
    id?: string;
    values?: Record<string, unknown>;
  }) => createElement(Fragment, null, formatMessageImpl({ defaultMessage, id }, values)),
);

const IntlProvider = ({ children }: { children: React.ReactNode }) =>
  createElement(Fragment, null, children);

const createIntl = jest.fn(() => ({
  formatMessage: jest.fn(formatMessageImpl),
  formatDate: jest.fn(x => x),
  formatTime: jest.fn(x => x),
  formatNumber: jest.fn(x => x),
  locale: "en",
}));

const FormattedDate = ({ value }: { value: any }) => createElement(Fragment, null, value);

export {
  useIntl,
  defineMessages,
  defineMessage,
  FormattedMessage,
  IntlProvider,
  createIntl,
  FormattedDate,
};

// Export types for TypeScript
export type {
  IntlShape,
  MessageDescriptor,
  FormattedMessageProps,
  ReactIntlErrorCode,
} from "react-intl";
