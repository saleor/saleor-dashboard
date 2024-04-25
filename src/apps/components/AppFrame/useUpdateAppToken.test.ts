import { useUpdateAppToken } from "@dashboard/apps/components/AppFrame/useUpdateAppToken";
import { renderHook } from "@testing-library/react-hooks";

describe("useUpdateAppToken", function () {
  const postMessage = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
  });
  it("Doesnt do anything if disabled", () => {
    const { waitFor } = renderHook(props => useUpdateAppToken(props), {
      initialProps: {
        enabled: true,
        appToken: "initialToken",
        postToExtension: postMessage,
      },
    });

    return waitFor(() => {
      expect(postMessage).not.toHaveBeenCalled();
    });
  });
  it("Doesnt do anything if re-rendered, but token stays the same between renders", () => {
    const localPostMessage = jest.fn();
    const { rerender, waitFor } = renderHook(props => useUpdateAppToken(props), {
      initialProps: {
        enabled: true,
        appToken: "initialToken",
        postToExtension: postMessage,
      },
    });

    rerender({
      enabled: true,
      appToken: "initialToken",
      // simulate props change due to reference change
      postToExtension: localPostMessage,
    });

    return waitFor(() => {
      expect(postMessage).not.toHaveBeenCalled();
      expect(localPostMessage).not.toHaveBeenCalled();
    });
  });
  it("Calls postMessage if token changes in props and enabled", async () => {
    const { rerender, waitFor } = renderHook(props => useUpdateAppToken(props), {
      initialProps: {
        enabled: true,
        appToken: "initialToken",
        postToExtension: postMessage,
      },
    });

    rerender({
      enabled: true,
      appToken: "updatedToken",
      // simulate props change due to reference change
      postToExtension: postMessage,
    });

    return waitFor(() => {
      expect(postMessage).toHaveBeenCalledWith({
        type: "tokenRefresh",
        payload: {
          token: "updatedToken",
        },
      });
    });
  });
});
