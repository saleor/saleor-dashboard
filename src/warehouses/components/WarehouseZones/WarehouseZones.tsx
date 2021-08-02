import { Card, CardContent, Divider, Typography } from "@material-ui/core";
import CardSpacer from "@saleor/components/CardSpacer";
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
  data: WarehouseDetailsPageFormData;
  onShippingZoneClick: (id: string) => void;
  onChange: (event: React.ChangeEvent<any>) => void;
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
  data,
  onShippingZoneClick,
  onChange
}) => {
  const classes = useStyles({});
  const intl = useIntl();

  const isPrivateChoices = [
    {
      label: (
        <>
          <FormattedMessage defaultMessage="Private Stock" />
          <Typography variant="caption" color="textSecondary">
            <FormattedMessage defaultMessage="If enabled stock in this warehouse won't be shown" />
          </Typography>
          <CardSpacer />
        </>
      ),
      value: "true"
    },
    {
      label: (
        <>
          <FormattedMessage defaultMessage="Public Stock" />
          <Typography variant="caption" color="textSecondary">
            <FormattedMessage defaultMessage="If enabled stock in this warehouse will be shown" />
          </Typography>
        </>
      ),
      value: "false"
    }
  ];

  const clickAndCollectChoices = [
    {
      label: (
        <>
          <FormattedMessage defaultMessage="Disabled" />
          <Typography variant="caption" color="textSecondary">
            <FormattedMessage defaultMessage="If selected customer won't be able to choose this warehouse as pickup point" />
          </Typography>
          <CardSpacer />
        </>
      ),
      value: WarehouseClickAndCollectOptionEnum.DISABLED
    },
    {
      label: (
        <>
          <FormattedMessage defaultMessage="Local stock only" />
          <Typography variant="caption" color="textSecondary">
            <FormattedMessage defaultMessage="If selected customer will be able to choose this warehouse as pickup point. Ordered products will be only fulfilled from this warehouse stock" />
          </Typography>
          <CardSpacer />
        </>
      ),
      value: WarehouseClickAndCollectOptionEnum.LOCAL
    },
    {
      label: (
        <>
          <FormattedMessage defaultMessage="All warehouses" />
          <Typography variant="caption" color="textSecondary">
            <FormattedMessage defaultMessage="If selected customer will be able to choose this warehouse as pickup point. Ordered products can be shipped here from a different warehouse" />
          </Typography>
          <CardSpacer />
        </>
      ),
      value: WarehouseClickAndCollectOptionEnum.ALL
    }
  ];

  const clickAndCollectChoicesPrivate = [
    {
      label: (
        <>
          <FormattedMessage defaultMessage="Disabled" />
          <Typography variant="caption" color="textSecondary">
            <FormattedMessage defaultMessage="If selected customer won't be able to choose this warehouse as pickup point" />
          </Typography>
          <CardSpacer />
        </>
      ),
      value: WarehouseClickAndCollectOptionEnum.DISABLED
    },
    {
      label: (
        <>
          <FormattedMessage defaultMessage="All warehouses" />
          <Typography variant="caption" color="textSecondary">
            <FormattedMessage defaultMessage="If selected customer will be able to choose this warehouse as pickup point. Ordered products can be shipped here from a different warehouse" />
          </Typography>
          <CardSpacer />
        </>
      ),
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
      </CardContent>
      <Divider />
      <CardContent>
        <CardSpacer />
        <RadioGroupField
          choices={isPrivateChoices}
          onChange={onChange}
          value={data.isPrivate.toString()}
          name="isPrivate"
          alignTop={true}
        />
      </CardContent>
      <Divider />
      <CardContent>
        <Typography color="textSecondary" variant="h6">
          <FormattedMessage defaultMessage="Pickup" />
        </Typography>
        <CardSpacer />
        {data.isPrivate.toString() === "true" ? (
          <RadioGroupField
            choices={clickAndCollectChoicesPrivate}
            onChange={onChange}
            value={data.clickAndCollectOption}
            name="clickAndCollectOption"
            alignTop={true}
          />
        ) : (
          <RadioGroupField
            choices={clickAndCollectChoices}
            onChange={onChange}
            value={data.clickAndCollectOption}
            name="clickAndCollectOption"
            alignTop={true}
          />
        )}
      </CardContent>
    </Card>
  );
};

WarehouseInfo.displayName = "WarehouseInfo";
export default WarehouseInfo;
