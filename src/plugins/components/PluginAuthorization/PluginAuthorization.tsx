import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import CardTitle from "@saleor/components/CardTitle";
import Hr from "@saleor/components/Hr";
import { buttonMessages } from "@saleor/intl";
import { Plugin_plugin_configuration } from "@saleor/plugins/types/Plugin";
import { isSecretField } from "@saleor/plugins/utils";
import { ConfigurationTypeFieldEnum } from "@saleor/types/globalTypes";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface PluginAuthorizationProps {
  fields: Plugin_plugin_configuration[];
  onClear: (field: string) => void;
  onEdit: (field: string) => void;
}

const useStyles = makeStyles(
  theme => ({
    button: {
      marginLeft: theme.spacing()
    },
    hr: {
      margin: theme.spacing(2, 0)
    },
    item: {
      alignItems: "center",
      display: "flex"
    },
    spacer: {
      flex: 1
    }
  }),
  { name: "PluginAuthorization" }
);

const PluginAuthorization: React.FC<PluginAuthorizationProps> = props => {
  const { fields, onClear, onEdit } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  const secretFields = fields.filter(field =>
    isSecretField(fields, field.name)
  );

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Authorization",
          description: "section header"
        })}
      />
      <CardContent>
        {secretFields.map((field, fieldIndex) => (
          <React.Fragment key={field.name}>
            <div className={classes.item} key={field.name}>
              {field.type === ConfigurationTypeFieldEnum.SECRET ||
              field.type === ConfigurationTypeFieldEnum.SECRETMULTILINE ? (
                <div>
                  <Typography variant="body1">{field.label}</Typography>
                  {field.value !== null && (
                    <Typography>**** {field.value}</Typography>
                  )}
                </div>
              ) : (
                <Typography variant="body1">{field.label}</Typography>
              )}
              <div className={classes.spacer} />
              {field.value === null ? (
                <Button
                  className={classes.button}
                  color="primary"
                  onClick={() => onEdit(field.name)}
                >
                  <FormattedMessage {...buttonMessages.create} />
                </Button>
              ) : (
                <>
                  <Button color="primary" onClick={() => onClear(field.name)}>
                    <FormattedMessage {...buttonMessages.clear} />
                  </Button>
                  <Button
                    className={classes.button}
                    color="primary"
                    onClick={() => onEdit(field.name)}
                  >
                    <FormattedMessage {...buttonMessages.edit} />
                  </Button>
                </>
              )}
            </div>
            {fieldIndex !== secretFields.length - 1 && (
              <Hr className={classes.hr} />
            )}
          </React.Fragment>
        ))}
      </CardContent>
    </Card>
  );
};

PluginAuthorization.displayName = "PluginAuthorization";
export default PluginAuthorization;
