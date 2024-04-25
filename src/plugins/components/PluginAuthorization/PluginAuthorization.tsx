import { Button } from "@dashboard/components/Button";
import CardTitle from "@dashboard/components/CardTitle";
import Hr from "@dashboard/components/Hr";
import { ConfigurationItemFragment, ConfigurationTypeFieldEnum } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { isSecretField } from "@dashboard/plugins/utils";
import { Card, CardContent, Typography } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface PluginAuthorizationProps {
  fields: ConfigurationItemFragment[];
  onClear: (field: string) => void;
  onEdit: (field: string) => void;
}

const useStyles = makeStyles(
  theme => ({
    button: {
      marginLeft: theme.spacing(),
    },
    hr: {
      margin: theme.spacing(2, 0),
    },
    item: {
      alignItems: "center",
      display: "flex",
    },
    spacer: {
      flex: 1,
    },
  }),
  { name: "PluginAuthorization" },
);
const PluginAuthorization: React.FC<PluginAuthorizationProps> = props => {
  const { fields, onClear, onEdit } = props;
  const classes = useStyles(props);
  const intl = useIntl();
  const secretFields = fields.filter(field => isSecretField(fields, field.name));

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          id: "6aBkJm",
          defaultMessage: "Authorization",
          description: "section header",
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
                  {field.value !== null && <Typography>**** {field.value}</Typography>}
                </div>
              ) : (
                <Typography variant="body1">{field.label}</Typography>
              )}
              <div className={classes.spacer} />
              {field.value === null ? (
                <Button className={classes.button} onClick={() => onEdit(field.name)}>
                  <FormattedMessage {...buttonMessages.create} />
                </Button>
              ) : (
                <>
                  <Button onClick={() => onClear(field.name)}>
                    <FormattedMessage {...buttonMessages.clear} />
                  </Button>
                  <Button className={classes.button} onClick={() => onEdit(field.name)}>
                    <FormattedMessage {...buttonMessages.edit} />
                  </Button>
                </>
              )}
            </div>
            {fieldIndex !== secretFields.length - 1 && <Hr className={classes.hr} />}
          </React.Fragment>
        ))}
      </CardContent>
    </Card>
  );
};

PluginAuthorization.displayName = "PluginAuthorization";
export default PluginAuthorization;
