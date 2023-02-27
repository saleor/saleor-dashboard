import { makeStyles } from '@saleor/macaw-ui';
import { vars } from '@saleor/macaw-ui/next';

export const useStyles = makeStyles(
  theme => ({
    eventsWrapper: {
      padding: theme.spacing(4),
      paddingLeft: 0,
    },
    objectsWrapper: {
      borderRight: '1px solid',
      borderRightColor: vars.colors.border.neutralPlain,
      padding: theme.spacing(3),
    },
    listHeader: {
      textTransform: 'uppercase',
      padding: theme.spacing(1),
      minHeight: 0,
    },
    listBody: {
      height: 300,
      overflowY: 'auto',
    },
    listItem: {
      minHeight: 0,
      gap: 0,
      padding: theme.spacing(1),
    },
    listItemCell: {
      paddingLeft: '0 !important',
      wordBreak: 'break-all',
    },
    checkbox: {
      padding: 0,
    },
    card: {
      paddingLeft: 0,
    },
  }),
  { name: 'WebhookEvents' },
);
