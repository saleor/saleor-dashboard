import { ThemeContext } from "@saleor/components/Theme";
import { useContext } from "react";

function useTheme() {
  const themeInfo = useContext(ThemeContext);
  return themeInfo;
}
export default useTheme;
