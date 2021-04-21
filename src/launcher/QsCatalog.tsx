import React, { FunctionComponent } from "react";
import {
  PageSection,
  PageSectionVariants,
  TextContent,
  Text,
  Divider,
  Gallery,
  GalleryItem,
  Toolbar,
  ToolbarContent,
} from "@patternfly/react-core";
import {
  QuickStart,
  getQuickStartStatus,
  QuickStartContextValues,
  QuickStartContext,
  QuickStartTile,
  filterQuickStarts,
  QuickStartCatalogEmptyState,
  QUICKSTART_SEARCH_FILTER_KEY,
  QuickStartCatalogFilterSearchWrapper,
  QuickStartCatalogFilterCountWrapper,
  clearQuickStartFilters,
  QuickStartsLoader,
  LoadingBox,
  QuickStartCatalog,
} from "@cloudmosaic/quickstarts";
import { useHistory } from "react-router-dom";

type QsCatalogProps = {
  quickStarts: QuickStart[];
};

export const QsCatalog: React.FC<QsCatalogProps> = ({ quickStarts }) => {
  const {
    activeQuickStartID,
    allQuickStartStates = {},
    setActiveQuickStart,
    activeQuickStartState
  } = React.useContext<QuickStartContextValues>(QuickStartContext);

  const initialQueryParams = new URLSearchParams(window.location.search);
  const initialSearchQuery =
    initialQueryParams.get(QUICKSTART_SEARCH_FILTER_KEY) || "";

  const sortFnc = (q1: QuickStart, q2: QuickStart) =>
    q1.spec.displayName.localeCompare(q2.spec.displayName);

  const initialFilteredQuickStarts = filterQuickStarts(
    quickStarts,
    initialSearchQuery,
    [],
    allQuickStartStates
  ).sort(sortFnc);

  const [filteredQuickStarts, setFilteredQuickStarts] = React.useState<
    QuickStart[]
  >(initialFilteredQuickStarts);

  const onSearchInputChange = (searchValue: string) => {
    const result = filterQuickStarts(
      quickStarts,
      searchValue,
      [],
      allQuickStartStates
    ).sort(sortFnc);
    setFilteredQuickStarts(result);
  };

  const history = useHistory();
  const handleClick = (quickStart: QuickStart, path: string) => {
    //   debugger;
    // setActiveQuickStart && setActiveQuickStart(quickStart.metadata.name, quickStart.spec.tasks?.length);
    history.push(path);
  };

  const CatalogWithSections = (
    <>
      <PageSection>
        <Gallery className="co-quick-start-catalog__gallery" hasGutter>
          {quickStarts
            .filter(
              (quickStart) =>
                !quickStart.spec.type ||
                quickStart.spec.type.text !== "Documentation"
            )
            .map((quickStart) => {
              const {
                metadata: { name: id },
              } = quickStart;

              return (
                <GalleryItem
                  key={id}
                  onClick={() => handleClick(quickStart, `/${quickStart.metadata.name}`)}
                >
                  <QuickStartTile
                    quickStart={quickStart}
                    isActive={false/*id === activeQuickStartID*/}
                    status={getQuickStartStatus(allQuickStartStates, id)}
                  />
                </GalleryItem>
              );
            })}
        </Gallery>
      </PageSection>
    </>
  );

  const clearFilters = () => {
    clearQuickStartFilters();
    setFilteredQuickStarts(quickStarts.sort(sortFnc));
  };

  return (
    <>
      <Divider component="div" />
      <PageSection
        padding={{
          default: "noPadding",
        }}
      >
        <Toolbar usePageInsets>
          <ToolbarContent>
            <QuickStartCatalogFilterSearchWrapper
              onSearchInputChange={onSearchInputChange}
            />
            <QuickStartCatalogFilterCountWrapper
              quickStartsCount={filteredQuickStarts.length}
            />
          </ToolbarContent>
        </Toolbar>
      </PageSection>
      <Divider component="div" />
      {filteredQuickStarts.length === 0 ? (
        <PageSection>
          <QuickStartCatalogEmptyState clearFilters={clearFilters} />
        </PageSection>
      ) : filteredQuickStarts.length !== quickStarts.length ? (
        <PageSection>
          <QuickStartCatalog quickStarts={filteredQuickStarts} />
        </PageSection>
      ) : (
        CatalogWithSections
      )}
    </>
  );
};
