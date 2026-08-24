import { customerType, defaultCustomerType } from "@dashboard/customerTypes/fixtures";
import { ThemeWrapper } from "@test/themeWrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import { CustomerTypeDetailsPage } from "./CustomerTypeDetailsPage";

jest.mock("@dashboard/components/Savebar");
jest.mock("@dashboard/components/DevModePanel/hooks", () => ({
  useDevModeContext: () => ({
    setDevModeContent: jest.fn(),
    setVariables: jest.fn(),
    setDevModeVisibility: jest.fn(),
  }),
}));
jest.mock("../CustomerTypeAttributes/CustomerTypeAttributes", () => ({
  CustomerTypeAttributes: () => <div data-test-id="customer-type-attributes-mock" />,
}));
jest.mock("../CustomerTypeDetails/CustomerTypeDetails", () => ({
  CustomerTypeDetails: () => <div data-test-id="customer-type-details-mock" />,
}));

const Wrapper = ({ children }: { children: ReactNode }): JSX.Element => (
  <MemoryRouter>
    <ThemeWrapper>{children}</ThemeWrapper>
  </MemoryRouter>
);

const defaultProps = {
  disabled: false,
  errors: [],
  saveButtonBarState: "default" as const,
  attributeList: {
    isChecked: () => false,
    selected: 0,
    toggle: jest.fn(),
    toggleAll: jest.fn(),
    toolbar: null,
  },
  onAttributeAdd: jest.fn(),
  onAttributeCreate: jest.fn(),
  onAttributeReorder: jest.fn(),
  onAttributeUnassign: jest.fn(),
  onDelete: jest.fn(),
  onSetDefault: jest.fn(),
  onShowMetadata: jest.fn(),
  onSubmit: jest.fn(),
};

const renderPage = ({
  customerTypeProp,
  onShowMetadata = jest.fn(),
  onDelete = jest.fn(),
  onSetDefault = jest.fn(),
}: {
  customerTypeProp: typeof customerType | typeof defaultCustomerType | undefined;
  onShowMetadata?: () => void;
  onDelete?: () => void;
  onSetDefault?: () => void;
}): ReturnType<typeof render> =>
  render(
    <CustomerTypeDetailsPage
      {...defaultProps}
      customerType={customerTypeProp}
      onShowMetadata={onShowMetadata}
      onDelete={onDelete}
      onSetDefault={onSetDefault}
    />,
    { wrapper: Wrapper },
  );

describe("CustomerTypeDetailsPage top nav", () => {
  it("renders the metadata button", () => {
    // Arrange & Act
    renderPage({ customerTypeProp: customerType });

    // Assert
    expect(screen.getByTestId("show-customer-type-metadata")).toBeInTheDocument();
  });

  it("calls onShowMetadata when the metadata button is clicked", () => {
    // Arrange
    const onShowMetadata = jest.fn();

    renderPage({ customerTypeProp: customerType, onShowMetadata });

    // Act
    screen.getByTestId("show-customer-type-metadata").click();

    // Assert
    expect(onShowMetadata).toHaveBeenCalled();
  });

  it("disables the metadata button while customer type data is loading", () => {
    // Arrange & Act
    renderPage({ customerTypeProp: undefined });

    // Assert
    expect(screen.getByTestId("show-customer-type-metadata")).toBeDisabled();
  });

  it("calls onDelete from the cogs menu", async () => {
    // Arrange
    const user = userEvent.setup();
    const onDelete = jest.fn();

    renderPage({ customerTypeProp: customerType, onDelete });

    // Act
    await user.click(screen.getByTestId("show-more-button"));
    await user.click(screen.getByTestId("delete-customer-type"));

    // Assert
    expect(onDelete).toHaveBeenCalled();
  });

  it("calls onSetDefault from the cogs menu", async () => {
    // Arrange
    const user = userEvent.setup();
    const onSetDefault = jest.fn();

    renderPage({ customerTypeProp: customerType, onSetDefault });

    // Act
    await user.click(screen.getByTestId("show-more-button"));
    await user.click(screen.getByTestId("set-default-customer-type"));

    // Assert
    expect(onSetDefault).toHaveBeenCalled();
  });

  it("hides set as default and delete on the default customer type", async () => {
    // Arrange
    const user = userEvent.setup();

    renderPage({ customerTypeProp: defaultCustomerType });

    // Act
    await user.click(screen.getByTestId("show-more-button"));

    // Assert
    expect(screen.queryByTestId("set-default-customer-type")).not.toBeInTheDocument();
    expect(screen.queryByTestId("delete-customer-type")).not.toBeInTheDocument();
    expect(screen.getByTestId("customer-type-default-pill")).toBeInTheDocument();
  });
});
