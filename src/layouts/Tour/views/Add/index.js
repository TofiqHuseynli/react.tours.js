import React from "react";
import {
  AppContext,
  ErrorBoundary,
  Loading,
  Popup,
  Lang,
  App,
  Auth,
  Actions,
  useToast,
} from "fogito-core-ui";
import { coreTimezonesList, taskCreate, taskPermissionList } from "@actions";
import { Spinner, Tab, TabPanel, Tabs } from "@components";
import moment from "moment";
import { Accommodation, Extra, General, Transportation } from "./Components";

export const Add = React.memo(
  ({
    selectedItem = {},
    onClose,
    reload,
    selectedDates,
    clearSelectedDates = () => {},
  }) => {
    const toast = useToast();
    const { props } = React.useContext(AppContext);
    const PROJECT = App.get("PROJECT");
    const [state, setState] = React.useReducer(
      (prevState, newState) => ({ ...prevState, ...newState }),
      {
        loading: false,
        smallLoading: false,
        personType: false,
        board_loading: false,
        activeTab: "general",
        boards: [],
        permissions: [],
        defaultPermissions: {},
        timezones: [],
        selectedUser: null,
        owner: null,
        branch: null,
        start_date: selectedDates
          ? moment(selectedDates?.start).format("YYYY-MM-DD")
          : "",
        start_time: selectedDates
          ? moment(selectedDates?.start).format("HH:mm")
          : "",
        end_date: selectedDates
          ? moment(selectedDates?.end).format("YYYY-MM-DD")
          : "",
        end_time: selectedDates
          ? moment(selectedDates?.end).format("HH:mm")
          : "",
        start_timezone: Auth.get("timezone") || null,
        end_timezone: Auth.get("timezone") || null,
        users: [],
        branches: [],
        employees: [],
        users_list: {},
      }
    );

    const [params, setParams] = React.useState({
      title: selectedItem?.title || "",
      note: "",
      address: "",
      board: PROJECT ? { value: PROJECT?.id, label: PROJECT?.title } : null,
      priority: "",
      watch: 0,
      custom_permission_status: 0,
      file_ids: [],
      checklist: [],
      labels: [],
      invoice: {
        active: 0,
        items: [],
      },
      permissions: {},
      notifications: [],
      custom_notifications: [],
      planing: {},
    });

    const loadUserSettings = async () => {
      if (!params.custom_permission_status) {
        setState({ board_loading: true });
        let response = await taskPermissionList({
          board: params.board?.value || "",
        });
        if (response) {
          setState({ board_loading: false });
          if (response.status === "success") {
            let permissionModel = response.data?.reduce(
              (obj, item) => ({ ...obj, [item.key]: item.value }),
              {}
            );
            setParams({ ...params, permissions: permissionModel });
            setState({
              permissions: response.data,
              defaultPermissions: permissionModel,
            });
          }
        }
      }
    };

    const loadTimezonesList = async () => {
      let response = await coreTimezonesList({ my_timezones: true });
      if (response) {
        if (response.status === "success") {
          setState({ timezones: response.data });
        } else {
          setState({ timezones: [] });
        }
      }
    };

    const onSubmit = async (e) => {
      e.preventDefault();
      if (!state.smallLoading) {
        if (props?.check_attachments_finish === "ready") {
          setState({ smallLoading: true });
          let response = await taskCreate({
            ...params,
            invoice: {
              ...params.invoice,
              sending: {
                ...params.invoice.sending,
                date: {
                  ...params.invoice.sending?.date,
                  timezone: params.invoice.sending?.date?.timezone?.id,
                },
              },
            },
            start:
              state.start_date !== ""
                ? {
                    date: state.start_date,
                    time: !state.start_time ? "00:00" : state.start_time,
                    timezone: state.start_timezone?.id,
                  }
                : false,
            end:
              state.end_date !== ""
                ? {
                    date: state.end_date,
                    time: !state.end_time ? "00:00" : state.end_time,
                    timezone: state.end_timezone?.id,
                  }
                : false,
            users: state.users.map((item) => ({
              id: item.id,
              owner: item.owner,
              permissions: item.custom_permission ? item.permissions : false,
              custom_permission_status: item.custom_permission,
            })),
            employees: state.employees.map((item) => ({
              id: item.id,
              owner: item.owner,
              permissions: item.custom_permission ? item.permissions : false,
              custom_permission_status: item.custom_permission,
            })),
            branches: state.branches?.map((branch) => branch.id) || null,
            file_ids: params.file_ids.map((item) => item.id),
            labels: params.labels.map((item) => item.id),
            board: params.board?.value || "",
            watch: !params.watch ? 0 : 1,
          });
          if (response) {
            toast.fire({
              icon: response.status,
              title: response.description,
            });
            setState({ smallLoading: false });
            if (response.status === "success") {
              onClose();
              reload();
            }
          }
        } else {
          toast.fire({
            icon: "error",
            title: Lang.get("PleaseWaitForAttachmentsToComplete"),
          });
        }
      }
    };

    const TABS = [
      {
        key: "general",
        title: "General",
        permission: true,
        component: (
          <General
            state={state}
            params={params}
            setParams={setParams}
            setState={setState}
            onSubmit={onSubmit}
            onClose={onClose}
          />
        ),
      },
      {
        key: "address",
        title: "Address",
        permission: true,
        component: (
          <div className="form-group">
            <label>{Lang.get("Address")}</label>
            <Accommodation
              value={params.address}
              onChange={(address) =>
                setParams({
                  ...params,
                  address,
                })
              }
              placeholder={Lang.get("Address")}
            />
          </div>
        ),
      },
      {
        key: "invoice",
        title: "Invoice",
        permission: Auth.isPermitted("card_invoice", "modify") || false,
        component: (
          <Transportation
            {...{
              tab: state.activeTab,
              timezones: state.timezones,
              users: state.users_list,
              params,
              onChange: (invoice) => setParams({ ...params, invoice }),
              setParams,
            }}
          />
        ),
      },
      {
        key: "permission",
        title: "Permissions",
        permission: true,
        component: (
          <Extra
            {...{
              loading: state.board_loading,
              permissions: state.permissions,
              defaultPermissions: state.defaultPermissions,
              params,
              setParams,
              setState,
            }}
          />
        ),
      },
      // {
      //   key: "notification",
      //   title: "Notifications",
      //   permission: true,
      //   component: <Notifications {...{ params, setParams }} />,
      // },
      // {
      //   key: "planing",
      //   title: "Planing",
      //   permission: true,
      //   component: (
      //     <Planning
      //       tab={state.activeTab}
      //       getData={(planing) => setParams({ ...params, planing })}
      //     />
      //   ),
      // },
    ];

    React.useEffect(() => {
      loadTimezonesList();
    }, []);

    React.useEffect(() => {
      loadUserSettings();
    }, [params.board?.value]);

    React.useEffect(() => {
      if (props.user?.id !== Auth.get("_id")) {
        setState({
          owner: {
            ...Auth.getData(),
            id: Auth.get("_id"),
            avatar: Auth.getData()?.photo?.medium,
            owner: 1,
            permissions: null,
          },
        });
      }
      setState({
        branch: {
          ...Auth.get("company"),
          id: Auth.get("company")?.id,
          avatar: Auth.get("company")?.avatar?.medium,
          fullname: Auth.get("company")?.title,
        },
      });
    }, [props.user]);

    React.useEffect(() => {
      document.getElementById("title")?.focus();
      return () => {
        clearSelectedDates();
      };
    }, [state.loading]);

    React.useEffect(() => {
      const ids = state.users.map((user) => user.id);
      if (!ids?.includes(params.invoice.user?.id)) {
        setParams({
          ...params,
          invoice: {
            ...params.invoice,
            user: null,
          },
        });
      }
    }, [state.users]);

    return (
      <ErrorBoundary>
        <Popup
          show
          size="xl"
          onClose={() => {
            if (props?.check_attachments_finish === "ready") {
              onClose();
            } else {
              toast.fire({
                icon: "error",
                title: Lang.get("PleaseWaitForAttachmentsToComplete"),
              });
            }
          }}
          header={
            <div className="d-flex justify-content-between align-items-center w-100">
              <button
                onClick={() => {
                  if (props?.check_attachments_finish === "ready") {
                    onClose();
                  } else {
                    toast.fire({
                      icon: "error",
                      title: Lang.get("PleaseWaitForAttachmentsToComplete"),
                    });
                  }
                }}
                className="btn btn-primary"
              >
                <i className="feather feather-chevron-left" />
              </button>
              <h5 className="title fs-16">{Lang.get("Add")}</h5>
              <div>
                <button
                  form="add-form"
                  onClick={onSubmit}
                  className="btn btn-success px-4"
                >
                  {state.smallLoading ? (
                    <Spinner color="#fff" style={{ width: 30 }} />
                  ) : (
                    Lang.get("Save")
                  )}
                </button>
              </div>
            </div>
          }
        >
          <div style={{ minHeight: 400 }}>
            {/* Content */}
            <Tabs
              selectedTab={state.activeTab}
              onChange={(activeTab) => setState({ activeTab })}
            >
              {TABS.filter((tab) => !!tab.permission).map((item, index) => (
                <Tab label={item.title} value={item.key} key={index} />
              ))}
            </Tabs>
            <div className="position-relative mt-3">
              {state.loading && <Loading />}
              {TABS.filter((tab) => !!tab.permission).map((item, index) => (
                <TabPanel
                  value={state.activeTab}
                  selectedIndex={item.key}
                  key={index}
                >
                  {item.component}
                </TabPanel>
              ))}
            </div>
          </div>
        </Popup>
      </ErrorBoundary>
    );
  }
);
