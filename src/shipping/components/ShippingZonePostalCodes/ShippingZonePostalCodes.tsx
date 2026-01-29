// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Placeholder } from "@dashboard/components/Placeholder";
import RadioGroupField from "@dashboard/components/RadioGroupField";
import { ResponsiveTable } from "@dashboard/components/ResponsiveTable";
import TableRowLink from "@dashboard/components/TableRowLink";
import { PostalCodeRuleInclusionTypeEnum, ShippingMethodTypeFragment } from "@dashboard/graphql";
import { TableBody, TableCell, TableHead } from "@material-ui/core";
import { IconButton, makeStyles } from "@saleor/macaw-ui";
import { Button, Skeleton, Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { ChevronDown, Trash2 } from "lucide-react";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface ShippingZonePostalCodesProps {
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
      transform: "rotate(180deg)",
    },
    colAction: {
      width: 80,
    },
    colCode: {},
    iconCell: {
      textAlign: "right",
    },
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
const ShippingZonePostalCodes = ({
  disabled,
  initialExpanded = true,
  postalCodes,
  onPostalCodeDelete,
  onPostalCodeInclusionChange,
  onPostalCodeRangeAdd,
}: ShippingZonePostalCodesProps) => {
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
          <Button
            onClick={onPostalCodeRangeAdd}
            data-test-id="add-postal-code-range"
            variant="secondary"
          >
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
                  <Text color="default2" size={2} fontWeight="light" display="block">
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
                  <Text color="default2" size={2} fontWeight="light" display="block">
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
      <DashboardCard.Content>
        {postalCodes === undefined ? (
          <Skeleton />
        ) : postalCodes.length === 0 ? (
          <Placeholder>
            <FormattedMessage
              id="Pyjarj"
              defaultMessage="This shipping rate has no postal codes assigned"
            />
          </Placeholder>
        ) : (
          <ResponsiveTable>
            <colgroup>
              <col />
              <col className={classes.colAction} />
            </colgroup>
            <TableHead>
              <TableRowLink>
                <TableCell>
                  <Text size={2} fontWeight="light">
                    <FormattedMessage
                      id="GjEdSd"
                      defaultMessage="{number, plural, one {# postal code range} other {# postal code ranges}}"
                      description="number of postal code ranges"
                      values={{
                        number: postalCodes.length,
                      }}
                    />
                  </Text>
                </TableCell>
                <TableCell className={classes.iconCell}>
                  <IconButton variant="secondary" onClick={() => setExpanded(!expanded)}>
                    <ChevronDown
                      size={iconSize.small}
                      strokeWidth={iconStrokeWidthBySize.small}
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
                {postalCodes?.map(postalCodeRange => (
                  <TableRowLink key={postalCodeRange?.id} data-test-id="assigned-postal-codes-rows">
                    <TableCell>{getPostalCodeRangeLabel(postalCodeRange)}</TableCell>
                    <TableCell className={classes.iconCell}>
                      <IconButton
                        disabled={disabled}
                        color="primary"
                        variant="secondary"
                        onClick={() => onPostalCodeDelete(postalCodeRange)}
                        data-test-id={"delete-postal-code-" + postalCodeRange?.id}
                      >
                        <Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
                      </IconButton>
                    </TableCell>
                  </TableRowLink>
                ))}
              </TableBody>
            )}
          </ResponsiveTable>
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};

ShippingZonePostalCodes.displayName = "ShippingZonePostalCodes";
export default ShippingZonePostalCodes;
