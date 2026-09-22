// @ts-strict-ignore
import { type WebhookFormData } from "@dashboard/extensions/components/WebhookDetailsPage/WebhookDetailsPage";
import {
  CopyIcon,
  GraphiQLProvider,
  type GraphiQLProviderProps,
  PlayIcon,
  PrettifyIcon,
  QueryEditor,
  ToolbarButton,
  useCopyQuery,
  useEditorContext,
  usePluginContext,
  usePrettifyEditors,
  type UseQueryEditorArgs,
  type WriteableEditorProps,
} from "@graphiql/react";
import clsx from "clsx";
import { type Dispatch, type SetStateAction, useState } from "react";
import { useIntl } from "react-intl";

import DryRun from "../DryRun/DryRun";
import { messages } from "./messages";
import { CodeMirrorFontSizeOverrides, PluginSidebarSection } from "./shared";
import { useDashboardTheme, useEditorStyles, useGraphiQLThemeSwitcher, useStyles } from "./styles";

type GraphiQLProps = Omit<GraphiQLProviderProps, "children"> & GraphiQLInterfaceProps;

function GraphiQL(props: GraphiQLProps & { data: WebhookFormData }) {
  // Ensure props are correct
  if (typeof props.fetcher !== "function") {
    throw new TypeError(
      "The `GraphiQL` component requires a `fetcher` function to be passed as prop.",
    );
  }

  const [showDialog, setShowDialog] = useState(false);
  const [result, setResult] = useState("");

  return (
    <GraphiQLProvider {...props}>
      <GraphiQLInterface
        {...props}
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        result={result}
      />
      <DryRun
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        query={props.query}
        setResult={setResult}
        syncEvents={props.data.syncEvents}
      />
    </GraphiQLProvider>
  );
}

type AddSuffix<Obj extends Record<string, any>, Suffix extends string> = {
  [Key in keyof Obj as `${string & Key}${Suffix}`]: Obj[Key];
};

type GraphiQLInterfaceProps = WriteableEditorProps &
  AddSuffix<Pick<UseQueryEditorArgs, "onEdit">, "Query"> &
  Pick<UseQueryEditorArgs, "onCopyQuery"> & {
    showDialog?: boolean;
    setShowDialog?: Dispatch<SetStateAction<boolean>>;
    result?: string;
  };

function GraphiQLInterface(props: GraphiQLInterfaceProps) {
  const intl = useIntl();
  const editorContext = useEditorContext({ nonNull: true });
  const pluginContext = usePluginContext();
  const classes = useStyles();
  const { pluginResize, editorResize, editorToolsResize } = useEditorStyles();
  const copy = useCopyQuery({ onCopyQuery: props.onCopyQuery });
  const prettify = usePrettifyEditors();
  const { rootStyle } = useDashboardTheme();

  useGraphiQLThemeSwitcher();

  const PluginContent = pluginContext?.visiblePlugin?.content;
  const toolbar = (
    <>
      <ToolbarButton
        onClick={() => props.setShowDialog(true)}
        label={intl.formatMessage(messages.toolbarButonLabel)}
      >
        <PlayIcon className="graphiql-toolbar-icon" aria-hidden="true" />
      </ToolbarButton>

      <ToolbarButton onClick={() => prettify()} label="Prettify query (Shift-Ctrl-P)">
        <PrettifyIcon className="graphiql-toolbar-icon" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton onClick={() => copy()} label="Copy query (Shift-Ctrl-C)">
        <CopyIcon className="graphiql-toolbar-icon" aria-hidden="true" />
      </ToolbarButton>
    </>
  );
  const onClickReference = () => {
    if (pluginResize.hiddenElement === "first") {
      pluginResize.setHiddenElement(null);
    }
  };

  return (
    <div
      data-test-id="graphiql-container"
      className={clsx("graphiql-container", classes.graphiqlContainer)}
      style={rootStyle}
    >
      <CodeMirrorFontSizeOverrides />
      <div className="graphiql-sidebar">
        <PluginSidebarSection pluginResize={pluginResize} />
      </div>
      <div className={clsx("graphiql-main", classes.main)}>
        <div
          ref={pluginResize.firstRef}
          style={{
            // Make sure the container shrinks when containing long
            // non-breaking texts
            minWidth: "200px",
          }}
        >
          <div className={clsx("graphiql-plugin", classes.scrollable)}>
            {PluginContent ? <PluginContent /> : null}
          </div>
        </div>
        <div ref={pluginResize.dragBarRef}>
          {pluginContext?.visiblePlugin ? <div className="graphiql-horizontal-drag-bar" /> : null}
        </div>
        <div ref={pluginResize.secondRef} style={{ minWidth: 0 }}>
          <div className={clsx("graphiql-sessions", classes.graphiqlSessions)}>
            <div
              role="tabpanel"
              id="graphiql-session"
              className="graphiql-session"
              style={{ padding: "2rem 0 0 0" }}
              aria-labelledby={`graphiql-session-tab-${editorContext.activeTabIndex}`}
            >
              <div ref={editorResize.firstRef}>
                <div
                  className={clsx("graphiql-editors full-height", classes.graphiqlEditors)}
                  style={{ boxShadow: "none" }}
                >
                  <div ref={editorToolsResize.firstRef}>
                    <section
                      className="graphiql-query-editor"
                      aria-label="Query Editor"
                      style={{ borderBottom: 0 }}
                    >
                      <div className="graphiql-query-editor-wrapper">
                        <QueryEditor
                          editorTheme={props.editorTheme}
                          keyMap={props.keyMap}
                          onClickReference={onClickReference}
                          onCopyQuery={props.onCopyQuery}
                          onEdit={props.onEditQuery}
                          readOnly={props.readOnly}
                        />
                      </div>
                      <div className="graphiql-toolbar" role="toolbar" aria-label="Editor Commands">
                        {toolbar}
                      </div>
                    </section>
                  </div>
                </div>
                <div ref={editorResize.dragBarRef}>
                  <div className="graphiql-horizontal-drag-bar" />
                </div>
                <div ref={editorResize.secondRef}>
                  <div className="graphiql-response">
                    <pre className={classes.pre}>{props.result}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GraphiQL;
