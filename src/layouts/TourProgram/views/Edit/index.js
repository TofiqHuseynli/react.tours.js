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
import { tourProgramAdd, tourProgramEdit, tourProgramInfo } from "@actions";

export const Edit = ({
  onClose,
  reload,
  match: {
    params: { id },
    url,
  },
}) => {
  const toast = useToast();

  const [state, setState] = React.useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    {
      loading: false,
      title: "",
      note: "",
      status: false,
      description: "",
      updateLoading: false,
    }
  );

  const loadData = async () => {
    setState({ loading: true });
    let response = await tourProgramInfo({
      id,
    });
    if (response) {
      setState({ loading: false });
      if (response.status === "success") {
        console.log("fff");
        setState({
          title: response.data.title,
          note: response.data.note,
          description: response.data.description,
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

  const goBack = () => {
    if (typeof onClose === "function") {
      onClose();
    } else {
      history.push("/contracts");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setState({ updateLoading: true });
    let response = null;
    if (!state.updateLoading) {
      response = await tourProgramEdit({
        id: id,
        title: state.title,
        note: state.note,
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

  React.useEffect(() => {
    loadData();
  }, []);

  const renderModalHeader = () => <div>{Lang.get("Edit")}</div>;

  return (
    <ErrorBoundary>
      <Popup show size="xl" onClose={onClose} header={renderModalHeader()}>
        <Popup.Body>
          <div className="form-group">
            <div className="row">
              <div className="form-group col-xl-6">
                <label>{Lang.get("Title")}</label>
                <input
                  className="form-control"
                  placeholder={Lang.get("Title")}
                  value={state.title}
                  onChange={(e) => setState({ title: e.target.value })}
                />
              </div>
              <div className="form-group col-xl-6">
                <label>{Lang.get("Note")}</label>
                <input
                  className="form-control"
                  placeholder={Lang.get("Note")}
                  value={state.note}
                  onChange={(e) => setState({ note: e.target.value })}
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
