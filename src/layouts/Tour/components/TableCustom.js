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
      name: Lang.get("TourCode"),
      center: false,
      render: (data) => <div>{data.sender_data.fullname}</div>,
    },
    {
      name: Lang.get("Arrival"),
      center: false,
      render: (data) => <div>{data.recipient_data.fullname}</div>,
    },
    {
      name: Lang.get("Departure"),
      center: false,
      key: "subject",
      render: (data) => <div>{data.subject}</div>,
    },
    {
      name: Lang.get("CarType"),
      center: false,
      key: "subject",
      render: (data) => <div>{data.subject}</div>,
    },
    {
      name: Lang.get("Night"),
      center: false,
      key: "subject",
      render: (data) => <div>{data.subject}</div>,
    },
    {
      name: Lang.get("SimCards"),
      center: false,
      key: "subject",
      render: (data) => <div>{data.subject}</div>,
    },
    {
      name: Lang.get("Partner"),
      center: false,
      key: "subject",
      render: (data) => <div>{data.subject}</div>,
    },
    {
      name: Lang.get("Customer"),
      center: false,
      key: "subject",
      render: (data) => <div>{data.subject}</div>,
    },
    {
      name: Lang.get("Status"),
      center: false,
      key: "subject",
      render: (data) => <div>{data.subject}</div>,
    },
    {
      name: Lang.get("CreateDate"),
      sort: "date",
      center: false,
      width: 150,
      render: (data) => <SimpleDate date={data.created_at} />,
    },
    {
      name: Lang.get("Actions"),
      width: 10,
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
        columns={{ all: columns, hidden: state.hiddenColumns}}
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
