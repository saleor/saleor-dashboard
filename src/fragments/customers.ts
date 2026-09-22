import { gql } from "@apollo/client";

export const customerFragment = gql`
  fragment Customer on User {
    id
    email
    firstName
    lastName
  }
`;

export const customerTypeOnCustomerFragment = gql`
  fragment CustomerTypeOnCustomer on CustomerType {
    id
    name
    slug
    isDefault
    attributes {
      ...Attribute
      entityType
      valueRequired
      referenceTypes {
        ... on ProductType {
          id
          name
        }
        ... on PageType {
          id
          name
        }
      }
      choices(first: 20) {
        ...AttributeValueList
      }
    }
  }
`;

export const customerAssignedAttributeFragment = gql`
  fragment CustomerAssignedAttribute on AssignedAttribute {
    attribute {
      id
      slug
    }
    ... on AssignedNumericAttribute {
      numericValue: value
    }
    ... on AssignedTextAttribute {
      richTextValue: value
    }
    ... on AssignedPlainTextAttribute {
      plainTextValue: value
    }
    ... on AssignedFileAttribute {
      fileValue: value {
        url
        contentType
      }
    }
    ... on AssignedSingleChoiceAttribute {
      choiceValue: value {
        name
        slug
      }
    }
    ... on AssignedMultiChoiceAttribute {
      choiceValues: value {
        name
        slug
      }
    }
    ... on AssignedSwatchAttribute {
      swatchValue: value {
        name
        slug
      }
    }
    ... on AssignedBooleanAttribute {
      booleanValue: value
    }
    ... on AssignedDateAttribute {
      dateValue: value
    }
    ... on AssignedDateTimeAttribute {
      dateTimeValue: value
    }
    ... on AssignedSinglePageReferenceAttribute {
      pageValue: value {
        id
        title
      }
    }
    ... on AssignedSingleProductReferenceAttribute {
      productValue: value {
        id
        name
      }
    }
    ... on AssignedSingleProductVariantReferenceAttribute {
      variantValue: value {
        id
        name
      }
    }
    ... on AssignedSingleCategoryReferenceAttribute {
      categoryValue: value {
        id
        name
      }
    }
    ... on AssignedSingleCollectionReferenceAttribute {
      collectionValue: value {
        id
        name
      }
    }
    ... on AssignedMultiPageReferenceAttribute {
      pageValues: value {
        id
        title
      }
    }
    ... on AssignedMultiProductReferenceAttribute {
      productValues: value {
        id
        name
      }
    }
    ... on AssignedMultiProductVariantReferenceAttribute {
      variantValues: value {
        id
        name
      }
    }
    ... on AssignedMultiCategoryReferenceAttribute {
      categoryValues: value {
        id
        name
      }
    }
    ... on AssignedMultiCollectionReferenceAttribute {
      collectionValues: value {
        id
        name
      }
    }
  }
`;

export const customerDetailsFragment = gql`
  fragment CustomerDetails on User {
    ...Customer
    dateJoined
    lastLogin
    defaultShippingAddress {
      ...Address
    }
    defaultBillingAddress {
      ...Address
    }
    note
    isActive
    isConfirmed
    isStaff
    externalReference
    customerType {
      ...CustomerTypeOnCustomer
    }
    assignedAttributes(limit: 100) {
      ...CustomerAssignedAttribute
    }
  }
`;

export const customerAddressesFragment = gql`
  fragment CustomerAddresses on User {
    ...Customer
    addresses {
      ...Address
    }
    defaultBillingAddress {
      id
    }
    defaultShippingAddress {
      id
    }
  }
`;
