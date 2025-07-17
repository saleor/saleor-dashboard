import { ProductVariantDetailsQuery } from "@dashboard/graphql";
import { waitFor } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";

import { productVariantEditUrl } from "../../urls";
import { useHandleProductVariantSilentRedirect } from "./useHandleProductVariantSilentRedirect";

describe("useHandleProductVariantSilentRedirect", () => {
  const variantId = "variant-123";
  const productId = "product-456";

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    jest.spyOn(window.history, "replaceState").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("does nothing if data is undefined", () => {
    // Arrange
    const replaceStateSpy = jest.spyOn(window.history, "replaceState");

    // Act
    renderHook(() =>
      useHandleProductVariantSilentRedirect({
        data: undefined as any,
        urlVariantId: variantId,
        urlProductId: undefined,
      }),
    );
    // Assert
    expect(replaceStateSpy).not.toHaveBeenCalled();
  });

  it("does nothing if productVariant is missing", () => {
    // Arrange
    const data = {} as ProductVariantDetailsQuery;
    const replaceStateSpy = jest.spyOn(window.history, "replaceState");

    // Act
    renderHook(() =>
      useHandleProductVariantSilentRedirect({
        data,
        urlVariantId: variantId,
        urlProductId: undefined,
      }),
    );
    // Assert
    expect(replaceStateSpy).not.toHaveBeenCalled();
  });

  it("does nothing if urlProductId is present (already correct URL)", () => {
    // Arrange
    const data = {
      productVariant: {
        product: { id: productId },
      },
    } as ProductVariantDetailsQuery;
    const replaceStateSpy = jest.spyOn(window.history, "replaceState");

    // Act
    renderHook(() =>
      useHandleProductVariantSilentRedirect({
        data,
        urlVariantId: variantId,
        urlProductId: productId,
      }),
    );
    // Assert
    expect(replaceStateSpy).not.toHaveBeenCalled();
  });

  it("calls replaceState with correct URL if productId is available and urlProductId is undefined", async () => {
    // Arrange
    const initialData = {};
    const finalData = {
      productVariant: {
        product: { id: productId },
      },
    };
    const replaceStateSpy = jest.spyOn(window.history, "replaceState");

    // Act
    type Props = { data: any; urlProductId: string | undefined };

    const { rerender } = renderHook(
      (props: Props) =>
        useHandleProductVariantSilentRedirect({
          data: props.data,
          urlVariantId: variantId,
          urlProductId: props.urlProductId,
        }),
      { initialProps: { data: initialData, urlProductId: undefined } },
    );

    rerender({ data: finalData, urlProductId: undefined });
    // Assert
    await waitFor(() => {
      expect(replaceStateSpy).toHaveBeenCalledWith(
        null,
        "",
        productVariantEditUrl(productId, variantId),
      );
    });
  });

  it("does nothing if productVariant.product.id is missing", () => {
    // Arrange
    const data = {
      productVariant: {},
    } as ProductVariantDetailsQuery;
    const replaceStateSpy = jest.spyOn(window.history, "replaceState");

    // Act
    renderHook(() =>
      useHandleProductVariantSilentRedirect({
        data,
        urlVariantId: variantId,
        urlProductId: undefined,
      }),
    );
    // Assert
    expect(replaceStateSpy).not.toHaveBeenCalled();
  });
});
