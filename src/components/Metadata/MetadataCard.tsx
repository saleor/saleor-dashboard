import { MetadataInput } from "@dashboard/graphql";
import { FormChange } from "@dashboard/hooks/useForm";
import { Accordion, Box, Button, Skeleton, Text } from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { DashboardCard } from "../Card";
import { MetadataCardTable } from "./MetadataCardTable";
import { EventDataAction } from "./types";

export interface MetadataCardProps {
  data: MetadataInput[];
  isPrivate: boolean;
  onChange: FormChange;
}

export const MetadataCard: React.FC<MetadataCardProps> = ({
  data,
  isPrivate,
  onChange,
}) => {
  const intl = useIntl();
  const title = isPrivate
    ? {
        id: "ETHnjq",
        defaultMessage: "Private Metadata",
        description: "header",
      }
    : {
        id: "VcI+Zh",
        defaultMessage: "Metadata",
        description: "header",
      };

  return (
    <DashboardCard
      paddingTop={6}
      data-test-id="metadata-editor"
      data-test-is-private={isPrivate}
    >
      <DashboardCard.Content>
        <Accordion>
          <Accordion.Item value="metadata-accordion">
            <Accordion.Trigger>
              <Box display="flex" flexDirection="column" gap={2}>
                <Text variant="heading">{intl.formatMessage(title)}</Text>

                {data?.length > 0 && (
                  <Text variant="caption" color="textNeutralSubdued">
                    <FormattedMessage
                      id="2+v1wX"
                      defaultMessage="{number,plural,one{{number} string} other{{number} strings}}"
                      description="number of metadata fields in model"
                      values={{
                        number: data.length,
                      }}
                    />
                  </Text>
                )}
              </Box>

              <Accordion.TriggerButton />
            </Accordion.Trigger>
            <Accordion.Content>
              {data === undefined ? (
                <Skeleton />
              ) : (
                <>
                  {data.length === 0 ? (
                    <Text variant="caption" color="textNeutralSubdued">
                      <FormattedMessage
                        id="cY6H2C"
                        defaultMessage="No metadata created for this element. Use the button below to add new metadata field."
                        description="empty metadata text"
                      />
                    </Text>
                  ) : (
                    <MetadataCardTable data={data} onChange={onChange} />
                  )}

                  <Button
                    marginTop={2}
                    paddingLeft={6}
                    variant="secondary"
                    data-test-id="add-field"
                    type="button"
                    onClick={() =>
                      onChange({
                        target: {
                          name: EventDataAction.add,
                          value: null,
                        },
                      })
                    }
                  >
                    <FormattedMessage
                      id="GiDxS4"
                      defaultMessage="Add Field"
                      description="add metadata field,button"
                    />
                  </Button>
                </>
              )}
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </DashboardCard.Content>
    </DashboardCard>
  );
};
