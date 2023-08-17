export { createChannel, updateChannelOrderSettings } from "./Channels";
export { createCustomer, deleteCustomersStartsWith } from "./Customer";
export {
  createDraftOrder,
  getDraftOrdersList,
  getOrder,
  getOrdersList,
  updateOrdersSettings,
} from "./Order";
export { updateMetadata, updatePrivateMetadata } from "./Metadata";
export { getProductMetadata } from "./storeFront/ProductDetails";
export { activatePlugin, updatePlugin } from "./Plugins";
export {
  deleteStaffMembersStartsWith,
  updateStaffMember,
} from "./StaffMembers";
export * as productsRequests from "./Product";
export * as productsTypeRequests from "./ProductType";
export * as attributeRequests from "./Attribute";
export * as pageRequests from "./Page";
export * as pageTypeRequests from "./PageType";
