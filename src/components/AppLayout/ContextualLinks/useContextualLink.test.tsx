import { ContextualLine } from "@dashboard/components/AppLayout/ContextualLinks/ContextualLine";
import { renderHook } from "@testing-library/react-hooks";
import React, { ReactNode } from "react";
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
    expect(result.current).toEqual([
      "Learn more about ",
      expect.objectContaining({
        type: ContextualLine.Link,
        props: expect.objectContaining({
          href: "https://docs.saleor.io/developer/permissions#user-permissions",
          children: "User permissions",
        }),
      }),
    ]);
  });

  it("should return correct link for extending_saleor", () => {
    // Act
    const { result } = renderHook(() => useContextualLink("extending_saleor"), { wrapper });

    // Assert
    expect(result.current).toEqual([
      "Learn more about ",
      expect.objectContaining({
        type: ContextualLine.Link,
        props: expect.objectContaining({
          href: "https://docs.saleor.io/developer/extending/webhooks/overview",
          children: "extending Saleor with Webhooks",
        }),
      }),
    ]);
  });

  it("should return correct link for dev_panel", () => {
    // Act
    const { result } = renderHook(() => useContextualLink("dev_panel"), { wrapper });

    // Assert
    expect(result.current).toEqual([
      "Learn more about ",
      expect.objectContaining({
        type: ContextualLine.Link,
        props: expect.objectContaining({
          href: "https://docs.saleor.io/api-reference/",
          children: "API reference",
        }),
      }),
      " and view ",
      expect.objectContaining({
        type: ContextualLine.Link,
        props: expect.objectContaining({
          href: "https://docs.saleor.io/api-usage/overview",
          children: "API guide",
        }),
      }),
    ]);
  });

  it("should return correct link for order_list", () => {
    // Act
    const { result } = renderHook(() => useContextualLink("order_list"), { wrapper });

    // Assert
    expect(result.current).toEqual([
      "Learn more about ",
      expect.objectContaining({
        type: ContextualLine.Link,
        props: expect.objectContaining({
          href: "https://docs.saleor.io/developer/checkout/order-status",
          children: "order management",
        }),
      }),
    ]);
  });

  it("should return correct link for product_list", () => {
    // Act
    const { result } = renderHook(() => useContextualLink("product_list"), { wrapper });

    // Assert
    expect(result.current).toEqual([
      "Learn more about ",
      expect.objectContaining({
        type: ContextualLine.Link,
        props: expect.objectContaining({
          href: "https://docs.saleor.io/developer/products/configuration",
          children: "product configurations",
        }),
      }),
    ]);
  });

  it("should return correct link for gift_cards", () => {
    // Act
    const { result } = renderHook(() => useContextualLink("gift_cards"), { wrapper });

    // Assert
    expect(result.current).toEqual([
      "Learn more about ",
      expect.objectContaining({
        type: ContextualLine.Link,
        props: expect.objectContaining({
          href: "https://docs.saleor.io/developer/gift-cards",
          children: "gift cards",
        }),
      }),
    ]);
  });
});
