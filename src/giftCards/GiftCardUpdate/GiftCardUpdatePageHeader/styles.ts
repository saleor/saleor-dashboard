import { darken } from "@material-ui/core";
import { statusChipStyles } from "@saleor/components/StatusChip/StatusChip";
import { makeStyles } from "@saleor/macaw-ui";

export const useGiftCardEnableDisableSectionStyles = makeStyles(
  theme => ({
    button: {
      transition: "backgroundColor 0ms"
    },
    buttonRed: {
      backgroundColor: theme.palette.error.main,
      color: "#ffffff",

      "&:hover": {
        backgroundColor: darken(theme.palette.error.main, 0.1)
      }
    },
    buttonGreen: {
      backgroundColor: statusChipStyles.successLabel.color,

      "&:hover": {
        backgroundColor: darken(statusChipStyles.successLabel.color, 0.1)
      }
    }
  }),
  { name: "GiftCardEnableDisableSection" }
);
