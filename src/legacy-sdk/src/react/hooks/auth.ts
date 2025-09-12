import { USER } from "../../apollo/queries";
import { UserQuery, UserQueryVariables } from "../../apollo/types";
import { hookFactory } from "../helpers/hookFactory";
import { hookStateFactory } from "../helpers/hookStateFactory";

/**
 * React hook to get authorization methods
 *
 * @returns Saleor's authorization methods
 */
export const useAuth = hookFactory("auth");

/**
 * React hook to get user's authentication data.
 *
 * @returns Object with user's data
 */
export const useAuthState = (): UserQuery => {
  const { data } = hookStateFactory<UserQuery, UserQueryVariables>(USER);

  if (!data) {
    throw new Error("Cache query result is undefined. Invalid cache configuration.");
  }

  return data;
};
