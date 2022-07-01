import {
  Card,
  CardContent,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { Button } from "@saleor/components/Button";
import CardTitle from "@saleor/components/CardTitle";
import RadioGroupField from "@saleor/components/RadioGroupField";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import {
  PostalCodeRuleInclusionTypeEnum,
  ShippingMethodTypeFragment,
} from "@saleor/graphql";
import ArrowDropdown from "@saleor/icons/ArrowDropdown";
import { DeleteIcon, IconButton, makeStyles } from "@saleor/macaw-ui";
import { renderCollection } from "@saleor/misc";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface ShippingZonePostalCodesProps {
  disabled: boolean;
  initialExpanded?: boolean;
  postalCodes: ShippingMethodTypeFragment["postalCodeRules"] | undefined;
  onPostalCodeInclusionChange: (
    inclusion: PostalCodeRuleInclusionTypeEnum,
  ) => void;
  onPostalCodeDelete: (
    code: ShippingMethodTypeFragment["postalCodeRules"][0],
  ) => void;
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
    return (
      postalCodes[0]?.inclusionType || PostalCodeRuleInclusionTypeEnum.EXCLUDE
    );
  };

  const onInclusionRadioChange = (event: React.ChangeEvent<any>) => {
    const value = event.target.value;
    setInclusionType(value);
    onPostalCodeInclusionChange(value);
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
    <Card>
      <CardTitle
        title={intl.formatMessage({
          id: "FcTTvh",
          defaultMessage: "Postal codes",
          description: "postal codes, header",
        })}
        toolbar={
          <Button
            onClick={onPostalCodeRangeAdd}
            data-test-id="add-postal-code-range"
          >
            <FormattedMessage
              id="1lk/oS"
              defaultMessage="Add postal code range"
              description="button"
            />
          </Button>
        }
      />
      <CardContent className={classNames(classes.radioContainer)}>
        <RadioGroupField
          alignTop
          choices={[
            {
              label: (
                <div className={classes.option}>
                  <Typography variant="body1">
                    <FormattedMessage
                      id="YpLVVc"
                      defaultMessage="Exclude postal codes"
                      description="action"
                    />
                  </Typography>
                  <Typography color="textSecondary" variant="caption">
                    <FormattedMessage
                      id="ju8zHP"
                      defaultMessage="Added postal codes will be excluded from using this delivery methods. If none are added all postal codes will be able to use that shipping rate"
                    />
                  </Typography>
                </div>
              ),
              value: PostalCodeRuleInclusionTypeEnum.EXCLUDE,
            },
            {
              label: (
                <div className={classes.option}>
                  <Typography variant="body1">
                    <FormattedMessage
                      id="7qsOwa"
                      defaultMessage="Include postal codes"
                      description="action"
                    />
                  </Typography>
                  <Typography color="textSecondary" variant="caption">
                    <FormattedMessage
                      id="/Zee1r"
                      defaultMessage="Only added postal codes will be able to use this shipping rate"
                    />
                  </Typography>
                </div>
              ),
              value: PostalCodeRuleInclusionTypeEnum.INCLUDE,
            },
          ]}
          name="includePostalCodes"
          value={getInclusionType()}
          onChange={onInclusionRadioChange}
        />
      </CardContent>
      <ResponsiveTable>
        <colgroup>
          <col />
          <col className={classes.colAction} />
        </colgroup>
        <TableHead>
          <TableRow>
            <TableCell>
              {postalCodes === undefined ? (
                <Skeleton className={classes.skeleton} />
              ) : (
                <Typography variant="caption">
                  <FormattedMessage
                    id="ud0w8h"
                    defaultMessage="{number} postal code ranges"
                    description="number of postal code ranges"
                    values={{
                      number: postalCodes.length,
                    }}
                  />
                </Typography>
              )}
            </TableCell>
            <TableCell>
              <IconButton
                variant="secondary"
                onClick={() => setExpanded(!expanded)}
              >
                <ArrowDropdown
                  className={classNames(classes.arrow, {
                    [classes.arrowRotate]: expanded,
                  })}
                />
              </IconButton>
            </TableCell>
          </TableRow>
        </TableHead>
        {expanded && (
          <TableBody>
            {renderCollection(
              postalCodes,
              postalCodeRange => (
                <TableRow key={postalCodeRange?.id}>
                  <TableCell>
                    {getPostalCodeRangeLabel(postalCodeRange)}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      disabled={disabled}
                      color="primary"
                      onClick={() => onPostalCodeDelete(postalCodeRange)}
                      data-test-id={"delete-postal-code-" + postalCodeRange?.id}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ),
              () => (
                <TableRow>
                  <TableCell colSpan={2}>
                    <Typography color="textSecondary">
                      <FormattedMessage
                        id="Pyjarj"
                        defaultMessage="This shipping rate has no postal codes assigned"
                      />
                    </Typography>
                  </TableCell>
                </TableRow>
              ),
            )}
          </TableBody>
        )}
      </ResponsiveTable>
    </Card>
  );
};

ShippingZonePostalCodes.displayName = "ShippingZonePostalCodes";
export default ShippingZonePostalCodes;
