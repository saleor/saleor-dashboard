import { Box, Text, Tooltip } from "@saleor/macaw-ui-next";
import { CircleHelp } from "lucide-react";
import { useIntl } from "react-intl";

import { messages } from "./messages";
import styles from "./SearchTooltip.module.css";

const syntaxRows = [
  {
    operator: messages.prefixMatching,
    syntax: "coff",
    description: messages.prefixMatchingDesc,
  },
  {
    operator: messages.andOperator,
    syntax: "coffee shop",
    description: messages.andOperatorDesc,
  },
  {
    operator: messages.andExplicitOperator,
    syntax: "coffee AND shop",
    description: messages.andExplicitOperatorDesc,
  },
  {
    operator: messages.orOperator,
    syntax: "coffee OR tea",
    description: messages.orOperatorDesc,
  },
  {
    operator: messages.notOperator,
    syntax: "-decaf",
    description: messages.notOperatorDesc,
  },
  {
    operator: messages.exactPhrase,
    syntax: '"green tea"',
    description: messages.exactPhraseDesc,
  },
];

export const SearchTooltip = () => {
  const intl = useIntl();

  return (
    <Tooltip>
      <Tooltip.Trigger>
        <Box
          as="button"
          type="button"
          display="flex"
          alignItems="center"
          cursor="pointer"
          padding={0}
          borderWidth={0}
          backgroundColor="transparent"
          aria-label={intl.formatMessage(messages.searchSyntaxTitle)}
          data-test-id="search-syntax-tooltip"
        >
          <CircleHelp size={16} color="var(--mu-colors-text-default2)" />
        </Box>
      </Tooltip.Trigger>
      <Tooltip.Content side="bottom" align="start">
        <Tooltip.Arrow />
        <Box display="flex" flexDirection="column" gap={1}>
          <Text size={2} fontWeight="bold">
            {intl.formatMessage(messages.searchSyntaxTitle)}
          </Text>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{intl.formatMessage(messages.operatorHeader)}</th>
                <th>{intl.formatMessage(messages.exampleHeader)}</th>
                <th>{intl.formatMessage(messages.descriptionHeader)}</th>
              </tr>
            </thead>
            <tbody>
              {syntaxRows.map(row => (
                <tr key={row.syntax}>
                  <td>{intl.formatMessage(row.operator)}</td>
                  <td>
                    <code className={styles.syntax}>{row.syntax}</code>
                  </td>
                  <td>{intl.formatMessage(row.description)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Tooltip.Content>
    </Tooltip>
  );
};
