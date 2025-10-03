import { renderHook } from "@testing-library/react-hooks";
import { ReactNode } from "react";
import { IntlProvider } from "react-intl";

import { useContextualLink } from "./useContextualLink";

jest.mock("@dashboard/components/ProductAnalytics/useAnalytics", () => ({
  useAnalytics: jest.fn().mockReturnValue({ trackEvent: jest.fn() }),
}));

const wrapper = ({ children }: { children: ReactNode }) => (
  <IntlProvider locale="EN">{children}</IntlProvider>
);

describe("useContextualLink", () => {
  it("should return correct link for staff_members", () => {
    // Act
    const { result } = renderHook(() => useContextualLink("staff_members"), { wrapper });

    // Assert
    expect(result.current).toEqual("Learn more about {userPermissions}");
  });

  it("should return correct link for extending_saleor", () => {
    // Act
    const { result } = renderHook(() => useContextualLink("extending_saleor"), { wrapper });

    // Assert
    expect(result.current).toEqual("Learn more about {extendingSaleor}");
  });

  it("should return correct link for dev_panel", () => {
    // Act
    const { result } = renderHook(() => useContextualLink("dev_panel"), { wrapper });

    // Assert
    expect(result.current).toEqual("Learn more about {apiReference} and view {apiGuide}");
  });

  it("should return correct link for order_list", () => {
    // Act
    const { result } = renderHook(() => useContextualLink("order_list"), { wrapper });

    // Assert
    expect(result.current).toEqual("Learn more about {orderManagement}");
  });

  it("should return correct link for product_list", () => {
    // Act
    const { result } = renderHook(() => useContextualLink("product_list"), { wrapper });

    // Assert
    expect(result.current).toEqual("Learn more about {productConfigurations}");
  });

  it("should return correct link for gift_cards", () => {
    // Act
    const { result } = renderHook(() => useContextualLink("gift_cards"), { wrapper });

    // Assert
    expect(result.current).toEqual("Learn more about {giftCards}");
  });
});
