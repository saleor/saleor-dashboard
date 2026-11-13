import { type LogLevels } from "@editorjs/editorjs";
import clsx from "clsx";
import { useId, useMemo } from "react";
import { useIntl } from "react-intl";

import { getTools } from "./consts";
import { useHasRendered } from "./hooks";
import { getEditorI18n } from "./i18n";
import { ReactEditorJS } from "./ReactEditorJS";
import { type EditorJsProps } from "./RichTextEditor";
import useStyles from "./styles";

interface RichTextEditorContentProps extends Omit<EditorJsProps, "defaultValue"> {
  id?: string;
  className?: string;
}

const RichTextEditorContent = ({
  id: defaultId,
  className,
  value,
  ...props
}: RichTextEditorContentProps) => {
  const classes = useStyles({});
  const intl = useIntl();
  const tools = useMemo(() => getTools(intl), [intl]);
  const i18n = useMemo(() => getEditorI18n(intl), [intl]);
  const generatedId = useId();
  const id = defaultId ?? generatedId;
  // Delay EditorJS rendering until after mount to avoid client-only rendering issues.
  const hasRendered = useHasRendered();

  if (!hasRendered) {
    return <div />;
  }

  return (
    <ReactEditorJS
      holder={id}
      logLevel={"ERROR" as LogLevels.ERROR}
      tools={tools}
      i18n={i18n}
      {...props}
      defaultValue={value}
      readOnly={true}
    >
      <div id={id} className={clsx(classes.editor, classes.rootStatic, className)} />
    </ReactEditorJS>
  );
};

RichTextEditorContent.displayName = "RichTextEditorContent";
export default RichTextEditorContent;
