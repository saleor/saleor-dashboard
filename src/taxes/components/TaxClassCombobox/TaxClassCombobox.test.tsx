import { type TaxClassBaseFragment } from "@dashboard/graphql";
import { taxesMessages } from "@dashboard/taxes/messages";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ComponentProps, type ReactNode } from "react";
import { IntlProvider } from "react-intl";

import { TaxClassCombobox } from "./TaxClassCombobox";

jest.mock("@saleor/macaw-ui-next", () => {
  const actual = jest.requireActual("@saleor/macaw-ui-next");

  return {
    ...actual,
    DynamicCombobox: ({
      value,
      options,
      onChange,
      label,
    }: {
      value: { label: string; value: string } | null;
      options: Array<{ label: string; value: string }>;
      onChange: (value: { label: string; value: string } | null) => void;
      label: ReactNode;
    }) => (
      <div>
        <span>{label}</span>
        <span data-test-id="tax-class-selected">{value?.label}</span>
        <ul>
          {options.map(option => (
            <li key={option.value || "none"}>
              <button type="button" onClick={() => onChange(option)}>
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    ),
  };
});

const taxClasses: TaxClassBaseFragment[] = [
  {
    __typename: "TaxClass",
    id: "tax-1",
    name: "Standard",
  },
];

const fetchMore = {
  hasMore: false,
  loading: false,
  onFetchMore: jest.fn(),
};

const renderCombobox = (props: Partial<ComponentProps<typeof TaxClassCombobox>> = {}) =>
  render(
    <IntlProvider
      locale="en"
      messages={{
        llKwCf: "None",
        xE38Jf: "Product type default",
        bDBiac: "Tax class",
      }}
    >
      <TaxClassCombobox
        value=""
        displayName=""
        taxClasses={taxClasses}
        onChange={jest.fn()}
        onFetchMore={fetchMore}
        {...props}
      />
    </IntlProvider>,
  );

describe("TaxClassCombobox", () => {
  it("includes None as the first option and shows it when empty", () => {
    // Arrange & Act
    renderCombobox();

    // Assert
    expect(screen.getByTestId("tax-class-selected")).toHaveTextContent("None");
    expect(screen.getByRole("button", { name: "None" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Standard" })).toBeInTheDocument();
  });

  it("can use product type default as the empty option label", () => {
    // Arrange & Act
    renderCombobox({
      emptyOptionMessage: taxesMessages.taxClassProductTypeDefault,
    });

    // Assert
    expect(screen.getByTestId("tax-class-selected")).toHaveTextContent("Product type default");
    expect(screen.getByRole("button", { name: "Product type default" })).toBeInTheDocument();
  });

  it("selects the empty option to unset the tax class", async () => {
    // Arrange
    const user = userEvent.setup();
    const onChange = jest.fn();

    renderCombobox({
      value: "tax-1",
      displayName: "Standard",
      onChange,
    });

    // Act
    await user.click(screen.getByRole("button", { name: "None" }));

    // Assert
    expect(onChange).toHaveBeenCalledWith({
      target: {
        name: "taxClassId",
        value: "",
      },
    });
  });
});
