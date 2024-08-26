import React from "react";
import {ErrorBoundary, Lang, Table, SimpleDate, Status, useToast} from "fogito-core-ui";
import { Link, useParams } from "react-router-dom";
import {connectedConnect} from "@actions";

export const TableCustom = ({
  state,
  setState,
  path,
  loadData,
  VIEW,
  onDelete,
  loadMailList
}) => {

  const toast = useToast();

  const columns = [
    {
      name: Lang.get("E-mail"),
      center: false,
      render: (data) => <div>{data.mail}</div>,
    },
    {
      key: "is_connected",
      sort: "is_connected",
      name: Lang.get("Status"),
      render: (data) => (
        <Status
          status={data}
          title={data === 1 ? "Connected" : "Disconnected"}
        />
      ),
    },
    {
      name: Lang.get("Date"),
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
              {data.is_connected ?
                  (
                      <button
                          onClick={()=>onConnect(data.id,0)}
                          className="dropdown-item"
                      >
                        {Lang.get("Disconnect")}
                      </button>
                  ) :
                  (
                      <button
                          onClick={()=>onConnect(data.id,1)}
                          className="dropdown-item"
                      >
                        {Lang.get("Connect")}
                      </button>
                  )
              }

              <Link className="text-dark" to={`${path}/info/${data?.id}`}>
                <button className="dropdown-item">{Lang.get("Edit")}</button>
              </Link>
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


  const onConnect = async (id,value) => {
    let response = await connectedConnect({
      id,
      value
    });
    if (response) {
      setState({ loading: false, progressVisible: false });

      toast.fire({
        title: Lang.get(response?.description),
        icon: response.status,
      });

      if (response.status === "success") {
        loadData();
        loadMailList();
      }
    }
  };


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
