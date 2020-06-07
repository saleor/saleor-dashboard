import { defineMessages, IntlShape } from "react-intl";

export const commonMessages = defineMessages({
  availability: {
    defaultMessage: "Availability"
  },
  catalog: {
    defaultMessage: "Catalog"
  },
  dashboard: {
    defaultMessage: "Dashboard"
  },
  description: {
    defaultMessage: "Description"
  },
  discounts: {
    defaultMessage: "Discounts"
  },
  drafts: {
    defaultMessage: "Drafts"
  },
  email: {
    defaultMessage: "E-mail Address"
  },
  endDate: {
    defaultMessage: "End Date"
  },
  endHour: {
    defaultMessage: "End Hour"
  },
  firstName: {
    defaultMessage: "First Name"
  },
  generalInformations: {
    defaultMessage: "General Informations"
  },
  lastName: {
    defaultMessage: "Last Name"
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
  summary: {
    defaultMessage: "Summary"
  },
  uploadImage: {
    defaultMessage: "Upload image",
    description: "button"
  },
  yes: {
    defaultMessage: "Yes"
  }
});

export const buttonMessages = defineMessages({
  accept: {
    defaultMessage: "Accept",
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
  attributes: {
    defaultMessage: "Attributes",
    description: "attributes section name"
  },
  categories: {
    defaultMessage: "Categories",
    description: "categories section name"
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

export function translateBoolean(value: boolean, intl: IntlShape): string {
  return value
    ? intl.formatMessage(commonMessages.yes)
    : intl.formatMessage(commonMessages.no);
}
