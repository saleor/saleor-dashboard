import { ConfigurationItemFragment, ConfigurationTypeFieldEnum } from "@dashboard/graphql";
import { useMemo } from "react";

/** This hook sorts plugin input controls received from Saleor and puts boolean (checkboxes) inputs at the end */
export const useSortedConfiguration = (configuration: ConfigurationItemFragment[]) => {
  return useMemo(() => {
    const textConfigFields = [];
    const booleanConfigFields = [];

    for (const field of configuration) {
      if (field.type === ConfigurationTypeFieldEnum.BOOLEAN) {
        booleanConfigFields.push(field);
      } else {
        textConfigFields.push(field);
      }
    }

    return { textConfigFields, booleanConfigFields };
  }, [configuration]);
};
