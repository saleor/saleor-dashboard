import { alpha } from '@material-ui/core/styles';
import { makeStyles } from '@saleor/macaw-ui';

export const useStyles = makeStyles(
  theme => ({
    cancel: {
      marginRight: theme.spacing(1),
    },
    copy: {
      marginTop: theme.spacing(),
      marginRight: theme.spacing(),
      position: 'relative',
      right: theme.spacing(1),
    },
    mono: {
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
      fontSize: theme.typography.caption.fontSize,
    },
    paper: {
      background: alpha(theme.palette.primary.main, 0.05),
      padding: theme.spacing(2, 3),
      whiteSpace: 'pre-wrap',
    },
  }),
  {
    name: 'TokenCreateDialog',
  },
);
