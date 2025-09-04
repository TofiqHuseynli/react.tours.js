import React from "react";
import { ErrorBoundary, Lang, Loading, useToast } from "fogito-core-ui";
import { dataParameters, labelsAdd } from "@actions";

export const Add = React.memo(
  ({ onClose, data, setData, params, setParams }) => {
    const toast = useToast();
    const [state, setState] = React.useReducer(
      (prevState, newState) => ({ ...prevState, ...newState }),
      {
        labels: [],
        loading: false,
        color: "",
        selected: "",
        title: "",
      }
    );

    const loadData = async () => {
      setState({ loading: true });
      let response = await dataParameters({
        names: ["default_colors", "param_name"],
      });
      if (response) {
        setState({ loading: false });
        if (response.status === "success") {
          setState({ labels: response.data.default_colors });
        } else {
          setState({ labels: [] });
        }
      }
    };

    const onSubmit = async (e) => {
      e.preventDefault();
      let response = await labelsAdd({
        title: state.title,
        color: state.color,
      });
      let newObj = {
        id: response.data?.id,
        selected: true,
        title: state.title,
        color: state.color,
      };
      if (response) {
        setState({ loading: false });
        if (response.status === "success") {
          toast.fire({ icon: "success", title: response.description });
          setData({
            labels: data.labels.concat([newObj]),
          });
          setParams({
            ...params,
            labels: params.labels.concat([newObj]),
          });
          onClose();
        } else {
          toast.fire({ icon: "error", title: response.description });
        }
      }
    };

    React.useEffect(() => {
      loadData();
    }, []);

    return (
      <ErrorBoundary>
        {state.loading && <Loading />}
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-control-label">{Lang.get("Title")}</label>
            <input
              autoFocus
              placeholder={Lang.get("Title")}
              className="form-control mb-2"
              value={state.title}
              onChange={(e) => {
                setState({ title: e.target.value });
              }}
            />
          </div>
          <div className="form-group">
            <label className="form-control-label mb-0">
              {Lang.get("Color")}
            </label>
            <div className="form-row" style={{ margin: "0 -4px" }}>
              {state.labels.map((row, key) => (
                <React.Fragment key={key}>
                  <div className="col-md-2 col-4 px-1">
                    <button
                      key={key}
                      style={{
                        height: 40,
                        backgroundColor: row.dex,
                      }}
                      onClick={() =>
                        setState({ selected: row.dex, color: row.dex })
                      }
                      type="button"
                      className="btn d-flex align-items-center justify-content-center text-white mt-2 w-100 fs-18"
                    >
                      {state.selected === row.dex && (
                        <i className="feather feather-check" />
                      )}
                    </button>
                  </div>
                </React.Fragment>
              ))}
            </div>
            <div className="form-row">
              <div className="d-flex align-items-center mt-2 ml-1">
                <input
                  type="color"
                  className="form-control form-control-color"
                  value={state.color}
                  id="color"
                  title={Lang.get("ChooseYourColor")}
                  style={{ height: 48, width: 70 }}
                  onChange={(e) => {
                    setState({
                      selected: false,
                      color: e.target.value,
                    });
                  }}
                />
                <label className="form-control-label mb-0 ml-2" htmlFor="color">
                  {Lang.get("ChooseYourColor")}
                </label>
              </div>
            </div>
          </div>
          <div className="form-row mx-0">
            <button className="btn btn-success col-md mt-2">
              {Lang.get("Add")}
            </button>
          </div>
        </form>
      </ErrorBoundary>
    );
  }
);
