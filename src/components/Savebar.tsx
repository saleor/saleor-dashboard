import { buttonMessages, commonMessages } from "@dashboard/intl";
import {
  makeStyles,
  Savebar as MacawSavebar,
  SavebarLabels,
  SavebarProps as MacawSavebarProps,
} from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { savebarHeight } from "./AppLayout/consts";

export interface SavebarProps extends Omit<MacawSavebarProps, "labels"> {
  labels?: Partial<SavebarLabels>;
}

const useStyles = makeStyles(
  {
    root: {
      height: savebarHeight,
      "& .MuiContainer-root": {
        paddingRight: 0,
        paddingLeft: 0,
        maxWidth: "100%",
        margin: "0 auto",
      },
      "& .MuiPaper-root": {
        boxShadow: "none",
      },
      "& .MuiCardContent-root": {
        marginTop: 0,
      },
    },
  },
  {
    name: "Savebar",
  },
);

export const Savebar: React.FC<SavebarProps> = ({ labels = {}, ...rest }) => {
  const intl = useIntl();
  const classes = useStyles();
  const defaultLabels: SavebarLabels = {
    cancel: intl.formatMessage(buttonMessages.back),
    confirm: intl.formatMessage(buttonMessages.save),
    delete: intl.formatMessage(buttonMessages.delete),
    error: intl.formatMessage(commonMessages.error),
  };
  const componentLabels: SavebarLabels = {
    ...defaultLabels,
    ...labels,
  };

  return <MacawSavebar labels={componentLabels} {...rest} className={classes.root} />;
};
Savebar.displayName = "SaveBar";
export default Savebar;
