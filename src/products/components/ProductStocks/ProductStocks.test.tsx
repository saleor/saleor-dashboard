import { render } from "@testing-library/react";

import { messages } from "./messages";
import { WarehouseInformationMessage } from "./WarehouseInformationMessage";

describe("WarehouseInformationMessage", () => {
  const defaultProps = {
    hasVariants: false,
    hasWarehouses: false,
    hasStocks: false,
    onWarehouseConfigure: jest.fn(),
  };

  it("should render message for creating product", () => {
    const { getByText } = render(<WarehouseInformationMessage isCreate {...defaultProps} />);

    expect(getByText(messages.warehouseMessageProductOnCreate.defaultMessage)).toBeInTheDocument();
  });

  it("should render message for creating variant", () => {
    const { getByText } = render(
      <WarehouseInformationMessage {...defaultProps} isCreate hasVariants />,
    );

    expect(getByText(messages.warehouseMessageVariantOnCreate.defaultMessage)).toBeInTheDocument();
  });

  it("should not render message if stocks exist", () => {
    const { queryByText } = render(
      <WarehouseInformationMessage {...defaultProps} hasStocks isCreate={false} />,
    );

    expect(queryByText(messages.configureWarehouseForProduct.defaultMessage)).toBeNull();
    expect(queryByText(messages.configureWarehouseForVariant.defaultMessage)).toBeNull();
  });
});
