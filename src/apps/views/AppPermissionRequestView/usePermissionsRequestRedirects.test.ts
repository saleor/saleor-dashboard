import { renderHook } from "@testing-library/react-hooks";

import { usePermissionsRequestRedirects } from "./usePermissionsRequestRedirects";

const mockNavigate = jest.fn();
jest.mock("@dashboard/hooks/useNavigator", () => () => mockNavigate);
describe("usePermissionsRequestRedirects", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it("Navigates to redirect url provided by app - if approved", () => {
    const { result } = renderHook(() =>
      usePermissionsRequestRedirects({
        appId: "XYZ",
        redirectPath: "/permissions-request-result",
      }),
    );

    result.current.navigateToAppApproved();
    expect(mockNavigate).toHaveBeenCalledWith("/apps/XYZ/app?appPath=/permissions-request-result");
  });
  it("Navigates to redirect url provided by app and appends ?error - provided", () => {
    const { result } = renderHook(() =>
      usePermissionsRequestRedirects({
        appId: "XYZ",
        redirectPath: "/permissions-request-result",
      }),
    );

    result.current.navigateToAppDenied("USER_DENIED_PERMISSIONS");
    expect(mockNavigate).toHaveBeenCalledWith(
      "/apps/XYZ/app?appPath=/permissions-request-result&error=USER_DENIED_PERMISSIONS",
    );
  });
});
