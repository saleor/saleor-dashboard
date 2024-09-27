// @ts-strict-ignore
import { WebhookFormData } from "@dashboard/custom-apps/components/WebhookDetailsPage";
import {
  CopyIcon,
  GraphiQLProvider,
  GraphiQLProviderProps,
  PlayIcon,
  PrettifyIcon,
  QueryEditor,
  ToolbarButton,
  Tooltip,
  UnStyledButton,
  useCopyQuery,
  useEditorContext,
  UseHeaderEditorArgs,
  usePluginContext,
  usePrettifyEditors,
  UseQueryEditorArgs,
  UseResponseEditorArgs,
  UseVariableEditorArgs,
  WriteableEditorProps,
} from "@graphiql/react";
import clsx from "clsx";
import React, { ComponentType, PropsWithChildren, ReactNode, useState } from "react";
import { useIntl } from "react-intl";

import DryRun from "../DryRun";
import { messages } from "./messages";
import { useDashboardTheme, useEditorStyles, useGraphiQLThemeSwitcher, useStyles } from "./styles";

interface GraphiQLToolbarConfig {
  /**
   * This content will be rendered after the built-in buttons of the toolbar.
   * Note that this will not apply if you provide a completely custom toolbar
   * (by passing `GraphiQL.Toolbar` as child to the `GraphiQL` component).
   */
  additionalContent?: React.ReactNode;
}

type GraphiQLProps = Omit<GraphiQLProviderProps, "children"> & GraphiQLInterfaceProps;

function GraphiQL({
  dangerouslyAssumeSchemaIsValid,
  defaultQuery,
  defaultTabs,
  externalFragments,
  fetcher,
  getDefaultFieldNames,
  headers,
  initialTabs,
  inputValueDeprecation,
  introspectionQueryName,
  maxHistoryLength,
  onEditOperationName,
  onSchemaChange,
  onTabChange,
  onTogglePluginVisibility,
  operationName,
  plugins,
  query,
  response,
  schema,
  schemaDescription,
  shouldPersistHeaders,
  storage,
  validationRules,
  variables,
  visiblePlugin,
  defaultHeaders,
  ...props
}: GraphiQLProps & { data: WebhookFormData }) {
  // Ensure props are correct
  if (typeof fetcher !== "function") {
    throw new TypeError(
      "The `GraphiQL` component requires a `fetcher` function to be passed as prop.",
    );
  }

  const [showDialog, setShowDialog] = useState(false);
  const [result, setResult] = useState("");

  return (
    <GraphiQLProvider
      getDefaultFieldNames={getDefaultFieldNames}
      dangerouslyAssumeSchemaIsValid={dangerouslyAssumeSchemaIsValid}
      defaultQuery={defaultQuery}
      defaultHeaders={defaultHeaders}
      defaultTabs={defaultTabs}
      externalFragments={externalFragments}
      fetcher={fetcher}
      headers={headers}
      initialTabs={initialTabs}
      inputValueDeprecation={inputValueDeprecation}
      introspectionQueryName={introspectionQueryName}
      maxHistoryLength={maxHistoryLength}
      onEditOperationName={onEditOperationName}
      onSchemaChange={onSchemaChange}
      onTabChange={onTabChange}
      onTogglePluginVisibility={onTogglePluginVisibility}
      plugins={plugins}
      visiblePlugin={visiblePlugin}
      operationName={operationName}
      query={query}
      response={response}
      schema={schema}
      schemaDescription={schemaDescription}
      shouldPersistHeaders={shouldPersistHeaders}
      storage={storage}
      validationRules={validationRules}
      variables={variables}
    >
      <GraphiQLInterface
        {...props}
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        result={result}
      />
      <DryRun
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        query={query}
        setResult={setResult}
        syncEvents={props.data.syncEvents}
      />
    </GraphiQLProvider>
  );
}
// Export main windows/panes to be used separately if desired.
GraphiQL.Toolbar = GraphiQLToolbar;

type AddSuffix<Obj extends Record<string, any>, Suffix extends string> = {
  [Key in keyof Obj as `${string & Key}${Suffix}`]: Obj[Key];
};

type GraphiQLInterfaceProps = WriteableEditorProps &
  AddSuffix<Pick<UseQueryEditorArgs, "onEdit">, "Query"> &
  Pick<UseQueryEditorArgs, "onCopyQuery"> &
  AddSuffix<Pick<UseVariableEditorArgs, "onEdit">, "Variables"> &
  AddSuffix<Pick<UseHeaderEditorArgs, "onEdit">, "Headers"> &
  Pick<UseResponseEditorArgs, "responseTooltip"> & {
    children?: ReactNode;
    defaultEditorToolsVisibility?: boolean | "variables" | "headers";
    isHeadersEditorEnabled?: boolean;
    toolbar?: GraphiQLToolbarConfig;
    showDialog?: boolean;
    setShowDialog?: React.Dispatch<React.SetStateAction<boolean>>;
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
  const children = React.Children.toArray(props.children);
  const toolbar = children.find(child => isChildComponentType(child, GraphiQL.Toolbar)) || (
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
      {props.toolbar?.additionalContent || null}
    </>
  );
  const onClickReference = () => {
    if (pluginResize.hiddenElement === "first") {
      pluginResize.setHiddenElement(null);
    }
  };
  const overwriteCodeMirrorCSSVariables = {
    __html: `
      .graphiql-container, .CodeMirror-info, .CodeMirror-lint-tooltip, reach-portal{
        --font-size-hint: ${rootStyle["--font-size-hint"]} !important;
        --font-size-inline-code: ${rootStyle["--font-size-inline-code"]} !important;
        --font-size-body: ${rootStyle["--font-size-body"]} !important;
        --font-size-h4: ${rootStyle["--font-size-h4"]} !important;
        --font-size-h3: ${rootStyle["--font-size-h3"]} !important;
        --font-size-h2: ${rootStyle["--font-size-h2"]} !important;
    `,
  };

  return (
    <div
      data-test-id="graphiql-container"
      className={clsx("graphiql-container", classes.graphiqlContainer)}
      style={rootStyle}
    >
      <style dangerouslySetInnerHTML={overwriteCodeMirrorCSSVariables}></style>
      <div className="graphiql-sidebar">
        <div className="graphiql-sidebar-section">
          {pluginContext?.plugins.map(plugin => {
            const isVisible = plugin === pluginContext.visiblePlugin;
            const label = `${isVisible ? "Hide" : "Show"} ${plugin.title}`;
            const Icon = plugin.icon;

            return (
              <Tooltip key={plugin.title} label={label}>
                <UnStyledButton
                  type="button"
                  className={isVisible ? "active" : ""}
                  onClick={() => {
                    if (isVisible) {
                      pluginContext.setVisiblePlugin(null);
                      pluginResize.setHiddenElement("first");
                    } else {
                      pluginContext.setVisiblePlugin(plugin);
                      pluginResize.setHiddenElement(null);
                    }
                  }}
                  aria-label={label}
                >
                  <Icon aria-hidden="true" />
                </UnStyledButton>
              </Tooltip>
            );
          })}
        </div>
        <div className="graphiql-sidebar-section"></div>
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

function GraphiQLToolbar<TProps>(props: PropsWithChildren<TProps>) {
  return <>{props.children}</>;
}

GraphiQLToolbar.displayName = "GraphiQLToolbar";

function isChildComponentType<T extends ComponentType>(child: any, component: T): child is T {
  if (child?.type?.displayName && child.type.displayName === component.displayName) {
    return true;
  }

  return child.type === component;
}

export default GraphiQL;
