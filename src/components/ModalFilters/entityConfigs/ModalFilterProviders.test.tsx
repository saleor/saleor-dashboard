import { render } from "@testing-library/react";
import { type FC, type ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import { type ModalFilterContext, type ModalFilterResult } from "../types";
import { useModalFilters } from "../useModalFilters";
import { ModalCategoryFilterProvider } from "./ModalCategoryFilterProvider";
import { ModalCollectionFilterProvider } from "./ModalCollectionFilterProvider";
import { ModalPageFilterProvider } from "./ModalPageFilterProvider";
import { ModalProductFilterProvider } from "./ModalProductFilterProvider";

jest.mock("../useModalFilters", () => ({
  useModalFilters: jest.fn(),
}));

type ProviderUnderTest = FC<{ children: ReactNode }>;

const providers: Array<{ name: string; Provider: ProviderUnderTest }> = [
  { name: "ModalCategoryFilterProvider", Provider: ModalCategoryFilterProvider },
  { name: "ModalCollectionFilterProvider", Provider: ModalCollectionFilterProvider },
  { name: "ModalPageFilterProvider", Provider: ModalPageFilterProvider },
  { name: "ModalProductFilterProvider", Provider: ModalProductFilterProvider },
];

// The providers only hand the filter context down to their children, so its contents don't matter here.
const unusedFilterContext = {} as ModalFilterContext;

describe("modal filter providers", () => {
  it.each(providers)("$name clears its URL filters when its picker unmounts", ({ Provider }) => {
    // Arrange
    const clearFilters = jest.fn();
    const modalFilters: ModalFilterResult<Record<string, never>> = {
      filterContext: unusedFilterContext,
      filterVariables: {},
      filterChannel: undefined,
      clearFilters,
      hasActiveFilters: true,
    };

    (useModalFilters as jest.MockedFunction<typeof useModalFilters>).mockReturnValue(modalFilters);

    const { unmount } = render(
      <MemoryRouter initialEntries={["/discounts/vouchers/v-1?0=filter&action=assign"]}>
        <Provider>
          <span>picker</span>
        </Provider>
      </MemoryRouter>,
    );

    // Act
    unmount();

    // Assert
    expect(clearFilters).toHaveBeenCalledTimes(1);
  });
});
