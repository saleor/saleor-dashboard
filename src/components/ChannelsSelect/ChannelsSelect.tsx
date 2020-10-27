import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import LinkChoice from "@saleor/components/LinkChoice";
import { SingleAutocompleteChoiceType } from "@saleor/components/SingleAutocompleteSelectField";
import { FormChange } from "@saleor/hooks/useForm";
import React from "react";
import { FormattedMessage } from "react-intl";

export interface ChannelsSelectProps {
  channelChoices: SingleAutocompleteChoiceType[];
  channelChoice: string;
  setChannelChoice: FormChange;
}

const useStyles = makeStyles(
  theme => ({
    label: {
      display: "inline-block",
      marginRight: theme.spacing(1)
    },
    select: {
      display: "inline-block"
    }
  }),
  { name: "ChannelsSelect" }
);

export const ChannelsSelect: React.FC<ChannelsSelectProps> = ({
  channelChoice,
  channelChoices,
  setChannelChoice
}) => {
  const classes = useStyles({});

  return channelChoices?.length ? (
    <>
      <Typography className={classes.label}>
        <FormattedMessage
          defaultMessage="Channel:"
          description="channel select label"
        />
      </Typography>
      <LinkChoice
        className={classes.select}
        choices={channelChoices}
        name="channels"
        value={channelChoice}
        onChange={event => setChannelChoice(event.target.value)}
      />
    </>
  ) : null;
};
export default ChannelsSelect;
