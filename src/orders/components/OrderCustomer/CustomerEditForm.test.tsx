import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { IntlProvider } from "react-intl";

import { CustomerEditForm } from "./CustomerEditForm";

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

jest.mock("@saleor/macaw-ui-next", () => ({
  DynamicCombobox: ({
    label,
    onChange,
    onInputValueChange,
    onFocus,
    options,
    "data-test-id": testId,
  }: any) => (
    <div>
      <label>{label}</label>
      <input
        data-test-id={testId}
        data-testid={testId}
        onFocus={onFocus}
        onChange={e => {
          onInputValueChange?.(e.target.value);
        }}
      />
      <ul data-test-id="options-list">
        {(options || []).map((opt: any) => (
          <li key={opt.value} data-test-id={`option-${opt.value}`} onClick={() => onChange?.(opt)}>
            {opt.label}
          </li>
        ))}
      </ul>
    </div>
  ),
}));

const defaultProps = {
  currentUser: { __typename: "User" as const, id: "user-1", email: "user@example.com" },
  currentUserEmail: "user@example.com",
  toggleEditMode: jest.fn(),
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

  it("calls onCustomerEdit with email when email option is selected", async () => {
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

    fireEvent.change(input, { target: { value: "newemail@example.com" } });

    // Assert - "Use email" option should appear
    await waitFor(() => {
      expect(screen.getByTestId("option-newemail@example.com")).toBeInTheDocument();
    });

    // Act - click the "Use email" option
    fireEvent.click(screen.getByTestId("option-newemail@example.com"));

    // Assert
    expect(onCustomerEditMock).toHaveBeenCalledWith({
      prevUser: "user-1",
      prevUserEmail: "user@example.com",
      userEmail: "newemail@example.com",
    });
    expect(toggleEditModeMock).toHaveBeenCalled();
  });

  it("calls onCustomerEdit with user ID when existing user is selected", async () => {
    // Arrange
    const onCustomerEditMock = jest.fn();
    const toggleEditModeMock = jest.fn();
    const users = [
      { id: "user-2", email: "user2@example.com" },
      { id: "user-3", email: "user3@example.com" },
    ] as any;

    // Act
    render(
      <Wrapper>
        <CustomerEditForm
          {...defaultProps}
          allUsers={users}
          onCustomerEdit={onCustomerEditMock}
          toggleEditMode={toggleEditModeMock}
        />
      </Wrapper>,
    );

    // Act - click an existing user option
    fireEvent.click(screen.getByTestId("option-user-2"));

    // Assert
    expect(onCustomerEditMock).toHaveBeenCalledWith({
      prevUser: "user-1",
      prevUserEmail: "user@example.com",
      user: "user-2",
    });
    expect(toggleEditModeMock).toHaveBeenCalled();
  });

  it("does not call callbacks when null option is selected", () => {
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

    // Assert - no options to click, no callbacks should fire
    expect(onCustomerEditMock).not.toHaveBeenCalled();
    expect(toggleEditModeMock).not.toHaveBeenCalled();
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
    expect(screen.getByTestId("option-user-1")).toHaveTextContent("user1@example.com");
    expect(screen.getByTestId("option-user-2")).toHaveTextContent("user2@example.com");
  });

  it("shows 'Use email' option when input contains @ and no exact match", async () => {
    // Arrange
    const users = [{ id: "user-1", email: "existing@example.com" }] as any;

    // Act
    render(
      <Wrapper>
        <CustomerEditForm {...defaultProps} allUsers={users} />
      </Wrapper>,
    );

    const input = screen.getByTestId("select-customer");

    fireEvent.change(input, { target: { value: "new@example.com" } });

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId("option-new@example.com")).toHaveTextContent(
        "Use email: new@example.com",
      );
    });
  });

  it("does not show 'Use email' option when input exactly matches existing user", async () => {
    // Arrange
    const users = [{ id: "user-1", email: "existing@example.com" }] as any;

    // Act
    render(
      <Wrapper>
        <CustomerEditForm {...defaultProps} allUsers={users} />
      </Wrapper>,
    );

    const input = screen.getByTestId("select-customer");

    fireEvent.change(input, { target: { value: "existing@example.com" } });

    // Assert - should only have the existing user option, not a "Use email" option
    await waitFor(() => {
      const optionsList = screen.getByTestId("options-list");
      const options = optionsList.querySelectorAll("li");

      expect(options).toHaveLength(1);
      expect(options[0]).toHaveTextContent("existing@example.com");
    });
  });

  it("handles null currentUserEmail correctly", () => {
    // Arrange
    const onCustomerEditMock = jest.fn();
    const toggleEditModeMock = jest.fn();
    const users = [{ id: "user-2", email: "user2@example.com" }] as any;

    // Act
    render(
      <Wrapper>
        <CustomerEditForm
          {...defaultProps}
          currentUserEmail={null}
          allUsers={users}
          onCustomerEdit={onCustomerEditMock}
          toggleEditMode={toggleEditModeMock}
        />
      </Wrapper>,
    );

    fireEvent.click(screen.getByTestId("option-user-2"));

    // Assert
    expect(onCustomerEditMock).toHaveBeenCalledWith({
      prevUser: "user-1",
      prevUserEmail: undefined,
      user: "user-2",
    });
  });

  it("handles null currentUser correctly", () => {
    // Arrange
    const onCustomerEditMock = jest.fn();
    const toggleEditModeMock = jest.fn();
    const users = [{ id: "user-2", email: "user2@example.com" }] as any;

    // Act
    render(
      <Wrapper>
        <CustomerEditForm
          {...defaultProps}
          currentUser={null}
          allUsers={users}
          onCustomerEdit={onCustomerEditMock}
          toggleEditMode={toggleEditModeMock}
        />
      </Wrapper>,
    );

    fireEvent.click(screen.getByTestId("option-user-2"));

    // Assert
    expect(onCustomerEditMock).toHaveBeenCalledWith({
      prevUser: undefined,
      prevUserEmail: "user@example.com",
      user: "user-2",
    });
  });
});
