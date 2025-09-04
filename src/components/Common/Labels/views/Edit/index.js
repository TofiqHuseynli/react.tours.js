import React from "react";
import {
  ErrorBoundary,
  Lang,
  Popup,
  Auth,
  useModal,
  useToast,
} from "fogito-core-ui";
import { List } from "./components";
import { labelsCheck } from "@actions";

export const Edit = React.memo(
  ({ id, params, type, userPermissions, reload, setLabels = () => {} }) => {
    const toast = useToast();
    const modal = useModal();
    const [state, setState] = React.useReducer(
      (prevState, newState) => ({ ...prevState, ...newState }),
      {
        id: id,
        labels: params.labels,
        loading: false,
      }
    );

    const onDelete = async (row) => {
      setState({ labels: state.labels.filter((x) => x.id !== row.id) });
      let response = await labelsCheck({
        label: row.id,
        parent_type: type,
        parent_id: state.id,
        value: 0,
      });
      if (response) {
        toast.fire({ icon: "success", title: response.description });
        reload();
      }
    };

    React.useEffect(() => {
      params.labels && setState({ labels: params.labels });
    }, [params.labels]);

    React.useEffect(() => {
      setLabels(state.labels);
    }, [state.labels]);

    return (
      <ErrorBoundary>
        <Popup
          show={modal.modals.includes("edit")}
          title={Lang.get("Labels")}
          onClose={() => modal.hide("edit")}
          size="md"
        >
          <List
            state={state}
            setState={setState}
            board={params?.board}
            type={type}
            reload={reload}
          />
        </Popup>
        <div className="form-group">
          <label className="mb-0">{Lang.get("Labels")}</label>
          <div className="label-row">
            {!!state.labels.length ? (
              state.labels.map((row, key) => (
                <div className="item" key={key}>
                  {Auth.isPermitted("card_labels", "modify") && (
                    <button
                      className="btn rounded-circle"
                      style={{ backgroundColor: row.color }}
                      onClick={() => onDelete(row)}
                    >
                      <i className="feather feather-x" />
                    </button>
                  )}
                  <button
                    key={key}
                    className="btn no-transform d-flex align-items-center justify-content-center text-white mt-2 px-3"
                    onClick={() => {
                      if (Auth.isPermitted("card_labels", "modify")) {
                        modal.show("edit");
                      }
                    }}
                    style={{
                      minWidth: 60,
                      height: 33,
                      backgroundColor: row.color,
                      marginRight: 12,
                    }}
                  >
                    {row.title.slice(0, 20)}
                    {row.title.length > 20 && "..."}
                  </button>
                </div>
              ))
            ) : !Auth.isPermitted("card_labels", "modify") ? (
              <span className="text-muted">{Lang.get("LabelNone")}</span>
            ) : (
              ""
            )}
            {Auth.isPermitted("card_labels", "modify") && (
              <button
                className="btn btn-primary mt-2 d-flex align-items-center"
                onClick={() => modal.show("edit")}
              >
                <i className="feather feather-plus fs-18" />
              </button>
            )}
          </div>
        </div>
      </ErrorBoundary>
    );
  }
);
