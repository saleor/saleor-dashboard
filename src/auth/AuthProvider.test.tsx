import { createSaleorClient, SaleorProvider } from "@saleor/sdk";
import setupApi from "@test/api";
import { act, renderHook } from "@testing-library/react-hooks";
import React from "react";
import { IntlProvider } from "react-intl";
import { MemoryRouter as Router } from "react-router-dom";

import { useAuthProvider } from "./hooks/useAuthProvider";

const apolloClient = setupApi();

function renderAuthProvider() {
  const intl = {
    formatMessage: ({ defaultMessage }) => defaultMessage,
  };
  const notify = jest.fn();
  const saleorClient = createSaleorClient({
    apiUrl: process.env.API_URI,
    channel: "",
  });
  const wrapper = ({ children }) => (
    <IntlProvider defaultLocale="en" locale="en">
      <Router>
        <SaleorProvider client={saleorClient}>{children}</SaleorProvider>
      </Router>
    </IntlProvider>
  );

  const { result } = renderHook(
    () => useAuthProvider({ intl: intl as any, notify, apolloClient }),
    { wrapper },
  );

  return result;
}

const adminCredentials = {
  email: "admin@example.com",
  password: "admin",
  token: null,
};

const nonStaffUserCredentials = {
  email: "client@example.com",
  password: "password",
};

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

xdescribe("User", () => {
  it("will be logged in if has valid credentials", async done => {
    const hook = renderAuthProvider();

    await act(async () => {
      const result = await hook.current.login(
        adminCredentials.email,
        adminCredentials.password,
      );
      expect(result.user?.email).toBe(adminCredentials.email);
    });
    expect(hook.current.authenticated).toBe(true);

    done();
  });

  it("will not be logged in if doesn't have valid credentials", async done => {
    const hook = renderAuthProvider();

    await act(async () => {
      const result = await hook.current.login(
        adminCredentials.email,
        "NotAValidPassword123!",
      );
      expect(result.user).toBe(null);
    });
    expect(hook.current.authenticated).toBe(false);

    done();
  });

  it("will not be logged in if is non-staff", async done => {
    const hook = renderAuthProvider();

    await act(async () => {
      const result = await hook.current.login(
        nonStaffUserCredentials.email,
        nonStaffUserCredentials.password,
      );
      expect(result.user).toBe(null);
    });
    expect(hook.current.authenticated).toBe(false);

    done();
  });
});
