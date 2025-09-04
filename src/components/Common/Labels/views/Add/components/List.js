import React from "react";
import { ErrorBoundary, Popup, useModal, Lang, Auth } from "fogito-core-ui";
import { Add, Edit } from "./";
import { labelsList } from "@actions";
import { LabelsLoading } from "@components";

export const List = React.memo(({ params, setParams }) => {
  const modal = useModal();
  const [data, setData] = React.useReducer(
    (prevParams, newParams) => ({ ...prevParams, ...newParams }),
    {
      settingType: "list",
      loading: false,
      row: null,
      labels: [],
      title: "",
    }
  );

  const loadData = async () => {
    setData({ loading: true });
    let response = await labelsList();
    if (response) {
      setData({ loading: false });
      if (response.status === "success") {
        setData({ labels: response.data });
      } else {
        setData({ labels: [] });
      }
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const onSelected = async (row, value) => {
    setParams({
      ...params,
      labels: params.labels.map((x) => {
        if (x.id === row.id) {
          return { ...x, selected: !row.selected };
        }
        return { ...x };
      }),
    });
    if (value == 1) {
      setParams({
        ...params,
        labels: params.labels.concat([row]),
      });
    } else {
      setParams({
        ...params,
        labels: params.labels.filter((x) => x.id !== row.id),
      });
    }
  };

  return (
    <ErrorBoundary>
      <Popup
        show={modal.modals.includes("add")}
        title={Lang.get("Add")}
        onClose={() => modal.hide("add")}
        size="md"
      >
        <Add
          onClose={() => modal.hide("add")}
          data={data}
          setData={setData}
          params={params}
          setParams={setParams}
        />
      </Popup>
      <Popup
        show={modal.modals.includes("edit")}
        title={Lang.get("Add")}
        onClose={() => modal.hide("edit")}
        size="md"
      >
        <Edit
          onClose={() => modal.hide("edit")}
          row={data.row}
          data={data}
          setData={setData}
          params={params}
          setParams={setParams}
        />
      </Popup>
      <div className="col-12 px-0">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="input-group input-radius">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <i className="feather feather-search" />
              </span>
            </div>
            <input
              autoFocus
              placeholder={Lang.get("Search")}
              className="form-control"
              onChange={(e) => setData({ title: e.target.value })}
            />
          </div>
          {Auth.isPermitted("card_labels", "modify") && (
            <button
              className="btn btn-primary m-0 ml-2 rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: 42, height: 42 }}
              onClick={() => {
                setData({ row: null });
                modal.show("add");
              }}
            >
              <i className="feather feather-plus align-middle fs-18 m-0" />
            </button>
          )}
        </div>
        {data.loading && <LabelsLoading />}
        {data.labels
          .filter((x) => x.title.toLowerCase().includes(data.title))
          .map((row, key) => {
            let selected = params.labels.find((x) => x.id === row.id);
            return (
              <div className="labels d-flex mt-2" key={key}>
                <button
                  className="btn label-item"
                  style={{
                    backgroundColor: row.color,
                    height: 45,
                  }}
                  onClick={() => onSelected(row, selected ? 0 : 1)}
                >
                  <span className="text-white">{row.title}</span>
                  {selected && (
                    <i className="feather feather-check fs-18 text-white" />
                  )}
                </button>
                {Auth.isPermitted("card_labels", "modify") && (
                  <div className="edit-btn">
                    <button
                      className="d-flex align-items-center justify-content-center btn"
                      onClick={() => {
                        setData({ row: row });
                        modal.show("edit");
                      }}
                      style={{
                        backgroundColor: row.color,
                        width: 45,
                        height: 45,
                      }}
                    >
                      <i className="feather feather-edit-2 text-white fs-16" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </ErrorBoundary>
  );
});
