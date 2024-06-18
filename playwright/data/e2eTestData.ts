export const ATTRIBUTES = {
  productAttributeWithValuesToBeUpdated: {
    id: "QXR0cmlidXRlOjczMg==",
    name: "e2e product attribute to be updated",
    valueToBeDeleted: "e2e product attribute value to be deleted",
    valueToBeUpdated: "e2e product attribute value to be updated",
  },
  contentAttributeWithValuesToBeUpdated: {
    id: "QXR0cmlidXRlOjczMw==",
    name: "e2e content attribute to be updated",
    valueToBeDeleted: "e2e content attribute value to be deleted",
    valueToBeUpdated: "e2e content attribute value to be updated",
  },
  productAttributeToBeDeleted: {
    id: "QXR0cmlidXRlOjczNA==",
    name: "e2e product attribute to be deleted",
  },
  contentAttributeToBeDeleted: {
    id: "QXR0cmlidXRlOjczNQ==",
    name: "e2e content attribute to be deleted",
  },
  attributesToBeBulkDeleted: {
    names: [
      "e2e attribute to be bulk deleted 1/3",
      "e2e attribute to be bulk deleted 2/3",
      "e2e attribute to be bulk deleted 3/3",
    ],
  },
  attributesToBeUpdated: [
    {
      name: "e2e product attribute to be updated 1",
      id: "QXR0cmlidXRlOjc0MA==",
    },
    {
      name: "e2e content attribute to be updated 2",
      id: "QXR0cmlidXRlOjczOQ==",
    },
  ],
  attributeTypesWithAbilityToAddValues: {
    names: ["DROPDOWN", "MULTISELECT", "SWATCH"],
  },
  attributeTypesWithoutAbilityToAddValues: {
    names: ["FILE", "NUMERIC", "RICH_TEXT", "PLAIN_TEXT", "BOOLEAN", "DATE", "DATE_TIME"],
  },
  attributeReferencesEntities: {
    names: ["PAGE", "PRODUCT", "PRODUCT_VARIANT"],
  },
  attributeToBeAssignedToPageType: {
    name: "Attribute to be assigned to page type",
  },
};
export const VOUCHERS = {
  vouchers: {
    voucherToBeEditedWithFreeShipping: {
      id: "Vm91Y2hlcjoyMDI%3D",
    },
    voucherToBeEditedUsageLimits: {
      id: "Vm91Y2hlcjoyMDM%3D",
    },
    voucherToBeEditedMinimumQuantity: {
      id: "Vm91Y2hlcjoyMDQ%3D",
    },
    voucherToBeEditedAssignCategoryProductCollection: {
      id: "Vm91Y2hlcjoyMDk%3D",
      name: "Assign category, product, collection",
    },
    voucherToBeBulkDeleted: {
      names: ["Bulk delete voucher 1/2", "Bulk delete voucher 2/2"],
    },
    voucherToBeDeleted: {
      name: "Delete voucher",
      id: "Vm91Y2hlcjoyMDY%3D",
    },
  },
};
export const DISCOUNTS = {
  promotionToBeEdited: {
    name: "e2e promotion to be edited",
    type: "Catalog",
    id: "UHJvbW90aW9uOjI0MGVkZGVkLWYzMTAtNGUzZi1iNTlmLTFlMGFkYWE2ZWFkYg==",
  },
  promotionWithoutRulesToBeDeleted: {
    id: "UHJvbW90aW9uOjRmNTQwMDc1LTZlZGMtNDI1NC1hY2U2LTQ2MzdlMGYxZWJhOA==",
    name: "e2e Order predicate promotion without rules",
    type: "Order",
  },
  catalogPromotionWithRulesToBeDeleted: {
    id: "UHJvbW90aW9uOmYyY2VjMDhkLTVkYmUtNGVjNC05NTNjLWMzMmQ5ZGQ2MTExYw==",
    name: "e2e Catalog promo with rules to be deleted",
    type: "Catalog",
    rules: [
      {
        id: "UHJvbW90aW9uUnVsZTo3NDk4MGVhNS0zNDA2LTQxZGYtOTc3Mi1jMzg3MjNhMWEwOWM=",
        name: "rule 1",
      },

      {
        id: "UHJvbW90aW9uUnVsZTozMTEyMTE0Yy1hYjFkLTQ3OTktODY0My1jZDhlODMwYzllZmE=",
        name: "rule 2",
      },

      {
        id: "UHJvbW90aW9uUnVsZTozOWE3Zjc1Zi1jYTdmLTQ4ODgtOGE4NC02NzdjMTVhOGQ4Yjc=",
        name: "rule 3",
      },
    ],
  },
  orderPromotionWithRulesToBeDeleted: {
    id: "UHJvbW90aW9uOjA1MDllZjhjLTc0ZTEtNGMyMC1iZDk5LWRhYWU1YWJlZDM1Nw==",
    name: "e2e Order promo with rules to be deleted",
    type: "Order",
    rules: [
      {
        id: "UHJvbW90aW9uUnVsZTo2ZTdlODNkOS1kNjJlLTQ2YmQtOGE2ZS03OTdlYTZiODk2NmQ=",
        name: "rule #1",
      },

      {
        id: "UHJvbW90aW9uUnVsZTo1MzQwNjEyYy0wOWJhLTQxYzUtYmY2Yy1lYmUzZTQ3MjY0MjY=",
        name: "rule #2",
      },

      {
        id: "UHJvbW90aW9uUnVsZTpjMzk5ZTM1Ni04OWFhLTQ0MTUtYWE0Zi01NThlZDQ2M2IwNTM=",
        name: "rule #3",
      },
    ],
  },
  orderPromotionWithRulesToBeUpdated: {
    id: "UHJvbW90aW9uOjI0Njg3NmM5LWM1ZWMtNDBiYi1iMzExLWE3YWQ2YzBiZDc4NQ==",
    name: "e2e Order promo with rules to be updated",
    type: "Order",
    rules: [
      {
        id: "UHJvbW90aW9uUnVsZTo3NmEwOGYzZi0xMzZhLTRmNTUtYTc0NS1kZmIxNDZkOWI4ZGQ=",
        name: "rule 1",
        channel: "Channel-PLN",
        channelCurrency: "PLN",
      },

      {
        id: "UHJvbW90aW9uUnVsZTpjODIxMWJhNS05ZGRmLTRhYzQtOTdlMS04YmM0MzNhZjRlOTM=",
        name: "rule 2",
        channel: "Channel-PLN",
        channelCurrency: "PLN",
        giftRewardToBeDeleted: "UHJvZHVjdFZhcmlhbnQ6MjE0",
      },
    ],
  },
  catalogPromotionWithRulesToBeUpdated: {
    id: "UHJvbW90aW9uOmJkZTgyNGQ4LTk4ZTktNDM1NC04ODE4LTE1YzVjNmI2MWU2NQ==",
    name: "e2e Catalog promo with rules to be updated",
    type: "Catalog",
    rules: [
      {
        id: "UHJvbW90aW9uUnVsZTplOWZjNjc2NS1kNzM2LTRhMzMtYjBiMy1hZWMxY2FmNGVkMDE=",
        name: "rule #1",
        channel: "Channel-USD",
        channelCurrency: "USD",
      },

      {
        id: "UHJvbW90aW9uUnVsZToyZjM3ZjRhOS01NjY0LTQzMDEtOWU4Zi0zZTliZGFjNmUyYjE=",
        name: "rule 2",
        channel: "Channel-USD",
        channelCurrency: "USD",
      },
    ],
  },
  promotionWithRulesToBeDeleted: {
    name: "e2e Catalog predicate promotion with rules",
    id: "UHJvbW90aW9uOjY0N2M2MzdhLTZjNTEtNDYxZC05MjQ2LTc0YTY0OGM0ZjAxNA==",
  },
  cataloguePromotion: {
    name: "e2e Catalog promotion for adding rules",
    id: "UHJvbW90aW9uOjNmODZjZDAwLTUwNWEtNGVkNC04ZTliLTJmOGI4NGM3NGNlOQ==",
  },
  orderPromotion: {
    name: "e2e Order promotion for adding rules",
    id: "UHJvbW90aW9uOjJlM2VhNDkyLTRhMTAtNDYzOS05MWVmLTc1YzQ1OTUxNGQyMQ==",
  },
};

export const CUSTOMER_ADDRESS = {
  changeBillingAddress: {
    firstName: "Change Billing Address",
    lastName: "Automation",
    companyName: "Saleor",
    phone: "123456789",
    addressLine1: "Teczowa",
    addressLine2: "7",
    cityName: "WROCLAW",
    zip: "53-601",
    country: "Poland",
  },
  changeShippingAddress: {
    firstName: "Change Shipping Address",
    lastName: "Automation",
    companyName: "Saleor",
    phone: "123456789",
    addressLine1: "Teczowa",
    addressLine2: "7",
    cityName: "WROCLAW",
    zip: "53-601",
    country: "Poland",
  },
};
export const CATEGORIES = {
  categoryToBeUpdated: {
    id: "Q2F0ZWdvcnk6NTA3",
    name: "a category to be updated",
  },
  categoriesToBeBulkDeleted: {
    names: ["a cateogry to be bulk deleted 1/2", "a cateogry to be bulk deleted 2/2"],
  },
  e2eCategory: {
    id: "Q2F0ZWdvcnk6NTEx",
    name: "e2e category",
  },
};
export const COLLECTIONS = {
  collectionToBeUpdated: {
    id: "Q29sbGVjdGlvbjoxNjY%3D",
    name: "Collection to be updated",
  },
  collectionsToBeBulkDeleted: {
    names: ["Collection to be deleted 1/2", "Collection to be deleted 2/2"],
  },
  e2eCollection: {
    id: "Q29sbGVjdGlvbjoxNjc=",
    name: "e2e collection",
  },
};
export const COUNTRIES = {
  afghanistan: {
    countryCode: "AF",
    name: "Afghanistan",
  },
  albania: {
    countryCode: "AL",
    name: "Albania",
  },
  countryToBeAddedInTaxes: {
    name: "Bosnia and Herzegovina",
  },
};
export const CHANNELS = {
  channelToBeEditedSettings: {
    id: "Q2hhbm5lbDoyMzkx",
  },
  channelToBeDeleted: {
    name: "z - channel to be deleted",
  },
  channelForTaxEdition: {
    name: "a channel for tax tests",
  },
  plnChannel: {
    id: "VGF4Q29uZmlndXJhdGlvbjox",
  },
  e2eChannelDoNotDelete: {
    id: "Q2hhbm5lbDoyMzk0",
    name: "e2e-channel-do-not-delete",
    slug: "e2e-channel-do-not-delete",
  },
  channelUSD: {
    id: "Q2hhbm5lbDoyMjQz",
    name: "Channel-USD",
  },
  channelPLN: {
    id: "Q2hhbm5lbDoyMjQ0",
    name: "Channel-PLN",
    currency: "PLN",
  },
};
export const GIFT_CARDS = {
  giftCardToBeEdited: {
    id: "R2lmdENhcmQ6NTM%3D",
    name: "Code ending with AD47",
  },
  giftCardsToBeDeleted: {
    names: ["to be deleted 1/2", "to be deleted 2/2"],
    last4: ["5EE6", "9E39"],
  },
  giftCardToBeActivated: {
    id: "R2lmdENhcmQ6NTQ%3D",
    name: "Code ending with 7FF8",
  },
  giftCardToBeDeactivated: {
    id: "R2lmdENhcmQ6NTU%3D",
    name: "Code ending with F2DA",
  },
  giftCardToResendCode: {
    id: "R2lmdENhcmQ6Ng%3D%3D",
    name: "Code ending with d_10",
  },
};
export const WAREHOUSES = {
  warehouseToBeEdited: {
    id: "V2FyZWhvdXNlOjgzNGQwYjQwLWMwZGItNGRhZi04N2RjLWQ2ODBiYzY3NGVlMw%3D%3D",
    name: "warehouse to be edited",
  },
  warehouseToBeDeleted: {
    name: "warehouseto be deleted",
  },
  warehouseEurope: {
    id: "V2FyZWhvdXNlOjlkYjY4NWQxLWViMTktNDU2ZS05ODMyLTMxODA3ZWM0NDdhOQ==",
    name: "Europe",
  },
  warehouseAmericas: {
    id: "V2FyZWhvdXNlOjdmZDA0OGI0LWYwNzItNDZmMi1iMDMyLTc3ZWU3MDNiMzM3Yg==",
    name: "Americas",
  },
  warehouseOceania: {
    id: "V2FyZWhvdXNlOjc4OGUyMGRlLTlmYTAtNDI5My1iZDk2LWUwM2RjY2RhMzc0ZQ==",
    name: "Oceania",
  },
  warehouseAfrica: {
    id: "V2FyZWhvdXNlOjk1NWY0ZDk2LWRmNTAtNGY0Zi1hOTM4LWM5MTYzYTA4YTViNg==",
    name: "Africa",
  },
};

export const PRODUCTS = {
  singleProductType: {
    id: "UHJvZHVjdFR5cGU6Njcy",
    info: "Single product type",
  },
  singleProductTypeToBeUpdated: {
    id: "UHJvZHVjdDo3NjE%3D",
    info: "Single product type to be updated",
  },
  e2eProduct1: {
    id: "UHJvZHVjdDo3OQ==",
    name: "Bean Juice",
  },
  e2eProduct2: {
    id: "UHJvZHVjdDoxMTU=",
    name: "Black Hoodie",
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
  e2eProductWithVariant1: {
    id: "UHJvZHVjdDo4NQ==",
    name: "Colored Parrot Cushion",
    variantId: "UHJvZHVjdFZhcmlhbnQ6OTgy",
    variantName: "70 / 70",
  },
  e2eProductWithVariant2: {
    id: "UHJvZHVjdDoxMTY=",
    name: "Blue Hoodie 2",
    variantId: "UHJvZHVjdFZhcmlhbnQ6MzAx",
    variantName: "S",
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
  draftOrdersToBeDeleted: {
    ids: ["#3266", "#3265"],
  },
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
    id: "T3JkZXI6Yzg2ZDMzYmEtMTA5Yi00MzUyLTkzYWItOTljMGE3Zjk4ZGE5",
  },
  orderFulfilledToChangeBillingAddress: {
    id: "T3JkZXI6MDIzNDhmMjktNzJiOC00ZTBkLWI1ODYtY2U3OTYwZDI0Y2Q0",
  },
  orderNotFulfilledToChangeShippingAddress: {
    id: "T3JkZXI6ZWFhZjA0MzgtNzkyYi00ZTdlLWIyODUtMTBkMjViMjM0MzRk",
  },
  fullyPaidOrdersWithSingleTransaction: {
    first: {
      id: "T3JkZXI6ZjZjZWUxMzItNDk2Zi00MWUyLWJkNTItYTk1MDM1YTVlZmVm",
      lineItems: [
        {
          name: "Bean Juice",
          quantity: "1",
        },
        { name: "Lake Tunes", quantity: "2" },
      ],
    },
    second: {
      id: "T3JkZXI6YzI4YjFmYmEtZWU1NS00YmU5LTg5MjktNTMyYzk5MDlkZGVk",
      lineItems: ["Blue Hoodie 2", "Black Hoodie", "Mustard Hoodie", "White Hoodie"],
    },
  },
  fullyPaidOrderWithSeveralTransactions: {
    id: "T3JkZXI6MTVhYTEwMzYtZWE3OS00MzJiLTliODctNDhlYTMwYmU1NmNl",
  },
  partiallyPaidOrder: {
    id: "T3JkZXI6NmVlMDMwMTctZTViOS00OGNmLWFkYTQtODg4YTQ5MDI3ZjNk",
  },
  orderWithRefunds: {
    id: "T3JkZXI6Y2YyY2EwNWYtZmQ3Yy00ODk5LThjZTktMzQ4NjYxYThjZDkx",
    refunds: [
      {
        lineOrderRefundId: "T3JkZXJHcmFudGVkUmVmdW5kOjE=",
        amount: 4.5,
      },
      {
        manualRefundId: "",
        amount: 22.0,
      },
    ],
  },
};

export const SHIPPING_METHODS = {
  shippingMethodWithoutRates: {
    id: "U2hpcHBpbmdab25lOjIzOTA%3D",
    info: "Shipping method that is used to add rates",
  },
  shippingMethodToBeUpdated: {
    id: "U2hpcHBpbmdab25lOjIzOTI=",
    info: "Shipping zone to be updated",
    name: "e2e-test-shippingZone-to-be-updated",
  },
  shippingMethodToBeBulkDeleted1: {
    id: "U2hpcHBpbmdab25lOjIzOTM=",
    info: "First shipping zone to be bulk deleted",
    name: "e2e-test-shippingZone-to-be-bulk-deleted-1",
  },
  shippingMethodToBeBulkDeleted2: {
    id: "U2hpcHBpbmdab25lOjIzOTQ=",
    info: "Second shipping zone to be bulk deleted",
    name: "e2e-test-shippingZone-to-be-bulk-deleted-2",
  },
  shippingMethodToBeBulkDeleted3: {
    id: "U2hpcHBpbmdab25lOjIzOTU=",
    info: "Third shipping zone to be bulk deleted",
    name: "e2e-test-shippingZone-to-be-bulk-deleted-3",
  },
  shippingMethodWithRatesToBeDeleted: {
    id: "U2hpcHBpbmdab25lOjIzODk%3D",
    info: "Shipping zone with methods to be deleted",
    name: "e2e-test-shippingZone-to-be-deleted",
    rates: {
      priceBasedRateToBeDeleted: {
        id: "U2hpcHBpbmdNZXRob2RUeXBlOjIyMjA=",
        info: "Price based shipping rate",
        name: "shippingMEthod_to-be-deleted",
      },
      weightBasedRateToBeDeleted: {
        id: "U2hpcHBpbmdNZXRob2RUeXBlOjIyMjA=",
        info: "Weight based shipping rate",
        name: "shippingMethod_to_be_deleted",
      },
    },
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
  staffToBeEdited: {
    id: "VXNlcjoxMzcx",
    name: "e2e_staff_to_be_updated",
    lastName: "DO NOT DELETE",
    email: "test123@hotmail.com",
    permission: "Apps management",
  },
  staffToBeDeleted: {
    id: "VXNlcjoxMzcy",
    name: "e2e_staff_to_be_deleted",
    lastName: "DO NOT DELETE",
  },
};

export const APPS = {
  appToBeDeleted: {
    id: "QXBwOjcw",
    name: "Saleor QA App",
    info: "App used in delete app test",
  },
};

export const TRANSLATIONS = {
  translationsToBeAdded: {
    id: "Q2F0ZWdvcnk6NTEy",
    name: "CategoryToTranslate",
    info: "Category used to add translation test",
  },
  translationsToBeEdited: {
    id: "UHJvZHVjdDo3OA==",
    name: "Green Juice",
    info: "Product used to edit translation test",
  },
  translationsToBeCleared: {
    id: "Q29sbGVjdGlvbjox",
    name: "Summer collection",
    info: "Translation used in clear translation test",
  },
};

export const NAVIGATION_ITEMS = {
  navigationMenuToBeUpdated: {
    name: "e2e-menu-to-be-updated",
    id: "TWVudTozNQ==",
    menuItems: [
      { name: "e2e-menu-item-to-be-updated", link: "Groceries" },
      { name: "e2e-menu-item-to-be-deleted", link: "Accessories" },
    ],
  },
  navigationMenuToBeDeletedFromList: {
    id: "TWVudTozOQ==",
    name: "e2e-menu-to-be-deleted-from-list",
  },
  navigationMenuToBeDeletedFromDetailsView: {
    id: "TWVudTo0MA==",
    name: "e2e-menu-to-be-deleted-from-details-view",
  },
  navigationMenusToBeBulkDeleted: {
    names: ["e2e-menu-to-be-bulk-deleted 1/2", "e2e-menu-to-be-bulk-deleted 2/2"],
  },
};

export const PERMISSION_GROUPS = {
  permissionGroupToBeEdited: {
    id: "R3JvdXA6MTEx",
    name: "e2e_permission_group_to_be_updated",
    assignedMembers: {
      names: [
        "e2e_permission_group_member_1 test",
        "e2e_permission_group_member_2 test",
        "e2e_permission_group_member_3 test",
      ],
    },
    assignedPermissions: {
      names: ["MANAGE_PRODUCTS", "MANAGE_PLUGINS", "MANAGE_STAFF"],
    },
  },
  permissionGroupToBeDeleted: {
    id: "R3JvdXA6MTEw",
    name: "e2e_permission_group_to_be_deleted",
  },
  permissionGroupMembers: [
    {
      name: "e2e_permission_group_member_1 test",
      email: "e2e_permission_group_member_1@grr.la",
    },
    {
      name: "e2e_permission_group_member_2 test",
      email: "e2e_permission_group_member_2@grr.la",
    },
    {
      name: "e2e_permission_group_member_3 test",
      email: "e2e_permission_group_member_3@grr.la",
    },
  ],
};

export const PAGE_TYPES = {
  pageTypeToBeEdited: {
    id: "UGFnZVR5cGU6MzQ=",
    name: "A page type to be edited",
    info: "Page type used in edit page type test",
  },
  pageTypeToBeRemoved: {
    id: "UGFnZVR5cGU6MzU=",
    name: "A page type to be removed",
    info: "Page type used in delete page type test",
  },
  pageTypesToBeBulkDeleted: {
    names: ["a page type to be bulk deleted 1/2", "a page type to be bulk deleted 2/2"],
    ids: ["UGFnZVR5cGU6MzY=", "UGFnZVR5cGU6Mzc="],
  },
};
export const PRODUCT_TYPES = {
  productTypeToBeEdited: {
    id: "UHJvZHVjdFR5cGU6Njk4",
    name: "A product type to be edited",
    info: "Product type used in edit product type test",
  },
  productTypeToBeRemoved: {
    id: "UHJvZHVjdFR5cGU6Njk5",
    name: "A product type to be removed",
    info: "Product type used in delete product type test",
  },
  productTypesToBeBulkDeleted: {
    names: ["a product type to be bulk deleted 1/2", "a product type to be bulk deleted 2/2"],
    ids: ["UHJvZHVjdFR5cGU6NzAw", "UHJvZHVjdFR5cGU6NzAx"],
  },
};
export const CUSTOMERS = {
  deleteCustomer: {
    id: "VXNlcjoxMzY3",
    email: "e2e_customer@delete.com",
  },
  editCustomer: {
    id: "VXNlcjoxMzY2",
    email: "e2e_customer_with_addresses@saleor.io",
    note: "simple note",
    initialShippingAddress: {
      firstName: "e2e_customer_with_addresses",
      lastName: "to-be-edited",
      companyName: "Saleor",
      phone: "+48225042123",
      addressLine1: "Teczowa",
      addressLine2: "7",
      city: "WROCLAW",
      zip: "53-601",
      country: "Poland",
    },
    initialBillingAddress: {
      firstName: "address",
      lastName: "to-be-deleted",
      companyName: "Saleor",
      phone: "+48225042123",
      addressLine1: "Teczowa",
      addressLine2: "7",
      city: "WROCLAW",
      zip: "53-601",
      country: "Poland",
    },
    additionalAddress: {
      firstName: "Test",
      lastName: "Test",
      addressLine1: "Nowy Świat",
      city: "WARSZAWA",
      zip: "00-504",
      country: "Poland",
    },
  },
  customersToBeBulkDeleted: {
    names: [
      "e2e_customer_1 bulk-delete",
      "e2e_customer_2 bulk-delete",
      "e2e_customer_3 bulk-delete",
    ],
  },
  customerToBeActivated: {
    id: "VXNlcjoxMzY0",
    email: "e2e-customer@activate.com",
    firstName: "e2e-customer",
    lastName: "to-be-activated",
  },
  customerToBeDeactivated: {
    id: "VXNlcjoxMzY1",
    email: "e2e-customer@deactivate.com",
    firstName: "e2e-customer",
    lastName: "to-be-deactivated",
  },
};
