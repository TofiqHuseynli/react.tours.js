import React from "react";
import {
  ErrorBoundary,
  Lang,
  useToast,
  Popup,
  Textarea,
  InputCheckbox,
} from "fogito-core-ui";
import { Spinner } from "@components";
import { serviceAdd } from "@actions";

export const Add = ({ onClose, reload }) => {
  const toast = useToast();

  const [state, setState] = React.useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    {
      loading: false,
      title: "",
      description: "",
      status: false,
    }
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    setState({ updateLoading: true });
    let response = null;
    if (!state.updateLoading) {
      response = await serviceAdd({
        title: state.title,
        description: state.description,
        status: state.status,
      });

      if (response) {
        setState({ updateLoading: false });
        if (response?.status === "success") {
          onClose();
          await reload();
          toast.fire({
            title: Lang.get(response?.description),
            icon: "success",
          });
        } else {
          toast.fire({
            title: Lang.get(response?.description || "TitleIsEmpty"),
            icon: "error",
          });
        }
      }
    }
  };
  const renderModalHeader = () => <div>{Lang.get("Add")}</div>;
  return (
    <ErrorBoundary>
      <Popup show size="xl" onClose={onClose} header={renderModalHeader()}>
        <Popup.Body>
          <div className="form-group">
            <div className="row">
              <div className="form-group col-xl-12">
                <label>{Lang.get("Title")}</label>
                <input
                  className="form-control"
                  placeholder={Lang.get("Title")}
                  value={state.title}
                  onChange={(e) => setState({ title: e.target.value })}
                />
              </div>
              <div className="col-xl-12 form-group">
                <label>{Lang.get("Description")}</label>
                <Textarea
                  rows="3"
                  maxLength="1500"
                  value={state.description}
                  onChange={(e) =>
                    setState({ ...state, description: e.target.value })
                  }
                  placeholder={Lang.get("Description")}
                  className="form-control"
                />
                <span className="text-muted fs-12 mt-1">
                  {Lang.get("MaxLength").replace(
                    "{length}",
                    1500 - state.description?.length
                  )}
                </span>
              </div>
              <div className=" form-group col-xl-3">
                <InputCheckbox
                  label={Lang.get("Active")}
                  checked={state.status}
                  onChange={(e) =>
                    setState({
                      ...state,
                      status: !!e.target.checked ? true : false,
                    })
                  }
                />
              </div>
            </div>
          </div>
        </Popup.Body>
        <Popup.Footer>
          <div className="d-flex">
            <button onClick={onSubmit} className="btn btn-primary w-100">
              {state.saveLoading ? (
                <Spinner color="#fff" style={{ width: 30 }} />
              ) : (
                Lang.get("Add")
              )}
            </button>
            <button onClick={() => onClose()} className="btn btn-danger w-100">
              {Lang.get("Close")}
            </button>
          </div>
        </Popup.Footer>
      </Popup>
    </ErrorBoundary>
  );
};
