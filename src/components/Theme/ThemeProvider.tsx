import { MuiThemeProvider } from "@material-ui/core/styles";
import {
  ExtensionMessageType,
  sendMessageToExtension,
  ThemeChangeMessage
} from "@saleor/macaw-ui/extensions";
import React, { useEffect } from "react";
import Helmet from "react-helmet";

import Baseline from "../../Baseline";
import createTheme from "../../theme";
import { dark, light } from "./themes";

interface IThemeContext {
  isDark: boolean;
  sendThemeToExtension: () => void;
  toggleTheme: () => void;
}
export const ThemeContext = React.createContext<IThemeContext>({
  isDark: false,
  sendThemeToExtension: () => undefined,
  toggleTheme: () => undefined
});

interface ThemeProviderProps {
  isDefaultDark?: boolean;
}
const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  isDefaultDark
}) => {
  const [isDark, setDark] = React.useState(isDefaultDark);
  const sendThemeToExtension = () =>
    sendMessageToExtension<ThemeChangeMessage>(
      {
        theme: isDark ? "dark" : "light",
        type: ExtensionMessageType.THEME
      },
      "*"
    );

  const toggleTheme = () => {
    setDark(!isDark);
    localStorage.setItem("theme", (!isDark).toString());
  };

  useEffect(() => {
    sendThemeToExtension();
  }, [isDark]);

  const theme = createTheme(isDark ? dark : light);

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        sendThemeToExtension,
        toggleTheme
      }}
    >
      <Helmet>
        <meta name="theme-color" content={theme.palette.background.default} />
      </Helmet>
      <MuiThemeProvider theme={theme}>
        <Baseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
ThemeProvider.defaultProps = {
  isDefaultDark: false
};
export default ThemeProvider;
