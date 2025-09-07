import React from "react";
import { ErrorBoundary, Lang, Table, SimpleDate } from "fogito-core-ui";
import { Link } from "react-router-dom";

export const TableCustom = ({
  state,
  setState,
  path,
  loadData,
  VIEW,
  onDelete,
}) => {
  const columns = [
    {
      name: Lang.get("Title"),
      center: false,
      key: "title",
      render: (data) => <div> {data.title}</div>,
    },
    {
      name: Lang.get("Status"),
      width: 200,
      key: "status",
      center: false,
      render: (data) => (
        <div className="d-flex flex-column">
          <div className="d-flex align-items-center">
            <div>
              <div
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: data.status ? "#27C840" : "#F5D00C",
                  borderRadius: "50%",
                  marginTop: 2,
                }}
              />
            </div>
            <p className="mb-0 ml-2 fw-400 lh-20 fs-14">
              {Lang.get(data.status ? "Active" : "InActive")}
            </p>
          </div>
        </div>
      ),
    },

    {
      name: Lang.get("CreateDate"),
      sort: "date",
      center: false,
      key: "created_at",
      width: 150,
      render: (data) => <SimpleDate date={data.created_at} />,
    },
    {
      name: Lang.get("Actions"),
      width: 10,
      key: "actions",
      center: true,
      render: (data) => {
        return (
          <div className="dropleft">
            <button
              data-toggle="dropdown"
              className="btn shadow-none bg-transparent feather feather-more-vertical p-0"
              style={{ fontSize: "1.2rem", height: "22px", lineHeight: "1px" }}
            />
            <div className="dropdown-menu">
              <Link className="text-dark" to={`${path}/info/${data?.id}`}>
                <button className="dropdown-item">{Lang.get("Info")}</button>
              </Link>
              {/* <button className="dropdown-item">{Lang.get("Edit")}</button> */}
              <button
                className="dropdown-item text-danger"
                onClick={() => onDelete([data.id])}
              >
                {Lang.get("Delete")}
              </button>
            </div>
          </div>
        );
      },
    },
  ];
  const onSelect = (id) => {
    if (state.selectedIDs.includes(id)) {
      setState({
        selectedIDs: state.selectedIDs.filter((item) => item !== id),
      });
    } else {
      setState({ selectedIDs: state.selectedIDs.concat([id]) });
    }
  };

  const onSelectAll = () => {
    if (state.data.every((item) => state.selectedIDs.includes(item.id))) {
      setState({ selectedIDs: [] });
    } else {
      setState({ selectedIDs: state.data.map((item) => item.id) });
    }
  };
  return (
    <ErrorBoundary>
      <Table
        view={VIEW}
        loading={state.loading}
        progressLoading={state.progressVisible}
        data={state.data}
        columns={{ all: columns, hidden: state.hiddenColumns }}
        pagination={{
          skip: state.skip,
          limit: state.limit,
          count: state.count,
          onTake: (limit) => setState({ limit }),
          onPaginate: (page) => loadData({ skip: page * state.limit }),
        }}
        select={{
          selectedIDs: state.selectedIDs,
          onSelect: onSelect,
          onSelectAll: onSelectAll,
        }}
      />
    </ErrorBoundary>
  );
};
