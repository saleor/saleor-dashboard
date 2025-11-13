import { AllFormPayloadUpdatePayloads } from "@saleor/app-sdk/app-bridge";
import { act, renderHook } from "@testing-library/react-hooks";
import { Provider as JotaiProvider, useAtom } from "jotai";
import React from "react";

import {
  extensionFormResponseByFormAtom,
  useExtensionFormPayloadUpdate,
} from "./app-extension-form-payload-update";

// Test wrapper with Jotai provider
const wrapper = ({ children }: any) => React.createElement(JotaiProvider, null, children);

describe("app-extension-form-payload-update", () => {
  describe("extensionFormResponseByFormAtom", () => {
    it("should group payloads by form type", () => {
      // Arrange
      const { result } = renderHook(() => useAtom(extensionFormResponseByFormAtom), { wrapper });
      const productEditPayload: AllFormPayloadUpdatePayloads = {
        form: "product-edit",
        fields: {
          productName: { value: "Test Product" },
          productDescription: { value: "Test Description" },
        },
      };
      const productTranslatePayload: AllFormPayloadUpdatePayloads = {
        form: "product-translate",
        fields: {
          productName: { value: "Translated Name" },
          productDescription: { value: "Translated Description" },
          seoName: { value: "Translated SEO" },
          seoDescription: { value: "Translated SEO Description" },
        },
      };

      // Act
      act(() => {
        result.current[1](productEditPayload);
      });

      act(() => {
        result.current[1](productTranslatePayload);
      });

      // Assert
      const framesByFormType = result.current[0];

      expect(framesByFormType["product-edit"]).toBeDefined();
      expect(framesByFormType["product-edit"]).toHaveLength(1);
      expect(framesByFormType["product-edit"][0]).toEqual(productEditPayload);

      expect(framesByFormType["product-translate"]).toBeDefined();
      expect(framesByFormType["product-translate"]).toHaveLength(1);
      expect(framesByFormType["product-translate"][0]).toEqual(productTranslatePayload);
    });

    it("should group multiple payloads of the same form type", () => {
      // Arrange
      const { result } = renderHook(() => useAtom(extensionFormResponseByFormAtom), { wrapper });
      const payload1: AllFormPayloadUpdatePayloads = {
        form: "product-edit",
        fields: {
          productName: { value: "Product 1" },
          productDescription: { value: "Description 1" },
        },
      };
      const payload2: AllFormPayloadUpdatePayloads = {
        form: "product-edit",
        fields: {
          productName: { value: "Product 2" },
          productDescription: { value: "Description 2" },
        },
      };

      // Act
      act(() => {
        result.current[1](payload1);
      });

      act(() => {
        result.current[1](payload2);
      });

      // Assert
      const framesByFormType = result.current[0];

      expect(framesByFormType["product-edit"]).toBeDefined();
      expect(framesByFormType["product-edit"]).toHaveLength(2);
      expect(framesByFormType["product-edit"][0]).toEqual(payload1);
      expect(framesByFormType["product-edit"][1]).toEqual(payload2);
    });

    it("should not add duplicate payloads", () => {
      // Arrange
      const { result } = renderHook(() => useAtom(extensionFormResponseByFormAtom), { wrapper });
      const payload: AllFormPayloadUpdatePayloads = {
        form: "product-edit",
        fields: {
          productName: { value: "Test Product" },
          productDescription: { value: "Test Description" },
        },
      };

      // Act
      act(() => {
        result.current[1](payload);
      });

      act(() => {
        result.current[1](payload);
      });

      // Assert
      const framesByFormType = result.current[0];

      expect(framesByFormType["product-edit"]).toBeDefined();
      expect(framesByFormType["product-edit"]).toHaveLength(1);
    });

    it("should handle payloads with closePopup flag", () => {
      // Arrange
      const { result } = renderHook(() => useAtom(extensionFormResponseByFormAtom), { wrapper });
      const payloadWithClosePopup: AllFormPayloadUpdatePayloads = {
        form: "product-edit",
        closePopup: false,
        fields: {
          productName: { value: "Test Product" },
          productDescription: { value: "Test Description" },
        },
      };

      // Act
      act(() => {
        result.current[1](payloadWithClosePopup);
      });

      // Assert
      const framesByFormType = result.current[0];

      expect(framesByFormType["product-edit"]).toBeDefined();
      expect(framesByFormType["product-edit"][0].closePopup).toBe(false);
    });

    it("should return empty object when no payloads added", () => {
      // Arrange
      const { result } = renderHook(() => useAtom(extensionFormResponseByFormAtom), { wrapper });

      // Act & Assert
      expect(result.current[0]).toEqual({});
    });
  });

  describe("useExtensionFormPayloadUpdate", () => {
    describe("attachFormResponseFrame", () => {
      it("should add a new response frame", () => {
        // Arrange
        const { result } = renderHook(() => useExtensionFormPayloadUpdate(), { wrapper });
        const payload: AllFormPayloadUpdatePayloads = {
          form: "product-edit",
          fields: {
            productName: { value: "Test Product" },
            productDescription: { value: "Test Description" },
          },
        };

        // Act
        act(() => {
          result.current.attachFormResponseFrame(payload);
        });

        // Assert
        expect(result.current.allFrames).toHaveLength(1);
        expect(result.current.allFrames[0]).toEqual(payload);
      });

      it("should add multiple frames sequentially", () => {
        // Arrange
        const { result } = renderHook(() => useExtensionFormPayloadUpdate(), { wrapper });
        const payload1: AllFormPayloadUpdatePayloads = {
          form: "product-edit",
          fields: {
            productName: { value: "Product 1" },
            productDescription: { value: "Description 1" },
          },
        };
        const payload2: AllFormPayloadUpdatePayloads = {
          form: "product-translate",
          fields: {
            productName: { value: "Translated Product" },
            productDescription: { value: "Description" },
            seoName: { value: "SEO Name" },
            seoDescription: { value: "SEO Description" },
          },
        };

        // Act
        act(() => {
          result.current.attachFormResponseFrame(payload1);
        });

        act(() => {
          result.current.attachFormResponseFrame(payload2);
        });

        // Assert
        expect(result.current.allFrames).toHaveLength(2);
        expect(result.current.allFrames[0]).toEqual(payload1);
        expect(result.current.allFrames[1]).toEqual(payload2);
      });

      it("should update framesByFormType correctly", () => {
        // Arrange
        const { result } = renderHook(() => useExtensionFormPayloadUpdate(), { wrapper });
        const editPayload: AllFormPayloadUpdatePayloads = {
          form: "product-edit",
          fields: {
            productName: { value: "Edited Product" },
            productDescription: { value: "Edited Description" },
          },
        };
        const translatePayload: AllFormPayloadUpdatePayloads = {
          form: "product-translate",
          fields: {
            productName: { value: "Translated Product" },
            productDescription: { value: "Description" },
            seoName: { value: "SEO" },
            seoDescription: { value: "SEO Description" },
          },
        };

        // Act
        act(() => {
          result.current.attachFormResponseFrame(editPayload);
        });

        act(() => {
          result.current.attachFormResponseFrame(translatePayload);
        });

        // Assert
        expect(result.current.framesByFormType["product-edit"]).toBeDefined();
        expect(result.current.framesByFormType["product-edit"]).toHaveLength(1);
        expect(result.current.framesByFormType["product-translate"]).toBeDefined();
        expect(result.current.framesByFormType["product-translate"]).toHaveLength(1);
      });

      it("should allow duplicate frames to be added", () => {
        // Arrange
        const { result } = renderHook(() => useExtensionFormPayloadUpdate(), { wrapper });
        const payload: AllFormPayloadUpdatePayloads = {
          form: "product-edit",
          fields: {
            productName: { value: "Test Product" },
            productDescription: { value: "Test Description" },
          },
        };

        // Act
        act(() => {
          result.current.attachFormResponseFrame(payload);
        });

        act(() => {
          result.current.attachFormResponseFrame(payload);
        });

        // Assert
        // Note: attachFormResponseFrame allows duplicates, unlike the atom setter
        expect(result.current.allFrames).toHaveLength(2);
        expect(result.current.allFrames[0]).toEqual(payload);
        expect(result.current.allFrames[1]).toEqual(payload);
      });
    });

    it("should expose all three properties", () => {
      // Arrange
      const { result } = renderHook(() => useExtensionFormPayloadUpdate(), { wrapper });

      // Act & Assert
      expect(result.current).toHaveProperty("allFrames");
      expect(result.current).toHaveProperty("attachFormResponseFrame");
      expect(result.current).toHaveProperty("framesByFormType");

      expect(Array.isArray(result.current.allFrames)).toBe(true);
      expect(typeof result.current.attachFormResponseFrame).toBe("function");
      expect(typeof result.current.framesByFormType).toBe("object");
    });
  });
});
