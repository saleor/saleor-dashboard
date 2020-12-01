import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import CardTitle from "@saleor/components/CardTitle";
import RadioGroupField from "@saleor/components/RadioGroupField";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import { ShippingMethodFragment_zipCodeRules } from "@saleor/fragments/types/ShippingMethodFragment";
import { FormChange } from "@saleor/hooks/useForm";
import ArrowDropdown from "@saleor/icons/ArrowDropdown";
import { renderCollection } from "@saleor/misc";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export enum ZipCodeInclusion {
  Include,
  Exclude
}

export interface ShippingZoneZipCodesProps {
  data: Record<"includeZipCodes", ZipCodeInclusion>;
  disabled: boolean;
  initialExpanded?: boolean;
  zipCodes: ShippingMethodFragment_zipCodeRules[] | undefined;
  onZipCodeInclusionChange: FormChange;
  onZipCodeDelete: (id: string) => void;
  onZipCodeRangeAdd: () => void;
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
    hide: {
      display: "none"
    },
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
    name: "ShippingZoneZipCodes"
  }
);

const ShippingZoneZipCodes: React.FC<ShippingZoneZipCodesProps> = ({
  data,
  disabled,
  initialExpanded,
  zipCodes,
  onZipCodeDelete,
  onZipCodeInclusionChange,
  onZipCodeRangeAdd
}) => {
  const [expanded, setExpanded] = React.useState(initialExpanded);
  const intl = useIntl();
  const classes = useStyles({});

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "ZIP-Codes",
          description: "postal codes, header"
        })}
        toolbar={
          <Button
            color="primary"
            onClick={onZipCodeRangeAdd}
            data-test="add-zip-code-range"
          >
            <FormattedMessage
              defaultMessage="Add ZIP-Code range"
              description="button"
            />
          </Button>
        }
      />
      <CardContent className={classNames(classes.radioContainer, classes.hide)}>
        <RadioGroupField
          alignTop
          choices={[
            {
              disabled: true,
              label: (
                <div className={classes.option}>
                  <Typography color="textSecondary" variant="body1">
                    <FormattedMessage
                      defaultMessage="Exclude ZIP-codes"
                      description="action"
                    />
                  </Typography>
                  <Typography color="textSecondary" variant="caption">
                    <FormattedMessage defaultMessage="Added ZIP-codes will be excluded from using this delivery methods. If none are added all ZIP-Codes will be able to use that shipping rate" />
                  </Typography>
                </div>
              ),
              value: ZipCodeInclusion.Exclude
            },
            {
              label: (
                <div className={classes.option}>
                  <Typography variant="body1">
                    <FormattedMessage
                      defaultMessage="Include ZIP-codes"
                      description="action"
                    />
                  </Typography>
                  <Typography color="textSecondary" variant="caption">
                    <FormattedMessage defaultMessage="Only added ZIP-codes will be able to use this shipping rate" />
                  </Typography>
                </div>
              ),
              value: ZipCodeInclusion.Include
            }
          ]}
          name="includeZipCodes"
          value={data.includeZipCodes}
          onChange={onZipCodeInclusionChange}
        />
      </CardContent>
      <ResponsiveTable>
        <colgroup>
          <col />
          <col className={classes.colAction} />
        </colgroup>
        {zipCodes === undefined ||
          (zipCodes.length > 0 && (
            <TableHead>
              <TableRow>
                <TableCell>
                  {zipCodes === undefined ? (
                    <Skeleton className={classes.skeleton} />
                  ) : (
                    <Typography variant="caption">
                      <FormattedMessage
                        defaultMessage="{number} ZIP-Code ranges"
                        description="number of zip code ranges"
                        values={{
                          number: zipCodes.length
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
          ))}
        {expanded && (
          <TableBody>
            {renderCollection(
              zipCodes,
              zipCodeRange => (
                <TableRow key={zipCodeRange?.id}>
                  <TableCell>
                    {zipCodeRange?.start ? (
                      zipCodeRange?.end ? (
                        `${zipCodeRange.start} - ${zipCodeRange.end}`
                      ) : (
                        zipCodeRange.start
                      )
                    ) : (
                      <Skeleton />
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      disabled={disabled}
                      color="primary"
                      onClick={() => onZipCodeDelete(zipCodeRange.id)}
                      data-test="delete-zip-code"
                      data-test-id={zipCodeRange?.id}
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
                      <FormattedMessage defaultMessage="This shipping rate has no ZIP-codes assigned" />
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

ShippingZoneZipCodes.displayName = "ShippingZoneZipCodes";
ShippingZoneZipCodes.defaultProps = {
  initialExpanded: true
};
export default ShippingZoneZipCodes;
