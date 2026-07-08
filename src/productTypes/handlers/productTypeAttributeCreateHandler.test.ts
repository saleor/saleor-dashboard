import { type AttributePageFormData } from "@dashboard/attributes/components/AttributePage";
import {
  AttributeErrorCode,
  AttributeInputTypeEnum,
  AttributeTypeEnum,
  ProductAttributeType,
  type ProductErrorCode,
} from "@dashboard/graphql";

import {
  executeProductTypeAttributeCreate,
  type ProductTypeAttributeCreateMutations,
} from "./productTypeAttributeCreateHandler";

const formData: AttributePageFormData = {
  availableInGrid: true,
  entityType: null,
  filterableInDashboard: true,
  filterableInStorefront: true,
  inputType: AttributeInputTypeEnum.PLAIN_TEXT,
  metadata: [],
  name: "Material",
  privateMetadata: [],
  slug: "material",
  storefrontSearchPosition: "",
  type: AttributeTypeEnum.PRODUCT_TYPE,
  unit: null,
  valueRequired: false,
  visibleInStorefront: true,
  referenceTypes: [],
};

const createFailedMessage = "Failed to create attribute";

describe("executeProductTypeAttributeCreate", () => {
  const productTypeId = "product-type-1";
  const productAttributeType = ProductAttributeType.PRODUCT;

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
    const mutations: ProductTypeAttributeCreateMutations = {
      attributeCreate,
      assignCreatedAttribute,
    };

    // Act
    const result = await executeProductTypeAttributeCreate(
      {
        productTypeId,
        productAttributeType,
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
    const mutations: ProductTypeAttributeCreateMutations = {
      attributeCreate,
      assignCreatedAttribute,
    };

    // Act
    const result = await executeProductTypeAttributeCreate(
      {
        productTypeId,
        productAttributeType,
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
      __typename: "ProductError" as const,
      code: "ALREADY_EXISTS" as ProductErrorCode,
      field: null,
      message: "Already assigned",
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
        productAttributeAssign: {
          errors: [assignError],
        },
      },
    });
    const mutations: ProductTypeAttributeCreateMutations = {
      attributeCreate,
      assignCreatedAttribute,
    };

    // Act
    const result = await executeProductTypeAttributeCreate(
      {
        productTypeId,
        productAttributeType: ProductAttributeType.VARIANT,
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
        id: productTypeId,
        operations: [{ id: attributeId, type: ProductAttributeType.VARIANT }],
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
        productAttributeAssign: {
          errors: [],
        },
      },
    });
    const mutations: ProductTypeAttributeCreateMutations = {
      attributeCreate,
      assignCreatedAttribute,
    };

    // Act
    const result = await executeProductTypeAttributeCreate(
      {
        productTypeId,
        productAttributeType,
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
