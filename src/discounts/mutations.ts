import { gql } from "@apollo/client";

export const saleUpdate = gql`
  mutation SaleUpdate(
    $input: SaleInput!
    $id: ID!
    $channelInput: SaleChannelListingInput!
  ) {
    saleUpdate(id: $id, input: $input) {
      errors {
        ...DiscountError
      }
    }
    saleChannelListingUpdate(id: $id, input: $channelInput) {
      errors {
        ...DiscountError
      }
      sale {
        ...Sale
      }
    }
  }
`;

export const saleCataloguesAdd = gql`
  mutation SaleCataloguesAdd(
    $input: CatalogueInput!
    $id: ID!
    $after: String
    $before: String
    $first: Int
    $last: Int
    $includeVariants: Boolean!
    $includeProducts: Boolean!
    $includeCollections: Boolean!
    $includeCategories: Boolean!
  ) {
    saleCataloguesAdd(id: $id, input: $input) {
      errors {
        ...DiscountError
      }
      sale {
        ...SaleDetails
      }
    }
  }
`;

export const saleCataloguesRemove = gql`
  mutation SaleCataloguesRemove(
    $input: CatalogueInput!
    $id: ID!
    $after: String
    $before: String
    $first: Int
    $last: Int
    $includeVariants: Boolean!
    $includeProducts: Boolean!
    $includeCollections: Boolean!
    $includeCategories: Boolean!
  ) {
    saleCataloguesRemove(id: $id, input: $input) {
      errors {
        ...DiscountError
      }
      sale {
        ...SaleDetails
      }
    }
  }
`;

export const saleCreate = gql`
  mutation SaleCreate($input: SaleInput!) {
    saleCreate(input: $input) {
      errors {
        ...DiscountError
      }
      sale {
        ...Sale
      }
    }
  }
`;

export const saleDelete = gql`
  mutation SaleDelete($id: ID!) {
    saleDelete(id: $id) {
      errors {
        ...DiscountError
      }
    }
  }
`;

export const saleBulkDelete = gql`
  mutation SaleBulkDelete($ids: [ID!]!) {
    saleBulkDelete(ids: $ids) {
      errors {
        ...SaleBulkDeleteError
      }
    }
  }
`;

export const saleChannelListingUpdate = gql`
  mutation SaleChannelListingUpdate(
    $id: ID!
    $input: SaleChannelListingInput!
  ) {
    saleChannelListingUpdate(id: $id, input: $input) {
      errors {
        ...DiscountError
      }
      sale {
        ...Sale
      }
    }
  }
`;

export const voucherChannelListingUpdate = gql`
  mutation VoucherChannelListingUpdate(
    $id: ID!
    $input: VoucherChannelListingInput!
  ) {
    voucherChannelListingUpdate(id: $id, input: $input) {
      errors {
        ...DiscountError
      }
      voucher {
        ...Voucher
      }
    }
  }
`;

export const voucherUpdate = gql`
  mutation VoucherUpdate($input: VoucherInput!, $id: ID!) {
    voucherUpdate(id: $id, input: $input) {
      errors {
        ...DiscountError
      }
      voucher {
        ...Voucher
      }
    }
  }
`;

export const voucherCataloguesAdd = gql`
  mutation VoucherCataloguesAdd(
    $input: CatalogueInput!
    $id: ID!
    $after: String
    $before: String
    $first: Int
    $last: Int
    $includeProducts: Boolean!
    $includeCollections: Boolean!
    $includeCategories: Boolean!
  ) {
    voucherCataloguesAdd(id: $id, input: $input) {
      errors {
        ...DiscountError
      }
      voucher {
        ...VoucherDetails
      }
    }
  }
`;

export const voucherCataloguesRemove = gql`
  mutation VoucherCataloguesRemove(
    $input: CatalogueInput!
    $id: ID!
    $after: String
    $before: String
    $first: Int
    $last: Int
    $includeProducts: Boolean!
    $includeCollections: Boolean!
    $includeCategories: Boolean!
  ) {
    voucherCataloguesRemove(id: $id, input: $input) {
      errors {
        ...DiscountError
      }
      voucher {
        ...VoucherDetails
      }
    }
  }
`;

export const voucherCreate = gql`
  mutation VoucherCreate($input: VoucherInput!) {
    voucherCreate(input: $input) {
      errors {
        ...DiscountError
      }
      voucher {
        ...Voucher
      }
    }
  }
`;

export const voucherDelete = gql`
  mutation VoucherDelete($id: ID!) {
    voucherDelete(id: $id) {
      errors {
        ...DiscountError
      }
    }
  }
`;

export const voucherBulkDelete = gql`
  mutation VoucherBulkDelete($ids: [ID!]!) {
    voucherBulkDelete(ids: $ids) {
      errors {
        ...VoucherBulkDeleteError
      }
    }
  }
`;
