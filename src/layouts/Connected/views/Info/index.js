import React from "react";
import {ErrorBoundary, Lang, Loading, Popup} from "fogito-core-ui";
import { useParams } from "react-router-dom";
import { connectedEdit, connectedInfo } from "@actions";


export const Info = ({ onClose, reload }) => {
  let urlParams = useParams();

  const [state, setState] = React.useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    {
      id: urlParams?.id,
      loading: true,
      skip: 0,
      data: [],
      params: {},
      mail:""
    }
  );

  const loadData = async () => {
    setState({ loading: true });
    let response = await connectedInfo({ id: state.id });
    if (response) {
      if (response.status === "success" && response.data) {
        setState({ data: response.data,
                   mail: response.data.email
         });
      }
      setState({ loading: false });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setState({ updateLoading: true });
    if (!state.updateLoading) {
      let response = null;
      response = await connectedEdit({
        data:{
          id: state.id,
          mail: state.mail
        }
      });
      if (response) {
        setState({ updateLoading: false });
        if (response.status === "success") {
          await reload();
          toast.fire({
            title: Lang.get(response.description),
            icon: "success",
          });
        } else {
          toast.fire({
            title: Lang.get(response.description),
            icon: "error",
          });
        }
      }
    }
  };


  React.useEffect(() => {
    loadData();
  }, []);

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
              value={state.mail}
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
