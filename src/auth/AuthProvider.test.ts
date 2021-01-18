import setupApi from "@test/api";
import { act, renderHook } from "@testing-library/react-hooks";
import ApolloClient from "apollo-client";

import { useAuthProvider } from "./AuthProvider";
import { getTokens, setAuthToken } from "./utils";

const apolloClient = setupApi();

function renderAuthProvider(apolloClient: ApolloClient<any>) {
  const intl = {
    formatMessage: ({ defaultMessage }) => defaultMessage
  };
  const notify = jest.fn();

  const { result } = renderHook(() =>
    useAuthProvider(intl as any, notify, apolloClient)
  );

  return result;
}

const adminCredentials = {
  email: "admin@example.com",
  password: "admin",
  token: null
};

const nonStaffUserCredentials = {
  email: "client@example.com",
  password: "password"
};

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

describe("User", () => {
  it("will be logged in if has valid credentials", async done => {
    const hook = renderAuthProvider(apolloClient);

    await act(() =>
      hook.current.login(adminCredentials.email, adminCredentials.password)
    );
    expect(hook.current.userContext.email).toBe(adminCredentials.email);
    adminCredentials.token = getTokens().auth;

    done();
  });

  it("will not be logged in if doesn't have valid credentials", async done => {
    const hook = renderAuthProvider(apolloClient);

    await act(() =>
      hook.current.login(adminCredentials.email, "NotAValidPassword123!")
    );
    expect(hook.current.userContext).toBe(null);

    done();
  });

  it("will not be logged in if is non-staff", async done => {
    const hook = renderAuthProvider(apolloClient);

    await act(() =>
      hook.current.login(
        nonStaffUserCredentials.email,
        nonStaffUserCredentials.password
      )
    );
    expect(hook.current.userContext).toBe(undefined);

    done();
  });

  it("will be logged if has valid token", async done => {
    setAuthToken(adminCredentials.token, false);
    const hook = renderAuthProvider(apolloClient);

    await act(() => hook.current.autologinPromise.current);
    expect(hook.current.userContext.email).toBe(adminCredentials.email);

    done();
  });

  it("will not be logged if has invalid token", async done => {
    setAuthToken("NotAToken", false);
    const hook = renderAuthProvider(apolloClient);

    await act(() => hook.current.autologinPromise.current);
    expect(hook.current.userContext).toBe(undefined);

    done();
  });
});
