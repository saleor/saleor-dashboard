import {
  AttributeInputTypeEnum,
  AttributeValueFragment,
  ProductErrorCode,
  ProductErrorWithAttributesFragment,
} from "@dashboard/graphql";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AttributeInput } from "./Attributes";
import { DropdownRow } from "./DropdownRow";

// Mock IntersectionObserver for DynamicCombobox
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}

  disconnect() {}

  observe() {}

  takeRecords() {
    return [];
  }

  unobserve() {}
} as any;

jest.mock("react-intl", () => {
  const actual = jest.requireActual("react-intl");

  return {
    ...actual,
    useIntl: () => ({
      formatMessage: ({ defaultMessage }: { defaultMessage: string }) => defaultMessage,
    }),
  };
});

jest.mock("./utils", () => ({
  getErrorMessage: (error: any) => error?.message || "",
  getSingleDisplayValue: (attribute: any, values: any[]) => {
    const value = attribute.value[0];

    return values.find(v => v.slug === value)?.name || value || "";
  },
}));

const mockAttribute: AttributeInput = {
  data: {
    entityType: undefined,
    inputType: AttributeInputTypeEnum.DROPDOWN,
    isRequired: false,
    values: [],
    selectedValues: [],
    unit: null,
  },
  id: "attr-1",
  label: "Color",
  value: [],
};

const mockAttributeValues: AttributeValueFragment[] = [
  {
    __typename: "AttributeValue",
    id: "val-1",
    name: "Red",
    slug: "red",
    reference: null,
    boolean: null,
    date: null,
    dateTime: null,
    file: null,
    value: null,
  },
  {
    __typename: "AttributeValue",
    id: "val-2",
    name: "Blue",
    slug: "blue",
    reference: null,
    boolean: null,
    date: null,
    dateTime: null,
    file: null,
    value: null,
  },
];

describe("DropdownRow", () => {
  const mockOnChange = jest.fn();
  const mockFetchAttributeValues = jest.fn();
  const mockFetchMoreAttributeValues = {
    hasMore: false,
    loading: false,
    onFetchMore: jest.fn(),
    totalCount: 2,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render dropdown with attribute label", () => {
    // Arrange & Act
    render(
      <DropdownRow
        attribute={mockAttribute}
        attributeValues={mockAttributeValues}
        disabled={false}
        error={undefined as any}
        onChange={mockOnChange}
        fetchAttributeValues={mockFetchAttributeValues}
        fetchMoreAttributeValues={mockFetchMoreAttributeValues}
      />,
    );

    // Assert
    expect(screen.getByText("Color")).toBeInTheDocument();
  });

  it("should render attribute value options when opened", async () => {
    // Arrange
    const user = userEvent.setup();

    render(
      <DropdownRow
        attribute={mockAttribute}
        attributeValues={mockAttributeValues}
        disabled={false}
        error={undefined as any}
        onChange={mockOnChange}
        fetchAttributeValues={mockFetchAttributeValues}
        fetchMoreAttributeValues={mockFetchMoreAttributeValues}
      />,
    );

    // Act
    const combobox = screen.getByRole("combobox");

    await user.click(combobox);

    // Assert
    expect(screen.getByText("Red")).toBeInTheDocument();
    expect(screen.getByText("Blue")).toBeInTheDocument();
  });

  it("should call onChange with slug when option is selected", async () => {
    // Arrange
    const user = userEvent.setup();

    render(
      <DropdownRow
        attribute={mockAttribute}
        attributeValues={mockAttributeValues}
        disabled={false}
        error={undefined as any}
        onChange={mockOnChange}
        fetchAttributeValues={mockFetchAttributeValues}
        fetchMoreAttributeValues={mockFetchMoreAttributeValues}
      />,
    );

    // Act
    const combobox = screen.getByRole("combobox");

    await user.click(combobox);
    await user.click(screen.getByText("Red"));

    // Assert - our handleOnChange passes attribute.id and slug value
    expect(mockOnChange).toHaveBeenCalledWith("attr-1", "red");
  });

  it("should display error message when error prop is provided", () => {
    // Arrange
    const error: ProductErrorWithAttributesFragment = {
      __typename: "ProductError",
      code: ProductErrorCode.INVALID,
      field: "attributes",
      message: "Invalid attribute value",
      attributes: ["attr-1"],
    };

    // Act
    render(
      <DropdownRow
        attribute={mockAttribute}
        attributeValues={mockAttributeValues}
        disabled={false}
        error={error}
        onChange={mockOnChange}
        fetchAttributeValues={mockFetchAttributeValues}
        fetchMoreAttributeValues={mockFetchMoreAttributeValues}
      />,
    );

    // Assert
    expect(screen.getByText("Invalid attribute value")).toBeInTheDocument();
  });

  it("should filter out attribute values with null slug", async () => {
    // Arrange
    const user = userEvent.setup();
    const valuesWithNull: AttributeValueFragment[] = [
      ...mockAttributeValues,
      {
        __typename: "AttributeValue",
        id: "val-3",
        name: "Green",
        slug: null,
        reference: null,
        boolean: null,
        date: null,
        dateTime: null,
        file: null,
        value: null,
      } as AttributeValueFragment,
    ];

    // Act
    render(
      <DropdownRow
        attribute={mockAttribute}
        attributeValues={valuesWithNull}
        disabled={false}
        error={undefined as any}
        onChange={mockOnChange}
        fetchAttributeValues={mockFetchAttributeValues}
        fetchMoreAttributeValues={mockFetchMoreAttributeValues}
      />,
    );

    const combobox = screen.getByRole("combobox");

    await user.click(combobox);

    // Assert
    expect(screen.getByText("Red")).toBeInTheDocument();
    expect(screen.getByText("Blue")).toBeInTheDocument();
    expect(screen.queryByText("Green")).not.toBeInTheDocument();
  });
});
