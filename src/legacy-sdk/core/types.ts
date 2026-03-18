import { type ApolloClient, type FetchResult, type NormalizedCacheObject } from "@apollo/client";

import { type FetchConfig } from "../apollo";
import {
  type AccountConfirmMutation,
  type AccountConfirmMutationVariables,
  type AccountDeleteMutation,
  type AccountRequestDeletionMutation,
  type AccountUpdateMutation,
  type ConfirmEmailChangeMutation,
  type CreateAccountAddressMutation,
  type DeleteAccountAddressMutation,
  type ExternalAuthenticationUrlMutation,
  type ExternalLogoutMutation,
  type ExternalObtainAccessTokensMutation,
  type ExternalRefreshMutation,
  type ExternalVerifyMutation,
  type LoginMutation,
  type MutationAccountAddressCreateArgs,
  type MutationAccountAddressUpdateArgs,
  type MutationAccountSetDefaultAddressArgs,
  type MutationAccountUpdateArgs,
  type MutationExternalAuthenticationUrlArgs,
  type MutationExternalLogoutArgs,
  type MutationExternalObtainAccessTokensArgs,
  type MutationPasswordChangeArgs,
  type MutationRequestEmailChangeArgs,
  type MutationSetPasswordArgs,
  type MutationTokenCreateArgs,
  type PasswordChangeMutation,
  type RefreshTokenMutation,
  type RequestEmailChangeMutation,
  type SetAccountDefaultAddressMutation,
  type SetPasswordMutation,
  type UpdateAccountAddressMutation,
  type VerifyTokenMutation,
} from "../apollo/types";
import { type AuthSDK } from "./auth";
import { type State } from "./state";
import { type UserSDK } from "./user";

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

// Methods opts
// Auth
export type ChangePasswordOpts = MutationPasswordChangeArgs;
export type LoginOpts = MutationTokenCreateArgs & { includeDetails?: boolean };
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

// Methods results
// Auth
export type ChangePasswordResult = FetchResult<PasswordChangeMutation>;
export type LoginResult = FetchResult<LoginMutation>;
export type LoginData = LoginMutation["tokenCreate"];
export type LogoutResult = FetchResult<ExternalLogoutMutation> | null;
export type RefreshTokenResult = FetchResult<RefreshTokenMutation>;
export type SetPasswordResult = FetchResult<SetPasswordMutation>;
export type VerifyTokenResult = FetchResult<VerifyTokenMutation>;
export type GetExternalAuthUrlResult = FetchResult<ExternalAuthenticationUrlMutation>;
export type GetExternalAuthUrlData = ExternalAuthenticationUrlMutation["externalAuthenticationUrl"];
export type GetExternalAccessTokenResult = FetchResult<ExternalObtainAccessTokensMutation>;
export type GetExternalAccessTokenData =
  ExternalObtainAccessTokensMutation["externalObtainAccessTokens"];
export type RefreshExternalTokenResult = FetchResult<ExternalRefreshMutation>;
export type VerifyExternalTokenResult = FetchResult<ExternalVerifyMutation>;
// User
export type AccountDeleteResult = FetchResult<AccountDeleteMutation>;
export type AccountRequestDeletionResult = FetchResult<AccountRequestDeletionMutation>;
export type ConfirmEmailChangeResult = FetchResult<ConfirmEmailChangeMutation>;
export type CreateAccountAddressResult = FetchResult<CreateAccountAddressMutation>;
export type DeleteAccountAddressResult = FetchResult<DeleteAccountAddressMutation>;
export type RequestEmailChangeResult = FetchResult<RequestEmailChangeMutation>;
export type SetAccountDefaultAddressResult = FetchResult<SetAccountDefaultAddressMutation>;

export type UpdateAccountResult = FetchResult<AccountUpdateMutation>;
export type UpdateAccountAddressResult = FetchResult<UpdateAccountAddressMutation>;
export type ConfirmAccountResult = FetchResult<AccountConfirmMutation>;
