import React from "react";
import { ErrorBoundary, Lang, Header, Table, InputLazy } from "fogito-core-ui";
import { Link } from "react-router-dom";
import AsyncSelect from "react-select/async";
import { historyPushByName } from "@actions";

export const HeaderCustom = ({
  state,
  setState,
  loadData,
  onDelete,
  path,
  onClearFilters,
  VIEW,
  filters,
  name,
}) => {
  const columns = [
    { key: "title", name: Lang.get("Title") },
    { key: "status", name: Lang.get("Status") },
    { key: "created_at", name: Lang.get("CreateDate") },
    { key: "actions", name: Lang.get("Actions") },
  ];

  return (
    <ErrorBoundary>
      <Header>
        <div className="row">
          {!!state.selectedIDs.length && (
            <div className="col-md-auto col-6 order-md-1 order-1">
              <button
                data-filter-count={state.selectedIDs?.length}
                className="btn btn-danger btn-block position-relative"
                onClick={() => onDelete(state.selectedIDs)}
              >
                <i className="feather feather-trash mr-0" />
              </button>
            </div>
          )}
          {!state.selectedIDs.length && (
            <div className="col-md-auto col-6 order-md-1 order-1">
              <button
                className="btn btn-block btn-white"
                onClick={() => loadData()}
              >
                <i className="feather feather-refresh-ccw text-primary" />
              </button>
            </div>
          )}
          <div className="col-lg-5 col-md-3 col-12 mt-md-0 mt-md-0 mt-3 order-md-2 order-6">
            <div className="input-group input-group-alternative">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <i className="feather feather-search" />
                </span>
              </div>
              <InputLazy
                autoFocus={true}
                value={state.title}
                action={(e) => loadData({ title: e.target.value })}
                onChange={(e) => {
                  setState({ title: e.target.value });
                  if (e.target.value?.length) {
                    historyPushByName(
                      {
                        label: "title",
                        value: e.target.value,
                      },
                      name
                    );
                  } else {
                    historyPushByName(
                      {
                        label: "title",
                        value: "",
                      },
                      name
                    );
                  }
                }}
                className="form-control form-control-alternative"
                placeholder={Lang.get("Title")}
              />
            </div>
          </div>
          <div className="col-md-auto col-6 mt-md-0 ml-md-auto order-md-2 order-2">
            <Table.ColumnFilter
              className="btn btn-block btn-white"
              columns={{
                all: columns,
                hidden: state.hiddenColumns,
                view: VIEW,
                required: "title",
              }}
              setColumns={(hiddenColumns) => setState({ hiddenColumns })}
            >
              <i className="feather feather-sliders mr-2" />
              {Lang.get("Columns")}
            </Table.ColumnFilter>
          </div>

          <div className="col-md-auto col-6 mt-md-0 mt-3 order-md-3 order-3">
            <Header.FilterButton
              onClick={() => setState({ showFilter: true })}
              containerClassName="h-100 w-100"
              onClear={onClearFilters}
              className="btn btn-white"
              count={Object.keys(filters).filter((key) => filters[key]).length}
            >
              <i className="feather feather-filter mr-2" />
              {Lang.get("Filters")}
            </Header.FilterButton>
          </div>
          <div className="col-md-auto col-12 order-md-5 order-5 m-md-0 mt-3">
            <Link to={`${path}/add`} className="btn btn-primary btn-block">
              <i className="feather feather-plus" />
            </Link>
          </div>
        </div>
      </Header>
    </ErrorBoundary>
  );
};
