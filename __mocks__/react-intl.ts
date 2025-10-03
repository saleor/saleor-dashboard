import { createElement, Fragment } from "react";

const useIntl = jest.fn(() => ({
  formatMessage: jest.fn(x => x.defaultMessage),
  formatDate: jest.fn(x => x),
  formatTime: jest.fn(x => x),
  formatNumber: jest.fn(x => x),
  locale: "en",
}));

const defineMessages = jest.fn(x => x);
const defineMessage = jest.fn(x => x);

const FormattedMessage = jest.fn(({ defaultMessage }: { defaultMessage: string }) =>
  createElement(Fragment, null, defaultMessage),
);

const IntlProvider = ({ children }: { children: React.ReactNode }) =>
  createElement(Fragment, null, children);

const createIntl = jest.fn(() => ({
  formatMessage: jest.fn(x => x.defaultMessage),
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
