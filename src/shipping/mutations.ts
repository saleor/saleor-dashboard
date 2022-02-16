import { gql } from "@apollo/client";

export const deleteShippingZone = gql`
  mutation DeleteShippingZone($id: ID!) {
    shippingZoneDelete(id: $id) {
      errors {
        ...ShippingErrorFragment
      }
    }
  }
`;

export const bulkDeleteShippingZone = gql`
  mutation BulkDeleteShippingZone($ids: [ID]!) {
    shippingZoneBulkDelete(ids: $ids) {
      errors {
        ...ShippingErrorFragment
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
        ...ShippingErrorFragment
      }
      shippingZone {
        countries {
          ...CountryFragment
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
        ...ShippingErrorFragment
      }
      shippingZone {
        countries {
          ...CountryFragment
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
        ...ShippingErrorFragment
      }
      shippingMethod {
        ...ShippingMethodTypeFragment
      }
    }
  }
`;

export const createShippingRate = gql`
  mutation CreateShippingRate($input: ShippingPriceInput!) {
    shippingPriceCreate(input: $input) {
      errors {
        ...ShippingErrorFragment
      }
      shippingZone {
        ...ShippingZoneDetailsFragment
      }
      shippingMethod {
        ...ShippingMethodTypeFragment
      }
    }
  }
`;

export const deleteShippingRate = gql`
  mutation DeleteShippingRate($id: ID!) {
    shippingPriceDelete(id: $id) {
      errors {
        ...ShippingErrorFragment
      }
      shippingZone {
        ...ShippingZoneDetailsFragment
      }
    }
  }
`;

export const bulkDeleteShippingRate = gql`
  mutation BulkDeleteShippingRate($ids: [ID]!) {
    shippingPriceBulkDelete(ids: $ids) {
      errors {
        ...ShippingErrorFragment
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
        ...ShippingMethodTypeFragment
      }
      errors {
        ...ShippingChannelsErrorFragment
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
        ...ShippingErrorFragment
      }
    }
  }
`;

export const shippingPriceRemoveProductsFromExclude = gql`
  mutation ShippingPriceRemoveProductFromExclude($id: ID!, $products: [ID]!) {
    shippingPriceRemoveProductFromExclude(id: $id, products: $products) {
      errors {
        ...ShippingErrorFragment
      }
    }
  }
`;
