// @ts-strict-ignore
import { Button } from "@dashboard/components/Button";
import { DashboardCard } from "@dashboard/components/Card";
import RadioGroupField from "@dashboard/components/RadioGroupField";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import TableRowLink from "@dashboard/components/TableRowLink";
import { PostalCodeRuleInclusionTypeEnum, ShippingMethodTypeFragment } from "@dashboard/graphql";
import ArrowDropdown from "@dashboard/icons/ArrowDropdown";
import { renderCollection } from "@dashboard/misc";
import { TableBody, TableCell, TableHead } from "@material-ui/core";
import { DeleteIcon, IconButton, makeStyles } from "@saleor/macaw-ui";
import { Skeleton, Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface ShippingZonePostalCodesProps {
  disabled: boolean;
  initialExpanded?: boolean;
  postalCodes: ShippingMethodTypeFragment["postalCodeRules"] | undefined;
  onPostalCodeInclusionChange: (inclusion: PostalCodeRuleInclusionTypeEnum) => void;
  onPostalCodeDelete: (code: ShippingMethodTypeFragment["postalCodeRules"][0]) => void;
  onPostalCodeRangeAdd: () => void;
}

const useStyles = makeStyles(
  theme => ({
    arrow: {
      transition: theme.transitions.create("transform"),
    },
    arrowRotate: {
      transform: "scale(-1)",
    },
    colAction: {
      width: 80,
    },
    colCode: {},
    option: {
      marginBottom: theme.spacing(2),
      width: 400,
    },
    radioContainer: {
      paddingBottom: 0,
    },
    skeleton: {
      width: 80,
    },
  }),
  {
    name: "ShippingZonePostalCodes",
  },
);
const ShippingZonePostalCodes: React.FC<ShippingZonePostalCodesProps> = ({
  disabled,
  initialExpanded = true,
  postalCodes,
  onPostalCodeDelete,
  onPostalCodeInclusionChange,
  onPostalCodeRangeAdd,
}) => {
  const [expanded, setExpanded] = React.useState(initialExpanded);
  const [inclusionType, setInclusionType] = React.useState(null);
  const intl = useIntl();
  const classes = useStyles({});
  const getInclusionType = () => {
    if (inclusionType) {
      return inclusionType;
    }

    return postalCodes[0]?.inclusionType || PostalCodeRuleInclusionTypeEnum.EXCLUDE;
  };
  const onInclusionRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const postalType =
      value === "EXCLUDE"
        ? PostalCodeRuleInclusionTypeEnum.EXCLUDE
        : PostalCodeRuleInclusionTypeEnum.INCLUDE;

    setInclusionType(value);
    onPostalCodeInclusionChange(postalType);
  };
  const getPostalCodeRangeLabel = (
    postalCodeRange: ShippingMethodTypeFragment["postalCodeRules"][0],
  ) => {
    if (!postalCodeRange?.start) {
      return <Skeleton />;
    }

    if (postalCodeRange?.end) {
      return `${postalCodeRange.start} - ${postalCodeRange.end}`;
    }

    return postalCodeRange.start;
  };

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage({
            id: "FcTTvh",
            defaultMessage: "Postal codes",
            description: "postal codes, header",
          })}
        </DashboardCard.Title>
        <DashboardCard.Toolbar>
          <Button onClick={onPostalCodeRangeAdd} data-test-id="add-postal-code-range">
            <FormattedMessage
              id="1lk/oS"
              defaultMessage="Add postal code range"
              description="button"
            />
          </Button>
        </DashboardCard.Toolbar>
      </DashboardCard.Header>
      <DashboardCard.Content className={clsx(classes.radioContainer)}>
        <RadioGroupField
          alignTop
          choices={[
            {
              label: (
                <div className={classes.option}>
                  <Text size={4} fontWeight="regular">
                    <FormattedMessage
                      id="YpLVVc"
                      defaultMessage="Exclude postal codes"
                      description="action"
                    />
                  </Text>
                  <Text color="default2" size={2} fontWeight="light">
                    <FormattedMessage
                      id="ju8zHP"
                      defaultMessage="Added postal codes will be excluded from using this delivery methods. If none are added all postal codes will be able to use that shipping rate"
                    />
                  </Text>
                </div>
              ),
              value: PostalCodeRuleInclusionTypeEnum.EXCLUDE,
            },
            {
              label: (
                <div className={classes.option}>
                  <Text size={4} fontWeight="regular">
                    <FormattedMessage
                      id="7qsOwa"
                      defaultMessage="Include postal codes"
                      description="action"
                    />
                  </Text>
                  <Text color="default2" size={2} fontWeight="light">
                    <FormattedMessage
                      id="/Zee1r"
                      defaultMessage="Only added postal codes will be able to use this shipping rate"
                    />
                  </Text>
                </div>
              ),
              value: PostalCodeRuleInclusionTypeEnum.INCLUDE,
            },
          ]}
          name="includePostalCodes"
          value={getInclusionType()}
          onChange={onInclusionRadioChange}
        />
      </DashboardCard.Content>
      <ResponsiveTable>
        <colgroup>
          <col />
          <col className={classes.colAction} />
        </colgroup>
        <TableHead>
          <TableRowLink>
            <TableCell>
              {postalCodes === undefined ? (
                <Skeleton className={classes.skeleton} />
              ) : (
                <Text size={2} fontWeight="light">
                  <FormattedMessage
                    id="ud0w8h"
                    defaultMessage="{number} postal code ranges"
                    description="number of postal code ranges"
                    values={{
                      number: postalCodes.length,
                    }}
                  />
                </Text>
              )}
            </TableCell>
            <TableCell>
              <IconButton variant="secondary" onClick={() => setExpanded(!expanded)}>
                <ArrowDropdown
                  className={clsx(classes.arrow, {
                    [classes.arrowRotate]: expanded,
                  })}
                />
              </IconButton>
            </TableCell>
          </TableRowLink>
        </TableHead>
        {expanded && (
          <TableBody>
            {renderCollection(
              postalCodes,
              postalCodeRange => (
                <TableRowLink key={postalCodeRange?.id} data-test-id="assigned-postal-codes-rows">
                  <TableCell>{getPostalCodeRangeLabel(postalCodeRange)}</TableCell>
                  <TableCell>
                    <IconButton
                      disabled={disabled}
                      color="primary"
                      variant="secondary"
                      onClick={() => onPostalCodeDelete(postalCodeRange)}
                      data-test-id={"delete-postal-code-" + postalCodeRange?.id}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRowLink>
              ),
              () => (
                <TableRowLink>
                  <TableCell colSpan={2}>
                    <Text color="default2">
                      <FormattedMessage
                        id="Pyjarj"
                        defaultMessage="This shipping rate has no postal codes assigned"
                      />
                    </Text>
                  </TableCell>
                </TableRowLink>
              ),
            )}
          </TableBody>
        )}
      </ResponsiveTable>
    </DashboardCard>
  );
};

ShippingZonePostalCodes.displayName = "ShippingZonePostalCodes";
export default ShippingZonePostalCodes;
