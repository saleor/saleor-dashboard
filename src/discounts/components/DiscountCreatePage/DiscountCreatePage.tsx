import { TopNav } from "@dashboard/components/AppLayout";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Metadata } from "@dashboard/components/Metadata";
import Savebar from "@dashboard/components/Savebar";
import { saleListUrl } from "@dashboard/discounts/urls";
import { ChannelFragment } from "@dashboard/graphql";
import { RichTextContext } from "@dashboard/utils/richText/context";
import useRichText from "@dashboard/utils/richText/useRichText";
import React from "react";
import { useIntl } from "react-intl";

import DiscountDates from "../DiscountDates";
import { DiscountRules } from "../DiscountRules";
import { DiscountDescription } from "./components/DiscountDescription";
import { DiscountName } from "./components/DiscountName";

interface DiscountCreateProps {
  channels: ChannelFragment[];
  disabled: boolean;
  onBack: () => void;
}

export const DiscountCreatePage = ({
  disabled,
  onBack,
}: DiscountCreateProps) => {
  const intl = useIntl();
  const richText = useRichText({
    initial: "",
    loading: false,
    triggerChange: () => {},
  });

  return (
    <RichTextContext.Provider value={richText}>
      <DetailPageLayout gridTemplateColumns={1}>
        <TopNav
          href={saleListUrl()}
          title={intl.formatMessage({
            id: "FWbv/u",
            defaultMessage: "Create Discount",
            description: "page header",
          })}
        />
        <DetailPageLayout.Content>
          <DiscountName />
          <DiscountDescription />
          <DiscountDates
            data={{
              endDate: "",
              endTime: "",
              hasEndDate: false,
              startDate: "",
              startTime: "",
            }}
            disabled={disabled}
            errors={[]}
            onChange={() => {}}
          />
          <DiscountRules onRuleAdd={() => {}} rules={[]} />

          <Metadata
            data={{ privateMetadata: [], metadata: [] }}
            onChange={() => {}}
          />
        </DetailPageLayout.Content>

        <Savebar
          disabled={disabled}
          onCancel={onBack}
          onSubmit={() => {}}
          state={"default"}
        />
      </DetailPageLayout>
    </RichTextContext.Provider>
  );
};
