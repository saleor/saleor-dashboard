import { LeftOperand } from "@dashboard/components/ConditionalFilter/LeftOperandsProvider";
import {
  AttributeTypeEnum,
  CollectionPublished,
  DiscountStatusEnum,
  FulfillmentStatus,
  OrderAuthorizeStatusEnum,
  OrderChargeStatusEnum,
  OrderStatusFilter,
  PaymentMethodTypeEnum,
  ProductTypeEnum,
  StaffMemberStatus,
  VoucherDiscountType,
} from "@dashboard/graphql";
import { transformOrderStatus } from "@dashboard/misc";
import { IntlShape } from "react-intl";

import {
  attributeTypesMessages,
  authorizeStatusMessages,
  chargeStatusMessages,
  collectionFilterMessages,
  discountTypeMessages,
  fulfillmentStatusMessages,
  paymentMethodTypeMessages,
  productTypeMessages,
  staffMembersStatusMessages,
  voucherStatusMessages,
} from "./messages";

const getOrderStatusLabel = (status: OrderStatusFilter, intl: IntlShape) => {
  const { localized } = transformOrderStatus(status, intl);

  return localized;
};

const getAuthorizeStatusLabel = (status: OrderAuthorizeStatusEnum, intl: IntlShape) => {
  switch (status) {
    case OrderAuthorizeStatusEnum.FULL:
      return intl.formatMessage(authorizeStatusMessages.full);
    case OrderAuthorizeStatusEnum.PARTIAL:
      return intl.formatMessage(authorizeStatusMessages.partial);
    case OrderAuthorizeStatusEnum.NONE:
      return intl.formatMessage(authorizeStatusMessages.none);
    default:
      return status;
  }
};

const getChargeStatusLabel = (status: OrderChargeStatusEnum, intl: IntlShape) => {
  switch (status) {
    case OrderChargeStatusEnum.FULL:
      return intl.formatMessage(chargeStatusMessages.full);
    case OrderChargeStatusEnum.PARTIAL:
      return intl.formatMessage(chargeStatusMessages.partial);
    case OrderChargeStatusEnum.OVERCHARGED:
      return intl.formatMessage(chargeStatusMessages.overcharged);
    case OrderChargeStatusEnum.NONE:
      return intl.formatMessage(chargeStatusMessages.none);
    default:
      return status;
  }
};

const getDiscountTypeLabel = (type: VoucherDiscountType, intl: IntlShape) => {
  switch (type) {
    case VoucherDiscountType.FIXED:
      return intl.formatMessage(discountTypeMessages.fixed);
    case VoucherDiscountType.PERCENTAGE:
      return intl.formatMessage(discountTypeMessages.percentage);
    case VoucherDiscountType.SHIPPING:
      return intl.formatMessage(discountTypeMessages.shipping);
  }
};

const getVoucherStatusLabel = (status: DiscountStatusEnum, intl: IntlShape) => {
  switch (status) {
    case DiscountStatusEnum.ACTIVE:
      return intl.formatMessage(voucherStatusMessages.active);
    case DiscountStatusEnum.EXPIRED:
      return intl.formatMessage(voucherStatusMessages.expired);
    case DiscountStatusEnum.SCHEDULED:
      return intl.formatMessage(voucherStatusMessages.scheduled);
    default:
      return status;
  }
};

const getPublishedLabel = (status: CollectionPublished, intl: IntlShape) => {
  switch (status) {
    case CollectionPublished.PUBLISHED:
      return intl.formatMessage(collectionFilterMessages.published);
    case CollectionPublished.HIDDEN:
      return intl.formatMessage(collectionFilterMessages.hidden);
    default:
      return status;
  }
};

const getProductTypeLabel = (type: ProductTypeEnum, intl: IntlShape) => {
  switch (type) {
    case ProductTypeEnum.DIGITAL:
      return intl.formatMessage(productTypeMessages.digital);
    case ProductTypeEnum.SHIPPABLE:
      return intl.formatMessage(productTypeMessages.shippable);
    default:
      return type;
  }
};

const getStaffMemberStatusLabel = (status: StaffMemberStatus, intl: IntlShape) => {
  switch (status) {
    case StaffMemberStatus.ACTIVE:
      return intl.formatMessage(staffMembersStatusMessages.active);
    case StaffMemberStatus.DEACTIVATED:
      return intl.formatMessage(staffMembersStatusMessages.deactivated);
    default:
      return status;
  }
};

const getAttributeTypeLabel = (type: AttributeTypeEnum, intl: IntlShape) => {
  switch (type) {
    case AttributeTypeEnum.PAGE_TYPE:
      return intl.formatMessage(attributeTypesMessages.pageType);
    case AttributeTypeEnum.PRODUCT_TYPE:
      return intl.formatMessage(attributeTypesMessages.productType);
    default:
      return type;
  }
};

const getPaymentMethodTypeLabel = (type: PaymentMethodTypeEnum, intl: IntlShape) => {
  switch (type) {
    case PaymentMethodTypeEnum.CARD:
      return intl.formatMessage(paymentMethodTypeMessages.card);
    case PaymentMethodTypeEnum.OTHER:
      return intl.formatMessage(paymentMethodTypeMessages.other);
    default:
      return type;
  }
};

const getFulfillmentStatusLabel = (status: FulfillmentStatus, intl: IntlShape) => {
  switch (status) {
    case FulfillmentStatus.CANCELED:
      return intl.formatMessage(fulfillmentStatusMessages.canceled);
    case FulfillmentStatus.FULFILLED:
      return intl.formatMessage(fulfillmentStatusMessages.fulfilled);
    case FulfillmentStatus.REFUNDED:
      return intl.formatMessage(fulfillmentStatusMessages.refunded);
    case FulfillmentStatus.REFUNDED_AND_RETURNED:
      return intl.formatMessage(fulfillmentStatusMessages.refundedAndReturned);
    case FulfillmentStatus.REPLACED:
      return intl.formatMessage(fulfillmentStatusMessages.replaced);
    case FulfillmentStatus.RETURNED:
      return intl.formatMessage(fulfillmentStatusMessages.returned);
    case FulfillmentStatus.WAITING_FOR_APPROVAL:
      return intl.formatMessage(fulfillmentStatusMessages.waitingForApproval);
    default:
      return status;
  }
};

export const getLocalizedLabel = (rowType: LeftOperand["type"], value: string, intl: IntlShape) => {
  switch (rowType) {
    case "status":
      return getOrderStatusLabel(value as OrderStatusFilter, intl);
    case "authorizeStatus":
      return getAuthorizeStatusLabel(value as OrderAuthorizeStatusEnum, intl);
    case "chargeStatus":
      return getChargeStatusLabel(value as OrderChargeStatusEnum, intl);
    case "published":
      return getPublishedLabel(value as CollectionPublished, intl);
    case "discountType":
      return getDiscountTypeLabel(value as VoucherDiscountType, intl);
    case "voucherStatus":
      return getVoucherStatusLabel(value as DiscountStatusEnum, intl);
    case "typeOfProduct":
      return getProductTypeLabel(value as ProductTypeEnum, intl);
    case "staffMemberStatus":
      return getStaffMemberStatusLabel(value as StaffMemberStatus, intl);
    case "attributeType":
      return getAttributeTypeLabel(value as AttributeTypeEnum, intl);
    case "transactionsPaymentType":
      return getPaymentMethodTypeLabel(value as PaymentMethodTypeEnum, intl);
    case "fulfillmentStatus":
      return getFulfillmentStatusLabel(value as FulfillmentStatus, intl);
    default:
      return value;
  }
};
