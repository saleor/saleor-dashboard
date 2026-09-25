import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton/ConfirmButton";
import { orderLineSearch } from "@dashboard/orders/fixtures";
import { type OrderSearchProduct } from "@dashboard/searches/mapSearchOrderVariantsForAdd";
import Wrapper from "@test/wrapper";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { OrderProductAddDialog } from "./OrderProductAddDialog";

const mockQuery = jest.fn();

jest.mock("@apollo/client", () => {
  const actual = jest.requireActual("@apollo/client");

  return {
    ...actual,
    useApolloClient: () => ({
      query: mockQuery,
    }),
  };
});

describe("OrderProductAddDialog", () => {
  const placeholderImage = "https://via.placeholder.com/64";
  const products = orderLineSearch(placeholderImage);

  beforeEach(() => {
    mockQuery.mockReset();
  });

  const defaultProps = {
    confirmButtonState: "default" as ConfirmButtonTransitionState,
    errors: [],
    open: true,
    products,
    loading: false,
    hasMore: false,
    channelName: "Channel-PLN",
    channel: "channel-pln",
    onClose: jest.fn(),
    onFetch: jest.fn(),
    onFetchMore: jest.fn(),
    onSubmit: jest.fn(),
  };

  it("renders picker layout with title, subtitle, search, and product list", () => {
    // Arrange // Act
    render(
      <Wrapper>
        <OrderProductAddDialog {...defaultProps} />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByText(/Add product from/)).toBeInTheDocument();
    expect(
      screen.getByText("You can only add products available for the order's channel"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("search-query")).toBeInTheDocument();
    expect(screen.getByTestId("add-products-table")).toBeInTheDocument();
    expect(screen.getAllByTestId("product").length).toBeGreaterThan(0);
    expect(screen.getByTestId("confirm-button")).toBeDisabled();
  });

  it("submits selected variants when confirm is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    render(
      <Wrapper>
        <OrderProductAddDialog {...defaultProps} onSubmit={onSubmit} />
      </Wrapper>,
    );

    // Act
    await user.click(screen.getAllByRole("checkbox")[1]);

    const confirmButton = screen.getByTestId("confirm-button");

    await waitFor(() => {
      expect(confirmButton).not.toBeDisabled();
    });
    fireEvent.click(confirmButton);

    const firstVariantId = products?.[0]?.variants?.[0]?.id;

    // Assert
    expect(onSubmit).toHaveBeenCalledWith([expect.objectContaining({ id: firstVariantId })]);
  });

  it("shows a load more variants control instead of a truncation hint", () => {
    // Arrange
    const truncatedProduct: OrderSearchProduct = {
      ...products[0],
      variantsHasNextPage: true,
      variantsTotalCount: 69,
    };

    // Act
    render(
      <Wrapper>
        <OrderProductAddDialog {...defaultProps} products={[products[1], truncatedProduct]} />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByTestId("load-more-variants")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Load more variants/ })).toBeInTheDocument();
    expect(screen.getByTestId("load-more-variants-progress")).toBeInTheDocument();
    expect(screen.queryByText(/Showing .* of .* variants/)).not.toBeInTheDocument();
    expect(screen.queryByText(/remaining/)).not.toBeInTheDocument();
  });

  it("keeps a truncated product visible when its first page has no price, then loads channel variants", async () => {
    // Arrange
    const unpriced = {
      ...products[0].variants[0],
      id: "embedded",
      pricing: null,
    };
    const hiddenOnFirstPage: OrderSearchProduct = {
      ...products[0],
      variants: [unpriced],
      variantsHasNextPage: true,
      variantsTotalCount: 100,
      channelVariantIds: null,
      missingVariantIds: [],
    };

    mockQuery.mockImplementation(
      async ({ query }: { query: { definitions: Array<{ name?: { value?: string } }> } }) => {
        const name = query.definitions[0]?.name?.value;

        if (name === "OrderProductChannelVariantIds") {
          return { data: { product: { id: products[0].id, variants: [{ id: "v51" }] } } };
        }

        return {
          data: {
            productVariants: {
              edges: [
                {
                  node: {
                    ...products[0].variants[0],
                    id: "v51",
                    name: "V051",
                  },
                },
              ],
            },
          },
        };
      },
    );

    // Act
    render(
      <Wrapper>
        <OrderProductAddDialog {...defaultProps} products={[hiddenOnFirstPage]} />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByTestId("product")).toBeInTheDocument();
    expect(await screen.findByText("V051")).toBeInTheDocument();
  });

  it("hides a product once channel ids show nothing is listed", async () => {
    // Arrange
    const unpriced = {
      ...products[0].variants[0],
      pricing: null,
    };
    const noneListed: OrderSearchProduct = {
      ...products[0],
      variants: [unpriced],
      variantsHasNextPage: true,
      variantsTotalCount: 60,
      channelVariantIds: null,
      missingVariantIds: [],
    };

    mockQuery.mockResolvedValue({
      data: { product: { id: products[0].id, variants: [] } },
    });

    // Act
    render(
      <Wrapper>
        <OrderProductAddDialog {...defaultProps} products={[noneListed]} />
      </Wrapper>,
    );

    // Assert
    expect(
      await screen.findByText(/No products are available in the channel assigned to this order/),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("product")).not.toBeInTheDocument();
  });

  it("disables select-all while channel variants are still missing", () => {
    // Arrange
    const partial: OrderSearchProduct = {
      ...products[0],
      variants: [products[0].variants[0]],
      variantsHasNextPage: true,
      channelVariantIds: [products[0].variants[0].id, "later"],
      missingVariantIds: ["later"],
    };

    // Act
    render(
      <Wrapper>
        <OrderProductAddDialog {...defaultProps} products={[partial]} />
      </Wrapper>,
    );

    // Assert
    expect(screen.getAllByRole("checkbox")[0]).toBeDisabled();
    expect(screen.getByTestId("load-more-variants-progress")).toHaveTextContent(
      "1 of 2 channel variants have a price",
    );
  });
});
