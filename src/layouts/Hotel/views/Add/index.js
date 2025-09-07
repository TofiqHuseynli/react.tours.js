import React from "react";
import {
  ErrorBoundary,
  Lang,
  useToast,
  Popup,
  Auth,
  Textarea,
  InputCheckbox,
} from "fogito-core-ui";
import { Spinner } from "@components";
import AsyncSelect from "react-select/async";
import { hotelAdd, offersAdd, roomTypeMinList } from "@actions";

export const Add = ({ onClose, reload }) => {
  const toast = useToast();

  const [state, setState] = React.useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    {
      loading: false,
      updateLoading: false,
      room_type: "",
      description: "",
      status: false,
    }
  );

  const [params, setParams] = React.useState({
    active: 0,
    items: [],
    fines: [],
    user_id: "",
    comment: "",
    date: null,
    template_id: null,
    currency_id: null,
    timezone_id: Auth.get("timezone")
      ? {
          label: Auth.get("timezone")?.title,
          value: Auth.get("timezone")?.id,
        }
      : null,
    expires_date: "",
    payment: "",
    currency: "",
    timezone: "",
    terms: null,
    vat_inclusive: 0,
    vat_included: 0,
    total_excluded_vat: 0,
    total_vat_amount: 0,
    total_included_vat: 0,
    total_to_pay: 0,
  });

  const loadRoomType = async (title) => {
    let response = await roomTypeMinList({
      archived: 0,
      skip: 0,
      limit: 20,
      title,
    });
    if (response?.status !== "success") {
      return response.data?.map((item) => ({
        value: item.value,
        label: item.label,
      }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setState({ updateLoading: true });
    let response = null;
    if (!state.updateLoading) {
      response = await hotelAdd({
        title: "fddf",
        country: "dd",
        room_type: state.room_type,
        status: state.status,
        description: state.description
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
              <div className="col-xl-8">
                <label>{Lang.get("Hotel")}</label>
                <AsyncSelect
                  isClearable
                  cacheOptions
                  defaultOptions
                  // value={params.board}
                  // loadOptions={loadBoards}
                  placeholder={Lang.get("Select")}
                  onChange={(board) => setParams({ ...params, board })}
                  className="form-control"
                />
              </div>
              <div className="form-group col-xl-4">
                <label>{Lang.get("Country")}</label>
                <AsyncSelect
                  isClearable
                  cacheOptions
                  defaultOptions
                  // value={params.board}
                  // loadOptions={loadBoards}
                  placeholder={Lang.get("Select")}
                  onChange={(board) => setParams({ ...params, board })}
                  className="form-control"
                />
              </div>
              <div className="form-group col-xl-12">
                <label>{Lang.get("RoomType")}</label>
                <AsyncSelect
                  isClearable
                  cacheOptions
                  defaultOptions
                  value={state.room_type}
                  loadOptions={loadRoomType}
                  placeholder={Lang.get("Select")}
                  onChange={(room_type) => setState({ ...state, room_type })}
                  className="form-control"
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
