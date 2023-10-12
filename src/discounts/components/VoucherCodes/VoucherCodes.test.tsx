import { ThemeProvider as LegacyThemeProvider } from "@saleor/macaw-ui";
import { ThemeProvider } from "@saleor/macaw-ui/next";
import { render, screen, waitFor } from "@testing-library/react";
import React, { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";

import { VoucherCodes } from "./VoucherCodes";

jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  defineMessages: jest.fn(x => x),
  FormattedMessage: ({ defaultMessage }) => <>{defaultMessage}</>,
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

const prep = () => {
  // Datagrid reads clientWidth and clientHeight from the scroller element
  // and use those values to set canvas size
  const scroller = document.getElementsByClassName("dvn-scroller").item(0);
  if (scroller !== null) {
    jest.spyOn(scroller, "clientWidth", "get").mockImplementation(() => 1000);
    jest.spyOn(scroller, "clientHeight", "get").mockImplementation(() => 1000);
  }
};

// Datagrid use ResizeObserver to detect changes in canvas size
global.ResizeObserver = jest.fn().mockImplementation(callback => ({
  observe: jest.fn(() =>
    // eslint-disable-next-line n/no-callback-literal
    callback([{ contentRect: { height: 1000, width: 1000 } }]),
  ),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe("VoucherCodes", () => {
  it("should render empty datagrid", () => {
    render(
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
      />,
      { wrapper: Wrapper },
    );
    prep();

    expect(screen.getByText(/^voucher codes$/i)).toBeInTheDocument();
    expect(screen.getByText(/^no voucher codes found$/i)).toBeInTheDocument();
  });

  it("should render datagrid with voucher codes", async () => {
    const { container } = render(
      <VoucherCodes
        codes={[
          { code: "Code 1", isActive: true, used: 0 },
          { code: "Code 2", isActive: true, used: 0 },
          { code: "Code 3", isActive: true, used: 0 },
          { code: "Code 4", isActive: false, used: 0 },
        ]}
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
      />,
      { wrapper: Wrapper },
    );
    prep();
    await waitFor(() => {
      const canvas = container.querySelector(
        '[data-testid="data-grid-canvas"]',
      );
      const datagridTable = canvas.querySelector("table");
      screen.debug();
      expect(canvas).toBeInTheDocument();
      expect(datagridTable).toBeInTheDocument();
    });
  });
});
