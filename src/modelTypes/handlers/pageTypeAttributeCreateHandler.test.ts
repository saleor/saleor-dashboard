import { type AttributePageFormData } from "@dashboard/attributes/components/AttributePage";
import {
  AttributeErrorCode,
  AttributeInputTypeEnum,
  AttributeTypeEnum,
  type PageErrorCode,
} from "@dashboard/graphql";

import {
  executePageTypeAttributeCreate,
  type PageTypeAttributeCreateMutations,
} from "./pageTypeAttributeCreateHandler";

const formData: AttributePageFormData = {
  availableInGrid: true,
  entityType: null,
  filterableInDashboard: true,
  filterableInStorefront: true,
  inputType: AttributeInputTypeEnum.PLAIN_TEXT,
  metadata: [],
  name: "Care instructions",
  privateMetadata: [],
  slug: "care-instructions",
  storefrontSearchPosition: "",
  type: AttributeTypeEnum.PAGE_TYPE,
  unit: null,
  valueRequired: false,
  visibleInStorefront: true,
  referenceTypes: [],
};

const createFailedMessage = "Failed to create attribute";

describe("executePageTypeAttributeCreate", () => {
  const pageTypeId = "page-type-1";

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
    const mutations: PageTypeAttributeCreateMutations = {
      attributeCreate,
      assignCreatedAttribute,
    };

    // Act
    const result = await executePageTypeAttributeCreate(
      {
        pageTypeId,
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
    const mutations: PageTypeAttributeCreateMutations = {
      attributeCreate,
      assignCreatedAttribute,
    };

    // Act
    const result = await executePageTypeAttributeCreate(
      {
        pageTypeId,
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
      __typename: "PageError" as const,
      code: "ALREADY_EXISTS" as PageErrorCode,
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
        pageAttributeAssign: {
          errors: [assignError],
        },
      },
    });
    const mutations: PageTypeAttributeCreateMutations = {
      attributeCreate,
      assignCreatedAttribute,
    };

    // Act
    const result = await executePageTypeAttributeCreate(
      {
        pageTypeId,
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
        id: pageTypeId,
        ids: [attributeId],
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
        pageAttributeAssign: {
          errors: [],
        },
      },
    });
    const mutations: PageTypeAttributeCreateMutations = {
      attributeCreate,
      assignCreatedAttribute,
    };

    // Act
    const result = await executePageTypeAttributeCreate(
      {
        pageTypeId,
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
