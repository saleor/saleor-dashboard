import React from "react";

import { MutationFunction, MutationResult } from "react-apollo";
import { UserContext } from "./";
import { TypedTokenAuthMutation, TypedVerifyTokenMutation } from "./mutations";
import { TokenAuth, TokenAuthVariables } from "./types/TokenAuth";
import { User } from "./types/User";
import { VerifyToken, VerifyTokenVariables } from "./types/VerifyToken";
import { getAuthToken, removeAuthToken, setAuthToken } from "./utils";

interface AuthProviderOperationsProps {
  children: (props: {
    hasToken: boolean;
    isAuthenticated: boolean;
    tokenAuthLoading: boolean;
    tokenVerifyLoading: boolean;
    user: User;
  }) => React.ReactNode;
}
const AuthProviderOperations: React.StatelessComponent<
  AuthProviderOperationsProps
> = ({ children }) => {
  return (
    <TypedTokenAuthMutation>
      {(...tokenAuth) => (
        <TypedVerifyTokenMutation>
          {(...tokenVerify) => (
            <AuthProvider tokenAuth={tokenAuth} tokenVerify={tokenVerify}>
              {children}
            </AuthProvider>
          )}
        </TypedVerifyTokenMutation>
      )}
    </TypedTokenAuthMutation>
  );
};

interface AuthProviderProps {
  children: (props: {
    hasToken: boolean;
    isAuthenticated: boolean;
    tokenAuthLoading: boolean;
    tokenVerifyLoading: boolean;
    user: User;
  }) => React.ReactNode;
  tokenAuth: [
    MutationFunction<TokenAuth, TokenAuthVariables>,
    MutationResult<TokenAuth>
  ];
  tokenVerify: [
    MutationFunction<VerifyToken, VerifyTokenVariables>,
    MutationResult<VerifyToken>
  ];
}

interface AuthProviderState {
  user: User;
  persistToken: boolean;
}

class AuthProvider extends React.Component<
  AuthProviderProps,
  AuthProviderState
> {
  constructor(props) {
    super(props);
    this.state = { user: undefined, persistToken: false };
  }

  componentWillReceiveProps(props: AuthProviderProps) {
    const { tokenAuth, tokenVerify } = props;
    const tokenAuthOpts = tokenAuth[1];
    const tokenVerifyOpts = tokenVerify[1];

    if (tokenAuthOpts.error || tokenVerifyOpts.error) {
      this.logout();
    }
    if (tokenAuthOpts.data) {
      const user = tokenAuthOpts.data.tokenCreate.user;
      // FIXME: Now we set state also when auth fails and returned user is
      // `null`, because the LoginView uses this `null` to display error.
      this.setState({ user });
      if (user) {
        setAuthToken(
          tokenAuthOpts.data.tokenCreate.token,
          this.state.persistToken
        );
      }
    } else {
      if (tokenVerifyOpts.data && tokenVerifyOpts.data.tokenVerify.user) {
        const user = tokenVerifyOpts.data.tokenVerify.user;
        this.setState({ user });
      }
    }
  }

  componentDidMount() {
    const { user } = this.state;
    const token = getAuthToken();
    if (!!token && !user) {
      this.verifyToken(token);
    }
  }

  login = (email: string, password: string, persistToken: boolean) => {
    const { tokenAuth } = this.props;
    const [tokenAuthFn] = tokenAuth;

    this.setState({ persistToken });
    tokenAuthFn({ variables: { email, password } });
  };

  loginByToken = (token: string, user: User) => {
    this.setState({ user });
    setAuthToken(token, this.state.persistToken);
  };

  logout = () => {
    this.setState({ user: undefined });
    removeAuthToken();
  };

  verifyToken = (token: string) => {
    const { tokenVerify } = this.props;
    const [tokenVerifyFn] = tokenVerify;

    return tokenVerifyFn({ variables: { token } });
  };

  render() {
    const { children, tokenAuth, tokenVerify } = this.props;
    const tokenAuthOpts = tokenAuth[1];
    const tokenVerifyOpts = tokenVerify[1];
    const { user } = this.state;
    const isAuthenticated = !!user;

    return (
      <UserContext.Provider
        value={{
          login: this.login,
          loginByToken: this.loginByToken,
          logout: this.logout,
          tokenAuthLoading: tokenAuthOpts.loading,
          tokenVerifyLoading: tokenVerifyOpts.loading,
          user
        }}
      >
        {children({
          hasToken: !!getAuthToken(),
          isAuthenticated,
          tokenAuthLoading: tokenAuthOpts.loading,
          tokenVerifyLoading: tokenVerifyOpts.loading,
          user
        })}
      </UserContext.Provider>
    );
  }
}

export default AuthProviderOperations;
