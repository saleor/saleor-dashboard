import { Card, CardContent, Typography } from "@material-ui/core";
import { CardSpacer } from "@saleor/components/CardSpacer";
import CardTitle from "@saleor/components/CardTitle";
import Link from "@saleor/components/Link";
import { RadioGroupField } from "@saleor/components/RadioGroupField";
import Skeleton from "@saleor/components/Skeleton";
import { makeStyles } from "@saleor/macaw-ui";
import { maybe, renderCollection } from "@saleor/misc";
import { WarehouseDetails_warehouse_shippingZones_edges_node } from "@saleor/warehouses/types/WarehouseDetails";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { WarehouseClickAndCollectOptionEnum } from "./../../../types/globalTypes";
import { WarehouseDetailsPageFormData } from "./../WarehouseDetailsPage";

export interface WarehouseInfoProps {
  zones: WarehouseDetails_warehouse_shippingZones_edges_node[];
  disabled: boolean;
  isPrivate: string;
  data: WarehouseDetailsPageFormData;
  onShippingZoneClick: (id: string) => void;
  onChange: (event: React.ChangeEvent<any>) => void;
  onIsPrivateChange: (event: React.ChangeEvent<any>) => void;
}

const useStyles = makeStyles(
  theme => ({
    link: {
      "&:not(:last-of-type)": {
        marginBottom: theme.spacing()
      }
    }
  }),
  {
    name: "WarehouseInfoProps"
  }
);

const WarehouseInfo: React.FC<WarehouseInfoProps> = ({
  zones,
  disabled,
  data,
  isPrivate,
  onShippingZoneClick,
  onChange,
  onIsPrivateChange
}) => {
  const classes = useStyles({});
  const intl = useIntl();
  const isPrivateChoices = [
    {
      label: intl.formatMessage({
        defaultMessage: "Private Stock",
        description: "TBD"
      }),
      value: "true"
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Public Stock",
        description: "TBD"
      }),
      value: "false"
    }
  ];

  const clickAndCollectChoices = [
    {
      label: intl.formatMessage({
        defaultMessage: "Disabled",
        description: "TBD"
      }),
      value: WarehouseClickAndCollectOptionEnum.DISABLED
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Local stock only",
        description: "TBD"
      }),
      value: WarehouseClickAndCollectOptionEnum.LOCAL
    },
    {
      label: intl.formatMessage({
        defaultMessage: "All Warehouses",
        description: "TBD"
      }),
      value: WarehouseClickAndCollectOptionEnum.ALL
    }
  ];

  const clickAndCollectChoicesPrivate = [
    {
      label: intl.formatMessage({
        defaultMessage: "Disabled",
        description: "TBD"
      }),
      value: WarehouseClickAndCollectOptionEnum.DISABLED
    },
    {
      label: intl.formatMessage({
        defaultMessage: "All Warehouses",
        description: "TBD"
      }),
      value: WarehouseClickAndCollectOptionEnum.ALL
    }
  ];

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Settings",
          description: "zones that warehouse sends to"
        })}
      />
      <CardContent>
        {renderCollection(
          zones,
          zone =>
            maybe(
              () => (
                <div className={classes.link} key={zone.id}>
                  <Link underline onClick={() => onShippingZoneClick(zone.id)}>
                    {zone.name}
                  </Link>
                </div>
              ),
              <Skeleton />
            ),
          () => (
            <Typography color="textSecondary">
              <FormattedMessage defaultMessage="This warehouse has no shipping zones assigned." />
            </Typography>
          )
        )}

        <CardSpacer />
        <RadioGroupField
          disabled={disabled}
          choices={isPrivateChoices}
          onChange={onIsPrivateChange}
          value={isPrivate.toString()}
          name="isPrivate"
        />
        <CardSpacer />
        {isPrivate === "true" ? (
          <RadioGroupField
            choices={clickAndCollectChoicesPrivate}
            onChange={onChange}
            value={data.clickAndCollectOption}
            name="clickAndCollectOption"
          />
        ) : (
          <RadioGroupField
            choices={clickAndCollectChoices}
            onChange={onChange}
            value={data.clickAndCollectOption}
            name="clickAndCollectOption"
          />
        )}
      </CardContent>
    </Card>
  );
};

WarehouseInfo.displayName = "WarehouseInfo";
export default WarehouseInfo;
