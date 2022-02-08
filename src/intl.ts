import { defineMessages, IntlShape } from "react-intl";

export const commonMessages = defineMessages({
  availability: {
    defaultMessage: "Availability"
  },
  catalog: {
    defaultMessage: "Catalog"
  },
  chooseFile: {
    defaultMessage: "Choose file",
    description: "button"
  },
  channel: {
    defaultMessage: "Channel"
  },
  customApps: {
    defaultMessage: "Local Apps"
  },
  dashboard: {
    defaultMessage: "Dashboard"
  },
  demo: {
    defaultMessage:
      "Just to let you know... You're in demo mode. You can play around with the dashboard but can't save changes.",
    description: "notification message after log in"
  },
  description: {
    defaultMessage: "Description"
  },
  descriptionOptional: {
    defaultMessage: "Description (optional)"
  },
  discounts: {
    defaultMessage: "Discounts"
  },
  drafts: {
    defaultMessage: "Drafts"
  },
  email: {
    defaultMessage: "Email address"
  },
  endDate: {
    defaultMessage: "End Date"
  },
  endHour: {
    defaultMessage: "End Hour"
  },
  error: {
    defaultMessage: "Error"
  },
  extensions: {
    defaultMessage: "Extensions"
  },
  firstName: {
    defaultMessage: "First Name"
  },
  generalInformations: {
    defaultMessage: "General Information"
  },

  insufficientPermissions: {
    defaultMessage: "Insufficient permissions"
  },
  lastName: {
    defaultMessage: "Last Name"
  },
  limitReached: {
    defaultMessage: "Reached limit for this plan"
  },
  no: {
    defaultMessage: "No"
  },
  optionalField: {
    defaultMessage: "Optional",
    description: "field is optional"
  },
  properties: {
    defaultMessage: "Properties"
  },
  readOnly: {
    defaultMessage: "Saleor runs in read-only mode. Changes not saved."
  },
  requiredField: {
    defaultMessage: "This field is required"
  },
  savedChanges: {
    defaultMessage: "Saved changes"
  },
  selected: {
    defaultMessage: "Selected"
  },
  sessionExpired: {
    defaultMessage: "Your session has expired. Please log in again to continue."
  },
  somethingWentWrong: {
    defaultMessage: "Saleor ran into an unexpected problem"
  },
  startDate: {
    defaultMessage: "Start Date"
  },
  startHour: {
    defaultMessage: "Start Hour"
  },
  status: {
    defaultMessage: "Status"
  },
  paymentStatus: {
    defaultMessage: "Payment status"
  },
  summary: {
    defaultMessage: "Summary"
  },
  translationAttributes: {
    defaultMessage: "Attributes"
  },
  unauthorizedDashboardAccess: {
    defaultMessage: "Only staff users can access the dashboard"
  },
  uploadImage: {
    defaultMessage: "Upload image",
    description: "button"
  },
  yes: {
    defaultMessage: "Yes"
  },
  date: {
    defaultMessage: "Date"
  },
  time: {
    defaultMessage: "Time",
    description: "independent of any particular day, eg. 11:35"
  },
  cannotFullfillUnpaidOrder: {
    defaultMessage: "Can’t fulfill until payment is captured",
    description: "disabled option description"
  }
});

export const errorMessages = defineMessages({
  imgageUploadErrorTitle: {
    defaultMessage: "Couldn't process image"
  },
  imageUploadErrorText: {
    defaultMessage:
      "There was a poblem with the file you uploaded as an image and it couldn't be used. Please try a different file."
  },
  preorderEndDateInFutureErrorText: {
    defaultMessage: "Preorder end time needs to be set in the future"
  }
});

export const buttonMessages = defineMessages({
  accept: {
    defaultMessage: "Accept",
    description: "button"
  },
  approve: {
    defaultMessage: "Approve",
    description: "button"
  },
  assign: {
    defaultMessage: "Assign",
    description: "button"
  },
  back: {
    defaultMessage: "Back",
    description: "button"
  },
  cancel: {
    defaultMessage: "Cancel",
    description: "button"
  },
  clear: {
    defaultMessage: "Clear",
    description: "button"
  },
  confirm: {
    defaultMessage: "Confirm",
    description: "button"
  },
  continue: {
    defaultMessage: "Continue",
    description: "button"
  },
  create: {
    defaultMessage: "Create",
    description: "button"
  },
  delete: {
    defaultMessage: "Delete",
    description: "button"
  },
  done: {
    defaultMessage: "Done",
    description: "button"
  },
  edit: {
    defaultMessage: "Edit",
    description: "button"
  },
  manage: {
    defaultMessage: "Manage",
    description: "button"
  },
  nextStep: {
    defaultMessage: "Next",
    description: "go to next step, button"
  },
  ok: {
    defaultMessage: "OK",
    description: "button"
  },
  remove: {
    defaultMessage: "Remove",
    description: "button"
  },
  save: {
    defaultMessage: "Save",
    description: "button"
  },
  select: {
    defaultMessage: "Select",
    description: "select option, button"
  },
  selectAll: {
    defaultMessage: "Select All",
    description: "select all options, button"
  },
  send: {
    defaultMessage: "Send",
    description: "button"
  },
  show: {
    defaultMessage: "Show",
    description: "button"
  },
  undo: {
    defaultMessage: "Undo",
    description: "button"
  }
});

export const sectionNames = defineMessages({
  apps: {
    defaultMessage: "Apps",
    description: "apps section name"
  },
  attributes: {
    defaultMessage: "Attributes",
    description: "attributes section name"
  },
  categories: {
    defaultMessage: "Categories",
    description: "categories section name"
  },
  channels: {
    defaultMessage: "Channels",
    description: "channels section name"
  },
  collections: {
    defaultMessage: "Collections",
    description: "collections section name"
  },
  configuration: {
    defaultMessage: "Configuration",
    description: "configuration section name"
  },
  customers: {
    defaultMessage: "Customers",
    description: "customers section name"
  },
  draftOrders: {
    defaultMessage: "Draft Orders",
    description: "draft orders section name"
  },
  exchangeRates: {
    defaultMessage: "Exchange Rates",
    description: "Manage and Update your warehouse information"
  },
  giftCards: {
    defaultMessage: "Gift Cards",
    description: "gift cards section name"
  },
  home: {
    defaultMessage: "Home",
    description: "home section name"
  },
  navigation: {
    defaultMessage: "Navigation",
    description: "navigation section name"
  },
  orders: {
    defaultMessage: "Orders",
    description: "orders section name"
  },
  pageTypes: {
    defaultMessage: "Page Types",
    description: "page types section name"
  },
  pages: {
    defaultMessage: "Pages",
    description: "pages section name"
  },
  permissionGroups: {
    defaultMessage: "Permission Groups",
    description: "permission groups section name"
  },
  plugins: {
    defaultMessage: "Plugins",
    description: "plugins section name"
  },
  productTypes: {
    defaultMessage: "Product Types",
    description: "product types section name"
  },
  products: {
    defaultMessage: "Products",
    description: "products section name"
  },
  sales: {
    defaultMessage: "Sales",
    description: "sales section name"
  },
  serviceAccounts: {
    defaultMessage: "Service Accounts",
    description: "service accounts section name"
  },
  shipping: {
    defaultMessage: "Shipping Methods",
    description: "shipping section name"
  },
  siteSettings: {
    defaultMessage: "Site Settings",
    description: "site settings section name"
  },
  staff: {
    defaultMessage: "Staff Members",
    description: "staff section name"
  },
  taxes: {
    defaultMessage: "Taxes",
    description: "taxes section name"
  },
  translations: {
    defaultMessage: "Translations",
    description: "translations section name"
  },
  vouchers: {
    defaultMessage: "Vouchers",
    description: "vouchers section name"
  },
  warehouses: {
    defaultMessage: "Warehouses",
    description: "warehouses section name"
  },
  webhooks: {
    defaultMessage: "Webhooks",
    description: "webhooks section name"
  }
});

export const commonStatusMessages = defineMessages({
  cancelled: {
    defaultMessage: "Cancelled",
    description: "payment status"
  }
});

export const orderStatusMessages = defineMessages({
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
  partiallyReturned: {
    defaultMessage: "Partially returned",
    description: "order status"
  },
  readyToCapture: {
    defaultMessage: "Ready to capture",
    description: "order status"
  },
  readyToFulfill: {
    defaultMessage: "Ready to fulfill",
    description: "order status"
  },
  returned: {
    defaultMessage: "Returned",
    description: "order status"
  },
  unconfirmed: {
    defaultMessage: "Unconfirmed",
    description: "order status"
  },
  unfulfilled: {
    defaultMessage: "Unfulfilled",
    description: "order status"
  }
});

export const paymentStatusMessages = defineMessages({
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
  },
  pending: {
    defaultMessage: "Pending",
    description: "payment status"
  },
  refused: {
    defaultMessage: "Refused",
    description: "payment status"
  }
});

export function translateBoolean(value: boolean, intl: IntlShape): string {
  return value
    ? intl.formatMessage(commonMessages.yes)
    : intl.formatMessage(commonMessages.no);
}
