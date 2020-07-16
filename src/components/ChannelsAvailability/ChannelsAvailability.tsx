import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import CardTitle from "@saleor/components/CardTitle";
import RadioSwitchField from "@saleor/components/RadioSwitchField";
import useDateLocalize from "@saleor/hooks/useDateLocalize";
import ArrowDropdown from "@saleor/icons/ArrowDropdown";
import { ProductDetails_product_channelListing } from "@saleor/products/types/ProductDetails";
import { UserError } from "@saleor/types";
import classNames from "classnames";
import React, { useState } from "react";
import { useIntl } from "react-intl";

import { DateContext } from "../Date/DateContext";
import { useStyles } from "./styles";

export interface ChannelData {
  id: string;
  name: string;
  publicationDate: string | null;
  isPublished: boolean;
}

interface ChannelsAvailabilityProps {
  channels: ChannelData[];
  channelsAvailabilityText: React.ReactNode;
  errors: UserError[];
  disabled?: boolean;
  onChange: (
    index: number
  ) => (channelData: {
    isPublished: boolean;
    publicationDate: string | null;
  }) => void;
  openModal: () => void;
}

interface ChannelProps {
  disabled?: boolean;
  data: ChannelData;
  errors: UserError[];
  onChange: (data: {
    isPublished: boolean;
    publicationDate: string | null;
  }) => void;
}

export const createChannelsDataFromProduct = (
  productData?: ProductDetails_product_channelListing[]
) =>
  productData?.map(option => ({
    id: option.channel.id,
    isPublished: option.isPublished,
    name: option.channel.name,
    publicationDate: option.publicationDate
  })) || [];

const Channel: React.FC<ChannelProps> = ({ data, disabled, onChange }) => {
  const { isPublished, publicationDate, id, name } = data;

  const dateNow = React.useContext(DateContext);

  const [isOpen, setOpen] = useState(false);
  const localizeDate = useDateLocalize();
  const intl = useIntl();
  const classes = useStyles({});

  const availableDateText = publicationDate
    ? !isPublished
      ? intl.formatMessage(
          {
            defaultMessage: "Will become available on {date}",
            description: "product channel"
          },
          {
            date: localizeDate(data.publicationDate)
          }
        )
      : null
    : null;
  const visibleLabel =
    publicationDate && Date.parse(publicationDate) <= dateNow
      ? intl.formatMessage(
          {
            defaultMessage: "since {date}",
            description: "product channel"
          },
          {
            date: localizeDate(publicationDate)
          }
        )
      : null;

  return (
    <>
      <div
        role="button"
        className={classes.channelBtn}
        onClick={() => setOpen(open => !open)}
      >
        <div className={classes.channelName}>
          <Typography>{name}</Typography>
          <ArrowDropdown
            className={classNames(classes.arrow, {
              [classes.rotate]: isOpen
            })}
            color="primary"
          />
        </div>
        <Typography variant="caption">{availableDateText}</Typography>
      </div>
      {isOpen && (
        <>
          <RadioSwitchField
            disabled={disabled}
            firstOptionLabel={
              <>
                <p className={classes.label}>
                  {intl.formatMessage({
                    defaultMessage: "Visible"
                  })}
                </p>
                {isPublished && (
                  <span className={classes.secondLabel}>{visibleLabel}</span>
                )}
              </>
            }
            name={`channel:${id}`}
            secondOptionLabel={
              <p className={classes.label}>
                {intl.formatMessage({
                  defaultMessage: "Hidden"
                })}
              </p>
            }
            value={isPublished}
            onChange={() => {
              onChange({ isPublished: !isPublished, publicationDate });
            }}
          />

          {!isPublished && (
            <TextField
              disabled={disabled}
              label={intl.formatMessage({
                defaultMessage: "Publish on",
                description: "publish on date"
              })}
              name={`channel:publicationDate:${id}`}
              type="date"
              fullWidth={true}
              value={publicationDate || ""}
              className={classes.date}
              InputLabelProps={{
                shrink: true
              }}
              onChange={e =>
                onChange({ isPublished, publicationDate: e.target.value })
              }
            />
          )}
        </>
      )}
    </>
  );
};

export const ChannelsAvailability: React.FC<ChannelsAvailabilityProps> = props => {
  const {
    channelsAvailabilityText,
    channels,
    errors,
    openModal,
    onChange
  } = props;
  const intl = useIntl();

  return (
    <>
      <Card>
        <CardTitle
          title={intl.formatMessage({
            defaultMessage: "Availability",
            description: "section header"
          })}
          toolbar={
            <Button color="primary" onClick={openModal}>
              {intl.formatMessage({
                defaultMessage: "Manage",
                description: "section header button"
              })}
            </Button>
          }
        />
        <CardContent>
          <Typography>{channelsAvailabilityText}</Typography>
          {channels?.map((data, index) => (
            <Channel
              key={data.id}
              data={data}
              errors={errors}
              onChange={onChange(index)}
            />
          ))}
        </CardContent>
      </Card>
    </>
  );
};
ChannelsAvailability.displayName = "ChannelsAvailability";
export default ChannelsAvailability;
