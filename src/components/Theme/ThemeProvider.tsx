import { MuiThemeProvider } from "@material-ui/core/styles";
import React from "react";
import Helmet from "react-helmet";

import Baseline from "../../Baseline";
import createTheme from "../../theme";
import { dark, light } from "./themes";

interface IThemeContext {
  isDark: boolean;
  toggleTheme: () => void;
}
export const ThemeContext = React.createContext<IThemeContext>({
  isDark: false,
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
  const toggleTheme = () => {
    setDark(!isDark);
    localStorage.setItem("theme", (!isDark).toString());

    // If iframe is embedded, tell it to switch themne
    const appFrame: HTMLIFrameElement = document.querySelector(
      "#extension-app"
    );

    if (!!appFrame) {
      appFrame.contentWindow.postMessage(
        {
          type: "toggle-dark-theme",
          value: !isDark
        },
        "*" // It's just a theme, no need to worry about data leaks
      );
    }
  };

  const theme = createTheme(isDark ? dark : light);

  return (
    <ThemeContext.Provider
      value={{
        isDark,
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
