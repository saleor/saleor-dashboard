import { MockedProvider, type MockedResponse } from "@apollo/client/testing";
import sampleProduct from "@assets/images/sample-product.jpg";
import {
  LanguageCodeEnum,
  type ProductMediaTranslationFragment,
  ProductMediaType,
  ProductTranslationContextDocument,
  type ProductTranslationContextQuery,
  ProductVariantSiblingsDocument,
  type ProductVariantSiblingsQuery,
} from "@dashboard/graphql";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";

import { TranslationsProductMediaPage } from "./TranslationsProductMediaPage";

const productId = "product-1";
const mediaId = "media-1";
const media: NonNullable<ProductMediaTranslationFragment["productMedia"]> = {
  __typename: "ProductMedia",
  id: mediaId,
  productId,
  alt: "Front product view",
  url: sampleProduct,
  type: ProductMediaType.IMAGE,
  oembedData: "{}",
};

const mocks: [
  MockedResponse<ProductTranslationContextQuery>,
  MockedResponse<ProductVariantSiblingsQuery>,
] = [
  {
    request: {
      query: ProductTranslationContextDocument,
      variables: { id: productId },
    },
    result: {
      data: {
        __typename: "Query",
        translation: {
          __typename: "ProductTranslatableContent",
          id: "product-translation-content-1",
          product: {
            __typename: "Product",
            id: productId,
            media: [media],
          },
        },
      },
    },
  },
  {
    request: {
      query: ProductVariantSiblingsDocument,
      variables: { id: productId, first: 30 },
    },
    result: {
      data: {
        __typename: "Query",
        product: {
          __typename: "Product",
          id: productId,
          productVariants: {
            __typename: "ProductVariantCountableConnection",
            totalCount: 0,
            pageInfo: {
              __typename: "PageInfo",
              hasNextPage: false,
              hasPreviousPage: false,
              endCursor: null,
            },
            edges: [],
          },
        },
      },
    },
  },
];

const meta: Meta<typeof TranslationsProductMediaPage> = {
  title: "Translations/TranslationsProductMediaPage",
  component: TranslationsProductMediaPage,
  decorators: [
    (Story: StoryFn): JSX.Element => (
      <MockedProvider mocks={mocks}>
        <Story />
      </MockedProvider>
    ),
  ],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof TranslationsProductMediaPage>;

export const Default: Story = {
  args: {
    translationId: mediaId,
    mediaId,
    productId,
    productName: "Blue Hoodie",
    languageCode: LanguageCodeEnum.DE,
    languages: [
      {
        __typename: "LanguageDisplay",
        code: LanguageCodeEnum.DE,
        language: "German",
      },
    ],
    data: {
      __typename: "ProductMediaTranslatableContent",
      id: mediaId,
      productMediaId: mediaId,
      alt: "Front product view",
      productMedia: media,
      translation: {
        __typename: "ProductMediaTranslation",
        id: "translation-1",
        alt: "Produktansicht von vorne",
        language: {
          __typename: "LanguageDisplay",
          code: LanguageCodeEnum.DE,
          language: "German",
        },
      },
    },
    media,
    activeField: undefined,
    bulk: false,
    disabled: false,
    fieldErrors: {},
    saveButtonState: "default",
    onBulkChange: () => undefined,
    onBulkSubmit: async () => ({ fieldErrors: [], hasErrors: false }),
    onClearFieldError: () => undefined,
    onClearFieldErrors: () => undefined,
    onDiscard: () => undefined,
    onEdit: () => undefined,
    onSubmit: async () => [],
  },
};
