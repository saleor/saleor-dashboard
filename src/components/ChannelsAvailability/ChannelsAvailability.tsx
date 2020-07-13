import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import CardTitle from "@saleor/components/CardTitle";
import RadioSwitchField from "@saleor/components/RadioSwitchField";
import useDateLocalize from "@saleor/hooks/useDateLocalize";
import { ProductUpdate_productUpdate_product_channelListing } from "@saleor/product/types/ProductUpdate";
import { UserError } from "@saleor/types";
import React from "react";
import { useIntl } from "react-intl";

import { DateContext } from "../Date/DateContext";
import { useStyles } from "./styles";

interface ChannelsAvailabilityProps {
  channels: ProductUpdate_productUpdate_product_channelListing[];
  errors: UserError[];
  disabled?: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
}

interface ChannelProps {
  disabled?: boolean;
  data: ProductUpdate_productUpdate_product_channelListing;
  errors: UserError[];
  onChange?: (event: React.ChangeEvent<any>) => void;
}

const Channel: React.FC<ChannelProps> = ({ data, disabled }) => {
  const { isPublished, publicationDate, channel } = data;

  const dateNow = React.useContext(DateContext);
  // const [isPublicationDate, setPublicationDate] = React.useState(
  //   publicationDate === null ? true : false
  // );
  const [isVisible, setVisible] = React.useState(
    Date.parse(publicationDate) <= dateNow
  );
  const [isOpen, setOpen] = React.useState(false);
  const localizeDate = useDateLocalize();
  const intl = useIntl();
  const classes = useStyles({});

  const hiddenSecondLabel = publicationDate
    ? isPublished
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
  const visibleSecondLabel = publicationDate
    ? isPublished
      ? null
      : Date.parse(publicationDate) > dateNow
      ? intl.formatMessage(
          {
            defaultMessage: "since {date}",
            description: "product channel"
          },
          {
            date: localizeDate(publicationDate)
          }
        )
      : null
    : null;
  return (
    <>
      <Typography onClick={() => setOpen(open => !open)}>
        {channel.name}
      </Typography>
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
                <span className={classes.secondLabel}>
                  {visibleSecondLabel}
                </span>
              </>
            }
            name={"isPublished"}
            secondOptionLabel={
              <>
                <p className={classes.label}>
                  {intl.formatMessage({
                    defaultMessage: "Hidden"
                  })}
                </p>
                {isVisible && (
                  <span className={classes.secondLabel}>
                    {hiddenSecondLabel}
                  </span>
                )}
              </>
            }
            value={isVisible}
            onChange={() => setVisible(visible => !visible)}
          />

          {!isVisible && (
            <TextField
              disabled={disabled}
              label={intl.formatMessage({
                defaultMessage: "Publish on",
                description: "publish on date"
              })}
              name="publicationDate"
              type="date"
              fullWidth={true}
              value={publicationDate ? publicationDate : ""}
              className={classes.date}
              InputLabelProps={{
                shrink: true
              }}
            />
          )}
        </>
      )}
    </>
  );
};

export const ChannelsAvailability: React.FC<ChannelsAvailabilityProps> = props => {
  const { channels, errors, onChange } = props;
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Availability",
          description: "section header"
        })}
      />
      <CardContent>
        {channels?.map(data => (
          <Channel
            key={data.channel.id}
            data={data}
            errors={errors}
            onChange={onChange}
          />
        ))}
      </CardContent>
    </Card>
  );
};
ChannelsAvailability.displayName = "ChannelsAvailability";
export default ChannelsAvailability;
