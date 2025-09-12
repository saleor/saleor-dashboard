import jwtDecode from "jwt-decode";

import { createApolloClient } from "../apollo";
import { DEVELOPMENT_MODE, WINDOW_EXISTS } from "../constants";
import { isInternalToken } from "../helpers";
import { auth } from "./auth";
import { getState, State } from "./state";
import { createStorage, storage } from "./storage";
import { JWTToken, SaleorClient, SaleorClientOpts } from "./types";
import { user } from "./user";

export const createSaleorClient = ({
  apiUrl,
  channel,
  opts = {},
}: SaleorClientOpts): SaleorClient => {
  let _channel = channel;
  const { autologin = true, fetchOpts } = opts;

  const setChannel = (channel: string): string => {
    _channel = channel;

    return _channel;
  };

  createStorage(autologin);

  const apolloClient = createApolloClient(apiUrl, autologin, fetchOpts);
  const coreInternals = { apolloClient, channel: _channel };
  const authSDK = auth(coreInternals);
  const userSDK = user(coreInternals);

  const refreshToken = storage.getRefreshToken();

  if (autologin && refreshToken) {
    const owner = jwtDecode<JWTToken>(refreshToken).owner;

    if (isInternalToken(owner)) {
      authSDK.refreshToken(true);
    } else {
      authSDK.refreshExternalToken(true);
    }
  }

  const client = {
    auth: authSDK,
    user: userSDK,
    config: { channel: _channel, setChannel, autologin },
    _internal: { apolloClient },
    getState: (): State => getState(apolloClient),
  };

  if (DEVELOPMENT_MODE && WINDOW_EXISTS) {
    (window as any).__SALEOR_CLIENT__ = client;
  }

  return client;
};
