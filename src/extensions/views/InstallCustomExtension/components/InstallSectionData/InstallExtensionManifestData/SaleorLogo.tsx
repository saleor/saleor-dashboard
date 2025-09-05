import saleorLogoDarkMode from "@assets/images/sidebar-deafult-logo-darkMode.png";
import saleorLogoLightMode from "@assets/images/sidebar-default-logo.png";
import { useTheme } from "@dashboard/theme";
import { DefaultTheme } from "@saleor/macaw-ui-next";

const getSaleorLogoUrl = (theme: DefaultTheme) => {
  switch (theme) {
    case "defaultLight":
      return saleorLogoLightMode;
    case "defaultDark":
      return saleorLogoDarkMode;
    default:
      throw new Error("Invalid theme mode, should not happen.");
  }
};

export const SaleorLogo = () => {
  const { theme } = useTheme();

  return <img src={getSaleorLogoUrl(theme)} alt="" />;
};
