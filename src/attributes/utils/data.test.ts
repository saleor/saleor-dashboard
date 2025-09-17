import { AttributeInputTypeEnum } from "@dashboard/graphql";
import { Container } from "@dashboard/types";

import { handleContainerReferenceAssignment, handleMetadataReferenceAssignment } from "./data";

describe("attributes/utils/data", () => {
  describe("handleContainerReferenceAssignment", () => {
    const mockHandlers = {
      selectAttributeReference: jest.fn(),
      selectAttributeReferenceMetadata: jest.fn(),
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should replace value for SINGLE_REFERENCE attribute after selecting item in modal", () => {
      // Arrange
      const assignReferencesAttributeId = "attr-1";
      const attributeValues: Container[] = [
        { id: "val-1", name: "Value 1" },
        { id: "val-2", name: "Value 2" },
      ];
      const attributes = [
        {
          id: "attr-1",
          value: ["old-value"],
          label: "Test Attribute",
          data: {
            inputType: AttributeInputTypeEnum.SINGLE_REFERENCE,
            isRequired: false,
            values: [],
          },
        },
      ];

      // Act
      handleContainerReferenceAssignment(
        assignReferencesAttributeId,
        attributeValues,
        attributes,
        mockHandlers,
      );

      // Assert
      expect(mockHandlers.selectAttributeReference).toHaveBeenCalledWith("attr-1", ["val-1"]);
      expect(mockHandlers.selectAttributeReferenceMetadata).toHaveBeenCalledWith("attr-1", [
        { value: "val-1", label: "Value 1" },
      ]);
    });

    it("should append values for REFERENCE attribute after selecting item in modal", () => {
      // Arrange
      const assignReferencesAttributeId = "attr-1";
      const attributeValues: Container[] = [
        { id: "val-1", name: "Value 1" },
        { id: "val-2", name: "Value 2" },
      ];
      const attributes = [
        {
          id: "attr-1",
          value: ["existing-1", "existing-2"],
          label: "Test Attribute",
          data: {
            inputType: AttributeInputTypeEnum.REFERENCE,
            isRequired: false,
            values: [],
          },
        },
      ];

      // Act
      handleContainerReferenceAssignment(
        assignReferencesAttributeId,
        attributeValues,
        attributes,
        mockHandlers,
      );

      // Assert
      expect(mockHandlers.selectAttributeReference).toHaveBeenCalledWith("attr-1", [
        "existing-1",
        "existing-2",
        "val-1",
        "val-2",
      ]);
      expect(mockHandlers.selectAttributeReferenceMetadata).toHaveBeenCalledWith("attr-1", [
        { value: "val-1", label: "Value 1" },
        { value: "val-2", label: "Value 2" },
      ]);
    });

    it("should handle empty initial values", () => {
      // Arrange
      const assignReferencesAttributeId = "attr-1";
      const attributeValues: Container[] = [{ id: "val-1", name: "Value 1" }];
      const attributes = [
        {
          id: "attr-1",
          value: [],
          label: "Test Attribute",
          data: {
            inputType: AttributeInputTypeEnum.REFERENCE,
            isRequired: false,
            values: [],
          },
        },
      ];

      // Act
      handleContainerReferenceAssignment(
        assignReferencesAttributeId,
        attributeValues,
        attributes,
        mockHandlers,
      );

      // Assert
      expect(mockHandlers.selectAttributeReference).toHaveBeenCalledWith("attr-1", ["val-1"]);
      expect(mockHandlers.selectAttributeReferenceMetadata).toHaveBeenCalledWith("attr-1", [
        { value: "val-1", label: "Value 1" },
      ]);
    });
  });

  describe("handleMetadataReferenceAssignment", () => {
    const mockHandlers = {
      selectAttributeReference: jest.fn(),
      selectAttributeReferenceMetadata: jest.fn(),
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should replace value for SINGLE_REFERENCE attribute after selecting item in modal", () => {
      // Arrange
      const assignReferencesAttributeId = "attr-1";
      const attributeValues = [
        { value: "val-1", label: "Value 1" },
        { value: "val-2", label: "Value 2" },
      ];
      const attributes = [
        {
          id: "attr-1",
          value: ["old-value"],
          label: "Test Attribute",
          data: {
            inputType: AttributeInputTypeEnum.SINGLE_REFERENCE,
            isRequired: false,
            values: [],
          },
        },
      ];

      // Act
      handleMetadataReferenceAssignment(
        assignReferencesAttributeId,
        attributeValues,
        attributes,
        mockHandlers,
      );

      // Assert
      expect(mockHandlers.selectAttributeReference).toHaveBeenCalledWith("attr-1", ["val-1"]);
      expect(mockHandlers.selectAttributeReferenceMetadata).toHaveBeenCalledWith("attr-1", [
        { value: "val-1", label: "Value 1" },
      ]);
    });

    it("should append values for REFERENCE attribute after selecting item in modal", () => {
      // Arrange
      const assignReferencesAttributeId = "attr-1";
      const attributeValues = [
        { value: "val-1", label: "Value 1" },
        { value: "val-2", label: "Value 2" },
      ];
      const attributes = [
        {
          id: "attr-1",
          value: ["existing-1", "existing-2"],
          label: "Test Attribute",
          data: {
            inputType: AttributeInputTypeEnum.REFERENCE,
            isRequired: false,
            values: [],
          },
        },
      ];

      // Act
      handleMetadataReferenceAssignment(
        assignReferencesAttributeId,
        attributeValues,
        attributes,
        mockHandlers,
      );

      // Assert
      expect(mockHandlers.selectAttributeReference).toHaveBeenCalledWith("attr-1", [
        "existing-1",
        "existing-2",
        "val-1",
        "val-2",
      ]);
      expect(mockHandlers.selectAttributeReferenceMetadata).toHaveBeenCalledWith(
        "attr-1",
        attributeValues,
      );
    });

    it("should handle empty attribute values", () => {
      // Arrange
      const assignReferencesAttributeId = "attr-1";
      const attributeValues: Array<{ value: string; label: string }> = [];
      const attributes = [
        {
          id: "attr-1",
          value: ["existing-1"],
          label: "Test Attribute",
          data: {
            inputType: AttributeInputTypeEnum.REFERENCE,
            isRequired: false,
            values: [],
          },
        },
      ];

      // Act
      handleMetadataReferenceAssignment(
        assignReferencesAttributeId,
        attributeValues,
        attributes,
        mockHandlers,
      );

      // Assert
      expect(mockHandlers.selectAttributeReference).toHaveBeenCalledWith("attr-1", ["existing-1"]);
      expect(mockHandlers.selectAttributeReferenceMetadata).toHaveBeenCalledWith("attr-1", []);
    });
  });
});
