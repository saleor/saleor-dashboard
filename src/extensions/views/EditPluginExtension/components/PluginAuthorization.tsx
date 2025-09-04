import { DashboardCard } from "@dashboard/components/Card";
import Hr from "@dashboard/components/Hr";
import { ConfigurationItemFragment, ConfigurationTypeFieldEnum } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { makeStyles } from "@saleor/macaw-ui";
import { Button, Text } from "@saleor/macaw-ui-next";
import { Fragment } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { isSecretField } from "../utils";

interface PluginAuthorizationProps {
  fields: ConfigurationItemFragment[];
  onClear: (field: string) => void;
  onEdit: (field: string) => void;
}

const useStyles = makeStyles(
  theme => ({
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

export const PluginAuthorization = (props: PluginAuthorizationProps) => {
  const { fields, onClear, onEdit } = props;
  const classes = useStyles(props);
  const intl = useIntl();
  const secretFields = fields.filter(field => isSecretField(fields, field.name));

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage({
            id: "6aBkJm",
            defaultMessage: "Authorization",
            description: "section header",
          })}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        {secretFields.map((field, fieldIndex) => (
          <Fragment key={field.name}>
            <div className={classes.item} key={field.name}>
              {field.type === ConfigurationTypeFieldEnum.SECRET ||
              field.type === ConfigurationTypeFieldEnum.SECRETMULTILINE ? (
                <div>
                  <Text size={4} fontWeight="regular">
                    {field.label}
                  </Text>
                  {field.value !== null && <Text>**** {field.value}</Text>}
                </div>
              ) : (
                <Text size={4} fontWeight="regular">
                  {field.label}
                </Text>
              )}
              <div className={classes.spacer} />
              {field.value === null ? (
                <Button variant="secondary" onClick={() => onEdit(field.name)}>
                  <FormattedMessage {...buttonMessages.create} />
                </Button>
              ) : (
                <>
                  <Button variant="secondary" onClick={() => onClear(field.name)}>
                    <FormattedMessage {...buttonMessages.clear} />
                  </Button>
                  <Button variant="secondary" onClick={() => onEdit(field.name)}>
                    <FormattedMessage {...buttonMessages.edit} />
                  </Button>
                </>
              )}
            </div>
            {fieldIndex !== secretFields.length - 1 && <Hr className={classes.hr} />}
          </Fragment>
        ))}
      </DashboardCard.Content>
    </DashboardCard>
  );
};

PluginAuthorization.displayName = "PluginAuthorization";
