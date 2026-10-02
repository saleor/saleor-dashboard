import { ApolloError } from "@apollo/client";
import {
  LanguageCodeEnum,
  ProductMediaTranslateErrorCode,
  type UpdateProductMediaTranslationMutation,
  type UpdateProductMediaTranslationMutationVariables,
} from "@dashboard/graphql";
import { type MutationHookOptions } from "@dashboard/hooks/makeMutation";
import { render } from "@testing-library/react";

import { TranslationsProductMedia } from "./TranslationsProductMedia";

const mockTrackEvent = jest.fn();
let mockMutationOptions:
  | MutationHookOptions<
      UpdateProductMediaTranslationMutation,
      UpdateProductMediaTranslationMutationVariables
    >
  | undefined;

jest.mock("@dashboard/components/ProductAnalytics/useAnalytics", () => ({
  useAnalytics: (): { trackEvent: typeof mockTrackEvent } => ({ trackEvent: mockTrackEvent }),
}));
jest.mock("@dashboard/hooks/useNavigator", () => ({
  __esModule: true,
  default: (): jest.Mock => jest.fn(),
}));
jest.mock("@dashboard/components/NotFoundPage/NotFoundPage", () => ({
  __esModule: true,
  default: (): null => null,
}));
jest.mock("../hooks/useTranslationEntityView", () => ({
  useTranslationEntityView: (): { data: null } => ({ data: null }),
}));
jest.mock("@dashboard/graphql", () => ({
  ...jest.requireActual<Record<string, unknown>>("@dashboard/graphql"),
  useProductMediaTranslationDetailsQuery: (): { loading: boolean } => ({ loading: false }),
  useUpdateProductMediaTranslationMutation: (
    options: MutationHookOptions<
      UpdateProductMediaTranslationMutation,
      UpdateProductMediaTranslationMutationVariables
    >,
  ): [] => {
    mockMutationOptions = options;

    return [];
  },
}));

const successFixture: UpdateProductMediaTranslationMutation = {
  __typename: "Mutation",
  productMediaTranslate: {
    __typename: "ProductMediaTranslate",
    errors: [],
    productMedia: {
      __typename: "ProductMedia",
      id: "media-id",
      alt: "Original alt",
      translation: {
        __typename: "ProductMediaTranslation",
        id: "translation-id",
        alt: "Translated alt",
        language: {
          __typename: "LanguageDisplay",
          code: LanguageCodeEnum.DE,
          language: "German",
        },
      },
    },
  },
};
const errorFixture: UpdateProductMediaTranslationMutation = {
  __typename: "Mutation",
  productMediaTranslate: {
    __typename: "ProductMediaTranslate",
    productMedia: null,
    errors: [
      {
        __typename: "ProductMediaTranslateError",
        code: ProductMediaTranslateErrorCode.INVALID,
        field: "alt",
        message: "Invalid alt",
      },
    ],
  },
};

describe("TranslationsProductMedia analytics", () => {
  beforeEach(() => {
    mockTrackEvent.mockReset();
    mockMutationOptions = undefined;
  });

  it.each([false, true])("tracks successful saves with bulk=%s", bulk => {
    // Arrange
    render(
      <TranslationsProductMedia
        id="media-id"
        productId="product-id"
        languageCode={LanguageCodeEnum.DE}
        params={{ bulk }}
      />,
    );

    // Act
    mockMutationOptions?.onCompleted?.(successFixture);

    // Assert
    expect(mockTrackEvent).toHaveBeenCalledTimes(1);
    expect(mockTrackEvent).toHaveBeenCalledWith("product_media_translation_saved", {
      language_code: "DE",
      mode: bulk ? "bulk" : "single",
      result: "success",
    });
  });

  it("tracks validation errors without including alt text or error messages", () => {
    // Arrange
    render(
      <TranslationsProductMedia
        id="media-id"
        productId="product-id"
        languageCode={LanguageCodeEnum.DE}
        params={{}}
      />,
    );

    // Act
    mockMutationOptions?.onCompleted?.(errorFixture);

    // Assert
    expect(mockTrackEvent).toHaveBeenCalledTimes(1);
    expect(mockTrackEvent).toHaveBeenCalledWith("product_media_translation_saved", {
      language_code: "DE",
      mode: "single",
      result: "error",
    });
  });

  it("tracks network failures", () => {
    // Arrange
    render(
      <TranslationsProductMedia
        id="media-id"
        productId="product-id"
        languageCode={LanguageCodeEnum.DE}
        params={{ bulk: true }}
      />,
    );

    // Act
    mockMutationOptions?.onError?.(new ApolloError({ networkError: new Error("Offline") }));

    // Assert
    expect(mockTrackEvent).toHaveBeenCalledTimes(1);
    expect(mockTrackEvent).toHaveBeenCalledWith("product_media_translation_saved", {
      language_code: "DE",
      mode: "bulk",
      result: "error",
    });
  });
});
