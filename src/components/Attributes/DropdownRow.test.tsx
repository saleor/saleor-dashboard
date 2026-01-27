import {
  AttributeInputTypeEnum,
  AttributeValueFragment,
  ProductErrorCode,
  ProductErrorWithAttributesFragment,
} from "@dashboard/graphql";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AttributeInput } from "./Attributes";
import { DropdownRow } from "./DropdownRow";

global.IntersectionObserver = class IntersectionObserver {
  constructor() {}

  disconnect() {}

  observe() {}

  takeRecords() {
    return [];
  }

  unobserve() {}
} as any;

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
  const mockOnAttributeSelectBlur = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render dropdown with attribute label", () => {
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

    expect(screen.getByText("Color")).toBeInTheDocument();
  });

  it("should render all attribute value options", async () => {
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

    const combobox = screen.getByRole("combobox");

    await user.click(combobox);

    expect(screen.getByText("Red")).toBeInTheDocument();
    expect(screen.getByText("Blue")).toBeInTheDocument();
  });

  it("should call onChange when option is selected", async () => {
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

    const combobox = screen.getByRole("combobox");

    await user.click(combobox);
    await user.click(screen.getByText("Red"));

    expect(mockOnChange).toHaveBeenCalledWith("attr-1", "red");
  });

  it("should call onChange with empty string when selection is cleared", async () => {
    const user = userEvent.setup();
    const attributeWithValue: AttributeInput = {
      ...mockAttribute,
      value: ["red"],
    };

    render(
      <DropdownRow
        attribute={attributeWithValue}
        attributeValues={mockAttributeValues}
        disabled={false}
        error={undefined as any}
        onChange={mockOnChange}
        fetchAttributeValues={mockFetchAttributeValues}
        fetchMoreAttributeValues={mockFetchMoreAttributeValues}
      />,
    );

    const combobox = screen.getByRole("combobox");

    await user.clear(combobox);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith("attr-1", "");
    });
  });

  it("should display custom value option when user types new value", async () => {
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

    const combobox = screen.getByRole("combobox");

    await user.click(combobox);
    await user.type(combobox, "orange");

    await waitFor(() => {
      expect(screen.getByText(/Add new value.*orange/i)).toBeInTheDocument();
    });
  });

  it("should call onChange with custom value when custom option is selected", async () => {
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

    const combobox = screen.getByRole("combobox");

    await user.click(combobox);
    await user.type(combobox, "purple");

    const customOption = await screen.findByText(/Add new value.*purple/i);

    await user.click(customOption);

    expect(mockOnChange).toHaveBeenCalledWith("attr-1", "purple");
  });

  it("should debounce fetchAttributeValues calls when user types", async () => {
    jest.useFakeTimers();

    const user = userEvent.setup({ delay: null });

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

    const combobox = screen.getByRole("combobox");

    await user.click(combobox);
    await user.type(combobox, "o");
    await user.type(combobox, "r");
    await user.type(combobox, "a");

    expect(mockFetchAttributeValues).not.toHaveBeenCalled();

    jest.runAllTimers();

    await waitFor(() => {
      expect(mockFetchAttributeValues).toHaveBeenCalledWith("ora", "attr-1");
    });

    jest.useRealTimers();
  });

  it("should fetch attribute values on first focus", async () => {
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

    const combobox = screen.getByRole("combobox");

    await user.click(combobox);

    expect(mockFetchAttributeValues).toHaveBeenCalledWith("", "attr-1");
  });

  it("should call fetchMore when scrolled to bottom", async () => {
    const user = userEvent.setup();
    const fetchMoreWithHasMore = {
      ...mockFetchMoreAttributeValues,
      hasMore: true,
    };

    render(
      <DropdownRow
        attribute={mockAttribute}
        attributeValues={mockAttributeValues}
        disabled={false}
        error={undefined as any}
        onChange={mockOnChange}
        fetchAttributeValues={mockFetchAttributeValues}
        fetchMoreAttributeValues={fetchMoreWithHasMore}
      />,
    );

    const combobox = screen.getByRole("combobox");

    await user.click(combobox);

    const listbox = screen.getByRole("listbox");
    const scrollEvent = new Event("scroll", { bubbles: true });

    Object.defineProperty(listbox, "scrollTop", {
      value: 1000,
      writable: true,
    });
    Object.defineProperty(listbox, "scrollHeight", {
      value: 1100,
      writable: true,
    });
    Object.defineProperty(listbox, "clientHeight", { value: 100, writable: true });

    listbox.dispatchEvent(scrollEvent);

    await waitFor(() => {
      expect(fetchMoreWithHasMore.onFetchMore).toHaveBeenCalled();
    });
  });

  it("should call onAttributeSelectBlur when combobox loses focus", async () => {
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
        onAttributeSelectBlur={mockOnAttributeSelectBlur}
      />,
    );

    const combobox = screen.getByRole("combobox");

    await user.click(combobox);
    await user.tab();

    expect(mockOnAttributeSelectBlur).toHaveBeenCalled();
  });

  it("should display selected value from attribute.value", () => {
    const attributeWithValue: AttributeInput = {
      ...mockAttribute,
      value: ["red"],
    };

    render(
      <DropdownRow
        attribute={attributeWithValue}
        attributeValues={mockAttributeValues}
        disabled={false}
        error={undefined as any}
        onChange={mockOnChange}
        fetchAttributeValues={mockFetchAttributeValues}
        fetchMoreAttributeValues={mockFetchMoreAttributeValues}
      />,
    );

    expect(screen.getByDisplayValue("Red")).toBeInTheDocument();
  });

  it("should disable combobox when disabled prop is true", () => {
    render(
      <DropdownRow
        attribute={mockAttribute}
        attributeValues={mockAttributeValues}
        disabled={true}
        error={undefined as any}
        onChange={mockOnChange}
        fetchAttributeValues={mockFetchAttributeValues}
        fetchMoreAttributeValues={mockFetchMoreAttributeValues}
      />,
    );

    const combobox = screen.getByRole("combobox");

    expect(combobox).toBeDisabled();
  });

  it("should display error message when error prop is provided", () => {
    const error: ProductErrorWithAttributesFragment = {
      __typename: "ProductError",
      code: ProductErrorCode.INVALID,
      field: "attributes",
      message: "Invalid attribute value",
      attributes: ["attr-1"],
    };

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

    expect(screen.getByText("Invalid attribute value")).toBeInTheDocument();
  });

  it("should filter out attribute values with null slug", () => {
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

    expect(combobox).toBeInTheDocument();
  });

  it("should clear input value after selecting custom value", async () => {
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

    const combobox = screen.getByRole("combobox");

    await user.click(combobox);
    await user.type(combobox, "emerald");

    const customOption = await screen.findByText(/Add new value.*emerald/i);

    await user.click(customOption);

    await waitFor(() => {
      expect(combobox).toHaveValue("");
    });
  });
});
