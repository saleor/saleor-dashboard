import { render } from "@testing-library/react";
import React from "react";

import { messages } from "./messages";
import { WarehouseInformationMessage } from "./WarehouseInformationMessage";

jest.mock("react-intl", () => ({
  defineMessages: jest.fn(x => x),
  FormattedMessage: ({ defaultMessage }: { defaultMessage: string }) => <>{defaultMessage}</>,
}));

describe("WarehouseInformationMessage", () => {
  const defaultProps = {
    hasVariants: false,
    hasWarehouses: false,
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

  it("should not render message if warehouses exist", () => {
    const { queryByText } = render(
      <WarehouseInformationMessage {...defaultProps} hasWarehouses isCreate={false} />,
    );

    expect(queryByText(messages.configureWarehouseForProduct.defaultMessage)).toBeNull();
    expect(queryByText(messages.configureWarehouseForVariant.defaultMessage)).toBeNull();
  });
});
