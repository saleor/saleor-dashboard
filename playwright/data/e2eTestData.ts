export const PRODUCTS = {
  singleProductType: {
    id: "UHJvZHVjdFR5cGU6Njcy",
    info: "Single product type",
  },
  singleProductTypeToBeUpdated: {
    id: "UHJvZHVjdDo3NjE%3D",
    info: "Single product type to be updated",
  },
  productAvailableOnlyInPlnChannel: {
    id: "UHJvZHVjdDo3NjM%3D",
    name: "a beer available only in pln channel",
    info: "Product available only in PLN channel",
  },
  productAvailableOnlyInUsdChannel: {
    id: "UHJvZHVjdDo3NjQ%3D",
    name: "a beer available only in USD channel",
    info: "Product available only in USD channel",
  },
  productToAddVariants: {
    id: "UHJvZHVjdDo3Mjk%3D",
    name: "beer with variants",
    info: "Product that does not contain any variant yet",
  },
  productWithOneVariant: {
    id: "UHJvZHVjdDo3MzM%3D",
    info: "Product that contains single variant",
  },
  singleVariantDeleteProduct: {
    productId: "UHJvZHVjdDo3Njc%3D",
    variantId: "UHJvZHVjdFZhcmlhbnQ6MTIzNg%3D%3D",
    productName: "beer with variant to be deleted",
    info: "Delete variant via it details page product",
  },
  multipleVariantsBulkDeleteProduct: {
    productId: "UHJvZHVjdDo3NjY%3D",
    productName: "juice with variant to be deleted",
    info: "Delete multiple variants via grid product page",
  },
  productWithVariantWhichWillBeUpdated: {
    id: "UHJvZHVjdDo3NjU%3D",
    name: "product with variant which will be updated",
    variantId: "UHJvZHVjdFZhcmlhbnQ6MTIzMg%3D%3D",
    variantName: "update variant",
    info: "Product with variant which will be updated",
  },
  productWithOneVariantToBeDeletedFromDetails: {
    name: "beer to be deleted",
    id: "UHJvZHVjdDo3NTc%3D",
    info: "Product that contains single variant - to be deleted from details view",
  },
  productAvailableWithTransactionFlow: {
    name: "Coconut Juice transaction flow",
    id: "UHJvZHVjdDo3Ng%3D%3D",
    variant1sku: "84725784",
    info: "Product which is available within channel with activated transaction flow",
  },
  productsToBeBulkDeleted: {
    names: [
      "a product to be deleted via bulk 1/3",
      "a product to be deleted via bulk 2/3",
      "a product to be deleted via bulk 3/3",
    ],
  },
};

export const ORDERS = {
  ordersWithinTransactionFlow: {
    markAsPaidOrder: {
      orderId: "T3JkZXI6MDE4ZWM0NGUtNTgwMC00NGM0LTliMzAtZDE3YTIxYjljOTgz",
      info: "Order used to mark as paid and fulfill",
    },
    captureManualTransactionOrder: {
      orderId: "T3JkZXI6MmE1NTNkMzktOWU0OS00ZWE5LWIyNzEtNzk2ZWI5OGJhNzcz",
      info: "Order used to capture manual transactions and fulfill",
    },
  },
  orderToAddTrackingNumberTo: {
    id: "T3JkZXI6M2NkYWE4NGItNzgxNi00ZWI2LWE1MGMtODE0NzY5YWM0MTEw",
  },
  orderToMarkAsPaidAndFulfill: {
    id: "T3JkZXI6MjNmYTNlMWQtNzg1Ni00NjJhLWIzZjUtMDEwNzIxNGEzMWNk",
  },
};

export const SHIPPING_METHODS = {
  shippingMethodWithoutRates: {
    id: "U2hpcHBpbmdab25lOjIzNzg%3D",
    info: "Shipping method that is used to add rates",
  },
};
export const USERS = {
  userToBeDeactivated: {
    id: "VXNlcjoxMzQ3",
    email: "user-to-be-deactivated@gmai.com",
    info: "Active user used in deactivation user test",
  },
  userToBeActivated: {
    id: "VXNlcjoxMzQ5",
    email: "user-to-be-activated@gmai.com",
    info: "Inactive user used in activation user test",
  },
  userForPasswordReset: {
    email: "user-for-password-reset@gmail.com",
    newPassword: "4321test",
    info: "User used in reset password test",
    name: "e2e",
    lastName: "user",
  },
  userForPasswordChange: {
    email: "change-password-user@gmail.com",
    newPassword: "4321test",
    info: "User used in change password test",
    name: "change password",
    lastName: "user",
  },
};
