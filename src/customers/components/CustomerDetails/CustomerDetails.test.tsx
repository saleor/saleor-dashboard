// @ts-strict-ignore
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { type ReactNode } from "react";
import { IntlProvider } from "react-intl";

import { customer } from "../../fixtures";
import CustomerDetails from "./CustomerDetails";

// Mock DashboardCard
jest.mock("@dashboard/components/Card", () => {
  const DashboardCard = ({ children }: { children: ReactNode }) => <div>{children}</div>;

  DashboardCard.displayName = "DashboardCard";

  const Header = ({ children }: { children: ReactNode }) => <div>{children}</div>;

  Header.displayName = "DashboardCard.Header";
  DashboardCard.Header = Header;

  const Title = ({ children }: { children: ReactNode }) => <div>{children}</div>;

  Title.displayName = "DashboardCard.Title";
  DashboardCard.Title = Title;

  const Content = ({ children }: { children: ReactNode }) => <div>{children}</div>;

  Content.displayName = "DashboardCard.Content";
  DashboardCard.Content = Content;

  return {
    DashboardCard,
    __esModule: true,
  };
});

// Mock TextField from Material-UI
jest.mock("@material-ui/core", () => ({
  TextField: ({ label, value, onChange, name, disabled, "data-test-id": testId }: any) => (
    <input
      data-test-id={testId}
      data-testid={testId}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={label}
    />
  ),
}));

// Mock Macaw UI components
jest.mock("@saleor/macaw-ui-next", () => ({
  Checkbox: ({
    checked,
    children,
    disabled,
    name,
    onCheckedChange,
    "data-test-id": testId,
  }: any) => (
    <label>
      <input
        type="checkbox"
        data-test-id={testId}
        data-testid={testId}
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={e => onCheckedChange(e.target.checked)}
      />
      <span>{children}</span>
    </label>
  ),
  Skeleton: () => <div data-testid="skeleton">Loading...</div>,
  Text: ({ children }: any) => <span>{children}</span>,
}));

jest.mock("@saleor/macaw-ui", () => ({
  makeStyles: () => () => ({}),
}));

const defaultProps = {
  customer: customer as any,
  data: {
    isActive: true,
    isConfirmed: true,
    note: "Test note",
  },
  disabled: false,
  errors: [],
  onChange: jest.fn(),
};

const Wrapper = ({ children }: { children: ReactNode }) => (
  <IntlProvider locale="en">{children}</IntlProvider>
);

Wrapper.displayName = "Wrapper";

describe("CustomerDetails", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders customer email correctly", () => {
    // Arrange & Act
    render(
      <Wrapper>
        <CustomerDetails {...defaultProps} />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByText(customer.email)).toBeInTheDocument();
  });

  it("renders isActive checkbox correctly", () => {
    // Arrange & Act
    render(
      <Wrapper>
        <CustomerDetails {...defaultProps} />
      </Wrapper>,
    );

    // Assert
    const checkbox = screen.getByTestId("customer-active-checkbox");

    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toBeChecked();
  });

  it("renders isConfirmed checkbox correctly", () => {
    // Arrange & Act
    render(
      <Wrapper>
        <CustomerDetails {...defaultProps} />
      </Wrapper>,
    );

    // Assert
    const checkbox = screen.getByTestId("customer-confirmed-checkbox");

    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toBeChecked();
  });

  it("shows isActive checkbox as unchecked when data.isActive is false", () => {
    // Arrange & Act
    render(
      <Wrapper>
        <CustomerDetails {...defaultProps} data={{ ...defaultProps.data, isActive: false }} />
      </Wrapper>,
    );

    // Assert
    const checkbox = screen.getByTestId("customer-active-checkbox");

    expect(checkbox).not.toBeChecked();
  });

  it("shows isConfirmed checkbox as unchecked when data.isConfirmed is false", () => {
    // Arrange & Act
    render(
      <Wrapper>
        <CustomerDetails {...defaultProps} data={{ ...defaultProps.data, isConfirmed: false }} />
      </Wrapper>,
    );

    // Assert
    const checkbox = screen.getByTestId("customer-confirmed-checkbox");

    expect(checkbox).not.toBeChecked();
  });

  it("calls onChange when isActive checkbox is toggled", async () => {
    // Arrange
    const onChangeMock = jest.fn();

    // Act
    render(
      <Wrapper>
        <CustomerDetails {...defaultProps} onChange={onChangeMock} />
      </Wrapper>,
    );

    const checkbox = screen.getByTestId("customer-active-checkbox");

    userEvent.click(checkbox);

    // Assert
    await waitFor(() => {
      expect(onChangeMock).toHaveBeenCalledWith({
        target: {
          name: "isActive",
          value: false,
        },
      });
    });
  });

  it("calls onChange when isConfirmed checkbox is toggled", async () => {
    // Arrange
    const onChangeMock = jest.fn();

    // Act
    render(
      <Wrapper>
        <CustomerDetails {...defaultProps} onChange={onChangeMock} />
      </Wrapper>,
    );

    const checkbox = screen.getByTestId("customer-confirmed-checkbox");

    userEvent.click(checkbox);

    // Assert
    await waitFor(() => {
      expect(onChangeMock).toHaveBeenCalledWith({
        target: {
          name: "isConfirmed",
          value: false,
        },
      });
    });
  });

  it("disables isActive checkbox when disabled prop is true", () => {
    // Arrange & Act
    render(
      <Wrapper>
        <CustomerDetails {...defaultProps} disabled={true} />
      </Wrapper>,
    );

    // Assert
    const checkbox = screen.getByTestId("customer-active-checkbox");

    expect(checkbox).toBeDisabled();
  });

  it("disables isConfirmed checkbox when disabled prop is true", () => {
    // Arrange & Act
    render(
      <Wrapper>
        <CustomerDetails {...defaultProps} disabled={true} />
      </Wrapper>,
    );

    // Assert
    const checkbox = screen.getByTestId("customer-confirmed-checkbox");

    expect(checkbox).toBeDisabled();
  });

  it("renders note field correctly", () => {
    // Arrange & Act
    render(
      <Wrapper>
        <CustomerDetails {...defaultProps} />
      </Wrapper>,
    );

    // Assert
    const noteField = screen.getByTestId("customer-note");

    expect(noteField).toBeInTheDocument();
    expect(noteField).toHaveValue("Test note");
  });

  it("calls onChange when note field is updated", async () => {
    // Arrange
    const onChangeMock = jest.fn();

    // Act
    render(
      <Wrapper>
        <CustomerDetails {...defaultProps} onChange={onChangeMock} />
      </Wrapper>,
    );

    const noteField = screen.getByTestId("customer-note");

    userEvent.type(noteField, " updated");

    // Assert
    await waitFor(() => {
      expect(onChangeMock).toHaveBeenCalled();
    });
  });

  it("renders form fields even when customer is null", () => {
    // Arrange & Act
    render(
      <Wrapper>
        <CustomerDetails {...defaultProps} customer={null} />
      </Wrapper>,
    );

    // Assert
    // Form fields should still be rendered
    expect(screen.getByTestId("customer-active-checkbox")).toBeInTheDocument();
    expect(screen.getByTestId("customer-confirmed-checkbox")).toBeInTheDocument();
    expect(screen.getByTestId("customer-note")).toBeInTheDocument();
  });

  it("renders date joined correctly", () => {
    // Arrange & Act
    render(
      <Wrapper>
        <CustomerDetails {...defaultProps} />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByText(/Active member since/i)).toBeInTheDocument();
  });

  it("does not call onChange when checkboxes are disabled", async () => {
    // Arrange
    const onChangeMock = jest.fn();

    // Act
    render(
      <Wrapper>
        <CustomerDetails {...defaultProps} disabled={true} onChange={onChangeMock} />
      </Wrapper>,
    );

    const activeCheckbox = screen.getByTestId("customer-active-checkbox");
    const confirmedCheckbox = screen.getByTestId("customer-confirmed-checkbox");

    userEvent.click(activeCheckbox);
    userEvent.click(confirmedCheckbox);

    // Assert
    await waitFor(() => {
      expect(onChangeMock).not.toHaveBeenCalled();
    });
  });
});
