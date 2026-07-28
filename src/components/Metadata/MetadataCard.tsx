import { DetailGroupBox } from "@dashboard/components/DetailGroupBox/DetailGroupBox";
import { Title2 } from "@dashboard/components/Title2/Title2";
import { type MetadataInput } from "@dashboard/graphql";
import { type FormChange } from "@dashboard/hooks/useForm";
import { Accordion, Box, Button, Skeleton, Text } from "@saleor/macaw-ui-next";
import { type ReactNode, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { DashboardCard } from "../Card";
import { MetadataCardTable } from "./MetadataCardTable";
import { EventDataAction } from "./types";
import { getMetadataTitle } from "./utils";

export interface MetadataCardProps {
  data: MetadataInput[];
  isPrivate: boolean;
  onChange: FormChange;
  readonly?: boolean;
  disabled?: boolean;
  error?: string | undefined;
  defaultExpanded?: boolean;
  /** Removes page-level card padding — use inside modals with DashboardModal.Inset */
  inModal?: boolean;
  /** Spacing above this group in modal stacks — 0 when first in body, 4 after section intro */
  marginTop?: 0 | 1 | 2 | 3 | 4;
}

const ACCORDION_VALUE = "metadata-accordion";

const ModalMetadataGroupShell = ({
  children,
  marginTop = 0,
  "data-test-id": dataTestId,
  "data-test-is-private": dataTestIsPrivate,
}: {
  children: ReactNode;
  marginTop?: 0 | 1 | 2 | 3 | 4;
  "data-test-id"?: string;
  "data-test-is-private"?: boolean;
}) => (
  <Box marginTop={marginTop} data-test-id={dataTestId} data-test-is-private={dataTestIsPrivate}>
    <Box
      backgroundColor="default2"
      borderRadius={4}
      borderStyle="solid"
      borderColor="default1"
      borderWidth={1}
      paddingY={4}
      paddingX={5}
    >
      {children}
    </Box>
  </Box>
);

export const MetadataCard = ({
  data,
  isPrivate,
  onChange,
  readonly = false,
  disabled,
  error,
  defaultExpanded,
  inModal = false,
  marginTop = 4,
}: MetadataCardProps) => {
  const intl = useIntl();
  const initiallyExpanded = defaultExpanded ?? false;
  const [expanded, setExpanded] = useState(initiallyExpanded ? ACCORDION_VALUE : undefined);
  const isEmptyReadOnly = readonly && (data?.length ?? 0) === 0;
  const groupId = isPrivate ? "private-metadata" : "metadata";

  const metadataHeader = (
    <Box display="flex" flexDirection="column" gap={0.5}>
      <Title2>{intl.formatMessage(getMetadataTitle(isPrivate))}</Title2>

      {data?.length > 0 && (
        <Text size={2} color="default2">
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
        <Text size={2} color="default2">
          <FormattedMessage id="kAPaN6" defaultMessage="Empty" description="empty metadata text" />
        </Text>
      )}
    </Box>
  );

  const metadataContent = (
    <>
      {data === undefined ? (
        <Skeleton />
      ) : (
        <>
          <MetadataCardTable
            readonly={readonly}
            disabled={disabled}
            data={data}
            onChange={onChange}
            inModal
            error={error}
          />

          {!readonly && (
            <Box paddingX={5} paddingBottom={4}>
              <Button
                marginTop={4}
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
            </Box>
          )}
        </>
      )}
    </>
  );

  if (inModal) {
    if (isEmptyReadOnly) {
      return (
        <ModalMetadataGroupShell
          marginTop={marginTop}
          data-test-id="metadata-editor"
          data-test-is-private={isPrivate}
        >
          {metadataHeader}
        </ModalMetadataGroupShell>
      );
    }

    return (
      <DetailGroupBox
        groupId={groupId}
        marginTop={marginTop}
        defaultExpanded={initiallyExpanded}
        headerStart={metadataHeader}
        dataTestId="metadata-editor"
        dataTestIsPrivate={isPrivate}
        triggerButtonTestId="expand"
      >
        <Box data-test-id="metadata-item">{metadataContent}</Box>
      </DetailGroupBox>
    );
  }

  const pageMetadataHeader = (
    <Box display="flex" flexDirection="column" gap={2}>
      <Text size={6} fontWeight="medium">
        {intl.formatMessage(getMetadataTitle(isPrivate))}
      </Text>

      {data?.length > 0 && (
        <Text size={2} color="default2">
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
        <Text size={2} color="default2">
          <FormattedMessage id="kAPaN6" defaultMessage="Empty" description="empty metadata text" />
        </Text>
      )}
    </Box>
  );

  return (
    <DashboardCard
      paddingTop={6}
      gap={5}
      data-test-id="metadata-editor"
      data-test-is-private={isPrivate}
    >
      <DashboardCard.Content paddingX={6}>
        {isEmptyReadOnly ? (
          pageMetadataHeader
        ) : (
          <Accordion value={expanded} onValueChange={setExpanded}>
            <Accordion.Item data-test-id="metadata-item" value={ACCORDION_VALUE}>
              <Accordion.Trigger>
                {pageMetadataHeader}
                <Accordion.TriggerButton dataTestId="expand" />
              </Accordion.Trigger>
              <Accordion.Content>
                {data === undefined ? (
                  <Skeleton />
                ) : (
                  <>
                    <MetadataCardTable
                      readonly={readonly}
                      disabled={disabled}
                      data={data}
                      onChange={onChange}
                      error={error}
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
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};
