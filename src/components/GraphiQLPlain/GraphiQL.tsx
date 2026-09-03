/**
 *  Copyright (c) 2020 GraphQL Contributors.
 *
 *  This source code is licensed under the MIT license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import "graphiql/graphiql.min.css";

import {
  ChevronDownIcon,
  ChevronUpIcon,
  CopyIcon,
  ExecuteButton,
  GraphiQLProvider,
  type GraphiQLProviderProps,
  HeaderEditor,
  MergeIcon,
  PlusIcon,
  PrettifyIcon,
  QueryEditor,
  ReloadIcon,
  ResponseEditor,
  Spinner,
  Tab,
  Tabs,
  ToolbarButton,
  Tooltip,
  UnStyledButton,
  useCopyQuery,
  useDragResize,
  useEditorContext,
  useExecutionContext,
  type UseHeaderEditorArgs,
  useMergeQuery,
  usePluginContext,
  usePrettifyEditors,
  type UseQueryEditorArgs,
  type UseResponseEditorArgs,
  useSchemaContext,
  type UseVariableEditorArgs,
  VariableEditor,
  type WriteableEditorProps,
} from "@graphiql/react";
import { useState } from "react";

import { useDashboardTheme, useGraphiQLThemeSwitcher } from "../GraphiQL/styles";
import { AttachAuthButton } from "./AttachAuthButton";

/**
 * API docs for this live here:
 *
 * https://graphiql-test.netlify.app/typedoc/modules/graphiql.html#graphiqlprops
 */
type GraphiQLProps = Omit<GraphiQLProviderProps, "children"> & GraphiQLInterfaceProps;

/**
 * The top-level React component for GraphiQL, intended to encompass the entire
 * browser viewport.
 *
 * @see https://github.com/graphql/graphiql#usage
 */

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
}: GraphiQLProps) {
  // Ensure props are correct
  if (typeof fetcher !== "function") {
    throw new TypeError(
      "The `GraphiQL` component requires a `fetcher` function to be passed as prop.",
    );
  }

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
      <GraphiQLInterface {...props} />
    </GraphiQLProvider>
  );
}

type AddSuffix<Obj extends Record<string, any>, Suffix extends string> = {
  [Key in keyof Obj as `${string & Key}${Suffix}`]: Obj[Key];
};

type GraphiQLInterfaceProps = WriteableEditorProps &
  AddSuffix<Pick<UseQueryEditorArgs, "onEdit">, "Query"> &
  Pick<UseQueryEditorArgs, "onCopyQuery"> &
  AddSuffix<Pick<UseVariableEditorArgs, "onEdit">, "Variables"> &
  AddSuffix<Pick<UseHeaderEditorArgs, "onEdit">, "Headers"> &
  Pick<UseResponseEditorArgs, "responseTooltip"> & {
    /**
     * Set the default state for the editor tools.
     * - `false` hides the editor tools
     * - `true` shows the editor tools
     * - `'variables'` specifically shows the variables editor
     * - `'headers'` specifically shows the headers editor
     * By default the editor tools are initially shown when at least one of the
     * editors has contents.
     */
    defaultEditorToolsVisibility?: boolean | "variables" | "headers";
    /**
     * Toggle if the headers editor should be shown inside the editor tools.
     * @default true
     */
    isHeadersEditorEnabled?: boolean;
  };

function GraphiQLInterface(props: GraphiQLInterfaceProps) {
  const isHeadersEditorEnabled = props.isHeadersEditorEnabled ?? true;
  const editorContext = useEditorContext({ nonNull: true });
  const executionContext = useExecutionContext({ nonNull: true });
  const schemaContext = useSchemaContext({ nonNull: true });
  const pluginContext = usePluginContext();
  const copy = useCopyQuery({ onCopyQuery: props.onCopyQuery });
  const merge = useMergeQuery();
  const prettify = usePrettifyEditors();
  const { rootStyle } = useDashboardTheme();

  useGraphiQLThemeSwitcher();

  const PluginContent = pluginContext?.visiblePlugin?.content;
  const pluginResize = useDragResize({
    defaultSizeRelation: 1 / 3,
    direction: "horizontal",
    initiallyHidden: pluginContext?.visiblePlugin ? undefined : "first",
    sizeThresholdSecond: 200,
    storageKey: "docExplorerFlex",
  });
  const editorResize = useDragResize({
    direction: "horizontal",
    storageKey: "editorFlex",
  });
  const editorToolsResize = useDragResize({
    defaultSizeRelation: 3,
    direction: "vertical",
    sizeThresholdSecond: 60,
    storageKey: "secondaryEditorFlex",
  });
  const [activeSecondaryEditor, setActiveSecondaryEditor] = useState<"variables" | "headers">(
    () => {
      if (
        props.defaultEditorToolsVisibility === "variables" ||
        props.defaultEditorToolsVisibility === "headers"
      ) {
        return props.defaultEditorToolsVisibility;
      }

      return !editorContext.initialVariables &&
        editorContext.initialHeaders &&
        isHeadersEditorEnabled
        ? "headers"
        : "variables";
    },
  );
  const toolbar = (
    <>
      <ToolbarButton onClick={() => prettify()} label="Prettify query (Shift-Ctrl-P)">
        <PrettifyIcon className="graphiql-toolbar-icon" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton onClick={() => merge()} label="Merge fragments into query (Shift-Ctrl-M)">
        <MergeIcon className="graphiql-toolbar-icon" aria-hidden="true" />
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
    <div data-testid="graphiql-container" className="graphiql-container" style={{ ...rootStyle }}>
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
        <div className="graphiql-sidebar-section">
          <Tooltip label="Re-fetch GraphQL schema">
            <UnStyledButton
              type="button"
              disabled={schemaContext.isFetching}
              onClick={() => schemaContext.introspect()}
              aria-label="Re-fetch GraphQL schema"
            >
              <ReloadIcon
                className={schemaContext.isFetching ? "graphiql-spin" : ""}
                aria-hidden="true"
              />
            </UnStyledButton>
          </Tooltip>
        </div>
      </div>
      <div className="graphiql-main">
        <div
          ref={pluginResize.firstRef}
          style={{
            // Make sure the container shrinks when containing long
            // non-breaking texts
            minWidth: "200px",
          }}
        >
          <div className="graphiql-plugin">{PluginContent ? <PluginContent /> : null}</div>
        </div>
        <div ref={pluginResize.dragBarRef}>
          {pluginContext?.visiblePlugin ? <div className="graphiql-horizontal-drag-bar" /> : null}
        </div>
        <div ref={pluginResize.secondRef} style={{ minWidth: 0 }}>
          <div className="graphiql-sessions">
            <div className="graphiql-session-header">
              <Tabs aria-label="Select active operation">
                {editorContext.tabs.length > 1 ? (
                  <>
                    {editorContext.tabs.map((tab, index) => (
                      <Tab key={tab.id} isActive={index === editorContext.activeTabIndex}>
                        <Tab.Button
                          aria-controls="graphiql-session"
                          id={`graphiql-session-tab-${index}`}
                          onClick={() => {
                            executionContext.stop();
                            editorContext.changeTab(index);
                          }}
                        >
                          {tab.title}
                        </Tab.Button>
                        <Tab.Close
                          onClick={() => {
                            if (editorContext.activeTabIndex === index) {
                              executionContext.stop();
                            }

                            editorContext.closeTab(index);
                          }}
                        />
                      </Tab>
                    ))}
                    <div>
                      <Tooltip label="Add tab">
                        <UnStyledButton
                          type="button"
                          className="graphiql-tab-add"
                          onClick={() => editorContext.addTab()}
                          aria-label="Add tab"
                        >
                          <PlusIcon aria-hidden="true" />
                        </UnStyledButton>
                      </Tooltip>
                    </div>
                  </>
                ) : null}
              </Tabs>
              <div className="graphiql-session-header-right">
                {editorContext.tabs.length === 1 ? (
                  <div className="graphiql-add-tab-wrapper">
                    <Tooltip label="Add tab">
                      <UnStyledButton
                        type="button"
                        className="graphiql-tab-add"
                        onClick={() => editorContext.addTab()}
                        aria-label="Add tab"
                      >
                        <PlusIcon aria-hidden="true" />
                      </UnStyledButton>
                    </Tooltip>
                  </div>
                ) : null}
              </div>
            </div>
            <div
              role="tabpanel"
              id="graphiql-session"
              className="graphiql-session"
              aria-labelledby={`graphiql-session-tab-${editorContext.activeTabIndex}`}
            >
              <div ref={editorResize.firstRef}>
                <div
                  className={`graphiql-editors${
                    editorContext.tabs.length === 1 ? " full-height" : ""
                  }`}
                >
                  <div ref={editorToolsResize.firstRef}>
                    <section className="graphiql-query-editor" aria-label="Query Editor">
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
                        <ExecuteButton />
                        {toolbar}
                      </div>
                    </section>
                  </div>
                  <div ref={editorToolsResize.dragBarRef}>
                    <div className="graphiql-editor-tools">
                      <div className="graphiql-editor-tools-tabs">
                        <UnStyledButton
                          type="button"
                          className={
                            activeSecondaryEditor === "variables" &&
                            editorToolsResize.hiddenElement !== "second"
                              ? "active"
                              : ""
                          }
                          onClick={() => {
                            if (editorToolsResize.hiddenElement === "second") {
                              editorToolsResize.setHiddenElement(null);
                            }

                            setActiveSecondaryEditor("variables");
                          }}
                        >
                          Variables
                        </UnStyledButton>
                        {isHeadersEditorEnabled ? (
                          <UnStyledButton
                            type="button"
                            className={
                              activeSecondaryEditor === "headers" &&
                              editorToolsResize.hiddenElement !== "second"
                                ? "active"
                                : ""
                            }
                            onClick={() => {
                              if (editorToolsResize.hiddenElement === "second") {
                                editorToolsResize.setHiddenElement(null);
                              }

                              setActiveSecondaryEditor("headers");
                            }}
                          >
                            Headers
                          </UnStyledButton>
                        ) : null}
                        {isHeadersEditorEnabled ? (
                          <AttachAuthButton
                            setActiveSecondaryEditor={setActiveSecondaryEditor}
                            showEditorTools={() => {
                              if (editorToolsResize.hiddenElement === "second") {
                                editorToolsResize.setHiddenElement(null);
                              }
                            }}
                          />
                        ) : null}
                      </div>
                      <Tooltip
                        label={
                          editorToolsResize.hiddenElement === "second"
                            ? "Show editor tools"
                            : "Hide editor tools"
                        }
                      >
                        <UnStyledButton
                          type="button"
                          onClick={() => {
                            editorToolsResize.setHiddenElement(
                              editorToolsResize.hiddenElement === "second" ? null : "second",
                            );
                          }}
                          aria-label={
                            editorToolsResize.hiddenElement === "second"
                              ? "Show editor tools"
                              : "Hide editor tools"
                          }
                        >
                          {editorToolsResize.hiddenElement === "second" ? (
                            <ChevronUpIcon className="graphiql-chevron-icon" aria-hidden="true" />
                          ) : (
                            <ChevronDownIcon className="graphiql-chevron-icon" aria-hidden="true" />
                          )}
                        </UnStyledButton>
                      </Tooltip>
                    </div>
                  </div>
                  <div ref={editorToolsResize.secondRef}>
                    <section
                      className="graphiql-editor-tool"
                      aria-label={activeSecondaryEditor === "variables" ? "Variables" : "Headers"}
                    >
                      <VariableEditor
                        editorTheme={props.editorTheme}
                        isHidden={activeSecondaryEditor !== "variables"}
                        keyMap={props.keyMap}
                        onEdit={props.onEditVariables}
                        onClickReference={onClickReference}
                        readOnly={props.readOnly}
                      />
                      {isHeadersEditorEnabled && (
                        <HeaderEditor
                          editorTheme={props.editorTheme}
                          isHidden={activeSecondaryEditor !== "headers"}
                          keyMap={props.keyMap}
                          onEdit={props.onEditHeaders}
                          readOnly={props.readOnly}
                        />
                      )}
                    </section>
                  </div>
                </div>
              </div>
              <div ref={editorResize.dragBarRef}>
                <div className="graphiql-horizontal-drag-bar" />
              </div>
              <div ref={editorResize.secondRef}>
                <div className="graphiql-response">
                  {executionContext.isFetching ? <Spinner /> : null}
                  <ResponseEditor
                    editorTheme={props.editorTheme}
                    responseTooltip={props.responseTooltip}
                    keyMap={props.keyMap}
                  />
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
