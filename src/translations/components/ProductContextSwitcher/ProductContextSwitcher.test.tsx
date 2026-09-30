import { type ProductVariantSibling } from "@dashboard/products/hooks/useProductVariantSiblings";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { IntlProvider } from "react-intl";

import { ProductContextSwitcher } from "./ProductContextSwitcher";

const mockLoadMore = jest.fn();
const mockSetSearch = jest.fn();

jest.mock("@dashboard/products/hooks/useProductVariantSiblings", () => ({
  useProductVariantSiblings: jest.fn(),
}));

jest.mock("@dashboard/graphql", () => {
  const actual = jest.requireActual<typeof import("@dashboard/graphql")>("@dashboard/graphql");

  return {
    ...actual,
    useProductTranslationContextQuery: jest.fn(),
  };
});

jest.mock("@dashboard/graphql/schemaVersion", () => ({
  isMainSchema: jest.fn(),
}));

jest.mock("@saleor/macaw-ui-next", () => {
  const actual = jest.requireActual("@saleor/macaw-ui-next");

  return {
    ...actual,
    DynamicCombobox: ({
      onScrollEnd,
      onInputValueChange,
      onChange,
      onBlur,
      value,
      loading,
      options,
      "data-test-id": dataTestId,
    }: {
      onScrollEnd?: () => void;
      onInputValueChange?: (value: string) => void;
      onChange?: (option: { label: string; value: string } | null) => void;
      onBlur?: () => void;
      value?: { label: string; value: string } | null;
      loading?: boolean;
      options: Array<{ label: string; value: string }>;
      "data-test-id"?: string;
    }) => (
      <div data-test-id={dataTestId}>
        {loading ? <span data-test-id="combobox-loading">Loading</span> : null}
        <span data-test-id="combobox-value">{value ? value.label : "null"}</span>
        <button type="button" data-test-id="scroll-end" onClick={() => onScrollEnd?.()}>
          scroll end
        </button>
        <button type="button" data-test-id="search" onClick={() => onInputValueChange?.("navy")}>
          search
        </button>
        <button type="button" data-test-id="clear-selection" onClick={() => onChange?.(null)}>
          clear
        </button>
        <button type="button" data-test-id="blur" onClick={() => onBlur?.()}>
          blur
        </button>
        {options.map(option => (
          <button
            key={option.value}
            type="button"
            data-test-id={`option-${option.value}`}
            onClick={() => onChange?.(option)}
          >
            {option.label}
          </button>
        ))}
      </div>
    ),
  };
});

import { useProductTranslationContextQuery } from "@dashboard/graphql";
import { isMainSchema } from "@dashboard/graphql/schemaVersion";
import { useProductVariantSiblings } from "@dashboard/products/hooks/useProductVariantSiblings";

const mockedUseProductVariantSiblings = useProductVariantSiblings as jest.MockedFunction<
  typeof useProductVariantSiblings
>;
const mockedUseProductTranslationContextQuery =
  useProductTranslationContextQuery as jest.MockedFunction<
    typeof useProductTranslationContextQuery
  >;
const mockedIsMainSchema = isMainSchema as jest.MockedFunction<typeof isMainSchema>;

const renderSwitcher = (props: Partial<React.ComponentProps<typeof ProductContextSwitcher>> = {}) =>
  render(
    <IntlProvider locale="en" messages={{}}>
      <ProductContextSwitcher
        productId="product-1"
        selectedId="product-1"
        onItemChange={jest.fn()}
        {...props}
      />
    </IntlProvider>,
  );

describe("ProductContextSwitcher", () => {
  beforeEach(() => {
    mockLoadMore.mockReset();
    mockSetSearch.mockReset();
    mockedIsMainSchema.mockReturnValue(true);
    mockedUseProductTranslationContextQuery.mockReturnValue({
      data: {
        translation: {
          __typename: "ProductTranslatableContent",
          id: "product-content-1",
          product: {
            __typename: "Product",
            id: "product-1",
            media: [
              {
                __typename: "ProductMedia",
                id: "media-1",
                alt: "Front view",
              },
            ],
          },
        },
      },
      loading: false,
    } as ReturnType<typeof useProductTranslationContextQuery>);
    mockedUseProductVariantSiblings.mockReturnValue({
      variants: [
        {
          __typename: "ProductVariant",
          id: "v1",
          name: "Variant 1",
          sku: "sku-1",
          media: null,
        },
      ] as ProductVariantSibling[],
      offPageCurrent: null,
      loadedCount: 1,
      totalCount: 3,
      initialLoading: false,
      loadingMore: false,
      search: "",
      setSearch: mockSetSearch,
      hasNextPage: true,
      loadMore: mockLoadMore,
      refetch: jest.fn(),
      canReorder: true,
    });
  });

  it("loads more variants when the dropdown scrolls to the end", () => {
    // Arrange
    renderSwitcher();

    // Act
    fireEvent.click(screen.getByTestId("scroll-end"));

    // Assert
    expect(mockLoadMore).toHaveBeenCalledTimes(1);
  });

  it("passes loading to the combobox while loading more variants", () => {
    // Arrange
    mockedUseProductVariantSiblings.mockReturnValue({
      variants: [],
      offPageCurrent: null,
      loadedCount: 0,
      totalCount: 3,
      initialLoading: false,
      loadingMore: true,
      search: "",
      setSearch: mockSetSearch,
      hasNextPage: true,
      loadMore: mockLoadMore,
      refetch: jest.fn(),
      canReorder: true,
    });

    // Act
    renderSwitcher();

    // Assert
    expect(screen.getByTestId("combobox-loading")).toBeInTheDocument();
  });

  it("does not load more while a page is already loading", () => {
    // Arrange
    mockedUseProductVariantSiblings.mockReturnValue({
      variants: [],
      offPageCurrent: null,
      loadedCount: 0,
      totalCount: 3,
      initialLoading: false,
      loadingMore: true,
      search: "",
      setSearch: mockSetSearch,
      hasNextPage: true,
      loadMore: mockLoadMore,
      refetch: jest.fn(),
      canReorder: true,
    });
    renderSwitcher();

    // Act
    fireEvent.click(screen.getByTestId("scroll-end"));

    // Assert
    expect(mockLoadMore).not.toHaveBeenCalled();
  });

  it("forwards search input to the siblings hook without clearing the committed value", () => {
    // Arrange
    renderSwitcher();
    expect(screen.getByTestId("combobox-value")).toHaveTextContent("Main Product");

    // Act — typing must not null the selection (Downshift would wipe the input).
    fireEvent.click(screen.getByTestId("search"));

    // Assert
    expect(mockSetSearch).toHaveBeenCalledWith("navy");
    expect(screen.getByTestId("combobox-value")).toHaveTextContent("Main Product");
  });

  it("clears the committed value only when Macaw reports an empty selection", () => {
    // Arrange
    renderSwitcher();

    // Act
    fireEvent.click(screen.getByTestId("clear-selection"));

    // Assert
    expect(screen.getByTestId("combobox-value")).toHaveTextContent("null");
  });

  it("restores the committed value after blur", () => {
    // Arrange
    jest.useFakeTimers();
    renderSwitcher();
    fireEvent.click(screen.getByTestId("clear-selection"));
    expect(screen.getByTestId("combobox-value")).toHaveTextContent("null");

    // Act
    fireEvent.click(screen.getByTestId("blur"));
    act(() => {
      jest.runOnlyPendingTimers();
    });

    // Assert
    expect(mockSetSearch).toHaveBeenCalledWith("");
    expect(screen.getByTestId("combobox-value")).toHaveTextContent("Main Product");
    jest.useRealTimers();
  });

  it("shows product media alongside variants", () => {
    // Arrange // Act
    renderSwitcher();

    // Assert
    expect(screen.getByTestId("option-v1")).toHaveTextContent("Variant: Variant 1");
    expect(screen.getByTestId("option-media-1")).toHaveTextContent("Media 1: Front view");
  });

  it("reports media selection with the media item type", () => {
    // Arrange
    const onItemChange = jest.fn();

    renderSwitcher({ onItemChange });

    // Act
    fireEvent.click(screen.getByTestId("option-media-1"));

    // Assert
    expect(onItemChange).toHaveBeenCalledWith("media-1", "media");
  });

  it("hides media when the active schema does not support media translations", () => {
    // Arrange
    mockedIsMainSchema.mockReturnValue(false);

    // Act
    renderSwitcher();

    // Assert
    expect(screen.queryByTestId("option-media-1")).not.toBeInTheDocument();
    expect(mockedUseProductTranslationContextQuery).toHaveBeenCalledWith(
      expect.objectContaining({ skip: true }),
    );
  });
});
