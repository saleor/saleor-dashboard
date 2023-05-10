import {
  PermissionEnum,
  PermissionFragment,
  PermissionGroupDetailsFragment,
  UserFragment,
} from "@dashboard/graphql";
import { PermissionGroupWithContextDetailsFragment } from "@dashboard/graphql/types.channelPermissions.generated";

import { PermissionGroupDetailsPageFormData } from "./components/PermissionGroupDetailsPage";
import { PermissionGroupWithChannelsDetailsPageFormData } from "./components/PermissonGroupWithChannelsDetailsPage";
import {
  arePermissionsExceeded,
  channelsDiff,
  extractPermissionCodes,
  getPermissionGroupAccessibleChannels,
  isGroupFullAccess,
  permissionsDiff,
  usersDiff,
} from "./utils";

describe("Permission group utils", () => {
  describe("channelDiff", () => {
    it("should return empty added channel and no removed channels when user had no restricted channels", () => {
      const formData = {
        channels: [{ value: "1", label: "channel-1" }],
      } as PermissionGroupWithChannelsDetailsPageFormData;

      const permissionGroup = {
        restrictedAccessToChannels: false,
        accessibleChannels: [
          {
            id: "1",
            name: "channel-1",
          },
          {
            id: "2",
            name: "channel-2",
          },
          {
            id: "3",
            name: "channel-3",
          },
        ],
      } as PermissionGroupWithContextDetailsFragment;

      const { addChannels, removeChannels } = channelsDiff(
        permissionGroup,
        formData,
      );

      expect(addChannels).toEqual(["1"]);
      expect(removeChannels).toEqual([]);
    });

    it("should return all added and removed channels", () => {
      const formData = {
        channels: [
          { value: "2", label: "channel-2" },
          { value: "3", label: "channel-3" },
          { value: "55", label: "channel-55" },
        ],
      } as PermissionGroupWithChannelsDetailsPageFormData;

      const permissionGroup = {
        restrictedAccessToChannels: true,
        accessibleChannels: [
          {
            id: "1",
            name: "channel-1",
          },
          {
            id: "2",
            name: "channel-2",
          },
          {
            id: "3",
            name: "channel-3",
          },
        ],
      } as PermissionGroupWithContextDetailsFragment;

      const { addChannels, removeChannels } = channelsDiff(
        permissionGroup,
        formData,
      );

      expect(addChannels).toEqual(["55"]);
      expect(removeChannels).toEqual(["1"]);
    });
  });

  describe("isGroupFullAccess", () => {
    it("should return true when have all permissions available in shop assigned", () => {
      const permissionGroup = {
        permissions: [
          { code: PermissionEnum.HANDLE_TAXES, name: "Handle taxes" },
          { code: PermissionEnum.HANDLE_CHECKOUTS, name: "Handle checkouts" },
          { code: PermissionEnum.HANDLE_PAYMENTS, name: "Handle payments" },
          { code: PermissionEnum.MANAGE_APPS, name: "Handle apps" },
        ],
      } as PermissionGroupDetailsFragment;

      const shopPermissions = [
        { code: PermissionEnum.HANDLE_TAXES, name: "Handle taxes" },
        { code: PermissionEnum.HANDLE_CHECKOUTS, name: "Handle checkouts" },
        { code: PermissionEnum.HANDLE_PAYMENTS, name: "Handle payments" },
        { code: PermissionEnum.MANAGE_APPS, name: "Handle apps" },
      ] as Array<Omit<PermissionFragment, "__typename">>;

      expect(isGroupFullAccess(permissionGroup, shopPermissions)).toBe(true);
    });

    it("should return false when permission length is different", () => {
      const permissionGroup = {
        permissions: [
          { code: PermissionEnum.HANDLE_CHECKOUTS, name: "Handle checkouts" },
          { code: PermissionEnum.HANDLE_PAYMENTS, name: "Handle payments" },
          { code: PermissionEnum.MANAGE_APPS, name: "Handle apps" },
        ],
      } as PermissionGroupDetailsFragment;

      const shopPermissions = [
        { code: PermissionEnum.HANDLE_TAXES, name: "Handle taxes" },
        { code: PermissionEnum.HANDLE_CHECKOUTS, name: "Handle checkouts" },
        { code: PermissionEnum.HANDLE_PAYMENTS, name: "Handle payments" },
        { code: PermissionEnum.MANAGE_APPS, name: "Handle apps" },
      ] as Array<Omit<PermissionFragment, "__typename">>;

      expect(isGroupFullAccess(permissionGroup, shopPermissions)).toBe(false);
    });

    it("should return false when permission does not have all shop permissions", () => {
      const permissionGroup = {
        permissions: [
          { code: PermissionEnum.HANDLE_TAXES, name: "Handle taxes" },
          { code: PermissionEnum.HANDLE_CHECKOUTS, name: "Handle checkouts" },
          { code: PermissionEnum.HANDLE_PAYMENTS, name: "Handle payments" },
          { code: PermissionEnum.MANAGE_APPS, name: "Handle apps" },
        ],
      } as PermissionGroupDetailsFragment;

      const shopPermissions = [
        { code: PermissionEnum.MANAGE_ORDERS, name: "Handle order" },
        { code: PermissionEnum.HANDLE_TAXES, name: "Handle taxes" },
        { code: PermissionEnum.HANDLE_CHECKOUTS, name: "Handle checkouts" },
        { code: PermissionEnum.HANDLE_PAYMENTS, name: "Handle payments" },
        { code: PermissionEnum.MANAGE_APPS, name: "Handle apps" },
      ] as Array<Omit<PermissionFragment, "__typename">>;

      expect(isGroupFullAccess(permissionGroup, shopPermissions)).toBe(false);
    });
  });

  describe("extractPermissionCodes", () => {
    it("should return list of permission codes", () => {
      const permissions = {
        permissions: [
          { code: PermissionEnum.HANDLE_TAXES, name: "Handle taxes" },
          { code: PermissionEnum.HANDLE_CHECKOUTS, name: "Handle checkouts" },
          { code: PermissionEnum.HANDLE_PAYMENTS, name: "Handle payments" },
          { code: PermissionEnum.MANAGE_APPS, name: "Handle apps" },
        ],
      } as PermissionGroupDetailsFragment;

      expect(extractPermissionCodes(permissions)).toEqual([
        PermissionEnum.HANDLE_TAXES,
        PermissionEnum.HANDLE_CHECKOUTS,
        PermissionEnum.HANDLE_PAYMENTS,
        PermissionEnum.MANAGE_APPS,
      ]);
    });
  });

  describe("permissionsDiff", () => {
    it("should return  added permissions and no removed permissions when user had no permissions", () => {
      const formData = {
        permissions: [PermissionEnum.HANDLE_TAXES],
      } as PermissionGroupWithChannelsDetailsPageFormData;

      const permissionGroup = {
        permissions: [],
      } as PermissionGroupDetailsFragment;

      const { addPermissions, removePermissions } = permissionsDiff(
        permissionGroup,
        formData,
      );

      expect(addPermissions).toEqual([PermissionEnum.HANDLE_TAXES]);
      expect(removePermissions).toEqual([]);
    });

    it("should return all added and removed permissions", () => {
      const formData = {
        permissions: [
          PermissionEnum.HANDLE_TAXES,
          PermissionEnum.HANDLE_CHECKOUTS,
        ],
      } as PermissionGroupWithChannelsDetailsPageFormData;

      const permissionGroup = {
        permissions: [
          { code: PermissionEnum.HANDLE_TAXES, name: "Handle taxes" },
          { code: PermissionEnum.HANDLE_PAYMENTS, name: "Handle payments" },
        ],
      } as PermissionGroupDetailsFragment;

      const { addPermissions, removePermissions } = permissionsDiff(
        permissionGroup,
        formData,
      );

      expect(addPermissions).toEqual([PermissionEnum.HANDLE_CHECKOUTS]);
      expect(removePermissions).toEqual([PermissionEnum.HANDLE_PAYMENTS]);
    });
  });

  describe("usersDiff", () => {
    it("should return  added users and no removed users when user had no users", () => {
      const formData = {
        users: [
          { id: "1", email: "test1@test.com" },
          { id: "2", email: "test2@test.com" },
        ],
      } as PermissionGroupDetailsPageFormData;

      const permissionGroup = {
        users: [],
      } as PermissionGroupDetailsFragment;

      const { addUsers, removeUsers } = usersDiff(permissionGroup, formData);

      expect(addUsers).toEqual(["1", "2"]);
      expect(removeUsers).toEqual([]);
    });

    it("should return all added and removed users", () => {
      const formData = {
        users: [
          { id: "2", email: "test2@test.com" },
          { id: "3", email: "test3@test.com" },
        ],
      } as PermissionGroupDetailsPageFormData;

      const permissionGroup = {
        users: [{ id: "1", email: "test1@test.com" }],
      } as PermissionGroupDetailsFragment;

      const { addUsers, removeUsers } = usersDiff(permissionGroup, formData);

      expect(addUsers).toEqual(["2", "3"]);
      expect(removeUsers).toEqual(["1"]);
    });
  });

  describe("arePermissionsExceeded", () => {
    it("should return false when number of permissions is not exceeded", () => {
      const permissions = {
        permissions: [
          { code: PermissionEnum.HANDLE_TAXES, name: "Handle taxes" },
          { code: PermissionEnum.HANDLE_CHECKOUTS, name: "Handle checkouts" },
          { code: PermissionEnum.HANDLE_PAYMENTS, name: "Handle payments" },
          { code: PermissionEnum.MANAGE_APPS, name: "Handle apps" },
        ],
      } as PermissionGroupDetailsFragment;

      const user = {
        userPermissions: [
          { code: PermissionEnum.HANDLE_TAXES, name: "Handle taxe" },
          { code: PermissionEnum.HANDLE_CHECKOUTS, name: "Handle checkouts" },
          { code: PermissionEnum.HANDLE_PAYMENTS, name: "Handle payments" },
          { code: PermissionEnum.MANAGE_APPS, name: "Handle apps" },
        ],
      } as UserFragment;

      const permissionsExceeded = arePermissionsExceeded(permissions, user);

      expect(permissionsExceeded).toBe(false);
    });

    it("should return true when number of permissions is  exceeded", () => {
      const permissions = {
        permissions: [
          { code: PermissionEnum.HANDLE_TAXES, name: "Handle taxe" },
          { code: PermissionEnum.HANDLE_CHECKOUTS, name: "Handle checkouts" },
          { code: PermissionEnum.HANDLE_PAYMENTS, name: "Handle payments" },
          { code: PermissionEnum.MANAGE_APPS, name: "Handle apps" },
        ],
      } as PermissionGroupDetailsFragment;

      const user = {
        userPermissions: [
          { code: PermissionEnum.HANDLE_CHECKOUTS, name: "Handle checkouts" },
          { code: PermissionEnum.HANDLE_PAYMENTS, name: "Handle payments" },
          { code: PermissionEnum.MANAGE_APPS, name: "Handle apps" },
        ],
      } as UserFragment;

      const permissionsExceeded = arePermissionsExceeded(permissions, user);

      expect(permissionsExceeded).toBe(true);
    });
  });

  describe("getPermissionGroupAccessibleChannels", () => {
    it("should return empty array when accessible channels length equal length of all channels", () => {
      const permissionGroup = {
        accessibleChannels: [
          {
            id: "1",
            name: "Channel 1",
            slug: "channel-1",
            currencyCode: "USD",
          },
          {
            id: "2",
            name: "Channel 2",
            slug: "channel-2",
            currencyCode: "USD",
          },
        ],
      } as PermissionGroupWithContextDetailsFragment;

      const accessibleChannels = getPermissionGroupAccessibleChannels(
        permissionGroup,
        2,
      );

      expect(accessibleChannels).toEqual([]);
    });

    it("should return all accessible channels when accessible channels length is less than all channels length", () => {
      const permissionGroup = {
        accessibleChannels: [
          {
            id: "1",
            name: "Channel 1",
            slug: "channel-1",
            currencyCode: "USD",
          },
          {
            id: "2",
            name: "Channel 2",
            slug: "channel-2",
            currencyCode: "USD",
          },
        ],
      } as PermissionGroupWithContextDetailsFragment;

      const accessibleChannels = getPermissionGroupAccessibleChannels(
        permissionGroup,
        4,
      );

      expect(accessibleChannels).toEqual([
        { label: "Channel 1", value: "1" },
        { label: "Channel 2", value: "2" },
      ]);
    });
  });
});
