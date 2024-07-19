import { DashboardCard } from "@dashboard/components/Card";
import { FormSpacer } from "@dashboard/components/FormSpacer";
import Link from "@dashboard/components/Link";
import PreviewPill from "@dashboard/components/PreviewPill";
import { RadioGroupField } from "@dashboard/components/RadioGroupField";
import {
  WarehouseClickAndCollectOptionEnum,
  WarehouseWithShippingFragment,
} from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import { renderCollection } from "@dashboard/misc";
import { shippingZoneUrl } from "@dashboard/shipping/urls";
import { RelayToFlat } from "@dashboard/types";
import { Divider } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { Skeleton, Text } from "@saleor/macaw-ui-next";
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
    if (data.isPrivate && data.clickAndCollectOption === WarehouseClickAndCollectOptionEnum.LOCAL) {
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
          <Text size={2} fontWeight="light" color="default2">
            <FormattedMessage {...messages.warehouseSettingsPrivateStockDescription} />
          </Text>
          <FormSpacer />
        </>
      ),
      value: "true",
    },
    {
      label: (
        <>
          <FormattedMessage {...messages.warehouseSettingsPublicStock} />
          <Text size={2} fontWeight="light" color="default2">
            <FormattedMessage {...messages.warehouseSettingsPublicStockDescription} />
          </Text>
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
          <Text size={2} fontWeight="light" color="default2">
            <FormattedMessage {...messages.warehouseSettingsDisabledDescription} />
          </Text>
          <FormSpacer />
        </>
      ),
      value: WarehouseClickAndCollectOptionEnum.DISABLED,
    },
    {
      label: (
        <>
          <FormattedMessage {...messages.warehouseSettingsLocal} />
          <Text size={2} fontWeight="light" color="default2">
            <FormattedMessage {...messages.warehouseSettingsLocalDescription} />
          </Text>
          <FormSpacer />
        </>
      ),
      value: WarehouseClickAndCollectOptionEnum.LOCAL,
    },
    {
      label: (
        <>
          <FormattedMessage {...messages.warehouseSettingsAllWarehouses} />
          <Text size={2} fontWeight="light" color="default2">
            <FormattedMessage {...messages.warehouseSettingsAllWarehousesDescription} />
          </Text>
        </>
      ),
      value: WarehouseClickAndCollectOptionEnum.ALL,
    },
  ];
  const clickAndCollectChoices = clickAndCollectChoicesPublic.filter(
    choice => choice.value !== WarehouseClickAndCollectOptionEnum.LOCAL,
  );

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          <FormattedMessage {...sectionNames.shippingZones} />
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
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
            <Text color="default2">
              <FormattedMessage {...messages.warehouseSettingsNoShippingZonesAssigned} />
            </Text>
          ),
        )}
      </DashboardCard.Content>
      <Divider />
      <DashboardCard.Header>
        <DashboardCard.Title>
          <FormattedMessage {...messages.warehouseSettingsStockTitle} />
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content data-test-id="stock-settings-section">
        <RadioGroupField
          disabled={disabled}
          choices={isPrivateChoices}
          onChange={booleanRadioHandler}
          value={data.isPrivate.toString()}
          name="isPrivate"
          alignTop={true}
        />
      </DashboardCard.Content>
      <Divider />
      <DashboardCard.Header>
        <DashboardCard.Title>
          <FormattedMessage {...messages.warehouseSettingsPickupTitle} />
          <PreviewPill className={classes.preview} />
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <RadioGroupField
          disabled={disabled}
          choices={data.isPrivate ? clickAndCollectChoices : clickAndCollectChoicesPublic}
          onChange={onChange}
          value={data.clickAndCollectOption}
          name="clickAndCollectOption"
          alignTop={true}
        />
      </DashboardCard.Content>
    </DashboardCard>
  );
};

WarehouseSettings.displayName = "WarehouseInfo";
export default WarehouseSettings;
