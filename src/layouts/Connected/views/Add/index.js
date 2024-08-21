import React from "react";
import {
  ErrorBoundary,
  Lang,
  useToast,
  Popup,
  Loading,
} from "fogito-core-ui";
import { Spinner } from "@components";
import { useForm } from "react-hook-form";
import {
  connectedAdd,
 } from "@actions";

export const Add = ({ onClose, reload }) => {
  const toast = useToast();
  const [state, setState] = React.useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    {
      loading: false,
      mail: '',
    }
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    setState({ updateLoading: true });
    let response = null;
    if (!state.updateLoading) {
      response = await connectedAdd({
        data: {
          mail: state.mail,
        },
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

  const { control } = useForm({
    mode: "onChange",
  });

  const renderModalHeader = () => <div>{Lang.get("Connect")}</div>;
  return (
    <ErrorBoundary>
      <Popup show size="l" onClose={onClose} header={renderModalHeader()}>
        <Popup.Body>
          {state.loading && <Loading />}
          
          <div className="form-group col-md-12">
          <div className="form-group col-md-12">
            <h3>
              {Lang.get("Please enter email address you want to connect!")}
            </h3>
            </div>
            <div className="form-group col-md-12">
              <label className="form-control-label">
                {Lang.get("E-mail")}
              </label>
              <input
                className="form-control"
                placeholder={Lang.get("Enter email address")}
                value={state.subject}
                onChange={(e) =>
                  setState({ mail: e.target.value })
                }
              />
            </div>
           
          </div>
        </Popup.Body>
        <Popup.Footer>
          <div className="d-flex">
            <button onClick={onSubmit} className="btn btn-primary w-100">
              {state.saveLoading ? (
                <Spinner color="#fff" style={{ width: 30 }} />
              ) : (
                Lang.get("Send")
              )}
            </button>
            <button onClick={() => onClose()} className="btn btn-danger w-100">
              {Lang.get("Cancel")}
            </button>
          </div>
        </Popup.Footer>
      </Popup>
    </ErrorBoundary>
  );
};
