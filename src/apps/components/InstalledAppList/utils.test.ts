import { AppInstallation, InstalledApp } from "@dashboard/apps/types";

import { appsAreLoading, hasEmptyAppList } from "./utils";

describe("InstalledAppList utils", () => {
  describe("appsAreLoading", () => {
    describe("has MANAGE_APPS permission", () => {
      const hasManagedAppsPermission = true;

      it("should return true when has apps installed and no app installations", () => {
        // Arrange
        const appList = [
          {
            isExternal: false,
          },
        ] as InstalledApp[];
        const appInstallationList = undefined;

        // Act
        const isLoading = appsAreLoading({
          appList,
          appInstallationList,
          hasManagedAppsPermission,
        });

        // Assert
        expect(isLoading).toBe(true);
      });

      it("should return true when has apps installations and no app installed", () => {
        // Arrange
        const appList = undefined;
        const appInstallationList = [
          {
            isExternal: false,
          },
        ] as AppInstallation[];

        // Act
        const isLoading = appsAreLoading({
          appList,
          appInstallationList,
          hasManagedAppsPermission,
        });

        // Assert
        expect(isLoading).toBe(true);
      });

      it("should return true when has no apps installed and no app installations", () => {
        // Arrange
        const appList = undefined;
        const appInstallationList = undefined;

        // Act
        const isLoading = appsAreLoading({
          appList,
          appInstallationList,
          hasManagedAppsPermission,
        });

        // Assert
        expect(isLoading).toBe(true);
      });

      it("should return false when has apps installations and app installed", () => {
        // Arrange
        const appList: InstalledApp[] = [];
        const appInstallationList: AppInstallation[] = [];

        // Act
        const isLoading = appsAreLoading({
          appList,
          appInstallationList,
          hasManagedAppsPermission,
        });

        // Assert
        expect(isLoading).toBe(false);
      });
    });

    describe("has no MANAGE_APPS permission", () => {
      const hasManagedAppsPermission = false;

      it("should return true when has apps installed and ignore app installation", () => {
        // Arrange
        const appList = undefined;
        const appInstallationList: AppInstallation[] = [];

        // Act
        const isLoading = appsAreLoading({
          appList,
          appInstallationList,
          hasManagedAppsPermission,
        });

        // Assert
        expect(isLoading).toBe(true);
      });

      it("should return false when has apps installed and ignore app installtion", () => {
        // Arrange
        const appList: InstalledApp[] = [];
        const appInstallationList = undefined;

        // Act
        const isLoading = appsAreLoading({
          appList,
          appInstallationList,
          hasManagedAppsPermission,
        });

        // Assert
        expect(isLoading).toBe(false);
      });
    });
  });

  describe("appNotInstalled", () => {
    describe("has MANAGE_APPS permission", () => {
      const hasManagedAppsPermission = true;
      it("should return true when has empty apps installed and empty app installations", () => {
        // Arrange
        const appList: InstalledApp[] = [];
        const appInstallationList: AppInstallation[] = [];

        // Act
        const showInstalledApps = hasEmptyAppList({
          appInstallationList,
          appList,
          hasManagedAppsPermission,
        });

        // Assert
        expect(showInstalledApps).toBe(true);
      });

      it("should return false when has no apps installed and no app installations", () => {
        // Arrange
        const appList = undefined;
        const appInstallationList = undefined;

        // Act
        const showInstalledApps = hasEmptyAppList({
          appInstallationList,
          appList,
          hasManagedAppsPermission,
        });

        // Assert
        expect(showInstalledApps).toBe(false);
      });

      it("should return false when has apps installations and no app installed", () => {
        // Arrange
        const appList: InstalledApp[] = [];
        const appInstallationList = [
          {
            isExternal: false,
          },
        ] as AppInstallation[];

        // Act
        const showInstalledApps = hasEmptyAppList({
          appInstallationList,
          appList,
          hasManagedAppsPermission,
        });

        // Assert
        expect(showInstalledApps).toBe(false);
      });

      it("should return false when has apps installed and no app installations", () => {
        // Arrange
        const appList = [
          {
            isExternal: false,
          },
        ] as InstalledApp[];
        const appInstallationList: AppInstallation[] = [];

        // Act
        const showInstalledApps = hasEmptyAppList({
          appInstallationList,
          appList,
          hasManagedAppsPermission,
        });

        // Assert
        expect(showInstalledApps).toBe(false);
      });
    });

    describe("has no MANAGE_APPS permission", () => {
      const hasManagedAppsPermission = false;

      it("should return true when has empty apps installed", () => {
        // Arrange
        const appList: InstalledApp[] = [];
        const appInstallationList = undefined;

        // Act
        const showInstalledApps = hasEmptyAppList({
          appInstallationList,
          appList,
          hasManagedAppsPermission,
        });

        // Assert
        expect(showInstalledApps).toBe(true);
      });

      it("should return false when has no apps installed and no app installations", () => {
        // Arrange
        const appList = undefined;
        const appInstallationList = undefined;

        // Act
        const showInstalledApps = hasEmptyAppList({
          appInstallationList,
          appList,
          hasManagedAppsPermission,
        });

        // Assert
        expect(showInstalledApps).toBe(false);
      });

      it("should return false when has apps installed and no app installations", () => {
        // Arrange
        const appList = [
          {
            isExternal: false,
          },
        ] as InstalledApp[];
        const appInstallationList: AppInstallation[] = [];

        // Act
        const showInstalledApps = hasEmptyAppList({
          appInstallationList,
          appList,
          hasManagedAppsPermission,
        });

        // Assert
        expect(showInstalledApps).toBe(false);
      });
    });
  });
});
