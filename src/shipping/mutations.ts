import { gql } from "@apollo/client";

export const deleteShippingZone = gql`
  mutation DeleteShippingZone($id: ID!) {
    shippingZoneDelete(id: $id) {
      errors {
        ...ShippingError
      }
    }
  }
`;

export const bulkDeleteShippingZone = gql`
  mutation BulkDeleteShippingZone($ids: [ID!]!) {
    shippingZoneBulkDelete(ids: $ids) {
      errors {
        ...ShippingError
      }
    }
  }
`;

export const updateDefaultWeightUnit = gql`
  mutation UpdateDefaultWeightUnit($unit: WeightUnitsEnum) {
    shopSettingsUpdate(input: { defaultWeightUnit: $unit }) {
      errors {
        ...ShopSettingsUpdateErrorFragment
      }
      shop {
        defaultWeightUnit
      }
    }
  }
`;

export const createShippingZone = gql`
  mutation CreateShippingZone($input: ShippingZoneCreateInput!) {
    shippingZoneCreate(input: $input) {
      errors {
        ...ShippingError
      }
      shippingZone {
        countries {
          ...Country
        }
        id
        name
      }
    }
  }
`;

export const updateShippingZone = gql`
  mutation UpdateShippingZone($id: ID!, $input: ShippingZoneUpdateInput!) {
    shippingZoneUpdate(id: $id, input: $input) {
      errors {
        ...ShippingError
      }
      shippingZone {
        countries {
          ...Country
        }
        id
        name
      }
    }
  }
`;

export const updateShippingRate = gql`
  mutation UpdateShippingRate($id: ID!, $input: ShippingPriceInput!) {
    shippingPriceUpdate(id: $id, input: $input) {
      errors {
        ...ShippingError
      }
      shippingMethod {
        ...ShippingMethodType
      }
    }
  }
`;

export const createShippingRate = gql`
  mutation CreateShippingRate($input: ShippingPriceInput!) {
    shippingPriceCreate(input: $input) {
      errors {
        ...ShippingError
      }
      shippingZone {
        ...ShippingZoneDetails
      }
      shippingMethod {
        ...ShippingMethodType
      }
    }
  }
`;

export const deleteShippingRate = gql`
  mutation DeleteShippingRate($id: ID!) {
    shippingPriceDelete(id: $id) {
      errors {
        ...ShippingError
      }
      shippingZone {
        ...ShippingZoneDetails
      }
    }
  }
`;

export const bulkDeleteShippingRate = gql`
  mutation BulkDeleteShippingRate($ids: [ID!]!) {
    shippingPriceBulkDelete(ids: $ids) {
      errors {
        ...ShippingError
      }
    }
  }
`;

export const shippingMethodChannelListingUpdate = gql`
  mutation ShippingMethodChannelListingUpdate(
    $id: ID!
    $input: ShippingMethodChannelListingInput!
  ) {
    shippingMethodChannelListingUpdate(id: $id, input: $input) {
      shippingMethod {
        ...ShippingMethodType
      }
      errors {
        ...ShippingChannelsError
      }
    }
  }
`;

export const shippingPriceExcludeProducts = gql`
  mutation ShippingPriceExcludeProduct(
    $id: ID!
    $input: ShippingPriceExcludeProductsInput!
  ) {
    shippingPriceExcludeProducts(id: $id, input: $input) {
      errors {
        ...ShippingError
      }
    }
  }
`;

export const shippingPriceRemoveProductsFromExclude = gql`
  mutation ShippingPriceRemoveProductFromExclude($id: ID!, $products: [ID!]!) {
    shippingPriceRemoveProductFromExclude(id: $id, products: $products) {
      errors {
        ...ShippingError
      }
    }
  }
`;
