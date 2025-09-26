import { ItemOption } from "@dashboard/components/ConditionalFilter/FilterElement/ConditionValue";
import { UrlToken } from "@dashboard/components/ConditionalFilter/ValueProvider/UrlToken";

export interface InitialOrderState {
  status: ItemOption[];
  fulfillmentStatus: ItemOption[];
  authorizeStatus: ItemOption[];
  chargeStatus: ItemOption[];
  isClickAndCollect: ItemOption[];
  isGiftCardBought: ItemOption[];
  isGiftCardUsed: ItemOption[];
  hasInvoices: ItemOption[];
  hasFulfillments: ItemOption[];
  createdAt: string | string[];
  updatedAt: string | string[];
  invoicesCreatedAt: string | string[];
  totalGross: string | string[];
  totalNet: string | string[];
  user: ItemOption[];
  channelId: ItemOption[];
  ids: ItemOption[];
  metadata: string | string[];
  number: ItemOption[];
  userEmail: ItemOption[];
  voucherCode: ItemOption[];
  linesCount: ItemOption[];
  checkoutId: ItemOption[];
  linesMetadata: string | string[];
  transactionsMetadata: string | string[];
  transactionsPaymentType: ItemOption[];
  transactionsCardBrand: ItemOption[];
  fulfillmentsMetadata: string | string[];
  billingPhoneNumber: ItemOption[];
  billingCountry: ItemOption[];
  shippingPhoneNumber: ItemOption[];
  shippingCountry: ItemOption[];
  fulfillmentWarehouse: ItemOption[];
}

const isDateField = (name: string) =>
  ["createdAt", "updatedAt", "invoicesCreatedAt"].includes(name);
const isPriceField = (name: string) => ["totalGross", "totalNet"].includes(name);
const isNumericField = (name: string) => ["number", "linesCount"].includes(name);
const isMetadataField = (name: string) =>
  ["metadata", "linesMetadata", "transactionsMetadata", "fulfillmentsMetadata"].includes(name);

export class InitialOrderStateResponse implements InitialOrderState {
  constructor(
    public status: ItemOption[] = [],
    public fulfillmentStatus: ItemOption[] = [],
    public authorizeStatus: ItemOption[] = [],
    public chargeStatus: ItemOption[] = [],
    public isClickAndCollect: ItemOption[] = [],
    public isGiftCardBought: ItemOption[] = [],
    public isGiftCardUsed: ItemOption[] = [],
    public hasInvoices: ItemOption[] = [],
    public hasFulfillments: ItemOption[] = [],
    public createdAt: string | string[] = [],
    public updatedAt: string | string[] = [],
    public invoicesCreatedAt: string | string[] = [],
    public totalGross: string | string[] = [],
    public totalNet: string | string[] = [],
    public user: ItemOption[] = [],
    public channelId: ItemOption[] = [],
    public ids: ItemOption[] = [],
    public metadata: string | string[] = [],
    public number: ItemOption[] = [],
    public userEmail: ItemOption[] = [],
    public voucherCode: ItemOption[] = [],
    public linesCount: ItemOption[] = [],
    public checkoutId: ItemOption[] = [],
    public linesMetadata: string | string[] = [],
    public transactionsMetadata: string | string[] = [],
    public transactionsPaymentType: ItemOption[] = [],
    public transactionsCardBrand: ItemOption[] = [],
    public fulfillmentsMetadata: string | string[] = [],
    public billingPhoneNumber: ItemOption[] = [],
    public billingCountry: ItemOption[] = [],
    public shippingPhoneNumber: ItemOption[] = [],
    public shippingCountry: ItemOption[] = [],
    public fulfillmentWarehouse: ItemOption[] = [],
  ) {}

  public static empty() {
    return new InitialOrderStateResponse();
  }

  public filterByUrlToken(token: UrlToken) {
    if (
      isDateField(token.name) ||
      isPriceField(token.name) ||
      isNumericField(token.name) ||
      isMetadataField(token.name)
    ) {
      return token.value;
    }

    const entry = this.getEntryByName(token.name);

    if (!token.isLoadable()) {
      return [token.value] as string[];
    }

    return (entry as ItemOption[]).filter(({ slug }) => slug && token.value.includes(slug));
  }

  private getEntryByName(name: string): ItemOption[] {
    switch (name) {
      case "status":
        return this.status;
      case "fulfillmentStatus":
        return this.fulfillmentStatus;
      case "authorizeStatus":
        return this.authorizeStatus;
      case "chargeStatus":
        return this.chargeStatus;
      case "channels":
        // Map "channels" from URL to channelId field in filters
        return this.channelId;
      case "channelId":
        return this.channelId;
      case "isClickAndCollect":
        return this.isClickAndCollect;
      case "isGiftCardBought":
        return this.isGiftCardBought;
      case "isGiftCardUsed":
        return this.isGiftCardUsed;
      case "hasInvoices":
        return this.hasInvoices;
      case "hasFulfillments":
        return this.hasFulfillments;
      case "customer":
        // Map "customer" from URL to user field in filters
        return this.user;
      case "user":
        return this.user;
      case "ids":
        return this.ids;
      case "metadata":
        return []; // Metadata handled specially
      case "number":
        return this.number;
      case "userEmail":
        return this.userEmail;
      case "voucherCode":
        return this.voucherCode;
      case "linesCount":
        return this.linesCount;
      case "checkoutId":
        return this.checkoutId;
      case "linesMetadata":
        return []; // Metadata handled specially
      case "transactionsMetadata":
        return []; // Metadata handled specially
      case "transactionsPaymentType":
        return this.transactionsPaymentType;
      case "transactionsCardBrand":
        return this.transactionsCardBrand;
      case "fulfillmentsMetadata":
        return []; // Metadata handled specially
      case "billingPhoneNumber":
        return this.billingPhoneNumber;
      case "billingCountry":
        return this.billingCountry;
      case "shippingPhoneNumber":
        return this.shippingPhoneNumber;
      case "shippingCountry":
        return this.shippingCountry;
      case "fulfillmentWarehouse":
        return this.fulfillmentWarehouse;
      default:
        return [];
    }
  }
}
