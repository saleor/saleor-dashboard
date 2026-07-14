import { useConditionalFilterContext } from "@dashboard/components/ConditionalFilter";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import { STATIC_PAGE_OPTIONS, STATIC_PRODUCT_OPTIONS } from "../ConditionalFilter/constants";
import { type FilterContainer } from "../ConditionalFilter/FilterElement/FilterElement";
import { type LeftOperand } from "../ConditionalFilter/LeftOperandsProvider";
import { createLockedFilterElement } from "./lockedFilters";
import { ModalFilters } from "./ModalFilters";

jest.mock("@dashboard/components/ConditionalFilter", () => {
  const actual = jest.requireActual("@dashboard/components/ConditionalFilter");

  return {
    ...actual,
    useConditionalFilterContext: jest.fn(),
    ConditionalFilters: (): null => null,
  };
});

const mockUseConditionalFilterContext = useConditionalFilterContext as jest.Mock;

interface ContextOptions {
  operands?: LeftOperand[];
  value?: FilterContainer;
  count?: number;
}

const setContext = ({ operands = [], value = [], count = 0 }: ContextOptions): void => {
  mockUseConditionalFilterContext.mockReturnValue({
    apiProvider: {},
    valueProvider: {
      value,
      count,
      loading: false,
      persist: jest.fn(),
      clear: jest.fn(),
      isPersisted: jest.fn(),
      getTokenByName: jest.fn(),
    },
    leftOperandsProvider: { operands, setOperands: jest.fn() },
    containerState: { clearEmpty: jest.fn(), clear: jest.fn() },
    filterWindow: { isOpen: false, setOpen: jest.fn() },
    queryApiType: "WHERE",
  });
};

const renderModalFilters = (): ReturnType<typeof render> =>
  render(
    <Wrapper>
      <ModalFilters />
    </Wrapper>,
  );

describe("ModalFilters", () => {
  it("renders the filter trigger when there are addable operands", () => {
    // Arrange
    setContext({ operands: STATIC_PRODUCT_OPTIONS });

    // Act
    renderModalFilters();

    // Assert
    expect(screen.getByTestId("modal-filters-button")).toBeInTheDocument();
  });

  it("renders the restriction hint together with the filter trigger when locked types exist", () => {
    // Arrange
    const lockedElement = createLockedFilterElement(
      {
        field: "productType",
        values: [
          { id: "pt-1", name: "Shoe" },
          { id: "pt-2", name: "Juice" },
        ],
      },
      STATIC_PRODUCT_OPTIONS,
    );

    setContext({
      operands: STATIC_PRODUCT_OPTIONS.filter(option => option.value !== "productType"),
      count: 0,
      value: [lockedElement],
    });

    // Act
    renderModalFilters();

    // Assert
    expect(screen.getByTestId("modal-filters-button")).toBeInTheDocument();
    expect(screen.getByText("Showing only {label}:")).toBeInTheDocument();
    expect(screen.getAllByTestId("product-type-display")).toHaveLength(2);
  });

  it("renders the filter trigger when no operands are addable but user filters exist", () => {
    // Arrange
    setContext({ operands: [], count: 1 });

    // Act
    renderModalFilters();

    // Assert
    expect(screen.getByTestId("modal-filters-button")).toBeInTheDocument();
  });

  it("renders nothing when no operands, no user filters and no locked constraint", () => {
    // Arrange
    setContext({ operands: [], count: 0, value: [] });

    // Act
    const { container } = renderModalFilters();

    // Assert
    expect(screen.queryByTestId("modal-filters-button")).not.toBeInTheDocument();
    expect(container).toHaveTextContent("");
  });

  it("renders a passive restriction hint instead of the trigger when only a locked constraint exists", () => {
    // Arrange
    const lockedElement = createLockedFilterElement(
      {
        field: "pageTypes",
        values: [
          { id: "pt-1", name: "Blog Post" },
          { id: "pt-2", name: "News" },
        ],
      },
      STATIC_PAGE_OPTIONS,
    );

    setContext({ operands: [], count: 0, value: [lockedElement] });

    // Act
    renderModalFilters();

    // Assert
    expect(screen.queryByTestId("modal-filters-button")).not.toBeInTheDocument();
    // react-intl is mocked globally in jest and returns the raw defaultMessage
    expect(screen.getByText("Showing only {label}:")).toBeInTheDocument();
  });

  it("renders locked model type values with the canonical model type component", () => {
    // Arrange
    const lockedElement = createLockedFilterElement(
      {
        field: "pageTypes",
        values: [
          { id: "pt-1", name: "Blog Post" },
          { id: "pt-2", name: "News" },
        ],
      },
      STATIC_PAGE_OPTIONS,
    );

    setContext({ operands: [], count: 0, value: [lockedElement] });

    // Act
    renderModalFilters();

    // Assert
    const chips = screen.getAllByTestId("model-type-display");

    expect(chips).toHaveLength(2);
    expect(chips[0]).toHaveTextContent("Blog Post");
    expect(chips[1]).toHaveTextContent("News");
  });

  it("renders locked product type values with the canonical product type component", () => {
    // Arrange
    const lockedElement = createLockedFilterElement(
      {
        field: "productType",
        values: [{ id: "prt-1", name: "Simple" }],
      },
      STATIC_PRODUCT_OPTIONS,
    );

    setContext({ operands: [], count: 0, value: [lockedElement] });

    // Act
    renderModalFilters();

    // Assert
    const chips = screen.getAllByTestId("product-type-display");

    expect(chips).toHaveLength(1);
    expect(chips[0]).toHaveTextContent("Simple");
  });
});
