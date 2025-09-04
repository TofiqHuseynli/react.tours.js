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

import { roomTypeAdd } from "@actions";

export const Add = ({ onClose, reload }) => {
  const toast = useToast();

  const [state, setState] = React.useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    {
      loading: false,
      title: "",
      status: false,
      defaultVat: 0,
      currency_list: [],
      terms_list: [],
      currencies: [],
      timezones: [],
      branches: {
        data: [
          {
            ...Auth.get("company"),
            id: Auth.get("company")?.id,
            avatar: Auth.get("company")?.avatar?.medium,
            fullname: Auth.get("company")?.title,
          },
        ],
        count: 0,
      },
      template: null,
      updateLoading: false,
      defaultRate: null,
      description: "",
      start_date: "",
      start_time: "",
      expires_date: "",
      expires_time: "",
      owner: {
        label: Auth.get("fullname"),
        value: Auth.get("id"),
        company: {
          ...Auth.get("company"),
          id: Auth.get("company")?.id,
          avatar: Auth.get("company")?.avatar?.medium,
          title: Auth.get("company")?.title,
        },
      },
      branch: null,
    }
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    setState({ updateLoading: true });
    let response = null;
    if (!state.updateLoading) {
      response = await roomTypeAdd({
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
