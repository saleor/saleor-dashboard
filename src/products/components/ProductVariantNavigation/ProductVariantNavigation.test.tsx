import {
  type ProductVariantSibling,
  useProductVariantSiblings,
} from "@dashboard/products/hooks/useProductVariantSiblings";
import { productVariantEditUrl } from "@dashboard/products/urls";
import { ThemeWrapper } from "@test/themeWrapper";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { type ComponentProps } from "react";
import { IntlProvider } from "react-intl";
import { MemoryRouter } from "react-router-dom";

import { ProductVariantNavigation } from "./ProductVariantNavigation";

const mockNavigate = jest.fn();

jest.mock("@dashboard/hooks/useNavigator", () => () => mockNavigate);
jest.mock("@dashboard/products/hooks/useProductVariantSiblings", () => ({
  useProductVariantSiblings: jest.fn(),
}));

const mockedUseProductVariantSiblings = useProductVariantSiblings as jest.MockedFunction<
  typeof useProductVariantSiblings
>;

type SiblingsResult = ReturnType<typeof useProductVariantSiblings>;
type NavigationProps = ComponentProps<typeof ProductVariantNavigation>;

const variant = (id: string, name: string): ProductVariantSibling => ({
  __typename: "ProductVariant",
  id,
  name,
  sku: `SKU-${id}`,
  media: [],
});

const small = variant("small", "Small");
const medium = variant("medium", "Medium");
const large = variant("large", "Large");

const setSearch = jest.fn();
const loadMore = jest.fn();

const siblings = (overrides: Partial<SiblingsResult> = {}): SiblingsResult => ({
  variants: [small, medium, large],
  offPageCurrent: null,
  loadedCount: 3,
  totalCount: 3,
  initialLoading: false,
  loadingMore: false,
  search: "",
  setSearch,
  hasNextPage: false,
  loadMore,
  refetch: jest.fn(),
  reorder: jest.fn(),
  canReorder: true,
  filtered: false,
  ...overrides,
});

const defaultProps: NavigationProps = {
  productId: "product",
  current: medium.id,
  currentVariant: medium,
  defaultVariantId: small.id,
  fallbackThumbnail: "",
  onReorder: jest.fn(),
  layout: "stacked",
};

const tree = (props: Partial<NavigationProps> = {}) => (
  <MemoryRouter>
    <IntlProvider locale="en" onError={() => undefined}>
      <ThemeWrapper>
        <ProductVariantNavigation {...defaultProps} {...props} />
      </ThemeWrapper>
    </IntlProvider>
  </MemoryRouter>
);

const listedNames = (): string[] =>
  screen.queryAllByTestId("variant-name").map(element => element.textContent ?? "");
const toggle = (): HTMLElement => screen.getByTestId("variant-switcher-toggle");
const previousButton = (): HTMLElement => screen.getByRole("button", { name: "Previous variant" });
const nextButton = (): HTMLElement => screen.getByRole("button", { name: "Next variant" });

beforeAll(() => {
  // jsdom has neither; the list uses both to keep track of the open variant's row.
  global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    disconnect: jest.fn(),
  }));
  global.CSS = { ...global.CSS, escape: (value: string): string => value };
});

beforeEach(() => {
  jest.clearAllMocks();
  // A request for the next page starts unless a test says otherwise.
  loadMore.mockReturnValue(true);
  mockedUseProductVariantSiblings.mockReturnValue(siblings());
});

describe("ProductVariantNavigation", () => {
  describe("columns layout", () => {
    it("lists every variant without a switcher", () => {
      // Arrange & Act
      render(tree({ layout: "columns" }));

      // Assert
      expect(listedNames()).toEqual(["Small", "Medium", "Large"]);
      expect(screen.queryByTestId("variant-switcher")).not.toBeInTheDocument();
    });
  });

  describe("pinning the open variant above the list", () => {
    const pinnedRow = (): HTMLElement | null =>
      screen.queryByTestId("variant-siblings-pinned-current");
    const rect = (top: number, bottom: number): DOMRect => ({
      top,
      bottom,
      height: bottom - top,
      left: 0,
      right: 0,
      width: 0,
      x: 0,
      y: top,
      toJSON: () => ({}),
    });
    let layout: jest.SpyInstance | undefined;

    /** Lets work queued for the next animation frame run. */
    const nextFrame = (): Promise<void> =>
      act(async () => {
        await new Promise(resolve => setTimeout(resolve, 50));
      });

    /** Lays the list out: a scroll area 300px tall, and 56px rows at the given offsets. */
    const layOut = (rowTops: Record<string, number>): void => {
      layout = jest.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (
        this: Element,
      ) {
        if (this.getAttribute("data-test-id") === "variant-siblings-scroll") {
          return rect(0, 300);
        }

        const id = this.getAttribute("data-variant-id");

        return id !== null && id in rowTops ? rect(rowTops[id], rowTops[id] + 56) : rect(0, 0);
      });
    };

    afterEach(() => {
      layout?.mockRestore();
      layout = undefined;
    });

    it("does not pin while the list is still loading", () => {
      // Arrange: the variant's details arrived before the list did
      mockedUseProductVariantSiblings.mockReturnValue(
        siblings({ variants: [], loadedCount: 0, totalCount: null, initialLoading: true }),
      );

      // Act
      render(tree({ layout: "columns" }));

      // Assert
      expect(pinnedRow()).not.toBeInTheDocument();
    });

    it("pins a variant that is beyond the loaded part of the list", () => {
      // Arrange
      const beyond = variant("beyond", "Extra large");

      // Act
      render(tree({ layout: "columns", current: beyond.id, currentVariant: beyond }));

      // Assert
      expect(pinnedRow()).toHaveTextContent("Extra large");
      expect(pinnedRow()).toHaveTextContent("Not visible in the list");
    });

    it("pins a variant whose row is scrolled out of view, from the first render", () => {
      // Arrange
      layOut({ [small.id]: 388, [medium.id]: 444, [large.id]: 500 });

      // Act
      render(tree({ layout: "columns" }));

      // Assert
      expect(pinnedRow()).toHaveTextContent("Medium");
    });

    it("does not pin a variant whose row is in view", () => {
      // Arrange
      layOut({ [small.id]: 0, [medium.id]: 56, [large.id]: 112 });

      // Act
      render(tree({ layout: "columns" }));

      // Assert
      expect(pinnedRow()).not.toBeInTheDocument();
      expect(listedNames()).toEqual(["Small", "Medium", "Large"]);
    });

    it("does not pin a variant in view after the list loads under its details", async () => {
      // Arrange: details first, list still loading
      layOut({ [small.id]: 0, [medium.id]: 56, [large.id]: 112 });
      mockedUseProductVariantSiblings.mockReturnValue(
        siblings({ variants: [], loadedCount: 0, totalCount: null, initialLoading: true }),
      );

      const { rerender } = render(tree({ layout: "columns" }));

      await nextFrame();

      // Act: the list arrives
      mockedUseProductVariantSiblings.mockReturnValue(siblings());
      rerender(tree({ layout: "columns" }));
      await nextFrame();

      // Assert
      expect(pinnedRow()).not.toBeInTheDocument();
    });

    it("does not pin a variant in view when the list comes back from the stacked layout", async () => {
      // Arrange: stacked and folded, so there is no list to measure
      layOut({ [small.id]: 0, [medium.id]: 56, [large.id]: 112 });

      const { rerender } = render(tree({ layout: "stacked" }));

      await nextFrame();

      // Act: the window widens
      rerender(tree({ layout: "columns" }));
      await nextFrame();

      // Assert
      expect(pinnedRow()).not.toBeInTheDocument();
      expect(listedNames()).toEqual(["Small", "Medium", "Large"]);
    });

    it("never pins in the stacked layout, where the switcher shows the open variant", () => {
      // Arrange
      const beyond = variant("beyond", "Extra large");

      render(tree({ layout: "stacked", current: beyond.id, currentVariant: beyond }));

      // Act
      fireEvent.click(toggle());

      // Assert
      expect(pinnedRow()).not.toBeInTheDocument();
    });
  });

  describe("searching", () => {
    it("keeps the rows it has when a search turns reordering off", () => {
      // Arrange
      const row = (): Element | null =>
        document.querySelector(`[data-test-id="variants-list"] [data-variant-id="${medium.id}"]`);
      const { rerender } = render(tree({ layout: "columns" }));
      const rowBefore = row();

      // Act: the first character of a search is typed
      mockedUseProductVariantSiblings.mockReturnValue(
        siblings({ search: "m", canReorder: false, filtered: true }),
      );
      rerender(tree({ layout: "columns" }));

      // Assert: the same element, not a new one built in its place
      expect(rowBefore).not.toBeNull();
      expect(row()).toBe(rowBefore);
    });
  });

  describe("search without matches", () => {
    const noMatches = (): HTMLElement | null => screen.queryByTestId("variant-siblings-no-matches");

    it("says that nothing matches and clears the search on request", () => {
      // Arrange
      mockedUseProductVariantSiblings.mockReturnValue(
        siblings({ variants: [], totalCount: 0, search: "zzz", canReorder: false, filtered: true }),
      );
      render(tree({ layout: "columns" }));

      // Assert
      expect(noMatches()).toHaveTextContent("No variants match your search");

      // Act
      fireEvent.click(screen.getByRole("button", { name: "Clear search" }));

      // Assert
      expect(setSearch).toHaveBeenCalledWith("");
      expect(screen.getByTestId("variant-siblings-search")).toHaveFocus();
    });

    it("says so in the unfolded stacked list too", () => {
      // Arrange
      const { rerender } = render(tree());

      fireEvent.click(toggle());
      mockedUseProductVariantSiblings.mockReturnValue(
        siblings({ variants: [], totalCount: 0, search: "zzz", canReorder: false, filtered: true }),
      );

      // Act: the search comes back empty
      rerender(tree());

      // Assert
      expect(noMatches()).toBeInTheDocument();
    });

    it("says nothing while the search still has matches", () => {
      // Arrange
      mockedUseProductVariantSiblings.mockReturnValue(
        siblings({ variants: [medium], search: "med", canReorder: false, filtered: true }),
      );

      // Act
      render(tree({ layout: "columns" }));

      // Assert
      expect(noMatches()).not.toBeInTheDocument();
    });

    it("says nothing while the list is still loading", () => {
      // Arrange
      mockedUseProductVariantSiblings.mockReturnValue(
        siblings({ variants: [], totalCount: null, search: "zzz", initialLoading: true }),
      );

      // Act
      render(tree({ layout: "columns" }));

      // Assert
      expect(noMatches()).not.toBeInTheDocument();
    });

    it("says nothing when the list is empty for another reason than a search", () => {
      // Arrange
      mockedUseProductVariantSiblings.mockReturnValue(siblings({ variants: [], totalCount: 0 }));

      // Act
      render(tree({ layout: "columns" }));

      // Assert
      expect(noMatches()).not.toBeInTheDocument();
    });
  });

  describe("stacked layout", () => {
    it("folds the list into the open variant and its place", () => {
      // Arrange & Act
      render(tree());

      // Assert
      expect(listedNames()).toEqual([]);
      expect(toggle()).toHaveTextContent("Medium");
      expect(toggle()).toHaveTextContent("2 of 3");
      expect(toggle()).toHaveAttribute("aria-expanded", "false");
    });

    it("marks the default variant", () => {
      // Arrange & Act
      render(tree({ current: small.id, currentVariant: small }));

      // Assert
      expect(toggle()).toHaveTextContent("1 of 3 · Default");
    });

    it("shows the list with search and the add button when unfolded, and hides it again", () => {
      // Arrange
      render(tree());

      // Act
      fireEvent.click(toggle());

      // Assert
      expect(listedNames()).toEqual(["Small", "Medium", "Large"]);
      expect(screen.getByTestId("variant-siblings-search")).toBeInTheDocument();
      expect(screen.getByTestId("button-add-variant")).toBeInTheDocument();
      expect(toggle()).toHaveAttribute("aria-expanded", "true");

      // Act
      fireEvent.click(toggle());

      // Assert
      expect(listedNames()).toEqual([]);
    });

    it("opens the neighbouring variants with the previous and next buttons", () => {
      // Arrange
      render(tree());

      // Act
      fireEvent.click(nextButton());
      fireEvent.click(previousButton());

      // Assert
      expect(mockNavigate.mock.calls).toEqual([
        [productVariantEditUrl(large.id)],
        [productVariantEditUrl(small.id)],
      ]);
    });

    it("has no previous variant for the first one and no next for the last", () => {
      // Arrange & Act
      const { rerender } = render(tree({ current: small.id, currentVariant: small }));

      // Assert
      expect(previousButton()).toBeDisabled();
      expect(nextButton()).toBeEnabled();

      // Act
      rerender(tree({ current: large.id, currentVariant: large }));

      // Assert
      expect(previousButton()).toBeEnabled();
      expect(nextButton()).toBeDisabled();
    });

    it("folds the list when another variant opens", () => {
      // Arrange
      const { rerender } = render(tree());

      fireEvent.click(toggle());
      expect(listedNames()).toHaveLength(3);

      // Act
      rerender(tree({ current: large.id, currentVariant: large }));

      // Assert
      expect(listedNames()).toEqual([]);
      expect(toggle()).toHaveTextContent("Large");
    });

    it("clears the search when the list is folded", () => {
      // Arrange
      mockedUseProductVariantSiblings.mockReturnValue(
        siblings({ variants: [medium], search: "med", canReorder: false, filtered: true }),
      );
      render(tree());
      fireEvent.click(toggle());
      setSearch.mockClear();

      // Act
      fireEvent.click(toggle());

      // Assert
      expect(setSearch).toHaveBeenCalledWith("");
    });

    it("keeps the search while the list is open", () => {
      // Arrange
      render(tree());
      fireEvent.click(toggle());
      mockedUseProductVariantSiblings.mockReturnValue(
        siblings({ variants: [medium], search: "med", canReorder: false, filtered: true }),
      );

      // Act
      fireEvent.change(screen.getByTestId("variant-siblings-search"), {
        target: { value: "med" },
      });

      // Assert
      expect(setSearch.mock.calls).toEqual([["med"]]);
    });

    it("gives no place or neighbours from search results", () => {
      // Arrange: "Medium" is first among the results, but second in the product
      mockedUseProductVariantSiblings.mockReturnValue(
        siblings({ variants: [medium, large], totalCount: 2, filtered: true }),
      );

      // Act
      render(tree());

      // Assert
      expect(toggle()).toHaveTextContent("Medium");
      expect(toggle()).not.toHaveTextContent("of");
      expect(toggle()).not.toHaveTextContent("variants");
      expect(previousButton()).toBeDisabled();
      expect(nextButton()).toBeDisabled();
    });

    it("loads towards an open variant beyond the loaded part of the list, showing the count meanwhile", () => {
      // Arrange
      const beyond = variant("beyond", "Extra large");

      mockedUseProductVariantSiblings.mockReturnValue(
        siblings({ totalCount: 40, hasNextPage: true }),
      );

      // Act
      render(tree({ current: beyond.id, currentVariant: beyond }));

      // Assert
      expect(toggle()).toHaveTextContent("Extra large");
      expect(toggle()).toHaveTextContent("40 variants");
      expect(previousButton()).toBeDisabled();
      expect(nextButton()).toBeDisabled();
      expect(loadMore).toHaveBeenCalledTimes(1);
    });

    it("gives the place once the page holding the open variant has loaded", () => {
      // Arrange
      const beyond = variant("beyond", "Extra large");

      mockedUseProductVariantSiblings.mockReturnValue(
        siblings({ totalCount: 4, hasNextPage: true }),
      );

      const { rerender } = render(tree({ current: beyond.id, currentVariant: beyond }));

      // Act: the next page arrives with the open variant on it
      mockedUseProductVariantSiblings.mockReturnValue(
        siblings({ variants: [small, medium, large, beyond], loadedCount: 4, totalCount: 4 }),
      );
      rerender(tree({ current: beyond.id, currentVariant: beyond }));

      // Assert
      expect(toggle()).toHaveTextContent("4 of 4");
      expect(previousButton()).toBeEnabled();
      expect(loadMore).toHaveBeenCalledTimes(1);
    });

    it("stops looking for the open variant once 300 variants are loaded", () => {
      // Arrange
      const beyond = variant("beyond", "Extra large");
      const loaded = Array.from({ length: 300 }, (_, index) =>
        variant(`loaded-${index}`, `Variant ${index}`),
      );

      mockedUseProductVariantSiblings.mockReturnValue(
        siblings({ variants: loaded, loadedCount: 300, totalCount: 900, hasNextPage: true }),
      );

      // Act
      render(tree({ current: beyond.id, currentVariant: beyond }));

      // Assert
      expect(toggle()).toHaveTextContent("900 variants");
      expect(loadMore).not.toHaveBeenCalled();
    });

    it("does not load towards the open variant in columns, where it is pinned instead", () => {
      // Arrange
      const beyond = variant("beyond", "Extra large");

      mockedUseProductVariantSiblings.mockReturnValue(
        siblings({ totalCount: 40, hasNextPage: true }),
      );

      // Act
      render(tree({ layout: "columns", current: beyond.id, currentVariant: beyond }));

      // Assert
      expect(loadMore).not.toHaveBeenCalled();
    });

    it("asks for the next page again when the request could not start", () => {
      // Arrange: another page request is on its way, so this one is refused
      const props = { current: large.id, currentVariant: large };

      loadMore.mockReturnValue(false);
      mockedUseProductVariantSiblings.mockReturnValue(
        siblings({ totalCount: 40, hasNextPage: true, loadingMore: true }),
      );

      const { rerender } = render(tree(props));

      // Act: that other request is done
      loadMore.mockReturnValue(true);
      mockedUseProductVariantSiblings.mockReturnValue(
        siblings({ totalCount: 40, hasNextPage: true }),
      );
      rerender(tree(props));
      rerender(tree(props));

      // Assert: asked once it could start, and not again after that
      expect(loadMore).toHaveBeenCalledTimes(1);
      expect(loadMore).toHaveLastReturnedWith(true);
    });

    it("asks for the next page again after a search replaced the list", () => {
      // Arrange: open variant is the last one loaded, so the next page was asked for
      const atEndOfPage = siblings({ totalCount: 40, hasNextPage: true });
      const props = { current: large.id, currentVariant: large };

      mockedUseProductVariantSiblings.mockReturnValue(atEndOfPage);

      const { rerender } = render(tree(props));

      expect(loadMore).toHaveBeenCalledTimes(1);

      // Act: a search comes and goes, leaving the first page loaded again
      mockedUseProductVariantSiblings.mockReturnValue(
        siblings({ variants: [large], totalCount: 1, search: "lar", filtered: true }),
      );
      rerender(tree(props));
      mockedUseProductVariantSiblings.mockReturnValue(atEndOfPage);
      rerender(tree(props));

      // Assert
      expect(loadMore).toHaveBeenCalledTimes(2);
    });

    it("loads the next page once when the open variant is the last one loaded", () => {
      // Arrange
      mockedUseProductVariantSiblings.mockReturnValue(
        siblings({ totalCount: 40, hasNextPage: true }),
      );

      // Act
      const { rerender } = render(tree({ current: large.id, currentVariant: large }));

      rerender(tree({ current: large.id, currentVariant: large }));

      // Assert
      expect(loadMore).toHaveBeenCalledTimes(1);
    });

    it("does not load the next page for a variant in the middle of the loaded list", () => {
      // Arrange
      mockedUseProductVariantSiblings.mockReturnValue(
        siblings({ totalCount: 40, hasNextPage: true }),
      );

      // Act
      render(tree());

      // Assert
      expect(loadMore).not.toHaveBeenCalled();
    });

    it("names a variant being created, without an add button or steps to neighbours", () => {
      // Arrange & Act
      render(tree({ isCreate: true, current: undefined, currentVariant: null }));
      fireEvent.click(toggle());

      // Assert
      expect(toggle()).toHaveTextContent("New variant");
      expect(toggle()).toHaveTextContent("3 variants");
      expect(listedNames()).toEqual(["Small", "Medium", "Large"]);
      expect(screen.queryByTestId("button-add-variant")).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Next variant" })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Previous variant" })).not.toBeInTheDocument();
    });

    it("shows a placeholder until the open variant is known", () => {
      // Arrange
      mockedUseProductVariantSiblings.mockReturnValue(
        siblings({ variants: [], loadedCount: 0, totalCount: null, initialLoading: true }),
      );

      // Act
      render(tree({ currentVariant: null }));

      // Assert
      expect(screen.queryByTestId("variant-switcher-current")).not.toBeInTheDocument();
      expect(previousButton()).toBeDisabled();
      expect(nextButton()).toBeDisabled();
    });
  });
});
