import type { UserContext as UserContextType } from "@dashboard/auth/types";
import { UserContext } from "@dashboard/auth/useUser";
import type { UserFragment } from "@dashboard/graphql";
import type { StoryFn } from "@storybook/react-vite";

const existingUser: UserFragment = {
  __typename: "User",
  id: "user-1",
  email: "admin@example.com",
  firstName: "Admin",
  lastName: "User",
  isActive: true,
  isStaff: true,
  dateJoined: "2024-01-01T00:00:00Z",
  metadata: [],
  userPermissions: [],
  avatar: null,
  accessibleChannels: [],
  restrictedAccessToChannels: false,
};

const existingUserContext: UserContextType = {
  login: undefined,
  loginByExternalPlugin: undefined,
  logout: undefined,
  requestLoginByExternalPlugin: undefined,
  authenticating: false,
  isCredentialsLogin: false,
  authenticated: true,
  errors: [],
  refetchUser: undefined,
  user: existingUser,
};

/** Signs in a user who joined before any story ripple, so ripples within their lifetime render. */
export const withExistingUser = (Story: StoryFn): JSX.Element => (
  <UserContext.Provider value={existingUserContext}>
    <Story />
  </UserContext.Provider>
);
