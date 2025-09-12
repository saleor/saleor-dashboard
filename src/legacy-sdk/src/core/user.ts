import {
  CONFIRM_ACCOUNT,
  CONFIRM_EMAIL_CHANGE,
  CREATE_ACCOUNT_ADDRESS,
  DELETE_ACCOUNT,
  DELETE_ACCOUNT_ADDRESS,
  REQUEST_DELETE_ACCOUNT,
  REQUEST_EMAIL_CHANGE,
  SET_ACCOUNT_DEFAULT_ADDRESS,
  UPDATE_ACCOUNT,
  UPDATE_ACCOUNT_ADDRESS,
} from "../apollo/mutations";
import {
  AccountConfirmMutation,
  AccountConfirmMutationVariables,
  AccountDeleteMutation,
  AccountDeleteMutationVariables,
  AccountRequestDeletionMutation,
  AccountRequestDeletionMutationVariables,
  AccountUpdateMutation,
  AccountUpdateMutationVariables,
  ConfirmEmailChangeMutation,
  ConfirmEmailChangeMutationVariables,
  CreateAccountAddressMutation,
  CreateAccountAddressMutationVariables,
  DeleteAccountAddressMutation,
  DeleteAccountAddressMutationVariables,
  RequestEmailChangeMutation,
  RequestEmailChangeMutationVariables,
  SetAccountDefaultAddressMutation,
  SetAccountDefaultAddressMutationVariables,
  UpdateAccountAddressMutation,
  UpdateAccountAddressMutationVariables,
} from "../apollo/types";
import { auth } from "./auth";
import {
  AccountDeleteResult,
  AccountRequestDeletionResult,
  ConfirmAccountOpts,
  ConfirmAccountResult,
  ConfirmEmailChangeResult,
  CreateAccountAddressOpts,
  CreateAccountAddressResult,
  DeleteAccountAddressResult,
  RequestEmailChangeOpts,
  RequestEmailChangeResult,
  SaleorClientMethodsProps,
  SetAccountDefaultAddressOpts,
  SetAccountDefaultAddressResult,
  UpdateAccountAddressOpts,
  UpdateAccountAddressResult,
  UpdateAccountOpts,
  UpdateAccountResult,
} from "./types";

export interface UserSDK {
  /**
   * Remove user account.
   *
   * @param token - A one-time token required to remove account. Sent by email using AccountRequestDeletion mutation.
   * @returns Deleted user's account data and errors.
   */
  accountDelete: (token: string) => Promise<AccountDeleteResult>;
  /**
   * Sends an email with the account removal link for the logged-in user.
   *
   * @param redirectUrl - URL of a view where users should be redirected to delete their account. URL in RFC 1808 format.
   * @returns Errors if there are some.
   */
  accountRequestDeletion: (redirectUrl: string) => Promise<AccountRequestDeletionResult>;
  /**
   * Confirm the email change of the logged-in user.
   *
   * @param token - A one-time token required to change the email.
   * @returns A user instance with a new email and errors.
   */
  confirmEmailChange: (token: string) => Promise<ConfirmEmailChangeResult>;
  /**
   * Create a new address for the account.
   *
   * @param opts - Object with fields required to create address and a type of address.
   * If provided, the new address will be automatically assigned as the customer's default address of that type.
   * @returns Updated user account.
   */
  createAccountAddress: (opts: CreateAccountAddressOpts) => Promise<CreateAccountAddressResult>;
  /**
   * Delete an address of the logged-in account.
   *
   * @param addressId - ID of the address to delete.
   * @returns Updated user account.
   */
  deleteAccountAddress: (addressId: string) => Promise<DeleteAccountAddressResult>;
  /**
   * Request email change of the logged in user.
   *
   * @param opts - Object with new user email, user's password and URL of a view where users should be redirected to update the email address.
   * @returns A user instance and errors.
   */
  requestEmailChange: (opts: RequestEmailChangeOpts) => Promise<RequestEmailChangeResult>;
  /**
   * Sets a default address for the authenticated account.
   *
   * @param opts - Object with ID of the address to set as default and the type of address.
   * @returns Updated user account.
   */
  setAccountDefaultAddress: (
    opts: SetAccountDefaultAddressOpts,
  ) => Promise<SetAccountDefaultAddressResult>;
  /**
   * Updates the account of the logged-in account.
   *
   * @param opts - Fields required to update the account of the logged-in account.
   * @returns Updated user account.
   */
  updateAccount: (opts: UpdateAccountOpts) => Promise<UpdateAccountResult>;
  /**
   * Updates an address of the logged-in account.
   *
   * @param opts - Object with ID of the address to update and fields required to update the address.
   * @returns Updated user account.
   */
  updateAccountAddress: (opts: UpdateAccountAddressOpts) => Promise<UpdateAccountAddressResult>;
  /**
   * Confirms user account with token sent by email during registration.
   *
   * @param opts - Object with email of the user and one-time token required to confirm the account.
   * @returns Confirmed user account.
   */
  confirmAccount: (opts: ConfirmAccountOpts) => Promise<ConfirmAccountResult>;
}

export const user = ({ apolloClient: client, channel }: SaleorClientMethodsProps): UserSDK => {
  const _auth = auth({ apolloClient: client, channel });

  const accountDelete: UserSDK["accountDelete"] = async token => {
    const result = await client.mutate<AccountDeleteMutation, AccountDeleteMutationVariables>({
      mutation: DELETE_ACCOUNT,
      variables: { token },
    });

    _auth.logout();

    return result;
  };

  const accountRequestDeletion: UserSDK["accountRequestDeletion"] = async redirectUrl => {
    const result = await client.mutate<
      AccountRequestDeletionMutation,
      AccountRequestDeletionMutationVariables
    >({
      mutation: REQUEST_DELETE_ACCOUNT,
      variables: { channel, redirectUrl },
    });

    return result;
  };

  const confirmEmailChange: UserSDK["confirmEmailChange"] = async token => {
    const result = await client.mutate<
      ConfirmEmailChangeMutation,
      ConfirmEmailChangeMutationVariables
    >({
      mutation: CONFIRM_EMAIL_CHANGE,
      variables: { channel, token },
    });

    return result;
  };

  const requestEmailChange: UserSDK["requestEmailChange"] = async opts => {
    const result = await client.mutate<
      RequestEmailChangeMutation,
      RequestEmailChangeMutationVariables
    >({
      mutation: REQUEST_EMAIL_CHANGE,
      variables: { ...opts, channel: opts.channel || channel },
    });

    return result;
  };

  const updateAccount: UserSDK["updateAccount"] = async opts => {
    const result = await client.mutate<AccountUpdateMutation, AccountUpdateMutationVariables>({
      mutation: UPDATE_ACCOUNT,
      variables: { ...opts },
    });

    return result;
  };

  const setAccountDefaultAddress: UserSDK["setAccountDefaultAddress"] = async opts => {
    const result = await client.mutate<
      SetAccountDefaultAddressMutation,
      SetAccountDefaultAddressMutationVariables
    >({
      mutation: SET_ACCOUNT_DEFAULT_ADDRESS,
      variables: { ...opts },
    });

    return result;
  };

  const createAccountAddress: UserSDK["createAccountAddress"] = async opts => {
    const result = await client.mutate<
      CreateAccountAddressMutation,
      CreateAccountAddressMutationVariables
    >({
      mutation: CREATE_ACCOUNT_ADDRESS,
      variables: { ...opts },
    });

    return result;
  };

  const deleteAccountAddress: UserSDK["deleteAccountAddress"] = async addressId => {
    const result = await client.mutate<
      DeleteAccountAddressMutation,
      DeleteAccountAddressMutationVariables
    >({
      mutation: DELETE_ACCOUNT_ADDRESS,
      variables: { addressId },
    });

    return result;
  };

  const updateAccountAddress: UserSDK["updateAccountAddress"] = async opts => {
    const result = await client.mutate<
      UpdateAccountAddressMutation,
      UpdateAccountAddressMutationVariables
    >({
      mutation: UPDATE_ACCOUNT_ADDRESS,
      variables: { ...opts },
    });

    return result;
  };

  const confirmAccount: UserSDK["confirmAccount"] = async opts => {
    const result = await client.mutate<AccountConfirmMutation, AccountConfirmMutationVariables>({
      mutation: CONFIRM_ACCOUNT,
      variables: { ...opts },
    });

    return result;
  };

  return {
    accountDelete,
    accountRequestDeletion,
    confirmEmailChange,
    createAccountAddress,
    deleteAccountAddress,
    requestEmailChange,
    updateAccount,
    updateAccountAddress,
    setAccountDefaultAddress,
    confirmAccount,
  };
};
