import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { OrderFulfillSkuCell } from "./OrderFulfillSkuCell";

// Radix tooltip content measures itself with ResizeObserver, which jsdom lacks.
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

const longSku = "329874893278387y28467378";

const setOverflow = (element: HTMLElement, overflows: boolean): void => {
  Object.defineProperty(element, "scrollWidth", {
    configurable: true,
    value: overflows ? 300 : 40,
  });
  Object.defineProperty(element, "clientWidth", {
    configurable: true,
    value: 100,
  });
};

describe("OrderFulfillSkuCell", () => {
  it("shows the full sku when the cell is clipped", async () => {
    // Arrange
    render(<OrderFulfillSkuCell sku={longSku} />);

    const sku = screen.getByTestId("fulfillment-sku");

    setOverflow(sku, true);

    // Act
    await userEvent.hover(sku);

    // Assert
    expect(await screen.findByRole("tooltip")).toHaveTextContent(longSku);
  });

  it("keeps the tooltip closed when the sku fits", async () => {
    // Arrange
    render(<OrderFulfillSkuCell sku="SKU-1" />);

    const sku = screen.getByTestId("fulfillment-sku");

    setOverflow(sku, false);

    // Act
    await userEvent.hover(sku);

    // Assert
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("renders nothing when the variant has no sku", () => {
    // Act
    const { container } = render(<OrderFulfillSkuCell sku={null} />);

    // Assert
    expect(container).toBeEmptyDOMElement();
  });
});
