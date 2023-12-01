export const PRODUCTS = {
  singleProductType: {
    id: "UHJvZHVjdFR5cGU6Njcy",
    info: "Single product type",
  },
  productToAddVariants: {
    id: "UHJvZHVjdDo3Mjk%3D",
    info: "Product that does not contain any variant yet",
  },
  productWithOneVariant: {
    id: "UHJvZHVjdDo3MzM%3D",
    info: "Product that contains single variant",
  },
  productWithOneVariantToBeDeletedFromDetails: {
    name: "beer to be deleted",
    id: "UHJvZHVjdDo3NTc%3D",
    info: "Product that contains single variant - to be deleted from details view",
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
