import { Theme } from "@material-ui/core/styles";

const themeOverrides: Partial<Theme> = {
  overrides: {
    MuiTableCell: {
      body: {
        paddingBottom: 8,
        paddingTop: 8
      },
      root: {
        height: 56,
        padding: "4px 24px"
      }
    }
  }
};
export default themeOverrides;
