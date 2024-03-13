import { MetadataInput } from "@dashboard/graphql";
import { FormChange } from "@dashboard/hooks/useForm";
import { Accordion, Box, Button, Skeleton, Text } from "@saleor/macaw-ui-next";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { DashboardCard } from "../Card";
import { MetadataCardTable } from "./MetadataCardTable";
import { EventDataAction } from "./types";

export interface MetadataCardProps {
  data: MetadataInput[];
  isPrivate: boolean;
  onChange: FormChange;
  readonly?: boolean;
}

export const MetadataCard: React.FC<MetadataCardProps> = ({
  data,
  isPrivate,
  onChange,
  readonly = false,
}) => {
  const intl = useIntl();
  const [expanded, setExpanded] = useState(
    readonly ? "metadata-accordion" : undefined,
  );

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
        <Accordion value={expanded} onValueChange={setExpanded}>
          <Accordion.Item
            data-test-id="metadata-item"
            value="metadata-accordion"
          >
            <Accordion.Trigger>
              <Box display="flex" flexDirection="column" gap={2}>
                <Text typeSize={5} fontWeight="bold">
                  {intl.formatMessage(title)}
                </Text>

                {data?.length > 0 && (
                  <Text variant="caption" color="default2">
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

                {data?.length === 0 && (
                  <Text variant="caption" color="default2">
                    <FormattedMessage
                      id="kAPaN6"
                      defaultMessage="Empty"
                      description="empty metadata text"
                    />
                  </Text>
                )}
              </Box>

              <Accordion.TriggerButton dataTestId="expand" />
            </Accordion.Trigger>
            <Accordion.Content>
              {data === undefined ? (
                <Skeleton />
              ) : (
                <>
                  <MetadataCardTable
                    readonly={readonly}
                    data={data}
                    onChange={onChange}
                  />

                  {!readonly && (
                    <Button
                      marginTop={2}
                      variant="secondary"
                      data-test-id="add-field"
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
                  )}
                </>
              )}
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </DashboardCard.Content>
    </DashboardCard>
  );
};
