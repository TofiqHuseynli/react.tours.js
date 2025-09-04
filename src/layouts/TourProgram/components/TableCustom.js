import React from "react";
import {
  ErrorBoundary,
  Lang,
  Table,
  SimpleDate,
  Members,
  Auth,
  Avatar,
} from "fogito-core-ui";
import { Link } from "react-router-dom";
import Tooltip from "antd/lib/tooltip";

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
      width: 500,
      name: Lang.get("Title"),
      key: "title",
      render: (data) => (
        <React.Fragment>
          <Link
            to={`${path}/edit/${data.id}/view`}
            className="text-primary-alternative"
            style={{
              maxWidth: 450,
              overflow: "hidden",
              display: "-webkit-box",
              textOverflow: "ellipsis",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
            }}
          >
            {data?.title || Lang.get("NoData")}
          </Link>
        </React.Fragment>
      ),
    },
    {
      width: 500,
      name: Lang.get("Description"),
      key: "title",
      render: (data) => (
        <React.Fragment>
          <Link
            to={`${path}/edit/${data.id}/view`}
            className="text-primary-alternative"
            style={{
              maxWidth: 450,
              overflow: "hidden",
              display: "-webkit-box",
              textOverflow: "ellipsis",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
            }}
          >
            {data?.title || Lang.get("NoData")}
          </Link>
        </React.Fragment>
      ),
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
      name: Lang.get("CreatedDate"),
      center: false,
      sort: "expires_date",
      key: "created_at",
      render: (data) => <SimpleDate date={data.created_at} />,
    },
    {
      name: Lang.get("Actions"),
      center: true,
      width: 50,
      key: "actions",
      render: (data) => (
        <React.Fragment>
          <div className="d-flex flex-row justify-content-center">
            <Tooltip title={Lang.get("Edit")}>
              {data.permissions?.can_edit_template && (
                <Link
                  className="btn btn-outline-warning btn-sm h-auto lh-10 p-1 mb-2 mb-lg-0 mr-0"
                  to={`${path}/edit/${data?.id}/info`}
                >
                  <i className="feather feather-edit-2" />
                </Link>
              )}
            </Tooltip>
            <Tooltip title={Lang.get("Delete")}>
              {data.permissions?.can_delete_template && (
                <button
                  className="btn btn-outline-danger btn-sm h-auto lh-10 p-1 mb-2 mb-lg-0 mr-0 ml-2"
                  style={{ borderRadius: "50%" }}
                  onClick={() => onDelete([data?.id])}
                >
                  <i className="feather feather-x" />
                </button>
              )}
            </Tooltip>
          </div>
        </React.Fragment>
      ),
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
