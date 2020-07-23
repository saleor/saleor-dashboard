import setupApi from "@test/api";
import { act, renderHook } from "@testing-library/react-hooks";
import ApolloClient from "apollo-client";

import { useAuthProvider } from "./AuthProvider";
import { setAuthToken } from "./utils";

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

const credentials = {
  email: "admin@example.com",
  password: "admin",
  token:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTUyMzk4OTcsImV4cCI6MTU5NTI0MDE5NywidG9rZW4iOiJxQ1Jia0dOMnpOT28iLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwidHlwZSI6ImFjY2VzcyIsInVzZXJfaWQiOiJWWE5sY2pveU1RPT0iLCJpc19zdGFmZiI6dHJ1ZX0.l-FnFDVmi5fASo7Uae2Emewu2pKyO2qLz7ZQl1fSzo4"
};

beforeEach(() => {
  localStorage.clear();
});

describe("User", () => {
  it("will be logged in if has valid credentials", async done => {
    const hook = renderAuthProvider(apolloClient);

    await act(() =>
      hook.current.login(credentials.email, credentials.password)
    );
    expect(hook.current.userContext.email).toBe(credentials.email);

    done();
  });

  it("will not be logged in if doesn't have valid credentials", async done => {
    const hook = renderAuthProvider(apolloClient);

    await act(() =>
      hook.current.login(credentials.email, "NotAValidPassword123!")
    );
    expect(hook.current.userContext).toBe(null);

    done();
  });

  it("will be logged if has valid token", async done => {
    setAuthToken(credentials.token, false);
    const hook = renderAuthProvider(apolloClient);

    await act(() => hook.current.autologinPromise.current);
    expect(hook.current.userContext.email).toBe(credentials.email);

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
