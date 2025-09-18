import { useApolloClient } from "@apollo/client";
import useNotifier from "@dashboard/hooks/useNotifier";
import React from "react";
import { useIntl } from "react-intl";

import { UserContext } from "./";
import { useAuthProvider } from "./hooks/useAuthProvider";

/**
 * @interface AuthProviderProps
 * @property {React.ReactNode} children - 需要在 provider 中渲染的子组件。
 *
 * AuthProvider 组件的属性。
 */
interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider 组件，为其子组件提供与身份验证相关的数据和操作。
 *
 * 此组件使用 `useAuthProvider` 钩子创建身份验证 provider，并通过 `UserContext` 使其对所有后代组件可用。
 *
 * @param {AuthProviderProps} props - AuthProvider 组件的属性。
 * @returns {React.ReactElement} 一个向其子组件提供身份验证上下文的 React 元素。
 */
const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const apolloClient = useApolloClient();
  const intl = useIntl();
  const notify = useNotifier();
  const authProvider = useAuthProvider({ intl, notify, apolloClient });

  return <UserContext.Provider value={authProvider}>{children}</UserContext.Provider>;
};

export default AuthProvider;
