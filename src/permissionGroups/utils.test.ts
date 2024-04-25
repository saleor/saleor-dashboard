import { UserContext } from "@dashboard/auth/types";
import {
  ChannelFragment,
  PermissionEnum,
  PermissionFragment,
  PermissionGroupDetailsFragment,
  UserFragment,
} from "@dashboard/graphql";

import { PermissionGroupDetailsPageFormData } from "./components/PermissionGroupDetailsPage";
import { permissionGroup, permissionGroupWithChannels } from "./fixtures";
import {
  arePermissionsExceeded,
  channelsDiff,
  checkIfUserHasRestictedAccessToChannels,
  extractPermissionCodes,
  getInitialChannels,
  getUserAccessibleChannelsOptions,
  isGroupFullAccess,
  mapAccessibleChannelsToChoice,
  permissionsDiff,
  usersDiff,
} from "./utils";

describe("Permission group utils", () => {
  describe("channelDiff", () => {
    it("should return empty added and removed channels when user is not eligible to edit channels", () => {
      // Arrange
      const isUserEligibleToEditPermissionGroup = false;
      const allAviableChannels: ChannelFragment[] = [];
      const formData = {
        channels: [],
      } as unknown as PermissionGroupDetailsPageFormData;
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
      } as PermissionGroupDetailsFragment;
      // Act
      const { addChannels, removeChannels } = channelsDiff(
        permissionGroup,
        formData,
        allAviableChannels,
        isUserEligibleToEditPermissionGroup,
      );

      // Assert
      expect(addChannels).toEqual([]);
      expect(removeChannels).toEqual([]);
    });
    it("should return  added channel and no removed channels when user had no restricted channels", () => {
      // Arrange
      const isUserEligibleToEditPermissionGroup = true;
      const allAviableChannels: ChannelFragment[] = [];
      const formData = {
        channels: ["1"],
      } as PermissionGroupDetailsPageFormData;
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
      } as PermissionGroupDetailsFragment;
      // Act
      const { addChannels, removeChannels } = channelsDiff(
        permissionGroup,
        formData,
        allAviableChannels,
        isUserEligibleToEditPermissionGroup,
      );

      // Assert
      expect(addChannels).toEqual(["1"]);
      expect(removeChannels).toEqual([]);
    });
    it("should return all added and removed channels", () => {
      // Arrange
      const isUserEligibleToEditPermissionGroup = true;
      const allAviableChannels: ChannelFragment[] = [];
      const formData = {
        channels: ["2", "3", "55"],
      } as PermissionGroupDetailsPageFormData;
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
      } as PermissionGroupDetailsFragment;
      // Act
      const { addChannels, removeChannels } = channelsDiff(
        permissionGroup,
        formData,
        allAviableChannels,
        isUserEligibleToEditPermissionGroup,
      );

      // Assert
      expect(addChannels).toEqual(["55"]);
      expect(removeChannels).toEqual(["1"]);
    });
    it("should only removed channels", () => {
      // Arrange
      const isUserEligibleToEditPermissionGroup = true;
      const allAviableChannels: ChannelFragment[] = [];
      const formData = {
        channels: ["2"],
      } as PermissionGroupDetailsPageFormData;
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
        ],
      } as PermissionGroupDetailsFragment;
      // Act
      const { addChannels, removeChannels } = channelsDiff(
        permissionGroup,
        formData,
        allAviableChannels,
        isUserEligibleToEditPermissionGroup,
      );

      // Assert
      expect(addChannels).toEqual([]);
      expect(removeChannels).toEqual(["1"]);
    });
    it("should return all channels when no restricted channels and allow access all", () => {
      // Arrnage
      const isUserEligibleToEditPermissionGroup = true;
      const formData = {
        channels: ["2"],
        hasAllChannels: true,
      } as PermissionGroupDetailsPageFormData;
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
        ],
      } as PermissionGroupDetailsFragment;
      const allChannels = [
        { id: "12", name: "channel-12" },
        { id: "22", name: "channel-22" },
      ] as ChannelFragment[];
      // Act
      const { addChannels, removeChannels } = channelsDiff(
        permissionGroup,
        formData,
        allChannels,
        isUserEligibleToEditPermissionGroup,
      );

      // Assert
      expect(addChannels).toEqual(["12", "22"]);
      expect(removeChannels).toEqual([]);
    });
  });
  describe("isGroupFullAccess", () => {
    it("should return true when have all permissions available in shop assigned", () => {
      // Arrange
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

      // Act & Assert
      expect(isGroupFullAccess(permissionGroup, shopPermissions)).toBe(true);
    });
    it("should return false when permission length is different", () => {
      // Arrange
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

      // Act & Assert
      expect(isGroupFullAccess(permissionGroup, shopPermissions)).toBe(false);
    });
    it("should return false when permission does not have all shop permissions", () => {
      // Arrange
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

      // Act & Assert
      expect(isGroupFullAccess(permissionGroup, shopPermissions)).toBe(false);
    });
  });
  describe("extractPermissionCodes", () => {
    it("should return list of permission codes", () => {
      // Arrange
      const permissions = {
        permissions: [
          { code: PermissionEnum.HANDLE_TAXES, name: "Handle taxes" },
          { code: PermissionEnum.HANDLE_CHECKOUTS, name: "Handle checkouts" },
          { code: PermissionEnum.HANDLE_PAYMENTS, name: "Handle payments" },
          { code: PermissionEnum.MANAGE_APPS, name: "Handle apps" },
        ],
      } as PermissionGroupDetailsFragment;

      // Act & Assert
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
      // Arrange
      const formData = {
        permissions: [PermissionEnum.HANDLE_TAXES],
      } as PermissionGroupDetailsPageFormData;
      const permissionGroup = {
        permissions: [],
      } as unknown as PermissionGroupDetailsFragment;
      // Act
      const { addPermissions, removePermissions } = permissionsDiff(permissionGroup, formData);

      // Assert
      expect(addPermissions).toEqual([PermissionEnum.HANDLE_TAXES]);
      expect(removePermissions).toEqual([]);
    });
    it("should return all added and removed permissions", () => {
      // Arrange
      const formData = {
        permissions: [PermissionEnum.HANDLE_TAXES, PermissionEnum.HANDLE_CHECKOUTS],
      } as PermissionGroupDetailsPageFormData;
      const permissionGroup = {
        permissions: [
          { code: PermissionEnum.HANDLE_TAXES, name: "Handle taxes" },
          { code: PermissionEnum.HANDLE_PAYMENTS, name: "Handle payments" },
        ],
      } as PermissionGroupDetailsFragment;
      // Act
      const { addPermissions, removePermissions } = permissionsDiff(permissionGroup, formData);

      // Assert
      expect(addPermissions).toEqual([PermissionEnum.HANDLE_CHECKOUTS]);
      expect(removePermissions).toEqual([PermissionEnum.HANDLE_PAYMENTS]);
    });
  });
  describe("usersDiff", () => {
    it("should return  added users and no removed users when user had no users", () => {
      // Arrange
      const formData = {
        users: [
          { id: "1", email: "test1@test.com" },
          { id: "2", email: "test2@test.com" },
        ],
      } as PermissionGroupDetailsPageFormData;
      const permissionGroup = {
        users: [],
      } as unknown as PermissionGroupDetailsFragment;
      // Act
      const { addUsers, removeUsers } = usersDiff(permissionGroup, formData);

      // Assert
      expect(addUsers).toEqual(["1", "2"]);
      expect(removeUsers).toEqual([]);
    });
    it("should return all added and removed users", () => {
      // Arrange
      const formData = {
        users: [
          { id: "2", email: "test2@test.com" },
          { id: "3", email: "test3@test.com" },
        ],
      } as PermissionGroupDetailsPageFormData;
      const permissionGroup = {
        users: [{ id: "1", email: "test1@test.com" }],
      } as PermissionGroupDetailsFragment;
      // Act
      const { addUsers, removeUsers } = usersDiff(permissionGroup, formData);

      // Assert
      expect(addUsers).toEqual(["2", "3"]);
      expect(removeUsers).toEqual(["1"]);
    });
  });
  describe("arePermissionsExceeded", () => {
    it("should return false when number of permissions is not exceeded", () => {
      // Arrange
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
      // Act
      const permissionsExceeded = arePermissionsExceeded(permissions, user);

      // Assert
      expect(permissionsExceeded).toBe(false);
    });
    it("should return true when number of permissions is  exceeded", () => {
      // Arrange
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
      // Act
      const permissionsExceeded = arePermissionsExceeded(permissions, user);

      // Assert
      expect(permissionsExceeded).toBe(true);
    });
  });
  describe("getPermissionGroupAccessibleChannels", () => {
    it("should return all accessible channels ", () => {
      // Arrange
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
      } as PermissionGroupDetailsFragment;
      // Act
      const accessibleChannels = mapAccessibleChannelsToChoice(permissionGroup);

      // Assert
      expect(accessibleChannels).toEqual([
        { label: "Channel 1", value: "1", disabled: false },
        { label: "Channel 2", value: "2", disabled: false },
      ]);
    });
  });
  describe("getUserAccessibleChannelsOptions", () => {
    it("should return empty array when no users", () => {
      // Arrange
      const availableChannels = [
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
      ] as ChannelFragment[];
      // Act
      const filteredChannels = getUserAccessibleChannelsOptions(availableChannels);

      // Assert
      expect(filteredChannels).toEqual([]);
    });
    it("should return available channels when user has no restricted channels", () => {
      // Arrange
      const availableChannels = [
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
      ] as ChannelFragment[];
      const user = {
        restrictedAccessToChannels: false,
      } as UserContext["user"];
      // Act
      const filteredChannels = getUserAccessibleChannelsOptions(availableChannels, user);

      // Assert
      expect(filteredChannels).toEqual(availableChannels);
    });
    it("should return user accessible channels when user has accessibleChannels and has restricted access to channels", () => {
      // Arrange
      const availableChannels = [
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
      ] as ChannelFragment[];
      const user = {
        accessibleChannels: [
          {
            id: "1",
            name: "UserChannel 1",
            slug: "Userchannel-1",
          },
        ],
        restrictedAccessToChannels: true,
      } as UserContext["user"];
      // Act
      const filteredChannels = getUserAccessibleChannelsOptions(availableChannels, user);

      // Assert
      expect(filteredChannels).toEqual([
        {
          id: "1",
          name: "UserChannel 1",
          slug: "Userchannel-1",
        },
      ]);
    });
  });
  describe("checkIfUserHasRestictedChannels", () => {
    it("should return true when user has restricted channels", () => {
      // Arrange
      const user = {
        restrictedAccessToChannels: true,
      } as UserContext["user"];
      // Act
      const hasRestrictedChannels = checkIfUserHasRestictedAccessToChannels(user);

      // Assert
      expect(hasRestrictedChannels).toBe(true);
    });
    it("should return false when user has no restricted channels", () => {
      // Arrange
      const user = {
        restrictedAccessToChannels: false,
      } as UserContext["user"];
      // Act
      const hasRestrictedChannels = checkIfUserHasRestictedAccessToChannels(user);

      // Assert
      expect(hasRestrictedChannels).toBe(false);
    });
    it("should return false when user no user", () => {
      // Arrange and Act
      const hasRestrictedChannels = checkIfUserHasRestictedAccessToChannels(undefined);

      // Assert
      expect(hasRestrictedChannels).toBe(false);
    });
  });
  describe("getInitialChannels", () => {
    it("should return empty array when no restricted channels and accessible channels length is equal all channels length", () => {
      // Arrange
      const allChannelsLength = 0;
      // Act
      const initialChannels = getInitialChannels(permissionGroup, allChannelsLength);

      // Assert
      expect(initialChannels).toEqual([]);
    });
    it("should return all accessible channels otherwise", () => {
      // Arrange
      const allChannelsLength = 10;
      // Act
      const initialChannels = getInitialChannels(permissionGroupWithChannels, allChannelsLength);

      // Assert
      expect(initialChannels).toEqual([permissionGroupWithChannels.accessibleChannels?.[0].id]);
    });
  });
});
