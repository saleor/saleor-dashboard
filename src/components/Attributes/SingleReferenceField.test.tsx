import {
  AttributeEntityTypeEnum,
  AttributeInputTypeEnum,
  ProductErrorCode,
} from "@dashboard/graphql";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SingleReferenceField } from "./SingleReferenceField";
import { getErrorMessage } from "./utils";

jest.mock("./utils", () => {
  const actualUtils = jest.requireActual("./utils");

  return {
    ...actualUtils,
    getErrorMessage: jest.fn(error => error?.message || "Error occurred"),
  };
});

jest.mock("react-router-dom", () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: "/", search: "", hash: "", state: null }),
  useParams: () => ({}),
}));

describe("SingleReferenceField", () => {
  const defaultProps = {
    attribute: {
      id: "attr-1",
      label: "Test Attribute",
      value: [],
      data: {
        inputType: AttributeInputTypeEnum.SINGLE_REFERENCE,
        references: [],
        entityType: AttributeEntityTypeEnum.PRODUCT,
        isRequired: false,
        values: [],
      },
    },
    disabled: false,
    loading: false,
    error: undefined,
    onReferencesAddClick: jest.fn(),
    onReferencesRemove: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render Add button when no value is selected", () => {
    // Arrange & Act
    render(<SingleReferenceField {...defaultProps} />);

    // Assert
    const addButton = screen.getByTestId("single-ref-add");

    expect(addButton).toBeInTheDocument();
    expect(screen.queryByTestId("single-ref-edit")).not.toBeInTheDocument();
  });

  it("should render chip and Edit button when value is selected", () => {
    // Arrange
    const propsWithValue = {
      ...defaultProps,
      attribute: {
        ...defaultProps.attribute,
        value: ["val-1"],
        data: {
          ...defaultProps.attribute.data,
          references: [
            {
              label: "Selected Value",
              value: "val-1",
            },
          ],
        },
      },
    };

    // Act
    render(<SingleReferenceField {...propsWithValue} />);

    // Assert
    expect(screen.getByText("Selected Value")).toBeInTheDocument();

    const editButton = screen.getByTestId("single-ref-edit");

    expect(editButton).toBeInTheDocument();
    expect(screen.queryByTestId("single-ref-add")).not.toBeInTheDocument();
  });

  it("should call onReferencesAddClick when Add button is clicked", async () => {
    // Arrange
    const user = userEvent.setup();

    render(<SingleReferenceField {...defaultProps} />);

    // Act
    const addButton = screen.getByTestId("single-ref-add");

    await user.click(addButton);

    // Assert
    expect(defaultProps.onReferencesAddClick).toHaveBeenCalledWith(defaultProps.attribute);
  });

  it("should call onReferencesAddClick when Edit button is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const propsWithValue = {
      ...defaultProps,
      attribute: {
        ...defaultProps.attribute,
        value: ["val-1"],
        data: {
          ...defaultProps.attribute.data,
          references: [
            {
              label: "Selected Value",
              value: "val-1",
            },
          ],
        },
      },
    };

    render(<SingleReferenceField {...propsWithValue} />);

    // Act
    const editButton = screen.getByTestId("single-ref-edit");

    await user.click(editButton);

    // Assert
    expect(defaultProps.onReferencesAddClick).toHaveBeenCalledWith(propsWithValue.attribute);
  });

  it("should call onReferencesRemove when chip close button is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const propsWithValue = {
      ...defaultProps,
      attribute: {
        ...defaultProps.attribute,
        value: ["val-1"],
        data: {
          ...defaultProps.attribute.data,
          references: [
            {
              label: "Selected Value",
              value: "val-1",
            },
          ],
        },
      },
    };

    render(<SingleReferenceField {...propsWithValue} />);

    // Act
    const closeButton = screen.getByTestId("button-close");

    await user.click(closeButton);

    // Assert
    expect(defaultProps.onReferencesRemove).toHaveBeenCalledWith("attr-1", []);
  });

  it("should display error message when error is provided", () => {
    // Arrange
    const propsWithError = {
      ...defaultProps,
      error: {
        __typename: "ProductError" as const,
        code: ProductErrorCode.INVALID,
        field: "attribute",
        message: "Test error message",
        attributes: [],
      },
    };

    // Act
    render(<SingleReferenceField {...propsWithError} />);

    // Assert
    expect(screen.getByText("Test error message")).toBeInTheDocument();

    // Also verify that getErrorMessage was called with the error
    expect(getErrorMessage).toHaveBeenCalledWith(
      propsWithError.error,
      expect.objectContaining({ locale: "en" }),
    );

    // Add button should still be present
    expect(screen.getByTestId("single-ref-add")).toBeInTheDocument();
  });

  it("should disable buttons when disabled prop is true", () => {
    // Arrange
    const propsDisabled = {
      ...defaultProps,
      disabled: true,
    };

    // Act
    render(<SingleReferenceField {...propsDisabled} />);

    // Assert
    const addButton = screen.getByTestId("single-ref-add");

    expect(addButton).toBeDisabled();
  });
});
