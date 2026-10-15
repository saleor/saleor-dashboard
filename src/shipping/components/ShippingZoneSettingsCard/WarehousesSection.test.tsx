import { type WarehouseChoice } from "@dashboard/shipping/warehouseEligibility";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import { type ComponentProps } from "react";
import { MemoryRouter } from "react-router-dom";

import WarehousesSection from "./WarehousesSection";

// The warehouse multiselect uses IntersectionObserver for infinite scroll.
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

type SectionProps = ComponentProps<typeof WarehousesSection>;

const ineligibleWarehouses: WarehouseChoice[] = Array.from({ length: 8 }, (_, index) => ({
  id: `w-${index}`,
  name: `Warehouse ${index + 1}`,
}));

const baseProps: SectionProps = {
  choices: [],
  onChange: jest.fn(),
  selectedWarehouses: [],
  legacyStockAvailability: true,
  ineligibleWarehouses,
  zoneChannelNames: ["Europe"],
  expanded: true,
  onExpand: jest.fn(),
  onSearchChange: jest.fn(),
  onFetchMore: jest.fn(),
  hasMore: false,
  loading: false,
};

describe("WarehousesSection", () => {
  it("links five warehouses outside the zone's channels and offers the rest", () => {
    // Arrange
    const props: SectionProps = baseProps;

    // Act
    render(
      <Wrapper>
        <MemoryRouter>
          <WarehousesSection {...props} />
        </MemoryRouter>
      </Wrapper>,
    );

    // Assert
    expect(screen.getAllByTestId("shipping-zone-ineligible-warehouse")).toHaveLength(5);
    expect(screen.getByTestId("shipping-zone-ineligible-show-more")).toHaveTextContent(
      "Show 3 more",
    );
  });
});
