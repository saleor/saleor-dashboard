import CardTitle from "@dashboard/components/CardTitle";
import { FormSpacer } from "@dashboard/components/FormSpacer";
import Link from "@dashboard/components/Link";
import PreviewPill from "@dashboard/components/PreviewPill";
import { RadioGroupField } from "@dashboard/components/RadioGroupField";
import Skeleton from "@dashboard/components/Skeleton";
import {
  WarehouseClickAndCollectOptionEnum,
  WarehouseWithShippingFragment,
} from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import { renderCollection } from "@dashboard/misc";
import { shippingZoneUrl } from "@dashboard/shipping/urls";
import { RelayToFlat } from "@dashboard/types";
import { Card, CardContent, Divider, Typography } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

import { WarehouseDetailsPageFormData } from "../WarehouseDetailsPage";
import messages from "./messages";

export interface WarehouseSettingsProps {
  zones: RelayToFlat<WarehouseWithShippingFragment["shippingZones"]>;
  disabled: boolean;
  data: WarehouseDetailsPageFormData;
  onChange: (event: React.ChangeEvent<any>) => void;
  setData: (data: Partial<WarehouseDetailsPageFormData>) => void;
}

const useStyles = makeStyles(
  theme => ({
    link: {
      "&:not(:last-of-type)": {
        marginBottom: theme.spacing(),
      },
    },
    preview: {
      marginLeft: theme.spacing(1),
    },
  }),
  {
    name: "WarehouseInfoProps",
  },
);

const WarehouseSettings: React.FC<WarehouseSettingsProps> = ({
  zones,
  disabled,
  data,
  onChange,
  setData,
}) => {
  React.useEffect(() => {
    if (
      data.isPrivate &&
      data.clickAndCollectOption === WarehouseClickAndCollectOptionEnum.LOCAL
    ) {
      setData({
        clickAndCollectOption: WarehouseClickAndCollectOptionEnum.DISABLED,
      });
    }
  }, [data.isPrivate]);

  const classes = useStyles({});

  const booleanRadioHandler = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setData({ [name]: value === "true" });
  };

  const isPrivateChoices = [
    {
      label: (
        <>
          <FormattedMessage {...messages.warehouseSettingsPrivateStock} />
          <Typography variant="caption" color="textSecondary">
            <FormattedMessage
              {...messages.warehouseSettingsPrivateStockDescription}
            />
          </Typography>
          <FormSpacer />
        </>
      ),
      value: "true",
    },
    {
      label: (
        <>
          <FormattedMessage {...messages.warehouseSettingsPublicStock} />
          <Typography variant="caption" color="textSecondary">
            <FormattedMessage
              {...messages.warehouseSettingsPublicStockDescription}
            />
          </Typography>
        </>
      ),
      value: "false",
    },
  ];

  const clickAndCollectChoicesPublic = [
    {
      label: (
        <>
          <FormattedMessage {...messages.warehouseSettingsDisabled} />
          <Typography variant="caption" color="textSecondary">
            <FormattedMessage
              {...messages.warehouseSettingsDisabledDescription}
            />
          </Typography>
          <FormSpacer />
        </>
      ),
      value: WarehouseClickAndCollectOptionEnum.DISABLED,
    },
    {
      label: (
        <>
          <FormattedMessage {...messages.warehouseSettingsLocal} />
          <Typography variant="caption" color="textSecondary">
            <FormattedMessage {...messages.warehouseSettingsLocalDescription} />
          </Typography>
          <FormSpacer />
        </>
      ),
      value: WarehouseClickAndCollectOptionEnum.LOCAL,
    },
    {
      label: (
        <>
          <FormattedMessage {...messages.warehouseSettingsAllWarehouses} />
          <Typography variant="caption" color="textSecondary">
            <FormattedMessage
              {...messages.warehouseSettingsAllWarehousesDescription}
            />
          </Typography>
        </>
      ),
      value: WarehouseClickAndCollectOptionEnum.ALL,
    },
  ];

  const clickAndCollectChoices = clickAndCollectChoicesPublic.filter(
    choice => choice.value !== WarehouseClickAndCollectOptionEnum.LOCAL,
  );

  return (
    <Card>
      <CardTitle title={<FormattedMessage {...sectionNames.shippingZones} />} />
      <CardContent>
        {renderCollection(
          zones,
          zone =>
            zone ? (
              <div className={classes.link} key={zone.id}>
                <Link underline href={shippingZoneUrl(zone.id)}>
                  {zone.name}
                </Link>
              </div>
            ) : (
              <Skeleton />
            ),
          () => (
            <Typography color="textSecondary">
              <FormattedMessage
                {...messages.warehouseSettingsNoShippingZonesAssigned}
              />
            </Typography>
          ),
        )}
      </CardContent>
      <Divider />
      <CardTitle
        title={<FormattedMessage {...messages.warehouseSettingsStockTitle} />}
      />
      <CardContent data-test-id="stock-settings-section">
        <RadioGroupField
          disabled={disabled}
          choices={isPrivateChoices}
          onChange={booleanRadioHandler}
          value={data.isPrivate.toString()}
          name="isPrivate"
          alignTop={true}
        />
      </CardContent>
      <Divider />
      <CardTitle
        title={
          <>
            <FormattedMessage {...messages.warehouseSettingsPickupTitle} />
            <PreviewPill className={classes.preview} />
          </>
        }
      />
      <CardContent>
        <RadioGroupField
          disabled={disabled}
          choices={
            data.isPrivate
              ? clickAndCollectChoices
              : clickAndCollectChoicesPublic
          }
          onChange={onChange}
          value={data.clickAndCollectOption}
          name="clickAndCollectOption"
          alignTop={true}
        />
      </CardContent>
    </Card>
  );
};

WarehouseSettings.displayName = "WarehouseInfo";
export default WarehouseSettings;
