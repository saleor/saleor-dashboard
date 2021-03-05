declare module "react-intl" {
  import { OptionalIntlConfig } from "react-intl/dist/components/provider";
  import * as ReactIntl from "node_modules/react-intl";
  export * from "node_modules/react-intl";

  export interface MessageDescriptor {
    description?: string;
    defaultMessage: string;
    id?: string;
  }
  type Messages<Names extends keyof any = string> = Record<
    Names,
    MessageDescriptor
  >;
  type PrimitiveType = string | number | boolean | null | undefined | Date;
  type FormatXMLElementFn = (...args: any[]) => string | {};
  export interface IntlFormatters
    extends Omit<ReactIntl.IntlFormatters, "formatMessage"> {
    formatMessage(
      descriptor: MessageDescriptor,
      values?: Record<string, PrimitiveType>
    ): string;
    formatMessage(
      descriptor: MessageDescriptor,
      values?: Record<
        string,
        PrimitiveType | React.ReactElement | FormatXMLElementFn
      >
    ): string | React.ReactNodeArray;
  }
  export interface FormattedMessageProps<
    V extends Record<string, any> = Record<string, React.ReactNode>
  > extends MessageDescriptor {
    values?: V;
    tagName?: React.ElementType<any>;
    children?(...nodes: React.ReactNodeArray): React.ReactNode;
  }

  export function defineMessages<Names extends keyof any>(
    messageDescriptors: Messages<Names>
  ): Messages<Names>;

  export interface IntlShape extends ReactIntl.IntlConfig, IntlFormatters {
    formatters: ReactIntl.Formatters;
  }

  export class FormattedMessage<
    TValues extends Record<string, any> = Record<
      string,
      PrimitiveType | React.ReactElement | FormatXMLElementFn
    >
  > extends React.Component<FormattedMessageProps<TValues>> {}

  export function useIntl(): IntlShape;

  export function createIntl(config: OptionalIntlConfig): IntlShape;
}
