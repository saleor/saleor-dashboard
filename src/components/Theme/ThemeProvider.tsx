// FIXME: https://github.com/mirumee/saleor/issues/4174
import OldMuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import MuiThemeProvider from "@material-ui/styles/ThemeProvider";
import React from "react";

import Baseline from "../../Baseline";
import createTheme, { IThemeColors } from "../../theme";

const dark: IThemeColors = {
  autofill: "#5D5881",
  background: {
    default: "#1D1E1F",
    paper: "#2E2F31"
  },
  checkbox: {
    default: "#FFFFFF"
  },
  divider: "#252728",
  error: "#C22D74",
  font: {
    button: "#202124",
    default: "#FCFCFC",
    gray: "#9E9D9D",
    textButton: "#FFFFFF",
    textDisabled: "#FCFCFC"
  },
  gray: {
    default: "#202124",
    disabled: "rgba(32, 33, 36, 0.6)"
  },
  input: {
    border: "#9d9d9d",
    default: "#25262A",
    disabled: "#393939",
    disabledBackground: "#292A2D",
    disabledText: "#9D9D9D",
    error: "#8C2054",
    text: "#FCFCFC",
    textHover: "#616161"
  },
  paperBorder: "#252728",
  primary: "#13BEBB",
  secondary: "#21125E"
};
const light: IThemeColors = {
  autofill: "#f4f6c5",
  background: {
    default: "#F1F6F6",
    paper: "#FFFFFF"
  },
  checkbox: {
    default: "#616161"
  },
  divider: "#EAEAEA",
  error: "#C22D74",
  font: {
    button: "#FFFFFF",
    default: "#3D3D3D",
    gray: "#616161",
    textButton: "#06847B",
    textDisabled: "#616161"
  },
  gray: {
    default: "#C8C8C8",
    disabled: "rgba(216, 216, 216, 0.3)"
  },
  input: {
    border: "#BDBDBD",
    default: "#FFFFFF",
    disabled: "#EAEAEA",
    disabledBackground: "#F4F4F4",
    disabledText: "#9D9D9D",
    error: "#8C2054",
    text: "#3D3D3D",
    textHover: "#616161"
  },
  paperBorder: "#EAEAEA",
  primary: "#06847B",
  secondary: "#21125E"
};

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
  };

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        toggleTheme
      }}
    >
      <OldMuiThemeProvider theme={createTheme(isDark ? dark : light)}>
        <MuiThemeProvider theme={createTheme(isDark ? dark : light)}>
          <Baseline />
          {children}
        </MuiThemeProvider>
      </OldMuiThemeProvider>
    </ThemeContext.Provider>
  );
};
ThemeProvider.defaultProps = {
  isDefaultDark: false
};
export default ThemeProvider;
