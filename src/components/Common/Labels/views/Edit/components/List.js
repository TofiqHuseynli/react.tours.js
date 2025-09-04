import React from "react";
import {
  ErrorBoundary,
  Popup,
  useModal,
  useToast,
  Auth,
  Lang,
} from "fogito-core-ui";
import { Add, Edit } from "./";
import { labelsCheck, labelsList } from "@actions";
import { LabelsLoading } from "@components";

export const List = React.memo(({ state, setState, board, type, reload }) => {
  const modal = useModal();
  const toast = useToast();
  const [data, setData] = React.useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    {
      id: state?.id,
      type: type,
      settingType: "list",
      loading: false,
      row: null,
      labels: [],
      title: "",
    }
  );

  const loadData = async () => {
    setData({ loading: true });
    let response = await labelsList({
      label_type: type,
      parent_type: type,
      parent_id: state.id,
      board,
    });
    if (response) {
      setData({ loading: false });
      if (response.status === "success") {
        setData({ labels: response.data });
      } else {
        setData({ labels: [] });
      }
    }
  };

  const onSelected = async (row, value) => {
    setData({
      labels: data.labels.map((x) => {
        if (x.id === row.id) {
          return { ...x, selected: !row.selected };
        }
        return { ...x };
      }),
    });
    if (!!value) {
      setState({ labels: state.labels.concat([row]) });
    } else {
      setState({ labels: state.labels.filter((x) => x.id != row.id) });
    }
    let response = await labelsCheck({
      label: row.id,
      parent_type: type,
      parent_id: state.id,
      value,
    });
    if (response.status === "success") {
      toast.fire({ icon: "success", title: response.description });
      reload();
    } else {
      toast.fire({ icon: "error", title: response.description });
      setData({
        labels: data.labels.map((x) => {
          if (x.id === row.id) {
            return { ...x, selected: row.selected };
          }
          return { ...x };
        }),
      });
      if (!value) {
        setState({ labels: state.labels.concat([row]) });
      } else {
        setState({ labels: state.labels.filter((x) => x.id != row.id) });
      }
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  return (
    <ErrorBoundary>
      <Popup
        show={modal.modals.includes("add")}
        title={Lang.get("Add")}
        onClose={() => modal.hide("add")}
        size="md"
      >
        <Add onClose={() => modal.hide("add")} data={data} setData={setData} />
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
          parentState={state}
          parentSetState={setState}
          setData={setData}
          data={data}
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
          .map((row, key) => (
            <div className="labels d-flex mt-2" key={key}>
              <button
                className="btn label-item"
                style={{
                  backgroundColor: row.color,
                  height: 45,
                  borderRadius:
                    !Auth.isPermitted("card_labels", "modify") && ".375rem",
                }}
                onClick={() => onSelected(row, row.selected ? 0 : 1)}
              >
                <span className="text-white">{row.title}</span>
                {row.selected && (
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
          ))}
      </div>
    </ErrorBoundary>
  );
});
