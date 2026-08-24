import { type AttributePageFormData } from "@dashboard/attributes/components/AttributePage";
import {
  AttributeErrorCode,
  AttributeInputTypeEnum,
  AttributeTypeEnum,
  CustomerTypeAssignAttributesErrorCode,
} from "@dashboard/graphql";

import {
  type CustomerTypeAttributeCreateMutations,
  executeCustomerTypeAttributeCreate,
} from "./customerTypeAttributeCreateHandler";

const formData: AttributePageFormData = {
  availableInGrid: true,
  entityType: null,
  filterableInStorefront: true,
  inputType: AttributeInputTypeEnum.PLAIN_TEXT,
  metadata: [],
  name: "Loyalty level",
  privateMetadata: [],
  slug: "loyalty-level",
  storefrontSearchPosition: "",
  type: AttributeTypeEnum.CUSTOMER_TYPE,
  unit: null,
  valueRequired: false,
  visibleInStorefront: true,
  referenceTypes: [],
};

const createFailedMessage = "Failed to create attribute";

describe("executeCustomerTypeAttributeCreate", () => {
  const customerTypeId = "customer-type-1";

  it("returns create errors without assigning the attribute", async () => {
    // Arrange
    const createError = {
      __typename: "AttributeError" as const,
      code: AttributeErrorCode.REQUIRED,
      field: "name",
      message: "Name is required",
    };
    const attributeCreate = jest.fn().mockResolvedValue({
      data: {
        attributeCreate: {
          attribute: null,
          errors: [createError],
        },
      },
    });
    const assignCreatedAttribute = jest.fn();
    const mutations: CustomerTypeAttributeCreateMutations = {
      attributeCreate,
      assignCreatedAttribute,
    };

    // Act
    const result = await executeCustomerTypeAttributeCreate(
      {
        customerTypeId,
        formData,
        values: [],
        createFailedMessage,
        formatAssignErrors: () => "",
      },
      mutations,
    );

    // Assert
    expect(result).toEqual({ errors: [createError] });
    expect(assignCreatedAttribute).not.toHaveBeenCalled();
  });

  it("returns a synthetic error when create succeeds without an attribute id", async () => {
    // Arrange
    const attributeCreate = jest.fn().mockResolvedValue({
      data: {
        attributeCreate: {
          attribute: null,
          errors: [],
        },
      },
    });
    const assignCreatedAttribute = jest.fn();
    const mutations: CustomerTypeAttributeCreateMutations = {
      attributeCreate,
      assignCreatedAttribute,
    };

    // Act
    const result = await executeCustomerTypeAttributeCreate(
      {
        customerTypeId,
        formData,
        values: [],
        createFailedMessage,
        formatAssignErrors: () => "",
      },
      mutations,
    );

    // Assert
    expect(result).toEqual({
      errors: [
        {
          __typename: "AttributeError",
          code: AttributeErrorCode.INVALID,
          field: null,
          message: createFailedMessage,
        },
      ],
    });
    expect(assignCreatedAttribute).not.toHaveBeenCalled();
  });

  it("returns assign errors when attribute is created but assignment fails", async () => {
    // Arrange
    const attributeId = "attr-1";
    const assignError = {
      __typename: "CustomerTypeAssignAttributesError" as const,
      code: CustomerTypeAssignAttributesErrorCode.ATTRIBUTE_ALREADY_ASSIGNED,
      field: null,
      message: "Already assigned",
      attributes: [attributeId],
    };
    const attributeCreate = jest.fn().mockResolvedValue({
      data: {
        attributeCreate: {
          attribute: { id: attributeId },
          errors: [],
        },
      },
    });
    const assignCreatedAttribute = jest.fn().mockResolvedValue({
      data: {
        customerTypeAssignAttributes: {
          errors: [assignError],
        },
      },
    });
    const mutations: CustomerTypeAttributeCreateMutations = {
      attributeCreate,
      assignCreatedAttribute,
    };

    // Act
    const result = await executeCustomerTypeAttributeCreate(
      {
        customerTypeId,
        formData,
        values: [],
        createFailedMessage,
        formatAssignErrors: errors => errors.map(error => error.message ?? "").join(" "),
      },
      mutations,
    );

    // Assert
    expect(assignCreatedAttribute).toHaveBeenCalledWith({
      variables: {
        customerTypeId,
        attributeIds: [attributeId],
      },
    });
    expect(result).toEqual({
      errors: [
        {
          __typename: "AttributeError",
          code: AttributeErrorCode.INVALID,
          field: null,
          message: "Already assigned",
        },
      ],
      assignErrorMessage: "Already assigned",
    });
  });

  it("returns attribute id when create and assign succeed", async () => {
    // Arrange
    const attributeId = "attr-1";
    const attributeCreate = jest.fn().mockResolvedValue({
      data: {
        attributeCreate: {
          attribute: { id: attributeId },
          errors: [],
        },
      },
    });
    const assignCreatedAttribute = jest.fn().mockResolvedValue({
      data: {
        customerTypeAssignAttributes: {
          errors: [],
        },
      },
    });
    const mutations: CustomerTypeAttributeCreateMutations = {
      attributeCreate,
      assignCreatedAttribute,
    };

    // Act
    const result = await executeCustomerTypeAttributeCreate(
      {
        customerTypeId,
        formData,
        values: [],
        createFailedMessage,
        formatAssignErrors: () => "",
      },
      mutations,
    );

    // Assert
    expect(result).toEqual({ id: attributeId, errors: [] });
  });
});
