import {
  Button,
  Card,
  CardContent,
  IconButton,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import CardTitle from "@saleor/components/CardTitle";
import RadioGroupField from "@saleor/components/RadioGroupField";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import { ShippingMethodFragment_postalCodeRules } from "@saleor/fragments/types/ShippingMethodFragment";
import ArrowDropdown from "@saleor/icons/ArrowDropdown";
import { renderCollection } from "@saleor/misc";
import { makeStyles } from "@saleor/theme";
import { PostalCodeRuleInclusionTypeEnum } from "@saleor/types/globalTypes";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface ShippingZonePostalCodesProps {
  disabled: boolean;
  initialExpanded?: boolean;
  postalCodes: ShippingMethodFragment_postalCodeRules[] | undefined;
  onPostalCodeInclusionChange: (
    inclusion: PostalCodeRuleInclusionTypeEnum
  ) => void;
  onPostalCodeDelete: (code: ShippingMethodFragment_postalCodeRules) => void;
  onPostalCodeRangeAdd: () => void;
}

const useStyles = makeStyles(
  theme => ({
    arrow: {
      transition: theme.transitions.create("transform")
    },
    arrowRotate: {
      transform: "scale(-1)"
    },
    colAction: {
      width: 80
    },
    colCode: {},
    option: {
      marginBottom: theme.spacing(2),
      width: 400
    },
    radioContainer: {
      paddingBottom: 0
    },
    skeleton: {
      width: 80
    }
  }),
  {
    name: "ShippingZonePostalCodes"
  }
);

const ShippingZonePostalCodes: React.FC<ShippingZonePostalCodesProps> = ({
  disabled,
  initialExpanded = true,
  postalCodes,
  onPostalCodeDelete,
  onPostalCodeInclusionChange,
  onPostalCodeRangeAdd
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
    postalCodeRange: ShippingMethodFragment_postalCodeRules
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
          defaultMessage: "Postal codes",
          description: "postal codes, header"
        })}
        toolbar={
          <Button
            color="primary"
            onClick={onPostalCodeRangeAdd}
            data-test="add-postal-code-range"
          >
            <FormattedMessage
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
                      defaultMessage="Exclude postal codes"
                      description="action"
                    />
                  </Typography>
                  <Typography color="textSecondary" variant="caption">
                    <FormattedMessage defaultMessage="Added postal codes will be excluded from using this delivery methods. If none are added all postal codes will be able to use that shipping rate" />
                  </Typography>
                </div>
              ),
              value: PostalCodeRuleInclusionTypeEnum.EXCLUDE
            },
            {
              label: (
                <div className={classes.option}>
                  <Typography variant="body1">
                    <FormattedMessage
                      defaultMessage="Include postal codes"
                      description="action"
                    />
                  </Typography>
                  <Typography color="textSecondary" variant="caption">
                    <FormattedMessage defaultMessage="Only added postal codes will be able to use this shipping rate" />
                  </Typography>
                </div>
              ),
              value: PostalCodeRuleInclusionTypeEnum.INCLUDE
            }
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
                    defaultMessage="{number} postal code ranges"
                    description="number of postal code ranges"
                    values={{
                      number: postalCodes.length
                    }}
                  />
                </Typography>
              )}
            </TableCell>
            <TableCell>
              <IconButton onClick={() => setExpanded(!expanded)}>
                <ArrowDropdown
                  className={classNames(classes.arrow, {
                    [classes.arrowRotate]: expanded
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
                      data-test="delete-postal-code"
                      data-test-id={postalCodeRange?.id}
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
                      <FormattedMessage defaultMessage="This shipping rate has no postal codes assigned" />
                    </Typography>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        )}
      </ResponsiveTable>
    </Card>
  );
};

ShippingZonePostalCodes.displayName = "ShippingZonePostalCodes";
export default ShippingZonePostalCodes;
