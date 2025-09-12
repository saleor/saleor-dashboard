import { ApolloClient, FetchResult, NormalizedCacheObject } from "@apollo/client";

import { FetchConfig } from "../apollo";
import {
  AccountConfirmMutation,
  AccountConfirmMutationVariables,
  AccountDeleteMutation,
  AccountRegisterInput,
  AccountRequestDeletionMutation,
  AccountUpdateMutation,
  ConfirmEmailChangeMutation,
  CreateAccountAddressMutation,
  DeleteAccountAddressMutation,
  ExternalAuthenticationUrlMutation,
  ExternalLogoutMutation,
  ExternalObtainAccessTokensMutation,
  ExternalRefreshMutation,
  ExternalVerifyMutation,
  LoginMutation,
  MutationAccountAddressCreateArgs,
  MutationAccountAddressUpdateArgs,
  MutationAccountSetDefaultAddressArgs,
  MutationAccountUpdateArgs,
  MutationExternalAuthenticationUrlArgs,
  MutationExternalLogoutArgs,
  MutationExternalObtainAccessTokensArgs,
  MutationPasswordChangeArgs,
  MutationRequestEmailChangeArgs,
  MutationRequestPasswordResetArgs,
  MutationSetPasswordArgs,
  MutationTokenCreateArgs,
  MutationTokenRefreshArgs,
  PasswordChangeMutation,
  RefreshTokenMutation,
  RegisterMutation,
  RequestEmailChangeMutation,
  RequestPasswordResetMutation,
  SetAccountDefaultAddressMutation,
  SetPasswordMutation,
  UpdateAccountAddressMutation,
  VerifyTokenMutation,
} from "../apollo/types";
import { AuthSDK } from "./auth";
import { State } from "./state";
import { UserSDK } from "./user";

export interface SaleorClientInternals {
  apolloClient: ApolloClient<NormalizedCacheObject>;
}
export interface SaleorClientConfig {
  channel: string;
  autologin: boolean;
  setChannel(channel: string): string;
}
export interface SaleorClient {
  auth: AuthSDK;
  user: UserSDK;
  config: SaleorClientConfig;
  _internal: SaleorClientInternals;
  getState(): State;
}

interface SaleorClientFetchOpts {
  autologin?: boolean;
  fetchOpts?: FetchConfig;
}

export interface SaleorClientOpts {
  apiUrl: string;
  channel: string;
  opts?: SaleorClientFetchOpts;
}

export type SaleorClientMethodsProps = SaleorClientInternals & Pick<SaleorClientConfig, "channel">;

export type JWTToken = {
  iat: number;
  iss: string;
  owner: string;
  exp: number;
  token: string;
  email: string;
  type: string;
  user_id: string;
  is_staff: boolean;
};

// Meethods opts
// Auth
export type ChangePasswordOpts = MutationPasswordChangeArgs;
export type LoginOpts = MutationTokenCreateArgs & { includeDetails?: boolean };
export type RefreshTokenOpts = Pick<MutationTokenRefreshArgs, "refreshToken">;
export type RegisterOpts = AccountRegisterInput;
export type RequestPasswordResetOpts = MutationRequestPasswordResetArgs;
export type SetPasswordOpts = MutationSetPasswordArgs;
export type GetExternalAuthUrlOpts = MutationExternalAuthenticationUrlArgs;
export type GetExternalAccessTokenOpts = MutationExternalObtainAccessTokensArgs;
export type LogoutOpts = Pick<MutationExternalLogoutArgs, "input">;
// User
export type CreateAccountAddressOpts = MutationAccountAddressCreateArgs;
export type RequestEmailChangeOpts = MutationRequestEmailChangeArgs;
export type SetAccountDefaultAddressOpts = MutationAccountSetDefaultAddressArgs;
export type UpdateAccountOpts = MutationAccountUpdateArgs;
export type UpdateAccountAddressOpts = MutationAccountAddressUpdateArgs;
export type ConfirmAccountOpts = AccountConfirmMutationVariables;

// Meethods results
// Auth
export type ChangePasswordResult = FetchResult<PasswordChangeMutation>;
export type ChangePasswordData = PasswordChangeMutation["passwordChange"];
export type LoginResult = FetchResult<LoginMutation>;
export type LoginData = LoginMutation["tokenCreate"];
export type LogoutResult = FetchResult<ExternalLogoutMutation> | null;
export type LogoutData = ExternalLogoutMutation["externalLogout"] | null;
export type RefreshTokenResult = FetchResult<RefreshTokenMutation>;
export type RefreshTokenData = RefreshTokenMutation["tokenRefresh"];
export type RegisterResult = FetchResult<RegisterMutation>;
export type RegisterData = RegisterMutation["accountRegister"];
export type RequestPasswordResetResult = FetchResult<RequestPasswordResetMutation>;
export type RequestPasswordResetData = RequestPasswordResetMutation["requestPasswordReset"];
export type SetPasswordResult = FetchResult<SetPasswordMutation>;
export type SetPasswordData = SetPasswordMutation["setPassword"];
export type VerifyTokenResult = FetchResult<VerifyTokenMutation>;
export type VerifyTokenData = VerifyTokenMutation["tokenVerify"];
export type GetExternalAuthUrlResult = FetchResult<ExternalAuthenticationUrlMutation>;
export type GetExternalAuthUrlData = ExternalAuthenticationUrlMutation["externalAuthenticationUrl"];
export type GetExternalAccessTokenResult = FetchResult<ExternalObtainAccessTokensMutation>;
export type GetExternalAccessTokenData =
  ExternalObtainAccessTokensMutation["externalObtainAccessTokens"];
export type RefreshExternalTokenResult = FetchResult<ExternalRefreshMutation>;
export type RefreshExternalTokenData = ExternalRefreshMutation["externalRefresh"];
export type VerifyExternalTokenResult = FetchResult<ExternalVerifyMutation>;
export type VerifyExternalTokenData = ExternalVerifyMutation["externalVerify"];
// User
export type AccountDeleteResult = FetchResult<AccountDeleteMutation>;
export type AccountDeleteData = AccountDeleteMutation["accountDelete"];
export type AccountRequestDeletionResult = FetchResult<AccountRequestDeletionMutation>;
export type AccountRequestDeletionData = AccountRequestDeletionMutation["accountRequestDeletion"];
export type ConfirmEmailChangeResult = FetchResult<ConfirmEmailChangeMutation>;
export type ConfirmEmailChangeData = ConfirmEmailChangeMutation["confirmEmailChange"];
export type CreateAccountAddressResult = FetchResult<CreateAccountAddressMutation>;
export type CreateAccountAddressData = CreateAccountAddressMutation["accountAddressCreate"];
export type DeleteAccountAddressResult = FetchResult<DeleteAccountAddressMutation>;
export type DeleteAccountAddressData = DeleteAccountAddressMutation["accountAddressDelete"];
export type RequestEmailChangeResult = FetchResult<RequestEmailChangeMutation>;
export type RequestEmailChangeData = RequestEmailChangeMutation["requestEmailChange"];
export type SetAccountDefaultAddressResult = FetchResult<SetAccountDefaultAddressMutation>;
export type SetAccountDefaultAddressData =
  SetAccountDefaultAddressMutation["accountSetDefaultAddress"];
export type UpdateAccountResult = FetchResult<AccountUpdateMutation>;
export type UpdateAccountData = AccountUpdateMutation["accountUpdate"];
export type UpdateAccountAddressResult = FetchResult<UpdateAccountAddressMutation>;
export type UpdateAccountAddressData = UpdateAccountAddressMutation["accountAddressUpdate"];
export type ConfirmAccountResult = FetchResult<AccountConfirmMutation>;
export type ConfirmAccountData = AccountConfirmMutation["confirmAccount"];
