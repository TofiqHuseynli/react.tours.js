import React from "react";
import {
  ErrorBoundary,
  Lang,
  useToast,
  Popup,
  Auth,
  InputCheckbox,
} from "fogito-core-ui";
import { Spinner } from "@components";

import { roomTypeAdd, roomTypeEdit, roomTypeInfo } from "@actions";

export const Edit = ({
  onClose,
  reload,
  match: {
    params: { id },
  },
}) => {
  const toast = useToast();

  const [state, setState] = React.useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    {
      loading: false,
      title: "",
      status: false,
    }
  );

  const loadData = async () => {
    setState({ loading: true });
    let response = await roomTypeInfo({
      id,
    });
    if (response) {
      setState({ loading: false });
      if (response.status === "success") {
        console.log("fff");
        setState({
          title: response.data.title,
          status: response.data.status,
        });
      }
    } else {
      toast.fire({
        title: response.message,
        icon: response.status,
      });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setState({ updateLoading: true });
    let response = null;
    if (!state.updateLoading) {
      response = await roomTypeEdit({
        id: id,
        title: state.title,
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

  React.useEffect(() => {
    loadData();
  }, []);

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
                Lang.get("Save")
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
