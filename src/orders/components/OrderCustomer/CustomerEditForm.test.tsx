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

jest.mock("@saleor/macaw-ui-next", () => ({
  DynamicCombobox: ({
    label,
    onChange,
    onInputValueChange,
    onFocus,
    options,
    value,
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
      {value ? <div data-test-id="selected-value">{value.value}</div> : null}
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
  value: null,
  onChange: jest.fn(),
  loading: false,
  hasMore: false,
  onFetchMore: jest.fn(),
};

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <IntlProvider locale="en">{children}</IntlProvider>
);

const CustomerEditFormHarness = (
  props: Partial<React.ComponentProps<typeof CustomerEditForm>> = {},
) => {
  const [value, setValue] = useState<React.ComponentProps<typeof CustomerEditForm>["value"]>(null);

  return (
    <CustomerEditForm
      {...defaultProps}
      {...props}
      value={props.value ?? value}
      onChange={props.onChange ?? setValue}
    />
  );
};

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

  it("updates selected value when an email option is chosen", async () => {
    // Arrange // Act
    render(
      <Wrapper>
        <CustomerEditFormHarness />
      </Wrapper>,
    );

    fireEvent.change(screen.getByTestId("select-customer"), {
      target: { value: "newemail@example.com" },
    });

    await waitFor(() => {
      expect(screen.getByTestId("option-newemail@example.com")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("option-newemail@example.com"));

    // Assert
    expect(screen.getByTestId("selected-value")).toHaveTextContent("newemail@example.com");
  });

  it("updates selected value when an existing user is chosen", () => {
    // Arrange
    const users = [
      { id: "user-2", email: "user2@example.com" },
      { id: "user-3", email: "user3@example.com" },
    ] as any;

    // Act
    render(
      <Wrapper>
        <CustomerEditFormHarness allUsers={users} />
      </Wrapper>,
    );

    fireEvent.click(screen.getByTestId("option-user-2"));

    // Assert
    expect(screen.getByTestId("selected-value")).toHaveTextContent("user-2");
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

    fireEvent.change(screen.getByTestId("select-customer"), {
      target: { value: "new@example.com" },
    });

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

    fireEvent.change(screen.getByTestId("select-customer"), {
      target: { value: "existing@example.com" },
    });

    // Assert
    await waitFor(() => {
      const optionsList = screen.getByTestId("options-list");
      const options = optionsList.querySelectorAll("li");

      expect(options).toHaveLength(1);
      expect(options[0]).toHaveTextContent("existing@example.com");
    });
  });
});
