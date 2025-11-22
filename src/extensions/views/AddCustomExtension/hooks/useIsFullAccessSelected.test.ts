import { PermissionEnum, PermissionFragment } from "@dashboard/graphql";
import { renderHook } from "@testing-library/react-hooks";
import { useForm } from "react-hook-form";

import { CustomExtensionFormData } from "../AddCustomExtension";
import { useFullAccessToggle } from "./useIsFullAccessSelected";

describe("useFullAccessToggle", () => {
  const mockPermissions: PermissionFragment[] = [
    { code: "MANAGE_APPS", name: "Manage Apps", __typename: "Permission" },
    { code: "MANAGE_ORDERS", name: "Manage Orders", __typename: "Permission" },
  ];

  it("should return false when permissions haven't been fetched", () => {
    // Arrange
    const { result: formResult } = renderHook(() =>
      useForm<CustomExtensionFormData>({
        defaultValues: {
          appName: "",
          permissions: {},
        },
      }),
    );

    const { result } = renderHook(() =>
      useFullAccessToggle({
        permissions: [],
        control: formResult.current.control,
        setValue: formResult.current.setValue,
      }),
    );

    // Assert
    expect(result.current.isFullAccess).toBe(false);
  });

  it("should return false when no permissions are selected", () => {
    // Arrange
    const { result: formResult } = renderHook(() =>
      useForm<CustomExtensionFormData>({
        defaultValues: {
          appName: "",
          permissions: {
            ["MANAGE_APPS"]: false,
            ["MANAGE_ORDERS"]: false,
          },
        },
      }),
    );

    const { result } = renderHook(() =>
      useFullAccessToggle({
        permissions: mockPermissions,
        control: formResult.current.control,
        setValue: formResult.current.setValue,
      }),
    );

    // Assert
    expect(result.current.isFullAccess).toBe(false);
  });

  it("should return true when all permissions are selected", () => {
    // Arrange
    const { result: formResult } = renderHook(() =>
      useForm<CustomExtensionFormData>({
        defaultValues: {
          appName: "",
          permissions: {
            ["MANAGE_APPS"]: true,
            ["MANAGE_ORDERS"]: true,
          },
        },
      }),
    );

    const { result } = renderHook(() =>
      useFullAccessToggle({
        permissions: mockPermissions,
        control: formResult.current.control,
        setValue: formResult.current.setValue,
      }),
    );

    // Assert
    expect(result.current.isFullAccess).toBe(true);
  });

  it("should toggle all permissions to false when full access is enabled", () => {
    // Arrange
    const { result: formResult } = renderHook(() =>
      useForm<CustomExtensionFormData>({
        defaultValues: {
          appName: "",
          permissions: {
            ["MANAGE_APPS"]: true,
            ["MANAGE_ORDERS"]: true,
          },
        },
      }),
    );

    const { result } = renderHook(() =>
      useFullAccessToggle({
        permissions: mockPermissions,
        control: formResult.current.control,
        setValue: formResult.current.setValue,
      }),
    );

    // Act
    result.current.toggleFullAccess();

    // Assert
    expect(formResult.current.getValues("permissions")).toEqual({
      ["MANAGE_APPS"]: false,
      ["MANAGE_ORDERS"]: false,
    });
  });

  it("should toggle all permissions to true when full access is disabled", () => {
    // Arrange
    const { result: formResult } = renderHook(() =>
      useForm<CustomExtensionFormData>({
        defaultValues: {
          appName: "",
          permissions: {
            ["MANAGE_APPS"]: false,
            ["MANAGE_ORDERS"]: false,
          },
        },
      }),
    );

    const { result } = renderHook(() =>
      useFullAccessToggle({
        permissions: mockPermissions,
        control: formResult.current.control,
        setValue: formResult.current.setValue,
      }),
    );

    // Act
    result.current.toggleFullAccess();

    // Assert
    expect(formResult.current.getValues("permissions")).toEqual({
      ["MANAGE_APPS"]: true,
      ["MANAGE_ORDERS"]: true,
    });
  });
});
