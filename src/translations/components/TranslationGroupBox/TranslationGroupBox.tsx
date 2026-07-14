import { DetailGroupBox } from "@dashboard/components/DetailGroupBox/DetailGroupBox";
import type * as React from "react";

interface TranslationGroupBoxProps {
  groupId: string;
  headerStart: React.ReactNode;
  headerEnd?: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  dataTestId?: string;
}

export const TranslationGroupBox = ({
  defaultExpanded = true,
  ...props
}: TranslationGroupBoxProps) => <DetailGroupBox defaultExpanded={defaultExpanded} {...props} />;

TranslationGroupBox.displayName = "TranslationGroupBox";
