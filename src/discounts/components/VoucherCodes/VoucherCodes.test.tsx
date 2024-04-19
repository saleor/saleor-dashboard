import {
  mockResizeObserver,
  prepareDatagridScroller,
} from "@dashboard/components/Datagrid/testUtils";
import { ThemeProvider as LegacyThemeProvider } from "@saleor/macaw-ui";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { ReactNode } from "react";
import { FormattedMessageProps } from "react-intl";
import { BrowserRouter } from "react-router-dom";

import { VoucherCode } from "../VoucherCodesDatagrid/types";
import { VoucherCodes, VoucherCodesProps } from "./VoucherCodes";

jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  defineMessages: jest.fn(x => x),
  FormattedMessage: ({ defaultMessage }: FormattedMessageProps) => <>{defaultMessage}</>,
}));

const Wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <BrowserRouter>
      <LegacyThemeProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </LegacyThemeProvider>
    </BrowserRouter>
  );
};
const renderVoucherCodes = (props: Partial<VoucherCodesProps>) => {
  const results = render(
    <VoucherCodes
      codes={[]}
      loading={false}
      onCustomCodeGenerate={jest.fn()}
      onDeleteCodes={jest.fn()}
      onMultiCodesGenerate={jest.fn()}
      onSelectVoucherCodesIds={jest.fn()}
      onSettingsChange={jest.fn()}
      voucherCodesPagination={{
        loadNextPage: jest.fn(),
        loadPreviousPage: jest.fn(),
        paginatorType: "click",
        pageInfo: {
          endCursor: "",
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: "",
        },
      }}
      selectedCodesIds={[]}
      settings={{ rowNumber: 10 }}
      {...props}
    />,
    { wrapper: Wrapper },
  );

  prepareDatagridScroller();

  return results;
};
const codes: VoucherCode[] = [
  { code: "Code 1", isActive: true, used: 0 },
  { code: "Code 2", isActive: true, used: 0 },
  { code: "Code 3", isActive: true, used: 0 },
  { code: "Code 4", isActive: false, used: 0 },
];

beforeAll(() => {
  mockResizeObserver();
});
describe("VoucherCodes", () => {
  it("should render empty datagrid when no voucher codes", () => {
    // Arrange & Act
    renderVoucherCodes({});
    // Assert
    expect(screen.getByText(/^voucher codes$/i)).toBeInTheDocument();
    expect(screen.getByText(/^no voucher codes found$/i)).toBeInTheDocument();
  });
  it("should render datagrid with voucher codes", async () => {
    // Arrange & Act
    renderVoucherCodes({
      codes,
    });
    // Assert
    await waitFor(() => {
      expect(screen.getByText(/^code 1$/i)).toBeInTheDocument();
      expect(screen.getByText(/^code 2$/i)).toBeInTheDocument();
      expect(screen.getByText(/^code 3$/i)).toBeInTheDocument();
      expect(screen.getByText(/^code 4$/i)).toBeInTheDocument();
    });
  });
  it("should render spinner when loading", () => {
    // Arrange & Act
    renderVoucherCodes({ loading: true });
    // Assert
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
  it("should not allow to delete selected codes when contains saved codes", async () => {
    // Arrange & Act
    const onDeleteCodes = jest.fn();

    renderVoucherCodes({
      onDeleteCodes,
      codes,
      selectedCodesIds: ["Code 1", "Code 2"],
    });

    const deleteButton = screen.getByTestId("bulk-delete-button");

    // Assert
    expect(deleteButton).toBeDisabled();
  });
  it("should  allow to delete selected codes when selected only draft codes", async () => {
    // Arrange
    const onDeleteCodes = jest.fn();

    renderVoucherCodes({
      onDeleteCodes,
      codes: [
        ...codes,
        { code: "Manual code 1", status: "Draft" },
        { code: "Manual code 2", status: "Draft" },
        { code: "Manual code 3", status: "Draft" },
      ],
      selectedCodesIds: ["Manual code 1", "Manual code 1"],
    });

    const deleteButton = screen.getByTestId("bulk-delete-button");

    // Act
    await act(async () => {
      await userEvent.click(deleteButton);
    });
    // Assert
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(
      await screen.findByText(/are you sure you want to delete these voucher codes?/i),
    ).toBeInTheDocument();
    // Act
    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: /delete/i }));
    });
    // Assert
    expect(onDeleteCodes).toBeCalled();
  });
  it("should allow to generate custom code", async () => {
    // Arrange & Act
    const onCustomCodeGenerate = jest.fn();

    renderVoucherCodes({
      onCustomCodeGenerate,
    });

    const addCodeButton = screen.getByRole("button", { name: /add code/i });

    // Act
    await act(async () => {
      await userEvent.click(addCodeButton);
    });
    await waitFor(() => {
      expect(screen.getByText(/^manual$/i)).toBeInTheDocument();
    });
    // Act
    await act(async () => {
      await userEvent.click(screen.getByText(/^manual$/i));
    });
    // Assert
    expect(await screen.findByText(/^enter voucher code$/i)).toBeInTheDocument();
    // Act
    await userEvent.type(screen.getByRole("input"), "Test code");
    await userEvent.click(screen.getByRole("button", { name: /confirm/i }));
    // Assert
    expect(onCustomCodeGenerate).toBeCalledWith("Test code");
  });
  it("should allow to generate multiple code", async () => {
    // Arrange & Act
    const onMultiCodesGenerate = jest.fn();

    renderVoucherCodes({
      onMultiCodesGenerate,
    });

    const addButton = screen.getByRole("button", { name: /add code/i });

    // Act
    await act(async () => {
      await userEvent.click(addButton);
    });
    // Assert
    expect(await screen.findByText(/^auto-generate codes$/i)).toBeInTheDocument();
    // Act
    await act(async () => {
      await userEvent.click(screen.getByText(/^auto-generate codes$/i));
    });
    // Assert
    expect(await screen.findByText(/^generate Voucher Codes$/i)).toBeInTheDocument();
    // Act
    await userEvent.type(screen.getByRole("input", { name: /^code quantity/i }), "10");
    await userEvent.type(screen.getByRole("input", { name: /^code prefix/i }), "PREFIX");
    await userEvent.click(screen.getByRole("button", { name: /confirm/i }));
    // Assert
    expect(onMultiCodesGenerate).toBeCalledWith({
      quantity: "10",
      prefix: "PREFIX",
    });
  });
  it("should allow to  load next page", async () => {
    // Arrange & Act
    const loadNextPage = jest.fn();

    renderVoucherCodes({
      voucherCodesPagination: {
        loadNextPage,
        loadPreviousPage: jest.fn(),
        paginatorType: "click",
        pageInfo: {
          endCursor: "",
          hasNextPage: true,
          hasPreviousPage: false,
          startCursor: "",
        },
      },
    });
    // Assert
    expect(screen.getByTestId("button-pagination-next")).toBeEnabled();
    expect(screen.getByTestId("button-pagination-back")).toBeDisabled();
    // Act
    await act(async () => {
      await userEvent.click(screen.getByTestId("button-pagination-next"));
    });
    // Assert
    expect(loadNextPage).toBeCalled();
  });
  it("should allow to load previous page", async () => {
    // Arrange & Act
    const loadPreviousPage = jest.fn();

    renderVoucherCodes({
      voucherCodesPagination: {
        loadNextPage: jest.fn(),
        loadPreviousPage,
        paginatorType: "click",
        pageInfo: {
          endCursor: "",
          hasNextPage: false,
          hasPreviousPage: true,
          startCursor: "",
        },
      },
    });
    // Assert
    expect(screen.getByTestId("button-pagination-back")).toBeEnabled();
    expect(screen.getByTestId("button-pagination-next")).toBeDisabled();
    // Act
    await act(async () => {
      await userEvent.click(screen.getByTestId("button-pagination-back"));
    });
    // Assert
    expect(loadPreviousPage).toBeCalled();
  });
});
