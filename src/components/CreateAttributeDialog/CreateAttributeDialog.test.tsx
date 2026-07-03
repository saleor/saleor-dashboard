import { getAttributePageInitialForm } from "@dashboard/attributes/utils/attributePageForm";
import {
  AttributeEntityTypeEnum,
  AttributeInputTypeEnum,
  AttributeTypeEnum,
} from "@dashboard/graphql";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";

import { CreateAttributeDialog } from "./CreateAttributeDialog";

jest.mock("react-intl", () => ({
  FormattedMessage: ({ defaultMessage }: { defaultMessage: string }) => <>{defaultMessage}</>,
  useIntl: () => ({
    formatMessage: ({ defaultMessage }: { defaultMessage: string }) => defaultMessage,
  }),
  defineMessages: (messages: Record<string, unknown>) => messages,
}));

jest.mock("@dashboard/hooks/useModalDialogOpen", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@dashboard/attributes/utils/attributePageForm", () => {
  const actual = jest.requireActual("@dashboard/attributes/utils/attributePageForm");

  return {
    ...actual,
    getAttributePageInitialForm: jest.fn(actual.getAttributePageInitialForm),
  };
});

jest.mock("@dashboard/searches/useProductTypeSearch", () => ({
  __esModule: true,
  default: () => ({
    search: jest.fn(),
    loadMore: jest.fn(),
    result: { data: undefined, loading: false },
  }),
}));

jest.mock("@dashboard/searches/usePageTypeSearch", () => ({
  __esModule: true,
  default: () => ({
    search: jest.fn(),
    loadMore: jest.fn(),
    result: { data: undefined, loading: false },
  }),
}));

jest.mock("@dashboard/components/ModelType/ModelType", () => ({
  ModelTypeDisplay: ({ modelType }: { modelType: { name: string } }) => (
    <span>{modelType.name}</span>
  ),
}));

jest.mock("@dashboard/components/ProductType/ProductType", () => ({
  ProductTypeDisplay: ({ productType }: { productType: { name: string } }) => (
    <span>{productType.name}</span>
  ),
}));

const mockResetValues = jest.fn();

let mockValues: Array<{ name: string; value?: string | null }> = [];

jest.mock("@dashboard/attributes/hooks/useAttributeCreateValues/useAttributeCreateValues", () => ({
  useAttributeCreateValues: () => ({
    deleteValueById: jest.fn(),
    handleValueCreate: jest.fn(),
    handleValueReorder: jest.fn(),
    pageInfo: { hasNextPage: false, hasPreviousPage: false, startCursor: 0 },
    pageValues: mockValues,
    loadNextPage: jest.fn(),
    loadPreviousPage: jest.fn(),
    resetValues: mockResetValues,
    settings: { rowNumber: 10 },
    updateListSettings: jest.fn(),
    valueErrors: [],
    values: mockValues,
  }),
}));

jest.mock(
  "@dashboard/attributes/components/AttributeCreateFormContent/AttributeCreateFormContent",
  () => ({
    AttributeCreateFormContent: ({
      apiErrors,
      change,
      step,
    }: {
      apiErrors: Array<{ message?: string | null }>;
      change: (event: React.ChangeEvent<HTMLInputElement>) => void;
      step: 1 | 2;
    }) => (
      <>
        {apiErrors.length > 0 ? (
          <div data-test-id="create-attribute-api-errors">{apiErrors[0].message}</div>
        ) : null}
        {step === 1 ? (
          <input aria-label="Attribute name" name="name" onChange={change} />
        ) : (
          <div data-test-id="create-attribute-step-two">Step two</div>
        )}
      </>
    ),
  }),
);

const Wrapper = ({ children }: { children: ReactNode }): JSX.Element => (
  <ThemeProvider>{children}</ThemeProvider>
);

const defaultProps = {
  attributeType: AttributeTypeEnum.PAGE_TYPE,
  confirmButtonState: "default" as const,
  contextName: "Lookbook",
  disabled: false,
  errors: [],
  open: true,
  onClose: jest.fn(),
  onSubmit: jest.fn().mockResolvedValue([]),
};

describe("CreateAttributeDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockValues = [];
  });

  it("does not render the form when closed", () => {
    // Arrange & Act
    render(<CreateAttributeDialog {...defaultProps} open={false} />, { wrapper: Wrapper });

    // Assert
    expect(screen.queryByTestId("create-attribute-dialog")).not.toBeInTheDocument();
  });

  it("disables Next until the attribute name is provided", async () => {
    // Arrange
    render(<CreateAttributeDialog {...defaultProps} />, { wrapper: Wrapper });

    const user = userEvent.setup();

    // Assert
    expect(screen.getByTestId("create-attribute-next-button")).toBeDisabled();

    // Act
    await user.type(screen.getByLabelText("Attribute name"), "Material");

    // Assert
    expect(screen.getByTestId("create-attribute-next-button")).toBeEnabled();
  });

  it("moves to step two after Next is clicked", async () => {
    // Arrange
    render(<CreateAttributeDialog {...defaultProps} />, { wrapper: Wrapper });

    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText("Attribute name"), "Material");
    await user.click(screen.getByTestId("create-attribute-next-button"));

    // Assert
    expect(screen.getByTestId("create-attribute-step-two")).toBeInTheDocument();
    expect(screen.getByTestId("create-and-assign-attribute-button")).toBeInTheDocument();
  });

  it("disables Create and assign for value-based types without values", async () => {
    // Arrange
    render(<CreateAttributeDialog {...defaultProps} />, { wrapper: Wrapper });

    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText("Attribute name"), "Color");
    await user.click(screen.getByTestId("create-attribute-next-button"));

    // Assert
    expect(screen.getByTestId("create-and-assign-attribute-button")).toBeDisabled();
  });

  it("enables Create and assign when dedicated values exist", async () => {
    // Arrange
    mockValues = [{ name: "Red", value: "#ff0000" }];
    render(<CreateAttributeDialog {...defaultProps} />, { wrapper: Wrapper });

    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText("Attribute name"), "Color");
    await user.click(screen.getByTestId("create-attribute-next-button"));

    // Assert
    expect(screen.getByTestId("create-and-assign-attribute-button")).toBeEnabled();
  });

  it("enables Create and assign for reference types without reference type restrictions", async () => {
    // Arrange
    (getAttributePageInitialForm as jest.Mock).mockReturnValueOnce({
      availableInGrid: true,
      entityType: AttributeEntityTypeEnum.PRODUCT_VARIANT,
      filterableInDashboard: true,
      filterableInStorefront: true,
      inputType: AttributeInputTypeEnum.SINGLE_REFERENCE,
      metadata: [],
      name: "",
      privateMetadata: [],
      slug: "",
      storefrontSearchPosition: "",
      type: AttributeTypeEnum.PRODUCT_TYPE,
      valueRequired: true,
      visibleInStorefront: true,
      unit: undefined,
      referenceTypes: [],
    });

    render(
      <CreateAttributeDialog {...defaultProps} attributeType={AttributeTypeEnum.PRODUCT_TYPE} />,
      {
        wrapper: Wrapper,
      },
    );

    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText("Attribute name"), "Related variant");
    await user.click(screen.getByTestId("create-attribute-next-button"));

    // Assert
    expect(screen.getByTestId("create-and-assign-attribute-button")).toBeEnabled();
  });

  it("calls onClose from step one back action", async () => {
    // Arrange
    const onClose = jest.fn();

    render(<CreateAttributeDialog {...defaultProps} onClose={onClose} />, { wrapper: Wrapper });

    const user = userEvent.setup();

    // Act
    await user.click(screen.getByRole("button", { name: /back/i }));

    // Assert
    expect(onClose).toHaveBeenCalled();
  });

  it("returns to step one from step two back action", async () => {
    // Arrange
    mockValues = [{ name: "Red", value: "#ff0000" }];
    render(<CreateAttributeDialog {...defaultProps} />, { wrapper: Wrapper });

    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText("Attribute name"), "Color");
    await user.click(screen.getByTestId("create-attribute-next-button"));
    await user.click(screen.getByRole("button", { name: /back/i }));

    // Assert
    expect(screen.getByLabelText("Attribute name")).toBeInTheDocument();
    expect(screen.queryByTestId("create-attribute-step-two")).not.toBeInTheDocument();
  });

  it("submits attribute data with values on step two", async () => {
    // Arrange
    mockValues = [{ name: "Red", value: "#ff0000" }];

    const onSubmit = jest.fn().mockResolvedValue([]);

    render(<CreateAttributeDialog {...defaultProps} onSubmit={onSubmit} />, { wrapper: Wrapper });

    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText("Attribute name"), "Color");
    await user.click(screen.getByTestId("create-attribute-next-button"));
    await user.click(screen.getByTestId("create-and-assign-attribute-button"));

    // Assert
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        formData: expect.objectContaining({
          name: "Color",
          slug: "color",
          type: AttributeTypeEnum.PAGE_TYPE,
          inputType: AttributeInputTypeEnum.DROPDOWN,
        }),
        values: mockValues,
      }),
    );
  });

  it("displays submit errors returned from onSubmit", async () => {
    // Arrange
    mockValues = [{ name: "Red", value: "#ff0000" }];

    const onSubmit = jest.fn().mockResolvedValue([
      {
        __typename: "AttributeError",
        code: "INVALID",
        field: null,
        message: "This attribute is already assigned.",
      },
    ]);

    render(<CreateAttributeDialog {...defaultProps} onSubmit={onSubmit} />, { wrapper: Wrapper });

    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText("Attribute name"), "Color");
    await user.click(screen.getByTestId("create-attribute-next-button"));
    await user.click(screen.getByTestId("create-and-assign-attribute-button"));

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId("create-attribute-api-errors")).toHaveTextContent(
        "This attribute is already assigned.",
      );
    });
  });
});
