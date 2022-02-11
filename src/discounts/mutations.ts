import { gql } from "@apollo/client";

export const saleUpdate = gql`
  mutation SaleUpdate(
    $input: SaleInput!
    $id: ID!
    $channelInput: SaleChannelListingInput!
  ) {
    saleUpdate(id: $id, input: $input) {
      errors {
        ...DiscountErrorFragment
      }
    }
    saleChannelListingUpdate(id: $id, input: $channelInput) {
      errors {
        ...DiscountErrorFragment
      }
      sale {
        ...SaleFragment
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
  ) {
    saleCataloguesAdd(id: $id, input: $input) {
      errors {
        ...DiscountErrorFragment
      }
      sale {
        ...SaleDetailsFragment
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
  ) {
    saleCataloguesRemove(id: $id, input: $input) {
      errors {
        ...DiscountErrorFragment
      }
      sale {
        ...SaleDetailsFragment
      }
    }
  }
`;

export const saleCreate = gql`
  mutation SaleCreate($input: SaleInput!) {
    saleCreate(input: $input) {
      errors {
        ...DiscountErrorFragment
      }
      sale {
        ...SaleFragment
      }
    }
  }
`;

export const saleDelete = gql`
  mutation SaleDelete($id: ID!) {
    saleDelete(id: $id) {
      errors {
        ...DiscountErrorFragment
      }
    }
  }
`;

export const saleBulkDelete = gql`
  mutation SaleBulkDelete($ids: [ID]!) {
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
        ...DiscountErrorFragment
      }
      sale {
        ...SaleFragment
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
        ...DiscountErrorFragment
      }
      voucher {
        ...VoucherFragment
      }
    }
  }
`;

export const voucherUpdate = gql`
  mutation VoucherUpdate($input: VoucherInput!, $id: ID!) {
    voucherUpdate(id: $id, input: $input) {
      errors {
        ...DiscountErrorFragment
      }
      voucher {
        ...VoucherFragment
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
  ) {
    voucherCataloguesAdd(id: $id, input: $input) {
      errors {
        ...DiscountErrorFragment
      }
      voucher {
        ...VoucherDetailsFragment
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
  ) {
    voucherCataloguesRemove(id: $id, input: $input) {
      errors {
        ...DiscountErrorFragment
      }
      voucher {
        ...VoucherDetailsFragment
      }
    }
  }
`;

export const voucherCreate = gql`
  mutation VoucherCreate($input: VoucherInput!) {
    voucherCreate(input: $input) {
      errors {
        ...DiscountErrorFragment
      }
      voucher {
        ...VoucherFragment
      }
    }
  }
`;

export const voucherDelete = gql`
  mutation VoucherDelete($id: ID!) {
    voucherDelete(id: $id) {
      errors {
        ...DiscountErrorFragment
      }
    }
  }
`;

export const voucherBulkDelete = gql`
  mutation VoucherBulkDelete($ids: [ID]!) {
    voucherBulkDelete(ids: $ids) {
      errors {
        ...VoucherBulkDeleteError
      }
    }
  }
`;
