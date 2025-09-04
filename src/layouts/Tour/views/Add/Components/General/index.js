import React from "react";
import moment from "moment";
import Slider from "antd/lib/slider";
import AsyncSelect from "react-select/async";
import {
  AppContext,
  ErrorBoundary,
  Picker,
  Members,
  Lang,
  App,
  Auth,
  Textarea,
} from "fogito-core-ui";
import { boardMinList, getTrackColor, getTrackText } from "@actions";

import { Attachments } from "../Attachments";
import { Checklist } from "../Checklist";
import { Comments } from "../Comments";
import { Labels } from "@components";

export const General = ({ state, params, setState, setParams, onSubmit }) => {
  const { props } = React.useContext(AppContext);
  const PROJECT = App.get("PROJECT");

  const loadBoards = async (title) => {
    // let response = await boardMinList({
    //   archived: 0,
    //   skip: 0,
    //   limit: 20,
    //   title,
    // });
    // if (response?.status === "success") {
    //   return response.data?.map((item) => ({
    //     value: item.id,
    //     label: item.title,
    //   }));
    // }
  };

  const onUserToggle = async (data) => {
    if (state.employees.find((employee) => employee.id === data?.id)) {
      setState({
        employees: state.employees.filter(
          (employee) => employee.id !== data?.id
        ),
        owner: data,
      });
    } else {
      setState({
        employees: [...state.employees, data],
        owner: data,
      });
    }
  };

  const checkCompany = async (list) => {
    const lastUser = list[list.length - 1];
    const branches = state.branches.map((row) => row.id);
    if (lastUser.company && !branches.includes(lastUser.company.id)) {
      setState({
        branch: {
          id: lastUser.company.id,
          fullname: lastUser.company.title,
          ...lastUser.company,
        },
      });
    }
  };


  return (
    <ErrorBoundary>
      <div className="row">
        <div className="col-md-8">
          <form id="add-form" onSubmit={onSubmit}>
            <div className="row">
              <div className="form-group col-xl-8">
                <label>{Lang.get("TourCode")}</label>
                <input
                  className="form-control"
                  placeholder={Lang.get("Write")}
                  value={state.tourCode}
                  onChange={(e) => setState({ tourCode: e.target.value })}
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
            </div>

            <div className="form-group">
              <label>{Lang.get("Note")}</label>
              <Textarea
                rows="2"
                maxLength="1500"
                value={params.note}
                onChange={(e) => setParams({ ...params, note: e.target.value })}
                placeholder={Lang.get("Note")}
                className="form-control"
              />
              <span className="text-muted fs-12 mt-1">
                {Lang.get("MaxLength").replace(
                  "{length}",
                  1500 - params.note?.length
                )}
              </span>
            </div>

            <div className="row">
              <div className="form-group col-xl-6">
                <label>{Lang.get("ArrivalInformation")}</label>
                <Picker
                  timezones={state.timezones}
                  date={state.start_date}
                  time={state.start_time.slice(0, 5)}
                  timezone={state.start_timezone}
                  onChangeDate={(date) =>
                    setState({
                      ...state,
                      start_date: moment(
                        date !== null ? date : new Date()
                      ).format("YYYY-MM-DD"),
                      start_time:
                        state.start_date || state.start_time
                          ? state.start_time
                          : "00:00",
                    })
                  }
                  onChangeTime={(time) =>
                    setState({
                      start_date:
                        state.start_date || state.start_time
                          ? state.start_date
                          : moment(new Date()).format("YYYY-MM-DD"),
                      start_time: time,
                    })
                  }
                  onChangeToday={() => {
                    let today = new Date();
                    setState({
                      ...state,
                      start_date: moment(today).format("YYYY-MM-DD"),
                      start_time: moment(today).format("HH:mm"),
                    });
                  }}
                  onClearDate={() => setState({ start_date: "" })}
                  onClearTime={() => setState({ start_time: "" })}
                  getTimeZone={(start_timezone) => setState({ start_timezone })}
                />
              </div>
              <div className="form-group col-xl-6">
                <label>{Lang.get("DepartureInformation")}</label>
                <Picker
                  timezones={state.timezones}
                  date={state.end_date}
                  time={state.end_time.slice(0, 5)}
                  timezone={state.end_timezone}
                  onChangeDate={(date) =>
                    setState({
                      ...state,
                      end_date: moment(
                        date !== null ? date : new Date()
                      ).format("YYYY-MM-DD"),
                      end_time:
                        state.end_date || state.end_time
                          ? state.end_time
                          : "00:00",
                    })
                  }
                  onChangeTime={(time) =>
                    setState({
                      ...state,
                      end_date:
                        state.end_date || state.end_time
                          ? state.end_date
                          : moment(new Date()).format("YYYY-MM-DD"),
                      end_time: time,
                    })
                  }
                  onChangeToday={() => {
                    let today = new Date();
                    setState({
                      ...state,
                      end_date: moment(today).format("YYYY-MM-DD"),
                      end_time: moment(today).format("HH:mm"),
                    });
                  }}
                  onClearDate={() => setState({ end_date: "" })}
                  onClearTime={() => setState({ end_time: "" })}
                  getTimeZone={(end_timezone) => setState({ end_timezone })}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xl-6">
                <div className="row">
                  <div className="form-group col-xl-5">
                    <input
                      className="form-control"
                      placeholder={Lang.get("FlightNumber")}
                      value={state.FlightArriveNumber}
                      onChange={(e) =>
                        setState({ FlightArriveNumber: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group col-xl-7">
                    <AsyncSelect
                      isClearable
                      cacheOptions
                      defaultOptions
                      // value={params.board}
                      // loadOptions={loadBoards}
                      placeholder={Lang.get("Airport")}
                      onChange={(board) => setParams({ ...params, board })}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
              <div className="col-xl-6">
                <div className="row">
                  <div className="form-group col-xl-5">
                    <input
                      className="form-control"
                      placeholder={Lang.get("FlightNumber")}
                      value={state.FlightDepartureNumber}
                      onChange={(e) =>
                        setState({ FlightDepartureNumber: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group col-xl-7">
                    <AsyncSelect
                      isClearable
                      cacheOptions
                      defaultOptions
                      // value={params.board}
                      // loadOptions={loadBoards}
                      placeholder={Lang.get("Airport")}
                      onChange={(board) => setParams({ ...params, board })}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xl-6">
                <div className="row">
                  <div className="form-group col-xl-5">
                    <input
                      className="form-control"
                      placeholder={Lang.get("Days")}
                      value={state.days}
                      onChange={(e) => setState({ days: e.target.value })}
                    />
                  </div>
                  <div className="form-group col-xl-5">
                    <input
                      className="form-control"
                      placeholder={Lang.get("Nights")}
                      value={state.nights}
                      onChange={(e) => setState({ nights: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>

          <div className="form-group">
            <label>{Lang.get("Checklist")}</label>
            <Checklist {...{ params, setParams }} />
          </div>
          <Attachments {...{ setParams, params }} />
          <Comments
            {...{
              userPermissions: state.userPermissions,
              params,
              setUpdated: (updated) => setState({ updated }),
            }}
          />
        </div>
        <div className="col-md-4">
          {/* Staff */}
          <div className="form-group">
            <label>{Lang.get("Staff")}</label>
            <Members
              owner={true}
              length={3}
              target="employees"
              getAddedUsers={checkCompany}
              userListUrl="userList"
              data={props?.user?.type !== "user" ? props.user : null}
              me={state.owner?.type !== "user" ? state.owner : null}
              setParentState={setState}
              permissionsUrl="taskPermission" // this url must come from routes. (like /cards/permissions)
            />
          </div>
          {/* Partner */}
          <div className="form-group">
            <label>{Lang.get("Partner")}</label>
            <Members
              target="users"
              length={3}
              userListUrl="userList"
              getAddedUsers={checkCompany}
              getData={(users_list) => setState({ users_list })} // for used in project
              data={props?.user?.type === "user" ? props.user : null}
              me={state.owner?.type === "user" ? state.owner : null}
              setParentState={setState}
              permissionsUrl="taskPermission" // this url must come from routes. (like /cards/permissions)
            />
          </div>
          {/* Customers */}
          <div className="form-group">
            <label>{Lang.get("Customers")}</label>
            <Members
              target="users"
              length={3}
              userListUrl="userList"
              getAddedUsers={checkCompany}
              getData={(users_list) => setState({ users_list })} // for used in project
              data={props?.user?.type === "user" ? props.user : null}
              me={state.owner?.type === "user" ? state.owner : null}
              setParentState={setState}
              permissionsUrl="taskPermission" // this url must come from routes. (like /cards/permissions)
            />
          </div>
          {/* Labels */}
          {Auth.isPermitted("card_labels", "view") && (
            <Labels.Add {...{ params, setParams }} />
          )}
          <div className="form-group">
            <label>{Lang.get("Priority")}</label>
            <Slider
              min={0}
              max={10}
              trackStyle={{
                backgroundColor: getTrackColor(params.priority),
              }}
              tooltipFormatter={(value) =>
                `${getTrackText(params.priority)} (${value})`
              }
              onChange={(e) => setParams({ ...params, priority: e })}
              value={typeof params.priority === "number" ? params.priority : 0}
            />
          </div>
          {Auth.isPermitted("branches", "view") && (
            <div className="form-group">
              <label>{Lang.get("Branch")}</label>
              <Members
                permit={false}
                length={3}
                updatePermit={Auth.isPermitted("branches", "sharing")}
                toggleUrl="branches"
                userListUrl="branchesList"
                target="branches"
                me={state.branch}
                setParentState={setState}
                toggleParams={{
                  cardKey: "parent_id",
                  userKey: "branch",
                }}
              />
            </div>
          )}
          <div className="form-group">
            <label>{Lang.get("Actions")}</label>
            {/* Check button */}
            <button
              className="btn btn-block btn-secondary text-left d-flex align-items-center"
              // onClick={onStatus}
            >
              <i
                className={`feather feather-${
                  !params.completed ? "check" : "x"
                } mr-2`}
              />
              {Lang.get(`${!params.completed ? "Complete" : "UnComplete"}`)}
            </button>

            {/* Duplicate button */}
            <button
              className="btn btn-block btn-secondary text-left d-flex align-items-center"
              onClick={() => modal.show("convert")}
            >
              <i className={"feather feather-copy mr-2"} />
              {Lang.get("Duplicate")}
            </button>

            {/* Arcive button */}
            <button
              className="btn btn-block btn-secondary text-left d-flex align-items-center"
              onClick={() => onArchive(state.archived)}
            >
              <i
                className={`feather feather-${
                  state.archived ? "x" : "archive"
                } mr-2`}
              />
              {Lang.get(state.archived ? "UnArchive" : "Archive")}
            </button>

            {/* Delete button */}
            <button
              className="btn btn-block btn-secondary text-danger text-left d-flex align-items-center"
              onClick={() => onAction("delete")}
            >
              <i className={"feather feather-trash-2 mr-2"} />
              {Lang.get("Delete")}
            </button>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};
