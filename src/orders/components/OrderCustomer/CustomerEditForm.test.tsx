import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { IntlProvider } from "react-intl";

import { CustomerEditForm } from "./CustomerEditForm";

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

jest.mock("@dashboard/components/Combobox", () => ({
  Combobox: ({ label, onChange, value, name, "data-test-id": testId }: any) => (
    <div>
      <label>{label}</label>
      <input
        data-test-id={testId}
        data-testid={testId}
        name={name}
        value={value.value}
        onChange={e => onChange({ target: { name, value: e.target.value } })}
      />
    </div>
  ),
}));

jest.mock("@dashboard/components/Form", () => ({
  __esModule: true,
  default: ({ children, initial }: any) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [data, setData] = useState(initial);
    const change = (event: React.ChangeEvent<HTMLInputElement>) => {
      setData({ ...data, [event.target.name]: event.target.value });
    };

    return <>{children({ change, data })}</>;
  },
}));

const defaultProps = {
  currentUser: { __typename: "User" as const, id: "user-1", email: "user@example.com" },
  currentUserEmail: "user@example.com",
  toggleEditMode: jest.fn(),
  setUserDisplayName: jest.fn(),
  userDisplayName: "user@example.com",
  loading: false,
  hasMore: false,
  onFetchMore: jest.fn(),
};

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <IntlProvider locale="en">{children}</IntlProvider>
);

describe("CustomerEditForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders search customers combobox", () => {
    // Arrange & Act
    render(
      <Wrapper>
        <CustomerEditForm {...defaultProps} />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByText("Search Customers")).toBeInTheDocument();
    expect(screen.getByTestId("select-customer")).toBeInTheDocument();
  });

  it("calls onCustomerEdit with email when email is entered", async () => {
    // Arrange
    const onCustomerEditMock = jest.fn();
    const toggleEditModeMock = jest.fn();

    // Act
    render(
      <Wrapper>
        <CustomerEditForm
          {...defaultProps}
          onCustomerEdit={onCustomerEditMock}
          toggleEditMode={toggleEditModeMock}
        />
      </Wrapper>,
    );

    const input = screen.getByTestId("select-customer");

    fireEvent.change(input, { target: { name: "query", value: "newemail@example.com" } });

    // Assert
    await waitFor(() => {
      expect(onCustomerEditMock).toHaveBeenCalledWith({
        prevUser: "user-1",
        prevUserEmail: "user@example.com",
        userEmail: "newemail@example.com",
      });
      expect(toggleEditModeMock).toHaveBeenCalled();
    });
  });

  it("calls onCustomerEdit with user ID when non-email is entered", async () => {
    // Arrange
    const onCustomerEditMock = jest.fn();
    const toggleEditModeMock = jest.fn();

    // Act
    render(
      <Wrapper>
        <CustomerEditForm
          {...defaultProps}
          onCustomerEdit={onCustomerEditMock}
          toggleEditMode={toggleEditModeMock}
        />
      </Wrapper>,
    );

    const input = screen.getByTestId("select-customer");

    fireEvent.change(input, { target: { name: "query", value: "user-id-123" } });

    // Assert
    await waitFor(() => {
      expect(onCustomerEditMock).toHaveBeenCalledWith({
        prevUser: "user-1",
        prevUserEmail: "user@example.com",
        user: "user-id-123",
      });
      expect(toggleEditModeMock).toHaveBeenCalled();
    });
  });

  it("does not call callbacks when value is empty", async () => {
    // Arrange
    const onCustomerEditMock = jest.fn();
    const toggleEditModeMock = jest.fn();

    // Act
    render(
      <Wrapper>
        <CustomerEditForm
          {...defaultProps}
          onCustomerEdit={onCustomerEditMock}
          toggleEditMode={toggleEditModeMock}
        />
      </Wrapper>,
    );

    const input = screen.getByTestId("select-customer");

    fireEvent.change(input, { target: { name: "query", value: "" } });

    // Assert
    await waitFor(() => {
      expect(onCustomerEditMock).not.toHaveBeenCalled();
      expect(toggleEditModeMock).not.toHaveBeenCalled();
    });
  });

  it("renders user choices when allUsers are provided", () => {
    // Arrange
    const users = [
      { id: "user-1", email: "user1@example.com" },
      { id: "user-2", email: "user2@example.com" },
    ] as any;

    // Act
    render(
      <Wrapper>
        <CustomerEditForm {...defaultProps} allUsers={users} />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByTestId("select-customer")).toBeInTheDocument();
  });

  it("passes fetch props correctly", () => {
    // Arrange
    const fetchUsersMock = jest.fn();
    const onFetchMoreMock = jest.fn();

    // Act
    render(
      <Wrapper>
        <CustomerEditForm
          {...defaultProps}
          fetchUsers={fetchUsersMock}
          onFetchMore={onFetchMoreMock}
          hasMore={true}
          loading={true}
        />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByTestId("select-customer")).toBeInTheDocument();
  });

  it("handles null currentUserEmail correctly", async () => {
    // Arrange
    const onCustomerEditMock = jest.fn();
    const toggleEditModeMock = jest.fn();

    // Act
    render(
      <Wrapper>
        <CustomerEditForm
          {...defaultProps}
          currentUserEmail={null}
          onCustomerEdit={onCustomerEditMock}
          toggleEditMode={toggleEditModeMock}
        />
      </Wrapper>,
    );

    const input = screen.getByTestId("select-customer");

    fireEvent.change(input, { target: { name: "query", value: "newemail@example.com" } });

    // Assert
    await waitFor(() => {
      expect(onCustomerEditMock).toHaveBeenCalledWith({
        prevUser: "user-1",
        prevUserEmail: undefined,
        userEmail: "newemail@example.com",
      });
    });
  });

  it("handles null currentUser correctly", async () => {
    // Arrange
    const onCustomerEditMock = jest.fn();
    const toggleEditModeMock = jest.fn();

    // Act
    render(
      <Wrapper>
        <CustomerEditForm
          {...defaultProps}
          currentUser={null}
          onCustomerEdit={onCustomerEditMock}
          toggleEditMode={toggleEditModeMock}
        />
      </Wrapper>,
    );

    const input = screen.getByTestId("select-customer");

    fireEvent.change(input, { target: { name: "query", value: "user-id-123" } });

    // Assert
    await waitFor(() => {
      expect(onCustomerEditMock).toHaveBeenCalledWith({
        prevUser: undefined,
        prevUserEmail: "user@example.com",
        user: "user-id-123",
      });
    });
  });
});
