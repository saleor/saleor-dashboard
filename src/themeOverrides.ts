import { Theme } from "@material-ui/core/styles";

const themeOverrides: Partial<Theme> = {
  overrides: {
    MuiTableCell: {
      body: {
        paddingBottom: 8,
        paddingTop: 8
      },
      head: {
        height: 32
      },
      root: {
        height: 56,
        paddingBottom: 4,
        paddingTop: 4
      }
    }
  }
};
export default themeOverrides;
