import {
  shippingChannelsErrorFragment,
  shippingErrorFragment
} from "@saleor/fragments/errors";
import {
  shippingMethodFragment,
  shippingMethodWithZipCodesFragment,
  shippingZoneDetailsFragment
} from "@saleor/fragments/shipping";
import { countryFragment } from "@saleor/fragments/taxes";
import makeMutation from "@saleor/hooks/makeMutation";
import gql from "graphql-tag";

import {
  BulkDeleteShippingRate,
  BulkDeleteShippingRateVariables
} from "./types/BulkDeleteShippingRate";
import {
  BulkDeleteShippingZone,
  BulkDeleteShippingZoneVariables
} from "./types/BulkDeleteShippingZone";
import {
  CreateShippingRate,
  CreateShippingRateVariables
} from "./types/CreateShippingRate";
import {
  CreateShippingZone,
  CreateShippingZoneVariables
} from "./types/CreateShippingZone";
import {
  DeleteShippingRate,
  DeleteShippingRateVariables
} from "./types/DeleteShippingRate";
import {
  DeleteShippingZone,
  DeleteShippingZoneVariables
} from "./types/DeleteShippingZone";
import {
  ShippingMethodChannelListingUpdate,
  ShippingMethodChannelListingUpdateVariables
} from "./types/ShippingMethodChannelListingUpdate";
import {
  ShippingMethodZipCodeRangeAssign,
  ShippingMethodZipCodeRangeAssignVariables
} from "./types/ShippingMethodZipCodeRangeAssign";
import {
  ShippingMethodZipCodeRangeUnassign,
  ShippingMethodZipCodeRangeUnassignVariables
} from "./types/ShippingMethodZipCodeRangeUnassign";
import {
  ShippingPriceExcludeProduct,
  ShippingPriceExcludeProductVariables
} from "./types/ShippingPriceExcludeProduct";
import {
  ShippingPriceRemoveProductFromExclude,
  ShippingPriceRemoveProductFromExcludeVariables
} from "./types/ShippingPriceRemoveProductFromExclude";
import {
  UpdateDefaultWeightUnit,
  UpdateDefaultWeightUnitVariables
} from "./types/UpdateDefaultWeightUnit";
import {
  UpdateShippingRate,
  UpdateShippingRateVariables
} from "./types/UpdateShippingRate";
import {
  UpdateShippingZone,
  UpdateShippingZoneVariables
} from "./types/UpdateShippingZone";

const deleteShippingZone = gql`
  ${shippingErrorFragment}
  mutation DeleteShippingZone($id: ID!) {
    shippingZoneDelete(id: $id) {
      errors: shippingErrors {
        ...ShippingErrorFragment
      }
    }
  }
`;
export const useShippingZoneDelete = makeMutation<
  DeleteShippingZone,
  DeleteShippingZoneVariables
>(deleteShippingZone);

const bulkDeleteShippingZone = gql`
  ${shippingErrorFragment}
  mutation BulkDeleteShippingZone($ids: [ID]!) {
    shippingZoneBulkDelete(ids: $ids) {
      errors: shippingErrors {
        ...ShippingErrorFragment
      }
    }
  }
`;
export const useShippingZoneBulkDelete = makeMutation<
  BulkDeleteShippingZone,
  BulkDeleteShippingZoneVariables
>(bulkDeleteShippingZone);

const updateDefaultWeightUnit = gql`
  mutation UpdateDefaultWeightUnit($unit: WeightUnitsEnum) {
    shopSettingsUpdate(input: { defaultWeightUnit: $unit }) {
      errors {
        field
        message
      }
      shop {
        defaultWeightUnit
      }
    }
  }
`;
export const useDefaultWeightUnitUpdate = makeMutation<
  UpdateDefaultWeightUnit,
  UpdateDefaultWeightUnitVariables
>(updateDefaultWeightUnit);

const createShippingZone = gql`
  ${countryFragment}
  ${shippingErrorFragment}
  mutation CreateShippingZone($input: ShippingZoneCreateInput!) {
    shippingZoneCreate(input: $input) {
      errors: shippingErrors {
        ...ShippingErrorFragment
      }
      shippingZone {
        countries {
          ...CountryFragment
        }
        default
        id
        name
      }
    }
  }
`;
export const useShippingZoneCreate = makeMutation<
  CreateShippingZone,
  CreateShippingZoneVariables
>(createShippingZone);

const updateShippingZone = gql`
  ${countryFragment}
  ${shippingErrorFragment}
  mutation UpdateShippingZone($id: ID!, $input: ShippingZoneUpdateInput!) {
    shippingZoneUpdate(id: $id, input: $input) {
      errors: shippingErrors {
        ...ShippingErrorFragment
      }
      shippingZone {
        countries {
          ...CountryFragment
        }
        default
        id
        name
      }
    }
  }
`;
export const useShippingZoneUpdate = makeMutation<
  UpdateShippingZone,
  UpdateShippingZoneVariables
>(updateShippingZone);

const updateShippingRate = gql`
  ${shippingErrorFragment}
  ${shippingMethodFragment}
  mutation UpdateShippingRate($id: ID!, $input: ShippingPriceInput!) {
    shippingPriceUpdate(id: $id, input: $input) {
      errors: shippingErrors {
        ...ShippingErrorFragment
      }
      shippingMethod {
        ...ShippingMethodFragment
      }
    }
  }
`;
export const useShippingRateUpdate = makeMutation<
  UpdateShippingRate,
  UpdateShippingRateVariables
>(updateShippingRate);

const createShippingRate = gql`
  ${shippingErrorFragment}
  ${shippingMethodFragment}
  ${shippingZoneDetailsFragment}
  mutation CreateShippingRate($input: ShippingPriceInput!) {
    shippingPriceCreate(input: $input) {
      errors: shippingErrors {
        ...ShippingErrorFragment
      }
      shippingZone {
        ...ShippingZoneDetailsFragment
      }
      shippingMethod {
        ...ShippingMethodFragment
      }
    }
  }
`;
export const useShippingRateCreate = makeMutation<
  CreateShippingRate,
  CreateShippingRateVariables
>(createShippingRate);

const deleteShippingRate = gql`
  ${shippingErrorFragment}
  ${shippingZoneDetailsFragment}
  mutation DeleteShippingRate($id: ID!) {
    shippingPriceDelete(id: $id) {
      errors: shippingErrors {
        ...ShippingErrorFragment
      }
      shippingZone {
        ...ShippingZoneDetailsFragment
      }
    }
  }
`;
export const useShippingRateDelete = makeMutation<
  DeleteShippingRate,
  DeleteShippingRateVariables
>(deleteShippingRate);

const bulkDeleteShippingRate = gql`
  ${shippingErrorFragment}
  mutation BulkDeleteShippingRate($ids: [ID]!) {
    shippingPriceBulkDelete(ids: $ids) {
      errors: shippingErrors {
        ...ShippingErrorFragment
      }
    }
  }
`;
export const useShippingRateBulkDelete = makeMutation<
  BulkDeleteShippingRate,
  BulkDeleteShippingRateVariables
>(bulkDeleteShippingRate);

export const shippingMethodChannelListingUpdate = gql`
  ${shippingChannelsErrorFragment}
  ${shippingMethodFragment}
  mutation ShippingMethodChannelListingUpdate(
    $id: ID!
    $input: ShippingMethodChannelListingInput!
  ) {
    shippingMethodChannelListingUpdate(id: $id, input: $input) {
      shippingMethod {
        ...ShippingMethodFragment
      }
      errors: shippingErrors {
        ...ShippingChannelsErrorFragment
      }
    }
  }
`;

export const useShippingMethodChannelListingUpdate = makeMutation<
  ShippingMethodChannelListingUpdate,
  ShippingMethodChannelListingUpdateVariables
>(shippingMethodChannelListingUpdate);

export const shippingMethodZipCodeRangeAssign = gql`
  ${shippingChannelsErrorFragment}
  ${shippingMethodWithZipCodesFragment}
  mutation ShippingMethodZipCodeRangeAssign(
    $id: ID!
    $input: ShippingZipCodeRulesCreateInput!
  ) {
    shippingMethodZipCodeRulesCreate(shippingMethodId: $id, input: $input) {
      errors: shippingErrors {
        ...ShippingChannelsErrorFragment
      }
      shippingMethod {
        ...ShippingMethodWithZipCodesFragment
      }
    }
  }
`;

export const useShippingMethodZipCodeRangeAssign = makeMutation<
  ShippingMethodZipCodeRangeAssign,
  ShippingMethodZipCodeRangeAssignVariables
>(shippingMethodZipCodeRangeAssign);

export const shippingMethodZipCodeRulesDelete = gql`
  ${shippingChannelsErrorFragment}
  ${shippingMethodWithZipCodesFragment}
  mutation ShippingMethodZipCodeRangeUnassign($id: ID!) {
    shippingMethodZipCodeRulesDelete(id: $id) {
      errors: shippingErrors {
        ...ShippingChannelsErrorFragment
      }
      shippingMethod {
        ...ShippingMethodWithZipCodesFragment
      }
    }
  }
`;

export const useShippingMethodZipCodeRangeUnassign = makeMutation<
  ShippingMethodZipCodeRangeUnassign,
  ShippingMethodZipCodeRangeUnassignVariables
>(shippingMethodZipCodeRulesDelete);

export const shippingPriceExcludeProducts = gql`
  ${shippingErrorFragment}
  mutation ShippingPriceExcludeProduct(
    $id: ID!
    $input: ShippingPriceExcludeProductsInput!
  ) {
    shippingPriceExcludeProducts(id: $id, input: $input) {
      errors: shippingErrors {
        ...ShippingErrorFragment
      }
    }
  }
`;

export const useShippingPriceExcludeProduct = makeMutation<
  ShippingPriceExcludeProduct,
  ShippingPriceExcludeProductVariables
>(shippingPriceExcludeProducts);

export const shippingPriceRemoveProductsFromExclude = gql`
  ${shippingErrorFragment}
  mutation ShippingPriceRemoveProductFromExclude($id: ID!, $products: [ID]!) {
    shippingPriceRemoveProductFromExclude(id: $id, products: $products) {
      errors: shippingErrors {
        ...ShippingErrorFragment
      }
    }
  }
`;

export const useShippingPriceRemoveProductsFromExclude = makeMutation<
  ShippingPriceRemoveProductFromExclude,
  ShippingPriceRemoveProductFromExcludeVariables
>(shippingPriceRemoveProductsFromExclude);
