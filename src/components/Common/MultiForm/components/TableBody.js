import React from "react";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { Draggable } from "react-beautiful-dnd";
import classNames from "classnames";
import ErrorBoundary from "fogito-core-ui/build/components/error/ErrorBoundary";
import Textarea from "fogito-core-ui/build/components/form/Textarea";
import { Lang, Picker } from "fogito-core-ui";
import { Computations } from "../../library";
import moment from "moment";
import { roomTypeMinList } from "@actions";

export const TableBody = (props) => {
  const { params, setParams, provided, setState, state } = props;

  const onActiveRow = (rowKey, isActive) => {
    const updatedItems = [...params?.accommodations];
    if (!isActive) {
      updatedItems.forEach((item, index) => {
        updatedItems[index].active = rowKey === index;
      });
    } else {
      updatedItems[rowKey].active = false;
    }
    setParams({
      ...params,
      accommodations: updatedItems,
    });
  };

  const onDeleteRow = (index) => {
    const updatedItems = [...params.accommodations];
    updatedItems.splice(index, 1);
    // setParams({ items: updatedItems });
    setParams({
      ...params,
      accommodations: updatedItems,
    });
  };

  const onChangeFunction = (index, fieldName, value) => {
    const updatedItems = [...params.accommodations];
    let regex;

    switch (fieldName) {
      case "description":
        updatedItems[index][fieldName] = value;
        break;
      case "accom":
        updatedItems[index][fieldName] = value;
        break;
      case "room_type":
        updatedItems[index][fieldName] = value;
        break;
      case "unit":
        regex = /^(0|[1-9][0-9]{0,8})(\.[0-9]{0,8})?$/;
        if (value === "" || regex.test(value)) {
          updatedItems[index][fieldName] = value;
        }
        break;
      default:
        break;

      case "night":
        regex = /^(0|[1-9][0-9]{0,8})(\.[0-9]{0,8})?$/;
        if (value === "" || regex.test(value)) {
          updatedItems[index][fieldName] = value;
          break;
        } else {
          break;
        }
      case "extra_bed":
        updatedItems[index][fieldName] = value;
        break;

      case "adult":
        regex = /^(0|[1-9][0-9]{0,8})(\.[0-9]{0,8})?$/;
        if (value === "" || regex.test(value)) {
          updatedItems[index][fieldName] = value;
          break;
        } else {
          break;
        }
      case "child":
        regex = /^(0|[1-9][0-9]{0,8})(\.[0-9]{0,8})?$/;
        if (value === "" || regex.test(value)) {
          updatedItems[index][fieldName] = value;
          break;
        } else {
          break;
        }

      case "conf_num":
        regex = /^(0|[1-9][0-9]{0,8})(\.[0-9]{0,8})?$/;
        if (value === "" || regex.test(value)) {
          updatedItems[index][fieldName] = value;
          break;
        } else {
          break;
        }
    }
    // setParams({ items: updatedItems });
    setParams({
      ...params,
      accommodations: updatedItems,
    });
  };

  // React.useEffect(() => {
  //   setParams({
  //     result: Computations.calculate(
  //       params.accounting_settings.discount_level?.value == "item"
  //         ? params.items
  //         : params.items.map((item) => {
  //             item.discount = {
  //               type: "percent",
  //               value: "",
  //             };
  //             item.amount = item.rate * item.quantity;
  //             return item;
  //           }),
  //       params.accounting_settings.tax_method?.value,
  //       params.discount_data,
  //       params.accounting_settings.discount_level?.value,
  //       params.accounting_settings.rounding
  //     ),
  //   });
  // }, [
  //   params.items,
  //   params.accounting_settings,
  //   params.discount_after_tax,
  //   params.discount_data,
  // ]);

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

  return (
    <ErrorBoundary>
      <div className="t-main-body">
        {params.accommodations?.map((row, index) => {
          let uniq_id = "_id_" + index;
          return (
            <Draggable key={uniq_id} draggableId={uniq_id} index={index}>
              {(provided, snapshot) => {
                if (snapshot.isDragging) {
                  provided.draggableProps.style.left =
                    provided.draggableProps.style.offsetLeft;
                  provided.draggableProps.style.bottom =
                    provided.draggableProps.style.offsetBottom;
                }
                return (
                  <div
                    className="row-border"
                    onClick={() => onActiveRow(index, row.active)}
                    style={{ cursor: "default" }}
                    ref={provided.innerRef}
                    {...(params.accommodations.length > 1 && {
                      ...provided.draggableProps,
                    })}
                    {...provided.dragHandleProps}
                  >
                    <div className="t-main-body-row hover-affected-row">
                      {params.accommodations?.length > 1 && (
                        <div
                          style={{ flex: 1 }}
                          className=" d-flex align-items-center"
                        >
                          <div
                            className={classNames("drag-grid", {
                              dragging: snapshot.isDragging,
                            })}
                          >
                            <img
                              src={`${process.env.publicPath}/assets/icons/grid.svg`}
                              alt="grid"
                            />
                          </div>
                        </div>
                      )}

                      <div
                        className="d-flex flex-column justify-content-center"
                        style={{ flex: 8, overflow: "auto" }}
                      >
                        <div className="fw-bold">{row.title}</div>

                        <div className={`${!row.title ? "fw-bold" : ""} `}>
                          {row.description?.length > 20
                            ? row.description.slice(0, 20) + "..."
                            : row.description}
                        </div>
                      </div>
                      <div className="d-flex" style={{ flex: 24 }}>
                        <div
                          className=""
                          style={{ flex: 3, marginLeft: "10px" }}
                        >
                          {row.roomType}
                        </div>

                        <div
                          className=" d-flex justify-content-center cursor-pointer"
                          style={{ flex: 1 }}
                          // onClick={() => onActiveRow(index, row.active)}
                        >
                          {/* <i
                            style={{ marginTop: "5px", fontSize: "26px" }}
                            className={`text-primary feather feather-chevron-${
                              row.active ? "up" : "down"
                            } `}
                          /> */}
                        </div>
                        <div
                          onClick={(e) =>
                            e.stopPropagation() + onDeleteRow(index)
                          }
                          className=" d-flex justify-content-center text-danger cursor-pointer"
                          style={{ flex: 1 }}
                        >
                          <i
                            style={{
                              // marginTop: "5px",
                              fontSize: "20px",
                            }}
                            className={`feather feather-x`}
                          />
                        </div>
                      </div>
                    </div>
                    {!!row.active && (
                      <>
                        <div className="t-main-body-row">
                          {params.accommodations?.length > 1 && (
                            <div className="" style={{ flex: 1 }}></div>
                          )}

                          <div
                            style={{
                              height: "145.5px",
                              flex: 6,
                              marginLeft: "10px",
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Select
                              styles={{
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 9999,
                                }),
                              }}
                              menuPortalTarget={document.body}
                              cacheOptions
                              value={row.accom}
                              placeholder={Lang.get("Accom")}
                              // options={state.options?.accom}
                              className="form-control h-100"
                              onChange={(e) =>
                                onChangeFunction(index, "accom", e)
                              }
                            />{" "}
                          </div>
                          <div
                            className="d-flex flex-column"
                            style={{ flex: 24 }}
                          >
                            <div className="d-flex mb-3">
                              <div
                                style={{
                                  flex: 4,
                                  marginLeft: "10px",
                                }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {/* <Select
                                  styles={{
                                    menuPortal: (base) => ({
                                      ...base,
                                      zIndex: 9999,
                                    }),
                                  }}
                                  menuPortalTarget={document.body}
                                  cacheOptions
                                  value={row.room_type}
                                  placeholder={Lang.get("RoomType")}
                                  // options={state.options?.room_type}
                                  className="form-control"
                                  onChange={(e) =>
                                    onChangeFunction(index, "room_type", e)
                                  }
                                />{" "} */}
                                <AsyncSelect
                                  isClearable
                                  cacheOptions
                                  defaultOptions
                                  value={row.room_type}
                                  loadOptions={loadRoomType}
                                  placeholder={Lang.get("Select")}
                                  onChange={(e) =>
                                    onChangeFunction(index, "room_type", e)
                                  }
                                  className="form-control"
                                />
                              </div>

                              <div
                                className=" "
                                style={{ flex: 2, marginLeft: "10px" }}
                              >
                                <input
                                  // disabled={isDraft || from ? 0 : state?.id}
                                  className="form-control"
                                  placeholder={Lang.get("Unit")}
                                  value={row.unit}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) =>
                                    onChangeFunction(
                                      index,
                                      "unit",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              <div
                                className=" d-flex"
                                style={{ flex: 2, marginLeft: "10px" }}
                              >
                                <input
                                  // disabled={isDraft || from ? 0 : state?.id}
                                  className="form-control"
                                  placeholder={Lang.get("Night")}
                                  value={row.night}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) =>
                                    onChangeFunction(
                                      index,
                                      "night",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>

                              <div
                                className=" d-flex"
                                style={{ flex: 3, marginLeft: "10px" }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Picker
                                  date={state.check_in_date}
                                  time={state.check_in_time.slice(0, 5)}
                                  timezoneCondition={false}
                                  onChangeDate={(date) =>
                                    onChangeFunction({
                                      index,
                                      
                                      ...state,
                                      check_in_date: moment(
                                        date !== null ? date : new Date()
                                      ).format("YYYY-MM-DD"),
                                      check_in_time:
                                        state.check_in_date ||
                                        state.check_in_time
                                          ? state.check_in_time
                                          : "00:00",
                                    })
                                  }
                                  onChangeTime={(time) =>
                                    setState({
                                      check_in_date:
                                        state.check_in_date ||
                                        state.check_in_time
                                          ? state.check_in_date
                                          : moment(new Date()).format(
                                              "YYYY-MM-DD"
                                            ),
                                      check_in_time: time,
                                    })
                                  }
                                  onChangeToday={() => {
                                    let today = new Date();
                                    setState({
                                      ...state,
                                      check_in_date:
                                        moment(today).format("YYYY-MM-DD"),
                                      check_in_time:
                                        moment(today).format("HH:mm"),
                                    });
                                  }}
                                  onClearDate={() =>
                                    setState({ check_in_date: "" })
                                  }
                                  onClearTime={() =>
                                    setState({ check_in_time: "" })
                                  }
                                />
                              </div>

                              <div
                                className=" d-flex"
                                style={{ flex: 3, marginLeft: "10px" }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Picker
                                  date={state.check_out_date}
                                  time={state.check_out_time.slice(0, 5)}
                                  timezoneCondition={false}
                                  onChangeDate={(date) =>
                                    setState({
                                      ...state,
                                      check_out_date: moment(
                                        date !== null ? date : new Date()
                                      ).format("YYYY-MM-DD"),
                                      check_out_time:
                                        state.check_out_date ||
                                        state.check_out_time
                                          ? state.check_out_time
                                          : "00:00",
                                    })
                                  }
                                  onChangeTime={(time) =>
                                    setState({
                                      check_out_date:
                                        state.check_out_date ||
                                        state.check_out_time
                                          ? state.check_out_date
                                          : moment(new Date()).format(
                                              "YYYY-MM-DD"
                                            ),
                                      check_out_time: time,
                                    })
                                  }
                                  onChangeToday={() => {
                                    let today = new Date();
                                    setState({
                                      ...state,
                                      check_out_date:
                                        moment(today).format("YYYY-MM-DD"),
                                      check_out_time:
                                        moment(today).format("HH:mm"),
                                    });
                                  }}
                                  onClearDate={() =>
                                    setState({ check_out_date: "" })
                                  }
                                  onClearTime={() =>
                                    setState({ check_out_time: "" })
                                  }
                                />
                              </div>
                            </div>

                            {/* Bottom */}
                            <div className="d-flex ">
                              <div
                                style={{
                                  flex: 4,
                                  marginLeft: "10px",
                                }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Select
                                  styles={{
                                    menuPortal: (base) => ({
                                      ...base,
                                      zIndex: 9999,
                                    }),
                                  }}
                                  menuPortalTarget={document.body}
                                  cacheOptions
                                  value={row.extra_bed}
                                  placeholder={Lang.get("ExtraBed")}
                                  // options={state.options?.room_type}
                                  className="form-control"
                                  onChange={(e) =>
                                    onChangeFunction(index, "extra_bed", e)
                                  }
                                />{" "}
                              </div>

                              <div
                                className=" "
                                style={{ flex: 2, marginLeft: "10px" }}
                              >
                                <input
                                  // disabled={isDraft || from ? 0 : state?.id}
                                  className="form-control"
                                  placeholder={Lang.get("Adult")}
                                  value={row.adult}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) =>
                                    onChangeFunction(
                                      index,
                                      "adult",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>

                              <div
                                className=" "
                                style={{ flex: 2, marginLeft: "10px" }}
                              >
                                <input
                                  // disabled={isDraft || from ? 0 : state?.id}
                                  className="form-control"
                                  placeholder={Lang.get("Child")}
                                  value={row.child}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) =>
                                    onChangeFunction(
                                      index,
                                      "child",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>

                              <div
                                className=" "
                                style={{ flex: 2, marginLeft: "10px" }}
                              >
                                <input
                                  // disabled={isDraft || from ? 0 : state?.id}
                                  className="form-control"
                                  placeholder={Lang.get("ConfirmationNumber")}
                                  value={row.conf_num}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) =>
                                    onChangeFunction(
                                      index,
                                      "conf_num",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              }}
            </Draggable>
          );
        })}
        {provided.placeholder}
      </div>
    </ErrorBoundary>
  );
};
