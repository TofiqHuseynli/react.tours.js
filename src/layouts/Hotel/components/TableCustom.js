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
      render: (data) => <div>{data.sender_data.fullname}</div>,
    },
    {
      name: Lang.get("Type"),
      center: false,
      render: (data) => <div>{data.recipient_data.fullname}</div>,
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
                      backgroundColor: App.getData().getStatusColor(
                        data.status?.id
                      ),
                      borderRadius: "50%",
                      marginTop: 2,
                    }}
                  />
                </div>
                <p className="mb-0 ml-2 fw-400 lh-20 fs-14">
                  {Lang.get(data.status?.value)}
                </p>
              </div>
              {data.cancelled_by && (
                <span className="fs-14">
                  <b>{Lang.get("By")}:</b>{" "}
                  {data.cancelled_by.user === ""
                    ? Lang.get(data.cancelled_by.type)
                    : data.cancelled_by.user?.fullname}
                </span>
              )}
              {data.cancelled_reason ? (
                <span className="text-purple fs-13">
                  {data.cancelled_reason?.title}
                </span>
              ) : (
                <React.Fragment>
                  {data.cancelled_by && (
                    <span className="text-purple fs-13">
                      {data.cancelled_description?.slice(0, 70)}
                      {data.cancelled_description?.length > 70 ? "..." : ""}
                    </span>
                  )}
                </React.Fragment>
              )}
            </div>
          ),
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
