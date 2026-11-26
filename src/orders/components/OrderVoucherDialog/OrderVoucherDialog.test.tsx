import { MockedProvider, type MockedResponse } from "@apollo/client/testing";
import { Locale, RawLocaleProvider } from "@dashboard/components/Locale/Locale";
import { OrderErrorCode, type OrderErrorFragment } from "@dashboard/graphql";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { render, type RenderResult, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ReactNode } from "react";
import { IntlProvider } from "react-intl";

import {
  shippingVoucher,
  summerVoucher,
  voucherCode,
  voucherCodesMock,
  welcomeVoucher,
} from "./fixtures";
import { OrderVoucherDialog, type VoucherInputMode } from "./OrderVoucherDialog";

// DynamicCombobox uses IntersectionObserver for infinite scroll.
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

const pickerMode: VoucherInputMode = {
  kind: "picker",
  vouchers: [summerVoucher, welcomeVoucher, shippingVoucher],
  onSearch: jest.fn(),
  fetchMore: { loading: false, hasMore: false, onFetchMore: jest.fn() },
};

const manualMode: VoucherInputMode = { kind: "manual" };

const invalidCodeError: OrderErrorFragment = {
  __typename: "OrderError",
  code: OrderErrorCode.INVALID_VOUCHER_CODE,
  field: "voucherCode",
  addressType: null,
  message: "Voucher code is invalid.",
  orderLines: null,
  variants: null,
};

const renderDialog = ({
  mode,
  mocks = [],
  onSubmit = jest.fn(),
  errors = [],
}: {
  mode: VoucherInputMode;
  mocks?: MockedResponse[];
  onSubmit?: (voucherCode: string) => void;
  errors?: OrderErrorFragment[];
}): RenderResult => {
  const Wrapper = ({ children }: { children: ReactNode }): ReactNode => (
    <MockedProvider mocks={mocks}>
      <IntlProvider defaultLocale={Locale.EN} locale={Locale.EN}>
        <RawLocaleProvider value={{ locale: Locale.EN, setLocale: () => undefined }}>
          <ThemeProvider>{children}</ThemeProvider>
        </RawLocaleProvider>
      </IntlProvider>
    </MockedProvider>
  );

  return render(
    <OrderVoucherDialog
      open
      mode={mode}
      currentCode={null}
      confirmButtonState="default"
      errors={errors}
      onClose={jest.fn()}
      onSubmit={onSubmit}
    />,
    { wrapper: Wrapper },
  );
};

const pickVoucher = async (
  user: ReturnType<typeof userEvent.setup>,
  name: string,
): Promise<void> => {
  await user.click(screen.getByTestId("voucher-picker"));
  await user.click(screen.getByText(name));
};

describe("OrderVoucherDialog", () => {
  it("lists vouchers with a discount summary", async () => {
    // Arrange
    const user = userEvent.setup();

    renderDialog({ mode: pickerMode });

    // Act
    await user.click(screen.getByTestId("voucher-picker"));

    // Assert
    expect(screen.getByText("10% off")).toBeInTheDocument();
    expect(screen.getByText("$5.00 off")).toBeInTheDocument();
    expect(screen.getByText("Free shipping")).toBeInTheDocument();
  });

  it("applies the first active code of the picked voucher", async () => {
    // Arrange
    const onSubmit = jest.fn();
    const user = userEvent.setup();

    renderDialog({
      mode: pickerMode,
      onSubmit,
      mocks: [
        voucherCodesMock({
          voucherId: summerVoucher.id,
          codes: [
            voucherCode("SUMMER-OLD", { isActive: false }),
            voucherCode("SUMMER10", { used: 4 }),
            voucherCode("SUMMER20"),
          ],
        }),
      ],
    });

    // Act
    await pickVoucher(user, "Summer sale");

    // Assert
    expect(screen.getByTestId("submit")).toBeDisabled();
    expect(await screen.findByTestId("voucher-code")).toHaveTextContent("SUMMER10");

    // Act
    await user.click(screen.getByTestId("submit"));

    // Assert
    expect(onSubmit).toHaveBeenCalledWith("SUMMER10");
  });

  it("lets staff switch to another usable code of the voucher", async () => {
    // Arrange
    const onSubmit = jest.fn();
    const user = userEvent.setup();

    renderDialog({
      mode: pickerMode,
      onSubmit,
      mocks: [
        voucherCodesMock({
          voucherId: summerVoucher.id,
          codes: [voucherCode("SUMMER10"), voucherCode("SUMMER20")],
        }),
      ],
    });
    await pickVoucher(user, "Summer sale");

    // Act
    await user.click(await screen.findByTestId("change-voucher-code"));
    await user.click(screen.getByTestId("voucher-code-picker"));
    await user.click(screen.getByText("SUMMER20"));
    await user.click(screen.getByTestId("submit"));

    // Assert
    expect(onSubmit).toHaveBeenCalledWith("SUMMER20");
  });

  it("skips used codes of a single-use voucher across pages", async () => {
    // Arrange
    const onSubmit = jest.fn();
    const user = userEvent.setup();

    renderDialog({
      mode: pickerMode,
      onSubmit,
      mocks: [
        voucherCodesMock({
          voucherId: welcomeVoucher.id,
          codes: [voucherCode("WELCOME-1", { used: 1 })],
          endCursor: "page-1",
        }),
        voucherCodesMock({
          voucherId: welcomeVoucher.id,
          after: "page-1",
          codes: [voucherCode("WELCOME-2", { used: 1 }), voucherCode("WELCOME-3")],
        }),
      ],
    });

    // Act
    await pickVoucher(user, welcomeVoucher.name ?? "");
    await screen.findByTestId("voucher-code");
    await user.click(screen.getByTestId("submit"));

    // Assert
    expect(onSubmit).toHaveBeenCalledWith("WELCOME-3");
  });

  it("hides Change when the voucher has a single code", async () => {
    // Arrange
    const user = userEvent.setup();

    renderDialog({
      mode: pickerMode,
      mocks: [
        voucherCodesMock({ voucherId: shippingVoucher.id, codes: [voucherCode("SHIPFREE")] }),
      ],
    });

    // Act
    await pickVoucher(user, "Free delivery");

    // Assert
    expect(await screen.findByTestId("voucher-code")).toHaveTextContent("SHIPFREE");
    expect(screen.queryByTestId("change-voucher-code")).not.toBeInTheDocument();
  });

  it("keeps Apply disabled when the voucher has no usable codes", async () => {
    // Arrange
    const user = userEvent.setup();

    renderDialog({
      mode: pickerMode,
      mocks: [
        voucherCodesMock({
          voucherId: welcomeVoucher.id,
          codes: [
            voucherCode("WELCOME-1", { used: 1 }),
            voucherCode("WELCOME-2", { isActive: false }),
          ],
        }),
      ],
    });

    // Act
    await pickVoucher(user, welcomeVoucher.name ?? "");

    // Assert
    expect(await screen.findByText("This voucher has no unused codes")).toBeInTheDocument();
    expect(screen.queryByTestId("voucher-code")).not.toBeInTheDocument();
    expect(screen.getByTestId("submit")).toBeDisabled();
  });

  it("lets staff with discount access type a code instead", async () => {
    // Arrange
    const onSubmit = jest.fn();
    const user = userEvent.setup();

    renderDialog({ mode: pickerMode, onSubmit });

    // Act
    await user.click(screen.getByTestId("enter-code-manually"));
    await user.click(screen.getByTestId("voucher-code-input"));
    await user.paste(" PRIVATE-42 ");
    await user.click(screen.getByTestId("submit"));

    // Assert
    expect(screen.queryByTestId("voucher-picker")).not.toBeInTheDocument();
    expect(onSubmit).toHaveBeenCalledWith("PRIVATE-42");
  });

  it("asks staff without discount access to type the code", async () => {
    // Arrange
    const onSubmit = jest.fn();
    const user = userEvent.setup();

    renderDialog({ mode: manualMode, onSubmit });

    // Act
    await user.type(screen.getByTestId("voucher-code-input"), "  WINTER5 ");
    await user.click(screen.getByTestId("submit"));

    // Assert
    expect(screen.queryByTestId("voucher-picker")).not.toBeInTheDocument();
    expect(screen.queryByTestId("search-vouchers")).not.toBeInTheDocument();
    expect(onSubmit).toHaveBeenCalledWith("WINTER5");
  });

  it("keeps Apply disabled until a code is entered", () => {
    // Arrange & Act
    renderDialog({ mode: manualMode });

    // Assert
    expect(screen.getByTestId("submit")).toBeDisabled();
  });

  it("shows the API error inline", () => {
    // Arrange & Act
    renderDialog({ mode: manualMode, errors: [invalidCodeError] });

    // Assert
    expect(screen.getByText("Voucher code is invalid.")).toBeInTheDocument();
  });

  it("shows an empty state when the search finds no vouchers", () => {
    // Arrange & Act
    renderDialog({ mode: { ...pickerMode, vouchers: [] } });

    // Assert
    expect(
      screen.getByText("No active vouchers match your search in this channel."),
    ).toBeInTheDocument();
  });
});
