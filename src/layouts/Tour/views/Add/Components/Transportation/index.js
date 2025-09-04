import React from "react";
import {
  ErrorBoundary,
  InfoLabel,
  InputCheckbox,
  Lang,
  Picker,
  Textarea,
} from "fogito-core-ui";
import AsyncSelect from "react-select/async";
import moment from "moment";

export const Transportation = ({
  state,
  params,
  setState,
  setParams,
  onSubmit,
}) => {
  const onAddTourItem = () => {
    const newItem = {
      date: "",
      time: "",
      tour: null,
      note: "",
      description: "",
    };

    const updatedItems = [...(params.tour_pro.items || []), newItem];
    setParams({
      ...params,
      tour_pro: {
        ...params.tour_pro,
        items: updatedItems,
      },
    });
  };

  const updateTourItem = (index, field, value) => {
    const updatedItems = [...params.tour_pro.items];
    updatedItems[index][field] = value;
    setParams({
      ...params,
      tour_pro: {
        ...params.tour_pro,
        items: updatedItems,
      },
    });
  };

  return (
    <ErrorBoundary>
      <div className="row">
        <div className="col-xl-8">
          <div className="row">
            <div className="form-group col-xl-4">
              <label>{Lang.get("CarType")}</label>
              <AsyncSelect
                isClearable
                cacheOptions
                defaultOptions
                // value={params.car_type}
                // loadOptions={loadBoards}
                placeholder={Lang.get("Select")}
                onChange={(car_type) => setParams({ ...params, car_type })}
                className="form-control"
              />
            </div>
            <div className="form-group col-xl-3">
              <label>{Lang.get("Pax")}</label>
              <input
                className="form-control"
                placeholder={Lang.get("Write")}
                value={state.pax}
                onChange={(e) => setState({ pax: e.target.value })}
              />
            </div>

            <div className="form-group col-xl-4">
              <label>{Lang.get("Driver")}</label>
              <AsyncSelect
                isClearable
                cacheOptions
                defaultOptions
                // value={params.driver}
                // loadOptions={loadBoards}
                placeholder={Lang.get("Title")}
                onChange={(driver) => setParams({ ...params, driver })}
                className="form-control"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="form-group col-xl-4 mt-4">
          <InputCheckbox
            label={Lang.get("CreateTourProgramme")}
            checked={params.tour_pro.active}
            onChange={(e) => {
              const isChecked = !!e.target.checked;

              setParams({
                ...params,
                tour_pro: {
                  ...params.tour_pro,
                  active: isChecked ? 1 : 0,
                  sending: isChecked ? { type: "complete" } : null,
                  items: isChecked
                    ? params.tour_pro.items && params.tour_pro.items.length > 0
                      ? params.tour_pro.items
                      : [
                          {
                            date: "",
                            time: "",
                            tour: null,
                            note: "",
                            description: "",
                          },
                        ]
                    : [],
                },
              });
            }}
          />
        </div>
      </div>
      {params.tour_pro.active == 1 && params.tour_pro.items.length > 0 && (
        <div>
          {(params.tour_pro.items || []).map((item, index) => (
            <div className="row mt-4" key={index}>
              <div className="col-xl-8">
                <div className="row">
                  <div className="form-group col-xl-6">
                    <label>{Lang.get("Date")}</label>
                    <Picker
                      date={item.date}
                      time={item.time}
                      timezoneCondition={false}
                      onChangeDate={(date) =>
                        updateTourItem(
                          index,
                          "date",
                          moment(date || new Date()).format("YYYY-MM-DD")
                        )
                      }
                      onChangeTime={(time) =>
                        updateTourItem(index, "time", time)
                      }
                      onChangeToday={() => {
                        const now = new Date();
                        updateTourItem(
                          index,
                          "date",
                          moment(now).format("YYYY-MM-DD")
                        );
                        updateTourItem(
                          index,
                          "time",
                          moment(now).format("HH:mm")
                        );
                      }}
                      onClearDate={() => updateTourItem(index, "date", "")}
                      onClearTime={() => updateTourItem(index, "time", "")}
                    />
                  </div>

                  <div className="form-group col-xl-6">
                    <label>{Lang.get("TourProgrm")}</label>
                    <AsyncSelect
                      isClearable
                      cacheOptions
                      defaultOptions
                      value={item.tour}
                      placeholder={Lang.get("Title")}
                      onChange={(value) => updateTourItem(index, "tour", value)}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="form-group col-xl-6">
                    <label>{Lang.get("Note")}</label>
                    <input
                      className="form-control"
                      placeholder={Lang.get("Write")}
                      value={item.note}
                      onChange={(e) =>
                        updateTourItem(index, "note", e.target.value)
                      }
                    />
                  </div>

                  <div className="form-group col-xl-6">
                    <Textarea
                      rows="4"
                      maxLength="1500"
                      value={item.description}
                      onChange={(e) =>
                        updateTourItem(index, "description", e.target.value)
                      }
                      placeholder={Lang.get("Description")}
                      className="form-control"
                    />
                    <span className="text-muted fs-12 mt-1">
                      {Lang.get("MaxLength").replace(
                        "{length}",
                        1500 - (item.description?.length || 0)
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="d-flex justify-content-between my-4">
            <div>
              <button
                type="button"
                className="btn btn-secondary py-0"
                onClick={onAddTourItem}
              >
                + {Lang.get("Add")}
              </button>
            </div>
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
};
